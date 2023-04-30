import moment from 'moment';
const getYearlyData = () => {
  const year = moment().year(); // current year
  const months = moment.monthsShort();

  const data = [];

  // loop through each month in the year
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const month = months[monthIndex];
    const daysInMonth = moment(`${year}-${month}`, 'YYYY-MMMM').daysInMonth();

    // loop through each day in the month
    for (let dayIndex = 0; dayIndex < daysInMonth; dayIndex++) {
      const date = moment(`${year}-${month}-${dayIndex + 1}`, 'YYYY-MMMM-D');
      const dayOfWeek = date.format('dddd').substring(0, 3);
      const isCurrentMonth = date.month() === monthIndex;

      data.push({
        month,
        dayOfWeek,
        date: date.date(),
        key: moment(date),
        isCurrentMonth,
      });
    }
  }

  return data;
};

export default getYearlyData;
