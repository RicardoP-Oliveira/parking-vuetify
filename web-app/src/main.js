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
import sessionService from '@/services/SessionService';
import ceicsService from '@/services/CeicsServices';
import userService from '@/services/UserServices';
import ubmService from '@/services/UbmServices';
import orgaoService from '@/services/OrgaoServices';
import pedestreService from '@/services/PedestreService';
import servicoService from '@/services/ServicoServices';
import targetService from '@/services/TargetService';


// Bancos de dados
import DbPGT from '@/config/dbPGT.json';
import DbTarget from '@/config/dbTarget.json';
import DbDoc from '@/config/dbDoc.json';

import '@/assets/global.css';

// Composables
import { createApp } from 'vue'
import VueBarcode from '@chenfengyuan/vue-barcode'

const app = createApp(App)

app.component(VueBarcode.name, VueBarcode)

// Configuração global
app.config.globalProperties.$dbPgt = DbPGT;
app.config.globalProperties.$dbTarget = DbTarget;
app.config.globalProperties.$dbDoc = DbDoc;
app.config.globalProperties.$sessionservice = sessionService;
app.config.globalProperties.$ceicsservice = ceicsService;
app.config.globalProperties.$userservice = userService;
app.config.globalProperties.$ubmservice = ubmService;
app.config.globalProperties.$orgaoservice = orgaoService;
app.config.globalProperties.$pedestreService = pedestreService;
app.config.globalProperties.$servicoService = servicoService;
app.config.globalProperties.$targetService = targetService;

registerPlugins(app)

app.mount('#app')
