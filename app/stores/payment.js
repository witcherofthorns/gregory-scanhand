import { defineStore } from 'pinia'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const usePaymentStore = defineStore('payment', {
    state: () => ({
        current: {
            amount: 0,
            status: 'none',
            link: null
        },
        timeout: null,
        checking: false
    }),
    actions: {
        async welcome(){
            this.current = null;
            this.checking = false;
        },
        async create(){
            const userStore = useUserStore();

            // reset by default
            clearTimeout(this.current);
            this.current = null;
            this.timeout = null;

            // if user not authorized
            if(!userStore.authorized){
                return false;
            }

            // create payment
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    User: userStore.id
                }
            })

            // failed create payment
            if(!response.ok){
                return false;
            }

            // parse response json data
            const data = await response.json();
            this.current = {
                amount: data.amount,
                status: data.status,
                link: data.link
            }

            // timeout
            this.timeout = setTimeout(() => {
                this.current = null
            }, 60000)

            return true;
        },
        async check(){
            const userStore = useUserStore();

            if(this.checking){
                return true;
            }

            if(!userStore.authorized){
                return false;
            }

            this.checking = true;

            const response = await fetch('/api/payment/waits', {
                method: 'GET',
                headers: {
                    User: userStore.id
                }
            })

            if(!response.ok){
                this.checking = false;
                return false
            }

            if(response.status == 204){
                this.checking = false;
                return true;
            }

            const data = await response.json();

            for(let i = 0; i < data.length; i++){
                const payment =  await fetch(`/api/payment/status/${data[i].paymentId}`, {
                    method: 'GET',
                    headers: {
                        User: userStore.id
                    }
                })
                // console.log(`payment: check ${data[i].paymentId}`)
                await delay(1000);
            }

            this.checking = false;
        }
    }
})