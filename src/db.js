export default callback => {
    let knex = require("knex");
    const knexConfig = require("../knexfile");
    knex = knex(knexConfig);
    // connect to a database if needed, then pass it to `callback`:
    callback(knex);
};
