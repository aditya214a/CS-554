let { ObjectId } = require("mongodb");

const checkTitle = async (title) => {
  //TITLE

  if (!title || typeof title != "string") {
    throw { code: 403, err: `Please provide valid Title` };
  } else if (!title.trim().match(/^[a-zA-Z ]*$/)) {
    throw { code: 403, err: `Invalid characters in title` };
  } else if (title.trim().length < 2) {
    throw { code: 403, err: `Title is empty or length less than 2` };
  }
  return title;
};

const checkIngredients = async (ingredients) => {
  //INGREDIENTS
  if (!ingredients || Array.isArray(ingredients) == false) {
    throw { code: 403, err: `Please provide valid ingredients` };
  } else if (ingredients.length < 4)
    throw { code: 403, err: `Atleast 1 ingredient required` };
  ingredients.forEach((element) => {
    if (!element || typeof element != "string") {
      throw { code: 403, err: `One or more ingredients invalid` };
    } else if (!element.trim().match(/^[-a-zA-Z0-9 ]*$/)) {
      throw { code: 403, err: `Invalid characters in one or more ingredients` };
    } else if (!(3 <= element.trim().length <= 50)) {
      throw {
        code: 403,
        err: `One or more ingredients with invalid length, valid length (between 3 to 50 char)`,
      };
    }
    element = element.trim();
  });
  return ingredients;
};

const checkSteps = async (steps) => {
  if (!steps || Array.isArray(steps) == false) {
    throw { code: 403, err: `Please provide valid steps` };
  } else if (steps.length < 5)
    throw { code: 403, err: `Atleast 5 step required` };
  steps.forEach((element) => {
    if (!element || typeof element != "string") {
      throw { code: 403, err: `One or more steps invalid` };
    } else if (!element.trim().match(/^[-a-zA-Z0-9(),.;: ]*$/)) {
      throw { code: 403, err: `Invalid characters in one or more steps` };
    } else if (element.trim().length <= 20) {
      throw {
        code: 403,
        err: `One or more steps with invalid length, valid length (greater than 20 char )`,
      };
    }
    element = element.trim();
  });
  return steps;
};

const checkCooking = async (cookingSkillRequired) => {
  if (!cookingSkillRequired || typeof cookingSkillRequired != "string") {
    throw { code: 403, err: `Cooking Skill Required is Invalid or empty` };
  } else if (
    cookingSkillRequired.trim() != "Novice" &&
    cookingSkillRequired.trim() != "Intermediate" &&
    cookingSkillRequired.trim() != "Advanced"
  ) {
    throw { code: 403, err: `It can only be  Novice, Intermediate, Advanced` };
  }
  return cookingSkillRequired.trim();
};

const checkErrorRecipes = async (
  title,
  ingredients,
  steps,
  cookingSkillRequired
) => {
  //TITLE
  if (!title || !ingredients || !steps || !cookingSkillRequired)
    throw { code: 403, err: `All fields need to have valid values` };
  let obj = {};
  if (!title || typeof title != "string") {
    throw { code: 403, err: `Please provide valid Title` };
  } else if (!title.trim().match(/^[a-zA-Z ]*$/)) {
    throw { code: 403, err: `Invalid characters in title` };
  } else if (title.trim().length < 2) {
    throw { code: 403, err: `Title is empty or length less than 2` };
  }
  obj["title"] = title.trim();

  //INGREDIENTS
  if (!ingredients || Array.isArray(ingredients) == false) {
    throw { code: 403, err: `Please provide valid ingredients` };
  } else if (ingredients.length < 4)
    throw { code: 403, err: `Atleast 1 ingredient required` };
  ingredients.forEach((element) => {
    if (!element || typeof element != "string") {
      throw { code: 403, err: `One or more ingredients invalid` };
    } else if (!element.trim().match(/^[-a-zA-Z0-9 ]*$/)) {
      throw { code: 403, err: `Invalid characters in one or more ingredients` };
    } else if (!(3 <= element.trim().length <= 50)) {
      throw {
        code: 403,
        err: `One or more ingredients with invalid length, valid length (between 3 to 50 char)`,
      };
    }
    element = element.trim();
  });
  obj["ingredients"] = ingredients;

  //STEPS
  if (!steps || Array.isArray(steps) == false) {
    throw { code: 403, err: `Please provide valid steps` };
  } else if (steps.length < 5)
    throw { code: 403, err: `Atleast 5 step required` };
  steps.forEach((element) => {
    if (!element || typeof element != "string") {
      throw { code: 403, err: `One or more steps invalid` };
    } else if (!element.trim().match(/^[-a-zA-Z0-9(),.;: ]*$/)) {
      throw { code: 403, err: `Invalid characters in one or more steps` };
    } else if (element.trim().length <= 20) {
      throw {
        code: 403,
        err: `One or more steps with invalid length, valid length (greater than 20 char )`,
      };
    }
    element = element.trim();
  });
  obj["steps"] = steps;
  // COOKINGSKILLSREQUIRED
  if (!cookingSkillRequired || typeof cookingSkillRequired != "string") {
    throw { code: 403, err: `Cooking Skill Required is Invalid or empty` };
  } else if (
    cookingSkillRequired.trim() != "Novice" &&
    cookingSkillRequired.trim() != "Intermediate" &&
    cookingSkillRequired.trim() != "Advanced"
  ) {
    throw { code: 403, err: `It can only be  Novice, Intermediate, Advanced` };
  }
  obj["cookingSkillRequired"] = cookingSkillRequired.trim();
  return obj;
};
const checkId = async (ID) => {
  if (
    !ID ||
    typeof ID != "string" ||
    !ObjectId.isValid(ID) ||
    !ID.trim().match(/^[0-9a-fA-F]*$/)
  ) {
    throw { code: 404, err: `Please provide valid ID` };
  } else if (ID.trim().length == 0) {
    throw { code: 404, err: `ID is empty or only spaces` };
  } else {
    return ID;
  }
};

const checkPatchBody = async (body) => {
  if (
    !body.title ||
    !body.cookingSkillRequired ||
    !body.ingredients ||
    !body.steps
  ) {
  }
};

const commentCheck = async (comment) => {
  if (!comment || typeof comment != "string") {
    throw { code: 403, err: `One or more comment invalid` };
  } else if (!comment.trim().match(/^[-a-zA-Z0-9()!?,.;: ]*$/)) {
    throw { code: 403, err: `Invalid characters in one or more comment` };
  } else if (comment.trim().length == 0) {
    throw {
      code: 403,
      err: `Comment with invalid length`,
    };
  }
  return comment.trim();
};

module.exports = {
  checkErrorRecipes,
  checkId,
  checkPatchBody,
  commentCheck,
  checkTitle,
  checkIngredients,
  checkSteps,
  checkCooking,
};
