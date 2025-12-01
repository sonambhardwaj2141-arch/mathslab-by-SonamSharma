function $(q) {
  return document.querySelector(q);
}

const startBtn = $("#startBtn");
const tool = $("#tool");
const gallery = $(".gallery");

// ------------------------------------------------------------
// LOAD GALLERY
// ------------------------------------------------------------
async function loadGallery() {
  if (!gallery) return;
  try {
    const res = await fetch("images/");
    const html = await res.text();
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const links = Array.from(tmp.querySelectorAll("a"));
    const urls = links
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && /\.(png|jpe?g|webp|gif)$/i.test(h))
      .map((h) => (h.startsWith("http") ? h : "images/" + h.replace(/^\/+/, "")));
    if (urls.length) {
      gallery.innerHTML = "";
      urls.forEach((u) => {
        const img = new Image();
        img.src = u;
        img.loading = "lazy";
        img.alt = "Uploaded image";
        gallery.appendChild(img);
      });
    }
  } catch (e) {}
}

document.addEventListener("DOMContentLoaded", loadGallery);

// ------------------------------------------------------------
// TOGGLE HOME / TOOL VIEW
// ------------------------------------------------------------
startBtn.addEventListener("click", () => {
  const isHidden = tool.classList.contains("hidden");
  if (isHidden) {
    tool.classList.remove("hidden");
    if (gallery) gallery.style.display = "none";
    startBtn.textContent = "Home";
    tool.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    tool.classList.add("hidden");
    if (gallery) gallery.style.display = "";
    loadGallery();
    startBtn.textContent = "Start TrignoTool";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// ------------------------------------------------------------
// INPUT REFERENCES
// ------------------------------------------------------------
const rcard = $("#result-card"),
  rdiv = $("#result"),
  sdiv = $("#steps");

const inputs = { h: $("#height"), d: $("#distance"), a: $("#angle") };
const units = { hu: $("#heightUnit"), du: $("#distanceUnit") };

const calcBtn = $("#calc"),
  clearBtn = $("#clear");

// UNIT CONVERSION
const toMeters = {
  m: (v) => v,
  km: (v) => v * 1000,
  cm: (v) => v / 100,
  dm: (v) => v / 10,
};
const fromMeters = {
  m: (v) => v,
  km: (v) => v / 1000,
  cm: (v) => v * 100,
  dm: (v) => v * 10,
};

// ------------------------------------------------------------
// UTIL FUNCTIONS
// ------------------------------------------------------------
function getSolveFor() {
  return document.querySelector('input[name="solve"]:checked').value;
}
function degToRad(deg) {
  return (deg * Math.PI) / 180;
}
function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}
function validatePositive(v) {
  return !(isNaN(v) || v <= 0);
}

// ------------------------------------------------------------
// MAIN COMPUTE FUNCTION
// ------------------------------------------------------------
function compute() {
  const solve = getSolveFor();
  const Hraw = parseFloat(inputs.h.value);
  const Draw = parseFloat(inputs.d.value);
  const A = parseFloat(inputs.a.value);

  const Hunit = units.hu.value,
    Dunit = units.du.value;

  let H = validatePositive(Hraw) ? toMeters[Hunit](Hraw) : null;
  let D = validatePositive(Draw) ? toMeters[Dunit](Draw) : null;

  let result = null,
    steps = "",
    outUnit = "m";

  // ------------------------------------------------------------
  // FIND HEIGHT
  // ------------------------------------------------------------
  if (solve === "height") {
    if (D === null || isNaN(A) || A <= 0 || A >= 90) {
      alert("Enter a positive distance and an angle between 0° and 90°.");
      return;
    }
    const theta = degToRad(A);
    const Hm = D * Math.tan(theta);

    result = fromMeters[Hunit](Hm);
    outUnit = Hunit;

    steps = `tan(θ) = height / distance
⇒ height = distance × tan(θ)
⇒ height = ${Draw} ${Dunit} × tan(${A}°)
⇒ height ≈ ${result.toFixed(2)} ${outUnit}`;

    show("Height", result, ` ${outUnit}`);
  }

  // ------------------------------------------------------------
  // FIND DISTANCE
  // ------------------------------------------------------------
  else if (solve === "distance") {
    if (H === null || isNaN(A) || A <= 0 || A >= 90) {
      alert("Enter a positive height and an angle between 0° and 90°.");
      return;
    }

    const theta = degToRad(A);
    const Dm = H / Math.tan(theta);
    result = fromMeters[Dunit](Dm);
    outUnit = Dunit;

    steps = `tan(θ) = height / distance
⇒ distance = height / tan(θ)
⇒ distance = ${Hraw} ${Hunit} / tan(${A}°)
⇒ distance ≈ ${result.toFixed(2)} ${outUnit}`;

    show("Distance", result, ` ${outUnit}`);
  }

  // ------------------------------------------------------------
  // ⭐ FIND HYPOTENUSE (NEW)
  // ------------------------------------------------------------
  else if (solve === "hyp") {
    const hGiven = H !== null;
    const dGiven = D !== null;
    const aGiven = !isNaN(A) && A > 0 && A < 90;

    let count = 0;
    if (hGiven) count++;
    if (dGiven) count++;
    if (aGiven) count++;

    if (count < 2) {
      alert("Enter ANY TWO values:\n• Height & Distance\n• Height & Angle\n• Distance & Angle");
      return;
    }

    // CASE 1 — HEIGHT & DISTANCE
    if (hGiven && dGiven) {
      const hypM = Math.sqrt(H * H + D * D);
      result = hypM;
      steps = `Hypotenuse = √(height² + distance²)
⇒ Hyp = √(${Hraw}² + ${Draw}²)
⇒ Hyp ≈ ${hypM.toFixed(2)} m`;

      show("Hypotenuse", result, " m");
    }

    // CASE 2 — HEIGHT & ANGLE
    else if (hGiven && aGiven) {
      const theta = degToRad(A);
      const hypM = H / Math.sin(theta);
      result = hypM;

      steps = `Hypotenuse = height ÷ sin(θ)
⇒ Hyp = ${Hraw} ${Hunit} ÷ sin(${A}°)
⇒ Hyp ≈ ${hypM.toFixed(2)} m`;

      show("Hypotenuse", result, " m");
    }

    // CASE 3 — DISTANCE & ANGLE
    else if (dGiven && aGiven) {
      const theta = degToRad(A);
      const hypM = D / Math.cos(theta);
      result = hypM;

      steps = `Hypotenuse = distance ÷ cos(θ)
⇒ Hyp = ${Draw} ${Dunit} ÷ cos(${A}°)
⇒ Hyp ≈ ${hypM.toFixed(2)} m`;

      show("Hypotenuse", result, " m");
    }
  }

  // ------------------------------------------------------------
  // FIND ANGLE
  // ------------------------------------------------------------
  else {
    if (H === null || D === null) {
      alert("Enter positive height and distance.");
      return;
    }

    const theta = radToDeg(Math.atan(H / D));
    result = theta;

    steps = `tan(θ) = height / distance
⇒ θ = arctan(height / distance)
⇒ θ = arctan(${Hraw} ${Hunit} / ${Draw} ${Dunit})
⇒ θ ≈ ${theta.toFixed(2)}°`;

    show("Angle θ", result, "°");
  }

  sdiv.textContent = steps;
  rcard.style.display = "block";
}

// ------------------------------------------------------------
// SHOW RESULT
// ------------------------------------------------------------
function show(label, value, unit = " m") {
  rdiv.textContent = `${label} = ${Number(value).toFixed(2)}${unit}`;
}

// ------------------------------------------------------------
// BUTTON EVENTS
// ------------------------------------------------------------
$("#calc").addEventListener("click", compute);

$("#clear").addEventListener("click", () => {
  inputs.h.value = "";
  inputs.d.value = "";
  inputs.a.value = "";
  rcard.style.display = "none";
});

// ------------------------------------------------------------
// SERVICE WORKER
// ------------------------------------------------------------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
