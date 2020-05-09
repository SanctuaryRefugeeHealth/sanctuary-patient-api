
exports.up = (knex) => {
  return knex.schema.table("messages", (table) => 
    table.enum("language", ["english", "arabic", "spanish", "amharic", "somali", "turkish"]).alter()
  );
};

exports.down = (knex) => {
  return knex.schema.table("messages", (table) =>
    table.enum("language", ["english", "arabic", "spanish", "tigrinya", "somali", "turkish"]).alter()
  );
};
