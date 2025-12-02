/* ⭐ START → TOOL */
document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("home").style.display = "none";
  document.getElementById("tool").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ⭐ TOOL → HOME */
document.getElementById("homeBtn").addEventListener("click", () => {
  document.getElementById("tool").classList.add("hidden");
  document.getElementById("home").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ⭐ GET MAIN ELEMENTS */
const findValue   = document.getElementById("findValue");
const known1      = document.getElementById("known1");
const known2      = document.getElementById("known2");
const inputsArea  = document.getElementById("inputsArea");
const calc        = document.getElementById("calc");
const clear       = document.getElementById("clear");
const resultCard  = document.getElementById("result-card");
const result      = document.getElementById("result");
const stepsDiv    = document.getElementById("steps");
const toggleStepsBtn = document.getElementById("toggleSteps");

/* ⭐ UNIT CONVERSION */
const toMeters = {
  m:  v => v,
  cm: v => v / 100,
  dm: v => v / 10,
  km: v => v * 1000,
  ft: v => v * 0.3048,
  in: v => v * 0.0254
};

const fromMeters = {
  m:  v => v,
  cm: v => v * 100,
  dm: v => v * 10,
  km: v => v / 1000,
  ft: v => v / 0.3048,
  in: v => v / 0.0254
};

/* ⭐ DYNAMIC INPUT FIELDS */
function updateInputs() {
  const k1 = known1.value;
  const k2 = known2.value;

  inputsArea.innerHTML = "";

  if (k1 === k2) {
    inputsArea.innerHTML = `<p style="color:red">Select two different values.</p>`;
    return;
  }

  const labels = {
    height:   "Height (H)",
    distance: "Horizontal Distance (D)",
    slant:    "Slant Distance (S)",
    angle:    "Angle θ"
  };

  [k1, k2].forEach(v => {
    let html = `<div class="row"><label>${labels[v]}</label>`;

    if (v === "angle") {
      html += `
        <input id="input_${v}" type="number" placeholder="Enter ${labels[v]}">
        <span class="angleUnit">degrees</span>
      `;
    } else {
      html += `
        <input id="input_${v}" type="number" step="any" placeholder="Enter ${labels[v]}">
        <select id="unit_${v}" class="unit">
          <option value="m" selected>m</option>
          <option value="cm">cm</option>
          <option value="dm">dm</option>
          <option value="km">km</option>
          <option value="ft">ft</option>
          <option value="in">in</option>
        </select>
      `;
    }

    html += `</div>`;
    inputsArea.innerHTML += html;
  });
}

known1.addEventListener("change", updateInputs);
known2.addEventListener("change", updateInputs);
updateInputs();

/* ⭐ TRIG HELPERS */
function degToRad(x) { return x * Math.PI / 180; }
function radToDeg(x) { return x * 180 / Math.PI; }

/* ⭐ CALCULATE BUTTON */
calc.addEventListener("click", () => {
  const find = findValue.value;

  function get(v) {
    const input = document.getElementById("input_" + v);
    if (!input) return null;
    const val = parseFloat(input.value);
    if (isNaN(val)) return null;

    if (v === "angle") return val;        // angle stays in degrees

    const unit = document.getElementById("unit_" + v).value;
    return toMeters[unit](val);          // convert all lengths to meters
  }

  const H = get("height");
  const D = get("distance");
  const S = get("slant");
  const A = get("angle");

  let resultValue = null;
  let steps = "";

  /* ⭐ FIND HEIGHT (H) */
  if (find === "height") {
    if (D != null && A != null) {
      resultValue = D * Math.tan(degToRad(A));
      steps = `H = D × tan(θ)\nH = ${D} × tan(${A})`;
    } else if (S != null && A != null) {
      resultValue = S * Math.sin(degToRad(A));
      steps = `H = S × sin(θ)\nH = ${S} × sin(${A})`;
    } else if (S != null && D != null) {
      resultValue = Math.sqrt(S*S - D*D);
      steps = `H = √(S² − D²)`;
    }
  }

  /* ⭐ FIND DISTANCE (D) */
  if (find === "distance") {
    if (H != null && A != null) {
      resultValue = H / Math.tan(degToRad(A));
      steps = `D = H / tan(θ)`;
    } else if (S != null && A != null) {
      resultValue = S * Math.cos(degToRad(A));
      steps = `D = S × cos(θ)`;
    } else if (S != null && H != null) {
      resultValue = Math.sqrt(S*S - H*H);
      steps = `D = √(S² − H²)`;
    }
  }

  /* ⭐ FIND SLANT (S) */
  if (find === "slant") {
    if (H != null && D != null) {
      resultValue = Math.sqrt(H*H + D*D);
      steps = `S = √(H² + D²)`;
    } else if (H != null && A != null) {
      resultValue = H / Math.sin(degToRad(A));
      steps = `S = H / sin(θ)`;
    } else if (D != null && A != null) {
      resultValue = D / Math.cos(degToRad(A));
      steps = `S = D / cos(θ)`;
    }
  }

  /* ⭐ FIND ANGLE (θ) */
  if (find === "angle") {
    if (H != null && D != null) {
      resultValue = radToDeg(Math.atan(H / D));
      steps = `θ = arctan(H / D)`;
    } else if (H != null && S != null) {
      resultValue = radToDeg(Math.asin(H / S));
      steps = `θ = arcsin(H / S)`;
    } else if (D != null && S != null) {
      resultValue = radToDeg(Math.acos(D / S));
      steps = `θ = arccos(D / S)`;
    }
  }

  if (resultValue == null) {
    alert("Invalid or insufficient input values.");
    return;
  }

  /* ⭐ Convert output to user’s chosen unit */
  let outputUnit = "m";

  if (find !== "angle") {
    const unitDropdown = document.getElementById("unit_" + find);
    if (unitDropdown) {
      outputUnit = unitDropdown.value;
      resultValue = fromMeters[outputUnit](resultValue);
    }
  }

  resultCard.style.display = "block";
  result.textContent =
    `${find.toUpperCase()} = ${resultValue.toFixed(2)} ${find === "angle" ? "°" : outputUnit}`;

  stepsDiv.textContent = steps;
  // Hide steps initially every new calculation
  stepsDiv.classList.add("hidden");
  toggleStepsBtn.textContent = "Show Steps";
});

/* ⭐ SHOW/HIDE STEPS */
toggleStepsBtn.addEventListener("click", () => {
  stepsDiv.classList.toggle("hidden");
  toggleStepsBtn.textContent =
    stepsDiv.classList.contains("hidden") ? "Show Steps" : "Hide Steps";
});

/* ⭐ CLEAR BUTTON */
clear.addEventListener("click", () => {
  resultCard.style.display = "none";
});
