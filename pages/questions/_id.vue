<template>
  <v-layout>
      <div v-if="wasAnswered">
        <p class='font-weight-black'>{{ question.text }}</p>について<br />
        ご回答ありがとうございました。
        {{questionId}}
        <nuxt-link :to="{ name: 'analytics-id', params: { id: questionId } }">集計を見る</nuxt-link>
      </div>
      <div class='display-1' v-else-if="question">
        <div class='text-center' >
          <h2 class='display-1 font-weight-black'>{{question.text}}</h2>
          <v-btn
             text
             class="display-1 a-select"
             v-for="selection in selections"
             :key="selection.id"
             @click="answer($event, $store.state.user.uid, selection.id)"
          >{{ selection.text }}
          </v-btn>
        </div>
      </div>
      <div class='display-1' v-else>
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
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
  padding-top: 10px;
  margin-top: 2rem;
  font-size: 24px;
  & + & {
    margin: 2rem 0 0;
  }
}
</style> 
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import firebase from '@/plugins/firebase'
const db = firebase.firestore()
export default {
  data() {
    return {
      questionId: this.$route.params.id,
      question: this.getQuestion(),
      selections: [],
      wasAnswered: null
    }
  },
  computed: {
    ...mapGetters(['questions','user'])
  },
  created(){
    this.getQuestion()
  },
  mounted(){
    this.getAnswered()
  },
  methods: {
    async getAnswered() {
      const userId = this.$store.state.user.uid
      let status = await this.alreadyAnswered({
        uid: userId,
        questionId: this.$route.params.id
      })
      this.wasAnswered = status
    },
    answer (event, selectionId) {
      const userId = this.$store.state.user.uid
      const questionId = this.$route.params.id
      this.wasAnswered = true;
      this.setAnswer({
        uid: userId,
        questionId: questionId,
        selectionId: selectionId
      })
    },
    async getQuestion() {
      const question = await db.collection('questions')
                               .doc(this.$route.params.id)
                               .get()
      const selections = []
      for (const selection of question.data().selectionRefs) {
        const s = await db.collection('selections')
                          .doc(selection.id)
                          .get()
        selections.push({
          id: s.data().id,
          text: s.data().text
        })
      }
      this.question = question.data()
      this.selections = selections
    },
    ...mapActions(['setAnswer','alreadyAnswered'])
  },
}
</script>

