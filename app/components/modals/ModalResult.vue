<template>
    <Modal class="result">
        <div class="container">
            <Button
                icon="/icons/close.png"
                style="position: absolute; right: 20px; top: 20px;"
                @click="emits('close')"
            />
            <div style="min-height: 12px;" />
            <div class="col gap-12">
                <h4 class="accent">Обзор</h4>
                <p>{{ props.content.overview }}</p>
            </div>
            <div class="col gap-12">
                <h4 class="accent">Линия Жизни</h4>
                <p>{{ props.content.life_line }}</p>
            </div>
            <div class="col gap-12">
                <h4 class="accent">Линия Сердца</h4>
                <p>{{ props.content.heart_line }}</p>
            </div>
            <div class="col gap-12">
                <h4 class="accent">Линия Личности</h4>
                <p>{{ props.content.head_line }}</p>
            </div>
            <div class="col gap-12">
                <h4 class="accent">Линия Судьбы</h4>
                <p>{{ props.content.fate_line }}</p>
            </div>
            <div class="col gap-12">
                <h4 class="accent">Вывод</h4>
                <p>{{ props.content.summary }}</p>
            </div>
            <div style="min-height: 128px;" />
        </div>
    </Modal>
</template>

<script setup>
import Modal from '../ui/Modal.vue';
import Button from '../ui/Button.vue';


const emits = defineEmits(['update:modelValue', 'close', 'changed']);
const props = defineProps({
    content: Object
});
</script>

<style scoped>
.result{
    width: 450px;
    height: 90%;
    padding: 0;
    position: relative;
}
.result .container{
    display: flex;
    flex-direction: column;
    gap: 32px;
    height: 100%;
    overflow: auto;
    padding: 0px 32px;
    box-sizing: border-box;
}
.result.content{
    height: 85%;
}
</style>