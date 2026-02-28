// src/composables/useServerTable.js
import { ref } from 'vue'

export function useServerTable(loadData) {
  const page = ref(1)
  const itemsPerPage = ref(50)
  const sortBy = ref([])
  const loading = ref(false)
  const items = ref([])
  const totalItems = ref(0)

  async function fetchData(tab, filters) {
    loading.value = true
    try {
      const response = await loadData(
        page.value,
        itemsPerPage.value,
        null,
        tab,
        filters
      )

      items.value = response.data
      totalItems.value = response.total
    } finally {
      loading.value = false
    }
  }

  /** 🔥 AQUI estava o erro */
  function onUpdateOptions(options) {
    if (options.page !== undefined) {
      page.value = options.page
    }

    if (options.itemsPerPage !== undefined) {
      itemsPerPage.value = options.itemsPerPage
    }

    if (options.sortBy !== undefined) {
      sortBy.value = options.sortBy
    }
  }

  return {
    page,
    itemsPerPage,
    sortBy,
    loading,
    items,
    totalItems,
    fetchData,
    onUpdateOptions,
  }
}
