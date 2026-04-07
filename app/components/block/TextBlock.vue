<template>
    <div class="text-block" :class="[{ 'border-top': props.borderTop },{ 'border-bottom': props.borderBottom }]">
        <div class="container">
            <h4>{{ props.title }}</h4>
            <p class="gray">{{ props.text }}</p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    text: String,
    borderTop: Boolean,
    borderBottom: Boolean
})
</script>

<style scoped>
.text-block{
    display: flex;
    flex-direction: column;
    height: fit-content;
    padding: 20px 0px;
    box-sizing: border-box;
}
.text-block .container{
    display: flex;
    gap: 12px;
    flex-direction: column;
    margin: 0px 12px;
}
.text-block.border-top{
    border-top: 1px solid var(--color-gray-light);
}
.text-block.border-bottom{
    border-bottom: 1px solid var(--color-gray-light);
}
</style>