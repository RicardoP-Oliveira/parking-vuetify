export const getTableConfig = (tab) => {
  // 1. Estilos e Títulos das colunas REAIS (as que contêm dados)
  const columnsStyle = {
    placa: { width: 120, align: 'center', title: 'Placa' },
    marcaModelo: { width: 150, align: 'center', title: 'Modelo' },
    e_documento: { align: 'center', title: 'documento'},
    e_nomeCompleto: { width: 200, align: 'center', title: 'Condutor' },
    s_documento: { align: 'center', title: 'documento'},
    s_nomeCompleto: { width: 200, align: 'center', title: 'Condutor' },
    entrada: { width: 100, align: 'center', title: 'Data' },
    hEntrada: { width: 90, align: 'center', title: 'Hora' },
    saida: { width: 100, align: 'center', title: 'Data' },
    hSaida: { width: 90, align: 'center', title: 'Hora' },
    
    // Pedestre
    nome: { width: 250, align: 'center', title: 'Nome' },
    e_tipoDoc: { width: 130, align: 'center', title: 'Tipo Documento' },
    movDestino: { width: 110, align: 'center', title: 'Destino' },
  };

  // 2. Definição da Estrutura
  const configs = {
    VEICULO: {
      // REGRA: Se a coluna vai ser agrupada, coloque APENAS o nome do grupo aqui.
      // Removi 'eCondutor', 'entrada', etc., da lista principal.
      order: ['placa', 'marcaModelo', 'prefixo','entradaGroup', 'movDestino', 'saidaGroup'], 
      groups: {
        entradaGroup: {
          title: 'Entrada',
          children: [{key: 'e_documento'}, { key: 'e_nomeCompleto' }, { key: 'entrada' }, { key: 'hEntrada' }],
        },
        saidaGroup: {
          title: 'Saída', 
          children: [{key: 's_documento'}, { key: 's_nomeCompleto' }, { key: 'saida' }, { key: 'hSaida' }] 
        }
      }
    },
    PEDESTRE: {
      // Para pedestre, o Nome e Docs ficam fora, e as datas dentro dos grupos
      order: ['e_tipoDoc', 'e_documento', 'nome', 'movDestino', 'entradaGroup', 'saidaGroup'],
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