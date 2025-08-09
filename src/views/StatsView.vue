<script setup>
import { ref, computed } from 'vue';
import { useBudgetStore } from '@/stores/budget';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const budgetStore = useBudgetStore();

const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const selectedMonth = ref(new Date().getMonth()); // 0-indexed

const availableYears = computed(() => {
  const years = new Set();
  budgetStore.transactions.forEach(t => {
    years.add(new Date(t.date).getFullYear());
  });
  return Array.from(years).sort((a, b) => b - a);
});

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const filteredExpenses = computed(() => {
  return budgetStore.transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const isExpense = budgetStore.expenses.some(e => e.name === t.to);
    return (
      isExpense &&
      transactionDate.getFullYear() === selectedYear.value &&
      transactionDate.getMonth() === selectedMonth.value
    );
  });
});

const expenseChartData = computed(() => {
  const expenseTotals = {};
  filteredExpenses.value.forEach(t => {
    if (!expenseTotals[t.to]) {
      expenseTotals[t.to] = 0;
    }
    expenseTotals[t.to] += t.amount;
  });

  const labels = Object.keys(expenseTotals);
  const data = Object.values(expenseTotals);

  return {
    labels,
    datasets: [
      {
        backgroundColor: [
          '#41B883', '#E46651', '#00D8FF', '#DD1B16', '#FBC02D',
          '#3F51B5', '#9C27B0', '#009688', '#FF9800', '#795548'
        ],
        data,
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

const totalMonthExpense = computed(() => {
  return filteredExpenses.value.reduce((total, t) => total + t.amount, 0);
});

</script>

<template>
  <div class="stats-view">
    <h1>Estadísticas de Gastos</h1>

    <div class="filters">
      <div class="filter-group">
        <label for="year-select">Año:</label>
        <select id="year-select" v-model="selectedYear">
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label for="month-select">Mes:</label>
        <select id="month-select" v-model="selectedMonth">
          <option v-for="(month, index) in months" :key="index" :value="index">
            {{ month }}
          </option>
        </select>
      </div>
    </div>

    <div class="chart-wrapper">
      <div class="chart-container">
      <div v-if="filteredExpenses.length > 0" class="chart-wrapper">
        <Pie :data="expenseChartData" :options="chartOptions" />
      </div>
      <div v-else class="empty-state">
        <p>No hay datos de gastos para el período seleccionado.</p>
      </div>
    </div>
    <p v-if="filteredExpenses.length > 0" class="total-expense">
      Total Gastado: {{ formatCurrency(totalMonthExpense) }}
    </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stats-view {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

h1 {
  text-align: center;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  label {
    font-weight: 500;
  }

  select {
    padding: 0.5rem;
    border-radius: .25rem;
    border: 1px solid var(--border-color);
    background-color: var(--surface-color);
    color: var(--text-color-primary);
  }
}

.chart-wrapper {
  position: relative;
}

.chart-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: .25rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-color-secondary);
}

.total-expense {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 1.5rem;
}
</style>
