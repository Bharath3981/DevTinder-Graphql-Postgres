const {
  createUser,
  updateUser,
  checkEmailAndPassword,
  userAuth,
} = require("../config/database");
const {
  encryptString,
  getJWT,
  validateProfileEditData,
} = require("../helper/helper");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    //const response = await pool.query("SELECT * FROM users");
    res.status(200).json("Request received");
  } catch (error) {
    res.send("Error: " + error);
  }
};

const signupUser = async (body) => {
  try {
    body.userpassword = await encryptString(body.userpassword);
    await createUser(body);
    return "User signup successfully";
  } catch (error) {
    throw new Error(error.message);
  }
};

const loginUser = async ({ useremail, userpassword }, res) => {
  try {
    const isPasswordValid = await checkEmailAndPassword(
      useremail,
      userpassword
    );
    if (isPasswordValid) {
      const token = await getJWT(useremail);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 3600000),
      }); // Expires in 1 day
      return "Login Successfull!!";
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    throw new Error("Invalid credentials");
  }
};

const profileUpdate = async (updateUserObj, { req, res }) => {
  try {
    if (validateProfileEditData(updateUserObj)) {
      const loggedInUser = await userAuth(req);
      Object.keys(updateUserObj).forEach((key) => {
        loggedInUser[key] = updateUserObj[key];
      });
      const result = await updateUser(loggedInUser);
      return "Updated successfully";
    } else {
      throw new Error("Invalid Edit Request");
    }
  } catch (err) {
    throw new Error(err);
  }
};

const passwordUpdate = async ({ oldpassword, newpassword }, { req, res }) => {
  try {
    const loggedInUser = await userAuth(req);
    const isPasswordValid = await checkEmailAndPassword(
      loggedInUser.useremail,
      oldpassword
    );
    if (isPasswordValid) {
      loggedInUser.userpassword = await encryptString(newpassword);
      const result = await updateUser(loggedInUser);
      return "Password updated successfully";
    } else {
      throw new Error("Invalid password");
    }
  } catch (err) {
    throw err;
  }
};

const updateUserData = async (req, res) => {
  const mergedUser = { ...req.user[0], ...req.body };
  const response = await updateUser(mergedUser);
  res.status(200).json("Updated successfully");
};

const getProfile = async (req, res) => {
  res.send(req.user);
};

module.exports = {
  getUsers,
  signupUser,
  loginUser,
  getProfile,
  updateUserData,
  profileUpdate,
  passwordUpdate,
};
