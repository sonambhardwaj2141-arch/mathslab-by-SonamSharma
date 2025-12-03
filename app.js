// ===============================
// Helper Shortcut
// ===============================
const $ = (q) => document.querySelector(q);

const findValue = $("#findValue");
const known1 = $("#known1");
const known2 = $("#known2");
const inputsArea = $("#inputsArea");
const calcBtn = $("#calc");
const clearBtn = $("#clear");
const resultCard = $("#result-card");
const resultDiv = $("#result");
const stepsDiv = $("#steps");

// Toggle steps
function toggleSteps() {
  if (stepsDiv.classList.contains("hidden")) {
    stepsDiv.classList.remove("hidden");
    this.textContent = "Hide Steps";
  } else {
    stepsDiv.classList.add("hidden");
    this.textContent = "Show Steps";
  }
}

// ===============================
// Unit Conversion
// ===============================
const toMeters = {
  m: v => v,
  cm: v => v / 100,
  dm: v => v / 10,
  km: v => v * 1000,
  ft: v => v * 0.3048,
  inch: v => v * 0.0254
};

const fromMeters = {
  m: v => v,
  cm: v => v * 100,
  dm: v => v * 10,
  km: v => v / 1000,
  ft: v => v / 0.3048,
  inch: v => v / 0.0254
};

// Rounder
const r2 = (x) => Number(x).toFixed(2);
const r4 = (x) => Number(x).toFixed(4);

// ===============================
// Create Dynamic Input Fields
// ===============================
function updateInputs() {
  const k1 = known1.value;
  const k2 = known2.value;

  if (k1 === k2) {
    inputsArea.innerHTML = `<p style="color:red;">Please select two DIFFERENT known values.</p>`;
    return;
  }

  const fields = {
    height: `
      <label>Height (H)</label>
      <input id="heightVal" type="number" step="any">
      <select id="heightUnit" class="unit">
        <option value="m">m</option>
        <option value="cm">cm</option>
        <option value="dm">dm</option>
        <option value="km">km</option>
        <option value="ft">ft</option>
        <option value="inch">inch</option>
      </select>
    `,
    distance: `
      <label>Horizontal Distance (D)</label>
      <input id="distanceVal" type="number" step="any">
      <select id="distanceUnit" class="unit">
        <option value="m">m</option>
        <option value="cm">cm</option>
        <option value="dm">dm</option>
        <option value="km">km</option>
        <option value="ft">ft</option>
        <option value="inch">inch</option>
      </select>
    `,
    slant: `
      <label>Slant Distance (S)</label>
      <input id="slantVal" type="number" step="any">
      <select id="slantUnit" class="unit">
        <option value="m">m</option>
        <option value="cm">cm</option>
        <option value="dm">dm</option>
        <option value="km">km</option>
        <option value="ft">ft</option>
        <option value="inch">inch</option>
      </select>
    `,
    angle: `
      <label>Angle θ</label>
      <input id="angleVal" type="number" step="any">
      <span class="angleUnit">degrees</span>
    `
  };

  inputsArea.innerHTML = fields[k1] + fields[k2];
}

known1.addEventListener("change", updateInputs);
known2.addEventListener("change", updateInputs);
findValue.addEventListener("change", updateInputs);
updateInputs();

