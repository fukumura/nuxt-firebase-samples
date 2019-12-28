<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-avatar v-if="authenticated">
        <img :src="user.photoURL" />
      </v-avatar>
      &nbsp;
      <v-btn v-if="authenticated" class="signout" text color="primary" @click="signOut"
        >logout</v-btn
      >
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { mapGetters } from 'vuex'
import firebase from '@/plugins/firebase'
export default {
  computed: {
    ...mapGetters(['authenticated', 'user', 'loading'])
  },
  methods: {
    signOut() {
      firebase.auth().signOut()
    }
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-comment-text',
          title: 'アンケート結果',
          to: '/analytics'
        },
        {
          icon: 'mdi-comment-plus-outline',
          title: 'アンケート追加',
          to: '/admin'
        },
        {
          icon: 'mdi-clipboard-text',
          title: 'アンケート管理',
          to: '/mquestions'
        },
        {
          icon: 'mdi-calendar',
          title: 'スケジュール',
          to: '/schedule'
        },
        {
          icon: 'mdi-account',
          title: 'myアカウント',
          to: '/inspire'
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'リアルタイムアンケート'
    }
  }
}
</script>
