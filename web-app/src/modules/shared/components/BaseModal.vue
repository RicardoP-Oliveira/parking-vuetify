<template>
  <v-dialog
    v-model="isOpenInternal"
    :width="width"
    persistent>
    <v-card>
      <v-card-title class="text-center">
        {{ title }}
        <v-divider class="mt-4"></v-divider>
      </v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <template v-slot:actions v-if="!hideActions">
        <v-spacer />
        <v-btn @click="$emit('close')" variant="tonal">
          Cancelar
        </v-btn>
        <v-btn
          ref="confirmButtonRef"
          @click="$emit('confirm')"
          :color="confirmColor"
          :disabled="confirmButton"
          variant="flat"
          min-width="120"
        >
          {{ confirmText }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'

const confirmButtonRef= ref(null)
const getConfirmButtonEl = () => {
  return confirmButtonRef.value?.$el
}

defineExpose({
  getConfirmButtonEl
})

const props = defineProps({
  title: String,
  isOpen: Boolean,
  confirmButton: Boolean,
  hideActions: Boolean,
  width: { type: [String, Number], default: 600 },
  confirmText: { type: String, default: 'Salvar' },
  confirmColor: { type: String, default: 'blue-darken-4' },
})

const emit = defineEmits(['confirm', 'close', 'update:isOpen'])

const isOpenInternal = computed({
  get: () => props.isOpen,
  set: (val) => emit('update:isOpen', val) 
})
</script>