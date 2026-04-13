<template>
    <Modal class="result" :class="{
            content: aiStore.result && aiStore.result.status == 'ok',
            reshot: aiStore.result && aiStore.result.status == 'reshot'
        }">
        <div v-if="aiStore.result && aiStore.result.status == 'ok'" class="container">
            <Button icon="/icons/close.png" style="position: absolute; right: 20px; top: 20px;" @click="emits('close')"/>
            <div style="min-height: 12px;" />
            <div class="col gap-12">
                <h4 class="accent">Обзор</h4>
                <p>{{ aiStore.result.content.overview }}</p>
            </div>
            <div class="col gap-12">
                <h4 class="accent">Линия Жизни</h4>
                <p>{{ aiStore.result.content.life_line }}</p>
            </div>
            <div class="col gap-12">
                <h4 class="accent">Линия Сердца</h4>
                <p>{{ aiStore.result.content.heart_line }}</p>
            </div>
            <div class="col gap-12">
                <h4 class="accent">Линия Личности</h4>
                <p>{{ aiStore.result.content.head_line }}</p>
            </div>
            <div class="col gap-12">
                <h4 class="accent">Линия Судьбы</h4>
                <p>{{ aiStore.result.content.fate_line }}</p>
            </div>
            <div class="col gap-12">
                <h4 class="accent">Вывод</h4>
                <p>{{ aiStore.result.content.summary }}</p>
            </div>
            <div style="min-height: 128px;" />
        </div>
        <div v-else-if="aiStore.result && aiStore.result.status == 'reshot'" class="col gap-26">
            <div class="col gap-12" style="padding: 8px;">
                <h4>Фото не подходит</h4>
                <p class="gray">К сожалению, мы вынуждены вас попросить сделать по новой фото ваших рук</p>
            </div>
            <Button size="large" text="Понятно" flex  @click="emits('close')" />
        </div>
        <div v-else-if="aiStore.result && aiStore.result.status == 'no credits'" class="col gap-26" style="padding: 20px;">
            <div class="col gap-12" style="padding: 8px;">
                <h4>Нет кредитов</h4>
                <p class="gray">Кажется, у вас не достаточно кредитов. Для этого действия необходим 1 кредит. Пополнить кредиты можно с помощью кнопки сверху в виде звёздочек</p>
            </div>
            <Button size="large" text="Понятно" flex  @click="emits('close')" />
        </div>
        <div v-else-if="aiStore.loading">
            <Loading text="Делаем предсказание" />
        </div>
        <div v-else class="col gap-26" style="padding: 20px;">
            <div class="col gap-12" style="padding: 8px;">
                <h4>Ошибка</h4>
                <p class="gray">Кажется, что-то сломалось. Мы уже пытаемся это исправить</p>
            </div>
            <Button size="large" text="Понятно" flex  @click="emits('close')" />
        </div>
    </Modal>
</template>

<script setup>
import Loading from '../block/Loading.vue';
import Modal from '../ui/Modal.vue';
import Button from '../ui/Button.vue';

const aiStore = useAiStore()

const emits = defineEmits(['update:modelValue', 'close', 'changed']);
</script>


<style scoped>
.result{
    width: 450px;
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
.result.reshot{
    width: 350px;
    padding: 20px;
}
</style>