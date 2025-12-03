// SHORTHAND SELECTOR
function $(id) { return document.querySelector(id); }

// DARK MODE TOGGLE
$("#darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// PAGE TOGGLE
const startBtn = $("#startBtn");
const tool = $("#tool");
const gallery = $(".gallery");
const hero = $(".hero");

startBtn.addEventListener("click", () => {
  if (tool.classList.contains("hidden")) {
    tool.classList.remove("hidden");
    gallery.style.display = "none";
    hero.style.display = "none";
    startBtn.textContent = "Home";
  } else {
    tool.classList.add("hidden");
    gallery.style.display = "grid";
    hero.style.display = "block";
    startBtn.textContent = "Start TrignoTool";
  }
});

// -------------------------
// FIELD TEMPLATES
// -------------------------
const fields = {
  height: `
    <div class="rowBlock">
      <label>Height (H)</label>
      <input id="heightVal" type="number">
      <select id="heightUnit">
        <option value="m">m</option><option value="cm">cm</option>
        <option value="dm">dm</option><option value="km">km</option>
        <option value="ft">ft</option><option value="inch">inch</option>
      </select>
    </div>
  `,
  distance: `
    <div class="rowBlock">
      <label>Horizontal Distance (D)</label>
      <input id="distanceVal" type="number">
      <select id="distanceUnit">
        <option value="m">m</option><option value="cm">cm</option>
        <option value="dm">dm</option><option value="km">km</option>
        <option value="ft">ft</option><option value="inch">inch</option>
      </select>
    </div>
  `,
  slant: `
    <div class="rowBlock">
      <label>Slant Distance (S)</label>
      <input id="slantVal" type="number">
      <select id="slantUnit">
        <option value="m">m</option><option value="cm">cm</option>
        <option value="dm">dm</option><option value="km">km</option>
        <option value="ft">ft</option><option value="inch">inch</option>
      </select>
    </div>
  `,
  angle: `
    <div class="rowBlock">
      <label>Angle θ</label>
      <input id="angleVal" type="number">
      <span class="angleUnit">degrees</span>
    </div>
  `
};

// UPDATE INPUT AREA
function updateInputFields() {
  const a = $("#known1").value;
  const b = $("#known2").value;

  if (a === b) {
    $("#inputsArea").innerHTML =
      `<p style="color:red;">❌ Please select two different known values.</p>`;
    return;
  }

  $("#inputsArea").innerHTML = fields[a] + fields[b];
}

$("#known1").addEventListener("change", updateInputFields);
$("#known2").addEventListener("change", updateInputFields);
updateInputFields();

// -------------------------
// CALCULATION
// -------------------------
function calcHeight(D, S, A) {
  if (D != null && A != null) {
    const r = D * Math.tan(A * Math.PI / 180);
    return {
      ans: r,
      steps: `H = D × tan(θ)
H = ${D} × tan(${A})
H = ${r.toFixed(2)}`
    };
  }
  if (S != null && D != null) {
    const r = Math.sqrt(S * S - D * D);
    return {
      ans: r,
      steps: `H = √(S² - D²)
H = √(${S}² - ${D}²)
H = ${r.toFixed(2)}`
    };
  }
}

function updateDiagram(H, D, S) {
  $("#line-base").setAttribute("x2", 20 + (D * 3));
  $("#line-slant").setAttribute("x2", 20 + (D * 3));
  $("#line-slant").setAttribute("y2", 180 - (H * 3));
  $("#line-height").setAttribute("y2", 180 - (H * 3));
}

$("#calc").addEventListener("click", () => {
  const find = $("#findValue").value;

  let H = $("#heightVal") ? Number($("#heightVal").value) : null;
  let D = $("#distanceVal") ? Number($("#distanceVal").value) : null;
  let S = $("#slantVal") ? Number($("#slantVal").value) : null;
  let A = $("#angleVal") ? Number($("#angleVal").value) : null;

  let r;

  if (find === "height") r = calcHeight(D, S, A);

  if (!r) {
    alert("Invalid or missing input!");
    return;
  }

  $("#result").innerHTML =
    `${find.toUpperCase()} = ${r.ans.toFixed(2)} m`;

  $("#steps").textContent = r.steps;
  $("#result-card").style.display = "block";

  updateDiagram(r.ans, D, S);
});

// SHOW/HIDE STEPS
$("#toggleSteps").addEventListener("click", () => {
  $("#steps").classList.toggle("hidden");
});
