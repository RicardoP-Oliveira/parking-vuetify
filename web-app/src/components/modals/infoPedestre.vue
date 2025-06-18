<template>
  <BaseModal
    :isOpen="pedestre"
    :documento="documento"
    :confirmText="isAction"
    title="Controle de Pedestres"
    @confirm="salvar"
    @close="close"
  >
  <v-row >
    <v-col class="px-2 py-1">
        <v-text-field
          autofocus
          label="Documento"
          variant="underlined"
          v-model="documento"
          @keyup="getDados(documento)"
          :error="showError"
          :error-messages="errorMessage"
          @blur="formTouched = true"
        >
        </v-text-field>
    </v-col>
    <v-col class="px-2 py-1">
        <v-select
          :items="docOptions"
          item-title="name"
          item-value="sigla"
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
          @keyup="convertToUpper"
          :error="!nome && formTouched"
          :error-messages="!nome && formTouched ? '* Obrigatório' : ''"
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
          :error="!destino && formTouched"
          :error-messages="!destino && formTouched ? '* Obrigatório' : ''"
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
  emits:['closeModal'],
  data() {
    return {
      formTouched: false,
      error:undefined,
      isPedestre: this.pedestre,
      documento: '',
      isAction: 'Entrada',
      tratoRegex: null,
      tipoDoc: '',
      idOrgao: '',
      trato: '',
      nome: '',
      idUbm: '',
      destino: '',
      orgaoSigla: '',
      dados: [],
      dadosDestino: [],
      unidades: [],
      orgaos: [],
      form: {},
      token: `Bearer ${localStorage.getItem('token')}` ,
    }
  },
  methods: {
    async getDados(value){
      try {
        this.limparForm();

        const search = `rg${value}`.trim();
        const searchRg = value.trim();
        const [pedestreRes, pedestrePark] = await Promise.all([
          this.$userservice.getId(search, this.token),
          this.$pedestreService.getByDoc(searchRg, this.token)
        ]);
        this.dados = pedestreRes
        this.processResult(pedestreRes, pedestrePark);
      } catch (error) {
        console.log('Erro ao buscar usuário', error);
      }
    },

    processResult(pedestreRes, pedestrePark) {
      if((!pedestreRes.erro && pedestreRes.dados)){
        this.setDataForm(pedestreRes.dados)
      } 
      if (!pedestrePark.erro && pedestrePark.dados) {
        this.isAction = 'Saída';
        const regex = this.mountRegex(pedestrePark.dados.name);
        this.setDataForm(pedestrePark.dados, regex);
      }
    },

    limparForm() {
      this.tipoDoc =  '';
      this.isAction = 'Entrada',
      this.idOrgao =  '';
      this.nome =  '';
      this.idUbm =  '';
      this.trato =  '';
      this.destino = '';
      this.orgaoSigla = '';
    },
    
    setDataForm(data, regex='') {
      this.tipoDoc =  this.tipoDoc || data.tDoc || data.tipo_doc;
      this.idOrgao =  this.idOrgao || regex.orgao || data.orgaoId;
      this.nome =  this.nome || regex.name || data.nGuerra;
      this.idUbm =  this.idUbm || regex.ubm || data.ubmId;
      this.trato =  this.trato || regex.trato ||data.gradua;
      this.destino = data.destino 
        || (this.dadosDestino.includes(data.ubm?.name) 
        ? data.ubm?.name
        : 'CEICS');
      this.orgaoSigla = regex.orgao || (data.orgaoU?.sigla || '');
    },

    mountRegex(regex) {
      const terms = ["BM", "PM", "EB", "MB", "MAER"]
      const nameSplit = regex.split(/\s+/).filter(Boolean);
      const validTerms = terms.some(term => nameSplit.includes(term));
      if (validTerms) {
        return {
          trato: nameSplit[0],
          name: nameSplit.slice(2).join(' '),
          orgao: nameSplit[1] || '', 
        }
      } else {
        return {
          trato: nameSplit[0],
          name: nameSplit.slice(1).join(' '),
          ubm: 'VISITANTE'
        }
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
      this.formTouched = true;
      if (!this.nome || !this.destino) {
        this.error = "Por favor, preencha todos os campos obrigatórios.";
        this.hide = true;
        return;
      }

      if(this.dados.erro) {
        const formUser = {
          'gradua': this.trato,
          'tipo_doc': this.tipoDoc.trim(),
          'orgaoId': this.idOrgao,
          'documento': this.documento.trim(),
          'ubmId': this.idUbm,
          'nGuerra': this.nome.trim(),
          'cnh': this.tipoDoc === 'CNH' ? this.documento.trim() : '',
        }

        const newUser = await this.$userservice.adicionar(formUser, this.token);
        if (!newUser) {
          return res.json({
            erro: true, msg: 'Não foi possível salvar o usuário'
          }) 
        } 
      }

      this.form = {
        'nDoc': this.documento.trim(),
        'tDoc': this.tipoDoc,
        'name': `${this.trato} ${this.orgaoSigla} ${this.nome.toUpperCase()}`,
        'destino': this.destino.toUpperCase()
      }
      try {
        const salved = await this.$pedestreService.adicionar(this.form, this.token); // Exemplo de serviço de pedestre
        if (salved) {
          this.close() // this.$options.name será 'infoPedestre'
        } else {
          console.error('[infoPedestre.vue] Erro ao salvar dados do pedestre.');
          // Adicione aqui feedback ao utilizador sobre o erro
        }
      } catch (error) {
        console.error('[infoPedestre.vue] Erro na requisição de salvar pedestre:', error);
        // Adicione aqui feedback ao utilizador sobre o erro da rede/API
      }
    },
    close() {
      this.$emit('closeModal', { from: this.$options.name });
    }
  },
  computed: {
    showError() {
      const zeroPattern = /^0+$/;
      return (
        (!this.documento && this.formTouched) || 
        (this.documento && this.documento.length < 4) || 
        zeroPattern.test(this.documento) 
      );
    },
    
    errorMessage() {
      if (!this.documento && this.formTouched) return '* Obrigatório';
      if (this.documento && this.documento.length < 4)
        return '* Deve ter pelo menos 4 caracteres';
      if (/^0+$/.test(this.documento)) return '* O valor não pode ser apenas zeros';
      return '';
    },
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
    },
    docOptions() {
      return this.$dbDoc.doc.map(d => ({sigla: d.sigla, name: d.nome}))
    },
    convertToUpper() {
      this.nome ? this.nome = this.nome.toUpperCase() : '';
    }
  },

  mounted() {
    this.getUnidades();
    this.getOrgaos();
    this.tratoRegex = this.tratoOptions;
  }
}
</script>
