const { ApolloServer, gql } = require("apollo-server");
const { createClient } = require("redis");
const uuid = require("uuid");
const redisClient = createClient();
const axios = require("axios");

// fsq3SiHmVKpte57tyEP2h8s0jNP9xHck0q9vtafrQPCTqhE=

(async () => {
  redisClient.on("error", (err) => console.log("Redis CLient Error", err));
  await redisClient.connect();
})();

const optionsLoc = {
  method: "GET",
  url: "https://api.foursquare.com/v3/places/search",
  headers: {
    accept: "application/json",
    Authorization: "fsq3SiHmVKpte57tyEP2h8s0jNP9xHck0q9vtafrQPCTqhE=",
  },
};
const header = {
  headers: {
    accept: "application/json",
    Authorization: "fsq3SiHmVKpte57tyEP2h8s0jNP9xHck0q9vtafrQPCTqhE=",
  },
};

const typeDefs = gql`
  # Queries
  type Query {
    locationPosts(pageNum: Int): [Location]
    likedLocations: [Location]
    userPostedLocations: [Location]
  }

  # Types
  type Location {
    id: ID!
    image: String!
    name: String!
    address: String
    userPosted: Boolean!
    liked: Boolean!
  }
  # Mutations
  type Mutation {
    uploadLocation(image: String!, address: String, name: String): Location
    updateLocation(
      id: ID!
      image: String
      name: String
      address: String
      userPosted: Boolean
      liked: Boolean
    ): Location
    deleteLocation(id: ID!): Location
  }
`;
const resolvers = {
  Query: {
    locationPosts: async (_, args) => {
      try {
        if (!args.pageNum) {
          args.pageNum = 1;
        }
        let { data } = await axios.request(optionsLoc);
        if (data.length === 0) throw ` No Data retrived`;

        let arr = [];
        // console.log(data.results);
        for (let i of data.results) {
          let imgUrl = "No Image";
          let img = await axios.get(
            `https://api.foursquare.com/v3/places/${i.fsq_id}/photos`,
            header
          );
          console.log(img);
          if (img && img.data[0]) {
            imgUrl = img.data[0].prefix + `original` + img.data[0].suffix;
          } else {
            imgUrl = "No Image";
          }
          //   console.log(imgUrl);
          let obj = {};
          obj.id = i.fsq_id;
          obj.image = imgUrl;
          obj.name = i.categories[0].name;
          obj.address = i.location.address;
          obj.userPosted = false;
          obj.liked = false;
          arr.push(obj);
        }

        return arr;
      } catch (e) {
        console.log(e);
        return e;
      }
    },

    likedLocations: async () => {
      try {
        const likedLis = await redisClient.lRange("likedList", 0, -1);
        if (!likedLis) {
          return [];
        }
        let arr = [];
        for (i in likedLis) {
          let loc = await redisClient.hGet("myLiked", likedLis[i]);
          arr.push(JSON.parse(loc));
        }
        return arr;
      } catch (e) {
        console.log(e);
        return e;
      }
    },
    userPostedLocations: async () => {
      try {
        const postLis = await redisClient.lRange("postList", 0, -1);
        if (!postLis) {
          return [];
        }
        let arr = [];
        for (i in postLis) {
          let post = await redisClient.hGet("myPost", postLis[i]);
          arr.push(JSON.parse(post));
        }
        return arr;
      } catch (e) {
        console.log(e);
        return e;
      }
    },
  },
  Mutation: {
    //    uploadLocation(image: String!, address: String, name: String): Location

    uploadLocation: async (_, args) => {
      try {
        console.log(args.image);
        if (!args.image) throw `Provide image url`;
        if (!args.address) throw `Provide address`;
        if (!args.name) throw `Provide name`;

        const img = args.image.trim();
        const address = args.address.trim();
        const name = args.name.trim();
        const id = uuid.v4();
        const newLoc = {
          id: id,
          image: img,
          name: name,
          address: address,
          userPosted: true,
          liked: false,
        };
        await redisClient.hSet("myPost", id, JSON.stringify(newLoc));
        await redisClient.lPush("postList", id);
        return newLoc;
      } catch (e) {
        console.log(e);
        return e;
      }
    },
    // updateLocation(
    //     id: ID!
    //     image: String
    //     name: String
    //     address: String
    //     userPosted: Boolean
    //     liked: Boolean
    //   ): Location
    updateLocation: async (_, args) => {
      try {
        if (!args.id) throw `Provide id url`;
        if (!args.image) throw `Provide image url`;
        if (!args.address) throw `Provide address`;
        if (!args.name) throw `Provide name`;
        // if (!args.userPosted) throw `Provide userPosted`;
        // if (!args.liked) throw `Provide liked`;
        const myLocCac = await redisClient.hExists("myLiked", args.id.trim());
        // console.log(myLocCac);
        const id = args.id.trim();
        const img = args.image.trim();
        const name = args.name.trim();
        const address = args.address.trim();
        const userPosted = args.userPosted;
        const liked = args.liked;
        const updatedLoc = {
          id: id,
          image: img,
          name: name,
          address: address,
          userPosted: userPosted,
          liked: liked,
        };
        if (updatedLoc.liked === false && myLocCac) {
          await redisClient.hDel("myLiked", updatedLoc.id);
          await redisClient.lRem("likedList", 0, updatedLoc.id);
          if (updatedLoc.userPosted) {
            await redisClient.hSet(
              "myPost",
              updatedLoc.id,
              JSON.stringify(updatedLoc)
            );
          }
        } else if (updatedLoc.liked === true && myLocCac) {
          await redisClient.hSet(
            "myLiked",
            updatedLoc.id,
            JSON.stringify(updatedLoc)
          );
          await redisClient.lPush("likedList", updatedLoc.id);
          if (updatedLoc.userPosted) {
            await redisClient.hSet(
              "myPost",
              updatedLoc.id,
              JSON.stringify(updatedLoc)
            );
          }
        } else if (updatedLoc.liked === false && !myLocCac) {
          await redisClient.hSet(
            "myLiked",
            updatedLoc.id,
            JSON.stringify(updatedLoc)
          );
          await redisClient.lPush("likedList", updatedLoc.id);
          if (updatedLoc.userPosted) {
            await redisClient.hSet(
              "myPost",
              updatedLoc.id,
              JSON.stringify(updatedLoc)
            );
          }
        } else if (updatedLoc.liked === true && !myLocCac) {
          await redisClient.hSet(
            "myLiked",
            updatedLoc.id,
            JSON.stringify(updatedLoc)
          );
          await redisClient.lPush("likedList", updatedLoc.id);
          if (updatedLoc.userPosted) {
            await redisClient.hSet(
              "myPost",
              updatedLoc.id,
              JSON.stringify(updatedLoc)
            );
          }
        }
        return updatedLoc;
      } catch (e) {
        console.log(e);
        return e;
      }
    },
    deleteLocation: async (_, args) => {
      try {
        const delLoc = await redisClient.hExists("myPost", args.id);
        let image = null;
        if (delLoc) {
          image = await redisClient.hGet("myPost", args.id);
          await redisClient.hDel("myPost", args.id);
          await redisClient.lRem("postList", 0, args.id);
          let locLiked = await redisClient.hExists("myLiked", args.id);
          if (locLiked) {
            await redisClient.hDel("myLiked", args.id);
            await redisClient.lRem("likedList", 0, args.id);
          }
        }
        return JSON.parse(image);
      } catch (e) {
        console.log(e);
        return e;
        return e;
      }
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
