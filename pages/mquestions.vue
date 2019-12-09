<template>
  <v-layout>
    <v-flex class="text-center">
      <div v-if="questions">
        <ul>
          <li
            v-for="question in questions"
            :key="question.id"
            class='text-left'
          >
            <p>{{ question.text }}
              <span v-if="question.isClosed">
                <v-btn class=''
                @click="openQuestion(question.id)"
                >
                  アンケート開始
                </v-btn>
              </span>
              <span v-else>
                <v-btn class=''
                @click="closeQuestion(question.id)"
                >
                  アンケート停止
                </v-btn>
              </span>
              <span v-if="question.isFinished">
                
              </span>
            </p>
          </li>
        </ul>
      </div>
      <div class="ra-message" v-else>
        Please wait for question.
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
import Loginusers from '~/components/Loginusers.vue'

import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { mapGetters, mapActions, mapState } from 'vuex'

import firebase from '@/plugins/firebase'
const db = firebase.firestore()

export default {
  components: {
    Loginusers
  },
  computed: {
    ...mapGetters(['questions'])
  },
  created(){
    this.bindQuestions()
  },
  methods: {
    openQuestion (questionId) {
      console.log(questionId)
      const questionRef = db.collection('questions').doc(questionId)
      questionRef.set({
        isClosed: false
      },{
        merge: true
      }).then(function() {
       console.log("Document successfully update![questions.isClosed->open!]")
      })
      .catch(function(error) {
        console.error("Error writing document: ", error)
      })
      console.log(questionId)

      return true
    },
    closeQuestion (questionId) {
      console.log(questionId)
      const questionRef = db.collection('questions').doc(questionId)
      questionRef.set({
        isClosed: true
      },{
        merge: true
      }).then(function() {
       console.log("Document successfully update![questions.isClosed]")
      })
      .catch(function(error) {
        console.error("Error writing document: ", error)
      })
      console.log(questionId)

      return true
    },
    ...mapActions(['bindSamples','bindQuestions']),
  }
}
</script>
