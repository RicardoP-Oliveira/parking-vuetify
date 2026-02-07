// scr/composables/usePedestreTable.js
export function usePedestreTable(pedestreService) {
    const loadPedestreData = async (
        page,
        itemsPerPage,
        token,
        tab,
        filters
    ) => {
        const apiFilters = {
            documento: filters.documento,
            pedestre: filters.condutor,
            dataInicio: filters.dataInicio
                ? filters.dataInicio.toISOString().split('T')[0]
                : null,
            dataFim: filters.dataFim
                ? filters.dataFim.toISOString().split('T')[0]
                : null,
            horaInicio: filters.horaInicio,
            horaFim: filters.horaFim,
        };

        // remove filtros vazios
        Object.keys(apiFilters).forEach((key) => {
            if (apiFilters[key] === null || apiFilters[key] === '') {
                delete apiFilters[key];
            }
        });

        return pedestreService.getTodos(
            page,
            itemsPerPage,
            token,
            tab,
            apiFilters
        )
    };

    const headerOrder = () => [
        'docId',
        'nDoc',
        'name',
        'destino',
        'entrada',
        'saida'
    ];

    const setColumns = () => [
        'docId',
        'nDoc',
        'name',
        'destino',
        'entrada',
        'hEntrada',
        'saida',
        'hSaida'
    ]

    const setHeaderGroups = () => ({
        entrada: {
            title: 'Entrada',
            children: [
                { key: 'entrada', title: 'Data'},
                { key: 'hEntrada', title: 'Hora'}
            ]
        },
        saida : {
            title: 'Saida',
            children: [
                { key: 'saida', title: 'Data'},
                { key: 'hSaida', title: 'Hora'}
            ]
        }
    });

    return {
        loadPedestreData,
        headerOrder,
        setColumns,
        setHeaderGroups
    };
}