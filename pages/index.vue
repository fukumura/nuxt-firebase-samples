<template>
  <v-layout>
    <v-flex class="text-center">
      <div v-if="activeQuestions">
        <ul
         v-for="question in activeQuestions"
         :key="question.id"
          class='text-center'
        >
          <li class='a-select font-weight-black'>
            <nuxt-link :to="{ name: 'questions-id', params: { id: question.id } }">{{ question.text }}</nuxt-link>
          </li>
        </ul>
      </div>
      <div v-else>
        アンケート開始までお待ち下さい
      </div>
      <div class="ra-message" v-else>
        Please wait for question.
      </div>

    </v-flex>
  </v-layout>
</template>

<style lang="scss" scoped>
.a-question {
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  text-align: center;
  font-size: 1rem;
}
.a-select {
  display: block;
  width: 100%;
  color: black;
  margin-top: 1rem;
  font-size: 24px;
  & + & {
    margin: 2rem 0 0;
  }
}
</style>
<script>
import Loginusers from '~/components/Loginusers.vue'
import { mapGetters, mapActions, mapState } from 'vuex'
import firebase from '@/plugins/firebase'
const db = firebase.firestore()

export default {
  data: function () {
    return {
    }
  },
  components: {
    Loginusers
  },
  computed: {
    ...mapGetters(['activeQuestions','user'])
  },
  created(){
    this.bindActiveQuestions()
  },
  methods: {
    ...mapActions(['bindActiveQuestions'])
  }
}
</script>
