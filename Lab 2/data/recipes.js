const mongoCollections = require("../config/mongoCollections");
let { ObjectId } = require("mongodb");
const recipes = mongoCollections.recipes;
let help = require("../helper");
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

const createRecipe = async (
  title,
  ingredients,
  steps,
  cookingSkillRequired,
  userName,
  userId
) => {
  let newRecipe = await help.checkErrorRecipes(
    title,
    ingredients,
    steps,
    cookingSkillRequired,
    userName,
    userId
  );
  const recipeCollection = await recipes();
  let recipeExist = await recipeCollection.findOne({
    $and: [
      { title: title },
      { ingredients: ingredients },
      { steps: steps },
      { cookingSkillRequired: cookingSkillRequired },
    ],
  });
  if (recipeExist) {
    result = recipeExist;
    result._id = result._id.toString();
    throw `This recipe is already in the database`;
  }
  newRecipe["comments"] = [];
  newRecipe["likes"] = [];
  newRecipe["userThatPosted"] = { _id: userId, username: userName };
  const insertInfo = await recipeCollection.insertOne(newRecipe);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add recipe";

  let existsInScoreBoard = await client.zRank(
    "mostId",
    newRecipe._id.toString()
  );
  if (existsInScoreBoard !== null) {
    console.log("found search term in sorted set");
    // It has been found in the list so let's increment it by 1
    await client.zIncrBy("mostId", 1, newRecipe._id.toString());
  } else {
    console.log("search term in sorted set NOT found");
    //If the search term is not found in the list, then we know to add it
    await client.zAdd("mostId", {
      score: 1,
      value: newRecipe._id.toString(),
    });
  }

  await client.set(newRecipe._id.toString(), JSON.stringify(newRecipe));
  // res.status(200).json(newRecipe);

  return newRecipe;
};

const getAllRecipes = async (skip = 0, limit = 50) => {
  // console.log("HIII");
  const recipeCollection = await recipes();
  const recipeList = await recipeCollection
    .find({})
    .skip(skip)
    .limit(limit)
    .toArray();
  if (!recipeList || recipeList.length == 0)
    throw { code: 404, err: `No more recipes in Database` };
  //   if (recipeList.length == 0) throw `No recipes in the database`;
  recipeList.forEach((element) => {
    element._id = element._id.toString();
    element.userThatPosted._id = element.userThatPosted._id.toString();
    element.comments.forEach((element) => {
      element._id = element._id.toString();
    });
  });
  // recipeList._id = recipeList._id.toString();

  return recipeList;
};

const getRecipeById = async (recipeId) => {
  let id = await help.checkId(recipeId);
  const recipeCollection = await recipes();
  const recipesList = await recipeCollection.findOne({ _id: ObjectId(id) });
  if (!recipesList)
    throw { code: 404, err: `Could not find recipe with id of ${id}` };
  recipesList._id = recipesList._id.toString();
  recipesList.comments.forEach((element) => {
    element._id = element._id.toString();
  });

  return recipesList;
};

const likeRecipe = async (recipeId, uid) => {
  // let likeAddDel;
  await help.checkId(recipeId);
  await help.checkId(uid);

  const recipeCollection = await recipes();
  let recipesList = await recipeCollection.findOne({ _id: ObjectId(recipeId) });
  if (!recipesList)
    throw { code: 404, err: `Could not find recipe with id of ${id}` };
  if (recipesList.likes.includes(uid)) {
    // let ind = recipesList.likes.indexOf(uid);
    const index = recipesList.likes.indexOf(uid);
    if (index > -1) {
      recipesList.likes.splice(index, 1);
    }
    let likeAddDel = await recipeCollection.updateOne(
      { _id: ObjectId(recipeId) },
      { $set: recipesList }
    );
    if (likeAddDel.modifiedCount === 0) {
      throw {
        code: 404,
        err: `${cid} in recipe ${recipeId} could not be liked`,
      };
    }
  } else {
    recipesList.likes.push(uid);

    let likeAddDel = await recipeCollection.updateOne(
      { _id: ObjectId(recipeId) },
      { $set: recipesList }
    );
    if (likeAddDel.modifiedCount === 0) {
      throw {
        code: 404,
        err: `${cid} in recipe ${recipeId} could not be liked`,
      };
    }
  }
  let updatedRecipeLike = await getRecipeById(recipeId);
  return updatedRecipeLike;
};

const patchRecipes = async (recipeId, body, uid) => {
  await help.checkId(recipeId);
  await help.checkId(uid);
  if (!body || body.length == 0)
    throw { code: 400, err: `Please provide atleast one to update` };

  let canEdit = ["title", "ingredients", "steps", "cookingSkillRequired"];
  let bodyKeys = Object.keys(body);
  // let validKeys = [];
  let oneDifferent = false;

  const recipeCollection = await recipes();
  const recipesList = await recipeCollection.findOne({
    _id: ObjectId(recipeId),
  });
  if (recipesList.userThatPosted._id.toString() != uid) {
    throw { code: 403, err: `This user cannot edit the asked recipe` };
  }

  bodyKeys.forEach((element) => {
    if (!canEdit.includes(element)) {
      throw { code: 400, err: `Cannot edit ${element} field` };
    }
    if (
      JSON.stringify(body[element.toString()].toLowerCase()) !==
      JSON.stringify(recipesList[element.toString()].toLowerCase())
    ) {
      oneDifferent = true;
    }
  });
  if (!oneDifferent)
    throw { code: 400, err: `Atleast one field must be different` };

  if (!recipesList)
    throw { code: 404, err: `Could not find recipe with id of ${recipeId}` };
  // bodyKeys.forEach((element) => {

  // });

  if (bodyKeys.includes("title")) {
    body.title = await help.checkTitle(body.title);
  }
  if (bodyKeys.includes("ingredients")) {
    body.ingredients = await help.checkIngredients(body.ingredients);
  }
  if (bodyKeys.includes("steps")) {
    body.steps = await help.checkSteps(body.steps);
  }
  if (bodyKeys.includes("cookingSkillRequired")) {
    body.cookingSkillRequired = await help.checkCooking(
      body.cookingSkillRequired
    );
  }
  let patched = recipeCollection.updateOne(
    { _id: ObjectId(recipeId) },
    { $set: body }
  );
  if (patched.modifiedCount === 0)
    throw {
      code: 500,
      err: `Unable to update the recipe with ID ${recipeId}`,
    };
  let updatedRecipeLike = await getRecipeById(recipeId);

  let existsInScoreBoard = await client.zRank("mostId", recipeId);
  if (existsInScoreBoard !== null) {
    console.log("found search term in sorted set");
    // It has been found in the list so let's increment it by 1
    await client.zIncrBy("mostId", 1, recipeId);
  } else {
    console.log("search term in sorted set NOT found");
    //If the search term is not found in the list, then we know to add it
    await client.zAdd("mostId", {
      score: 1,
      value: recipeId,
    });
  }
  await client.set(recipeId, JSON.stringify(updatedRecipeLike));

  return updatedRecipeLike;
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  likeRecipe,
  patchRecipes,
};
