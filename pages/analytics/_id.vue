<template>
<div>questionId {{questionId}}</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import firebase from '@/plugins/firebase'
const db = firebase.firestore()
export default {
  data() {
    return {
      questionId: this.$route.params.id
    }
  }
}
</script>