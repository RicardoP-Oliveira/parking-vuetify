/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

//Composables
import { jwtDecode } from 'jwt-decode';
import { createRouter, createWebHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';
import { routes } from 'vue-router/auto-routes';
import ConfigClass from '@/class/configClass';


const caminho = `${ConfigClass.getUrlApi().toString()}/sessions/validate`;

// Função de guard para verificar autenticação
async function myGuard(to, from, next) {
  const token = localStorage.getItem('token');
  
  if (token) {
    const options = {
      headers: {
        'Content-type': 'application/json;charset=UTF-8',
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      }

      try {
        const res = await fetch(caminho, options);
        const data = await res.json();

        if (!data.erro) {
          const decoded = jwtDecode(token);
          
          if (decoded.role === 1) {
            next()
          } else {
            next({ name: '/home' })
          }
        } else {
          next({ name: '/login' })
        }
      } catch (err) {
        next({ name: '/login' })
    }
  } else {
      next({ name: '/login' })
  }
}

async function myLogin(to, from, next) {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwtDecode(token);

    if (decoded.isLoggedin) {
      next(from)
      setTimeout(() => {
        alert(`Sistema já logado para o usuário ${decoded.documento}`)
      }, 500);
      
    } else {
      next();
    }
  } else {
    next();
  } 
}

// Adicionar proteção à rota '/'
const protectedRoutes = setupLayouts(routes).map(route => ({
  ...route,
  meta: {
    ...route.meta,
    requiresAuth: route.path === '/',
  }
}));

// Configuração do router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: protectedRoutes,
});

// Guarda global para verificar autenticação
router.beforeEach((to, from, next) => {
  // Verifica se a rota requer autenticação
  if (to.meta.requiresAuth && to.path === '/') {
    myGuard(to, from, next); // Chama a função que verifica o token
  } else if (to.name === '/login'){
    myLogin(to, from, next);
  } else {
    next();
  } // Permite navegação se a rota não exige autenticação
});

// Workaround para o problema de importação dinâmica no Vite
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;