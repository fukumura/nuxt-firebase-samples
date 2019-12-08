<template>
  <v-layout column justify-center align-center>
    <v-flex xs12>
      <div id="firebase-auth-container"></div>
    </v-flex>
  </v-layout>
</template>

<script>
import * as firebaseui from "firebaseui"
import firebase from '@/plugins/firebase'
export default {
  layout: 'default',
  mounted() {
    require('firebaseui/dist/firebaseui.css');
    const auth = firebase.auth()
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
    const config = {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: '/'
    }
    ui.start('#firebase-auth-container', config)
  }
}
</script>
