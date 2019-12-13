let knex = require("knex");
const knexConfig = require("../knexfile");
knex = knex(knexConfig);
exports.db = knex;
