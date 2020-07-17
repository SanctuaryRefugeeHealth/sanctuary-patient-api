import { db } from "../../knex";

const getAll = async () => {
  return db("languages").select("name");
};

const getByLanguageString =  async (language) => {
  return db("languages").select("name").where({ name: language }).first();
};

export default {
  getAll,
  getByLanguageString,
};
