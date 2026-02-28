/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

//Composables

import { createRouter, createWebHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';
import { routes } from 'vue-router/auto-routes';

const layoutRoutes = setupLayouts(routes)

// Configuração do router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: layoutRoutes,
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

// import ConfigClass from '@/class/configClass';
// import { jwtDecode } from 'jwt-decode';

// const caminho = `${ConfigClass.getUrlApi().toString()}/sessions/validate`;

// Função para capitalizar a primeira letra
// const capitalize = (string) =>{
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }

// const translations = {
//   'report': 'Relatórios'
// }

// const translate = (string) => {
//   return translations[string.toLowerCase()] || string;
// };

// Verificar token
// const isValidToken = (token) => {

//   if (!token) {
//     return false
//   } else {
//     const decodedToken = jwtDecode(token);
//     const experationTime = new Date(decodedToken.exp * 1000); // convertendo data expiração
//     const currentTime = new Date();
//     const timeRemaining = (experationTime - currentTime);
//     if (timeRemaining <= 0) {
//       localStorage.removeItem('token');
//       return false;
//     } else {
//       return true
//     }
//   }
// }

// Função de guard para verificar autenticação
// async function myGuard(to, from, next) {
//   const token = localStorage.getItem('token');

//   const isValid = await isValidToken(token);

//   next();

//   // if (isValid) {
//   //   const options = {
//   //     headers: {
//   //       'Content-type': 'application/json;charset=UTF-8',
//   //       Authorization: `Bearer ${token}`,
//   //     },
//   //     method: 'POST',
//   //     }

//   //     try {
//   //       const res = await fetch(caminho, options);
//   //       const data = await res.json();

//   //       if (!data.erro) {
//   //         const decoded = jwtDecode(token);
          
//   //         if (decoded.role === 1) {
//   //           next()
//   //         } else {
//   //           next({ name: 'Home' })
//   //         }
//   //       } else {
//   //         next({ name: 'Login' })
//   //       }
//   //     } catch (err) {
//   //       next({ name: 'Login' })
//   //   }
//   // } else {
//   //     next({ name: 'Login' })
//   // }
// }

// async function myLogin(to, from, next) {
//   const token = localStorage.getItem('token');

//   const isValid = await isValidToken(token);

//   if (isValid) {
//     const decoded = jwtDecode(token);

//     if (decoded.isLoggedin) {
//       next(from)
//       setTimeout(() => {
//         alert(`Sistema já logado para o usuário ${decoded.documento}`)
//       }, 500);
      
//     } else {
//       next();
//     }
//   } else {
//     next();
//   } 
// }

// Adicionar proteção à rota '/'
// const protectedRoutes = setupLayouts(routes).map(route => ({
//   ...route,
//     meta: {
//       ...route.meta,
//       requiresAuth: route.path === '/',
//     },
    // children: route.children?.map(child => ({
    //   ...child,
    //   name:  (child.path === '/') ? 'Estacionamento' 
    //     : capitalize(translate(child.name.substring(child.name.indexOf('/') + 1)))
    // })) 
// }));

// Guarda global para verificar autenticação
// router.beforeEach((to, from, next) => {
//   // Verifica se a rota requer autenticação
//   if (to.meta.requiresAuth && to.path === '/') {
//     myGuard(to, from, next); // Chama a função que verifica o token
//   } else if (to.path === '/login'){
//     myLogin(to, from, next);
//   } else {
//     next();
//   } // Permite navegação se a rota não exige autenticação
// });