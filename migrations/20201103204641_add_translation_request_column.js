exports.up = async function (knex) {
  await knex.schema.table("appointments", (table) => {
    table.boolean("translator");
  });
};

exports.down = function (knex) {
  return knex.schema.table("appointments", (table) => {
    table.dropColumn("translator");
  });
};
