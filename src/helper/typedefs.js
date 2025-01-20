const {
  signupUser,
  loginUser,
  getProfile,
  profileUpdate,
  passwordUpdate,
} = require("../controllers/userController");
const { userAuth } = require("../config/database");

const typeDefs = `#graphql
input SignupUser {
  firstname: String
  lastname: String
  useremail: String
  userpassword: String
  age: Int
  gender: String
  city: String
  about: String
  skills: String
}

enum Gender {
    male
    female
    others
}

type SignupUserType {
  firstname: String
  lastname: String
  useremail: String
  userpassword: String
  age: Int
  gender: Gender
  city: String
  about: String
  skills: String
}
input ProfileUpdatedUserInput {
  firstname: String
  lastname: String
  age: Int
  gender: Gender
  city: String
  about: String
  skills: String
}
input PasswordUpdateInput {
  oldpassword: String
  newpassword: String
}
input Loginuser {
  useremail: String
  userpassword: String
}
 type Query {
  signup(user: SignupUser): String
  login(loginUser: Loginuser): String
  profile: SignupUserType
  profileUpdate(updateUser: ProfileUpdatedUserInput): String
  logout: String
  passwordUpdate(updatePasswordObj: PasswordUpdateInput): String
 }

`;

const resolvers = {
  Query: {
    signup: async (_, arg) => {
      const response = await signupUser(arg.user);
      return response;
    },
    login: async (_, arg, contextValue) => {
      const response = await loginUser(arg.loginUser, contextValue.res);
      return response;
    },
    profile: async (_, __, contextValue) => {
      try {
        return await userAuth(contextValue.req);
      } catch (err) {
        throw err.message;
      }
    },
    profileUpdate: async (_, arg, contextValue) => {
      try {
        return await profileUpdate(arg.updateUser, contextValue);
      } catch (err) {
        throw err.message;
      }
    },
    passwordUpdate: async (_, arg, contextValue) => {
      try {
        return await passwordUpdate(arg.updatePasswordObj, contextValue);
      } catch (err) {
        throw err.message;
      }
    },
    logout: async (_, __, contextValue) => {
      contextValue.res.cookie("token", null, { expires: new Date(Date.now()) });
      return "Logged out successfully";
    },
  },
};

module.exports = { typeDefs, resolvers };
