const mongoCollections = require("../config/mongoCollections");
let { ObjectId } = require("mongodb");
const recipes = mongoCollections.recipes;
let help = require("../helper");

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

  return newRecipe;
};

const getAllRecipes = async (skip, limit) => {
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
  if (!body || body.length === 0)
    throw { code: 404, err: `Please provide atleast one to update` };

  let canEdit = ["title", "ingredients", "steps", "cookingSkillRequired"];
  let bodyKeys = Object.keys(body);
  let validKeys = [];

  bodyKeys.forEach((element) => {
    if (!canEdit.includes(element)) {
      throw { code: 403, err: `Cannot edit ${element} field` };
    }
  });
  const recipeCollection = await recipes();
  const recipesList = await recipeCollection.findOne({
    _id: ObjectId(recipeId),
  });

  if (!recipesList)
    throw { code: 404, err: `Could not find recipe with id of ${recipeId}` };
  if (bodyKeys.includes("title")) {
    body.title = await help.checkTitle(body.title);
    validKeys.push(body.title === recipesList.title);
  }
  if (bodyKeys.includes("ingredients")) {
    body.ingredients = await help.checkIngredients(body.ingredients);
    validKeys.push(
      JSON.stringify(body.ingredients) ===
        JSON.stringify(recipesList.ingredients)
    );
  }
  if (bodyKeys.includes("steps")) {
    body.steps = await help.checkSteps(body.steps);
    validKeys.push(
      JSON.stringify(body.steps) === JSON.stringify(recipesList.steps)
    );
  }
  if (bodyKeys.includes("cookingSkillRequired")) {
    body.cookingSkillRequired = await help.checkCooking(
      body.cookingSkillRequired
    );
    validKeys.push(
      body.cookingSkillRequired === recipesList.cookingSkillRequired
    );
  }
  if (validKeys.length !== 0 && validKeys.includes(true)) {
    throw { code: 404, err: `Please provide different value for each field` };
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
  return updatedRecipeLike;
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  likeRecipe,
  patchRecipes,
};
