<template lang='pug'>
  .calendar
    template(v-for='day in window_diff')
      .day(:key='day') 
        .month 
          .day-of-week {{dayOfWeekFor(day)}}
          .day-of-month {{dateFor(day)}}
        .posts(v-for='post in postsFor(day)', :key='post._id')
          .post 
            .insignia(v-bind:class='insigniaClassForSchedule(post.schedule)')
            .post-info {{timeForPost(post)}}
    button(@click='loadMore') Load more...

</template>

<script>
import moment from 'moment-timezone';
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const today = moment().tz(timezone).startOf('day');

export default {
  data () {
    return {
      schedules: window.augustus.schedules,
      posts: window.augustus.posts.sort((a, b) => 
        moment(a.post_time_utc).valueOf() - moment(b.post_time_utc).valueOf()),
      // Must store as an epoch timestamp to allow for change updates.
      window_start: moment(today).subtract(today.day() - 0 + 1, 'days')
        .valueOf(),
      // Must store as an epoch timestamp to allow for change updates.
      window_end: moment(today)
        .subtract(today.day() - 0 + 1, 'days')
        .add(7, 'days')
        .valueOf(),
    };
  },

  computed: {
    posts_per_day: function() {
      const retval = {};
      const current = moment(this.window_start);
      this.posts.forEach((p) => {
        const post_time = moment(p.post_time_utc).tz(timezone);
        // If the post is before current, then skip to the next post.
        if (post_time.isBefore(current, 'day')) {
          return;
        }

        // If the post is after the current day, increment the current day until
        // this is no longer true or we reached the window end.
        while (current.isSameOrBefore(moment(this.window_end)) &&
          current.isBefore(post_time, 'day')) {
            current.add(1, 'days');
        }
        if (current.isAfter(moment(this.window_end))) {
          return;
        }

        // By now, we have either broken the loop or are on a day that is valid.
        if (!(current.format('YYYY-MM-DD') in retval)) {
          retval[current.format('YYYY-MM-DD')] = [];
        }
        retval[current.format('YYYY-MM-DD')].push(p);
      });
      return retval;
    },
    window_diff: function() {
      console.log(moment(this.window_end).diff(moment(this.window_start), 'days'));
      return moment(this.window_end).diff(moment(this.window_start), 'days');
    },
    schedule_color_map: function() {
      const color_map = {};
      this.schedules.forEach((s, i) => color_map[s._id] = i + 1);
      return color_map;
    }
  },

  methods: {
    insigniaClassForSchedule: function(schedule) {
      const retval = {};
      retval['insignia-' + this.schedule_color_map[schedule]] = true;
      return retval;
    },

    dateFor: function(dayOffset) {
      const day = moment(this.window_start).add(dayOffset, 'days');
      return day.format('MMMM DD');
    },

    dayOfWeekFor: function(dayOffset) {
      const day = moment(this.window_start).add(dayOffset, 'days');
      return day.format('dddd');
    },

    postsFor: function(dayOffset) {
      const day = moment(this.window_start).add(dayOffset, 'days');
      return this.posts_per_day[day.format('YYYY-MM-DD')];
    },

    timeForPost: function(post) {
      return moment(post.post_time_utc).tz(timezone).format('hh:mm A');
    },

    loadMore: function() {
      this.window_end = moment(this.window_end).add(7, 'days').valueOf();
    },
  },
}
</script>

<style scoped lang='stylus'>

.calendar
  flex: 1
  display: flex
  flex-wrap: wrap

  .month
    height: 3rem
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    border-bottom: 1px solid #666666

    .day-of-week
      font-weight: bold

  .day
    height: 300px
    border-top: 1px solid #666666
    border-right: 1px solid #666666
    border-bottom: 1px solid #666666
    width: (100% / 7)
    margin-bottom: 1.5rem

    &:nth-child(7n + 1)
      border-left: 1px solid #666666
    
  .posts
    flex: 1
    display: flex
    flex-direction: column
    justify-content: space-around
    padding: 0.2rem

    .post
      padding: 0.5rem
      border-radius: 3px
      border: 1px solid #ccc
      position: relative
      overflow: hidden

      .insignia
        position: absolute
        left: 0
        top: -0.1rem
        bottom: -0.1rem
        width: 0.2rem

        &.insignia-1
          background-color: #EF4836
        
        &.insignia-2
          background-color: #446CB3

        &.insignia-3
          background-color: #03C9A9

        &.insignia-4
          background-color: #F9BF3B

        &.insignia-5
          background-color: #BFBFBF

</style>