// ===============================
// Short helper
// ===============================
const $ = (q) => document.querySelector(q);

// ===============================
// HOME ↔ TOOL PAGE TOGGLE
// ===============================
const startBtn = $("#startBtn");
const tool = $("#tool");
const gallery = $(".gallery");
const hero = $(".hero");

startBtn.addEventListener("click", () => {
  const hidden = tool.classList.contains("hidden");

  if (hidden) {
    tool.classList.remove("hidden");
    gallery.style.display = "none";
    hero.style.display = "none";
    startBtn.textContent = "Home";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    tool.classList.add("hidden");
    gallery.style.display = "grid";
    hero.style.display = "block";
    startBtn.textContent = "Start TrignoTool";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// ===============================
// ELEMENTS
// ===============================
const findValue = $("#findValue");
const known1 = $("#known1");
const known2 = $("#known2");
const inputsArea = $("#inputsArea");
const calcBtn = $("#calc");
const clearBtn = $("#clear");
const resultCard = $("#result-card");
const resultDiv = $("#result");
const stepsDiv = $("#steps");

// Rounding
const r2 = x => Number(x).toFixed(2);
const r4 = x => Number(x).toFixed(4);

// Units
const toMeters = {
  m: v => v,
  cm: v => v / 100,
  dm: v => v / 10,
  km: v => v * 1000,
  ft: v => v * 0.3048,
  inch: v => v * 0.0254
};

// ===============================
// TRIG HELPER
// ===============================
const rad = deg => (deg * Math.PI) / 180;

// ===============================
// INPUT FIELDS BUILDER
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
      <input id="heightVal" type="number">
      <select id="heightUnit" class="unit">
        <option value="m">m</option><option value="cm">cm</option>
        <option value="dm">dm</option><option value="km">km</option>
        <option value="ft">ft</option><option value="inch">inch</option>
      </select>
    `,
    distance: `
      <label>Horizontal Distance (D)</label>
      <input id="distanceVal" type="number">
      <select id="distanceUnit" class="unit">
        <option value="m">m</option><option value="cm">cm</option>
        <option value="dm">dm</option><option value="km">km</option>
        <option value="ft">ft</option><option value="inch">inch</option>
      </select>
    `,
    slant: `
      <label>Slant Distance (S)</label>
      <input id="slantVal" type="number">
      <select id="slantUnit" class="unit">
        <option value="m">m</option><option value="cm">cm</option>
        <option value="dm">dm</option><option value="km">km</option>
        <option value="ft">ft</option><option value="inch">inch</option>
      </select>
    `,
    angle: `
      <label>Angle θ</label>
      <input id="angleVal" type="number">
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
// MAIN CALCULATOR
// ===============================
calcBtn.addEventListener("click", () => {

  const find = findValue.value;
  const k1 = known1.value;
  const k2 = known2.value;

  if (k1 === k2) return alert("Select two different known values.");

  // Get values
  function getVal(id, unitId) {
    if (!$(id) || $(id).value === "") return null;
    let v = parseFloat($(id).value);
    if (unitId) v = toMeters[$(unitId).value](v);
    return v;
  }

  let H = $("#heightVal") ? getVal("#heightVal", "#heightUnit") : null;
  let D = $("#distanceVal") ? getVal("#distanceVal", "#distanceUnit") : null;
  let S = $("#slantVal") ? getVal("#slantVal", "#slantUnit") : null;
  let A = $("#angleVal") ? parseFloat($("#angleVal").value) : null;

  // Validate angle
  if (A !== null && (A <= 0 || A >= 90)) {
    return alert("Angle must be between 0° and 90°.");
  }

  let result = "";
  let steps = "";

  // ===============================
  // FIND HEIGHT
  // ===============================
  if (find === "height") {

    // D + Angle
    if ((k1 === "distance" && k2 === "angle") || (k2 === "distance" && k1 === "angle")) {
      const tanA = Math.tan(rad(A));
      const Hm = D * tanA;

      result = `HEIGHT = ${r2(Hm)} m`;

      steps =
`Formula: H = D × tan(θ)
Substitute: H = ${r2(D)} × tan(${A}°)
Angle value: tan(${A}°) = ${r4(tanA)}
Final Calculation: H = ${r2(D)} × ${r4(tanA)} = ${r2(Hm)} m`;
    }

    // S + Angle
    else if ((k1 === "slant" && k2 === "angle") || (k2 === "slant" && k1 === "angle")) {
      const sinA = Math.sin(rad(A));
      const Hm = S * sinA;

      result = `HEIGHT = ${r2(Hm)} m`;

      steps =
`Formula: H = S × sin(θ)
Substitute: H = ${r2(S)} × sin(${A}°)
Angle value: sin(${A}°) = ${r4(sinA)}
Final Calculation: H = ${r2(S)} × ${r4(sinA)} = ${r2(Hm)} m`;
    }

    // S + D
    else {
      const Hm = Math.sqrt(S*S - D*D);

      result = `HEIGHT = ${r2(Hm)} m`;

      steps =
`Formula: H = √(S² − D²)
Substitute: H = √(${r2(S)}² − ${r2(D)}²)
Final Calculation: H = √(${r2(S*S)} − ${r2(D*D)}) = ${r2(Hm)} m`;
    }
  }

  // ===============================
  // FIND DISTANCE
  // ===============================
  if (find === "distance") {

    // H + Angle
    if ((k1 === "height" && k2 === "angle") || (k2 === "height" && k1 === "angle")) {
      const tanA = Math.tan(rad(A));
      const Dm = H / tanA;

      result = `DISTANCE = ${r2(Dm)} m`;

      steps =
`Formula: D = H ÷ tan(θ)
Substitute: D = ${r2(H)} ÷ tan(${A}°)
Angle value: tan(${A}°) = ${r4(tanA)}
Final Calculation: D = ${r2(H)} ÷ ${r4(tanA)} = ${r2(Dm)} m`;
    }

    // S + Angle
    else if ((k1 === "slant" && k2 === "angle") || (k2 === "slant" && k1 === "angle")) {
      const cosA = Math.cos(rad(A));
      const Dm = S * cosA;

      result = `DISTANCE = ${r2(Dm)} m`;

      steps =
`Formula: D = S × cos(θ)
Substitute: D = ${r2(S)} × cos(${A}°)
Angle value: cos(${A}°) = ${r4(cosA)}
Final Calculation: D = ${r2(S)} × ${r4(cosA)} = ${r2(Dm)} m`;
    }

    // S + H
    else {
      const Dm = Math.sqrt(S*S - H*H);

      result = `DISTANCE = ${r2(Dm)} m`;

      steps =
`Formula: D = √(S² − H²)
Substitute: D = √(${r2(S)}² − ${r2(H)}²)
Final Calculation: D = √(${r2(S*S)} − ${r2(H*H)}) = ${r2(Dm)} m`;
    }
  }

  // ===============================
  // FIND SLANT DISTANCE
  // ===============================
  if (find === "slant") {

    // H + D
    if ((k1 === "height" && k2 === "distance") || (k2 === "height" && k1 === "distance")) {
      const Sm = Math.sqrt(H*H + D*D);

      result = `SLANT DISTANCE = ${r2(Sm)} m`;

      steps =
`Formula: S = √(H² + D²)
Substitute: S = √(${r2(H)}² + ${r2(D)}²)
Final Calculation: S = √(${r2(H*H)} + ${r2(D*D)}) = ${r2(Sm)} m`;
    }

    // H + Angle
    else if ((k1 === "height" && k2 === "angle") || (k2 === "height" && k1 === "angle")) {
      const sinA = Math.sin(rad(A));
      const Sm = H / sinA;

      result = `SLANT DISTANCE = ${r2(Sm)} m`;

      steps =
`Formula: S = H ÷ sin(θ)
Substitute: S = ${r2(H)} ÷ sin(${A}°)
Angle value: sin(${A}°) = ${r4(sinA)}
Final Calculation: S = ${r2(H)} ÷ ${r4(sinA)} = ${r2(Sm)} m`;
    }

    // D + Angle
    else {
      const cosA = Math.cos(rad(A));
      const Sm = D / cosA;

      result = `SLANT DISTANCE = ${r2(Sm)} m`;

      steps =
`Formula: S = D ÷ cos(θ)
Substitute: S = ${r2(D)} ÷ cos(${A}°)
Angle value: cos(${A}°) = ${r4(cosA)}
Final Calculation: S = ${r2(D)} ÷ ${r4(cosA)} = ${r2(Sm)} m`;
    }
  }

  // ===============================
  // FIND ANGLE
  // ===============================
  if (find === "angle") {

    // H + D
    if ((k1 === "height" && k2 === "distance") || (k2 === "height" && k1 === "distance")) {
      const ratio = H / D;
      const Adeg = radToDeg(Math.atan(ratio));

      result = `ANGLE θ = ${r2(Adeg)}°`;

      steps =
`Formula: θ = arctan(H ÷ D)
Substitute: θ = arctan(${r2(H)} ÷ ${r2(D)})
Angle value: H ÷ D = ${r4(ratio)}
Final Calculation: θ = arctan(${r4(ratio)}) = ${r2(Adeg)}°`;
    }

    // H + S
    else if ((k1 === "height" && k2 === "slant") || (k2 === "height" && k1 === "slant")) {
      const ratio = H / S;
      const Adeg = radToDeg(Math.asin(ratio));

      result = `ANGLE θ = ${r2(Adeg)}°`;

      steps =
`Formula: θ = arcsin(H ÷ S)
Substitute: θ = arcsin(${r2(H)} ÷ ${r2(S)})
Angle value: H ÷ S = ${r4(ratio)}
Final Calculation: θ = arcsin(${r4(ratio)}) = ${r2(Adeg)}°`;
    }

    // D + S
    else {
      const ratio = D / S;
      const Adeg = radToDeg(Math.acos(ratio));

      result = `ANGLE θ = ${r2(Adeg)}°`;

      steps =
`Formula: θ = arccos(D ÷ S)
Substitute: θ = arccos(${r2(D)} ÷ ${r2(S)})
Angle value: D ÷ S = ${r4(ratio)}
Final Calculation: θ = arccos(${r4(ratio)}) = ${r2(Adeg)}°`;
    }
  }

  // ===============================
  // SHOW RESULTS
  // ===============================
  resultDiv.textContent = result;
  stepsDiv.textContent = steps;

  stepsDiv.classList.add("hidden");
  resultCard.style.display = "block";

  if (!$("#showStepsBtn")) {
    const btn = document.createElement("button");
    btn.id = "showStepsBtn";
    btn.textContent = "Show Steps";
    btn.onclick = () => {
      stepsDiv.classList.toggle("hidden");
      btn.textContent = stepsDiv.classList.contains("hidden")
        ? "Show Steps"
        : "Hide Steps";
    };
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
