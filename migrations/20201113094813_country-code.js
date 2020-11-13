exports.up = async (knex) => {
  await knex("appointments").update(
    "patientPhoneNumber",
    knex.raw('CONCAT("+1", patientPhoneNumber )')
  );
};

exports.down = (knex) => {};
