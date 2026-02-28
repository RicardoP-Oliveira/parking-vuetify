<template>
  <v-dialog
    v-model="isOpenInternal"
    :width="width"
    :retain-focus="false"
    persistent>
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
          :disabled="confirmButton"
        >
          {{ confirmText }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { nextTick } from 'vue';

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
    confirmButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirm', 'close'],
  methods: {

    async saveCarro(payload) {
      console.log('[saveCarro] ', payload)
    },

    async savePedestre(payload) {
      console.log('[savePedestre] ', payload)
    },

    close() {
      this.$emit('close', 'cancel');
    },
    confirm() {
      this.$emit('confirm');
    },
    setFocus() {
      nextTick(() => {
        const button = this.$refs.myButton?.$el;

        if (!button) return
        setTimeout(() => {
          button.focus()
        },200)
      })
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
     this.setFocus()
    },100)
  },
}
</script>
