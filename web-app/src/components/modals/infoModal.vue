<template>
  <BaseModal
    :isOpen="isDialog"
    :documento="documento"
    title="Controle de acesso"
    :confirmText="isAction"
    @close="close"
    @confirm="salvar"
  >
    <v-row >
      <v-col class="px-0 py-1 font-weight-bold" align="end">
          UBM:
      </v-col>
      <v-col class="px-2 py-1">
          {{ obm }}
      </v-col>  
    </v-row>
    <v-row>
      <v-col class="px-0 py-1 font-weight-bold" align="end">
          Proprietário:
      </v-col>
      <v-col class="px-2 py-1">
          {{ proprietario }}
      </v-col>  
    </v-row>
    <v-row> 
      <v-col class="px-0 pt-2 font-weight-bold" align="end">
          Documento:
      </v-col>
      <v-col class="px-2 py-0">
        <v-text-field
          autofocus
          density="compact"
          v-model="documento"
          variant="underlined"
          hide-details
          width="100px"
          @keyup="getUser(documento)"
        />
      </v-col> 
    </v-row>
    <v-row>
      <v-col class="px-0 py-1 font-weight-bold" align="end">
          Condutor:
      </v-col>
      <v-col class="px-2 py-1">
          {{ condutor }}
      </v-col>  
    </v-row>
    <v-row>
      <v-col class="px-0 py-1 font-weight-bold" align="end">
          Placa:
      </v-col>
      <v-col class="px-2 py-1">
          {{ placa }}
      </v-col>  
    </v-row>
    <v-row >
      <v-col class="px-0 py-1 font-weight-bold" align="end">
          Modelo:
      </v-col>
      <v-col class="px-2 py-1">
          {{ modelo }}
      </v-col>
    </v-row>
    <v-row>
      <v-col class="px-0 py-1 font-weight-bold" align="end">
          Destino:
      </v-col>
      <v-col class="px-2 py-1">
        <v-select
          :items="dados"
          density="comfortable"
          variant="outlined"
          v-model="destino"
        >
        </v-select>  
      </v-col>  
    </v-row>
    <v-divider class="my-4"></v-divider>
    <v-row>
      <v-col align="center">
        <vue-barcode :value=placa v-if="placa"></vue-barcode>
      </v-col>
    </v-row>
  </BaseModal>
</template>

<script>
import BaseModal from '@/components/modals/BaseModal.vue';

export default {
  components:{
    BaseModal
  },
  props:{
    dialog: Object,
  },
  emits:[
    'closeModal',
    'update:options',
    'changeTable'
  ],
  data(){
    return {
      btn: null,
      isAction: '',
      isDialog: this.dialog.isDialog,
      placa: '',
      search: this.dialog.idPlaca,
      documento: '',
      gradua: '',
      nGuerra: '',
      obm: '',
      modelo: '',
      proprietario: '',
      condutor: '',
      destino: '',
      dados: [],
      form: {},
      token: `Bearer ${localStorage.getItem('token')}` ,
    }
  },
  methods:{    
    
    async getDados() {
      try {
        const infoRes = await this.$ceicsservice.getInfo(this.search, this.token);
        const searchPlaca = this.getSearchPlaca(infoRes);
        const parkingRes = await this.$ceicsservice.getParking(searchPlaca, this.token);
        this.processResults(infoRes, parkingRes);
      } catch (error) {
        console.error('Erro ao processar as buscas: ', error);
      }
   },
    getSearchPlaca(infoRes) {
      return !isNaN(this.search) && !infoRes.erro
        ? infoRes.visitor ? this.search : infoRes.dados.placa || ''
        : this.search;
    },
    processResults(infoRes, parkingRes) {
      if (!parkingRes.erro && parkingRes.dados) {
        this.isAction = "Saída";
        this.setParkingData(parkingRes.dados, infoRes);
      } else if (!infoRes.erro && infoRes.dados) {
        this.isAction = "Entrada";
        this.processInfo(infoRes.dados);
      } else if (infoRes.visitor) {
        this.isAction = "Entrada";
        this.placa = this.search;
      } 
      else {
        alert(infoRes.msg);
        this.close();
      }
    },
    setParkingData(dados, info) {
      this.placa = dados.placa;
      this.condutor = dados.eCondutor;
      this.documento = dados.eRg;
      this.modelo = dados.marcaModelo;
      if (!info.visitor) {
        this.getOwner(info.dados)
      }
      this.getUser(this.documento);
    },
    getOwner(value) {
      if (value.userId) {
         const orgao = value.user.orgaoU.sigla || '';
         const gradua = value.user.gradua || '';
         const name = value.user.nGuerra || '';
         this.proprietario = `${gradua} ${orgao} ${name}`;
      } else {
          this.proprietario = value.orgao.orgao || 'Desconhecido';
      }
    },
    processInfo(res) {
      
      this.placa = this.placa || res.placa;
      this.modelo = this.modelo || res.marcaModelo;
      this.documento = res.user ? res.user.documento : '';
      this.getOwner(res)
      if (this.documento) {
        this.getUser(this.documento)
      } 
    },
    async getUser(value) {
      try {
        const res = await this.$userservice.getId(`rg${value.trim()}`.trim(), this.token);
        if (!res.erro) {
          this.condutor = !res.dados.orgaoU.sigla
          ? `${res.dados.gradua.trim()} ${res.dados.nGuerra.trim()}`
          : `${res.dados.gradua.trim()} ${res.dados.orgaoU.sigla.trim()} ${res.dados.nGuerra.trim()}`;
          this.destino = this.dados.includes(res.dados.ubm.name) ? res.dados.ubm.name : 'OUTRO';
          this.obm = res.dados.ubm.name;
        } else {
          this.condutor = '';
        }
      } catch (error) {
        console.log('Erro ao buscar usuário', error);
        this.condutor = '';
      }
    },
    async salvar(){
      this.form = {
        'placa': this.placa.toUpperCase().trim(),
        'documento': this.documento.trim(),
        'marcaModelo': this.modelo ? this.modelo.toUpperCase().trim() : this.modelo,
        'condutor': this.gradua ? `${this.gradua} ${this.condutor.trim()}` : this.condutor,
        'destino': this.destino.toUpperCase().trim(),
        'owner': this.proprietario ? this.proprietario.toUpperCase().trim() : this.proprietario,
      }
      const salved = await this.$ceicsservice.adicionar(this.form, this.token)
        if (salved) {
          this.$emit('update:options', {from: this.$props});
          this.close();
        }
    },
    close(){
      this.isDialog = false
      this.$emit('closeModal')
    },
  },
  async mounted() {
    this.dbDest = this.$dbTarget;
    this.dbDest.target.map((element) => this.dados.push(element.local));
    await this.getDados();
  },
}
</script>