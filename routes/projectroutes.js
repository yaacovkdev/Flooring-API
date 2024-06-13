const router = require("express").Router();
const path = require("path");
const projectsController = require(path.join(
  __dirname,
  "../controllers/projects-controller"
));

router.route("/").get(projectsController.getAllProjects);

router
  .route("/:id")
  .get(projectsController.authorize, projectsController.getProjectId);

module.exports = router;
