<template>
  <v-layout>
    <v-flex class="text-center">
      <div>analytics.index</div>
      <div
         v-for="question in questions"
         :key="question.id"
         class='text-center'
      >
        <hr class="separator">
        <p class='display-1 font-weight-black py-5'>{{ question.text }}</p>
        <v-table class="table">
          <thead>
            <tr>
              <th>回答</th>
              <th>回答数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="selectionRef in question.selectionRefs" :key="selectionRef.index">
              <td class="display-1 font-weight-black">{{ selectionRef.text }}</td>
              <td class="display-3 font-weight-black">{{ (selectionRef.answerRefs) ? selectionRef.answerRefs.length : 0 }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import colors from 'vuetify/es5/util/colors';
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { mapGetters, mapActions, mapState } from 'vuex'
import firebase from '@/plugins/firebase'
const db = firebase.firestore()

export default {
  data() {
    return {
    }
  },
  components: {
  },
  computed: {
    ...mapGetters(['questions','user'])
  },
  created(){
    this.bindQuestions()
  },
  mounted: function() {
  },
  methods: {
    ...mapActions(['bindQuestions'])
  }
}
</script>
