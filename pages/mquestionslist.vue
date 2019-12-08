<template>
  <v-layout>
    <v-flex class="text-center">
        <v-data-table
        :headers="headers"
        :items="questions"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        item-key="name"
        show-expand
        class="elevation-1"
        >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>アンケート管理</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length">Peek-a-boo!</td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { mapGetters, mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      expanded: [],
      singleExpand: false,
      headers: [
        {
          text: 'アンケート内容',
          align: 'left',
          sortable: false,
          value: 'text',
        },
        { text: 'isClosed', value: 'isClosed' },
        { text: 'isFinished', value: 'isFinished' },
        { text: '', value: 'data-table-expand' },
      ],
    }
  },
  components: {
  },
  computed: {
    ...mapGetters(['questions'])
  },
  created(){
    this.bindQuestions()
  },
  methods: {
    ...mapActions(['bindQuestions']),
  }
}
</script>
