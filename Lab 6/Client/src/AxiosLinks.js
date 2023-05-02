// const md5 = require("blueimp-md5");
// const publickey = "e245985f1f809f15e607255405346d88";
// const privatekey = "89aa0b084601a13ae2a1ce965cdfc331b2baf590";
// const ts = new Date().getTime();
// const stringToHash = ts + privatekey + publickey;
// const hash = md5(stringToHash);
// const baseUrl = "https://gateway.marvel.com:443/v1/public/characters";
// // const url = baseUrl + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;

// async function axiosCharLists(page = 1) {
//   offset = page * 20;
//   const { data } = await axios.get(
//     `${baseUrl}?limit=20&offset=${offset}&apikey=${publickey}&ts=${ts}&hash=${hash}`
//   );
//   return data;
// }

// async function axiosCharID(id) {
//   const { data } = await axios.get(
//     `${baseUrl}/${id}?apikey=${publickey}&ts=${ts}&hash=${hash}`
//   );
//   return data;
// }
