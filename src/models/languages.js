import { db } from "../../knex";

export const getAllLanguages = async () => {
  return db("languages").select("name").orderBy("name");
};
