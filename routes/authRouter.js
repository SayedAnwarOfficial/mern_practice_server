const express = require("express");
const auth_controllers = require("../controllers/auth_controllers");

const router = express.Router();

router.route("/register").post(auth_controllers.register);
router.route("/login").post(auth_controllers.login);

module.exports = router;
