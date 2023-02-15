const mongoCollections = require("../config/mongoCollections");
let { ObjectId } = require("mongodb");
const recipes = mongoCollections.recipes;
let help = require("../helper");
const recipesData = require("./recipes");

const addComment = async function addComment(
  comment,
  recipeId,
  userId,
  username
) {
  await help.commentCheck(comment);
  await help.checkId(recipeId);

  const recipeCollection = await recipes();

  let recipeCommentAdd = await recipeCollection.findOne({
    _id: ObjectId(recipeId),
  });
  if (!recipeCommentAdd) {
    throw {
      code: 404,
      err: `Recipe not found with the provided ID ${recipeId}`,
    };
  }

  let commentData = {
    _id: new ObjectId(),
    userThatPostedComment: { _id: userId, username: username },
    comment: comment.trim(),
  };

  let commentAdded = await recipeCollection.updateOne(
    { _id: ObjectId(recipeId) },
    { $addToSet: { comments: commentData } }
  );
  if (commentAdded.modifiedCount === 0) {
    throw {
      code: 500,
      err: `Unable to add comment to the recipe with ID ${recipeId}`,
    };
  }

  let recipeCommentAdded = await recipesData.getRecipeById(recipeId);

  if (!recipeCommentAdded) {
    throw {
      code: 403,
      err: `Recipe not found with the provided ID ${recipeId}`,
    };
  }

  return recipeCommentAdded;
};

const deleteComment = async function addComment(recipeId, cid, uid) {
  await help.checkId(recipeId);
  await help.checkId(cid);
  const recipeCollection = await recipes();
  let recipeCommentDel = await recipeCollection.findOne({
    _id: ObjectId(recipeId),
  });
  if (!recipeCommentDel) {
    throw {
      code: 404,
      err: `Recipe not found with the provided ID ${recipeId}`,
    };
  }
  let comDel = false;
  let allComm = recipeCommentDel.comments;

  allComm.forEach(async (comment) => {
    if (comment._id.toString() === cid.toString()) {
      comDel = true;
      let recipeCommentDeleted = await recipeCollection.update(
        { _id: ObjectId(recipeId) },
        { $pull: { comments: { _id: ObjectId(cid) } } }
      );
      if (recipeCommentDeleted === 0) {
        throw {
          code: 500,
          err: `Comment ${cid} in recipe ${recipeId} could not be deleted`,
        };
      }
    }
  });
  if (comDel === false)
    throw {
      code: 400,
      err: `Either user not authorised to delete comment or comment ${cid} not found`,
    };
  let updatedRecipe = await recipesData.getRecipeById(recipeId);
  return updatedRecipe;
};
module.exports = {
  addComment,
  deleteComment,
};
