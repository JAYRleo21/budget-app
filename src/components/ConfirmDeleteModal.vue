<script setup>
import BaseModal from './BaseModal.vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  item: Object,
});

const emit = defineEmits(['close', 'confirm']);
</script>

<template>
  <BaseModal :is-open="isOpen" @close="$emit('close')">
    <template #header>
      <h2>Confirmar Eliminación</h2>
    </template>
    <p v-if="item">
      ¿Estás seguro de que quieres eliminar <strong>{{ item.name }}</strong>?
    </p>
    <template #footer>
      <button @click="$emit('close')" class="btn-secondary">Cancelar</button>
      <button @click="$emit('confirm', item)" class="btn-danger">Eliminar</button>
    </template>
  </BaseModal>
</template>

<style lang="scss">
.modal-footer {
  .btn-danger {
    background-color: #e53935;
    color: white;
    &:hover {
      background-color: #c62828;
    }
  }
}
</style>
