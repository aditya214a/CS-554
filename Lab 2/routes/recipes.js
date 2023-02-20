let { ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
const { users, recipes, comments } = require("../data");
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

router
  .route("/recipes")
  .post(async (req, res) => {
    try {
      let temp = await client.hGetAll("LoggedUser");

      let title = req.body.title;
      let ingredients = req.body.ingredients;
      let steps = req.body.steps;
      let cookingSkillRequired = req.body.cookingSkillRequired;
      // console.log(temp);
      let userName = temp.username;
      let userId = temp.userId;
      let logged = temp.login;
      if (logged !== "true") throw `Please login before posting`;
      let insertRec = await recipes.createRecipe(
        title,
        ingredients,
        steps,
        cookingSkillRequired,
        userName,
        userId
      );

      //UPDATING CASCH
      const recipeList = await recipes.getAllRecipes();
      if (recipeList) {
        await client.set("recipeListHomepage", JSON.stringify(recipeList));
      } else throw { code: 500, err: `Recipes are unable to get!` };

      return res.status(200).json(insertRec);
    } catch (e) {
      if (e.code) {
        res.status(e.code).json(e.err);
      } else {
        res.status(500).json(e);
      }
    }
  })
  .get(async (req, res) => {
    try {
      // if (req.url != "/") throw { code: 400, err: `Url invalid` };
      let page = 1;
      if (req.query.page) {
        if (isNaN(Number(req.query.page)) || Number(req.query.page) <= 0)
          throw { code: 404, err: `Page should be a positive number` };
        page = Number(req.query.page);
      }
      const limit = 50;
      const skip = (page - 1) * limit;

      //   console.log(Object.values(req.query));
      const recipeList = await recipes.getAllRecipes(skip, limit);

      if (recipeList) {
        await client.set("recipeListHomepage", JSON.stringify(recipeList));
        return res.status(200).json(recipeList);
      } else throw { code: 500, err: `Recipes are unable to get!` };
    } catch (e) {
      if (e.code) res.status(e.code).json({ error: e.err });
      else res.status(400).json({ error: e });
    }
  });

router
  .route("/recipes/:id")
  .get(async (req, res) => {
    let rid = req.params.id;
    try {
      const oneRecipe = await recipes.getRecipeById(rid);
      if (oneRecipe) {
        let existsInScoreBoard = await client.zRank("mostId", rid);
        if (existsInScoreBoard !== null) {
          console.log("found Recipe in sorted set");
          // It has been found in the list so let's increment it by 1
          await client.zIncrBy("mostId", 1, rid);
        } else {
          console.log("Recipe in sorted set NOT found");
          //If the Recipe is not found in the list, then we know to add it
          await client.zAdd("mostId", {
            score: 1,
            value: rid,
          });
        }

        await client.set(rid, JSON.stringify(oneRecipe));

        return res.status(200).json(oneRecipe);
      } else throw { code: 500, err: `Recipes is unable to get!` };
    } catch (e) {
      if (e.code) res.status(e.code).json({ error: e.err });
      else res.status(400).json({ error: e });
    }
  })
  .patch(async (req, res) => {
    let rid = req.params.id;
    let body = req.body;
    try {
      let temp = await client.hGetAll("LoggedUser");
      let patchRec = await recipes.patchRecipes(rid, body, temp.userId);

      //UPDATING CASCH
      const recipeList = await recipes.getAllRecipes();
      if (recipeList) {
        await client.set("recipeListHomepage", JSON.stringify(recipeList));
      } else throw { code: 500, err: `Recipes are unable to get!` };

      return res.json(patchRec);
    } catch (e) {
      if (e.code) res.status(e.code).json({ error: e.err });
      else res.status(400).json({ error: e });
    }
  });

router.route("/recipes/:id/comments").post(async (req, res) => {
  try {
    let temp = await client.hGetAll("LoggedUser");

    let cBody = req.body.comment;
    let addComment = await comments.addComment(
      cBody,
      req.params.id,
      temp.userId,
      temp.username
    );
    if (addComment) {
      let existsInScoreBoard = await client.zRank("mostId", req.params.id);

      // INCREASE VISITS
      if (existsInScoreBoard !== null) {
        console.log("found Recipe in sorted set");
        // It has been found in the list so let's increment it by 1
        await client.zIncrBy("mostId", 1, req.params.id);
      } else {
        console.log("Recipe in sorted set NOT found");
        //If the Recipe is not found in the list, then we know to add it
        await client.zAdd("mostId", {
          score: 1,
          value: req.params.id,
        });
      }

      //UPDATING CASCH
      const recipeList = await recipes.getAllRecipes();
      if (recipeList) {
        await client.set("recipeListHomepage", JSON.stringify(recipeList));
      } else throw { code: 500, err: `Recipes are unable to get!` };

      await client.set(req.params.id, JSON.stringify(addComment));
      return res.status(200).json(addComment);
    } else throw { code: 500, err: `Unable to comment (casch)` };
  } catch (e) {
    if (e.code) res.status(e.code).json({ error: e.err });
    else res.status(400).json({ error: e });
  }
});

router.route("/recipes/:recipeId/:commentId").delete(async (req, res) => {
  try {
    let temp = await client.hGetAll("LoggedUser");

    // console.log(req.params.commentId);
    let deleteComment = await comments.deleteComment(
      req.params.recipeId,
      req.params.commentId,
      temp.userId
    );
    if (deleteComment) {
      let existsInScoreBoard = await client.zRank(
        "mostId",
        req.params.recipeId
      );
      if (existsInScoreBoard !== null) {
        console.log("found Recipe in sorted set");
        // It has been found in the list so let's increment it by 1
        await client.zIncrBy("mostId", 1, req.params.recipeId);
      } else {
        console.log("Recipe in sorted set NOT found");
        //If the Recipe is not found in the list, then we know to add it
        await client.zAdd("mostId", {
          score: 1,
          value: req.params.recipeId,
        });
      }

      //UPDATING CASCH
      const recipeList = await recipes.getAllRecipes();
      if (recipeList) {
        await client.set("recipeListHomepage", JSON.stringify(recipeList));
      } else throw { code: 500, err: `Recipes are unable to get!` };

      await client.set(req.params.recipeId, JSON.stringify(deleteComment));
      return res.status(200).json(deleteComment);
    } else throw { code: 500, err: `Unable to comment (casch)` };
  } catch (e) {
    if (e.code) res.status(e.code).json({ error: e.err });
    else res.status(400).json({ error: e });
  }
});

router.route("/recipes/:id/likes").post(async (req, res) => {
  try {
    let temp = await client.hGetAll("LoggedUser");

    if (temp.login !== "true") throw { code: 400, err: `Please login to like` };
    // console.log(temp);
    let recipeLiked = await recipes.likeRecipe(req.params.id, temp.userId);
    if (recipeLiked) {
      let existsInScoreBoard = await client.zRank("mostId", req.params.id);

      // UPDATING VISITs
      if (existsInScoreBoard !== null) {
        console.log("found Recipe in sorted set");
        // It has been found in the list so let's increment it by 1
        await client.zIncrBy("mostId", 1, req.params.id);
      } else {
        console.log("Recipe in sorted set NOT found");
        //If the Recipe is not found in the list, then we know to add it
        await client.zAdd("mostId", {
          score: 1,
          value: req.params.id,
        });
      }

      //UPDATING CASCH
      const recipeList = await recipes.getAllRecipes();
      if (recipeList) {
        await client.set("recipeListHomepage", JSON.stringify(recipeList));
      } else throw { code: 500, err: `Recipes are unable to get!` };

      await client.set(req.params.id, JSON.stringify(recipeLiked));
      return res.status(200).json(recipeLiked);
    } else throw { code: 500, err: `Unable to comment (casch)` };
  } catch (e) {
    if (e.code) res.status(e.code).json({ error: e.err });
    else res.status(404).json({ error: e });
  }
});

router.route("/signup").post(async (req, res) => {
  //code here for POST
  try {
    let regDetails = req.body;
    let nam = regDetails.name;
    let uname = regDetails.username;
    let upass = regDetails.password;
    let addUser = await users.createUser(nam, uname, upass);
    // console.log(addUser);
    return res.status(200).json(addUser);
  } catch (e) {
    if (e.code) {
      res.status(e.code).json(e.err);
    } else {
      res.status(500).json("Internal Server Error");
    }
  }
});

router.route("/login").post(async (req, res) => {
  //code here for POST
  try {
    let regDetails = req.body;
    let timeStamp = new Date().toUTCString();
    let uname = regDetails.username.toLowerCase();
    let upass = regDetails.password;
    let checking = await users.checkUser(uname, upass);

    let userLog = await client.hGetAll("LoggedUser");
    if (userLog.login === "true") {
      return res.json(`User ${userLog.uname} already logged in`);
    }
    await client.hSet("LoggedUser", "login", checking.authenticated.toString());
    await client.hSet("LoggedUser", "username", uname.toString());
    await client.hSet("LoggedUser", "userId", checking.userId.toString());
    await client.hSet("LoggedUser", "timeStamp", timeStamp.toString());

    //EXPIRES IN ONE HOUR
    await client.expire("LoggedUser", 3600);
    let sess = await client.hGetAll("LoggedUser");
    // console.log(sess);
    // req.session.login = checking.authenticated;
    // req.session.username = uname;
    // req.session.userId = checking.userId;
    // req.session.timeStamp = timeStamp;

    return res.status(200).json(sess);
  } catch (e) {
    if (e.code) {
      res.status(e.code).json(e.err);
    } else {
      res.status(500).json("Internal Server Error");
    }
  }
});

router.route("/logout").get(async (req, res) => {
  //code here for GET
  try {
    let temp = await client.hGetAll("LoggedUser");

    if (temp.login === "true") {
      await client.del("LoggedUser");
      return res.json("Successfully Logged out !!");
    } else {
      return res.status(403).json("Cannot log out");
    }
  } catch (e) {
    if (e.code) {
      res.status(e.code).json(e.err);
    } else {
      res.status(500).json("Internal Server Error");
    }
  }
});

router.route("/mostaccessed").get(async (req, res) => {
  //code here for GET
  try {
    let arr = [];
    const scores = await client.zRange("mostId", 0, 2, { REV: true });
    // console.log(scores);
    for (let i = 0; i < scores.length; i++) {
      let oneRecipe = await recipes.getRecipeById(scores[i]);
      arr.push(oneRecipe);
    }
    return res.status(200).json(arr);
  } catch (e) {
    if (e.code) {
      res.status(e.code).json(e.err);
    } else {
      res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = router;
