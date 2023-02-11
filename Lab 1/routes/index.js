//Here you will require route files and export the constructor method as shown in lecture code and worked in previous labs.

const recipes = require("./recipes");

const ConstructorMethod = (app) => {
  // app.use("/", routesApi);
  app.use("/", recipes);
  app.use("*", (req, res) => {
    res.status(404).json({ code: 404, title: `404: Page Not Found` });
  });
};

module.exports = ConstructorMethod;
