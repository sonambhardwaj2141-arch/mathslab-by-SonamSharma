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

/* ⭐ UNIT CONVERSION */
const toMeters = {
  m: v => v,
  cm: v => v / 100,
  dm: v => v / 10,
  km: v => v * 1000,
  ft: v => v * 0.3048,
  in: v => v * 0.0254
};

const fromMeters = {
  m: v => v,
  cm: v => v * 100,
  dm: v => v * 10,
  km: v => v / 1000,
  ft: v => v / 0.3048,
  in: v => v / 0.0254
};

/* ⭐ GET ELEMENTS */
const stepsDiv = document.getElementById("steps");
const toggleStepsBtn = document.getElementById("toggleSteps");

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
    height: "Height (H)",
    distance: "Horizontal Distance (D)",
    slant: "Slant Distance (S)",
    angle: "Angle θ"
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

/* ⭐ TRIG FUNCTIONS */
function degToRad(x) { return x * Math.PI / 180; }
function radToDeg(x) { return x * 180 / Math.PI; }

/* ⭐ CALCULATE */
calc.addEventListener("click", () => {
  const find = findValue.value;

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

  let result = null;
  let steps = "";

  /* ⭐ FIND HEIGHT */
  if (find === "height") {
    if (D != null && A != null) {
      result = D * Math.tan(degToRad(A));
      steps = `H = D × tan(θ)\nH = ${D} × tan(${A})`;
    }
    else if (S != null && A != null) {
      result = S * Math.sin(degToRad(A));
      steps = `H = S × sin(θ)`;
    }
    else if (S != null && D != null) {
      result = Math.sqrt(S*S - D*D);
      steps = `H = √(S² - D²)`;
    }
  }

  /* ⭐ FIND DISTANCE */
  if (find === "distance") {
    if (H != null && A != null) {
      result = H / Math.tan(degToRad(A));
      steps = `D = H / tan(θ)`;
    }
    else if (S != null && A != null) {
      result = S * Math.cos(degToRad(A));
      steps = `D = S × cos(θ)`;
    }
    else if (S != null && H != null) {
      result = Math.sqrt(S*S - H*H);
      steps = `D = √(S² - H²)`;
    }
  }

  /* ⭐ FIND SLANT */
  if (find === "slant") {
    if (H != null && D != null) {
      result = Math.sqrt(H*H + D*D);
      steps = `S = √(H² + D²)`;
    }
    else if (H != null && A != null) {
      result = H / Math.sin(degToRad(A));
      steps = `S = H / sin(θ)`;
    }
    else if (D != null && A != null) {
      result = D / Math.cos(degToRad(A));
      steps = `S = D / cos(θ)`;
    }
  }

  /* ⭐ FIND ANGLE */
  if (find === "angle") {
    if (H != null && D != null) {
      result = radToDeg(Math.atan(H / D));
      steps = `θ = arctan(H/D)`;
    }
    else if (H != null && S != null) {
      result = radToDeg(Math.asin(H / S));
      steps = `θ = arcsin(H/S)`;
    }
    else if (D != null && S != null) {
      result = radToDeg(Math.acos(D / S));
      steps = `θ = arccos(D/S)`;
    }
  }

  if (result == null) {
    alert("Invalid or insufficient input values.");
    return;
  }

  /* ⭐ Convert output to correct unit */
  let outputUnit = "m";

  if (find !== "angle") {
    const unitDropdown = document.getElementById("unit_" + find);
    if (unitDropdown) {
      outputUnit = unitDropdown.value;
      result = fromMeters[outputUnit](result);
    }
  }

  resultCard.style.display = "block";
  result.textContent =
    `${find.toUpperCase()} = ${result.toFixed(2)} ${find === "angle" ? "°" : outputUnit}`;

  stepsDiv.textContent = steps;
});

/* ⭐ SHOW/HIDE STEPS BUTTON */
toggleStepsBtn.addEventListener("click", () => {
  stepsDiv.classList.toggle("hidden");
  toggleStepsBtn.textContent =
    stepsDiv.classList.contains("hidden") ? "Show Steps" : "Hide Steps";
});

/* ⭐ CLEAR */
clear.addEventListener("click", () => {
  document.getElementById("result-card").style.display = "none";
});
