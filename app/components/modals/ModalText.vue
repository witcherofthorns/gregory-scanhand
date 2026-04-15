<template>
    <Modal class="text">
        <div class="container">
            <h5 class="accent">{{ props.title }}</h5>
            <p class="gray" style="text-align: center;">{{ props.text }}</p>
        </div>
        <div class="col gap-8">
            <Button v-if="props.buttonAccept"
                :text="props.buttonAcceptText"
                @click="emits('accept')"
                size="large"
                flex
            />
            <Button v-if="props.buttonClose"
                :text="props.buttonCloseText"
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

const emits = defineEmits(['update:modelValue', 'accept', 'close']);
const props = defineProps({
    title: String,
    text: String,
    buttonAccept: Boolean,
    buttonClose: Boolean,
    buttonAcceptText: {
        type: String,
        default: 'Ok'
    },
    buttonCloseText: {
        type: String,
        default: 'Close'
    }
});
</script>

<style scoped>
.text{
    width: 290px;
}
.text .container{
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 42px;
}
</style>