// ===============================
// Main Calculator
// ===============================
calcBtn.addEventListener("click", () => {
  const find = findValue.value;
  const k1 = known1.value;
  const k2 = known2.value;

  if (k1 === k2) {
    alert("Please choose two different known values.");
    return;
  }

  // Get values
  let H = null, D = null, S = null, A = null;

  function getVal(id, unitId) {
    if (!$(id) || $(id).value === "") return null;
    let v = parseFloat($(id).value);
    if (unitId) v = toMeters[$(unitId).value](v);
    return v;
  }

  if ($("#heightVal"))
    H = getVal("#heightVal", "#heightUnit");

  if ($("#distanceVal"))
    D = getVal("#distanceVal", "#distanceUnit");

  if ($("#slantVal"))
    S = getVal("#slantVal", "#slantUnit");

  if ($("#angleVal"))
    A = parseFloat($("#angleVal")?.value || null);

  // Angle validity
  if (A !== null && (A <= 0 || A >= 90)) {
    alert("Angle must be between 0° and 90°.");
    return;
  }

  // Calculate
  let answer = "";
  let unit = "m";
  let steps = "";

  // ===============================================
  // Required Helper: Compute trig values
  // ===============================================
  const rad = (deg) => (deg * Math.PI) / 180;

  // ======================================================
  // CASE 1 — FIND HEIGHT
  // ======================================================
  if (find === "height") {

    // CASE: Known D + Angle
    if (k1 === "distance" && k2 === "angle" || k2 === "distance" && k1 === "angle") {

      if (D === null || A === null) return alert("Enter valid inputs.");

      const tanA = Math.tan(rad(A));
      const Hm = D * tanA;

      answer = `HEIGHT = ${r2(Hm)} m`;

      steps =
`Formula: H = D × tan(θ)
Substitute: H = ${r2(D)} × tan(${A}°)
Angle value: tan(${A}°) = ${r4(tanA)}
Final Calculation: H = ${r2(D)} × ${r4(tanA)} = ${r2(Hm)} m`;

    }

    // CASE: Known S + Angle  → H = S × sin(θ)
    else if ((k1 === "slant" && k2 === "angle") || (k2 === "slant" && k1 === "angle")) {

      if (S === null || A === null) return alert("Enter valid inputs.");

      const sinA = Math.sin(rad(A));
      const Hm = S * sinA;

      answer = `HEIGHT = ${r2(Hm)} m`;

      steps =
`Formula: H = S × sin(θ)
Substitute: H = ${r2(S)} × sin(${A}°)
Angle value: sin(${A}°) = ${r4(sinA)}
Final Calculation: H = ${r2(S)} × ${r4(sinA)} = ${r2(Hm)} m`;

    }

    // CASE: Known S + D → H = √(S² – D²)
    else if ((k1 === "slant" && k2 === "distance") || (k2 === "slant" && k1 === "distance")) {

      if (S === null || D === null) return alert("Enter valid inputs.");

      const Hm = Math.sqrt(S*S - D*D);

      answer = `HEIGHT = ${r2(Hm)} m`;

      steps =
`Formula: H = √(S² − D²)
Substitute: H = √(${r2(S)}² − ${r2(D)}²)
Final Calculation: H = √(${r2(S*S)} − ${r2(D*D)}) = ${r2(Hm)} m`;

    }
  }

  // ======================================================
  // CASE 2 — FIND DISTANCE
  // ======================================================
  if (find === "distance") {

    // CASE: H + Angle → D = H / tan(θ)
    if ((k1 === "height" && k2 === "angle") || (k2 === "height" && k1 === "angle")) {

      if (H === null || A === null) return alert("Enter valid inputs.");

      const tanA = Math.tan(rad(A));
      const Dm = H / tanA;

      answer = `DISTANCE = ${r2(Dm)} m`;

      steps =
`Formula: D = H ÷ tan(θ)
Substitute: D = ${r2(H)} ÷ tan(${A}°)
Angle value: tan(${A}°) = ${r4(tanA)}
Final Calculation: D = ${r2(H)} ÷ ${r4(tanA)} = ${r2(Dm)} m`;

    }

    // CASE: S + Angle → D = S × cos(θ)
    else if ((k1 === "slant" && k2 === "angle") || (k2 === "slant" && k1 === "angle")) {

      if (S === null || A === null) return alert("Enter valid inputs.");

      const cosA = Math.cos(rad(A));
      const Dm = S * cosA;

      answer = `DISTANCE = ${r2(Dm)} m`;

      steps =
`Formula: D = S × cos(θ)
Substitute: D = ${r2(S)} × cos(${A}°)
Angle value: cos(${A}°) = ${r4(cosA)}
Final Calculation: D = ${r2(S)} × ${r4(cosA)} = ${r2(Dm)} m`;

    }

    // CASE: S + H → D = √(S² − H²)
    else if ((k1 === "slant" && k2 === "height") || (k2 === "slant" && k1 === "height")) {

      if (S === null || H === null) return alert("Enter valid inputs.");

      const Dm = Math.sqrt(S*S - H*H);

      answer = `DISTANCE = ${r2(Dm)} m`;

      steps =
`Formula: D = √(S² − H²)
Substitute: D = √(${r2(S)}² − ${r2(H)}²)
Final Calculation: D = √(${r2(S*S)} − ${r2(H*H)}) = ${r2(Dm)} m`;

    }
  }

  // ======================================================
  // CASE 3 — FIND SLANT DISTANCE
  // ======================================================
  if (find === "slant") {

    // CASE: H + D → S = √(H² + D²)
    if ((k1 === "height" && k2 === "distance") || (k2 === "height" && k1 === "distance")) {

      if (H === null || D === null) return alert("Enter valid inputs.");

      const Sm = Math.sqrt(H*H + D*D);

      answer = `SLANT DISTANCE = ${r2(Sm)} m`;

      steps =
`Formula: S = √(H² + D²)
Substitute: S = √(${r2(H)}² + ${r2(D)}²)
Final Calculation: S = √(${r2(H*H)} + ${r2(D*D)}) = ${r2(Sm)} m`;

    }

    // CASE: H + Angle → S = H ÷ sin(θ)
    else if ((k1 === "height" && k2 === "angle") || (k2 === "height" && k1 === "angle")) {

      if (H === null || A === null) return alert("Enter valid inputs.");

      const sinA = Math.sin(rad(A));
      const Sm = H / sinA;

      answer = `SLANT DISTANCE = ${r2(Sm)} m`;

      steps =
`Formula: S = H ÷ sin(θ)
Substitute: S = ${r2(H)} ÷ sin(${A}°)
Angle value: sin(${A}°) = ${r4(sinA)}
Final Calculation: S = ${r2(H)} ÷ ${r4(sinA)} = ${r2(Sm)} m`;

    }

    // CASE: D + Angle → S = D ÷ cos(θ)
    else if ((k1 === "distance" && k2 === "angle") || (k2 === "distance" && k1 === "angle")) {

      if (D === null || A === null) return alert("Enter valid inputs.");

      const cosA = Math.cos(rad(A));
      const Sm = D / cosA;

      answer = `SLANT DISTANCE = ${r2(Sm)} m`;

      steps =
`Formula: S = D ÷ cos(θ)
Substitute: S = ${r2(D)} ÷ cos(${A}°)
Angle value: cos(${A}°) = ${r4(cosA)}
Final Calculation: S = ${r2(D)} ÷ ${r4(cosA)} = ${r2(Sm)} m`;

    }
  }

  // ======================================================
  // CASE 4 — FIND ANGLE θ
  // ======================================================
  if (find === "angle") {

    // CASE: H + D → θ = arctan(H / D)
    if ((k1 === "height" && k2 === "distance") || (k2 === "height" && k1 === "distance")) {

      if (H === null || D === null) return alert("Enter valid inputs.");

      const ratio = H / D;
      const Adeg = radToDeg(Math.atan(ratio));

      answer = `ANGLE θ = ${r2(Adeg)}°`;

      steps =
`Formula: θ = arctan(H ÷ D)
Substitute: θ = arctan(${r2(H)} ÷ ${r2(D)})
Angle value: H ÷ D = ${r4(ratio)}
Final Calculation: θ = arctan(${r4(ratio)}) = ${r2(Adeg)}°`;

    }

    // CASE: H + S → θ = arcsin(H / S)
    else if ((k1 === "height" && k2 === "slant") || (k2 === "height" && k1 === "slant")) {

      if (H === null || S === null) return alert("Enter valid inputs.");

      const ratio = H / S;
      const Adeg = radToDeg(Math.asin(ratio));

      answer = `ANGLE θ = ${r2(Adeg)}°`;

      steps =
`Formula: θ = arcsin(H ÷ S)
Substitute: θ = arcsin(${r2(H)} ÷ ${r2(S)})
Angle value: H ÷ S = ${r4(ratio)}
Final Calculation: θ = arcsin(${r4(ratio)}) = ${r2(Adeg)}°`;

    }

    // CASE: D + S → θ = arccos(D / S)
    else if ((k1 === "distance" && k2 === "slant") || (k2 === "distance" && k1 === "slant")) {

      if (D === null || S === null) return alert("Enter valid inputs.");

      const ratio = D / S;
      const Adeg = radToDeg(Math.acos(ratio));

      answer = `ANGLE θ = ${r2(Adeg)}°`;

      steps =
`Formula: θ = arccos(D ÷ S)
Substitute: θ = arccos(${r2(D)} ÷ ${r2(S)})
Angle value: D ÷ S = ${r4(ratio)}
Final Calculation: θ = arccos(${r4(ratio)}) = ${r2(Adeg)}°`;

    }
  }

  // Show Results
  resultDiv.textContent = answer;

  stepsDiv.innerHTML = steps;
  stepsDiv.classList.add("hidden");

  resultCard.style.display = "block";

  // Add Show Steps button
  if (!$("#showStepsBtn")) {
    const btn = document.createElement("button");
    btn.id = "showStepsBtn";
    btn.textContent = "Show Steps";
    btn.style.marginTop = "10px";
    btn.onclick = toggleSteps;
    resultCard.insertBefore(btn, stepsDiv);
  }
});

clearBtn.addEventListener("click", () => {
  inputsArea.querySelectorAll("input").forEach(i => i.value = "");
  resultCard.style.display = "none";
});

function radToDeg(r) {
  return (r * 180) / Math.PI;
}
