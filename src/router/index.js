import { createRouter, createWebHistory } from 'vue-router';
import JobList from '../components/JobList.vue';
import JobDetail from '../components/JobDetail.vue';
import Login from '../components/Login.vue';
import { supabase } from '../config/supabase';

const routes = [
  { path: '/', component: JobList, meta: { requiresAuth: true } },
  { path: '/job/:id', component: JobDetail, props: true, meta: { requiresAuth: true } },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  }
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (to.meta.requiresAuth && !session) {
    next('/login');
  } else if (to.path === '/login' && session) {
    next('/');
  } else {
    next();
  }
});

export default router;
