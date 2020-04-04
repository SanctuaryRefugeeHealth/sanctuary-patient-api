
exports.up = (knex) => {
  return knex.schema.table("users", (table) => {
    table.string("email", 321).notNullable().unique().alter();
    table.text("password").notNullable().alter();
    table.text("salt").notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.table("users", (table) => {
    table.dropColumn("salt");
    table.dropUnique("email");
  })
    .then(() => 
       knex.schema.table("users", (table) => {
        table.text("email").nullable().alter();
        table.text("password").nullable().alter();
      })
    );
};
