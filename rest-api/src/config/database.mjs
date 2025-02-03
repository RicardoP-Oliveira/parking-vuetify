export default  {
  dialect: 'postgres',
  host: '172.24.137.60',
  username: 'docker',
  password: 'patro233',
  database: 'guardaCeics',
  define: {
    timestamps: true,
    timestampstz: true,
    underscored: false,
    underscoredAll: false,
  }
};
