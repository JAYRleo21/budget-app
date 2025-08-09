<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <header class="modal-header">
        <slot name="header">Default Header</slot>
        <button @click="closeModal" class="close-button">&times;</button>
      </header>
      <main class="modal-body">
        <slot name="body"></slot>
        <slot></slot>
      </main>
      <footer class="modal-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<style lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: .25rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  h2 {
    margin: 0;
    font-size: 1.25rem;
  }
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--text-color);
}

.modal-body {
  margin-bottom: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);

  button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: .25rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: white;
    &:hover {
      background-color: var(--primary-color-dark);
    }
  }

  .btn-secondary {
    background-color: var(--surface-color);
    color: var(--text-color-primary);
    border: 1px solid var(--border-color);
    &:hover {
      background-color: var(--background-color);
    }
  }
}

.form-group input{
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: .25rem;
  background-color: var(--background-color);
  color: var(--text-color-primary);
  font-size: 1rem;
}

</style>
