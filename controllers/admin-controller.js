const db = require("knex")(require("../knexfile"));
const jwt = require("jsonwebtoken");

const JWT_KEY = "84b5641573f5e73af3fc6c0857d3e17a6476d29354769a7acf742ce42577fb97";