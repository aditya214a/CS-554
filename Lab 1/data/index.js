//Here you will require data files and export them as shown in lecture code and worked in previous labs.
const users = require("./users");
const recipes = require("./recipes");
const comments = require("./comments");

module.exports = {
  users: users,
  recipes: recipes,
  comments: comments,
};
