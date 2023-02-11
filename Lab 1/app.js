// Setup server, session and middleware here.

const express = require("express");
const app = express();
const configRoutes = require("./routes");
const session = require("express-session");
const recipes = require("./data/recipes");
const count = {};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);
//Authentication Middleware
app.use("/login", (req, res, next) => {
  if (
    req.session.login === true &&
    req.session.username !== req.body.username
  ) {
    return res.status(403).json("Please logout before login with other user");
  }
  next();
});

app.use("/signup", (req, res, next) => {
  if (req.session.login) {
    return res.status(403).json("Please logout before signup");
  }
  next();
});

app.use("/recipes", (req, res, next) => {
  // console.log("IN MIDDLEWARE=" + req.originalUrl);
  if (req.method == "POST" || req.method == "PUT" || req.method == "PATCH") {
    if (
      !req.session.login &&
      !(
        req.originalUrl == "/recipes/login" ||
        req.originalUrl == "/recipes/signup"
      )
    ) {
      return res
        .status(403)
        .json(`User need to signup or login to access this page`);
    }
  }
  next();
});

app.use("/recipes/:id/comment", (req, res, next) => {
  if (req.method == "POST") {
    if (!req.session.login) {
      return res.status(403).json("Please login to post comment");
    }
  }
  next();
});

app.use("/recipes/:recipeid/:commentId", (req, res, next) => {
  if (req.method == "DELETE") {
    if (!req.session.login) {
      return res.status(403).json("Please login to delete comment");
    }
  }
  next();
});

app.use("/recipes/:id", async (req, res, next) => {
  if (req.method == "PUT" || req.method == "PATCH") {
    let tempRecipes;
    try {
      tempRecipes = await recipes.getRecipeById(req.params.id);
    } catch (e) {
      if (e.code) {
        res.status(e.code).json(e.err);
      } else {
        res.status(500).json(e);
      }
    }
    if (tempRecipes.userThatPosted._id != req.session.userId) {
      return res
        .status(403)
        .json({ err: `This user cannot edit the asked recipe` });
    }
  }
  next();
});

//Logging Middleware & Count
app.use((req, res, next) => {
  let timeStamp = new Date().toUTCString();
  let reqMethod = req.method;
  let reqRoute = req.originalUrl;
  if (reqRoute.toString() in count) {
    count[reqRoute.toString()] += 1;
  } else {
    count[reqRoute.toString()] = 1;
  }
  if (req.session.login) {
    console.log(
      `[${timeStamp}]: ${reqMethod} ${reqRoute} (Authenticated User)`
    );
    console.log(count);
  } else {
    console.log(
      `[${timeStamp}]: ${reqMethod} ${reqRoute} (Non-Authenticated User)`
    );
    console.log(count);
  }
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
