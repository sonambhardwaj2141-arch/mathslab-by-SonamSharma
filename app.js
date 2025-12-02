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

/* ⭐ GET ELEMENTS */
const findValue   = document.getElementById("findValue");
const known1      = document.getElementById("known1");
const known2      = document.getElementById("known2");
const inputsArea  = document.getElementById("inputsArea");
const calc        = document.getElementById("calc");
const clearBtn    = document.getElementById("clear");
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

/* ⭐ CREATE INPUT FIELDS BASED ON SELECTION */
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
    angle:    "Angle (θ)"
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
function round2(x) { return Number(x.toFixed(2)); }

/* ⭐ CALCULATE BUTTON */
calc.addEventListener("click", () => {
  const find = findValue.value;

  /* READ INPUTS */
  function get(v) {
    const input = document.getElementById("input_" + v);
    if (!input) return null;

    const val = parseFloat(input.value);
    if (isNaN(val)) return null;

    if (v === "angle") return val;

    const unit = document.getElementById("unit_" + v).value;
    return toMeters[unit](val);
  }

  const H = get("height");
  const D = get("distance");
  const S = get("slant");
  const A = get("angle");

  let resultValue = null;
  let steps = "Step 1: Identify Given Values\n";

  /* BUILD GIVEN VALUES FOR STEPS */
  if (H != null) steps += `  Height (H) = ${round2(H)} m\n`;
  if (D != null) steps += `  Horizontal Distance (D) = ${round2(D)} m\n`;
  if (S != null) steps += `  Slant Distance (S) = ${round2(S)} m\n`;
  if (A != null) steps += `  Angle (θ) = ${round2(A)}°\n`;

  steps += `\nStep 2: Use the trigonometric relation\n`;

  /* ⭐ FORMULA SELECTION & CALCULATION */
  if (find === "height") {
    if (D != null && A != null) {
      steps += `  tan(θ) = H / D\n`;
      steps += `\nStep 3: Substitute Values\n`;
      steps += `  H = D × tan(θ)\n`;
      steps += `  H = ${round2(D)} × tan(${round2(A)}°)\n`;

      const trig = round2(Math.tan(degToRad(A)));
      steps += `\nStep 4: Calculate tan(${round2(A)}°)\n`;
      steps += `  tan(${round2(A)}°) = ${trig}\n`;

      resultValue = D * Math.tan(degToRad(A));
      steps += `\nStep 5: Final Calculation\n`;
      steps += `  H = ${round2(D)} × ${trig} = ${round2(resultValue)} m\n`;
    }

    else if (S != null && A != null) {
      steps += `  sin(θ) = H / S\n`;
      steps += `\nStep 3: Substitute Values\n`;
      steps += `  H = S × sin(θ)\n`;
      steps += `  H = ${round2(S)} × sin(${round2(A)}°)\n`;

      const trig = round2(Math.sin(degToRad(A)));
      steps += `\nStep 4: Calculate sin(${round2(A)}°)\n`;
      steps += `  sin(${round2(A)}°) = ${trig}\n`;

      resultValue = S * Math.sin(degToRad(A));
      steps += `\nStep 5: Final Calculation\n`;
      steps += `  H = ${round2(S)} × ${trig} = ${round2(resultValue)} m\n`;
    }

    else if (S != null && D != null) {
      steps += `  S² = H² + D² → H = √(S² − D²)\n`;
      resultValue = Math.sqrt(S*S - D*D);

      steps += `\nStep 3: Substitute Values\n`;
      steps += `  H = √(${round2(S)}² − ${round2(D)}²)\n`;

      steps += `\nStep 4: Final Calculation\n`;
      steps += `  H = ${round2(resultValue)} m\n`;
    }
  }

  /* ⭐ FIND DISTANCE */
  else if (find === "distance") {
    if (H != null && A != null) {
      steps += `  tan(θ) = H / D → D = H / tan(θ)\n`;
      const trig = round2(Math.tan(degToRad(A)));

      resultValue = H / Math.tan(degToRad(A));

      steps += `\nStep 3: Substitute Values\n`;
      steps += `  D = ${round2(H)} / tan(${round2(A)}°)\n`;

      steps += `\nStep 4: Calculate tan(${round2(A)}°)\n`;
      steps += `  tan(${round2(A)}°) = ${trig}\n`;

      steps += `\nStep 5: Final Calculation\n`;
      steps += `  D = ${round2(resultValue)} m\n`;
    }

    else if (S != null && A != null) {
      steps += `  cos(θ) = D / S → D = S × cos(θ)\n`;

      const trig = round2(Math.cos(degToRad(A)));
      resultValue = S * trig;

      steps += `\nStep 3: Substitute Values\n`;
      steps += `  D = ${round2(S)} × cos(${round2(A)}°)\n`;

      steps += `\nStep 4: Calculate cos(${round2(A)}°)\n`;
      steps += `  cos(${round2(A)}°) = ${trig}\n`;

      steps += `\nStep 5: Final Calculation\n`;
      steps += `  D = ${round2(resultValue)} m\n`;
    }

    else if (S != null && H != null) {
      steps += `  S² = H² + D² → D = √(S² − H²)\n`;

      resultValue = Math.sqrt(S*S - H*H);

      steps += `\nStep 3: Substitute Values\n`;
      steps += `  D = √(${round2(S)}² − ${round2(H)}²)\n`;

      steps += `\nStep 4: Final Calculation\n`;
      steps += `  D = ${round2(resultValue)} m\n`;
    }
  }

  /* ⭐ FIND SLANT */
  else if (find === "slant") {
    if (H != null && D != null) {
      steps += `  S = √(H² + D²)\n`;

      resultValue = Math.sqrt(H*H + D*D);

      steps += `\nStep 3: Substitute Values\n`;
      steps += `  S = √(${round2(H)}² + ${round2(D)}²)\n`;

      steps += `\nStep 4: Final Calculation\n`;
      steps += `  S = ${round2(resultValue)} m\n`;
    }

    else if (H != null && A != null) {
      steps += `  sin(θ) = H / S → S = H / sin(θ)\n`;

      const trig = round2(Math.sin(degToRad(A)));
      resultValue = H / Math.sin(degToRad(A));

      steps += `\nStep 3: Substitute Values\n`;
      steps += `  S = ${round2(H)} / sin(${round2(A)}°)\n`;

      steps += `\nStep 4: Calculate sin(${round2(A)}°)\n`;
      steps += `  sin(${round2(A)}°) = ${trig}\n`;

      steps += `\nStep 5: Final Calculation\n`;
      steps += `  S = ${round2(resultValue)} m\n`;
    }

    else if (D != null && A != null) {
      steps += `  cos(θ) = D / S → S = D / cos(θ)\n`;

      const trig = round2(Math.cos(degToRad(A)));
      resultValue = D / Math.cos(degToRad(A));

      steps += `\nStep 3: Substitute Values\n`;
      steps += `  S = ${round2(D)} / cos(${round2(A)}°)\n`;

      steps += `\nStep 4: Calculate cos(${round2(A)}°)\n`;
      steps += `  cos(${round2(A)}°) = ${trig}\n`;

      steps += `\nStep 5: Final Calculation\n`;
      steps += `  S = ${round2(resultValue)} m\n`;
    }
  }

  /* ⭐ FIND ANGLE */
  else if (find === "angle") {
    if (H != null && D != null) {
      steps += `  tan(θ) = H / D → θ = arctan(H / D)\n`;

      resultValue = Math.atan(H / D);
      resultValue = radToDeg(resultValue);

      steps += `\nStep 3: Substitute Values\n`;
      steps += `  θ = arctan(${round2(H)} / ${round2(D)})\n`;

      steps += `\nStep 4: Final Calculation\n`;
      steps += `  θ = ${round2(resultValue)}°\n`;
    }

    else if (H != null && S != null) {
      steps += `  sin(θ) = H / S → θ = arcsin(H / S)\n`;

      resultValue = radToDeg(Math.asin(H / S));

      steps += `\nStep 3: Substitute Values\n`;
      steps += `  θ = arcsin(${round2(H)} / ${round2(S)})\n`;

      steps += `\nStep 4: Final Calculation\n`;
      steps += `  θ = ${round2(resultValue)}°\n`;
    }

    else if (D != null && S != null) {
      steps += `  cos(θ) = D / S → θ = arccos(D / S)\n`;

      resultValue = radToDeg(Math.acos(D / S));

      steps += `\nStep 3: Substitute Values\n`;
      steps += `  θ = arccos(${round2(D)} / ${round2(S)})\n`;

      steps += `\nStep 4: Final Calculation\n`;
      steps += `  θ = ${round2(resultValue)}°\n`;
    }
  }

  if (resultValue == null) {
    alert("Invalid or insufficient input values.");
    return;
  }

  /* ⭐ SHOW FINAL ANSWER FIRST */
  resultCard.style.display = "block";
  result.textContent =
    `${find.toUpperCase()} = ${round2(resultValue)} ${find === "angle" ? "°" : "m"}`;

  /* ⭐ LOAD STEPS */
  stepsDiv.textContent = steps;

  /* ⭐ HIDE STEPS INITIALLY */
  stepsDiv.classList.add("hidden");
  toggleStepsBtn.textContent = "Show Steps";
});

/* ⭐ SHOW/HIDE STEPS BUTTON */
toggleStepsBtn.addEventListener("click", () => {
  stepsDiv.classList.toggle("hidden");
  toggleStepsBtn.textContent =
    stepsDiv.classList.contains("hidden") ? "Show Steps" : "Hide Steps";
});

/* ⭐ CLEAR BUTTON */
clearBtn.addEventListener("click", () => {
  resultCard.style.display = "none";
});
