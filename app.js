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

// UI Toggle
startBtn.addEventListener("click", () => {
  tool.classList.toggle("hidden");
});

// Generate input fields
function updateInputs() {
  inputsArea.innerHTML = "";

  const k1 = known1.value;
  const k2 = known2.value;
  const target = findValue.value;

  if (k1 === target || k2 === target || k1 === k2) return;

  const fields = {
    height: "Height (H)",
    distance: "Horizontal Distance (D)",
    angle: "Angle θ (degrees)",
    hyp: "Hypotenuse"
  };

  [k1, k2].forEach((val) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <label>${fields[val]}</label>
      <input type="number" step="any" id="${val}Input" placeholder="Enter ${fields[val]}"/>
    `;
    inputsArea.appendChild(row);
  });
}

known1.addEventListener("change", updateInputs);
known2.addEventListener("change", updateInputs);
findValue.addEventListener("change", updateInputs);

// Calculate
$("#calc").addEventListener("click", () => {
  const target = findValue.value;
  const k1 = known1.value;
  const k2 = known2.value;

  if (k1 === k2 || k1 === target || k2 === target) {
    alert("Invalid selection. Choose two different known values.");
    return;
  }

  let H = parseFloat($("#heightInput")?.value);
  let D = parseFloat($("#distanceInput")?.value);
  let A = parseFloat($("#angleInput")?.value);
  let Hyp = parseFloat($("#hypInput")?.value);

  stepsDiv.textContent = "";
  resultDiv.textContent = "";

  // Height + Distance → Angle
  if (target === "angle" && H && D) {
    let theta = Math.atan(H / D) * (180 / Math.PI);
    resultDiv.textContent = `Angle θ = ${theta.toFixed(2)}°`;
    stepsDiv.textContent =
      `tan(θ) = H/D\nθ = arctan(${H}/${D})\nθ = ${theta.toFixed(2)}°`;
  }

  // Height + Angle → Distance
  else if (target === "distance" && H && A) {
    let rad = A * Math.PI / 180;
    let dist = H / Math.tan(rad);
    resultDiv.textContent = `Horizontal Distance = ${dist.toFixed(2)} units`;
    stepsDiv.textContent =
      `tan(θ) = H/D\nD = H/tan(${A}°)\nD = ${dist.toFixed(2)}`;
  }

  // Distance + Angle → Height
  else if (target === "height" && D && A) {
    let rad = A * Math.PI / 180;
    let h = D * Math.tan(rad);
    resultDiv.textContent = `Height = ${h.toFixed(2)} units`;
    stepsDiv.textContent =
      `H = D × tan(${A}°)\nH = ${h.toFixed(2)}`;
  }

  // Height + Distance → Hyp
  else if (target === "hyp" && H && D) {
    let hyp = Math.sqrt(H * H + D * D);
    resultDiv.textContent = `Hypotenuse = ${hyp.toFixed(2)} units`;
    stepsDiv.textContent =
      `Hyp = √(H² + D²)\nHyp = ${hyp.toFixed(2)}`;
  }

  // Height + Hyp → Distance
  else if (target === "distance" && H && Hyp) {
    let D2 = Math.sqrt(Hyp * Hyp - H * H);
    resultDiv.textContent = `Horizontal Distance = ${D2.toFixed(2)} units`;
    stepsDiv.textContent =
      `D = √(Hyp² - H²)\nD = ${D2.toFixed(2)}`;
  }

  // Distance + Hyp → Height
  else if (target === "height" && D && Hyp) {
    let H2 = Math.sqrt(Hyp * Hyp - D * D);
    resultDiv.textContent = `Height = ${H2.toFixed(2)} units`;
    stepsDiv.textContent =
      `H = √(Hyp² - D²)\nH = ${H2.toFixed(2)}`;
  }

  // Hyp + Angle → Height
  else if (target === "height" && Hyp && A) {
    let rad = A * Math.PI / 180;
    let h = Hyp * Math.sin(rad);
    resultDiv.textContent = `Height = ${h.toFixed(2)} units`;
    stepsDiv.textContent =
      `H = Hyp × sin(${A}°)\nH = ${h.toFixed(2)}`;
  }

  // Hyp + Angle → Distance
  else if (target === "distance" && Hyp && A) {
    let rad = A * Math.PI / 180;
    let d = Hyp * Math.cos(rad);
    resultDiv.textContent = `Horizontal Distance = ${d.toFixed(2)} units`;
    stepsDiv.textContent =
      `D = Hyp × cos(${A}°)\nD = ${d.toFixed(2)}`;
  }

  else {
    alert("Please enter correct values.");
    return;
  }

  resultCard.style.display = "block";
});

// Clear
$("#clear").addEventListener("click", () => {
  inputsArea.innerHTML = "";
  resultCard.style.display = "none";
});
