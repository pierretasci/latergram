<template lang='pug'>
  .create-wrapper
    form.create.pure-form(method='POST')
      .title Create a new posting schedule
      .frequency
        select(name="repetition-type", v-model='repeats')
          template(v-for='type in repetition_types')
            option(:value='type.value') {{type.name}}
        
      label(for='date', v-if='isRepititionNone') Future post date:
      label(for='date', v-if='!isRepititionNone') Start date:
      input(type='date', name='date', required='true', v-model='date')
      
      label Choose time:
      input(type='number',
        max=12,
        min=1,
        name='hours',
        required='true',
        v-model='hours')
      span :
      input(type='number',
        max=60,
        min=0,
        name='minutes',
        required='true',
        v-model='minutes')
      select(name='meridian', required='true', v-model='meridian')
        option(value='AM') AM
        option(value='PM') PM

      input(type='text', hidden='true', v-model='timezone', name='timezone')
      input(type='text', hidden='true', v-model='csrf', name='_csrf')

      button(type='Submit') Submit
    
    .errors(v-if='errors')
      .error(v-for='error in errors') {{error}}
</template>

<script>
import constants from '../../constants';

const isErrors = 'errors' in window.augustus;
const valueOrDefault = (key) => {
  if (!isErrors) {
    if (key === 'repetition-type') {
      return constants.REPETITION_TYPES.REPEAT_NONE;
    }
    return null;
  }

  // Errors exists. Prefill the value.
  if (key in window.augustus.errors) {
    return window.augustus.errors[key].value;
  }
  return window.augustus.prefill[key];
}

const errorMessages = () => {
  if (!isErrors) {
    return null;
  }

  const errorMessages = [];
  for (let key in window.augustus.errors) {
    errorMessages.push(window.augustus.errors[key].msg);
  }
  return errorMessages;
}

export default {
  data () {
    return {
      repetition_types: [
        { name: 'One Off', value: constants.REPETITION_TYPES.REPEAT_NONE },
        { name: 'Weekly', value: constants.REPETITION_TYPES.REPEAT_WEEKLY },
        { name: 'Weekdays', value: constants.REPETITION_TYPES.REPEAT_WEEKDAYS },
        { name: 'Weekends', value: constants.REPETITION_TYPES.REPEAT_WEEKENDS },
        { name: 'Everyday', value: constants.REPETITION_TYPES.REPEAT_EVERYDAY },
      ],
      // Form models.
      repeats: valueOrDefault('repetition-type'),
      date: valueOrDefault('date'),
      hours: valueOrDefault('hours'),
      minutes: valueOrDefault('minutes'),
      meridian: valueOrDefault('meridian'),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      csrf: window.augustus.csrfToken,
      errors: errorMessages(),
    };
  },

  computed: {
    isRepititionNone: function() {
      return this.repeats === constants.REPETITION_TYPES.REPEAT_NONE;
    },
  },
}
</script>

<style scoped lang='stylus'>

.create-wrapper
  margin-bottom: 2rem

.create
  display: flex
  height: 2rem
  align-items: center

  & > *:not(:last-child)
    margin-right 0.5rem

  .title
    color: #333
    font-weight: bold

  label
    color: #666666
    font-weight: 300
</style>