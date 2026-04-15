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
const aiStore = useAiStore();

const loopSeconds = 20;
let loopInterval = null;

function onLoop(){
    paymentStore.check();
    userStore.update();
    aiStore.fetchLast();
}

async function onWelcome(){
    console.log('welcome')
    await userStore.welcome();
    await paymentStore.welcome();
    await aiStore.welcome();
}

// only client mode
onMounted(async ()=>{
    setTimeout(onWelcome, 1000)
    loopInterval = setInterval(onLoop, loopSeconds * 1000);
})
onUnmounted(()=>{
    clearInterval(loopInterval);
    loopInterval = null;
})
</script>