<template>
    <v-dialog
      v-model="isDialog"
      width="600"
      persistent
    >
      <v-card>
        <v-card-title class="text-center">
          Controle de acesso
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
            ref="myButton"
            @click.enter.prevent="salvar()"
            color="blue-darken-4"
            variant="flat"
            min-width="115"
            :text="isAction || 'Confirmar'"
          >
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>

<script>
import { info } from 'sass';


export default {
  props:{
    dialog: Object,
  },
  emits:{
    fecha: '',
  },
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
    // async getDados() {
    //   try {        
       
    //     const infoRes = await this.$ceicsservice.getInfo(this.search, this.token);
    //     let searchPlaca = null;
    //     console.log(infoRes)
    //     if (!isNaN(this.search) && !infoRes.erro) {
    //       if (!infoRes.visitor) {
    //         searchPlaca = infoRes.dados.placa || '';
    //       }
    //     } else {
    //       searchPlaca = this.search;
    //     }

    //     const parkingRes = await this.$ceicsservice.getParking(searchPlaca, this.token);

    //     console.log('Car ',infoRes, 'Paking ',parkingRes)
        
    //     if (!parkingRes.erro && parkingRes.dados) {
    //       this.isAction = "Saída"
    //       this.setParkingData(parkingRes.dados, infoRes);
    //     } 
        
    //     else if (!infoRes.erro && infoRes.dados) {
    //       this.isAction = "Entrada"
    //       this.processInfo(infoRes.dados);
    //     } 

    //     else if (infoRes.visitor) {
    //         this.isAction = "Entrada"
    //         this.placa = this.search;
    //     }
        
    //     else {

    //       alert(infoRes.msg);
    //       this.close();
    //     }

    //   } catch (error) {
    //     console.error('Erro ao processar as buscas: ', error);
    //   } 
  
    // },

    async getDados() {
      try {
        // Busca as informações na tabela geral
        const infoRes = await this.$ceicsservice.getInfo(this.search, this.token);

        // Determina qual placa usar na busca
        const searchPlaca = this.getSearchPlaca(infoRes);

        // Busca as informações na tabela parking
        const parkingRes = await this.$ceicsservice.getParking(searchPlaca, this.token);

        // Processa os resultados da busca
        this.processResults(infoRes, parkingRes);

      } catch (error) {
        console.error('Erro ao processar as buscas: ', error);
      }
   },

    getSearchPlaca(infoRes) {
      // Verifica se a busca é numérica e se não há erro no resultado
      if (!isNaN(this.search) && !infoRes.erro) {
        return infoRes.visitor ? this.search : infoRes.dados.placa || '';
      }
      return this.search;
    },

    processResults(infoRes, parkingRes) {
      // Processa os dados de parking se disponíveis
      if (!parkingRes.erro && parkingRes.dados) {
        this.isAction = "Saída";
        this.setParkingData(parkingRes.dados, infoRes);
      } 
      // Processa os dados de infoRes se disponíveis
      else if (!infoRes.erro && infoRes.dados) {
        this.isAction = "Entrada";
        this.processInfo(infoRes.dados);
      } 
      // Verifica se o usuário é um visitante
      else if (infoRes.visitor) {
        this.isAction = "Entrada";
        this.placa = this.search;
      } 
      // Caso contrário, exibe mensagem de erro
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

    close(){
      this.isDialog = false
      this.placa = ''
      this.documento =  ''
      this.gradua = ''
      this.proprietario =  ''
      this.condutor = ''
      this.loading = false
      this.$emit('fecha')
    },

    focusConfirm() {
      const button = this.$refs.myButton.$el;
      if (button) {
        button.focus()
      }
    }
  },
  mounted() {
    this.dbDest = this.$dbTarget;
    this.dbDest.target.map((element) => this.dados.push(element.local));
    this.getDados();
    this.focusConfirm()
  },
}
</script>