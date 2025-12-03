/* ---------- VERSION CHECK & UPDATE POPUP ---------- */
const APP_VERSION = "3.1.0";

window.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("updateBanner");
  const reloadBtn = document.getElementById("reloadBtn");
  if (!banner) return;

  const saved = localStorage.getItem("trigno_version");
  if (!saved) {
    localStorage.setItem("trigno_version", APP_VERSION);
    return;
  }

  if (saved !== APP_VERSION) banner.classList.remove("hidden");

  reloadBtn.addEventListener("click", () => {
    localStorage.setItem("trigno_version", APP_VERSION);
    location.reload();
  });
});

/* ---------- SHORTCUT ---------- */
const $ = (q) => document.querySelector(q);

/* ---------- DARK MODE ---------- */
$("#darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

/* ---------- HOME / START NAVIGATION ---------- */
$("#startBtn").addEventListener("click", () => {
  $("#tool").classList.remove("hidden");
  $(".hero").style.display="none";
  $(".gallery").style.display="none";
});
$("#homeBtn").addEventListener("click", () => {
  $("#tool").classList.add("hidden");
  $(".hero").style.display="block";
  $(".gallery").style.display="grid";
});

/* ---------- UNIT CONVERSION ---------- */
const toMeters={
  m:v=>v, cm:v=>v/100, dm:v=>v/10, km:v=>v*1000, ft:v=>v*0.3048, inch:v=>v*0.0254
};
const degToRad=d=>(d*Math.PI)/180;
const radToDeg=r=>(r*180)/Math.PI;
const r2=x=>Number(x).toFixed(2);
const r4=x=>Number(x).toFixed(4);

/* ---------- INPUT TEMPLATES ---------- */
const fields={
  height:`<div class='rowBlock'><label>Height (H)</label><input id='heightVal' type='number'/><select id='heightUnit'><option value='m'>m</option><option value='cm'>cm</option><option value='dm'>dm</option><option value='km'>km</option><option value='ft'>ft</option><option value='inch'>inch</option></select></div>`,
  distance:`<div class='rowBlock'><label>Horizontal Distance (D)</label><input id='distanceVal' type='number'/><select id='distanceUnit'><option value='m'>m</option><option value='cm'>cm</option><option value='dm'>dm</option><option value='km'>km</option><option value='ft'>ft</option><option value='inch'>inch</option></select></div>`,
  slant:`<div class='rowBlock'><label>Slant Distance (S)</label><input id='slantVal' type='number'/><select id='slantUnit'><option value='m'>m</option><option value='cm'>cm</option><option value='dm'>dm</option><option value='km'>km</option><option value='ft'>ft</option><option value='inch'>inch</option></select></div>`,
  angle:`<div class='rowBlock'><label>Angle θ</label><input id='angleVal' type='number'/><span>degrees</span></div>`
};

function updateInputs(){
  const k1=$("#known1").value, k2=$("#known2").value;
  if(k1===k2){
    $("#inputsArea").innerHTML="<p style='color:red;'>Choose different known values.</p>";
    return;
  }
  $("#inputsArea").innerHTML=fields[k1]+fields[k2];
}
$("#known1").addEventListener("change",updateInputs);
$("#known2").addEventListener("change",updateInputs);
updateInputs();

/* ---------- TRIANGLE DIAGRAM ---------- */
function updateDiagram(H,D,S){
  if(!H||!D||!S) return;

  const scale=Math.min(240/D,120/H);
  const Hpx=H*scale, Dpx=D*scale;

  $("#baseLine").setAttribute("x2",40+Dpx);
  $("#heightLine").setAttribute("y2",180-Hpx);
  $("#slantLine").setAttribute("x2",40+Dpx);
  $("#slantLine").setAttribute("y2",180-Hpx);

  $("#labelH").setAttribute("y",180-Hpx/2);
  $("#labelD").setAttribute("x",40+Dpx/2);
  $("#labelS").setAttribute("x",40+Dpx/2);
  $("#labelS").setAttribute("y",180-Hpx/2);
}

/* ---------- FULL COMBINATION CALCULATOR ---------- */
function calculate(find){
  const Hv=$("#heightVal")?parseFloat($("#heightVal").value):null;
  const Dv=$("#distanceVal")?parseFloat($("#distanceVal").value):null;
  const Sv=$("#slantVal")?parseFloat($("#slantVal").value):null;
  const Av=$("#angleVal")?parseFloat($("#angleVal").value):null;

  const H=Hv?toMeters[$("#heightUnit").value](Hv):null;
  const D=Dv?toMeters[$("#distanceUnit").value](Dv):null;
  const S=Sv?toMeters[$("#slantUnit").value](Sv):null;
  const A=Av;

  const has=v=>v!==null&&!isNaN(v);

  let res=null, steps="", Hm=H, Dm=D, Sm=S, Am=A;

  /* ---- HEIGHT ---- */
  if(find==="height"){
    if(has(D)&&has(A)){
      const t=Math.tan(degToRad(A));
      Hm=D*t; Sm=Math.sqrt(Hm*Hm+D*D);
      steps=`H = D × tan(θ)\nH = ${r2(D)} × tan(${r2(A)})\ntan = ${r4(t)}\nH = ${r2(Hm)}`;
      res=Hm;
    }
    else if(has(S)&&has(A)){
      const s=Math.sin(degToRad(A));
      Hm=S*s; Dm=Math.sqrt(S*S-Hm*Hm);
      steps=`H = S × sin(θ)\nH = ${r2(S)} × sin(${r2(A)})\nsin = ${r4(s)}\nH = ${r2(Hm)}`;
      res=Hm;
    }
    else if(has(S)&&has(D)){
      Hm=Math.sqrt(S*S-D*D);
      steps=`H = √(S² - D²)\nH = ${r2(Hm)}`;
      res=Hm;
    }
  }

  /* ---- DISTANCE ---- */
  else if(find==="distance"){
    if(has(H)&&has(A)){
      const t=Math.tan(degToRad(A));
      Dm=H/t; Sm=Math.sqrt(H*H+Dm*Dm);
      steps=`D = H ÷ tan(θ)\ntan = ${r4(t)}\nD = ${r2(H)} ÷ ${r4(t)} = ${r2(Dm)}`;
      res=Dm;
    }
    else if(has(S)&&has(A)){
      const c=Math.cos(degToRad(A));
      Dm=S*c; Hm=Math.sqrt(S*S-Dm*Dm);
      steps=`D = S × cos(θ)\nD = ${r2(S)} × cos(${r2(A)})\ncos = ${r4(c)}\nD = ${r2(Dm)}`;
      res=Dm;
    }
    else if(has(S)&&has(H)){
      Dm=Math.sqrt(S*S-H*H);
      steps=`D = √(S² - H²)\nD = ${r2(Dm)}`;
      res=Dm;
    }
  }

  /* ---- SLANT ---- */
  else if(find==="slant"){
    if(has(H)&&has(D)){
      Sm=Math.sqrt(H*H+D*D);
      steps=`S = √(H² + D²)\nS = ${r2(Sm)}`;
      res=Sm;
    }
    else if(has(H)&&has(A)){
      const s=Math.sin(degToRad(A));
      Sm=H/s; Dm=Math.sqrt(Sm*Sm-H*H);
      steps=`S = H ÷ sin(θ)\nsin = ${r4(s)}\nS = ${r2(H)} ÷ ${r4(s)} = ${r2(Sm)}`;
      res=Sm;
    }
    else if(has(D)&&has(A)){
      const c=Math.cos(degToRad(A));
      Sm=D/c; Hm=Math.sqrt(Sm*Sm-D*D);
      steps=`S = D ÷ cos(θ)\ncos = ${r4(c)}\nS = ${r2(D)} ÷ ${r4(c)} = ${r2(Sm)}`;
      res=Sm;
    }
  }

  /* ---- ANGLE ---- */
  else if(find==="angle"){
    if(has(H)&&has(D)){
      const r=H/D;
      Am=radToDeg(Math.atan(r));
      steps=`θ = arctan(H ÷ D)\nθ = arctan(${r4(r)}) = ${r2(Am)}°`;
      res=Am;
    }
    else if(has(H)&&has(S)){
      const r=H/S;
      Am=radToDeg(Math.asin(r));
      steps=`θ = arcsin(H ÷ S)\nθ = arcsin(${r4(r)}) = ${r2(Am)}°`;
      res=Am;
    }
    else if(has(D)&&has(S)){
      const r=D/S;
      Am=radToDeg(Math.acos(r));
      steps=`θ = arccos(D ÷ S)\nθ = arccos(${r4(r)}) = ${r2(Am)}°`;
      res=Am;
    }
  }

  if(res===null) return null;

  return {res,steps,H:Hmm=>Hm,D:dm=>Dm,S:sm=>Sm,Hm,Dm,Sm,Am};
}

/* ---------- CALCULATE BUTTON ---------- */
$("#calc").addEventListener("click",()=>{
  const find=$("#findValue").value;

  const c=calculate(find);
  if(!c){ alert("Invalid combination."); return; }

  const label={
    height:"HEIGHT",
    distance:"HORIZONTAL DISTANCE",
    slant:"SLANT DISTANCE",
    angle:"ANGLE θ"
  }[find];

  const unit=find==="angle"?"°":"m";

  $("#result").textContent=`${label}: ${r2(c.res)} ${unit}`;
  $("#steps").textContent=c.steps;
  $("#result-card").style.display="block";
  $("#steps").classList.add("hidden");
  $("#toggleSteps").textContent="Show Steps";

  updateDiagram(c.Hm,c.Dm,c.Sm);
});

/* ---------- CLEAR BUTTON ---------- */
$("#clear").addEventListener("click",()=>{
  document.querySelectorAll("#inputsArea input").forEach(i=>i.value="");
  $("#result-card").style.display="none";
});

/* ---------- STEPS TOGGLE ---------- */
$("#toggleSteps").addEventListener("click",()=>{
  const s=$("#steps");
  s.classList.toggle("hidden");
  $("#toggleSteps").textContent=s.classList.contains("hidden")?"Show Steps":"Hide Steps";
});
