import { createApp, provide, h } from 'vue'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import router from './router' 
import App from './App.vue'

import SimpleTypeahead from 'vue3-simple-typeahead';
import 'vue3-simple-typeahead/dist/vue3-simple-typeahead.css';
import money from "v-money3";

import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";


const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  cache,
  uri: 'http://localhost:4000/graphql',
})

const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
}).use(router)

app
.use(SimpleTypeahead)
.use(money)
.use(Vue3ColorPicker)
.mount('#app')
