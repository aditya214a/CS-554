const mongoCollections = require("../config/mongoCollections");
let { ObjectId } = require("mongodb");
const users = mongoCollections.user;
const bcrypt = require("bcrypt");
let saltRounds = 10;
async function checkErrorN(name) {
  //NAME
  if (!name) throw { code: 400, err: `name might be empty` };
  if (typeof name != "string")
    throw { code: 400, err: `name needs to be a string` };
  name = name.trim();
  if (name.length < 4)
    throw {
      code: 400,
      err: `name might be only spaces or length less than 4`,
    };
  if (!name.match(/^[a-zA-Z ]*$/))
    throw { code: 400, err: `name must be alphanumeric and without space` };
}
async function checkError(username, password) {
  //USERNAME
  if (!username) throw { code: 400, err: `Username might be empty` };
  if (typeof username != "string")
    throw { code: 400, err: `Username needs to be a string` };
  username = username.trim();
  if (username.length < 4)
    throw {
      code: 400,
      err: `Username might be only spaces or length less than 4`,
    };
  if (!username.match(/^[a-zA-Z0-9]*$/))
    throw { code: 400, err: `Username must be alphanumeric and without space` };

  //PASSWORD
  if (!password) throw { code: 400, err: `Password might be empty` };
  if (typeof password != "string")
    throw { code: 400, err: `Password needs to be a string` };
  if (password.length < 6)
    throw { code: 400, err: `Password needs to be of atleast length 6` };
  if (
    !password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{6,}$/
    )
  )
    throw {
      code: 400,
      err: `Password needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character`,
    };
}
const createUser = async (name, username, password) => {
  const userData = await users();
  await checkError(username, password);
  await checkErrorN(name);

  name = name.toLowerCase();
  username = username.toLowerCase();
  let userExist = await userData.findOne({ username: username });
  if (userExist) {
    throw { code: 400, err: "Username already exists" };
  }
  hashedPassword = await bcrypt.hash(password, saltRounds);

  let userDetails = {
    _id: new ObjectId(),
    name: name,
    username: username,
    password: hashedPassword,
  };
  let userAdd = await userData.insertOne(userDetails);
  delete userDetails.password;
  if (userAdd.insertedCount === 0) {
    throw { code: 500, err: `Unable to add new user` };
  }
  obj = {};
  obj.id = userDetails._id;
  obj.name = userDetails.name;
  obj.username = userDetails.username;
  return userDetails;
};

const checkUser = async (username, password) => {
  const userData = await users();
  await checkError(username, password);
  username = username.toLowerCase();
  let userExist = await userData.findOne({ username: username });
  if (!userExist) {
    throw { code: 400, err: `Either the username or password is invalid` };
  }
  let comparePass = await bcrypt.compare(password, userExist.password);
  // console.log(comparePass);
  if (!comparePass) {
    throw { code: 400, err: `Either the username or password is invalid` };
  }
  return { authenticated: true, userId: userExist._id.toString() };
};

module.exports = {
  createUser,
  checkUser,
};
