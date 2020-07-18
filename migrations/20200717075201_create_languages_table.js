exports.up = (knex) => {
  return knex.schema
    .createTable("languages", (table) => {
      table.string("name", 255).primary();

      table.charset("utf8");
    })
    .then(() => {
      return knex("languages").insert([
        { name: "English" },
        { name: "Arabic" },
        { name: "Spanish" },
        { name: "Amharic" },
        { name: "Somali" },
        { name: "Turkish" },
      ]);
    });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists("languages");
};
