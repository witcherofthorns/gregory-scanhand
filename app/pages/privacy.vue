<template>
    <div class="policy-container wrap-x2 anim-fade-in">
        <Panel class="col gap-8" mobile>
            <div class="header">
                <h2>Политика конфиденциальности</h2>
                <p class="accent">scanhand.ru</p>
            </div>
            <TextBlock v-for="(value, index) in privacy"
                :title="value.title"
                :text="value.text"
                :border-top="index == 0"
                :border-bottom="index < privacy.length - 1"
            />
        </Panel>
        <div style="height: 128px;" />
    </div>
</template>

<script setup>
import { privacy } from '~/constants/privacy'
import Panel from '~/components/block/Panel.vue'
import TextBlock from '~/components/block/TextBlock.vue'
</script>

<style scoped>
.policy-container{
	margin: auto;
	flex-direction: column;
    box-sizing: border-box;
    padding-top: 20px;
}
.policy-container .header{
    display: flex;
    gap: 6px;
    flex-direction: column;
    margin: 8px 12px;
    padding-bottom: 16px;
}
</style>