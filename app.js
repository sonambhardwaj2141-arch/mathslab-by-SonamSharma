// HOME → TOOL
document.getElementById("startBtn").addEventListener("click", () => {

  // Hide Home Page
  document.getElementById("home").style.display = "none";

  // Show Tool
  document.getElementById("tool").classList.remove("hidden");

  // Scroll
  window.scrollTo({
    top: document.getElementById("tool").offsetTop - 10,
    behavior: "smooth"
  });
});


// TOOL → HOME
document.getElementById("homeBtn").addEventListener("click", () => {

  document.getElementById("tool").classList.add("hidden");
  document.getElementById("home").style.display = "block";

  window.scrollTo({ top: 0, behavior: "smooth" });
});


// =======================
// DYNAMIC INPUT FIELDS
// =======================
function updateInputFields() {
  const known1 = document.getElementById("known1").value;
  const known2 = document.getElementById("known2").value;

  const inputsArea = document.getElementById("inputsArea");
  inputsArea.innerHTML = "";

  if (known1 === known2) {
    inputsArea.innerHTML = `<p style="color:red;">Select two DIFFERENT values.</p>`;
    return;
  }

  let fields = [known1, known2];

  fields.forEach(v => {
    let label = "";
    if (v === "height") label = "Height (H)";
    if (v === "distance") label = "Horizontal Distance (D)";
    if (v === "angle") label = "Angle θ (degrees)";
    if (v === "hyp") label = "Hypotenuse";

    inputsArea.innerHTML += `
      <div class="row">
        <label>${label}</label>
        <input type="number" id="input_${v}" step="any" placeholder="Enter ${label}">
      </div>
    `;
  });
}

document.getElementById("known1").addEventListener("change", updateInputFields);
document.getElementById("known2").addEventListener("change", updateInputFields);
updateInputFields();


// =======================
// MAIN CALCULATION LOGIC
// =======================
document.getElementById("calc").addEventListener("click", () => {

  const find = document.getElementById("findValue").value;
  const known1 = document.getElementById("known1").value;
  const known2 = document.getElementById("known2").value;

  if (known1 === known2) {
    alert("Please select two DIFFERENT known values.");
    return;
  }

  let v1 = parseFloat(document.getElementById("input_" + known1)?.value);
  let v2 = parseFloat(document.getElementById("input_" + known2)?.value);

  if (isNaN(v1) || isNaN(v2)) {
    alert("Enter both values.");
    return;
  }

  let H = null, D = null, A = null, Hyp = null;

  if (known1 === "height") H = v1;
  if (known1 === "distance") D = v1;
  if (known1 === "angle") A = v1;
  if (known1 === "hyp") Hyp = v1;

  if (known2 === "height") H = v2;
  if (known2 === "distance") D = v2;
  if (known2 === "angle") A = v2;
  if (known2 === "hyp") Hyp = v2;

  function degToRad(x) { return (x*Math.PI)/180; }
  function radToDeg(x) { return (x*180)/Math.PI; }

  let result = null, steps = "";

  // HEIGHT
  if (find === "height") {
    if (A != null && D != null) {
      result = D * Math.tan(degToRad(A));
      steps = `H = D × tan(θ)\nH = ${D} × tan(${A})`;
    }
  }

  // DISTANCE
  if (find === "distance") {
    if (A != null && H != null) {
      result = H / Math.tan(degToRad(A));
      steps = `D = H / tan(θ)\nD = ${H} / tan(${A})`;
    }
  }

  // ANGLE
  if (find === "angle") {
    if (H != null && D != null) {
      result = radToDeg(Math.atan(H / D));
      steps = `θ = arctan(H/D)\nθ = arctan(${H}/${D})`;
    }
  }

  // HYPOTENUSE
  if (find === "hyp") {
    if (H != null && D != null) {
      result = Math.sqrt(H * H + D * D);
      steps = `Hyp = √(H² + D²)\nHyp = √(${H}² + ${D}²)`;
    }
  }

  if (result == null) {
    alert("Invalid input combination.");
    return;
  }

  document.getElementById("result-card").style.display = "block";
  document.getElementById("result").innerHTML = 
    `${find.toUpperCase()} = ${result.toFixed(2)}`;
  document.getElementById("steps").innerText = steps;
});


// CLEAR BUTTON
document.getElementById("clear").addEventListener("click", () => {
  document.getElementById("result-card").style.display = "none";
});
