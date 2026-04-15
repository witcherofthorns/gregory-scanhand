<template>
    <div>
        <Header>
            <template #buttons>
                <Button v-if="aiStore.result"
                    :icon="aiResultIcon"
                    @click="onClickRequest"
                />
                <Button v-if="userStore.authorized"
                    icon="/icons/stars_solid.png"
                    :text="userStore.balance"
                    @click="onClickPayment"
                />
                <Button v-else
                    disabled
                    icon="/icons/stars_solid.png"
                    text=""
                />
            </template>
        </Header>
        <slot />
    </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue';
import Header from '~/components/block/Header.vue';

const modalStore = useModalStore();
const userStore = useUserStore();
const aiStore = useAiStore();

const aiResultIcon = computed(() => {
    switch(aiStore.result.result.status){
        case 'ok': return '/icons/check.png';
        case 'reshot': return '/icons/unavailable.png';
    }
})

function onClickPayment(e){
    modalStore.open('payment', {
        skipable: true,
        current: userStore.balance
    });
}

function onClickRequest(){
    if(aiStore.result.status != "completed") return

    // status ok
    if(aiStore.result.result.status == "ok"){
        modalStore.open('result', {
            skipable: false,
            content: aiStore.result.result.content
        });
    }
    // status reshot
    if(aiStore.result.result.status == "reshot"){
        modalStore.open('text', {
            skipable: true,
            title: 'Фото неподходит',
            text: 'К сожалению, мы вынуждены попросить вас сделать фото повторно, так как ваши отпрвленные фото плохого качества или размыты',
            buttonClose: true,
            buttonCloseText: 'Закрыть'
        });
    }
}
</script>