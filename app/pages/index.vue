<template>
    <Label class="wrap-x3 anim-fade-in" />
    <div class="wrap-x3 index-container anim-fade-in">
        <Panel class="col gap-12 panel-padding" flex>
            <div class="col gap-6 text-block">
                <h4>Загрузите фото ладоней</h4>
                <p class="gray">Форматы: JPG/PNG · до 10 МБ на файл</p>
            </div>
            <div class="wrap-to-col gap-12">
                <Panel class="col gap-16" padding="small" flex>
                    <p class="caption gray" id="noselect">Фото левой ладони</p>
                    <div class="row gap-6">
                        <Button size="large" icon="/icons/camera.svg" text="Выбрать фото" @click="onClickInputButton('left')" flex />
                    </div>
                    <div v-if="fileLeft" class="image-preview" id="noevents">
                        <img :src="fileLeft" />
                    </div>
                    <input ref="inputFileLeft"
                        type="file"
                        accept="image/jpeg,image/png"
                        class="hidden"
                        @change="onChangeInputLeft"
                        capture
                    />
                </Panel>
                <Panel class="col gap-16" padding="small" flex>
                    <p class="caption gray" id="noselect">Фото правой ладони</p>
                    <div class="row gap-6">
                        <Button size="large" icon="/icons/camera.svg" text="Выбрать фото" @click="onClickInputButton('right')" flex />
                    </div>
                    <div v-if="fileRight" class="image-preview" id="noevents">
                        <img :src="fileRight" />
                    </div>
                    <input ref="inputFileRight"
                        type="file"
                        accept="image/jpeg,image/png"
                        class="hidden"
                        @change="onChangeInputRight"
                        capture
                    />
                </Panel>
            </div>
            <Panel class="col gap-16" padding="medium">
                <p class="caption gray" id="noselect">Тема предсказания</p>
                <Radio v-model="radioTheme" :values="predictTheme" />
            </Panel>
            <ClientOnly>
                <Panel padding="medium">
                    <Button @click="onButtonClick"
                        size="large"
                        text="Получить предсказание"
                        :disabled="!buttonAvailable"
                        flex
                    />
                </Panel>
            </ClientOnly>
        </Panel>
        <Panel flex>
            <div class="col gap-6 text-block" style="margin-bottom: 20px;">
                <h4>Вопросы и ответы</h4>
                <p class="gray">
                    Коротко о том, как работает сервис и какие фото подойдут
                    для точного чтения
                </p>
            </div>
            <div class="col gap-8" v-once>
                <Accordion v-for="value in faq"
                    :summary="value.summary"
                    :text="value.text"
                />
            </div>
        </Panel>
    </div>
    <br/><br/>
    <br/><br/>
    <br/><br/>
</template>

<script setup>
import { faq } from '~/constants/faq'
import { useAiStore } from '~/stores/ai'
import { useModalStore } from '~/stores/modal'
import { predictTheme } from '~/constants/predict.theme'
import Label from '~/components/block/Label.vue'
import Panel from '~/components/block/Panel.vue'
import Button from '~/components/ui/Button.vue'
import Radio from '~/components/ui/Radio.vue'
import Accordion from '~/components/ui/Accordion.vue'

const { createMetrika } = useYandexMetrika()
const { imageCompress } = useImageCompressor()

const aiStore = useAiStore()
const modalStore = useModalStore()
const radioTheme = ref('')
const fileLeft = ref(null)
const fileRight = ref(null)
const inputFileLeft = ref(null)
const inputFileRight = ref(null)

// left input image
async function onChangeInputLeft(e){
    const file = await imageCompress(e.target.files[0])
    const reader = new FileReader();
    reader.onload = (e) => {
        fileLeft.value = e.target.result;
    };
    reader.readAsDataURL(file);
}

// right input image
async function onChangeInputRight(e){
    const file = await imageCompress(e.target.files[0])
    const reader = new FileReader();
    reader.onload = (e) => {
        fileRight.value = e.target.result;
    };
    reader.readAsDataURL(file);
}

function onClickInputButton(side){
    side == 'left'
    ? inputFileLeft.value.click()
    : inputFileRight.value.click()
}

async function onButtonClick(e){
    aiStore.request(
        fileLeft.value,
        fileRight.value,
        radioTheme.value
    );
}

const buttonAvailable = computed(() => {
    return (fileLeft.value && fileRight.value) && radioTheme.value != '';
});

onMounted(()=>{
    import.meta.env.PROD
        ? createMetrika()
        : console.log('skip yandex-metrika')
})
</script>

<style scoped>
.index-container{
	gap: 20px;
	margin: auto;
	display: flex;
	flex-direction: row;
}
.index-container .text-block{
    margin: 0px 6px;
    margin-bottom: 16px;
}
.image-preview{
    height: fit-content;
}
.image-preview img{
    object-fit: cover;
    height: 100%;
    width: 100%;
    border-radius: 16px;
}
@media screen and (max-width: 960px) {
    .index-container{
        flex-direction: column;
    }
}
</style>