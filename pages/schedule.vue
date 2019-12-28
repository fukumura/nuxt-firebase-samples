<template>
  <section class="section">
    <div class="columns is-mobile">
      <full-calendar />
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
export default {
  name: 'Schedule',
  computed: {
    ...mapState(['user','events']),
    ...mapGetters(['isAuthenticated'])
  },
}
</script>
