const db = require("knex")(require("../knexfile"));
const path = require("path");

const authorize = async (req, res, next) => {
  try {
    if (req.params.name) {
      const response = await db("public_images_controller")
        .select("display")
        .where("name", "like", `%${req.params.name}%`);
      if (response[0] && response[0].display) next();
      else res.status(418).json({ message: "This pot has no tea..." });
    } else if (req.params.id) {
      const response = await db("public_images_controller")
        .select("display")
        .where({ id: req.params.id });
      if (response[0] && response[0].display) next();
      else res.status(418).json({ message: "This pot has no tea..." });
    }
  } catch (error) {
    res.status(404).json({ message: "No Image with the name" });
  }
};

//returns image
const getImageByName = async (req, res) => {
  try {
    const response = await db("public_images_controller")
      .select("id", "name", "type")
      .where("name", "like", `%${req.params.name}%`)

    const imagePath = `..\\${response[0].dir}`;

    res.status(200).sendFile(path.join(__dirname, imagePath));
  } catch (error) {
    res.status(404).json({ message: "Getting Image Error" });
  }
};

const getImageByNameText = async (req, res) => {
  try {
    const response = await db("hero_titles")
      .select("body")
      .where("file_name", "like", `%${req.params.name}%`);

    res.status(200).json(response[0]);
  } catch (error) {
    res.status(404).json({ message: "Getting Image Error" });
  }
};

const getImageById = async (req, res) => {
  try {
    const response = await db("public_images_controller")
      .select("*")
      .where({ id: req.params.id });

    const imagePath = `..\\${response[0].dir}`;

    res.status(200).sendFile(path.join(__dirname, imagePath));
  } catch (error) {
    res.status(404).json({ message: "Getting Image Error" });
  }
};

const getImageByIdText = async (req, res) => {
  try {
    const response = await db("hero_titles")
      .select("body")
      .where({ image_id: req.params.id });

    res.status(200).json(response[0]);
  } catch (error) {
    res.status(404).json({ message: "Getting Image Error" });
  }
};

const getImagesByType = async (req, res) => {
  try {
    const response = await db("public_images_controller")
      .select("id", "name")
      .where({ type: req.params.type, display: 1 });

    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: "Getting Image Error", error });
  }
};

const getImagesByProjectName = async (req, res) => {
  try {
    const response = await db("")
  } catch (error) {
    res.status(404).json({ message: "Getting Image Error", error });
  }
};

module.exports = {
  authorize,
  getImageByName,
  getImageByNameText,
  getImageById,
  getImageByIdText,
  getImagesByType,
  getImagesByProjectName,
};
