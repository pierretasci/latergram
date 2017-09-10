<template lang='pug'>
  .calendar
    template(v-for='day in window_diff')
      .day 
        .month {{dateFor(day)}}
        .posts(v-for='post in postsFor(day)')
          .post {{timeForPost(post)}}
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
      window_start: moment(today).subtract(today.day() - 0 + 1, 'days')
        .valueOf(),
      // Exclusive range.
      window_end: moment(today)
        .subtract(today.day() - 0 + 1, 'days')
        .add(7, 'days')
        .valueOf(),
    };
  },

  computed: {
    filtered_posts: function() {
      return this.posts.filter((p) => 
        moment(p.post_time_utc).isSameOrAfter(moment(this.window_start)) && 
        moment(p.post_time_utc).isSameOrBefore(moment(this.window_end)));
    },
    window_diff: function() {
      return moment.duration(
        moment(this.window_end).diff(moment(this.window_start))).asDays();
    }
  },

  methods: {
    dateFor: function(dayOffset) {
      const day = moment(this.window_start).add(dayOffset, 'days');
      return day.format('MMMM DD');
    },

    postsFor: function(dayOffset) {
      const day = moment(this.window_start).add(dayOffset, 'days');
      return this.posts.filter((p) => {
        const post_time = moment(p.post_time_utc).tz(timezone);
        return post_time.isSame(day, 'day');
      });
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
    height: 2rem
    display: flex
    align-items: center
    justify-content: center
    border-bottom: 1px solid #666666

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

</style>