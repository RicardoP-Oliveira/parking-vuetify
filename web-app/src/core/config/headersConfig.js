export const getTableConfig = (tab) => {
  // 1. Estilos e Títulos das colunas REAIS (as que contêm dados)
  const columnsStyle = {
    placa: { width: 120, align: 'center', title: 'Placa' },
    // marcaModelo: { width: 150, align: 'center', title: 'Modelo' },
    documento_entrada: { align: 'center', title: 'documento' },
    user_entrada: { width: 200, align: 'center', title: 'Condutor' },
    documento_saida: { align: 'center', title: 'documento' },
    user_saida: { width: 200, align: 'center', title: 'Condutor' },
    entrada: { width: 100, align: 'center', title: 'Data' },
    hEntrada: { width: 90, align: 'center', title: 'Hora' },
    saida: { width: 100, align: 'center', title: 'Data' },
    hSaida: { width: 90, align: 'center', title: 'Hora' },

    // Pedestre
    nome: { width: 250, align: 'center', title: 'Nome' },
    e_tipoDoc: { width: 130, align: 'center', title: 'Tipo Documento' },
    destino: { width: 110, align: 'center', title: 'Destino' },
  };

  // 2. Definição da Estrutura
  const configs = {
    VEICULO: {
      // REGRA: Se a coluna vai ser agrupada, coloque APENAS o nome do grupo aqui.
      // Removi 'eCondutor', 'entrada', etc., da lista principal.
      order: ['placa', 'prefixo', 'entradaGroup', 'destino_sigla', 'saidaGroup'],
      groups: {
        entradaGroup: {
          title: 'Entrada',
          children: [{ key: 'documento_entrada' }, { key: 'user_entrada' }, { key: 'entrada' }, { key: 'hEntrada' }],
        },
        saidaGroup: {
          title: 'Saída',
          children: [{ key: 'documento_saida' }, { key: 'user_saida' }, { key: 'saida' }, { key: 'hSaida' }]
        }
      }
    },
    PEDESTRE: {
      // Para pedestre, o Nome e Docs ficam fora, e as datas dentro dos grupos
      order: ['e_tipoDoc', 'documento_entrada', 'nome', 'destino', 'entradaGroup', 'saidaGroup'],
      groups: {
        entradaGroup: {
          title: 'Entrada',
          children: [{ key: 'entrada' }, { key: 'hEntrada' }]
        },
        saidaGroup: {
          title: 'Saída',
          children: [{ key: 'saida' }, { key: 'hSaida' }]
        }
      }
    }
  };

  return {
    style: columnsStyle,
    structure: configs[tab]
  };
};