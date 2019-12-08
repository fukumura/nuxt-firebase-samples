<template>
  <v-container fluid>
    <doughnut-chart :chart-data="chartData" :options="chartOptions"/>

    <div class="text-xs-center mt-2">
      <v-btn dark color="indigo" @click="randomizeData()">update data</v-btn>
    </div>
  </v-container>
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
      chartLabels: this.getChartLabels({questionId: '73nVxAszOFNqGieC6aXj'}),
      chartOptions: {
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeInOutCubic',
        },
      },
      questioId: null
    };
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
    ...mapActions(['getChartLabels'])
  },
};
</script>
