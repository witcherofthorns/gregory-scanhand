<template>
    <Modal>
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
</style>