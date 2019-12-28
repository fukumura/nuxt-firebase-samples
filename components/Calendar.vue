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
      calendarEvents:  []
    }
  },
  methods: {
    setDateClick (arg) {
      if (confirm('スケジュールを' + arg.dateStr + 'に追加しますか ?')) {
        this.calendarEvents.push({
          title: '新規スケジュール',
          start: arg.date,
          allDay: arg.allDay
        })
      }
    }
  }
}
</script>
