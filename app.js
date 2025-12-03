// Helper
const $ = (q) => document.querySelector(q);

/* DARK MODE */
$("#darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

/* PAGE TOGGLE */
const startBtn = $("#startBtn");
const homeBtn = $("#homeBtn");
const tool = $("#tool");
const hero = $(".hero");
const gallery = $(".gallery");

startBtn.addEventListener("click", () => {
  tool.classList.remove("hidden");
  hero.style.display = "none";
  gallery.style.display = "none";
});

homeBtn.addEventListener("click", () => {
  tool.classList.add("hidden");
  hero.style.display = "block";
  gallery.style.display = "grid";
});

/* UNITS */
const toMeters = {
  m: (v) => v,
  cm: (v) => v / 100,
  dm: (v) => v / 10,
  km: (v) => v * 1000,
  ft: (v) => v * 0.3048,
  inch: (v) => v * 0.0254,
};
const degToRad = (d) => (d * Math.PI) / 180;
const radToDeg = (r) => (r * 180) / Math.PI;
const r2 = (x) => Number(x).toFixed(2);
const r4 = (x) => Number(x).toFixed(4);

/* FIELD TEMPLATES */
const fields = {
  height: `
    <div class="rowBlock">
      <label>Height (H)</label>
      <input id="heightVal" type="number" />
      <select id="heightUnit">
        <option value="m">m</option>
        <option value="cm">cm</option>
        <option value="dm">dm</option>
        <option value="km">km</option>
        <option value="ft">ft</option>
        <option value="inch">inch</option>
      </select>
    </div>
  `,
  distance: `
    <div class="rowBlock">
      <label>Horizontal Distance (D)</label>
      <input id="distanceVal" type="number" />
      <select id="distanceUnit">
        <option value="m">m</option>
        <option value="cm">cm</option>
        <option value="dm">dm</option>
        <option value="km">km</option>
        <option value="ft">ft</option>
        <option value="inch">inch</option>
      </select>
    </div>
  `,
  slant: `
    <div class="rowBlock">
      <label>Slant Distance (S)</label>
      <input id="slantVal" type="number" />
      <select id="slantUnit">
        <option value="m">m</option>
        <option value="cm">cm</option>
        <option value="dm">dm</option>
        <option value="km">km</option>
        <option value="ft">ft</option>
        <option value="inch">inch</option>
      </select>
    </div>
  `,
  angle: `
    <div class="rowBlock">
      <label>Angle θ</label>
      <input id="angleVal" type="number" />
      <span>degrees</span>
    </div>
  `,
};

function updateInputs() {
  const k1 = $("#known1").value;
  const k2 = $("#known2").value;

  if (k1 === k2) {
    $("#inputsArea").innerHTML =
      '<p style="color:red;">Please select two different known values.</p>';
    return;
  }

  $("#inputsArea").innerHTML = fields[k1] + fields[k2];
}
$("#known1").addEventListener("change", updateInputs);
$("#known2").addEventListener("change", updateInputs);
updateInputs();

/* DIAGRAM */
function updateDiagram(H, D, S) {
  if (!H || !D || !S) return;

  // scale to fit roughly within 240x120
  const scale = Math.min(240 / D, 120 / H);
  const Hpx = H * scale;
  const Dpx = D * scale;

  $("#baseLine").setAttribute("x1", 40);
  $("#baseLine").setAttribute("y1", 180);
  $("#baseLine").setAttribute("x2", 40 + Dpx);
  $("#baseLine").setAttribute("y2", 180);

  $("#heightLine").setAttribute("x1", 40);
  $("#heightLine").setAttribute("y1", 180);
  $("#heightLine").setAttribute("x2", 40);
  $("#heightLine").setAttribute("y2", 180 - Hpx);

  $("#slantLine").setAttribute("x1", 40);
  $("#slantLine").setAttribute("y1", 180 - Hpx);
  $("#slantLine").setAttribute("x2", 40 + Dpx);
  $("#slantLine").setAttribute("y2", 180);

  $("#labelH").setAttribute("x", 10);
  $("#labelH").setAttribute("y", 180 - Hpx / 2);

  $("#labelD").setAttribute("x", 40 + Dpx / 2);
  $("#labelD").setAttribute("y", 200);

  $("#labelS").setAttribute("x", 40 + Dpx / 2);
  $("#labelS").setAttribute("y", 180 - Hpx / 2);
}

/* MAIN CALC LOGIC */
function calculate(find, known1, known2) {
  // read inputs and convert to meters / degrees
  const Hval = $("#heightVal") ? parseFloat($("#heightVal").value) : null;
  const Dval = $("#distanceVal") ? parseFloat($("#distanceVal").value) : null;
  const Sval = $("#slantVal") ? parseFloat($("#slantVal").value) : null;
  const Aval = $("#angleVal") ? parseFloat($("#angleVal").value) : null;

  const H = Hval ? toMeters[$("#heightUnit").value](Hval) : null;
  const D = Dval ? toMeters[$("#distanceUnit").value](Dval) : null;
  const S = Sval ? toMeters[$("#slantUnit").value](Sval) : null;
  const A = Aval; // degrees

  const has = (v) => v !== null && !isNaN(v);

  let result = null;
  let steps = "";
  let outUnit = find === "angle" ? "°" : "m";
  let Hm = H,
    Dm = D,
    Sm = S,
    Am = A;

  /* FIND HEIGHT */
  if (find === "height") {
    if (has(D) && has(A)) {
      const tanA = Math.tan(degToRad(A));
      Hm = D * tanA;
      Sm = Math.sqrt(Hm * Hm + D * D);
      steps =
        `Formula: H = D × tan(θ)\n` +
        `Substitute: H = ${r2(D)} × tan(${r2(A)}°)\n` +
        `Angle value: tan(${r2(A)}°) = ${r4(tanA)}\n` +
        `Final Calculation: H = ${r2(D)} × ${r4(tanA)} = ${r2(Hm)} m`;
      result = Hm;
    } else if (has(S) && has(A)) {
      const sinA = Math.sin(degToRad(A));
      Hm = S * sinA;
      Dm = Math.sqrt(S * S - Hm * Hm);
      steps =
        `Formula: H = S × sin(θ)\n` +
        `Substitute: H = ${r2(S)} × sin(${r2(A)}°)\n` +
        `Angle value: sin(${r2(A)}°) = ${r4(sinA)}\n` +
        `Final Calculation: H = ${r2(S)} × ${r4(sinA)} = ${r2(Hm)} m`;
      result = Hm;
    } else if (has(S) && has(D)) {
      Hm = Math.sqrt(S * S - D * D);
      steps =
        `Formula: H = √(S² − D²)\n` +
        `Substitute: H = √(${r2(S)}² − ${r2(D)}²)\n` +
        `Final Calculation: H = ${r2(Hm)} m`;
      result = Hm;
    }
  }

  /* FIND DISTANCE */
  else if (find === "distance") {
    if (has(H) && has(A)) {
      const tanA = Math.tan(degToRad(A));
      Dm = H / tanA;
      Sm = Math.sqrt(H * H + Dm * Dm);
      steps =
        `Formula: D = H ÷ tan(θ)\n` +
        `Substitute: D = ${r2(H)} ÷ tan(${r2(A)}°)\n` +
        `Angle value: tan(${r2(A)}°) = ${r4(tanA)}\n` +
        `Final Calculation: D = ${r2(H)} ÷ ${r4(tanA)} = ${r2(Dm)} m`;
      result = Dm;
    } else if (has(S) && has(A)) {
      const cosA = Math.cos(degToRad(A));
      Dm = S * cosA;
      Hm = Math.sqrt(S * S - Dm * Dm);
      steps =
        `Formula: D = S × cos(θ)\n` +
        `Substitute: D = ${r2(S)} × cos(${r2(A)}°)\n` +
        `Angle value: cos(${r2(A)}°) = ${r4(cosA)}\n` +
        `Final Calculation: D = ${r2(S)} × ${r4(cosA)} = ${r2(Dm)} m`;
      result = Dm;
    } else if (has(S) && has(H)) {
      Dm = Math.sqrt(S * S - H * H);
      steps =
        `Formula: D = √(S² − H²)\n` +
        `Substitute: D = √(${r2(S)}² − ${r2(H)}²)\n` +
        `Final Calculation: D = ${r2(Dm)} m`;
      result = Dm;
    }
  }

  /* FIND SLANT */
  else if (find === "slant") {
    if (has(H) && has(D)) {
      Sm = Math.sqrt(H * H + D * D);
      steps =
        `Formula: S = √(H² + D²)\n` +
        `Substitute: S = √(${r2(H)}² + ${r2(D)}²)\n` +
        `Final Calculation: S = ${r2(Sm)} m`;
      result = Sm;
    } else if (has(H) && has(A)) {
      const sinA = Math.sin(degToRad(A));
      Sm = H / sinA;
      Dm = Math.sqrt(Sm * Sm - H * H);
      steps =
        `Formula: S = H ÷ sin(θ)\n` +
        `Substitute: S = ${r2(H)} ÷ sin(${r2(A)}°)\n` +
        `Angle value: sin(${r2(A)}°) = ${r4(sinA)}\n` +
        `Final Calculation: S = ${r2(H)} ÷ ${r4(sinA)} = ${r2(Sm)} m`;
      result = Sm;
    } else if (has(D) && has(A)) {
      const cosA = Math.cos(degToRad(A));
      Sm = D / cosA;
      Hm = Math.sqrt(Sm * Sm - D * D);
      steps =
        `Formula: S = D ÷ cos(θ)\n` +
        `Substitute: S = ${r2(D)} ÷ cos(${r2(A)}°)\n` +
        `Angle value: cos(${r2(A)}°) = ${r4(cosA)}\n` +
        `Final Calculation: S = ${r2(D)} ÷ ${r4(cosA)} = ${r2(Sm)} m`;
      result = Sm;
    }
  }

  /* FIND ANGLE */
  else if (find === "angle") {
    if (has(H) && has(D)) {
      const ratio = H / D;
      Am = radToDeg(Math.atan(ratio));
      Sm = Math.sqrt(H * H + D * D);
      steps =
        `Formula: θ = arctan(H ÷ D)\n` +
        `Substitute: θ = arctan(${r2(H)} ÷ ${r2(D)})\n` +
        `Value: H ÷ D = ${r4(ratio)}\n` +
        `Final Calculation: θ = arctan(${r4(ratio)}) = ${r2(Am)}°`;
      result = Am;
    } else if (has(H) && has(S)) {
      const ratio = H / S;
      Am = radToDeg(Math.asin(ratio));
      Dm = Math.sqrt(S * S - H * H);
      steps =
        `Formula: θ = arcsin(H ÷ S)\n` +
        `Substitute: θ = arcsin(${r2(H)} ÷ ${r2(S)})\n` +
        `Value: H ÷ S = ${r4(ratio)}\n` +
        `Final Calculation: θ = arcsin(${r4(ratio)}) = ${r2(Am)}°`;
      result = Am;
    } else if (has(D) && has(S)) {
      const ratio = D / S;
      Am = radToDeg(Math.acos(ratio));
      Hm = Math.sqrt(S * S - D * D);
      steps =
        `Formula: θ = arccos(D ÷ S)\n` +
        `Substitute: θ = arccos(${r2(D)} ÷ ${r2(S)})\n` +
        `Value: D ÷ S = ${r4(ratio)}\n` +
        `Final Calculation: θ = arccos(${r4(ratio)}) = ${r2(Am)}°`;
      result = Am;
    }
  }

  if (result === null) return null;

  return {
    result,
    steps,
    outUnit,
    H: Hm,
    D: Dm,
    S: Sm,
  };
}

/* CALCULATE BUTTON */
$("#calc").addEventListener("click", () => {
  const find = $("#findValue").value;
  const k1 = $("#known1").value;
  const k2 = $("#known2").value;

  const data = calculate(find, k1, k2);

  if (!data) {
    alert("Invalid or insufficient inputs for this combination.");
    return;
  }

  const label =
    find === "height"
      ? "HEIGHT"
      : find === "distance"
      ? "DISTANCE"
      : find === "slant"
      ? "SLANT DISTANCE"
      : "ANGLE θ";

  const unit = find === "angle" ? "°" : "m";

  $("#result").textContent = `${label} = ${r2(data.result)} ${unit}`;
  $("#steps").textContent = data.steps;
  $("#result-card").style.display = "block";

  // update triangle
  updateDiagram(data.H, data.D, data.S);

  // hide steps by default
  $("#steps").classList.add("hidden");
  $("#toggleSteps").textContent = "Show Steps";
});

/* CLEAR BUTTON */
$("#clear").addEventListener("click", () => {
  $("#inputsArea").querySelectorAll("input").forEach((i) => (i.value = ""));
  $("#result-card").style.display = "none";
});

/* SHOW/HIDE STEPS */
$("#toggleSteps").addEventListener("click", () => {
  $("#steps").classList.toggle("hidden");
  $("#toggleSteps").textContent = $("#steps").classList.contains("hidden")
    ? "Show Steps"
    : "Hide Steps";
});
