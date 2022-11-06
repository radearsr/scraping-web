exports.getCurrentDay = () => {
  const date = new Date();
  const currentDay = date.getDay();
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
	return weekday[currentDay];
}

exports.getRandomDuration = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
