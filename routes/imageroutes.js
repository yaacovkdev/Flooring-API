const router = require("express").Router();
const path = require("path");
const imageController = require(path.join(__dirname, "../controllers/image-controller"));

router.route("/name/:name").get(imageController.authorize, imageController.getImageByName);
router.route("/id/:id").get(imageController.authorize, imageController.getImageById);
router.route("/name/:name/text").get(imageController.authorize, imageController.getImageByNameText);
router.route("/id/:id/text").get(imageController.authorize, imageController.getImageByIdText);
router.route("/type/:type").get(imageController.getImagesByType);

module.exports = router;
