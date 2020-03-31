// const errs = require('restify-errors');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');




// module.exports = {
//   authenticate,
//   getToken,
// };


import { authenticate } from "./authenticate";
import { getToken } from "./getToken";

const auth = { getToken, authenticate };

export default auth;
