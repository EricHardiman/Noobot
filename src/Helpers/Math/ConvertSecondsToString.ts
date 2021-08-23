const ConvertSecondsToString = (sec: number): string => {
  let hrs = Math.floor(sec / 3600);
  let min = Math.floor((sec - hrs * 3600) / 60);
  let seconds = sec - hrs * 3600 - min * 60;
  seconds = Math.round(seconds * 100) / 100;

  let result = hrs >= 1 ? hrs + 'h' : '';
  result += ' ' + (min >= 1 ? min + 'm' : '0m');
  result +=
    ' ' +
    (seconds < 10 ? '0' + seconds + 's' : seconds >= 10 ? seconds + 's' : '0s');
  return result;
};

export default ConvertSecondsToString;
