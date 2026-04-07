<template>
    <button :disabled="props.disabled" :class="[props.size, { flex: props.flex }]">
        <img v-if="props.icon" :src="props.icon" class="icon" />
        <p class="button">{{ props.text }}</p>
    </button>
</template>

<script setup>
const props = defineProps({
    size: {
        type: String,
        default: 'medium'
    },
    flex: Boolean,
    icon: String,
    text: String,
    disabled: Boolean
})
</script>

<style scoped>
button{
    cursor: pointer;
    margin: 0;
    border-radius: 36px;
    font: var(--font-button);
    color: var(--color-text);
    background: var(--color-surface-primary);
    box-sizing: border-box;
    border: 1px solid;
    border-color: var(--color-border);
    transition: 0.4s border-color ease, 0.4s color ease;
}
button.medium{
    height: 40px;
    min-height: 40px;
    padding: 0px 16px;
}
button.large{
    height: 50px;
    min-height: 50px;
    padding: 0px 20px;
}
button:disabled{
    cursor: default;
    opacity: 0.3;
}
button:hover:not(:disabled){
    border-color: var(--color-border-accent);
}
button:hover p{
    color: var(--color-border-accent);
}
button:has(img.icon){
    display: flex;
    gap: 16px;
    flex-direction: row;
    align-items: center;
}
button .icon{
    width: 18px;
    height: 18px;
}
button.icon{
    width: 40px;
    padding: 0;
}
button.icon .icon{
    margin: auto;
}
button.flex{
    flex: 1;
    width: 100%;
}
</style>