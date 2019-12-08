<template>
  <v-layout>
    <v-flex class="text-center">
      <div v-if="activeQuestions">
        <div
         v-for="question in activeQuestions"
         :key="question.id"
          class='text-center'
        >
          <v-alert
            border="top"
            colored-border
            type="info"
            elevation="2"
            v-if="isAnswered"
          >
            回答受付済みです
          </v-alert>
          <h2 class='display-1 font-weight-black'>
            <nuxt-link :to="{ name: 'questions-id', params: { id: question.id } }">{{ question.text }}</nuxt-link>
          </h2>
          <v-btn
             text
             class="ra-select"
             v-for="selection in question.selectionRefs"
             :key="selection.id"
             @click="answer($event, $store.state.user.uid, selection, question.id)"
          >{{ selection.text }}
          </v-btn>
          </p>
        </div>
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
.ra-question {
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  text-align: center;
  font-size: 1rem;
}
.ra-select {
  display: block;
  width: 100%;
  color: black;
  margin-top: 1rem;
  font-size: 2rem;
  & + & {
    margin: 2rem 0 0;
  }
}
</style>
<script>
import Loginusers from '~/components/Loginusers.vue'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { mapGetters, mapActions, mapState } from 'vuex'
import firebase from '@/plugins/firebase'
const db = firebase.firestore()

export default {
  data: function () {
    return {
      isAnswered: this.getAnswered()
    }
  },
  components: {
    Loginusers
  },
  computed: {
    ...mapGetters(['samples', 'questions','activeQuestions','user'])
  },
  created(){
    this.setUser(),
    this.getAnswered(),
    this.bindQuestion(),
    this.bindActiveQuestion()
  },
  methods: {
    async getAnswered() {
      // TODO: うまくバインドできない 
      // let status = await this.alreadyAnswered({uid, questionId})
      // return status
    },
    answer (event, uid, selection, questionId) {
      this.isAnswered = true;
      this.setAnswer({
        uid: uid,
        questionId: questionId,
        selectionId: selection.id
      })
    },
    ...mapActions(['setUser','bindQuestion','alreadyAnswered','setAlreadyAnswered','bindActiveQuestion','setAnswer'])
  }
}
</script>
