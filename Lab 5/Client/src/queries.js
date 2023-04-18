import { gql } from "@apollo/client";

const GET_API_LOCATIONS = gql`
  query locationPosts($pageNum: Int) {
    locationPosts(pageNum: $pageNum) {
      id
      image
      address
      name
      userPosted
      liked
    }
  }
`;

const GET_LIKED_LOCATIONS = gql`
  query {
    likedLocations {
      id
      image
      address
      name
      userPosted
      liked
    }
  }
`;

const GET_USER_LOCATIONS = gql`
  query {
    userPostedLocations {
      id
      image
      address
      name
      userPosted
      liked
    }
  }
`;

const ADD_LOCATION = gql`
  mutation uploadLocation($image: String!, $address: String!, $name: String!) {
    uploadLocation(image: $image, address: $address, name: $name) {
      id
      image
      address
      name
      userPosted
      liked
    }
  }
`;

const DELETE_LOCATION = gql`
  mutation deleteLocation($id: ID!) {
    deleteLocation(id: $id) {
      id
      image
      address
      name
      userPosted
      liked
    }
  }
`;

const EDIT_LOCATION = gql`
  mutation updateLocation(
    $id: ID!
    $image: String
    $address: String
    $name: String
    $userPosted: Boolean
    $liked: Boolean
  ) {
    updateLocation(
      id: $id
      image: $image
      address: $address
      name: $name
      userPosted: $userPosted
      liked: $liked
    ) {
      id
      image
      address
      name
      userPosted
      liked
    }
  }
`;

let queries = {
  GET_API_LOCATIONS,
  GET_LIKED_LOCATIONS,
  GET_USER_LOCATIONS,
  ADD_LOCATION,
  DELETE_LOCATION,
  EDIT_LOCATION,
};

export default queries;
