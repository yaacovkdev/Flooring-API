const db = require("knex")(require("../knexfile"));

const authorize = async (req, res, next) => {
  try {
    if (req.params.name) {
      //check for permission to show public image and public text from two tables

      const responseTexts = await db("contract_descriptions")
        .select("display")
        .where({ project_name: req.params.name });

      if (responseTexts[0] && responseTexts[0].display) next();
      else res.status(418).json({ message: "This pot has no tea..." });
    }
  } catch (error) {
    res.status(404).json({ message: "No Image with the name" });
  }
};

const getProjectNames = async (req, res) => {
  try {
    const response = await db("contract_descriptions")
      .select("project_name")
      .where({ display: 1 });

    res.status(200).json(response);
  } catch (err) {
    res.status(404).json({ message: "Project Names Error" });
  }
};

const getDescByName = async (req, res) => {
  try {
    const response = await db("contract_descriptions")
      .select("description")
      .where({ project_name: req.params.name });

    res.status(200).json(response[0]);
  } catch (err) {
    res.status(404).json({ message: "Project Names Error" });
  }
};

module.exports = {
  authorize,
  getProjectNames,
  getDescByName,
};
