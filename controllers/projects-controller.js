const db = require("knex")(require("../knexfile"));

const authorize = async (req, res, next) => {
  try {
    if (req.params.name) {

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

//get full info for only 1 project
const _fetchFullProjectInfo = async (req, _res) => {
  try {
    const responseImage = await db("public_images_controller")
      .select("id", "name")
      .where({ type: "work" })
      .andWhere({ display: 1 })
      .andWhereLike("dir", `%${req.params.name}%`);

    const responseText = await db("contract_descriptions")
      .select("project_name", "description")
      .where({ project_name: req.params.name })
      .andWhere({ display: 1 });

    if (responseImage.length === 0 || responseText.length === 0)
      throw new Error();

    //return info for only one project
    return Object.assign(
      { images: new Array(...responseImage) },
      responseText[0]
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//get preview info for only one project
const _fetchPreviewProjectInfo = async (req, _res) => {
  try {
    let responseImage = await db("public_images_controller")
      .select("id", "name")
      .where({ type: "work" })
      .andWhere({ display: 1 })
      .andWhereLike("dir", `%${req.params.name}%`)
      .andWhereLike("name", `pre_%`);

    if (responseImage.length === 0) {
      responseImage = await db("public_images_controller")
        .select("id", "name")
        .where({ type: "work" })
        .andWhere({ display: 1 })
        .andWhereLike("dir", `%${req.params.name}%`);
    }

    const responseText = await db("contract_descriptions")
      .select("project_name", "description")
      .where({ project_name: req.params.name })
      .andWhere({ display: 1 });

    if (responseImage.length === 0 || responseText.length === 0)
      throw new Error();

    //return info for only one project
    return Object.assign(
      { images: new Array(responseImage[0]) },
      responseText[0]
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//return all projects with all info
const _fetchAllProjectsInfo = async () => {
  try {
    const responseText = await db("contract_descriptions")
      .select("id", "name", "description", "dir")
      .where({ display: 1 });

    const projects_data = [];

    for (let i = 0; i < responseText.length; i++) {
      const responseImage = await db("public_images_controller")
        .select("id", "name")
        .where({ type: "work" })
        .andWhere({ display: 1 })
        .andWhereLike("dir", `%${responseText[i].dir}%`);
      console.log(responseImage, responseText[i].dir);

      //add the project data to the response
      projects_data.push(
        Object.assign({ images: new Array(...responseImage) }, responseText[i])
      );
    }
    return projects_data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//return all projects with preview info
const _fetchAllPreviewProjectsInfo = async () => {
  try {
    const responseText = await db("contract_descriptions")
    .select("id", "name", "description", "dir")
      .where({ display: 1 });

    const projects_data = [];

    for (let i = 0; i < responseText.length; i++) {
      const responseImage = await db("public_images_controller")
        .select("id", "name")
        .where({ type: "work" })
        .andWhere({ display: 1 })
        .andWhereLike("dir", `${responseText[i].dir}%`);
      
      console.log(responseImage);

      projects_data.push(
        Object.assign({ images: new Array(responseImage[0]) }, responseText[i])
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
const _fetchProjectFull = async (req, res) => {
  try {
    const data = await _fetchFullProjectInfo(req, res);

    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ message: "Get Project Preview Error" });
  }
};

const _fetchProjectPreview = async (req, res) => {
  try {
    const data = await _fetchPreviewProjectInfo(req, res);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ message: "Get Project Error" });
  }
};

const getProject = async (req, res) => {
  if ("preview" in req.query) {
    await _fetchProjectPreview(req, res);
  } else {
    await _fetchProjectFull(req, res);
  }
};
//--------------------------------------------

//get all projects switcher and fetch functions
//--------------------------------------------
const _fetchAllProjectFull = async (req, res) => {
  try {
    const data = await _fetchAllProjectsInfo(req, res);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ message: "Get Projects Error" });
  }
};

const _fetchAllProjectPreview = async (req, res) => {
  try {
    const data = await _fetchAllPreviewProjectsInfo(req, res);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ message: "Get Projects Preview Error" });
  }
};

const getAllProjects = async (req, _res) => {
  if ("preview" in req.query) {
    await _fetchAllProjectPreview(req, _res);
  } else {
    await _fetchAllProjectFull(req, _res);
  }
};
//--------------------------------------------

module.exports = { authorize, getProject, getAllProjects };
