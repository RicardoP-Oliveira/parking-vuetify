// src/composables/usePedestreTable.js
export function usePedestreTable(pedestreService) {

	const loadPedestreData = async (page, itemsPerPage, token, tab, filters) => {

		const apiFilters = {
			documento: filters.documento,
			condutor: filters.condutor,
			dataInicio: filters.dataInicio instanceof Date
				? filters.dataInicio.toISOString().split('T')[0]
				: null,
			dataFim: filters.dataFim instanceof Date
				? filters.dataFim.toISOString().split('T')[0]
				: null,
			horaInicio: filters.horaInicio,
			horaFim: filters.horaFim,
		};

		const cleanFilters = Object.fromEntries(
			Object.entries(apiFilters).filter(([_, v]) => v != null && v !== '')
		);

		return pedestreService.getTodos(
			page,
			itemsPerPage,
			token,
			tab,
			cleanFilters
		);
	};

	return {
		loadPedestreData
	};
}