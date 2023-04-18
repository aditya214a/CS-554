import axios from "axios";
const apiKey = "7elxdku9GGG5k8j0Xm8KWdANDgecHMV0";
const url = "https://app.ticketmaster.com/discovery/v2/";
// https://app.ticketmaster.com/discovery/v2/events?apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0&locale=*

export async function axiosLists(category, page = 1) {
  const { data } = await axios.get(
    `${url}${category}?apikey=${apiKey}&locale=*&page=${page - 1}&size=51`
  );
  // console.log("VENUES");
  // console.log(data._embedded);
  return data._embedded;
}

export async function axiosID(category, id) {
  const { data } = await axios.get(`${url}${category}/${id}?apikey=${apiKey}`);
  return data;
}

export async function axiosSearch(category, searchTerm) {
  const { data } = await axios.get(
    `${url}${category}?apikey=${apiKey}&keyword=${searchTerm}`
  );
  return data;
}
