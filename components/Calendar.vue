<template>
  <FullCalendar
    default-view="dayGridMonth"
    :locale="locale"
    :header="calendarHeader"
    :weekends="calendarWeekends"
    :plugins="calendarPlugins"
    :events="calendarEvents"
    @dateClick="setDateClick"
  />
</template>

<style>
@import '~/node_modules/@fullcalendar/core/main.css';
@import '~/node_modules/@fullcalendar/daygrid/main.css';
@import '~/node_modules/@fullcalendar/timegrid/main.css';
</style>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import jaLocale from '@fullcalendar/core/locales/ja'

export default {
  components: {
    FullCalendar
  },
  data () {
    return {
      locale: jaLocale,
      calendarHeader: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      calendarWeekends: true,
      calendarPlugins: [ 
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin
      ],
      calendarEvents: this.getCalendarEvents
    }
  },
  computed: {
    ...mapState(['user','events'])
  },
  created: function() {
  },
  methods: {
    async getCalendarEvents() {
      const _calendarEvents = await this.bindCalendarEvents({
        uid: this.$store.state.user.uid
      })
      const recordedCalendarEvents = []
      for (const event of _calendarEvents) {
        recordedCalendarEvents.push({
          title: event.title,
          start: event.start.toDate(),
          end: event.end.toDate(),
          textColor: 'white'
        })
      }
      return recordedCalendarEvents
    },
    setDateClick (arg) {
      const title = window.prompt("タイトルを入力してください", "")
      if (title) {
        this.setEventCalendar({
          uid: this.$store.state.user.uid,
          title: title,
          start: arg.date,
          end: arg.date,
        })
      }
    },
    ...mapActions(['bindCalendarEvents','setEventCalendar'])
  }
}
</script>
