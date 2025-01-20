const { Router } = require("express");
const { userAuth } = require("../config/database");
const router = Router();
const {
  getUsers,
  signupUser,
  loginUser,
  getProfile,
  updateUserData,
} = require("../controllers/userController");

router.post("/signup", signupUser);
router.post("/login", loginUser);

router.get("/profile", userAuth, getProfile);
router.patch("/user", userAuth, updateUserData);
module.exports = router;
