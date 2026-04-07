<template>
    <section :class="['panel', props.padding, { flex: props.flex }, { mobile: props.mobile }]">
        <slot />
    </section>
</template>

<script setup>
const props = defineProps({
    flex: Boolean,
    mobile: Boolean,
    padding: {
        type: String,
        default: 'medium'
    }
})
</script>

<style scoped>
.panel{
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid var(--color-border);
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
    overflow: hidden;
    box-sizing: border-box;
    border-radius: 32px;
}
.panel.flex{
    flex: 1;
}
.panel.small{
    padding: 18px 18px;
}
.panel.medium{
    padding: 24px 24px;
}
.panel.large{
    padding: 32px 32px;
}
.panel.mobile{

}
@media (max-width: 768px) {
    .panel.mobile {
        background: none;
        border: 0;
        box-shadow: none;
        overflow: hidden;
        border-radius: 0;
        padding: 8px;
    }
}
</style>