<template>
 <v-dialog
    v-model="isPedestre"
    width="600"
    persistent
  >
    <v-card>
      <v-card-title align="center">
        Controle de Pedestre
        <v-divider class="mt-4"></v-divider>
      </v-card-title>
      <v-card-text>
        <v-row >
            <v-col class="px-2 py-1">
                <v-text-field
                  label="Documento"
                  autofocus
                  variant="underlined"
                  v-model="documento"
                  @focusout="getUser(documento)"
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
      </v-card-text>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn
          class="ms-auto"
          text="Cancelar"
          variant="tonal"
          @click="close()"
        ></v-btn>
        <v-btn
          class="ms-auto"
          text="Salvar"
          color="blue-darken-4"
          variant="flat"
          @click="salvar()"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props:{
    pedestre: Boolean,
  },
  emits:['closeModal', 'update:options'],
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
        console.log(userRes)
        if (!userRes.erro) {
          this.tipoDoc = userRes.dados.tipo_doc;
          this.idOrgao = userRes.dados.orgaoId;
          this.nome = userRes.dados.nGuerra;
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
        placa: 'PEDESTRE',
        documento: this.documento.trim(),
        condutor: `${this.trato} ${this.orgaoSigla} ${this.nome.toUpperCase()}`,
        destino: this.destino.toUpperCase()
      }
      const salved = await this.$ceicsservice.adicionarPedestre(this.form, this.token)
        if (salved) {
          this.$emit('update:options', {from: this.$props});
          this.close();
        }
    },
    close(){
      this.isPedestre = false;
      this.$emit('closeModal')
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
