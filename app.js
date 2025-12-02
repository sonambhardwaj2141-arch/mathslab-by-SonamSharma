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

/* ⭐ DYNAMIC INPUTS */
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
    slant: "Slant Distance",
    angle: "Angle θ"
  };

  [k1, k2].forEach(v => {
    let html = `<div class="row"><label>${labels[v]}</label>`;

    if (v === "angle") {
      html += `<input id="input_${v}" type="number" placeholder="Enter ${labels[v]}">`;
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

/* ⭐ CALCULATE */
calc.addEventListener("click", () => {
  const find = findValue.value;
  let H = null, D = null, S = null, A = null;

  function get(v) {
    const i = document.getElementById("input_" + v);
    if (!i) return null;
    const val = parseFloat(i.value);
    if (isNaN(val)) return null;

    if (v === "angle") return val;

    const unit = document.getElementById("unit_" + v).value;
    return toMeters[unit](val);
  }

  H = get("height");
  D = get("distance");
  S = get("slant");
  A = get("angle");

  function degToRad(x) { return (x * Math.PI) / 180; }
  function radToDeg(x) { return (x * 180) / Math.PI; }

  let result = null;
  let steps = "";

  /* ⭐ FIND HEIGHT */
  if (find === "height") {
    if (D != null && A != null) {
      result = D * Math.tan(degToRad(A));
      steps = `H = D × tan(θ)`;
    }
    if (S != null && D != null) {
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
    if (S != null && H != null) {
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
  }

  /* ⭐ FIND ANGLE */
  if (find === "angle") {
    if (H != null && D != null) {
      result = radToDeg(Math.atan(H / D));
      steps = `θ = arctan(H / D)`;
    }
  }

  if (result == null) {
    alert("Invalid or insufficient input values.");
    return;
  }

  /* ⭐ Convert output to correct unit */
  let outputUnit = "m";

  if (find !== "angle") {
    const unitSelector = document.getElementById("unit_" + find);
    if (unitSelector) {
      outputUnit = unitSelector.value;
      result = fromMeters[outputUnit](result);
    }
  }

  document.getElementById("result-card").style.display = "block";
  document.getElementById("result").textContent =
    `${find.toUpperCase()} = ${result.toFixed(2)} ${find === "angle" ? "°" : outputUnit}`;
  document.getElementById("steps").textContent = steps;
});

/* ⭐ CLEAR */
clear.addEventListener("click", () => {
  document.getElementById("result-card").style.display = "none";
});
