module.exports = {
    client: "mysql",
    connection: {
        host: process.env.MYSQL_HOSTNAME || "localhost",
        port: process.env.MYSQL_PORT || "3306",
        user: process.env.MYSQL_USERNAME || "root",
        password: process.env.MYSQL_PASSWORD || "password",
        database: process.env.MYSQL_DB || "sanctuary_dev"
    }
};
