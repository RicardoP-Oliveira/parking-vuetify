<template>
  <v-dialog ref="baseModal"v-model="isOpenInternal" :width="width" persistent>
    <v-card>
      <v-card-title class="text-center">
        {{ title }}
        <v-divider class="mt-4"></v-divider>
      </v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <template v-slot:actions>
        <v-spacer />
        <v-btn @click="close()" variant="tonal">
          Cancelar
        </v-btn>
        <v-btn
          ref="myButton"
          @click="confirm()"
          :color="confirmColor"
          variant="flat"
          min-width="120"
        >
          {{ confirmText }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    width: {
      type: [String, Number],
      default: 600,
    },
    confirmText: {
      type: String,
      default: 'Salvar',
    },
    confirmColor: {
      type: String,
      default: 'blue-darken-4',
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    documento: {
      type: String,
      default: '',
    }
  },
  emits: ['confirm', 'close'],
  data() {
    return {
      document: this.documento,
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    confirm() {
      this.$emit('confirm');
    },
    setFocus() {
      const button = this.$refs.myButton.$el;
      this.$nextTick(() => {
        // const identField = this.$refs.ident;
        if (button) {
          button.blur(); // Remove o foco
          setTimeout(() => {
            button.focus(); // Foca novamente
          }, 100); // Pequeno atraso para garantir que o foco seja redefinido
        }
      });
    }
  },
  computed: {
    isOpenInternal: {
      get() {
        return this.isOpen;
      },
      set(value) {
        this.$emit('update:isOpen', value);
      },
    },
  },
  mounted() {
    setTimeout(() => {
      if (this.documento) {
        this.document = this.documento;
        this.setFocus();
      }
    },100)
  },
}
</script>
