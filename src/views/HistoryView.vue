<script setup>
import { computed } from 'vue';
import { useBudgetStore } from '@/stores/budget';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const budgetStore = useBudgetStore();

const transactions = computed(() => budgetStore.transactions);

const accountDepositTransactions = computed(() =>
  transactions.value.filter(t => {
    const toItem = budgetStore.getItemByName(t.to);
    return toItem?.type === 'account';
  })
);

const expenseTransactions = computed(() =>
  transactions.value.filter(t => {
    const toItem = budgetStore.getItemByName(t.to);
    return toItem?.type === 'expense';
  })
);

const accountDepositStats = computed(() => {
  const amounts = accountDepositTransactions.value.map(t => t.amount);
  if (amounts.length === 0) return { min: 0, max: 0, avg: 0 };
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  const avg = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
  return { min, max, avg };
});

const expenseStats = computed(() => {
  const amounts = expenseTransactions.value.map(t => t.amount);
  if (amounts.length === 0) return { min: 0, max: 0, avg: 0 };
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  const avg = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
  return { min, max, avg };
});

const monthlyData = computed(() => {
  const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' }));
  const depositsByMonth = Array(12).fill(0);
  const expenseByMonth = Array(12).fill(0);

  transactions.value.forEach(t => {
    const month = new Date(t.date).getMonth();
    const toItem = budgetStore.getItemByName(t.to);

    console.log('toItem$', toItem);
    if (toItem?.type === 'account') {
      depositsByMonth[month] += t.amount;
    } else if (toItem?.type === 'expense') {
      expenseByMonth[month] += t.amount;
    }
  });

  return {
    labels: months,
    datasets: [
      {
        label: 'Ingresos',
        backgroundColor: '#4caf50',
        borderColor: '#4caf50',
        data: depositsByMonth,
      },
      {
        label: 'Gastos',
        backgroundColor: '#f44336',
        borderColor: '#f44336',
        data: expenseByMonth,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};
</script>

<template>
  <div class="history-view">
    <h1>Historia</h1>

    <section class="stats-summary">
      <div class="stat-card">
        <h2>Ingresos</h2>
        <p><strong>Min:</strong> {{ formatCurrency(accountDepositStats.min) }}</p>
        <p><strong>Max:</strong> {{ formatCurrency(accountDepositStats.max) }}</p>
        <p><strong>Prom:</strong> {{ formatCurrency(accountDepositStats.avg) }}</p>
      </div>
      <div class="stat-card">
        <h2>Gastos</h2>
        <p><strong>Min:</strong> {{ formatCurrency(expenseStats.min) }}</p>
        <p><strong>Max:</strong> {{ formatCurrency(expenseStats.max) }}</p>
        <p><strong>Prom:</strong> {{ formatCurrency(expenseStats.avg) }}</p>
      </div>
    </section>

    <section class="chart-line-container">
      <h2>Ingresos vs Gastos por mes</h2>
      <Line :data="monthlyData" :options="chartOptions" />
    </section>
  </div>
</template>

<style lang="scss">
.history-view {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-summary {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 200px;
  padding: 1rem;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: .25rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  h2 {
    margin-top: 0;
    font-size: 1.2rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }
}

.chart-line-container {
  height: 400px;
  padding: 1rem;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: .25rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>
