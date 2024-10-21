<template>
  <BaseModal
    :isOpen="pedestre"
    :documento="documento"
    title="Controle de Pedestres"
    @close="close"
    @confirm="salvar"
  >
  <v-row >
    <v-col class="px-2 py-1">
        <v-text-field
          label="Documento"
          autofocus
          variant="underlined"
          v-model="documento"
          @keyup="getUser(documento)"
        >
        </v-text-field>
    </v-col>
    <v-col class="px-2 py-1">
        <v-select
          label="Tipo Doc"
          variant="underlined"
          v-model="tipoDoc"
        >
        </v-select>
    </v-col>
    <v-col class="px-2 py-1">
        <v-select
          :items="orgaosOptions"
          item-title="orgao"
          item-value="id"
          label="Órgão"
          variant="underlined"
          v-model="idOrgao"
        >
        </v-select>
    </v-col>   
  </v-row>
  <v-row >
    <v-col cols="4" class="px-2 py-1">
        <v-select
          :items="tratoOptions"
          item-title="name"
          item-value="trato"
          label="Posto/Grad/Tratam"
          variant="underlined"
          v-model="trato"
        >
        </v-select>
    </v-col>
    <v-col class="px-2 py-1">
        <v-text-field
          label="Nome"
          variant="underlined"
          v-model="nome"
        >
        </v-text-field>
    </v-col>
  </v-row>
  <v-row >
    <v-col cols="4" class="px-2 py-1">
        <v-select
          :items="unidadesOptions"
          item-value="id"
          item-title="name"
          label="UBM"
          variant="underlined"
          v-model="idUbm"
        >
        </v-select>
    </v-col>
    <v-col cols="4" class="px-2 py-1">
        <v-select
          :items="destinoOptions"
          label="Destino"
          variant="underlined"
          v-model="destino"
        >
        </v-select>
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
  name: 'infoPedestre',
  props:{
    pedestre: Boolean,
  },
  emits:['update:options','closeModal'],
  data() {
    return {
      isPedestre: this.pedestre,
      documento: '',
      tipoDoc: '',
      idOrgao: '',
      trato: '',
      nome: '',
      idUbm: '',
      destino: '',
      orgaoSigla: '',
      dadosDestino: [],
      unidades: [],
      orgaos: [],
      form: {},
      token: `Bearer ${localStorage.getItem('token')}` ,
    }
  },
  methods: {
    async getUser(value){
      try {
        const userRes = await this.$userservice.getId(`rg${value}`, this.token);
        if (!userRes.erro) {
          this.tipoDoc = userRes.dados.tipo_doc;
          this.idOrgao = userRes.dados.orgaoId;
          this.nome = userRes.dados.nGuerra;
          this.documento = userRes.dados.documento;
          this.idUbm = userRes.dados.ubmId;
          this.trato = userRes.dados.gradua;
          this.destino = this.dadosDestino.includes(userRes.dados.ubm.name) 
            ? userRes.dados.ubm.name
            : 'OUTRO';
          this.orgaoSigla = userRes.dados.orgaoU.sigla || '';  
        }
      } catch (error) {
        console.log('Erro ao buscar usuário', error);
      }
    },
    async getUnidades() {
      const ubmRes = await this.$ubmservice.getTodos();
      if (!ubmRes.erro) {
        this.unidades = ubmRes.dados;
      } else {
        console.log(ubmRes.msg);
      }
    },
    async getOrgaos() {
      const orgaoRes = await this.$orgaoservice.getOrgaos();
      if (!orgaoRes.erro) {
        this.orgaos = orgaoRes.dados;
      } else {
        console.log(orgaoRes.msg);
      }
    },
    async salvar(){
      this.form = {
        'nDoc': this.documento.trim(),
        'tDoc': this.tipoDoc,
        'name': `${this.trato} ${this.orgaoSigla} ${this.nome.toUpperCase()}`,
        'destino': this.destino.toUpperCase()
      }
      const salved = await this.$pedestreService.adicionar(this.form, this.token)
        if (salved) {
          this.$emit('update:options');
          this.close();
        }
    },
    close(){
      this.isPedestre = false;
      this.$emit('closeModal', {from: this.$options.name})
    }
  },
  computed: {
    orgaosOptions(){
      return this.orgaos.map(o => ({id: o.orgao.id, orgao: o.orgao.orgao}))
    },
    unidadesOptions() {
      return this.unidades.map(u => ({id: u.obm.id, name: u.obm.name}))
    },
    destinoOptions() {
      return this.dadosDestino = this.$dbTarget.target.map(d => (d.local))
    },
    tratoOptions() {
      return this.$dbPgt.pgt.map(t => ({trato: t.trato, name: t.name}))
    }
  },
  mounted() {
    this.getUnidades();
    this.getOrgaos();
  }
}
</script>
