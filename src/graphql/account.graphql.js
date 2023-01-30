import gql from "graphql-tag";

export const GET_ACCOUNTS = gql`
  query GetAllAccounts {
    getAllAccounts {
      id
      name
      bank
    }
  }
`;
