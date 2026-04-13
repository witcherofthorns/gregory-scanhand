<template>
    <div ref="modalsDiv" id="modals" @click="closeBackdrop" style="display: none;">
        <div ref="modalsBackdrop" class="backdrop" />
        <Transition name="t-fade-slide">
            <ModalPayment
                v-if="modalCurrent?.type === 'payment'"
                v-bind="modalCurrent.data"
                v-model="modalCurrent.data.modelValue"
                @accept="acceptCallback"
                @cancel="cancelCallback"
                @close="closeCallback"
            />
            <ModalResult
                v-else-if="modalCurrent?.type === 'result'"
                v-bind="modalCurrent.data"
                v-model="modalCurrent.data.modelValue"
                @accept="acceptCallback"
                @cancel="cancelCallback"
                @close="closeCallback"
            />
        </Transition>
    </div>
</template>

<script setup>
import { watch, computed, onMounted, ref } from 'vue';
import { useModalStore } from '~/stores/modal';
import ModalPayment from '../modals/ModalPayment.vue';
import ModalResult from '../modals/ModalResult.vue';

const modalStore = useModalStore();
const modalsDiv = ref(null);
const modalsBackdrop = ref(null);
const modalCurrent = computed(() => modalStore.current);

// callback accept
function acceptCallback(value){
    modalCurrent.value.result = value;
    if(modalCurrent.value.callback && modalCurrent.value.callback.accept){
        modalCurrent.value.callback.accept(modalCurrent.value.result);
    }
    modalStore.closeCurrent();
}

// callback cancel
function cancelCallback(value){
    modalCurrent.value.result = value;
    if(modalCurrent.value.callback && modalCurrent.value.callback.cancel){
        modalCurrent.value.callback.cancel(modalCurrent.value.result);
    }
    modalStore.closeCurrent();
}

// callback close
function closeCallback(){
    if(modalCurrent.value.callback && modalCurrent.value.callback.close){
        modalCurrent.value.callback.close();
    }
    modalStore.closeCurrent();
}

// animation handle
function animationStart(){}
function animationEnd(){
    if(!modalCurrent.value) modalsDiv.value.style.display = 'none';
}

function closeBackdrop(e){
    if(modalCurrent.value && modalCurrent.value.data){
        if(modalCurrent.value.data.skipable){
            closeCallback()
        }
    }
}

onMounted(()=>{
    modalsDiv.value.style.display = modalCurrent.value ? null : 'none';
    modalsDiv.value.onanimationstart = animationStart;
    modalsDiv.value.onanimationend = animationEnd;
});

watch(modalCurrent, (newModal, oldModal) => {
    if(!newModal){
        modalsBackdrop.value.style.animation = 'fade-out 0.4s';
        document.body.removeAttribute('style');
        modalsDiv.value.style.display = null;
        modalsDiv.value.style.pointerEvents = 'none';
        return;
    }
    if(!oldModal){
        modalsDiv.value.style.display = null;
        modalsBackdrop.value.style.animation = 'fade-in 0.4s';
        document.body.style.overflow = 'hidden';
        modalsDiv.value.style.pointerEvents = 'visible';
        return;
    }
});
</script>

<style scoped>
#modals{
    display: flex;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    overflow: hidden;
    z-index: 2;
}
.backdrop{
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
}
</style>

<style>
@keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
}
@keyframes fade-out {
    0% { opacity: 1; }
    100% { opacity: 0; }
}
@keyframes fade-loop {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
}
</style>