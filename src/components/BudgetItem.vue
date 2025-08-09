<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
import useLongPress from '@/composables/useLongPress';
import { PhPencil, PhTrash, PhWallet, PhBank, PhReceipt } from '@phosphor-icons/vue';

const props = defineProps({
  item: Object,
});

const emit = defineEmits(['edit', 'delete', 'show-history']);

const showActions = ref(false);
let leaveTimer = null;

const onLongPressCallback = () => {
  showActions.value = true;
};

const { start, cancel, isLongPress } = useLongPress(onLongPressCallback, 500);

const handleClick = () => {
  console.log('handleClick', isLongPress.value);
  if (isLongPress.value) {
    return;
  }
  emit('show-history', props.item);
};

const handlePressStart = (event) => {
  start(event);
  cancelLeaveTimer();
};

const handlePressEnd = () => {
  cancel();
};

const startLeaveTimer = () => {
  clearTimeout(leaveTimer);
  leaveTimer = setTimeout(() => {
    showActions.value = false;
  }, 2000);
};

const cancelLeaveTimer = () => {
  clearTimeout(leaveTimer);
};

const onEdit = () => {
  emit('edit', props.item);
  showActions.value = false;
};

const onDelete = () => {
  emit('delete', props.item);
  showActions.value = false;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const itemIcon = computed(() => {
  if (props.item.icon) {
    const iconName = props.item.icon.toLowerCase();
    if (iconName.includes('wallet')) return PhWallet;
    if (iconName.includes('bank')) return PhBank;
    if (iconName.includes('receipt')) return PhReceipt;
  }
  return PhWallet;
});

</script>

<template>
  <li 
    class="budget-item" 
    @mousedown="handlePressStart"
    @mouseup="handlePressEnd"
    @touchstart="handlePressStart"
    @touchend="handlePressEnd"
    @click.stop="handleClick"
    @mouseleave="startLeaveTimer"
    @mouseenter="cancelLeaveTimer"
    @blur="showActions = false"
    tabindex="0"
  >
    <span class="item-name">{{ item.name }}</span>
    <div class="icon-container">
      <div class="item-icon">
        <component :is="itemIcon" :size="32" :color="item.color || 'var(--text-color-primary)'" />
      </div>
      <div class="item-actions" :class="{ 'is-visible': showActions }">
        <button @click.stop="onEdit" class="action-btn edit-btn"><ph-pencil :size="20" color="white" /></button>
        <button @click.stop="onDelete" class="action-btn delete-btn"><ph-trash :size="20" color="white" /></button>
      </div>
    </div>
    <span class="item-amount">{{ formatCurrency(item.amount) }}</span>
  </li>
</template>

<style lang="scss">
.budget-item {
  list-style: none;
  cursor: grab;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 60px;
  
  &:active {
    cursor: grabbing;
  }

  &:focus {
    outline: none;
  }
}

.item-name {
  font-size: 10px;
  color: var(--text-color-secondary);
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.icon-container {
  position: relative;
  width: 60px;
  height: 60px;
}

.item-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.budget-item:hover .item-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.item-amount {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color-primary);
}

.item-actions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;

  &.is-visible {
    opacity: 1;
    pointer-events: auto;
  }

  .action-btn {
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.edit-btn {
      color: #fbc02d;
    }
    &.delete-btn {
      color: #e53935;
    }
  }
}
</style>


