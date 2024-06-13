const db = require("knex")(require("../knexfile"));
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_KEY = crypto.randomBytes(32).toString("base64");

const authorize = (req, res, next) => {
  const token = req.cookies.token;
  console.log(req.cookies);

  if (!token) {
    return res.status(401).json({ message: "No JWT provided" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_KEY);
    req.decoded = decodedToken;
    next();
  } catch (err) {
    return res.status(498).json({ message: "Token validation failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  //making sure the two hashes match
  const response = await db("admin_users")
    .where({ email: email })
    .andWhere({ password: password });

  if (response.length === 0) {
    res.status(404).json({ message: "Authentication Failed" });
  } else {
    try {
      const token = jwt.sign({ name: req.body.real_email }, JWT_KEY, {
        expiresIn: "1h",
      });

      // Set the token in an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Use true if you are using HTTPS
        sameSite: "Strict", // Options: 'Strict', 'Lax', 'None'
      });
      res.status(200).json({message: "Login Successful"});

    } catch (error) {
      res.status(401).json({
        error: {
          message: "ERROR",
        },
      });
    }
  }

  // If there's an error, send that back to the client
  // with a 401 status code.
};

const access = async(req,res) => {
  console.log("Hi!!");
}

//this function is not secured at the moment...
const setImageDisplayById = async(req,res) => {
  try {
    const response = await db("public_images_controller").where({id: req.params.id}).update({display: req.query.display});
    res.status(200).json({message: "Database Updated!"});
  } catch (error) {

  }
}

module.exports = {
  authorize,
  login,
  access,
  setImageDisplayById
};
