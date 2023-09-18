import * as Moment from 'moment';
import {extendMoment} from 'moment-range';

export const getDaysInAMonth = (year, month) => {
  const moment = extendMoment(Moment);
  const startDate = moment.utc([year, month]);
  console.log('Start Date: ', startDate);
  const firstDay = startDate.clone().startOf('month'); // Use 'clone()' to avoid altering 'startDate'
  const endDay = startDate.clone().endOf('month');

  const monthRange = moment.range(firstDay, endDay);
  const weeks = [];
  const days = Array.from(monthRange.by('day'));
  days.forEach(it => {
    if (!weeks.includes(it.week())) {
      weeks.push(it.week());
    }
  });

  const calendar = [];
  weeks.forEach(week => {
    const firstWeekDay = moment.utc([year, month]).week(week).day(0);
    const lastWeekDay = moment.utc([year, month]).week(week).day(6);
    const weekRange = moment.range(firstWeekDay.clone(), lastWeekDay.clone());
    calendar.push(Array.from(weekRange.by('day')));
  });

  return calendar;
};
