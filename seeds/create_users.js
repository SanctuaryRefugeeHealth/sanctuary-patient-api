exports.seed = (knex) => {
  return knex("appointments").del()
    .then(() => {
      return knex("users").insert({
        email: "one@test.com",
        // sanctuary
        password: "$2b$10$60mg6/S0Vm5Xia9feTHHm.uX50r7D5CxeUzxL7BOaCYop1GcxCDau"
      });
    });
};
