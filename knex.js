import knex from "knex";
import { connection } from "./knexfile.js";
const knexConnection = knex(connection);
export const db = knexConnection;
