<template>
  <v-layout>
      <div v-if="wasAnswered">
        <p class='font-weight-black'>{{ question.text }}</p>について<br />
        ご回答ありがとうございました。
        <doughnut-chart :chart-data="chartData" :options="chartOptions"/>
      </div>
      <div class='display-1' v-else-if="question">
        <div class='text-center' >
          <h2 class='display-1 font-weight-black'>{{question.text}}</h2>
          <v-btn
             text
             class="display-1 a-select"
             v-for="selection in selections"
             :key="selection.id"
             @click="answer($event, selection.id)"
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
import colors from 'vuetify/es5/util/colors'
import firebase from '@/plugins/firebase'
const db = firebase.firestore()
export default {
  data() {
    return {
      questionId: this.$route.params.id,
      question: this.getQuestion(),
      selections: [],
      chartDataValues: [],
      chartColors: [],
      chartLabels: [],
      chartOptions: {
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic',
        },
     },
     wasAnswered: null
    }
  },
  computed: {
    chartData() {
      return {
        datasets: [
          {
            data: this.chartDataValues,
            backgroundColor: this.chartColors,
          },
        ],
        labels: this.chartLabels,
      };
    },
    ...mapGetters(['questions','user'])
  },
  created: function() {
  },
  mounted: function() {
    this.getAnswered()
  },
  methods: {
    async getAnswered() {
      const userId = this.$store.state.user.uid
      const status = await this.alreadyAnswered({
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
      const chartDataValues = []
      const chartLabels = []
      for (const selection of question.data().selectionRefs) {
        const s = await db.collection('selections')
                          .doc(selection.id)
                          .get()
        selections.push({
          id: s.data().id,
          text: s.data().text,
          answerRefs: s.data().answerRefs
        })
        chartDataValues.push(s.data().answerRefs.length)
        chartLabels.push(s.data().text)
      }
      this.question = question.data()
      this.selections = selections
      // setChartData
      this.chartDataValues = chartDataValues
      this.chartLabels = chartLabels
      this.chartColors = [
        colors.red.lighten1,
        colors.blue.lighten1,
        colors.yellow.lighten1,
        colors.green.lighten1,
      ]
    },
    ...mapActions(['setAnswer','alreadyAnswered'])
  },
}
</script>