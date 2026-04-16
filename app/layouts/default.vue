<template>
    <div>
        <Header>
            <template #buttons>
                <Button v-if="aiStore.result"
                    :icon="aiResultIcon"
                    @click="aiStore.modalOpen"
                />
                <Button v-if="userStore.authorized"
                    icon="/icons/stars_solid.png"
                    :text="userStore.balance"
                    @click="paymentStore.modalOpen"
                />
                <Button v-else
                    disabled
                    icon="/icons/stars_solid.png"
                />
            </template>
        </Header>
        <slot />
    </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue';
import Header from '~/components/block/Header.vue';

const paymentStore = usePaymentStore()
const userStore = useUserStore();
const aiStore = useAiStore();

const aiResultIcon = computed(() => {
    switch(aiStore.result.result.status){
        case 'ok': return '/icons/check.png';
        case 'reshot': return '/icons/unavailable.png';
    }
})
</script>