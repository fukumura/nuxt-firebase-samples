<template>
  <v-container fluid class='text-center'>
    <p class='justify-center display-1 font-weight-black'>{{ question.text }}</p>
    <hr class="separator">
    <doughnut-chart :chart-data="chartData" :options="chartOptions"/>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import colors from 'vuetify/es5/util/colors'
import firebase from '@/plugins/firebase'
const db = firebase.firestore()
export default {
  data() {
    return {
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
    ...mapGetters(['user'])
  },
  created: function(){
  },
  mounted: function() {
  },
  methods: {
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
    ...mapActions(['getQuestionResult'])
  },
}
</script>
