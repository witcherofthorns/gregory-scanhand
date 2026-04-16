import { defineStore } from 'pinia';

export const useModalStore = defineStore('modals', {
    state: () => ({
        queue: []
    }),
    actions: {
        open(type, data = { skipable: true }, callback = null) {
            this.queue.push({ type, data, callback });
        },
        closeCurrent() {
            if (this.queue.length > 0) {
                this.queue.shift();
            }
        },
        closeAll() {
            this.queue = [];
        },
        update(newData) {
            if (this.queue.length > 0) {
                this.queue[0].data = newData;
            }
        }
    },
    getters: {
        current: (state) => {
            return state.queue[0] || null;
        },
        has: (state) => {
            return state.queue.length > 0;
        },
    },
});