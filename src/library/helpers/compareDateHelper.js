module.exports.compareTime = (time1, time2) => {
  var date1 = new Date(time1).getTime();
  var date2 = new Date(time2).getTime();
  return date1 > date2;
};
