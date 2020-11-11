exports.up = async (knex) => {
  await knex("languages").insert({ name: "Tigrinya" });
};

exports.down = async (knex) => {
  await knex("languages").where({ name: "Tigrinya" }).del();
};
