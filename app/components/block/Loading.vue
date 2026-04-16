<template>
    <div class="spinner-container">
        <div class="spinner" :class="props.size">

        </div>
        <p class="spinner-text">{{ props.text}}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    text: String,
    size: String
})
</script>

<style scoped>
.spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 40px 20px;
}
.spinner {
    border: 3px solid #f3f4f618;
    border-top: 3px solid var(--color-border-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    min-height: 36px;
    min-width: 36px;
}
.spinner.small {
    width: 24px;
    height: 24px;
    border-width: 2px;
}
.spinner.medium {
    width: 40px;
    height: 40px;
    border-width: 3px;
}
.spinner.large {
    width: 60px;
    height: 60px;
    border-width: 4px;
}
.spinner-text {
    color: #939baa;
    font-size: 15px;
    margin: 0;
    animation: pulse 1.5s ease-in-out infinite;
}
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
@keyframes pulse {
    0%,
    100% {
        opacity: 0.6;
    }
    50% {
        opacity: 1;
    }
}
</style>