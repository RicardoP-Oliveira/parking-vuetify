<template>
    <v-dialog
      v-model="isDialog"
      width="600"
      persistent
    >
      <v-card>
        <v-card-title class="text-center">
          Controle de Veículos
          <v-divider class="mt-4"></v-divider>
        </v-card-title>
        <v-card-text>
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
            <v-col class="px-0 py-1 font-weight-bold" align="end">
                Documento:
            </v-col>
            <v-col class="px-2 py-1">
              <v-text-field
                autofocus
                density="confortable"
                v-model="documento"
                hide-details
                variant="underlined"
                width="150px"
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
                density="confortable"
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
          <v-divider class="mt-4"></v-divider>
        </v-card-text>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="close()"
            variant="tonal"
          >
            Cancelar
          </v-btn>
          <v-btn
            @click="salvar()"
            color="blue-darken-4"
            variant="flat"
          >
            Confirmar
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>

<script>

export default {
  props:{
    dialog: Object,
  },
  emits:{
    fecha: '',
  },
  data(){
    return {
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
      // Cria um array de promessas para buscar na tabela geral e na tabela parking
      try {        
        const [infoRes, parkingRes] = await Promise.all([
          this.$ceicsservice.getInfo(this.search, this.token),
          this.$ceicsservice.getParking(this.search, this.token)
        ]);

        if (!infoRes.erro && infoRes.dados) {
          this.processInfo(infoRes.dados);
        } else if (!parkingRes.erro && parkingRes.dados) {
          console.log('parking ', parkingRes)
          this.setParkingData(parkingRes.dados,infoRes);
        } else if (infoRes.erro) {
          if (infoRes.dados && !infoRes.dados.visitante) {
            alert(`${infoRes.msg}`)
            this.close();
          } else {
            this.placa = this.search
          } 
        } else {
          alert(`Viatura não cadastrada!n\nContate o Administrador.`)
          this.close();
        }
      } catch (error) {
        console.error('Erro ao processar as buscas: ', error)
      }
    },

    setParkingData(dados, info) {
      // Define dados do estacionamento
      this.placa = dados.placa;
      this.condutor = dados.condutor;
      this.documento = dados.eRg;
      this.modelo = dados.marcaModelo;
      if (!info.erro) {
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
      // Atualiza os dados do componente com base na resposta
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
    salvar(){
      this.form = {
        'placa': this.placa.toUpperCase().trim(),
        'documento': this.documento.trim(),
        'marcaModelo': this.modelo ? this.modelo.toUpperCase().trim() : this.modelo,
        'condutor': this.gradua ? `${this.gradua} ${this.condutor.trim()}` : this.condutor,
        'destino': this.destino.toUpperCase().trim(),
        'owner': this.proprietario ? this.proprietario.toUpperCase().trim() : this.proprietario,
      }
      this.$ceicsservice.adicionar(this.form, this.token).then((res) => {
        this.close();
      })
    },
    action() {
      
    },
    close(){
      this.isDialog = false
      this.placa = ''
      this.documento =  ''
      this.gradua = ''
      this.proprietario =  ''
      this.condutor = ''
      this.$emit('fecha')
    }
  },
  mounted() {
    this.dbDest = this.$dbTarget;
    this.dbDest.target.map((element) => this.dados.push(element.local));
    this.getDados();
  },
}
</script>