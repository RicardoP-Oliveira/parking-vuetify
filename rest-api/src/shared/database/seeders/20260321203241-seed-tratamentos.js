module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('tratamentos', [
      { sigla: 'Sd', nome: 'Soldado' },
      { sigla: 'Cb', nome: 'Cabo' },
      { sigla: '3º Sgt', nome: '3º Sargento' },
      { sigla: '2º Sgt', nome: '2º Sargento' },
      { sigla: '1º Sgt', nome: '1º Sargento' },
      { sigla: 'Subten', nome: 'Subtenente' },
      { sigla: '2º Ten', nome: '2º Tenente' },
      { sigla: '1º Ten', nome: '1º Tenente' },
      { sigla: 'Cap', nome: 'Capitão' },
      { sigla: 'Maj', nome: 'Major' },
      { sigla: 'Ten Cel', nome: 'Tenente-Coronel' },
      { sigla: 'Cel', nome: 'Coronel' },
      { sigla: 'Sr.(a)', nome: 'Senhor(a)' },
      { sigla: 'Dr.(a)', nome: 'Doutor(a)' },
      { sigla: 'Eng.(a)', nome: 'Engenheiro(a)' },
      { sigla: 'Insp.(a)', nome: 'Inspetor(a)' },
      { sigla: 'Prof.(a)', nome: 'Professor(a)' },
      { sigla: 'Ag.', nome: 'Agente' },
      { sigla: 'Sd RR', nome: 'Soldado Reserva Remunerada' },
      { sigla: 'Cb RR', nome: 'Cabo Reserva Remunerada' },
      { sigla: '3º Sgt RR', nome: '3º Sargento Reserva Remunerada' },
      { sigla: '2º Sgt RR', nome: '2º Sargento Reserva Remunerada' },
      { sigla: '1º Sgt RR', nome: '1º Sargento Reserva Remunerada' },
      { sigla: 'Subten RR', nome: 'Subtenente Reserva Remunerada' },
      { sigla: '2º Ten RR', nome: '2º Tenente Reserva Remunerada' },
      { sigla: '1º Ten RR', nome: '1º Tenente Reserva Remunerada' },
      { sigla: 'Cap RR', nome: 'Capitão Reserva Remunerada' },
      { sigla: 'Maj RR', nome: 'Major Reserva Remunerada' },
      { sigla: 'Ten Cel RR', nome: 'Tenente-Coronel Reserva Remunerada' },
      { sigla: 'Cel RR', nome: 'Coronel Reserva Remunerada' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tratamentos', null, {});
  }
};