import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const useAiStore = defineStore('ai', {
    state: () => ({
        loading: false,
        result: null
    }),
    actions: {
        async request(leftFile, rightFile, theme){
            const userStorage = useUserStore();
            const userId = userStorage.id;

            if(this.result){
                this.result = null;
            }

            const formData = new FormData();
            formData.append("left", leftFile);
            formData.append("right", rightFile);
            formData.append("theme", theme);

            console.log(theme);

            this.loading = true;

            // new request
            const response = await fetch('/api/request', {
                method: 'POST',
                body: formData,
                headers: {
                    User: userId
                }
            })

            // if failed
            if(!response.ok){
                this.loading = false;
                return false;
            }

            // parse response data
            // set result data, if not null
            if(response.body){
                const data = await response.json();
                if(data){
                    this.result = data;
                }
            }

            this.loading = false;

            return true;

            /*
            await delay(3000);
            const ipsum = "Lorem Ipsum is simply dummy text"
            this.result = {
                status: "ok",
                content: {
                    overview: ipsum,
                    life_line: ipsum,
                    heart_line: ipsum,
                    head_line: ipsum,
                    fate_line: ipsum,
                    summary: ipsum
                }
            }
            */
        }
    }
})