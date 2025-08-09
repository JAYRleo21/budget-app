import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import StatsView from '../views/StatsView.vue';
import HistoryView from '../views/HistoryView.vue';
import ExportDataView from '../views/ExportDataView.vue';
import SettingsView from '../views/SettingsView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/stats',
    name: 'Stats',
    component: StatsView,
  },
  {
    path: '/history',
    name: 'History',
    component: HistoryView,
  },
  {
    path: '/export',
    name: 'ExportData',
    component: ExportDataView,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
