// Setup server, session and middleware here.
const express = require("express");
const app = express();
const configRoutes = require("./routes");
const session = require("express-session");
const recipes = require("./data/recipes");
const count = {};
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

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
app.use("/login", async (req, res, next) => {
  let temp = await client.hGetAll("LoggedUser");
  if (temp.login === "true" && temp.username !== req.body.username) {
    return res.status(403).json("Please logout before login with other user");
  }
  next();
});

app.use("/signup", async (req, res, next) => {
  let temp = await client.hGet("LoggedUser", "login");
  if (temp === "true") {
    return res.status(403).json("Please logout before signup");
  }
  next();
});

app.use("/recipes", async (req, res, next) => {
  // console.log("IN MIDDLEWARE=" + req.originalUrl);
  let temp = await client.hGetAll("LoggedUser");
  if (req.method == "POST" || req.method == "PUT" || req.method == "PATCH") {
    if (
      temp.login !== "true" &&
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

app.use("/recipes/:id/comment", async (req, res, next) => {
  let temp = await client.hGetAll("LoggedUser");
  if (req.method == "POST") {
    if (temp.login !== "true") {
      return res.status(403).json("Please login to post comment");
    }
  }
  next();
});

app.use("/recipes/:recipeid/:commentId", async (req, res, next) => {
  let temp = await client.hGetAll("LoggedUser");
  if (req.method == "DELETE") {
    if (temp.login !== "true") {
      return res.status(403).json("Please login to delete comment");
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
// const express = require("express");
// const app = express();
// const configRoutes = require("./routes");
// const session = require("express-session");
// const recipes = require("./data/recipes");

// const count = {};
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   session({
//     name: "AuthCookie",
//     secret: "some secret string!",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.use("/recipes/:id", async (req, res, next) => {
//   if (req.method === "PATCH") {
//     next();
//   }
//   if (req.method === "GET") {
//     let rid = req.params.id;
//     let temp = await client.hGetAll("LoggedUser");
//     let exists = await client.exists(rid);
//     if (exists) {
//       let existsInScoreBoard = await client.zRank("mostId", rid);
//       if (existsInScoreBoard !== null) {
//         console.log("found search term in sorted set");
//         // It has been found in the list so let's increment it by 1
//         await client.zIncrBy("mostId", 1, rid);
//       } else {
//         console.log("search term in sorted set NOT found");
//         //If the search term is not found in the list, then we know to add it
//         await client.zAdd("mostId", {
//           score: 1,
//           value: rid,
//         });
//       }
//       //if we do have it in cache, send the raw html from cache
//       console.log("Show in Cache");
//       let oneRecipe = await client.get(rid);
//       console.log("Sending HTML from Redis....");
//       return res.send(JSON.parse(oneRecipe));
//     }
//   }

//   next();
// });

// app.use("/recipes", async (req, res, next) => {
//   if (!req.query.page) {
//     if (req.method === "GET" && req.originalUrl !== "/recipes/:id") {
//       //req.originalUrl === "/shows" &&
//       let exists = await client.exists("recipeListHomepage");
//       if (exists) {
//         //if we do have it in cache, send the raw html from cache
//         console.log("Show List from cache");
//         let cachedRecipe = await client.get("recipeListHomepage");
//         console.log("Sending HTML from Redis....");
//         return res.status(200).json(JSON.parse(cachedRecipe));
//       } else {
//         next();
//       }
//     } else {
//       next();
//     }
//   }
//   next();
// });

// //Authentication Middleware
// app.use("/login", async (req, res, next) => {
//   let temp = await client.hGetAll("LoggedUser");
//   if (temp.login === "true" && temp.username !== req.body.username) {
//     return res.status(403).json("Please logout before login with other user");
//   }
//   next();
// });

// app.use("/signup", async (req, res, next) => {
//   let temp = await client.hGet("LoggedUser", "login");
//   if (temp === "true") {
//     return res.status(403).json("Please logout before signup");
//   }
//   next();
// });

// app.use("/recipes", async (req, res, next) => {
//   // console.log("IN MIDDLEWARE=" + req.originalUrl);
//   let temp = await client.hGetAll("LoggedUser");
//   if (req.method == "POST" || req.method == "PUT" || req.method == "PATCH") {
//     if (
//       temp.login !== "true" &&
//       !(
//         req.originalUrl == "/recipes/login" ||
//         req.originalUrl == "/recipes/signup"
//       )
//     ) {
//       return res
//         .status(403)
//         .json(`User need to signup or login to access this page`);
//     }
//     // if (req.method == "PUT" || req.method == "PATCH") {
//     //   let tempRecipes;
//     //   try {
//     //     tempRecipes = await recipes.getRecipeById(rid);
//     //     if (tempRecipes.userThatPosted._id != temp.userId) {
//     //       return res
//     //         .status(403)
//     //         .json({ err: `This user cannot edit the asked recipe` });
//     //     }
//     //   } catch (e) {
//     //     if (e.code) {
//     //       return res.status(e.code).json(e.err);
//     //     } else {
//     //       return res.status(500).json(e);
//     //     }
//     //   }
//     // }
//   }
//   next();
// });

// app.use("/recipes/:id/comment", async (req, res, next) => {
// let temp = await client.hGetAll("LoggedUser");
// if (req.method == "POST") {
//   if (temp.login !== "true") {
//     return res.status(403).json("Please login to post comment");
//   }
// }
// next();
// });

// app.use("/recipes/:recipeid/:commentId", async (req, res, next) => {
// let temp = await client.hGetAll("LoggedUser");
// if (req.method == "DELETE") {
//   if (temp.login !== "true") {
//     return res.status(403).json("Please login to delete comment");
//   }
// }
// next();
// });

// //Logging Middleware & Count
// app.use(async (req, res, next) => {
//   let temp = await client.hGetAll("LoggedUser");
//   let timeStamp = new Date().toUTCString();
//   let reqMethod = req.method;
//   let reqRoute = req.originalUrl;
//   if (reqRoute.toString() in count) {
//     count[reqRoute.toString()] += 1;
//   } else {
//     count[reqRoute.toString()] = 1;
//   }
//   if (temp.login === "true") {
//     console.log(
//       `[${timeStamp}]: ${reqMethod} ${reqRoute} (Authenticated User)`
//     );
//     console.log(count);
//   } else {
//     console.log(
//       `[${timeStamp}]: ${reqMethod} ${reqRoute} (Non-Authenticated User)`
//     );
//     console.log(count);
//   }
//   next();
// });

// configRoutes(app);

// app.listen(3000, () => {
//   console.log("We've now got a server!");
//   console.log("Your routes will be running on http://localhost:3000");
// });
