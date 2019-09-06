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

exports.toGSC = (copper) => {
  const c = copper % 100;
  const s = Math.floor(copper / 100) % 100;
  const g = Math.floor(copper / 10000);
  return `**${g} <:gold:618818303615303700> ${s} <:silver:618818303632343111> ${c} <:copper:618818303577554989>**`;
}
