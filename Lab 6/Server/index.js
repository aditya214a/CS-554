const { ApolloServer, gql } = require("apollo-server");
const { createClient } = require("redis");
const uuid = require("uuid");
const redisClient = createClient();
const axios = require("axios");

// Your public key - e245985f1f809f15e607255405346d88
// Your private key- 89aa0b084601a13ae2a1ce965cdfc331b2baf590
const md5 = require("blueimp-md5");
const publickey = "e245985f1f809f15e607255405346d88";
const privatekey = "89aa0b084601a13ae2a1ce965cdfc331b2baf590";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/characters";
// const url = baseUrl + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;

(async () => {
  redisClient.on("error", (err) => console.log("Redis CLient Error", err));
  await redisClient.connect();
})();

async function axiosCharLists(page = 1) {
  offset = (page - 1) * 20;
  const { data } = await axios.get(
    `${baseUrl}?limit=20&offset=${offset}&apikey=${publickey}&ts=${ts}&hash=${hash}`
  );
  return data;
}

async function axiosCharID(id) {
  const { data } = await axios.get(
    `${baseUrl}/${id}?apikey=${publickey}&ts=${ts}&hash=${hash}`
  );
  return data;
}

// const optionsLoc = {
//   method: "GET",
//   url: "https://api.foursquare.com/v3/places/search",
//   headers: {
//     accept: "application/json",
//     Authorization: "fsq3SiHmVKpte57tyEP2h8s0jNP9xHck0q9vtafrQPCTqhE=",
//   },
// };
// const header = {
//   headers: {
//     accept: "application/json",
//     Authorization: "fsq3SiHmVKpte57tyEP2h8s0jNP9xHck0q9vtafrQPCTqhE=",
//   },
// };

const typeDefs = gql`
  # All the queries
  type Query {
    characters(pageNum: Int!): CharacterList
    getCharacter(id: Int): Characters
  }

  # All the types
  type CharacterList {
    next: String
    prev: String
    result: [Characters]
  }

  type Characters {
    id: Int!
    name: String!
    description: String!
    thumbnail: [Thumbnail]
    image: String!
    resourceURI: String!
    collect: Boolean!
  }

  type Thumbnail {
    path: String!
    extension: String!
  }
`;

const resolvers = {
  Query: {
    characters: async (_, args) => {
      pageNum = args.pageNum;
      if (!pageNum) {
        pageNum = 1;
      }
      const pageInCache = await redisClient.hExists(
        "characterList",
        pageNum.toString()
      );
      if (pageInCache) {
        const pageCache = await redisClient.hGet(
          "characterList",
          pageNum.toString()
        );
        return JSON.parse(pageCache);
      } else {
        try {
          const { data } = await axiosCharLists(pageNum);
          console.log(data.results);
          const result = data.results.map((x) => {
            let id = x.id;
            let image = x.thumbnail.path + "." + x.thumbnail.extension;
            let character = {
              id: id,
              name: x.name,
              description: x.description,
              image: image,
              resourceURI: x.resourceURI,
              collect: false,
            };
            return character;
          });
          let characterList = {
            next: `${baseUrl}?limit=20&offset=${
              (pageNum + 1) * 20
            }&apikey=${publickey}&ts=${ts}&hash=${hash}`,
            prev: `${baseUrl}?limit=20&offset=${
              (pageNum - 1) * 20
            }&apikey=${publickey}&ts=${ts}&hash=${hash}`,
            result: result,
          };
          await redisClient.hSet(
            "characterList",
            pageNum.toString(),
            JSON.stringify(characterList)
          );
          return characterList;
        } catch (e) {
          throw e;
        }
      }
    },
    getCharacter: async (_, args) => {
      try {
        if (!args.id) {
          throw `Please provide a valid ID`;
        }

        let characterInCache;
        let id = args.id;
        if (id) {
          characterInCache = await redisClient.hExists(
            "character",
            id.toString()
          );
        }

        if (characterInCache && id) {
          const characterCache = await redisClient.hGet(
            "character",
            id.toString()
          );
          return JSON.parse(characterCache);
        }
        let dataApi = await axiosCharID(id);

        const { data } = dataApi;
        let dataCh = data.results[0];
        let image = dataCh.thumbnail.path + "." + dataCh.thumbnail.extension;
        const charData = {
          id: id,
          name: dataCh.name,
          description: dataCh.description,
          image: image,
          resourceURI: dataCh.resourceURI,
          collect: false,
        };
        if (id) {
          await redisClient.hSet(
            "character",
            id.toString(),
            JSON.stringify(charData)
          );
        } else {
          await redisClient.hSet(
            "character",
            data.id.toString(),
            JSON.stringify(charData)
          );
        }
        return charData;
      } catch (e) {
        throw e;
      }
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
