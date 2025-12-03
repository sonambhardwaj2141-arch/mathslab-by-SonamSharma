function $(q) { return document.querySelector(q); }

/* DARK MODE */
$("#darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

/* PAGE TOGGLE */
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

/* INPUT FIELD TEMPLATES */
const fields = {
  height: `
    <div class="rowBlock">
      <label>Height (H)</label>
      <input id="heightVal" type="number" />
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
      <input id="distanceVal" type="number" />
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
      <input id="slantVal" type="number" />
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
      <input id="angleVal" type="number" />
      <span style="margin-top:6px;">degrees</span>
    </div>
  `
};

function updateInputs() {
  let a = $("#known1").value;
  let b = $("#known2").value;

  if (a === b) {
    $("#inputsArea").innerHTML =
      `<p style="color:red;">❌ Please choose two different known values.</p>`;
    return;
  }

  $("#inputsArea").innerHTML = fields[a] + fields[b];
}

$("#known1").addEventListener("change", updateInputs);
$("#known2").addEventListener("change", updateInputs);
updateInputs();

/* FORMULAS */
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
    const r = Math.sqrt(S*S - D*D);
    return {
      ans: r,
      steps: `H = √(S² - D²)
H = √(${S}² - ${D}²)
H = ${r.toFixed(2)}`
    };
  }
}

/* TRIANGLE DRAWING */
function updateDiagram(H, D, S) {

  if (!H || !D || !S) return;

  let scaleH = 120 / H;
  let scaleD = 240 / D;
  let scale = Math.min(scaleH, scaleD);

  let Hpx = H * scale;
  let Dpx = D * scale;

  $("#baseLine").setAttribute("x2", 40 + Dpx);
  $("#heightLine").setAttribute("y2", 180 - Hpx);
  $("#slantLine").setAttribute("x2", 40 + Dpx);
  $("#slantLine").setAttribute("y2", 180 - Hpx);

  $("#labelH").setAttribute("y", 180 - Hpx/2);
  $("#labelD").setAttribute("x", 40 + Dpx/2);
  $("#labelS").setAttribute("x", 40 + Dpx/2);
  $("#labelS").setAttribute("y", 180 - Hpx/2);
}

/* CALCULATE BUTTON */
$("#calc").addEventListener("click", () => {

  let find = $("#findValue").value;

  let H = $("#heightVal") ? Number($("#heightVal").value) : null;
  let D = $("#distanceVal") ? Number($("#distanceVal").value) : null;
  let S = $("#slantVal") ? Number($("#slantVal").value) : null;
  let A = $("#angleVal") ? Number($("#angleVal").value) : null;

  let result;

  if (find === "height") result = calcHeight(D, S, A);

  if (!result) {
    alert("Invalid inputs.");
    return;
  }

  $("#result").innerHTML = `${find.toUpperCase()} = ${result.ans.toFixed(2)} m`;

  $("#steps").textContent = result.steps;
  $("#result-card").style.display = "block";

  updateDiagram(result.ans, D, S);
});

/* STEPS TOGGLE */
$("#toggleSteps").addEventListener("click", () => {
  $("#steps").classList.toggle("hidden");
});
