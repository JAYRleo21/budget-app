<script setup>
import { ref, defineEmits, defineProps } from 'vue';
import BaseModal from './BaseModal.vue';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'submit']);
const amount = ref(0);

const submitAmount = () => {
  emit('submit', amount.value);
  amount.value = 0;
};
</script>

<template>
  <BaseModal :is-open="isOpen" @close="$emit('close')">
    <template #header>
      <h2>Ingresar Monto</h2>
    </template>
    <form @submit.prevent="submitAmount">
      <div class="form-group">
        <label for="transfer-amount">Monto a transferir</label>
        <input type="number" id="transfer-amount" v-model.number="amount" required autofocus>
      </div>
    </form>
    <template #footer>
      <button @click="$emit('close')" class="btn-secondary">Cancelar</button>
      <button @click="submitAmount" class="btn-primary">Aceptar</button>
    </template>
  </BaseModal>
</template>
