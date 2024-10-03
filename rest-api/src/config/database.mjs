export default  {
  dialect: 'postgres',
  host: '127.0.0.1',
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
