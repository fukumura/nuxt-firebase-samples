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
      chartDataValues: [],
      chartColors: [
        colors.red.lighten1,
        colors.blue.lighten1,
        colors.yellow.lighten1,
        colors.green.lighten1,
      ],
      chartLabels: ['とてもよかった', 'よかった', 'よくなかった', 'とてもよくなかった'],
      chartOptions: {
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic',
        },
      }
    };

  },
  components: {
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
  created(){
    this.bindQuestions({questionId: this.$route.params.id})
  },
  mounted: function() {
    this.randomizeData();
  },
  methods: {
    randomizeData: function() {
      var data = [];
      for (var i = 0; i < this.chartLabels.length; i++) {
        data.push(Math.floor(Math.random() * 100));
      }
      this.chartDataValues = data;
    },
    ...mapActions(['bindQuestions'])
  }
}
</script>
