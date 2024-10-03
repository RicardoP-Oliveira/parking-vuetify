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
  emits:{
    fecha: '',
  },
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
    getUser(value){
      this.$ubmservice.getTodos().then((res) => {
        if (!res.erro) {
          this.unidades = res.dados;
        } else {
          console.log(res.msg);
        }
      })
      this.$orgaoservice.getOrgaos().then((res) => {
        if (!res.erro) {
          this.orgaos = res.dados;
        } else {
          console.log(res.msg);
        }
      })
      this.$userservice.getId(`rg${value}`).then((res) => {
        if (!res.erro) {
          this.tipoDoc = res.dados.tipo_doc;
          this.idOrgao = res.dados.orgaoId;
          this.nome = res.dados.nGuerra;
          this.idUbm = res.dados.ubmId;
          this.trato = res.dados.gradua;
          this.destino = (this.dadosDestino.includes(res.dados.ubm.name)) 
          ? res.dados.ubm.name : 'OUTRO';
          if (!res.dados.orgaoU.sigla){
            this.orgaoSigla = '';
          } else {
            this.orgaoSigla = res.dados.orgaoU.sigla.toUpperCase();
          }      
        }
      
      })
    },
    salvar(){
      // if (!user) {
      //   this.newUserForm = new FormData();
      //   this.newUserForm.append('documento', this.documento.trim());
      //   this.newUserForm.append('nGuerra', this.nGuerra.toUpperCase().trim());
      //   this.newUserForm.append('gradua', this.gradua.trim());
      //   this.newUserForm.append('ubmId', this.ubmId);
      //   this.newUserForm.append('orgaoId', this.orgaoId);
      //   this.newUserForm.append('tipo_doc', this.tDoc);
      //   if (this.tDoc === 'CNH') {
      //     this.newUserForm.append('cnh', this.documento.trim());
      //   }
      //   this.newUserForm.append('foto', this.arquivoFoto);
      //   this.$userService.adicionar(this.newUserForm);
      // }

      // estacionamento
      this.form = {
        placa: 'PEDESTRE',
        documento: this.documento.trim(),
        condutor: `${this.trato} ${this.orgaoSigla} ${this.nome.toUpperCase()}`,
        destino: this.destino.toUpperCase()
      }
      this.$ceicsservice.adicionarPedestre(this.form, this.token).then((res) => {
        this.close();
      });
    },
    close(){
      this.isPedestre = false;
      this.$emit('fecha');
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
  }
}
</script>
