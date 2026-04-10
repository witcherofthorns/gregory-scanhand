<template>
    <div>
        <Header>
            <template #buttons>
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

function onClickPayment(e){
    modalStore.open('payment', {
        skipable: true,
        current: userStore.balance
    });
}
</script>