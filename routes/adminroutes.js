const router = require("express").Router();
const path = require("path");
const adminController = require(path.join(__dirname, "../controllers/admin-controller"));

router.route("/login").post(adminController.login);
router.route("/access").get(adminController.authorize, adminController.access);

router.route("/access/imageid/:id").put(adminController.setImageDisplayById);

module.exports = router;
