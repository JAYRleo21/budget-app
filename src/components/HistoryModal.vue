<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import { useBudgetStore } from '@/stores/budget';
import BaseModal from './BaseModal.vue';
import { PhArrowUUpLeft } from '@phosphor-icons/vue';

const props = defineProps({
  item: Object,
  isOpen: Boolean,
});

defineEmits(['close']);

const budgetStore = useBudgetStore();

const itemTransactions = computed(() => {
  if (!props.item) return [];
  return budgetStore.transactions
    .filter((t) => t.from === props.item.name || t.to === props.item.name)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const revertTransaction = (transaction) => {
  budgetStore.revertTransaction(transaction);
};
</script>

<template>
  <BaseModal :is-open="isOpen" @close="$emit('close')">
    <template #title>
      <h3>Transaction History for {{ item?.name }}</h3>
    </template>
    <template #body>
      <div class="transaction-list-wrapper">
        <div v-if="itemTransactions.length === 0" class="empty-state">
          <p>No transactions found for this item.</p>
        </div>
        <ul v-else class="transaction-list">
          <li 
            v-for="t in itemTransactions" 
            :key="t.id" 
            class="transaction-item"
          >
            <div class="transaction-details">
              <span class="transaction-date">{{ formatDate(t.date) }}</span>
              <span class="transaction-description">
                From <strong>{{ t.from }}</strong> to <strong>{{ t.to }}</strong>
              </span>
              <span class="transaction-amount">{{ formatCurrency(t.amount) }}</span>
            </div>
            <div class="transaction-actions">
              <button @click="revertTransaction(t)" class="revert-btn">
                <ph-arrow-u-up-left :size="20" />
              </button>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss">
.transaction-list-wrapper {
  min-width: 300px;
  max-width: 500px;
  max-height: 450px;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-secondary);
}

.transaction-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }
}

.transaction-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.transaction-date {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.transaction-description {
  font-size: 0.9rem;
}

.transaction-amount {
  font-size: 1rem;
  font-weight: 600;
}

.revert-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: .25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #d32f2f;
  }
}
</style>
