<script setup>
import { ref } from 'vue';
import { useBudgetStore } from '@/stores/budget';
import { VueDraggableNext } from 'vue-draggable-next';
import ItemFormModal from '@/components/ItemFormModal.vue';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue';
import AmountModal from '@/components/AmountModal.vue';
import HistoryModal from '@/components/HistoryModal.vue';
import { PhPlus } from '@phosphor-icons/vue';
import BudgetItem from '@/components/BudgetItem.vue';

const budgetStore = useBudgetStore();

// Modal States
const isFormModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isAmountModalOpen = ref(false);
const isHistoryModalOpen = ref(false);

// Modal Data
const modalItemType = ref('');
const editableItem = ref(null);
const itemToDelete = ref(null);
const itemForHistory = ref(null);
const transferData = ref(null);

// --- Drag and Drop Logic ---
const onEnd = (evt) => {
  // Hide the clone that vue-draggable-next creates
  if (evt.clone) {
    evt.clone.style.display = 'none';
  }
  
  // Find the element under the drop position
  const dropTargetElement = document.elementFromPoint(evt.originalEvent.clientX, evt.originalEvent.clientY);
  const targetItemElement = dropTargetElement ? dropTargetElement.closest('.budget-item') : null;

  if (targetItemElement) {
    const fromItemId = evt.item.dataset.id;
    const toItemId = targetItemElement.dataset.id;

    if (fromItemId === toItemId) return;

    const { item: fromItem, type: fromItemType } = findItemAndType(fromItemId);
    const { item: toItem, type: toItemType } = findItemAndType(toItemId);

    if (fromItem && toItem) {
      const isValidTransfer = 
        (fromItemType === 'incomes' && toItemType === 'accounts') ||
        (fromItemType === 'accounts' && toItemType === 'expenses');

      if (isValidTransfer) {
        transferData.value = { from: fromItem, to: toItem };
        isAmountModalOpen.value = true;
      }
    }
  }
};

const baseDragOptions = {
  animation: 200,
  ghostClass: 'ghost',
  sort: false,
};

const incomesDragOptions = {
  ...baseDragOptions,
  group: { name: 'budget', pull: 'clone', put: false },
};

const accountsDragOptions = {
  ...baseDragOptions,
  group: { name: 'budget', pull: 'clone', put: false },
};

const expensesDragOptions = {
  ...baseDragOptions,
  group: { name: 'budget', pull: false, put: false }, // Cannot be dragged
};

// --- CRUD Modal Logic ---
const openFormModal = (type, item = null) => {
  modalItemType.value = type;
  editableItem.value = item ? { ...item } : null;
  isFormModalOpen.value = true;
};

