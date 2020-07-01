// 时间转化

const addZero = num => {
  let str = num + '';
  return str.length === 1 ? '0' + str : str;
};

const formatRemainTime = ms => {
  const days = parseInt(ms / (1000 * 60 * 60 * 24));
  const hours = parseInt((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = parseInt((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = (ms % (1000 * 60)) / 1000;
  // return {
  //   hours: addZero(days * 24 + hours),
  //   minutes: addZero(minutes),
  //   seconds: addZero(parseInt(seconds))
  // }
  return (
    addZero(days * 24 + hours) +
    ':' +
    addZero(minutes) +
    ':' +
    addZero(parseInt(seconds))
  );
};

export default formatRemainTime;
