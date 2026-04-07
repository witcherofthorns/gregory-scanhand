<template>
    <div class="radio-group" :id="id">
        <label v-for="(data, index) in values" :key="index">
            <input type="radio" name="theme"
                :value="data.value"
                :checked="modelValue === data.value"
                @change="updateValue(data.value)"
            />
            <span id="noselect">{{ data.label }}</span>
        </label>
    </div>
</template>

<script setup>
defineProps({
    id: {
        type: String,
        required: true
    },
    values: {
        type: Array,
        required: true,
        default: () => []
    },
    modelValue: {
        type: [String, Number],
        default: null
    }
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (value) => {
    emit('update:modelValue', value)
}
</script>

<style scoped>
.radio-group {
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr 1fr;
}
.radio-group label {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    margin: 0;
    padding: 0px 20px;
    height: 50px;
    min-height: 40px;
    border-radius: 32px;
    font: var(--font-button);
    color: var(--color-text);
    background: var(--color-surface-primary);
    box-sizing: border-box;
    border: 1px solid;
    border-color: var(--color-border);
    transition: 0.4s border-color ease, 0.4s color ease;
}
.radio-group input[type="radio"] {
    margin: 0;
    opacity: 0.1;
    width: 16px;
    height: 16px;
    accent-color: var(--color-border-accent);
}
.radio-group input[type="radio"]:hover {
    opacity: 0.2;
}
.radio-group input[type="radio"]:checked {
    opacity: 1.0;
    outline: none;
    box-shadow: none;
}
.radio-group input[type="radio"]:focus {
    outline: none;
    box-shadow: none;
}
.radio-group label:has(input[type="radio"]:checked) {
    border-color: var(--color-border-accent);
    background: var(--gradinet-accent);
}
.radio-group label:has(input[type="radio"]:checked) span {
    color: var(--color-text-accent);
}
</style>