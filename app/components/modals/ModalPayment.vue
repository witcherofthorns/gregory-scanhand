<template>
    <Modal class="payment">
        <div class="container">
            <h1 class="number-current" :class="{ accent: props.current > 0, gray: props.current == 0 }">{{ props.current }}</h1>
            <div class="info">
                <p class="subtitle bold">Ваш баланс</p>
                <p class="gray">Кредиты позволяют вам делать предсказания</p>
            </div>
        </div>
        <div class="col gap-8">
            <a v-if="paymentStore.current"
                :href="paymentStore.current.link"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Button :text="`Перейти к оплате`" size="large" flex />
            </a>
            <Button
                :text="`Пополнить за ${props.price}Р`"
                :disabled="paymentStore.current"
                @click="onClickPayment"
                size="large"
                flex
            />
        </div>
    </Modal>
</template>

<script setup>
import Modal from '../ui/Modal.vue';
import Button from '../ui/Button.vue';

const paymentStore = usePaymentStore();

const emits = defineEmits(['update:modelValue', 'close', 'changed']);
const props = defineProps({
    current: Number,
    price: {
        type: Number,
        default: 100
    }
});

async function onClickPayment(e){
    if(paymentStore.current) return;

    // payment create
    const result = await paymentStore.create();
    if(!result){
        return;
    }

    // timeout delay
    setTimeout(()=>{
        window.open(paymentStore.current.link, '_blank');
    }, 1000);
}
</script>

<style scoped>
.payment{
    width: 290px;
}
.payment .container{
    display: flex;
    flex-direction: column;
    gap: 26px;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 36px;
}
.payment .info{
    display: flex;
    gap: 6px;
    flex-direction: column;
    text-align: center;
}
.payment .number-current{
    line-height: 0.8;
    font-size: 68px;
    height: 76px;
}
</style>