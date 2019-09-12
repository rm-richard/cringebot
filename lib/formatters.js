exports.toDisplayedTime = (millisec) => {
  let seconds = Math.floor((millisec / 1000 % 60)).toFixed(0);
  let minutes = Math.floor((millisec / 1000 / 60) % 60).toFixed(0);
  let hours = Math.floor((millisec / 1000 / 60 / 60)).toFixed(0);

  var text = '';
  if (hours > 0) {
    text = text + hours + ' hours ';
  }
  if (minutes > 0) {
    text = text + minutes + ' minutes ';
  }
  text = text + seconds + ' seconds';
  return text;
}

exports.toGSC = (copper, omitZero = false) => {
  const c = copper % 100;
  const s = Math.floor(copper / 100) % 100;
  const g = Math.floor(copper / 10000);

  if (!omitZero) {
    return `**${g.toLocaleString()} <:gold:618818303615303700> ${s} <:silver:618818303632343111> ${c} <:copper:618818303577554989>**`;
  } else {
    var reply = '**';
    if (g > 0) reply += ` ${g.toLocaleString()} <:gold:618818303615303700>`;
    if (s > 0) reply += ` ${s} <:silver:618818303632343111>`;
    if (c > 0) reply += ` ${c} <:copper:618818303577554989>`;
    reply += '**';
    return reply;
  }
}

exports.bog = (amount) => {
  return `${amount}x <:boj:620585665805025280>`;
}
