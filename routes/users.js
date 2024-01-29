const routerUsers = require("express").Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUserInfo,
} = require("../controllers/users");

routerUsers.get("/", getAllUsers);
routerUsers.get("/:userId", getUserById);
routerUsers.get("/:me", getUserInfo);
routerUsers.patch("/me", updateUser);
routerUsers.patch("/me/avatar", updateUserAvatar);

module.exports = routerUsers;
