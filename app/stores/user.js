import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const useUserStore = defineStore('user', {
    state: () => ({
        id: '',
        authorized: false,
        new: false,
        balance: 0,
        new: false,
        loading: false,
    }),
    actions: {
        getFingerprint(){
            const components = [
                navigator.userAgent,
                navigator.language,
                navigator.platform,
                navigator.hardwareConcurrency,
                screen.colorDepth,
                screen.width + 'x' + screen.height,
                new Date().getTimezoneOffset(),
                !!window.sessionStorage,
                !!window.localStorage,
                !!window.indexedDB
            ].join('###');

            let salt = localStorage.getItem('userSalt');
            if(!salt){
                salt = uuidv4();
                localStorage.setItem('userSalt', salt);
            }

            // hashing
            return btoa(components + salt).replace(/[^a-zA-Z0-9]/g, '');
        },
        getDevice(){
            return {
                agent: window.navigator.userAgent,
                platform: window.navigator.platform,
                language: window.navigator.language,
                screen: `${window.screen.width}x${window.screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        },
        async welcome(){
            // try get user id auth
            const userId = localStorage.getItem('userId');

            // not found user id
            if(!userId){
                // new registrate
                const data = await this._registrate();

                // failed
                if(!data){
                    console.warn('auth: failed registrate!');
                    return false;
                }

                // set user data
                this.id = data.id;
                this.new = data.new;
                this.balance = data.balance;
                this.authorized = true;

                // cache new user id
                localStorage.setItem('userId', this.id)
                return true;
            }

            // check state
            const user = await this._fetch(userId);

            // failed user fetch data
            if(!user){
                console.warn('user: failed fetch data!');
                return false;
            }

            // set user data
            this.id = user.id;
            this.balance = user.balance;
            this.authorized = true;

            // cache new user id
            localStorage.setItem('userId', this.id)
            return true;
        },
        async update(){
            // try get user id auth
            const userId = localStorage.getItem('userId');

            if(!userId) return false;

            // check state
            const user = await this._fetch(userId);

            // failed user fetch data
            if(!user){
                console.warn('user: failed fetch data!');
                return false;
            }

            // set user data
            this.id = user.id;
            this.balance = user.balance;
            this.authorized = true;
            return true;
        },
        async _registrate(){
            // body data
            const body = {
                finger: this.getFingerprint(),
                device: this.getDevice()
            }

            // new registrate
            const response = await fetch('http://localhost:3100/api/auth', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            // if failed
            if(!response.ok){
                return null;
            }

            // return response json
            return await response.json();
        },
        async _fetch(userId){
            if(!userId) return null;

            // fetch user profile data
            const response = await fetch('http://localhost:3100/api/user', {
                method: 'GET',
                headers: {
                    User: userId
                }
            })

            // if failed
            if(!response.ok){
                return null;
            }

            // return response json
            return await response.json();
        },
    }
})