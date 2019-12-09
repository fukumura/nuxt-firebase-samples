<template>
  <v-container fluid>
    <p class='justify-center display-1 font-weight-black'>{{ question.text }}</v-p>
    <hr class="separator">
    <table class="table">
      <thead>
        <tr>
          <th>回答</th>
          <th>回答数</th>
        </tr>
      </thead>
      <tbody class='justify-center'>
        <tr v-for="selectionRef in selections" :key="selectionRef.index">
          <td class="display-1 font-weight-black">{{ selectionRef.text }}</td>
          <td class="display-3 font-weight-black">{{ (selectionRef.answerRefs) ? selectionRef.answerRefs.length : 0 }}</td>
        </tr>
      </tbody>
    </table>
  </v-container>
</template>

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
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created(){
    this.getQuestion()
  },
  methods: {
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
          text: s.data().text,
          answerRefs: s.data().answerRefs
        })
      }
      this.question = question.data()
      this.selections = selections
    },

    ...mapActions([])
  },
}
</script>
