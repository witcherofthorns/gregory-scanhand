<template>
    <Modal class="reshot">
        <div class="container">
            <h5 class="accent">Фото неподходит</h5>
            <p class="gray" style="text-align: center;">К сожалению, мы вынуждены попросить вас сделать фото повторно, так как ваши отпрвленные фото плохого качества или размыты</p>
        </div>
        <div class="col gap-8">
            <Button
                text="Понятно"
                @click="emits('close')"
                size="large"
                flex
            />
        </div>
    </Modal>
</template>

<script setup>
import Modal from '../ui/Modal.vue';
import Button from '../ui/Button.vue';


const emits = defineEmits(['update:modelValue', 'close', 'changed']);
// const props = defineProps({
//     current: Number
// });
</script>

<style scoped>
.reshot{
    width: 290px;
}
.reshot .container{
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 42px;
}
.reshot .info{
    display: flex;
    gap: 20px;
    flex-direction: column;
    text-align: center;
}
</style>