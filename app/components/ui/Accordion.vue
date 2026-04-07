<template>
    <details class="accordion">
        <summary id="noselect">{{ props.summary }}</summary>
        <div class="accordion-body">
            <p>{{ props.text }}</p>
        </div>
    </details>
</template>

<script setup>
const props = defineProps({
    summary: String,
    text: String
})
</script>

<style scoped>
.accordion{
    border-radius: 26px;
    border: 1px solid;
    overflow: hidden;
    opacity: 0.7;
    border-color: rgba(255,255,255,.10);
    background: rgba(0,0,0,.18);
}
.accordion:hover{
    opacity: 1.0;
}
.accordion[open]{
    opacity: 1.0;
    border-color: var(--color-border-accent);
}
.accordion summary{
    cursor: pointer;
    list-style: none;
    padding: 16px 24px;
    font-weight: 800;
    color: rgba(233,232,228,.92);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}
.accordion[open] summary{
    color: var(--color-text-accent);
}
.accordion-body{
    padding: 0 24px 18px 24px;
}
.accordion summary::after{
    content: "＋";
    color: var(--color-text-accent);
    font-weight: 900;
}
</style>