<script setup>
import { ref, watch, defineProps, defineEmits, computed } from 'vue';
import BaseModal from './BaseModal.vue';
import { 
  PhWallet, PhBank, PhReceipt, PhGift, PhShoppingCart, PhStorefront, 
  PhCreditCard, PhCoins, PhPiggyBank, PhMoney, PhChartLine, PhChartBar, 
  PhTag, PhTicket, PhHouse, PhCar, PhAirplane, PhTrain, PhCoffee, 
  PhForkKnife, PhTShirt, PhGameController, PhBookOpen, PhFirstAidKit, PhGraduationCap 
} from '@phosphor-icons/vue';

const props = defineProps({
  isOpen: Boolean,
  item: Object,
  itemType: String,
});

const emit = defineEmits(['close', 'save']);

const availableIcons = [
  { name: 'Wallet', component: PhWallet },
  { name: 'Bank', component: PhBank },
  { name: 'Receipt', component: PhReceipt },
  { name: 'Gift', component: PhGift },
  { name: 'ShoppingCart', component: PhShoppingCart },
  { name: 'Storefront', component: PhStorefront },
  { name: 'CreditCard', component: PhCreditCard },
  { name: 'Coins', component: PhCoins },
  { name: 'PiggyBank', component: PhPiggyBank },
  { name: 'Money', component: PhMoney },
  { name: 'ChartLine', component: PhChartLine },
  { name: 'ChartBar', component: PhChartBar },
  { name: 'Tag', component: PhTag },
  { name: 'Ticket', component: PhTicket },
  { name: 'House', component: PhHouse },
  { name: 'Car', component: PhCar },
  { name: 'Airplane', component: PhAirplane },
  { name: 'Train', component: PhTrain },
  { name: 'Coffee', component: PhCoffee },
  { name: 'ForkKnife', component: PhForkKnife },
  { name: 'TShirt', component: PhTShirt },
  { name: 'GameController', component: PhGameController },
  { name: 'BookOpen', component: PhBookOpen },
  { name: 'FirstAidKit', component: PhFirstAidKit },
  { name: 'GraduationCap', component: PhGraduationCap },
];

const form = ref({
  name: '',
  amount: 0,
  icon: 'Wallet',
  includeInBalance: true,
});

watch(() => props.item, (newItem) => {
  if (newItem) {
    form.value = { ...newItem };
  } else {
    form.value = {
      name: '',
      amount: 0,
      icon: 'Wallet',
      includeInBalance: props.itemType === 'account',
    };
  }
});

const save = () => {
  emit('save', { ...form.value });
  emit('close');
};

const title = computed(() => `${props.item ? 'Editar' : 'Agregar'} ${props.itemType}`);

</script>

<template>
  <BaseModal :is-open="isOpen" @close="$emit('close')">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <form @submit.prevent="save" class="item-form">
      <div class="form-group">
        <label for="name">Nombre</label>
        <input type="text" id="name" v-model="form.name" required>
      </div>
      <div class="form-group">
        <label for="amount">Monto</label>
        <input type="number" id="amount" v-model.number="form.amount">
      </div>
      <div class="form-group">
        <label>Icono</label>
        <div class="icon-selector">
          <button 
            type="button"
            v-for="icon in availableIcons" 
            :key="icon.name"
            class="icon-option"
            :class="{ 'is-selected': form.icon === icon.name }"
            @click="form.icon = icon.name"
            :title="icon.name"
          >
            <component :is="icon.component" :size="24" />
          </button>
        </div>
      </div>
      <div class="form-group" v-if="itemType === 'account'">
        <label class="checkbox-label">
          <input type="checkbox" v-model="form.includeInBalance">
          Incluir en el balance
        </label>
      </div>
    </form>
    <template #footer>
      <button @click="$emit('close')" class="btn-secondary">Cancelar</button>
      <button @click="save" class="btn-primary">Guardar</button>
    </template>
  </BaseModal>
</template>

<style lang="scss">
.item-form {
  .form-group {
    margin-bottom: 1.5rem;
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-color-secondary);
    }
    input[type="text"], input[type="number"] {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      background-color: var(--background-color);
      color: var(--text-color-primary);
      font-size: 1rem;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
}

.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  max-height: 180px; // Allow for ~3 rows of icons
  overflow-y: auto;
  padding: 0.5rem;
  background-color: var(--background-color);
  border-radius: 8px;
}

.icon-option {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-color-secondary);
  transition: all 0.2s;
  flex-shrink: 0;

  &.is-selected {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }

  &:hover:not(.is-selected) {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}
</style>
