<template>
    <div class="flex flex-col items-center">
        <div class="w-8/12 p-8 " v-if="transaction">
            <div class="mb-4">
                <div class="my-4 p-4 mb-24 bg-gray-100 border border-gray-200 dark:border-gray-600">
                    <router-link to="/" class="font-medium text-2xl flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" strokeWidth={1.5}
                            stroke="currentColor" className="w-6 h-6" class="mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>

                        All Transactions</router-link>
                </div>

                <h1 class="font-medium text-lg">{{ formatDate(transaction.date) }}</h1>
                <div class="">

                    <span class="mr-2 font-medium text-2xl">{{ currencies[transaction.currency] }}</span>
                    <money3 disabled class="font-medium text-2xl w-32 max-w-2xl" v-model="transaction.amount"
                        v-bind="config" />
                    <span class="text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
                        :style="{ backgroundColor: '#' + transaction.category.color }">
                        {{ transaction.category.name }}
                    </span>

                </div>
            </div>
            <div
                class="w-full p-8 max-w-full bg-gray-50 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div class="flex justify-between mb-6">
                    <span class="text-2xl font-semibold text-gray-600">{{ transaction.account.name }}</span>
                    <span class="font-medium text-lg text-gray-500">{{ formatDate(transaction.date) }}</span>
                </div>

                <div class="border-b border-gray-200 my-4 pb-4">
                    <span class="block text-2xl pb-2 font-medium text-gray-600">Bank</span>
                    <span class="text-xl text-gray-500 ">{{ transaction.account.bank }}</span>
                </div>

                <div class="border-b border-gray-200 my-4 pb-4">
                    <span class="block text-2xl pb-2 font-medium text-gray-600">Reference</span>
                    <span class="text-xl text-gray-500">{{
                        transaction.reference ? transaction.reference : 'No reference provided'
                    }}</span>
                </div>

                <div class="border-b border-gray-200 my-4 pb-4">
                    <span class="block text-2xl pb-2 font-medium text-gray-600">Category</span>
                    <span class="text-lg font-medium mr-2 px-2.5 py-1.5 rounded text-gray-800 flex items-center w-fit"
                        :style="{ backgroundColor: '#' + transaction.category.color }">{{
                            transaction.category.name
                        }}
                        <button type="button" @click="editCategory"
                            class="inline-flex items-center p-0.5 ml-2 text-sm text-gray-400 bg-transparent rounded-sm hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20"
                                stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </button>
                    </span>

                    <div class="flex items-center h-auto w-full relative my-2 justify-start"
                        v-if="showSelectNewCategory">
                        <vue3-simple-typeahead id="searchBar" class="bg-white border border-gray-300 w-5/12 rounded p-4"
                            placeholder="Select a category..." :items="allCategories" :minInputLength="1"
                            @selectItem="handleSelectItem" v-model="categoryName" v-if="categories">
                        </vue3-simple-typeahead>

                        <button type="button" @click="openAddCategory"
                            class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
                            Add category</button>


                    </div>
                </div>

                <div class="flex justify-end">
                    <span class="mr-2 font-medium text-2xl">{{ currencies[transaction.currency] }}</span>
                    <money3 disabled class="font-medium text-2xl w-32 max-w-2xl" v-model="transaction.amount"
                        v-bind="config" />
                </div>
            </div>
        </div>

        <Teleport to="body">
            <CategoryModal :show="showAddCategory" @close="showAddCategory = false">
            </CategoryModal>
        </Teleport>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { GET_TRANSACTION, UPDATE_TRANSACTION_CATEGORY } from '@/graphql/transaction.graphql'
import { useQuery, useMutation } from '@vue/apollo-composable';
import { computed, ref } from 'vue';
import { GET_CATEGORIES } from "@/graphql/category.graphql";

import dayjs from 'dayjs';

import CategoryModal from './CategoryModal.vue'


const route = useRoute()

const currencies = {
    'EUR': '€',
    'GBP': '£'
}

const config =
{
    decimal: ".",
    thousands: ",",
    suffix: "",
    precision: 2,
}

const showSelectNewCategory = ref(false)

const categoryName = ref('')

const showAddCategory = ref(false)

const { result } = useQuery(GET_TRANSACTION, () => ({
    getTransactionId: route.params.id,
}))

const { result: categories } = useQuery(GET_CATEGORIES);

const transaction = computed(() => result.value?.getTransaction ?? null)


const { mutate: updateCategory } = useMutation(UPDATE_TRANSACTION_CATEGORY, () => ({
    variables: {
        id: transaction.value.id,
    },
}))

const allCategories = computed(() => categories.value?.getAllCategories.map(c => c.name) ?? [])

const formatDate = (dateString) => {
    const date = dayjs(dateString);
    return date.format('MMMM DD, YYYY');
}

const editCategory = () => {
    showSelectNewCategory.value = true
}

const handleSelectItem = (item) => {
    let categoryName = item

    let newCategory = categories.value.getAllCategories.find(c => c.name === categoryName)

    if (newCategory && newCategory !== transaction.value.category.name) {

        updateCategory({
            categoryId: newCategory.id
        })
    }

    showSelectNewCategory.value = false
}

const openAddCategory = () => {
    showAddCategory.value = true
}

</script>

<style scoped>
.w-fit {
    width: fit-content;
}
</style>