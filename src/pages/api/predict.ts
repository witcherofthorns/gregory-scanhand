import type { APIRoute } from 'astro'
import { getSecret } from 'astro:env/server'
import { promtSystem } from '../../data/promt';

export const POST: APIRoute = async ({ request }) => {
    try {
        // Получаем данные от клиента
        const formData = await request.formData();
        const leftHand = formData.get('leftHand') as File;
        const rightHand = formData.get('rightHand') as File;
        const theme = formData.get('theme') as string;

        // OpenAI proxy url
        const openaiUrl = getSecret("SKANHAND_OPENAI_URL");
        const openaiToken = getSecret("SKANHAND_OPENAI_API_KEY");

        // Валидация
        if(!openaiUrl || !openaiToken){
            return new Response(
                JSON.stringify({ error: 'Временно не работает' }),
                { status: 400 }
            );
        }

        if (!leftHand || !rightHand) {
            return new Response(
                JSON.stringify({ error: 'Пожалуйста, загрузите обе фотографии ладоней' }),
                { status: 400 }
            );
        }

        if (!theme) {
            return new Response(
                JSON.stringify({ error: 'Пожалуйста, выберите тему гадания' }),
                { status: 400 }
            );
        }

        // Конвертируем файлы в base64 для OpenAI Vision API
        const leftHandBase64 = await fileToBase64(leftHand);
        const rightHandBase64 = await fileToBase64(rightHand);

        // Тематические промпты
        const themePrompts = {
            general: 'Общее предсказание судьбы и жизненного пути',
            love: 'Предсказание о любви, отношениях и сердечных делах',
            work: 'Предсказание о карьере, работе и финансовом успехе',
            health: 'Предсказание о здоровье и жизненной энергии'
        };

        const userPrompt = `Проанализируй фотографии левой и правой ладони. 
            Тема предсказания/гадания: ${themePrompts[theme as keyof typeof themePrompts] || themePrompts.general}    
            Пожалуйста, дай подробное предсказание, учитывая форму руки, основные линии (жизни, ума, сердца, судьбы), 
            их длину, глубину и пересечения.`;

        // Запрос к OpenAI Vision API
        const response = await fetch(`${openaiUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getSecret("SKANHAND_OPENAI_API_KEY")}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: promtSystem
                    },
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: userPrompt },
                            {
                                type: 'image_url',
                                image_url: { url: leftHandBase64, detail: 'high' }
                            },
                            {
                                type: 'image_url',
                                image_url: { url: rightHandBase64, detail: 'high' }
                            }
                        ]
                    }
                ],
                temperature: 0.8,
                max_tokens: 800
            })
        });

        // Ошибка от сервера
        if(!response.ok){
            const error = await response.json();
            console.error('OpenAI API Error:', error);
            throw new Error('Ошибка при обращении к OpenAI API');
        }

        // Достаём ответ
        const data = await response.json();
        const result = data.choices[0].message.content;

        // Финальный ответ
        return new Response(
            result,
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    }
    catch (error) {
        return new Response(
            JSON.stringify({ error: 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.' }),
            { status: 500 }
        );
    }

};

// Вспомогательная функция для конвертации File в base64
async function fileToBase64(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    return `data:${file.type};base64,${base64}`;
}