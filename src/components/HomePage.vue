<template>
  <div class="flex flex-col items-center" v-if="result">
    <div class="w-full shadow-lg">
      <h1 class="text-left text-xl font-semibold p-4">Transactions</h1>
      <div class="grid grid-cols-7 gap-4 p-4">
        <div class="col-span-3">
          <label for="searchBar"
            class="mb-1 block text-sm font-medium text-gray-600 dark:text-white text-left">Search</label>
          <div class="flex items-center h-auto w-full relative">
            <vue3-simple-typeahead id="searchBar" class="bg-gray-50 border border-gray-300 "
              placeholder="Search by category ..." :items="allCategories" :minInputLength="1"
              @selectItem="handleSelectItem" v-model="categoryName" v-if="categories">
            </vue3-simple-typeahead>
          </div>
        </div>

        <div class="col-span-1">
          <label for="banks" class="block mb-1 text-sm font-medium text-gray-600 dark:text-white text-left">Bank</label>
          <select id="banks" v-model="bankSelected" @change="filterTransactions"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>no filter applied</option>
            <option v-for="(bank, id) in banks" :key="id" :value="bank">{{ bank }}</option>
          </select>
        </div>

        <div class="col-span-1">
          <label for="accounts"
            class="block mb-1 text-sm font-medium text-gray-600 dark:text-white text-left">Account</label>
          <select id="accounts" v-model="accountName" @change="filterTransactions"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>no filter applied</option>
            <option v-for="(acc, id) in accounts" :value="acc" :key="id">{{ acc }}</option>
          </select>
        </div>

        <div class="col-span-1 ">
          <label for="startMonth"
            class="block mb-1 text-sm font-medium text-gray-600 dark:text-white text-left">Starting month</label>
          <div class="relative max-w-sm">

            <input datepicker type="text" v-model="startDate"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="yyyy-mm" id="startMonth">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor"
                viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>

        </div>

        <div class="col-span-1">
          <label for="endMonth" class="block mb-1 text-sm font-medium text-gray-600 dark:text-white text-left">Ending
            month</label>
          <div class="relative max-w-sm">

            <input datepicker type="text" v-model="endDate"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="yyyy-mm" id="endMonth">

            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor"
                viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>

          </div>

        </div>

      </div>

      <div class="p-4 border-b border-gray-200 shadow w-full">
        <table class="p-4 w-full">
          <thead class=" border-b border-t">
            <tr>
              <th class="p-8 text-xs text-gray-500 text-left">Reference</th>
              <th class="p-8 text-xs text-gray-500 text-left">Category</th>
              <th class="p-8 text-xs text-gray-500 text-left">Date</th>
              <th class="p-8 text-xs text-gray-500 text-left">Amount</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr class="whitespace-nowrap cursor-pointer border-b " v-for="transaction in filteredTransactions()"
              :key="transaction.id" @click="getTransactionDetails(transaction)">
              <td class="px-6 py-4 text-sm text-left text-gray-400" :class="{ 'text-gray-900': transaction.reference }"
                v-text="transaction.reference ? transaction.reference : 'No reference provided'"></td>
              <td class="px-6 py-4 text-left">
                <div class="rounded p-4 w-auto inline-block"
                  :style="{ backgroundColor: '#' + transaction.category.color }">
                  {{ transaction.category.name }}
                </div>
              </td>
              <td class="px-6 py-4 text-left" v-text="formatDate(transaction.date)"></td>
              <td class="px-8 py-4 text-left">
                {{ transaction.amount }}
                <span class="text-gray-400">{{ transaction.currency }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-end w-100 mt-4" v-if="TOTAL_TRANSACTIONS && transactions.length > 9">
          <v-pagination v-model="page" :pages="totalElements" :range-size="1" active-color="#DCEDFF"
            @update:modelValue="nextPage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuery } from "@vue/apollo-composable";
import { computed, ref, reactive, watch } from "vue";

import { GET_TRANSACTIONS, TOTAL_TRANSACTIONS } from "@/graphql/transaction.graphql";
import { GET_ACCOUNTS } from "@/graphql/account.graphql";
import { GET_CATEGORIES } from "@/graphql/category.graphql";

import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";

import dayjs from 'dayjs';

import { useRouter } from "vue-router";

const router = useRouter()

const startDate = ref('')
const endDate = ref('')

const page = ref(1)

const bankSelected = ref('no filter applied')
const accountName = ref('no filter applied')
const categoryName = ref('')

// const debounce = ref(null)

const { result, fetchMore, refetch } = useQuery(GET_TRANSACTIONS, () => ({
  page: page.value,
}));

const { result: getAccounts } = useQuery(GET_ACCOUNTS)

const { result: totalTransactions } = useQuery(TOTAL_TRANSACTIONS)

const { result: categories } = useQuery(GET_CATEGORIES);

const filters = reactive({})

var transactions = reactive([])

const filteredTransactions = () => {
  if (result.value) {
    transactions = result.value.getAllTransactions
  }
  return transactions
}

const banks = computed(() => {
  let allBanks = getAccounts.value?.getAllAccounts.map(a => a.bank) ?? []
  return [...new Set(allBanks)]
})

const accounts = computed(() => {
  let allAccounts = getAccounts.value?.getAllAccounts.map(a => a.name) ?? []
  return [...new Set(allAccounts)]
})

const totalElements = computed(() => totalTransactions.value?.countTransactions ?? [])

const allCategories = computed(() => categories.value?.getAllCategories.map(c => c.name) ?? [])

const nextPage = (event) => {
  page.value = event;

  let variables = {
    page: page.value
  }

  fetchMore({
    variables: variables,
  })
}

const formatDate = (dateString) => {
  const date = dayjs(dateString);
  return date.format('DD/MM/YY');
}

const filterTransactions = () => {

  if (bankSelected.value !== 'no filter applied') {
    filters['bank'] = bankSelected.value
  }

  if (accountName.value !== 'no filter applied') {
    filters['accountName'] = accountName.value
  }

  if (categoryName.value !== 'no filter applied') {
    filters['categoryName'] = categoryName.value
  }

  if (startDate.value && endDate.value) {
    filters['startDate'] = startDate.value
    filters['endDate'] = endDate.value
  }

  transactions = refetch({
    input: { ...filters }
  })
}

const handleSelectItem = (item) => {
  categoryName.value = item
  filterTransactions()
}

const getTransactionDetails = (transaction) => {
  router.push({ name: 'transaction-details', params: { id: transaction.id } })
}

watch(categoryName, (value) => {
  if (!value) {
    filterTransactions()
  }
})


watch(endDate, (value) => {
  if (value.length === 7 && startDate.value) {
    filterTransactions()
  }
})

</script>

<style scoped>
:deep(.Page) {
  font-weight: 400;
  padding: 24px;
  font-size: 1.5rem;
  line-height: 2rem;
  color: #4A5568;
  border-radius: 0;
}

:deep(.Pagination) {
  padding: 6px;
}

:deep(.PaginationControl) {
  padding: 15px;
}

:deep(.Control) {
  fill: #4A5568;
}

:deep() .simple-typeahead-input {
  width: 100%;
  padding: 0.625rem;
  padding-left: 2.5rem;
}

:deep() .simple-typeahead-list {
  text-align: left !important;
}
</style>
