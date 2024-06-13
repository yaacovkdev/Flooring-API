const db = require("knex")(require("../knexfile"));

const authorize = async (req, res, next) => {
  try {
    if (req.params.id) {
      const responseTexts = await db("contract_descriptions")
        .select("display")
        .where({ id: req.params.id });

      if (responseTexts[0] && responseTexts[0].display) next();
      else res.status(418).json({ message: "This pot has no tea..." });
    } else {
      throw Error("No Id Given");
    }
  } catch (error) {
    res.status(404).json({ message: "No Image with the name" });
  }
};

//get preview info for only one project
const _fetchProjectInfoById = async (req, _res) => {
  try {
    const responseText = await db("contract_descriptions")
      .select("id", "name", "description", "dir")
      .where({ id: req.params.id })
      .andWhere({ display: 1 });

    let responseImage;

    if (req.preview) {
      responseImage = await db("public_images_controller")
        .select("id", "name")
        .where({ type: "work" })
        .andWhereLike("name", "pre_%")
        .andWhereLike("dir", `%${responseText[0].dir}%`);

      if (responseImage.length === 0) {
        responseImage = await db("public_images_controller")
          .select("id", "name")
          .where({ type: "work" })
          .andWhere({ display: 1 })
          .andWhereLike("dir", `%${responseText[0].dir}%`);
      }
    } else {
      responseImage = await db("public_images_controller")
        .select("id", "name")
        .where({ type: "work" })
        .andWhere({ display: 1 })
        .andWhereLike("dir", `%${responseText[0].dir}%`);
    }

    if (responseImage.length === 0 || responseText.length === 0)
      throw new Error();

    delete responseText[0].dir;
    //return info for only one project
    return Object.assign(
      {
        images: req.preview
          ? new Array(responseImage[0])
          : new Array(...responseImage),
      },
      responseText[0]
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//return all projects with all info
const _fetchAllProjectsInfo = async (req, _res) => {
  try {
    const responseText = await db("contract_descriptions")
      .select("id", "name", "description", "dir")
      .where({ display: 1 });

    const projects_data = [];

    for (let i = 0; i < responseText.length; i++) {
      let responseImage;
      if (req.preview) {
        //looks for first image with pre_ at the start of name to get defined preview
        responseImage = await db("public_images_controller")
          .select("id", "name")
          .where({ type: "work" })
          .andWhereLike("name", "pre_%")
          .andWhereLike("dir", `${responseText[i].dir}%`);

        if (responseImage.length === 0) {
          responseImage = await db("public_images_controller")
            .select("id", "name")
            .where({ type: "work" })
            .andWhere({ display: 1 })
            .andWhereLike("dir", `${responseText[i].dir}%`);
        }
      } else {
        responseImage = await db("public_images_controller")
          .select("id", "name")
          .where({ type: "work" })
          .andWhere({ display: 1 })
          .andWhereLike("dir", `${responseText[i].dir}%`);
      }

      //add the project data to the response

      delete responseText[0].dir;

      projects_data.push(
        Object.assign(
          {
            images: req.preview
              ? new Array(responseImage[0])
              : new Array(...responseImage),
          },
          responseText[i]
        )
      );
    }
    return projects_data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//get one project switcher and fetch functions
//--------------------------------------------
const getProjectId = async (req, res) => {
  req["preview"] = "preview" in req.query;
  try {
    const data = await _fetchProjectInfoById(req, res);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ message: "Get Projects Error" });
  }
};
//--------------------------------------------

//get all projects switcher and fetch functions
//--------------------------------------------
const getAllProjects = async (req, res) => {
  req["preview"] = "preview" in req.query;
  try {
    const data = await _fetchAllProjectsInfo(req, res);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ message: "Get Projects Error" });
  }
};
//--------------------------------------------

module.exports = { authorize, getProjectId, getAllProjects };
