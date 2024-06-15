const router = require("express").Router();
const path = require("path");
const adminController = require(path.join(__dirname, "../controllers/admin-controller"));
const imageController = require(path.join(__dirname, "../controllers/image-controller"));

router.route("/login").post(adminController.login);
router.route("/status").get(adminController.authenticate, adminController.checkStatus);
router.route("/data").get(adminController.authenticate, adminController.getData);

//admin gets an image without needing image controller display authorization
router.route("/image/:id").get(adminController.authenticate, imageController.getImageById);
router.route("/access/image/:id").get(adminController.authenticate, adminController.getImageControllerById);

//demo route
router.route("/access/demoid/:id").put(adminController.setImageDisplayById);

module.exports = router;
