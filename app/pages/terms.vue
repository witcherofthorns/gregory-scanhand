<template>
    <div class="terms-container wrap-x2 anim-fade-in">
        <Panel class="col gap-8" mobile>
            <div class="header">
                <h2>Условия использования</h2>
                <p class="accent">scanhand.ru</p>
            </div>
            <TextBlock v-for="(value, index) in terms"
                :title="value.title"
                :text="value.text"
                :border-top="index == 0"
                :border-bottom="index < terms.length - 1"
            />
        </Panel>
        <div style="height: 128px;" />
    </div>
</template>

<script setup>
import { terms } from '~/constants/terms'
import Panel from '~/components/block/Panel.vue'
import TextBlock from '~/components/block/TextBlock.vue'
</script>

<style scoped>
.terms-container{
	margin: auto;
	flex-direction: column;
    box-sizing: border-box;
    padding-top: 20px;
}
.terms-container .header{
    display: flex;
    gap: 6px;
    flex-direction: column;
    margin: 8px 12px;
    padding-bottom: 16px;
}
</style>