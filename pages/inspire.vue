<template>
  <v-layout>
    <v-flex class="text-left">
      <ul>
        <li>email: {{ $store.state.user.email }} </li>
        <li>name :{{ $store.state.user.displayName }} </li>
        <li>uid  :{{ $store.state.user.uid }} </li>
        <li>Admin: {{ $store.state.user.isAdmin }} </li>
      </ul>
    </v-flex>
  </v-layout>
</template>
