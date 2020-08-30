exports.up = async (knex) => {
  await knex.schema.table("appointments", (table) => {
    table.dropColumn("practitionerName");
    table.dropColumn("practitionerClinicName");
    table.dropColumn("practitionerPhoneNumber");
    table.text("description");
    table.text("specialNotes");
  });
};

exports.down = async (knex) => {
  await knex.schema.table("appointments", (table) => {
    table.text("practitionerName").notNullable();
    table.text("practitionerClinicName").notNullable();
    table.text("practitionerPhoneNumber").notNullable();
    table.dropColumn("description");
    table.dropColumn("specialNotes");
  });
};
