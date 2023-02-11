let { ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
const { users, recipes, comments } = require("../data");

router
  .route("/recipes")
  .post(async (req, res) => {
    try {
      let title = req.body.title;
      let ingredients = req.body.ingredients;
      let steps = req.body.steps;
      let cookingSkillRequired = req.body.cookingSkillRequired;
      console.log(req.session);
      let userName = req.session.username;
      let userId = req.session.userId;
      let logged = req.session.login;
      if (!logged) throw `Please login before posting`;
      let insertRec = await recipes.createRecipe(
        title,
        ingredients,
        steps,
        cookingSkillRequired,
        userName,
        userId
      );
      return res.json(insertRec);
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
      if (recipeList.length) res.status(200).json(recipeList);
    } catch (e) {
      if (e.code) res.status(e.code).json({ error: e.err });
      else res.status(400).json({ error: e });
    }
  });

router
  .route("/recipes/:id")
  .get(async (req, res) => {
    try {
      const oneRecipe = await recipes.getRecipeById(req.params.id);
      res.status(200).json(oneRecipe);
    } catch (e) {
      if (e.code) res.status(e.code).json({ error: e.err });
      else res.status(400).json({ error: e });
    }
  })
  .patch(async (req, res) => {
    try {
      let body = req.body;
      let patchRec = await recipes.patchRecipes(
        req.params.id,
        body,
        req.session.userId
      );
      return res.json(patchRec);
    } catch (e) {
      if (e.code) res.status(e.code).json({ error: e.err });
      else res.status(400).json({ error: e });
    }
  });

router.route("/recipes/:id/comments").post(async (req, res) => {
  try {
    let cBody = req.body.comment;
    let addComment = await comments.addComment(
      cBody,
      req.params.id,
      req.session.userId,
      req.session.username
    );
    return res.json(addComment);
  } catch (e) {
    if (e.code) res.status(e.code).json({ error: e.err });
    else res.status(400).json({ error: e });
  }
});

router.route("/recipes/:recipeId/:commentId").delete(async (req, res) => {
  try {
    console.log(req.params.commentId);
    let deleteComment = await comments.deleteComment(
      req.params.recipeId,
      req.params.commentId,
      req.session.userId
    );
    return res.json(deleteComment);
  } catch (e) {
    if (e.code) res.status(e.code).json({ error: e.err });
    else res.status(400).json({ error: e });
  }
});

router.route("/recipes/:id/likes").post(async (req, res) => {
  try {
    if (!req.session.login) throw { code: 403, err: `Please login to like` };
    console.log(req.session);
    let recipeLiked = await recipes.likeRecipe(
      req.params.id,
      req.session.userId
    );
    return res.json(recipeLiked);
  } catch (e) {
    if (e.code) res.status(e.code).json({ error: e.err });
    else res.status(400).json({ error: e });
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
    console.log(addUser);
    res.json(addUser);
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
    let uname = regDetails.username;
    let upass = regDetails.password;
    let checking = await users.checkUser(uname, upass);
    if (req.session.login) {
      res.json(`User ${uname} already logged in`);
    }
    req.session.login = checking.authenticated;
    req.session.username = uname;
    req.session.userId = checking.userId;
    req.session.timeStamp = timeStamp;
    res.json(checking);
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
  if (req.session.login) {
    req.session.destroy();
    return res.json("Successfully Logged out !!");
  } else {
    return res.status(403).json("Cannot log out");
  }
});

module.exports = router;
