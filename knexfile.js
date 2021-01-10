module.exports = {
  client: "mysql",
  connection: {
    host: process.env.MYSQL_HOSTNAME || "localhost",
    port: process.env.MYSQL_PORT || "3306",
    user: process.env.MYSQL_USERNAME || "root",
    password: process.env.MYSQL_PASSWORD || "password",
    database: process.env.MYSQL_DB || "sanctuary_dev",
    debug: process.env.NODE_ENV === "development",
    typeCast: function (field, next) {
      // Knex's default DATETIME behaviour adds a timezone which we do not want
      if (field.type === "DATETIME") {
        return field.string();
      }
      return next();
    },
  },
};
