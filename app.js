// SHORTHAND SELECTOR
function $(id) {
  return document.querySelector(id);
}

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
    window.scrollTo(0, 0);
  } else {
    tool.classList.add("hidden");
    gallery.style.display = "grid";
    hero.style.display = "block";
    startBtn.textContent = "Start TrignoTool";
    window.scrollTo(0, 0);
  }
});

// -------------------------
// FIELD GENERATION
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
  const k1 = $("#known1").value;
  const k2 = $("#known2").value;

  if (k1 === k2) {
    $("#inputsArea").innerHTML =
      `<p style="color:red;">❌ Please select two different known values.</p>`;
    return;
  }

  $("#inputsArea").innerHTML = fields[k1] + fields[k2];
}

$("#known1").addEventListener("change", updateInputFields);
$("#known2").addEventListener("change", updateInputFields);
updateInputFields();

// -------------------------
// CALCULATION LOGIC
// -------------------------
function calcHeight(D, S, Adeg) {
  if (D != null && Adeg != null) {
    const H = D * Math.tan(Adeg * Math.PI / 180);
    return {
      ans: H,
      steps: `Formula: H = D × tan(θ)
H = ${D} × tan(${Adeg})
H = ${H.toFixed(2)}`
    };
  }
  if (S != null && D != null) {
    const H = Math.sqrt(S*S - D*D);
    return {
      ans: H,
      steps: `Formula: H = √(S² − D²)
H = √(${S}² − ${D}²)
H = ${H.toFixed(2)}`
    };
  }
  return null;
}

// CALCULATE BUTTON
$("#calc").addEventListener("click", () => {
  const find = $("#findValue").value;
  const k1 = $("#known1").value;
  const k2 = $("#known2").value;

  let H=null, D=null, S=null, A=null;

  if ($("#heightVal")) H = Number($("#heightVal")?.value);
  if ($("#distanceVal")) D = Number($("#distanceVal")?.value);
  if ($("#slantVal")) S = Number($("#slantVal")?.value);
  if ($("#angleVal")) A = Number($("#angleVal")?.value);

  let resultData;

  if (find === "height") resultData = calcHeight(D, S, A);

  if (!resultData) {
    alert("Invalid or missing input!");
    return;
  }

  $("#result").innerHTML =
    `${find.toUpperCase()} = ${resultData.ans.toFixed(2)} m`;

  $("#steps").textContent = resultData.steps;
  $("#result-card").style.display = "block";
});

// SHOW/HIDE STEPS
$("#toggleSteps").addEventListener("click", () => {
  $("#steps").classList.toggle("hidden");
});
