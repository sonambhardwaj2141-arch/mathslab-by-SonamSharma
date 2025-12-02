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

/* ⭐ Create dynamic input fields */
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

  [k1, k2].forEach(val => {
    let html = `<div class="row"><label>${labels[val]}</label>`;

    if (val === "angle") {
      html += `<input id="input_${val}" type="number" placeholder="Enter ${labels[val]}" step="any">`;
    } else {
      html += `
        <input id="input_${val}" type="number" step="any" placeholder="Enter ${labels[val]}">
        <select id="unit_${val}" class="unit">
          <option value="m">m</option>
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
    const input = document.getElementById("input_" + v);
    if (!input) return null;
    const value = parseFloat(input.value);
    if (isNaN(value)) return null;

    if (v === "angle") return value;

    const unit = document.getElementById("unit_" + v).value;
    return toMeters[unit](value);
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

  /* ⭐ FIND SLANT DISTANCE */
  if (find === "slant") {
    if (H != null && D != null) {
      result = Math.sqrt(H*H + D*D);
      steps = `S = √(H² + D²)`;
    }
  }

  /* ⭐ FIND ANGLE */
  if (find === "angle") {
    if (H != null && D != null) {
      result = radToDeg(Math.atan(H/D));
      steps = `θ = arctan(H / D)`;
    }
  }

  if (result == null) {
    alert("Invalid or insufficient input values.");
    return;
  }

  /* ⭐ Output in the SAME UNIT as the value being solved */
  let outputUnit = "m";
  if (find !== "angle") {
    outputUnit = document.querySelector(`#unit_${find}`)?.value || "m";
    result = fromMeters[outputUnit](result);
  }

  resultCard.style.display = "block";
  result.textContent = `${find.toUpperCase()} = ${result.toFixed(2)} ${find === "angle" ? "°" : outputUnit}`;
  stepsDiv.textContent = steps;
});

/* ⭐ CLEAR */
clear.addEventListener("click", () => {
  resultCard.style.display = "none";
});
