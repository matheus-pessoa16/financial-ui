<template>
    <Transition name="modal">
        <div v-if="props.show" class="modal-mask">
            <div class="modal-container">
                <div class="relative bg-white rounded-lg dark:bg-gray-600">
                    <div class="flex items-start justify-between p-4  rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            New Category
                        </h3>
                    </div>
                </div>

                <div class="modal-body">
                    <div class="bg-white rounded px-8 pt-6 pb-8 mb-4">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="category">
                                Category name
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="category" type="text" placeholder="Category name" v-model="categoryName">
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                                Color
                            </label>
                            <color-picker v-model:pureColor="pureColor" v-model:gradientColor="gradientColor"
                                format="hex" />
                            <span>{{ pureColor }}</span>
                        </div>

                    </div>
                </div>

                <div class="modal-footer flex justify-end">
                    <button @click="$emit('close')"
                        class="bg-white hover:bg-gray-100 focus:outline-none text-gray-800 font-semibold py-2 px-12 border border-gray-400 rounded shadow">
                        Close
                    </button>

                    <button @click="createCategory"
                        class="text-white bg-blue-700 font-semibold py-2 px-12 rounded shadow mx-8">
                        Save
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref } from "vue";
import { CREATE_CATEGORY, GET_CATEGORIES } from '@/graphql/category.graphql'
import { useMutation } from '@vue/apollo-composable';

const props = defineProps({
    show: Boolean
})

const pureColor = ref("#ff0000");
const gradientColor = ref("linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)");

const categoryName = ref('')

const emit = defineEmits(['close'])

const { mutate: createCategoryMutation } = useMutation(CREATE_CATEGORY, {
    update: (cache, { data: { createCategorie } }) => {
        let data = cache.readQuery({ query: GET_CATEGORIES })
        data = {
            ...data,
            getAllCategories: [
                ...data.getAllCategories,
                createCategorie,
            ],
        }
        cache.writeQuery({ query: GET_CATEGORIES, data })
    }
})

const createCategory = () => {
    if (categoryName.value && pureColor.value) {
        createCategoryMutation({
            name: categoryName.value,
            color: pureColor.value.replace('#', '')
        })

        emit('close')
    }
}

</script>

<style scoped>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    transition: opacity 0.3s ease;
}

.modal-container {
    width: 650px;
    height: 400px;
    margin: auto;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
}


.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>
