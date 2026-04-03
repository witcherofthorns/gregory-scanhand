import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server'
import { cache } from '../../services/cache';

export const GET: APIRoute = async ({ url, request }) => {
    const sheet = url.searchParams.get('source');
    const skip = url.searchParams.get('skip') || '0';
    const limit = url.searchParams.get('limit') || '10';
    const id = url.searchParams.get('id');

    const blogUrl = getSecret("SKANHAND_BLOG_URL");

    if(!blogUrl){
        return new Response(
            JSON.stringify({ error: 'Временно не работает' }),
            { status: 400 }
        );
    }

    if(!sheet){
        return new Response(
            JSON.stringify({ error: 'Не удалось получить список постов' }),
            { status: 400 }
        );
    }

    // Ключ кеша
    const cacheKey = id ? `${sheet}_${id}` : `${sheet}_${skip}-${limit}`;

    // Если в кеше есть
    // даём ответ из кеша
    if(cache.has(cacheKey)){
        return new Response(cache.get(cacheKey), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=60'
            }
        });
    }

    // Собираем URL
    const googleSheetsUrl = new URL(blogUrl);

    if (id) {
        googleSheetsUrl.searchParams.set('sheet', sheet);
        googleSheetsUrl.searchParams.set('id', id);
    }
    else{
        googleSheetsUrl.searchParams.set('sheet', sheet);
        googleSheetsUrl.searchParams.set('skip', skip);
        googleSheetsUrl.searchParams.set('limit', limit);
    }

    try {
        // Делаем запрос
        const response = await fetch(googleSheetsUrl.toString(),{
            // Запрос долгий, дожидаемся 15 сек
            signal: AbortSignal.timeout(15000) 
        });

        if(!response.ok){
            throw new Error(`Произошла ошибка: ${response.status}`);
        }

        const data = await response.json();
        const value = JSON.stringify(data);

        // Кешируем (5 мин)
        cache.set(cacheKey, value, 300);

        // Ответ 
        return new Response(value, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=60'
            }
        });

    } catch (error) {
        console.error('Ошибка при запроса', error);
        return new Response(
            JSON.stringify({
                error: 'Не удалось загрузить посты',
                details: error instanceof Error ? error.message : 'Unknown error'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};