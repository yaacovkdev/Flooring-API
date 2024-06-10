const router = require("express").Router();
const path = require("path");
const textController = require(path.join(__dirname, "../controllers/text-controller"));

router.route("/names").get(textController.getProjectNames);
router.route("/:name").get(textController.authorize, textController.getDescByName);

module.exports = router;