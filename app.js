function $(id) {
  return document.querySelector(id);
}

const tool = $("#tool");
const startBtn = $("#startBtn");
const findValue = $("#findValue");
const known1 = $("#known1");
const known2 = $("#known2");
const inputsArea = $("#inputsArea");
const resultCard = $("#result-card");
const resultDiv = $("#result");
const stepsDiv = $("#steps");


// ⭐ START ⇄ HOME BUTTON FIXED
startBtn.addEventListener("click", () => {
  if (tool.classList.contains("hidden")) {
    tool.classList.remove("hidden");
    startBtn.textContent = "Home";
    window.scrollTo(0, 0);
  } else {
    tool.classList.add("hidden");
    startBtn.textContent = "Start TrignoTool";
    window.scrollTo(0, 0);
  }
});


// ⭐ UPDATE INPUT FIELDS BASED ON SELECTION
function updateInputs() {
  inputsArea.innerHTML = "";

  const k1 = known1.value;
  const k2 = known2.value;
  const target = findValue.value;

  if (k1 === k2 || k1 === target || k2 === target) return;

  const labels = {
    height: "Height (H)",
    distance: "Horizontal Distance (D)",
    angle: "Angle θ (degrees)",
    hyp: "Hypotenuse"
  };

  [k1, k2].forEach((val) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <label>${labels[val]}</label>
      <input type="number" step="any" id="${val}Input" placeholder="Enter ${labels[val]}">
    `;
    inputsArea.appendChild(row);
  });
}

known1.addEventListener("change", updateInputs);
known2.addEventListener("change", updateInputs);
findValue.addEventListener("change", updateInputs);


// ⭐ CALCULATION SECTION
$("#calc").addEventListener("click", () => {
  const target = findValue.value;
  const k1 = known1.value;
  const k2 = known2.value;

  if (k1 === k2 || k1 === target || k2 === target) {
    alert("Invalid selection. Please choose two different known values.");
    return;
  }

  let H = parseFloat($("#heightInput")?.value);
  let D = parseFloat($("#distanceInput")?.value);
  let A = parseFloat($("#angleInput")?.value);
  let Hyp = parseFloat($("#hypInput")?.value);

  stepsDiv.textContent = "";
  resultDiv.textContent = "";

  function rad(x) { return (x * Math.PI) / 180; }
  function deg(x) { return (x * 180) / Math.PI; }


  // ⭐ ALL VALID TRIGONOMETRIC COMBINATIONS

  // HEIGHT + DISTANCE → ANGLE
  if (target === "angle" && H && D) {
    let theta = deg(Math.atan(H / D));
    resultDiv.textContent = `Angle θ = ${theta.toFixed(2)}°`;
    stepsDiv.textContent = `tan(θ) = H/D\nθ = arctan(${H}/${D})\nθ = ${theta.toFixed(2)}°`;
  }

  // HEIGHT + ANGLE → DISTANCE
  else if (target === "distance" && H && A) {
    let dist = H / Math.tan(rad(A));
    resultDiv.textContent = `Horizontal Distance = ${dist.toFixed(2)} units`;
    stepsDiv.textContent = `D = H / tan(${A}°)\nD = ${dist.toFixed(2)}`;
  }

  // DISTANCE + ANGLE → HEIGHT
  else if (target === "height" && D && A) {
    let h = D * Math.tan(rad(A));
    resultDiv.textContent = `Height = ${h.toFixed(2)} units`;
    stepsDiv.textContent = `H = D × tan(${A}°)\nH = ${h.toFixed(2)}`;
  }

  // HEIGHT + DISTANCE → HYPOTENUSE
  else if (target === "hyp" && H && D) {
    let hyp = Math.sqrt(H * H + D * D);
    resultDiv.textContent = `Hypotenuse = ${hyp.toFixed(2)} units`;
    stepsDiv.textContent = `Hyp = √(H² + D²)\nHyp = ${hyp.toFixed(2)}`;
  }

  // HEIGHT + HYP → DISTANCE
  else if (target === "distance" && H && Hyp) {
    let d2 = Math.sqrt(Hyp * Hyp - H * H);
    resultDiv.textContent = `Horizontal Distance = ${d2.toFixed(2)} units`;
    stepsDiv.textContent = `D = √(Hyp² - H²)\nD = ${d2.toFixed(2)}`;
  }

  // DISTANCE + HYP → HEIGHT
  else if (target === "height" && D && Hyp) {
    let h2 = Math.sqrt(Hyp * Hyp - D * D);
    resultDiv.textContent = `Height = ${h2.toFixed(2)} units`;
    stepsDiv.textContent = `H = √(Hyp² - D²)\nH = ${h2.toFixed(2)}`;
  }

  // HYP + ANGLE → HEIGHT
  else if (target === "height" && Hyp && A) {
    let h = Hyp * Math.sin(rad(A));
    resultDiv.textContent = `Height = ${h.toFixed(2)} units`;
    stepsDiv.textContent = `H = Hyp × sin(${A}°)\nH = ${h.toFixed(2)}`;
  }

  // HYP + ANGLE → DISTANCE
  else if (target === "distance" && Hyp && A) {
    let d = Hyp * Math.cos(rad(A));
    resultDiv.textContent = `Horizontal Distance = ${d.toFixed(2)} units`;
    stepsDiv.textContent = `D = Hyp × cos(${A}°)\nD = ${d.toFixed(2)}`;
  }

  else {
    alert("Please enter correct numeric values.");
    return;
  }

  resultCard.style.display = "block";
});


// ⭐ CLEAR BUTTON
$("#clear").addEventListener("click", () => {
  inputsArea.innerHTML = "";
  resultCard.style.display = "none";
});
