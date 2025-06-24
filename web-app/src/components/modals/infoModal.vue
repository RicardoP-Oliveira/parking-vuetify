<template>
  <BaseModal
    :isOpen="isDialog"
    :documento="documento"
    title="Controle de acesso"
    :confirmText="isAction"
    :saveData="salvar"
    @confirm="salvar"
    @close="close"
    :confirmButton="!isValidForm"
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
      <v-col class="px-0 pt-2 font-weight-bold" align="end">
          Condutor:
      </v-col>
      <v-col class="px-2 py-0">
        <v-text-field
        density="compact"
        v-model="condutor"
        variant="underlined"
        hide-details
        :rules="[validCondutor]"
        />  
      </v-col>  
    </v-row>
    <v-row>
      <v-col class="px-0 pt-2 font-weight-bold" align="end">
          Placa:
      </v-col>
      <v-col class="px-2 py-0">
        <v-text-field
        density="compact"
        v-model="placa"
        :rules="[validatePlaca]"
        clearable
        :maxlength="getLength()"
        @click:clear="clearPlaca"
        @keyup="convertToUpper"
        hide-details
        width="100px"
        :variant="placa.length > 0 ? 'plain' : 'underlined'"
        :disabled="modelo.length === 0 ? true : false"
        />
      </v-col>  
    </v-row>
    <v-row >
      <v-col class="px-0 py-1 font-weight-bold" align="end">
          Marca/Modelo:
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
  name: 'infoModal',
  props:{
    dialog: Object,
  },
  emits:['closeModal'],
  data(){
    return {
      btn: null,
      pattern: /^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$/,
      isAction: '',
      isDialog: this.dialog.isDialog,
      placa: '',
      search: this.dialog.idPlaca,
      documento: '',
      gradua: '',
      nGuerra: '',
      nGuerraPattern: /^[aA-zZ]+(?: [aA-zZ]+)*$/,
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
   validatePlaca(value) {
      return this.pattern.test(value) || 'Placa inválida';
    },
    validCondutor(value) {
      return this.nGuerraPattern.test(value) || 'Não satisfaz às exigências';
    },
    clearPlaca() {
      this.placa = '';
    },
    getLength() {
      if (this.pattern.test(this.placa)) {
        return 7;
      }
    },
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
      if(isNaN(this.search) || infoRes.erro) {
        return this.search;
      }
      return infoRes.visitor ? this.search : infoRes.dados.placa ||  '';
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
        this.placa = infoRes.visitor ? this.search : '';
        this.getOwner(null);
      } else {
        // alert(infoRes.msg);
        this.isAction = "Entrada";
        this.modelo = !infoRes.visitor ? this.search : '';
        this.getOwner(null);
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
      if (value && value.userId) {
         const orgao = value.user.orgaoU.sigla || '';
         const gradua = value.user.gradua || '';
         const name = value.user.nGuerra || '';
         this.proprietario = `${gradua} ${orgao} ${name}`;
      } else if(value && value.orgaoId) {
          this.proprietario = value.orgao.orgao || 'Desconhecido';
      } else {
        this.proprietario = 'NFPA'
      }
    },
    processInfo(res) {
      
      this.placa = this.placa || res.placa;
      this.modelo = this.modelo || `${res.marca} ${res.modelo}`;
      this.documento = res.user ? res.user.documento : '';
      this.getOwner(res)
      if (this.documento) {
        this.getUser(this.documento)
      } 
    },
    async getUser(value) {
      try {
        const res = await this.$userservice.getId(`rg${value.trim()}`, this.token);
        if (!res.erro) {
          this.condutor = !res.dados.orgaoU.sigla
          ? `${res.dados.gradua.trim()} ${res.dados.nGuerra.trim()}`
          : `${res.dados.gradua.trim()} ${res.dados.orgaoU.sigla.trim()} ${res.dados.nGuerra.trim()}`;
          this.destino = this.dados.includes(res.dados.ubm.name) ? res.dados.ubm.name : 'CEICS';
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
      if (this.placa !== undefined && this.placa !== '' && this.placa !== null) {
        this.form = {
        'placa': this.placa.toUpperCase().trim(),
        'documento': this.documento.trim(),
        'marcaModelo': this.modelo ? this.modelo.toUpperCase().trim() : this.modelo,
        'condutor': this.gradua ? `${this.gradua} ${this.condutor.trim()}` : this.condutor,
        'destino': this.destino.toUpperCase().trim(),
        'owner': this.proprietario ? this.proprietario.toUpperCase().trim() : '',
        }
        try {
          const salved = await this.$ceicsservice.adicionar(this.form, this.token)
          if (salved) {
            this.close()
          } else {
              console.error('[infoModal.vue] Erro ao salvar dados do carro.');
          // Adicione aqui feedback ao utilizador sobre o erro
          }
        } catch(erro) {
          console.error('[infoModal.vue] Erro na requisição de salvar carro:', error);
          // Adicione aqui feedback ao utilizador sobre o erro da rede/API
        }
      }
    },
    close() {
      this.isDialog = false;
      this.$emit('closeModal', { from: this.$options.name });
    }
  },
  computed: {
    isValidPlaca() {
      return this.pattern.test(this.placa);
    },
    isCondutor() {
      return this.nGuerraPattern.test(this.condutor);
    },
    isValidForm() {
      return this.isValidPlaca && this.isCondutor;
    },
    convertToUpper() {
      this.placa = this.placa ? this.placa.toUpperCase() : '';
    },
  },
  async mounted() {
    this.dbDest = this.$dbTarget;
    this.dbDest.target.map((element) => this.dados.push(element.local));
    await this.getDados();
  },
}
</script>