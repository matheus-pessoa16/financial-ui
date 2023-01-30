import gql from "graphql-tag";

export const GET_TRANSACTIONS = gql`
  query GetAllTransactions($page: Int, $input: TransactionFilters) {
    getAllTransactions(page: $page, input: $input) {
      reference
      currency
      amount
      date
      id
      category {
        name
        color
        id
      }
      account {
        name
        bank
        id
      }
    }
  }
`;

export const TOTAL_TRANSACTIONS = gql`
  query Query {
    countTransactions
  }
`;

export const GET_TRANSACTION = gql`
  query GetTransaction($getTransactionId: String) {
    getTransaction(id: $getTransactionId) {
      id
      reference
      date
      currency
      amount
      category {
        color
        name
        id
      }
      account {
        name
        bank
      }
    }
  }
`;

export const UPDATE_TRANSACTION_CATEGORY = gql`
  mutation UpdateTransactionCategory($id: String, $categoryId: String) {
    updateTransactionCategory(id: $id, categoryId: $categoryId) {
      id
      categoryId
      category {
        id
        name
        color
      }
    }
  }
`;
