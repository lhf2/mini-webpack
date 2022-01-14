import {createRouter, createWebHistory} from 'vue-router';

const Home = () => import('../src/components/Home.vue');
const routes = [
  {path: '/', component: Home}
];


const router = createRouter({
  history: createWebHistory('/'),
  routes
});

export default router;