<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBudgetStore } from '@/stores/budget';
import HomeView from '@/views/HomeView.vue';
import StatsView from '@/views/StatsView.vue';
import SettingsView from '@/views/SettingsView.vue';
import HistoryView from '@/views/HistoryView.vue';
import ExportDataView from '@/views/ExportDataView.vue';
import { PhList, PhSun, PhMoon, PhHouse } from '@phosphor-icons/vue';

const budgetStore = useBudgetStore();
const isMenuOpen = ref(false);
const isDarkMode = ref(true); // Default to dark mode

const views = {
  HomeView,
  StatsView,
  SettingsView,
  HistoryView,
  ExportDataView,
};
const currentView = ref('HomeView');

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const balance = computed(() => formatCurrency(budgetStore.balance));

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const navigate = (viewName) => {
  currentView.value = viewName;
  isMenuOpen.value = false;
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light');
};

onMounted(() => {
  budgetStore.init();
  document.documentElement.setAttribute('data-theme', 'dark');
});
</script>

<template>
  <div id="app-container" :class="{ 'menu-open': isMenuOpen }">
    <div class="menu-overlay" v-if="isMenuOpen" @click="toggleMenu"></div>
    
    <header class="app-header">
      <button @click="toggleMenu" class="menu-button">
        <ph-list :size="28" />
      </button>
      <div class="balance-indicator">
        <span>Balance</span>
        <strong>{{ balance }}</strong>
      </div>
      <div class="balance-indicator">
        <span>Gastos</span>
        <strong>{{ formatCurrency(budgetStore.totalExpenses) }}</strong>
      </div>
      <button @click="toggleTheme" class="theme-button">
        <ph-moon v-if="isDarkMode" :size="24" />
        <ph-sun v-else :size="24" />
      </button>
    </header>

    <aside class="side-menu" :class="{ 'is-open': isMenuOpen }">
      <nav>
        <ul>
          <li><a href="#" @click.prevent="navigate('HomeView')">Inicio</a></li>
          <li><a href="#" @click.prevent="navigate('StatsView')">Estadísticas</a></li>
          <li><a href="#" @click.prevent="navigate('HistoryView')">Historia</a></li>
          <li><a href="#" @click.prevent="navigate('ExportDataView')">Exportar Datos</a></li>
          <li><a href="#" @click.prevent="navigate('SettingsView')">Configuración de Moneda</a></li>
        </ul>
      </nav>
    </aside>

    <main class="main-content">
      <component :is="views[currentView]" />
    </main>
  </div>
</template>

<style lang="scss">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.menu-button, .theme-button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color-secondary);
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--background-color);
  }
}

.balance-indicator {
  display: flex;
  gap: .25rem;
  align-items: baseline;
  text-align: center;
  span {
    font-size: 0.625rem;
    color: var(--text-color-secondary);
    text-transform: uppercase;
  }
  strong {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-color-primary);
  }
}

.side-menu {
  position: fixed;
  top: 0;
  left: -280px;
  width: 280px;
  height: 100%;
  background-color: var(--surface-color);
  transition: left 0.3s ease;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid var(--border-color);
  box-shadow: 0 0 20px rgba(0,0,0,0.2);

  &.is-open {
    left: 0;
  }

  nav ul {
    list-style: none;
    padding: 1rem 0;
    margin: 0;
    li a {
      display: block;
      padding: 1rem 1.5rem;
      color: var(--text-color-primary);
      text-decoration: none;
      font-weight: 500;
      &:hover {
        background-color: var(--background-color);
      }
    }
  }
}

.main-content {
  padding: 1rem;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 99;
}
</style>

