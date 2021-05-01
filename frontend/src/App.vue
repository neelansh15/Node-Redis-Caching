<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card color="deep-purple darken-3" class="white--text">
          <v-card-title>
            Redis NoSQL Caching + Response Time Metrics
          </v-card-title>
          <v-card-subtitle class="deep-purple--text text--lighten-4">
            Neelansh Mathur 1911093
          </v-card-subtitle>
          <v-card-actions>
            <v-btn color="deep-purple lighten-4" @click="flushdb" text>Flush RedisDB</v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-if="responseTime" color="yellow darken-2" class="mt-3 mb-3">
          <v-card-title>Response Time</v-card-title>
          <v-card-text>
            <h1 class="text-h2">{{ responseTime }}</h1>
          </v-card-text>
        </v-card>
        <v-form @submit.prevent="submit">
          <v-text-field
            class="mt-5"
            color="purple"
            label="Search"
            v-model="search"
            outlined
          />
        </v-form>


        <v-row class="mt-5">
          <v-col v-for="item in results" :key="item.thumbnail" cols="12" md="4">
            <v-card>
              <v-img
                :aspect-ratio="9 / 16"
                height="300"
                v-if="item.thumbnail"
                :src="item.thumbnail"
                contain
              />
              <v-card-title> {{ item.title }} </v-card-title>
              <v-card-subtitle> <span v-for="author in item.authors" :key="author">{{author}} </span> </v-card-subtitle>
              <v-card-text><b>Publisher:</b> {{item.publisher}}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "App",

  components: {},

  data: () => ({
    search: "",
    results: [],
    responseTime: null,
  }),
  methods: {
    submit() {
      if (this.search != undefined && this.search != null) {
        axios({
          method: "GET",
          url: `http://localhost:8000/search?q=${this.search}`,
        }).then((res) => {
          this.results = res.data;
          this.responseTime = res.headers.responsetime;

          console.log(this.results);
        });
      }
    },
    flushdb(){
      axios.get('http://localhost:8000/flushall')
      .then((res) => {
        console.log(res)
      })
    }
  },
};
</script>
