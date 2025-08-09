<script setup>
import { useBudgetStore } from '@/stores/budget';

const budgetStore = useBudgetStore();

const exportData = (format) => {
  const data = {
    incomes: budgetStore.incomes,
    accounts: budgetStore.accounts,
    expenses: budgetStore.expenses,
    transactions: budgetStore.transactions,
  };

  if (format === 'json') {
    exportJson(data);
  } else if (format === 'csv') {
    exportCsv(data);
  }
};

const exportJson = (data) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  downloadFile(url, 'budget-data.json');
};

const exportCsv = (data) => {
  let csvContent = '';

  // Add incomes
  csvContent += 'Incomes\n';
  csvContent += 'ID,Name,Amount\n';
  data.incomes.forEach(item => {
    csvContent += `${item.id},${item.name},${item.amount}\n`;
  });
  csvContent += '\n';

  // Add accounts
  csvContent += 'Accounts\n';
  csvContent += 'ID,Name,Amount,Include in Balance\n';
  data.accounts.forEach(item => {
    csvContent += `${item.id},${item.name},${item.amount},${item.includeInBalance}\n`;
  });
  csvContent += '\n';

  // Add expenses
  csvContent += 'Expenses\n';
  csvContent += 'ID,Name,Amount\n';
  data.expenses.forEach(item => {
    csvContent += `${item.id},${item.name},${item.amount}\n`;
  });
  csvContent += '\n';

  // Add transactions
  csvContent += 'Transactions\n';
  csvContent += 'ID,From,To,Amount,Date\n';
  data.transactions.forEach(item => {
    csvContent += `${item.id},${item.from},${item.to},${item.amount},${item.date}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  downloadFile(url, 'budget-data.csv');
};

const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
</script>

<template>
  <div class="export-view">
    <h1>Export Data</h1>
    <p>Download your budget data in JSON or CSV format.</p>
    <div class="export-actions">
      <button @click="exportData('json')" class="export-btn json-btn">
        Export to JSON
      </button>
      <button @click="exportData('csv')" class="export-btn csv-btn">
        Export to CSV
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.export-view {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  text-align: center;
}

.export-actions {
  display: flex;
  gap: 1rem;
}

.export-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  color: white;

  &.json-btn {
    background-color: #0288d1;
  }

  &.csv-btn {
    background-color: #4caf50;
  }

  &:hover {
    transform: translateY(-2px);
  }
}
</style>