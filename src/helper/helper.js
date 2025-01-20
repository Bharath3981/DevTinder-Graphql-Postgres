const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const encryptString = async (someString) => {
  console.log("encryptStin: ", someString);
  const stringHash = await bcrypt.hash(someString, 10);
  console.log("stringhash: ", stringHash);
  return stringHash;
};

const validateProfileEditData = (updateObj) => {
  const allowedEditFields = [
    "firstname",
    "lastname",
    "photourl",
    "gender",
    "age",
    "about",
    "skills",
    "city",
  ];
  const isEditAllowed = Object.keys(updateObj).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

const getJWT = async function (userEmail) {
  const user = this;
  const token = await jwt.sign({ useremail: userEmail }, "devTinder", {
    expiresIn: "1h",
  });
  return token;
};

module.exports = { encryptString, getJWT, validateProfileEditData };
