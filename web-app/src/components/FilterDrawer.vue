<template>
  <v-navigation-drawer
    v-model="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    class="bg-deep-purple"
    location="left"
  >
    <v-list density="compact" nav class="px-4">
      <v-list-item nav class="text-center">
        <v-icon size="40">mdi-account-circle</v-icon>
      </v-list-item>
      <v-divider class="my-2"></v-divider>
            
      <v-list-item v-for="(config, key) in dynamicFilters" :key="key">

        <v-text-field
          v-if="config.type === 'text'" 
          v-model="filters[key]"
          :label="config.label"
          variant="outlined"
          density="compact"
          clearable
        />

        <v-menu
          v-else-if="config.type === 'date'"
          v-model="menus[key]"
          :close-on-content-click="false"
          location="end"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              :model-value="filters[key] ? new Date(filters[key]).toLocaleDateString('pt-BR') : ''"
              :label="config.label"
              variant="outlined"
              density="compact"
              readonly
              v-bind="props"
              clearable
              :disabled="config.dependsOn ? !filters[config.dependsOn] : false"
              @click:clear="filters[key] = null"
            />
          </template>
          <v-date-picker
            v-model="filters[key]"
            :min="config.dependsOn ? filters[config.dependsOn] : null"
            @update:model-value="menus[key] = false"
          />
        </v-menu>

        <v-menu
          v-else-if="config.type === 'time'"
          v-model="menus[key]"
          :close-on-content-click="false"
          location="end"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="filters[key]"
              :label="config.label"
              variant="outlined"
              density="compact"
              readonly
              v-bind="props"
              clearable
              :disabled="config.dependsOn ? !filters[config.dependsOn] : false"
              @click:clear="filters[key] = null"
            />
          </template>
          <v-time-picker
            v-model="filters[key]"
            format="24hr"
            @update:model-value="menus[key] = false" />
        </v-menu>
      </v-list-item>
      
      <v-btn color="grey-darken-2" block @click="$emit('clear-all')"> Limpar Filtros </v-btn>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { getFiltersByTab } from '@/config/filtersConfig'
import { watch } from 'vue'

const props = defineProps(['modelValue', 'tab', 'filters'])
const modelValue= defineModel()
const emit = defineEmits(['clearl-all'])
const menus = ref({})
const dynamicFilters = computed(() => getFiltersByTab(props.tab))

watch(() => props.filters,
  (newFilters) => {
    Object.keys(newFilters).forEach(key => {
      const value = newFilters[key]
      if (value && typeof value === 'string') {
        const upperValue = value.toUpperCase()

        if (value !== upperValue) {
          props.filters[key] = upperValue
        }
      }
    })
  }, { deep: true }
  )
</script>