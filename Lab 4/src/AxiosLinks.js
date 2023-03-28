import axios from "axios";
const apiKey = "7elxdku9GGG5k8j0Xm8KWdANDgecHMV0";
const url = "https://app.ticketmaster.com/discovery/v2/";
// https://app.ticketmaster.com/discovery/v2/events?apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0&locale=*

export async function axiosLists(category, offset) {
  const { data } = await axios.get(
    `${url}${category}?apikey=${apiKey}&locale=*&page=${offset - 1}`
  );
  return data;
}

export async function axiosID(category, id) {
  const { data } = await axios.get(`${url}${category}/${id}?apikey=${apiKey}`);
  //   console.log(data);
  return data;
}

// export async function axiosSearch(category, searchTerm) {
//   const { data } = await axios.get(
//     `${url}${category}?nameStartsWith=${searchTerm}&apikey=${apiKey}`
//   );
//   return data;
// }

// export async function axiosSearchComicNSeries(category, searchTerm) {
//   const { data } = await axios.get(
//     `${url}${category}?titleStartsWith=${searchTerm}&apikey=${apiKey}`
//   );
//   return data;
// }
