import gql from "graphql-tag";

export const GET_CATEGORIES = gql`
  query GetAllCategories {
    getAllCategories {
      color
      id
      name
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategorie($name: String, $color: String) {
    createCategorie(name: $name, color: $color) {
      id
      name
      color
    }
  }
`;
