import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useIndexedDB } from '@/composables/useIndexedDB';

const settingsDB = useIndexedDB('settings');

export const useSettingsStore = defineStore('settings', () => {
  const currencySymbol = ref('$');

  async function init() {
    const savedSymbol = await settingsDB.get('currencySymbol');
    if (savedSymbol) {
      currencySymbol.value = savedSymbol;
    }
  }

  async function setCurrencySymbol(newSymbol) {
    currencySymbol.value = newSymbol;
    await settingsDB.put(newSymbol, 'currencySymbol');
  }

  return {
    currencySymbol,
    init,
    setCurrencySymbol,
  };
});
