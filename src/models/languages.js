import { db } from "../../knex.js";

export const getAllLanguages = async () => {
  return db("languages").select("name").orderBy("name");
};
