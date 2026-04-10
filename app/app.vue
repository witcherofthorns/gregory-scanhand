<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <GlobalModals />
</template>

<script setup>
import GlobalModals from './components/global/GlobalModals.vue';

const paymentStore = usePaymentStore();
const userStore = useUserStore();

const loopSeconds = 15;
let loopInterval = null;

function onLoop(){
    paymentStore.check();
    userStore.update();
}

// only client mode
onMounted(()=>{
    paymentStore.welcome();
    userStore.welcome();
    loopInterval = setInterval(onLoop, loopSeconds * 1000);
})
onUnmounted(()=>{
    clearInterval(loopInterval);
    loopInterval = null;
})
</script>