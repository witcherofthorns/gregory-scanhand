<template>
    <div class="modal" @click.stop>
        <slot></slot>
    </div>
</template>

<style scoped>
.modal{
    width: 210px;
    margin: auto;
    box-sizing: border-box;
    min-width: 100px;
    min-height: 100px;
    padding: 20px;
    border-radius: 32px;
    background-color: var(--color-surface-primary-solid);
}
@media screen and (max-width: 480px) {
    .modal{
        min-width: 92%;
    }
}
</style>