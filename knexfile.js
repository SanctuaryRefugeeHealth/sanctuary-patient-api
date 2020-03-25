module.exports = {
    client: "mysql",
    connection: {
        host: process.env.MYSQL_HOSTNAME,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB
    }
};
