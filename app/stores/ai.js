import { defineStore } from 'pinia'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const useAiStore = defineStore('ai', {
    state: () => ({
        loading: false,
        result: null,
        resultId: null
    }),
    actions: {
        base64ToBlob(base64, mimeType) {
            const byteCharacters = atob(base64.split(',')[1] || base64);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: mimeType });
        },
        async welcome(){
            await this.fetchLast();
        },
        async fetchLast(){
            const userStore = useUserStore()

            // request
            const response = await fetch('/api/request', {
                headers: { 'User': userStore.id }
            })
            
            // if failed status
            if(!response.ok){
                return false
            }

            // no content, skip that
            if(response.status == 204){
                this.result = null
                return true
            }

            // parse data
            const data = await response.json();
            if(!data){
                this.result = null
                return false
            }

            // check current task id
            if(data.task && this.resultId){
                if(this.resultId == data.task){
                    this.result = data
                    this.resultId = null

                    // try open modal
                    this.modalOpen();
                    return true
                }

                this.result = null
                return true
            }

            // if waiting current request/task id
            if(this.resultId){
                this.result = null
                return true
            }

            this.result = data
            return true
        },
        async request(leftFile, rightFile, theme){
            try{
                const userStore = useUserStore();
                const modalStore = useModalStore()

                // request
                const response = await fetch('/api/request', {
                    method: 'POST',
                    headers: {
                        'User': userStore.id,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ theme })
                });

                // bad request
                if(!response.ok){
                    return false;
                }

                // if forward response
                if(response.status == 200){
                    const { status } = await response.json();

                    // status no credits
                    if(status == "no credits"){
                        modalStore.open('text', {
                            skipable: true,
                            title: 'Нет кредитов',
                            text: 'Кажется, у вас закончились кредиты. Для продолжения использования сервиса, полните ваш счёт',
                            buttonClose: true,
                            buttonCloseText: 'Понятно'
                        })
                    }

                    // status no credits
                    if(status == "processing"){
                        modalStore.open('text', {
                            skipable: true,
                            title: 'Ожидайте',
                            text: 'Вы уже отправили свои фото для предсказания, дождитесь резульатат, обычно это может занимать от 10 до 30 секунд',
                            buttonClose: true,
                            buttonCloseText: 'Хорошо'
                        })
                    }

                    return true;
                }

                // wait only 201 status
                if(response.status != 201){
                    return false;
                }
            
                const { id } = await response.json();
            
                const uploadFile = async (side, file) => {
                    const formData = new FormData();
                        if (typeof file === 'string') {
                            const blob = this.base64ToBlob(file, 'image/jpeg');
                            formData.append('file', blob, `${side}.jpg`);
                        }
                        else {
                            // Если file это File объект
                            formData.append('file', file);
                        }
                
                    return await fetch(`/api/request/upload/${id}/${side}`, {
                        method: 'POST',
                        headers: { 'User': userStore.id },
                        body: formData
                    });
                };
            
                const [leftOk, rightOk] = await Promise.all([
                    uploadFile('left', leftFile),
                    uploadFile('right', rightFile)
                ]);

                // if success
                if(leftOk.ok && rightOk.ok){
                    this.result = null;

                    // show modal
                    modalStore.open('text', {
                        skipable: true,
                        title: 'Отправлено',
                        text: 'Совсем скоро начнём предсказание но ваши ладоням! Дождидесь результата, обычно это занимает не больше 10-30 секунд',
                        buttonClose: true,
                        buttonCloseText: 'Хорошо'
                    })

                    // set wait id
                    // that task id
                    this.resultId = id;

                    return true;
                }
            
                return false;
            }
            catch(error){
                console.log('request: failed send images: ', error)
                return false;
            }
        },
        modalOpen(){
            const modalStore = useModalStore()

            if(this.result.status != "completed") return

            // status ok
            if(this.result.result.status == "ok"){
                modalStore.open('result', {
                    skipable: false,
                    content: this.result.result.content
                });
            }
            
            // status reshot
            if(this.result.result.status == "reshot"){
                modalStore.open('text', {
                    skipable: false,
                    title: 'Фото неподходит',
                    text: 'К сожалению, мы вынуждены попросить вас сделать фото повторно, так как ваши отпрвленные фото плохого качества или размыты',
                    buttonClose: true,
                    buttonCloseText: 'Закрыть'
                });
            }
        }
    }
})