const router = require("express").Router();
const path = require("path");
const projectsController = require(path.join(
  __dirname,
  "../controllers/projects-controller"
));

router.route("/").get(projectsController.getAllProjects);

router
  .route("/:name")
  .get(projectsController.authorize, projectsController.getProject);

module.exports = router;
