export function up(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.text("email");
    table.text("password");
  });
}

export function down(knex) {
  return knex.schema.dropTable("users");
}
