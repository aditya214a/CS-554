import { gql } from "@apollo/client";

const GET_CHARACTER_LIST = gql`
  query Query1($pageNum: Int!) {
    characters(pageNum: $pageNum) {
      next
      prev
      result {
        id
        name
        description
        image
        resourceURI
      }
    }
  }
`;

const GET_CHARACTER = gql`
  query Query2($id: Int) {
    getCharacter(id: $id) {
      id
      name
      description
      image
      resourceURI
      collect
    }
  }
`;

const queries = {
  GET_CHARACTER,
  GET_CHARACTER_LIST,
};

export default queries;
