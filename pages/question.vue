<template>
  <v-layout>
    <v-flex class="text-center">
      <div v-if="activeQuestions.length > 0">
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
            v-if="getAnswered($store.state.user.uid, question.id) > 0"
          >
            回答受付済みです
          </v-alert>
          <h2>{{ question.text }} </h2>
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
  color: white;
  margin-top: 1rem;
  font-size: 1rem;
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
      isAnswered: true
    }
  },
  components: {
    Loginusers
  },
  computed: {
    ...mapGetters(['samples', 'questions','activeQuestions','user'])
  },
  created(){
    this.bindSamples(),
    this.bindQuestions(),
    this.bindActiveQuestions()
  },
  methods: {
    getAnswered(uid, questionId) {
      console.log('getAnswered')
      let isAnswered = this.alreadyAnswered({uid, questionId}) ? true : false
      console.log(isAnswered)
      return isAnswered ? 'done' : 'yet'
    },
    answer (event, uid, selection, questionId) {
      this.isAnswered = true;
      this.setAnswer({
        uid: uid,
        questionId: questionId,
        selectionId: selection.id
      })
    },
    ...mapActions(['bindSamples','bindQuestions','alreadyAnswered','bindActiveQuestions','setAnswer'])
  }
}
</script>
