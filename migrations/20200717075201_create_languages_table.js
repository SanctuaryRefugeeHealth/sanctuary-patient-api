exports.up = (knex) => {
    return knex.schema
      .createTable("languages", (table) => {
        table.string("name").primary();
      })
      .then(() => {
        return knex("languages").insert([
            {name:"English"},
            {name:"Arabic"},
            {name:"Spanish"},
            {name:"Tigrinya"},
            {name:"Somali"},
            {name:"Turkish"},
        ]);
      });
  };
  
  exports.down = (knex) => {
    return knex.schema.dropTableIfExists("languages");
  };
  