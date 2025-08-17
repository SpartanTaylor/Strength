
const rtsChart = {
  "10":   [1.00, 0.96, 0.92, 0.89, 0.86, 0.84, 0.81, 0.79, 0.76, 0.74, 0.72, 0.70],
  "9.5":  [0.978,0.943,0.910,0.880,0.852,0.826,0.802,0.779,0.757,0.737,0.717,0.698],
  "9":    [0.955,0.922,0.892,0.863,0.837,0.811,0.786,0.762,0.739,0.717,0.696,0.676],
  "8.5":  [0.939,0.907,0.878,0.850,0.824,0.799,0.774,0.751,0.729,0.707,0.686,0.667],
  "8":    [0.922,0.892,0.863,0.837,0.811,0.786,0.762,0.739,0.717,0.696,0.676,0.657],
  "7.5":  [0.907,0.878,0.850,0.824,0.799,0.774,0.751,0.729,0.707,0.686,0.667,0.648],
  "7":    [0.892,0.863,0.837,0.811,0.786,0.762,0.739,0.717,0.696,0.676,0.657,0.639],
  "6.5":  [0.878,0.850,0.824,0.799,0.774,0.751,0.729,0.707,0.686,0.667,0.648,0.630]
};

// Populate dropdowns
window.onload = () => {
  const topRPE = document.getElementById('topRPE');
  const backoffRPE = document.getElementById('backoffRPE');
  Object.keys(rtsChart).reverse().forEach(rpe => {
    let opt1 = document.createElement('option');
    opt1.value = rpe; opt1.text = rpe;
    topRPE.add(opt1.cloneNode(true));
    backoffRPE.add(opt1);
  });
};

function calculate() {
  const w = parseFloat(document.getElementById('topWeight').value);
  const reps = parseInt(document.getElementById('topReps').value);
  const rpe = document.getElementById('topRPE').value;
  const percent = parseInt(document.getElementById('backoffPercent').value)/100;
  const backoffReps = parseInt(document.getElementById('backoffReps').value);
  const backoffRPE = document.getElementById('backoffRPE').value;

  if (!rpe || !rtsChart[rpe] || reps < 1 || reps > 12) {
    document.getElementById('results').innerText = "Invalid input.";
    return;
  }

  const perc = rtsChart[rpe][reps-1];
  const e1rm = w / perc;

  const backoffWeightPercent = e1rm * percent;
  const targetPerc = rtsChart[backoffRPE][backoffReps-1];
  const backoffByRPE = e1rm * targetPerc;

  const lbsPlates = plateBreakdown(backoffByRPE, 'lbs');
  const kgPlates = plateBreakdown(backoffByRPE, 'kg');

  document.getElementById('results').innerHTML = `
    <p><b>Estimated 1RM:</b> ${e1rm.toFixed(1)} lbs / ${(e1rm/2.20462).toFixed(1)} kg</p>
    <p><b>Backoff by %:</b> ${backoffWeightPercent.toFixed(1)} lbs / ${(backoffWeightPercent/2.20462).toFixed(1)} kg</p>
    <p><b>Backoff by RPE/Reps:</b> ${backoffByRPE.toFixed(1)} lbs / ${(backoffByRPE/2.20462).toFixed(1)} kg</p>
    <p><b>Plate breakdown (lbs):</b> ${lbsPlates}</p>
    <p><b>Plate breakdown (kg):</b> ${kgPlates}</p>
  `;
}

function plateBreakdown(weight, unit) {
  let bar = unit==='lbs'?44:20;
  let target = unit==='lbs'?weight:(weight/2.20462);
  let perSide = (target-bar)/2;
  let plates = unit==='lbs'?[44,33,22,11,5.5,2.75]:[20,15,10,5,2.5,1.25];
  let used = [];
  for (let p of plates) {
    while (perSide+0.001 >= p) { perSide -= p; used.push(p); }
  }
  return used.length?used.join(', '):'None';
}
