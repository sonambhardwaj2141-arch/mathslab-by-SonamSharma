/* Helper */
function $(q) { return document.querySelector(q); }

/* -------------------------
   DARK MODE
--------------------------*/
$("#darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

/* -------------------------
   PAGE TOGGLE LOGIC
--------------------------*/
const startBtn = $("#startBtn");
const tool = $("#tool");
const gallery = $(".gallery");
const hero = $(".hero");
const videoSection = $(".video-section");

startBtn.addEventListener("click", () => {
  tool.classList.remove("hidden");
  gallery.style.display = "none";
  hero.style.display = "none";
  videoSection.style.display = "none";

  $("#homeBtn").style.display = "inline-block";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* HOME BUTTON */
$("#homeBtn").addEventListener("click", () => {
  tool.classList.add("hidden");
  gallery.style.display = "grid";
  hero.style.display = "block";
  videoSection.style.display = "block";

  $("#homeBtn").style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* -------------------------
   INPUT FIELD BLOCKS
--------------------------*/
const fields = {
  height: `
    <div class="rowBlock">
      <label>Height (H)</label>
      <input id="heightVal" type="number" />
      <select id="heightUnit">
        <option value="m">m</option>
      </select>
    </div>
  `,
  distance: `
    <div class="rowBlock">
      <label>Horizontal Distance (D)</label>
      <input id="distanceVal" type="number" />
      <select id="distanceUnit">
        <option value="m">m</option>
      </select>
    </div>
  `,
  slant: `
    <div class="rowBlock">
      <label>Slant Distance (S)</label>
      <input id="slantVal" type="number" />
      <select id="slantUnit">
        <option value="m">m</option>
      </select>
    </div>
  `,
  angle: `
    <div class="rowBlock">
      <label>Angle θ</label>
      <input id="angleVal" type="number" />
      <span>degrees</span>
    </div>
  `
};

function updateInputs() {
  let a = $("#known1").value;
  let b = $("#known2").value;

  if (a === b) {
    $("#inputsArea").innerHTML = `<p style="color:red;">Choose two different known values.</p>`;
    return;
  }

  $("#inputsArea").innerHTML = fields[a] + fields[b];
}

$("#known1").addEventListener("change", updateInputs);
$("#known2").addEventListener("change", updateInputs);
updateInputs();

/* -------------------------
   CALCULATION LOGIC
--------------------------*/
function calculate(find, H, D, S, A) {
  /* ============= FIND HEIGHT ============= */
  if (find === "height") {
    // D & A → H = D tanθ
    if (D && A) {
      const h = D * Math.tan(A * Math.PI / 180);
      return {
        ans: h,
        steps: `H = D × tan(θ)
H = ${D} × tan(${A})
H = ${h.toFixed(2)}`
      };
    }

    // S & D → H = √(S² - D²)
    if (S && D) {
      if (S <= D) return null; // invalid
      const h = Math.sqrt(S*S - D*D);
      return {
        ans: h,
        steps: `H = √(S² - D²)
H = √(${S}² - ${D}²)
H = ${h.toFixed(2)}`
      };
    }

    // S & A → H = S sinθ
    if (S && A) {
      const h = S * Math.sin(A * Math.PI / 180);
      return {
        ans: h,
        steps: `H = S × sin(θ)
H = ${S} × sin(${A})
H = ${h.toFixed(2)}`
      };
    }
  }

  /* ============= FIND DISTANCE ============= */
  if (find === "distance") {
    // H & A → D = H / tanθ
    if (H && A) {
      const d = H / Math.tan(A * Math.PI / 180);
      return {
        ans: d,
        steps: `D = H / tan(θ)
D = ${H} / tan(${A})
D = ${d.toFixed(2)}`
      };
    }

    // S & H → D = √(S² - H²)
    if (S && H) {
      if (S <= H) return null;
      const d = Math.sqrt(S*S - H*H);
      return {
        ans: d,
        steps: `D = √(S² - H²)
D = √(${S}² - ${H}²)
D = ${d.toFixed(2)}`
      };
    }

    // S & A → D = S cosθ
    if (S && A) {
      const d = S * Math.cos(A * Math.PI / 180);
      return {
        ans: d,
        steps: `D = S × cos(θ)
D = ${S} × cos(${A})
D = ${d.toFixed(2)}`
      };
    }
  }

  /* ============= FIND SLANT ============= */
  if (find === "slant") {
    // H & D → S = √(H² + D²)
    if (H && D) {
      const s = Math.sqrt(H*H + D*D);
      return {
        ans: s,
        steps: `S = √(H² + D²)
S = √(${H}² + ${D}²)
S = ${s.toFixed(2)}`
      };
    }

    // H & A → S = H / sinθ
    if (H && A) {
      const s = H / Math.sin(A * Math.PI / 180);
      return {
        ans: s,
        steps: `S = H / sin(θ)
S = ${H} / sin(${A})
S = ${s.toFixed(2)}`
      };
    }

    // D & A → S = D / cosθ
    if (D && A) {
      const s = D / Math.cos(A * Math.PI / 180);
      return {
        ans: s,
        steps: `S = D / cos(θ)
S = ${D} / cos(${A})
S = ${s.toFixed(2)}`
      };
    }
  }

  /* ============= FIND ANGLE ============= */
  if (find === "angle") {
    // H & D → θ = arctan(H/D)
    if (H && D) {
      const a = Math.atan(H/D) * 180 / Math.PI;
      return {
        ans: a,
        steps: `θ = arctan(H / D)
θ = arctan(${H}/${D})
θ = ${a.toFixed(2)}°`
      };
    }

    // H & S → θ = arcsin(H/S)
    if (H && S) {
      if (H > S) return null;
      const a = Math.asin(H/S) * 180 / Math.PI;
      return {
        ans: a,
        steps: `θ = arcsin(H / S)
θ = arcsin(${H}/${S})
θ = ${a.toFixed(2)}°`
      };
    }

    // D & S → θ = arccos(D/S)
    if (D && S) {
      if (D > S) return null;
      const a = Math.acos(D/S) * 180 / Math.PI;
      return {
        ans: a,
        steps: `θ = arccos(D / S)
θ = arccos(${D}/${S})
θ = ${a.toFixed(2)}°`
      };
    }
  }

  return null;
}

/* -------------------------
   TRIANGLE DIAGRAM
--------------------------*/
function updateDiagram(H, D, S) {
  if (!H || !D || !S) return;

  let scaleH = 120 / H;
  let scaleD = 240 / D;
  let scale = Math.min(scaleH, scaleD);

  let Hpx = H * scale;
  let Dpx = D * scale;

  // BASE
  $("#baseLine").setAttribute("x2", 40 + Dpx);

  // HEIGHT
  $("#heightLine").setAttribute("y2", 180 - Hpx);

  // SLANT
  $("#slantLine").setAttribute("x2", 40 + Dpx);
  $("#slantLine").setAttribute("y2", 180 - Hpx);

  // LABELS
  $("#labelH").setAttribute("y", 180 - Hpx/2);
  $("#labelD").setAttribute("x", 40 + Dpx/2);
  $("#labelS").setAttribute("x", 40 + Dpx/2);
  $("#labelS").setAttribute("y", 180 - Hpx/2);
}

/* -------------------------
   MAIN CALCULATE BUTTON
--------------------------*/
$("#calc").addEventListener("click", () => {
  let find = $("#findValue").value;

  let H = $("#heightVal") ? Number($("#heightVal").value) : null;
  let D = $("#distanceVal") ? Number($("#distanceVal").value) : null;
  let S = $("#slantVal") ? Number($("#slantVal").value) : null;
  let A = $("#angleVal") ? Number($("#angleVal").value) : null;

  let r = calculate(find, H, D, S, A);

  if (!r) {
    alert("Invalid inputs.");
    return;
  }

  $("#result").innerHTML =
    `${find.toUpperCase()} = ${r.ans.toFixed(2)} ${find === "angle" ? "°" : "m"}`;

  $("#steps").textContent = r.steps;
  $("#result-card").style.display = "block";

  // For angle, diagram not needed
  if (find !== "angle") updateDiagram(
    find === "height" ? r.ans : H,
    find === "distance" ? r.ans : D,
    find === "slant" ? r.ans : S
  );
});

/* -------------------------
   SHOW / HIDE STEPS
--------------------------*/
$("#toggleSteps").addEventListener("click", () => {
  $("#steps").classList.toggle("hidden");

  $("#toggleSteps").textContent =
    $("#steps").classList.contains("hidden")
      ? "Show Steps"
      : "Hide Steps";
});

/* CLEAR BUTTON */
$("#clear").addEventListener("click", () => {
  $("#result-card").style.display = "none";
});
