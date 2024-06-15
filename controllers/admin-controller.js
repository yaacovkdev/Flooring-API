const db = require("knex")(require("../knexfile"));
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_KEY = "K1HqhFRJx69Wyi0CHN9GffJgJC0tbhms/tvIv+aZOW8=";

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
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
        sameSite: "Strict",
      });
      res.status(200).json({ message: "Login Successful" });
    } catch (error) {
      res.status(401).json({
        error: {
          message: "ERROR",
        },
      });
    }
  }
};

const checkStatus = async (req, res) => {
  res.status(200).json({ message: "Token Approved" });
};

const getData = async (_req, res) => {
  try {
    const responseText = await db("contract_descriptions").select("*");
    const responseHeroTitles = await db("hero_titles").select("*");
    const responseImagesController = await db(
      "public_images_controller"
    ).select("*");

    const projects_data = [];

    for (let i = 0; i < responseText.length; i++) {
      const responseImage = await db("public_images_controller")
        .select("*")
        .whereLike("dir", `${responseText[i].dir}%`);

      projects_data.push(
        Object.assign({ images: responseImage }, responseText[i])
      );
    }
    res.status(200).json({
      hero_titles: responseHeroTitles,
      images_controller: responseImagesController,
      projects: projects_data,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Access Failed" });
  }
};

//this function is not secured at the moment...
const setImageDisplayById = async (req, res) => {
  try {
    await db("public_images_controller")
      .where({ id: req.params.id })
      .update({ display: req.query.display });
    res.status(200).json({ message: "Database Updated" });
  } catch (error) {
    res.status(404).json({ message: "Error Updating Database" });
  }
};

const getImageControllerById = async (req, res) => {
  try {
    const response = await db("public_images_controller")
      .select("*")
      .where({ id: req.params.id });

    res.status(200).json(response[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Image info failed" });
  }
};

module.exports = {
  authenticate,
  login,
  checkStatus,
  getData,
  setImageDisplayById,
  getImageControllerById,
};
