import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useIndexedDB } from '@/composables/useIndexedDB';

const incomesDB = useIndexedDB('incomes');
const accountsDB = useIndexedDB('accounts');
const expensesDB = useIndexedDB('expenses');
const transactionsDB = useIndexedDB('transactions');

export const useBudgetStore = defineStore('budget', () => {
  // State
  const incomes = ref([]);
  const accounts = ref([]);
  const expenses = ref([]);
  const transactions = ref([]);

  // Getters
  const balance = computed(() => {
    return accounts.value
      .filter(acc => acc.includeInBalance)
      .reduce((total, acc) => total + acc.amount, 0);
  });

  const totalExpenses = computed(() => {
    return expenses.value.reduce((total, exp) => total + exp.amount, 0);
  });

  // Actions
  async function init() {
    incomes.value = await incomesDB.getAll();
    accounts.value = await accountsDB.getAll();
    expenses.value = await expensesDB.getAll();
    transactions.value = await transactionsDB.getAll();
  }

  async function addIncome(income) {
    const newIncome = { id: Date.now(), ...income, amount: Number(income.amount) || 0, type: 'income' };
    await incomesDB.add(newIncome);
    incomes.value.push(newIncome);
  }

  async function addAccount(account) {
    const newAccount = { id: Date.now(), ...account, amount: Number(account.amount) || 0, type: 'account' };
    await accountsDB.add(newAccount);
    accounts.value.push(newAccount);
  }

  async function addExpense(expense) {
    const newExpense = { id: Date.now(), ...expense, amount: Number(expense.amount) || 0, type: 'expense' };
    await expensesDB.add(newExpense);
    expenses.value.push(newExpense);
  }

  async function updateItem(itemType, updatedItem) {
    const db = getDB(itemType);
    await db.put(updatedItem);
    
    const list = getList(itemType);
    const index = list.value.findIndex(i => i.id === updatedItem.id);
    if (index !== -1) {
      list.value[index] = updatedItem;
    }
  }

  async function deleteItem(itemType, itemId) {
    const db = getDB(itemType);
    await db.remove(itemId);

    const list = getList(itemType);
    list.value = list.value.filter(i => i.id !== itemId);
  }

  async function transfer(from, to, amount) {
    const fromItemType = getItemType(from.id);
    const toItemType = getItemType(to.id);

    if (!fromItemType || !toItemType) return;

    const updatedFrom = { ...from, amount: from.amount - amount };
    const updatedTo = { ...to, amount: to.amount + amount };

    await updateItem(fromItemType, updatedFrom);
    await updateItem(toItemType, updatedTo);

    const transaction = {
      id: Date.now(),
      from: from.name,
      to: to.name,
      amount,
      date: new Date().toISOString(),
    };
    await transactionsDB.add(transaction);
    transactions.value.push(transaction);
  }

  function getItemType(itemId) {
    if (incomes.value.some(i => i.id === itemId)) return 'income';
    if (accounts.value.some(a => a.id === itemId)) return 'account';
    if (expenses.value.some(e => e.id === itemId)) return 'expense';
    return null;
  }

  function getList(itemType) {
    if (itemType === 'income') return incomes;
    if (itemType === 'account') return accounts;
    if (itemType === 'expense') return expenses;
  }

  function getDB(itemType) {
    if (itemType === 'income') return incomesDB;
    if (itemType === 'account') return accountsDB;
    if (itemType === 'expense') return expensesDB;
  }

  function getItemByName(name) {
    const allItems = [...incomes.value, ...accounts.value, ...expenses.value];
    return allItems.find(item => item.name === name);
  }

  async function revertTransaction(transaction) {
    const fromItem = getItemByName(transaction.from);
    const toItem = getItemByName(transaction.to);

    if (!fromItem || !toItem) {
      console.error('Could not find items for transaction', transaction);
      return;
    }

    const fromItemType = getItemType(fromItem.id);
    const toItemType = getItemType(toItem.id);

    const updatedFrom = { ...fromItem, amount: fromItem.amount + transaction.amount };
    const updatedTo = { ...toItem, amount: toItem.amount - transaction.amount };

    await updateItem(fromItemType, updatedFrom);
    await updateItem(toItemType, updatedTo);

    await transactionsDB.remove(transaction.id);
    transactions.value = transactions.value.filter(t => t.id !== transaction.id);
  }

  return {
    incomes,
    accounts,
    expenses,
    transactions,
    balance,
    totalExpenses,
    init,
    addIncome,
    addAccount,
    addExpense,
    updateItem,
    deleteItem,
    transfer,
    revertTransaction,
  };
});
