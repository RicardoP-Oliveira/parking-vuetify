/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Serviços de API
import MovimentacaoService from '@/core/services/MovimentacaoService';
// import userService from '@/core/services/UsuarioServices';
// import ubmService from '@/core/services/UnidadeServices';
// import orgaoService from '@/core/services/OrgaoServices';
// import pedestreService from '@/core/services/PedestreService';
// import servicoService from '@/core/services/ServicoServices';
// import targetService from '@/core/services/DestinoService';

import '@/assets/global.css';

// Composables
import { createApp } from 'vue'
import VueBarcode from '@chenfengyuan/vue-barcode'

const app = createApp(App)

app.component(VueBarcode.name, VueBarcode)

// Configuração global
// app.config.globalProperties.$sessionservice = sessionService;
app.config.globalProperties.$movimentacaoService = MovimentacaoService;
// app.config.globalProperties.$userservice = userService;
// app.config.globalProperties.$ubmservice = ubmService;
// app.config.globalProperties.$orgaoservice = orgaoService;
// app.config.globalProperties.$pedestreService = pedestreService;
// app.config.globalProperties.$servicoService = servicoService;
// app.config.globalProperties.$targetService = targetService;

registerPlugins(app)

app.mount('#app')
