export default {
  development: {
    dialect: "postgres",
    host: "localhost",
    username: "rico",
    password: "pAtro@23",
    database: "ceics",
    define: {
      timestamps: true,
      timestampstz: true,
      underscored: true,
      underscoredAll: true,
    }
  },
  production: {
    dialect: "postgres",
    host: "localhost",
    username: "rico",
    password: "pAtro@23",
    database: "ceics",
    define: {
      timestamps: true,
      timestampstz: true,
      underscored: true,
      underscoredAll: true,
    }
  }
};