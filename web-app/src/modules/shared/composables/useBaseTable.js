// src/modules/shared/composables/useBaseTable.js
import { ref, watch, onUnmounted } from 'vue'
import { getTableConfig } from '@/core/config/headersConfig'

export function useBaseTable(props) {
	const serverItems = ref([])
	const loading = ref(false)
	const generatedHeaders = ref([])

	let debounceTimer = null

	const token = `Bearer ${localStorage.getItem('token')}`

	// Geração de headers (igual ao atual)
	const generateHeaders = () => {
		const { style, structure } = getTableConfig(props.tab)
		const headers = []

		structure.order.forEach((key) => {
			if (structure.groups && structure.groups[key]) {
				const group = structure.groups[key]
				headers.push({
					title: group.title,
					align: 'center',
					children: group.children.map((child) => {
						const col = style[child.key] || {}
						return {
							key: child.key,
							title: col.title || child.key,
							align: col.align || 'center',
							width: col.width || 100,
							...(col.headerProps ? { headerProps: col.headerProps } : {}),
							...(col.cellProps ? { cellProps: col.cellProps } : {})
						}
					})
				})
			} else {
				const col = style[key] || {}
				headers.push({
					key,
					title: col.title || key,
					align: col.align || 'center',
					width: col.width || 100,
					...(col.class ? { class: col.class } : {}),
					...(col.cellClass ? { cellClass: col.cellClass } : {})
				})
			}
		})
		generatedHeaders.value = headers
	}

	// Busca sem paginação — a API já retorna no máximo 50 registros (decrescente)
	const loadItems = async () => {
		if (loading.value) return
		loading.value = true

		const { structure } = getTableConfig(props.tab)
		const allActiveKeys = structure.order.flatMap(key =>
			structure.groups[key] ? structure.groups[key].children.map(c => c.key) : key
		)

		try {
			const res = await props.dataService(token, props.tab, props.filters)
			const responseData = (res && res[0]) ? res[0] : {}
			const listaCrua = Array.isArray(responseData.dados) ? responseData.dados : []

			generateHeaders()

			serverItems.value = listaCrua.map(item => {
				const filteredItem = {}

				allActiveKeys.forEach(column => {
					switch (column) {
						case 'nome': filteredItem.nome = item.nome; break
						case 'entrada': filteredItem.entrada = item.entrada ? new Date(item.entrada).toLocaleDateString() : ''; break
						case 'hEntrada': filteredItem.hEntrada = item.hEntrada ?? ''; break
						case 'saida': filteredItem.saida = item.saida ? new Date(item.saida).toLocaleDateString() : ' ___/___/___'; break
						case 'hSaida': filteredItem.hSaida = item.hSaida ?? '--:--:--'; break
						default: filteredItem[column] = item[column] ?? ''
					}
				})
				return filteredItem
			})
		} catch (error) {
			console.error('Erro ao carregar itens:', error)
		} finally {
			loading.value = false
		}
	}

	// Carrega no mount e a cada troca de tab
	watch(() => props.tab, () => {
		serverItems.value = []
		loadItems()
	}, { immediate: true })

	// Filtros com debounce (igual ao atual)
	watch(() => props.filters, () => {
		if (debounceTimer) clearTimeout(debounceTimer)
		debounceTimer = setTimeout(() => {
			loadItems()
		}, 500)
	}, { deep: true })

	onUnmounted(() => {
		if (debounceTimer) clearTimeout(debounceTimer)
	})

	return {
		serverItems,
		loading,
		generatedHeaders,
		loadItems
	}
}