// const pg = require("pg");
// const { Client } = pg;

// const client = new Client({
//   user: "postgres",
//   password: "admin",
//   host: "localhost",
//   port: 5432,
//   database: "postgres",
// });

// const connectDB = async () => {
//   await client.connect();
//   const result = await client.query("SELECT * from cars");
//   await client.end();
// };

// module.exports = connectDB;

const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let connectedPool = null;
const pool = new Pool({
  user: "postgres",
  password: "admin",
  host: "localhost",
  port: 5432,
  database: "postgres",
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const connectToDB = async () => {
  // Get a connection from the pool
  try {
    connectedPool = await pool.connect();
    return true;
  } catch (err) {
    throw new Error(err);
  }
};

const createUser = async (userObj) => {
  const {
    firstname,
    lastname,
    useremail,
    userpassword,
    age,
    gender,
    city,
    photourl,
    about,
    skills,
  } = userObj;
  try {
    const response = await connectedPool.query(
      "INSERT INTO tinder.users(firstname,lastname,useremail,userpassword,age,gender,city,photourl,about,skills) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        firstname || null,
        lastname,
        useremail,
        userpassword,
        age,
        gender,
        city,
        photourl || null,
        about,
        skills,
      ]
    );
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

const updateUser = async (userObj) => {
  const {
    firstname,
    lastname,
    useremail,
    userpassword,
    age,
    gender,
    city,
    photourl,
    about,
    skills,
  } = userObj;
  try {
    const response = await connectedPool.query(
      "UPDATE tinder.users SET firstname = $1,lastname = $2,userpassword = $3,age = $4,gender = $5,city = $6,photourl = $7,about = $8,skills = $9 where useremail = $10",
      [
        firstname,
        lastname,
        userpassword,
        age,
        gender,
        city,
        photourl || null,
        about,
        skills,
        useremail,
      ]
    );
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

const checkEmailAndPassword = async (useremail, userpassword) => {
  try {
    const response = await connectedPool.query(
      "select useremail, userpassword from tinder.users where useremail = $1",
      [useremail]
    );
    if (!response.rows.length) {
      throw new Error("Invalid login credentials!");
    }
    const isPasswordValid = await bcrypt.compare(
      userpassword,
      response.rows[0].userpassword
    );
    return isPasswordValid;
  } catch (err) {
    throw new Error(err);
  }
};

const getUserDetailsByEmailId = async (emailId) => {
  const response = await connectedPool.query(
    "select * from tinder.users where useremail = $1",
    [emailId]
  );
  if (!response.rows.length) {
    throw new Error("Invalid user!");
  }
  return response.rows[0];
};

// const userAuth = async (req, res, next) => {
//   try {
//     const cookies = req.cookies;
//     const { token } = cookies;
//     if (!token) {
//       throw new Error("Token is not valid");
//     }
//     const decodedObj = await jwt.verify(token, "devTinder");
//     const { useremail } = decodedObj;
//     const user = await getUserDetailsByEmailId(useremail);
//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(400).send("ERROR: " + err.message);
//   }
// };

const userAuth = async (req) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }
    const decodedObj = await jwt.verify(token, "devTinder");
    const { useremail } = decodedObj;
    return await getUserDetailsByEmailId(useremail);
  } catch (err) {
    throw err;
  }
};
module.exports = {
  pool,
  connectToDB,
  createUser,
  checkEmailAndPassword,
  userAuth,
  updateUser,
};