const openDeleteModal = (type, item) => {
  modalItemType.value = type;
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const openHistoryModal = (item) => {
  console.log('openHistoryModal$', item, item.id);
  itemForHistory.value = item;
  isHistoryModalOpen.value = true;
};

const saveItem = (item) => {
  if (item.id) {
    budgetStore.updateItem(modalItemType.value, item);
  } else {
    const action = `add${modalItemType.value.charAt(0).toUpperCase() + modalItemType.value.slice(1)}`;
    budgetStore[action](item);
  }
  isFormModalOpen.value = false;
};

const confirmDeleteItem = () => {
  budgetStore.deleteItem(modalItemType.value, itemToDelete.value.id);
  isDeleteModalOpen.value = false;
};

const findItemAndType = (itemId) => {
  const id = Number(itemId);
  let item = budgetStore.incomes.find(i => i.id === id);
  if (item) return { item, type: 'incomes' };

  item = budgetStore.accounts.find(i => i.id === id);
  if (item) return { item, type: 'accounts' };
  
  item = budgetStore.expenses.find(i => i.id === id);
  if (item) return { item, type: 'expenses' };

  return { item: null, type: null };
};

const handleTransfer = (amount) => {
  if (amount > 0 && transferData.value) {
    budgetStore.transfer(transferData.value.from, transferData.value.to, amount);
  }
  isAmountModalOpen.value = false;
  transferData.value = null;
};

</script>

<template>
  <div class="home-view">
    <div class="sections-container">
      <section class="budget-section">
        <h2 class="section-title">Ingresos</h2>
        <vue-draggable-next v-model="budgetStore.incomes" item-key="id" v-bind="incomesDragOptions" tag="ul" class="item-list" data-id="incomes" @end="onEnd">
          <BudgetItem v-for="item in budgetStore.incomes" :key="item.id" :item="item" :data-id="item.id" @edit="openFormModal('income', $event)" @delete="openDeleteModal('income', $event)" @show-history="openHistoryModal" />
          <div v-if="budgetStore.incomes.length === 0" class="empty-list-message">
            No hay ingresos
          </div>
        </vue-draggable-next>
        <button class="add-button" @click="openFormModal('income')">
          <ph-plus :size="16" weight="bold" />
          <span>Agregar Ingreso</span>
        </button>
      </section>

      <section class="budget-section">
        <h2 class="section-title">Cuentas</h2>
        <vue-draggable-next v-model="budgetStore.accounts" item-key="id" v-bind="accountsDragOptions" tag="ul" class="item-list" data-id="accounts" @end="onEnd">
          <BudgetItem v-for="item in budgetStore.accounts" :key="item.id" :item="item" :data-id="item.id" @edit="openFormModal('account', $event)" @delete="openDeleteModal('account', $event)" @show-history="openHistoryModal" />
          <div v-if="budgetStore.accounts.length === 0" class="empty-list-message">
            No hay cuentas
          </div>
        </vue-draggable-next>
        <button class="add-button" @click="openFormModal('account')">
          <ph-plus :size="16" weight="bold" />
          <span>Agregar Cuenta</span>
        </button>
      </section>

      <section class="budget-section">
        <h2 class="section-title">Gastos</h2>
        <vue-draggable-next v-model="budgetStore.expenses" item-key="id" v-bind="expensesDragOptions" tag="ul" class="item-list" data-id="expenses">
          <BudgetItem v-for="item in budgetStore.expenses" :key="item.id" :item="item" :data-id="item.id" @edit="openFormModal('expense', $event)" @delete="openDeleteModal('expense', $event)" @show-history="openHistoryModal" />
          <div v-if="budgetStore.expenses.length === 0" class="empty-list-message">
            No hay gastos
          </div>
        </vue-draggable-next>
        <button class="add-button" @click="openFormModal('expense')">
          <ph-plus :size="16" weight="bold" />
          <span>Agregar Gasto</span>
        </button>
      </section>
    </div>

    <!-- Modals -->
    <ItemFormModal :is-open="isFormModalOpen" :item-type="modalItemType" :item="editableItem" @close="isFormModalOpen = false" @save="saveItem" />
    <ConfirmDeleteModal :is-open="isDeleteModalOpen" :item="itemToDelete" @close="isDeleteModalOpen = false" @confirm="confirmDeleteItem" />
    <AmountModal :is-open="isAmountModalOpen" @close="isAmountModalOpen = false" @submit="handleTransfer" />
    <HistoryModal :is-open="isHistoryModalOpen" :item="itemForHistory" @close="isHistoryModalOpen = false" />
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  height: 100%;
}

.sections-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  height: 100%;
}

.budget-section {
  background-color: var(--surface-color);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem;
  overflow: hidden;
}

.section-title {
  padding: 0 1rem 1rem;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  color: var(--text-color-primary);
  border-bottom: 1px solid var(--border-color);
}

.item-list {
  list-style: none;
  padding: 1rem 0.5rem;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-content: flex-start;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 3px;
  }
}

.empty-list-message {
  width: 100%;
  text-align: center;
  color: var(--text-color-secondary);
  padding: 2rem;
}

.add-button {
  width: calc(100% - 2rem);
  margin: 1rem auto 0;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: var(--primary-color-dark);
  }
}

.ghost {
  opacity: 0.5;
  background: var(--primary-color-dark);
}
</style>


