<template>
  <v-container fluid class='text-center'>
    <p class='justify-center display-1 font-weight-black'>{{ question.text }}</p>
    <hr class="separator">
    <v-table class="center">
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
    </v-table>
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
      question: this.getQuestionResult(),
      selections: [],
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created(){
    this.getQuestionResult({
      questionId: this.$route.params.id,
      uid: this.$store.state.user.uid 
    })
  },
  methods: {
    ...mapActions(['getQuestionResult'])
  },
}
</script>
