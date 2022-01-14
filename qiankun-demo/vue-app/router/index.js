const Home = () => import('../src/components/Home.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
];


export default routes;