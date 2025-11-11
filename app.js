
function $(q){return document.querySelector(q)}
const startBtn = $('#startBtn')
const tool = $('#tool')

startBtn.addEventListener('click', ()=>{
  tool.classList.remove('hidden')
  startBtn.scrollIntoView({behavior:'smooth'})
})

const rcard = $('#result-card'), rdiv = $('#result'), sdiv = $('#steps')
const inputs = { h: $('#height'), d: $('#distance'), a: $('#angle') }
const units = { hu: $('#heightUnit'), du: $('#distanceUnit') }
const calcBtn = $('#calc'), clearBtn = $('#clear')

const toMeters = { m:v=>v, km:v=>v*1000, cm:v=>v/100, dm:v=>v/10 }
const fromMeters = { m:v=>v, km:v=>v/1000, cm:v=>v*100, dm:v=>v*10 }

function getSolveFor(){ return document.querySelector('input[name="solve"]:checked').value }
function degToRad(deg){return deg*Math.PI/180}
function radToDeg(rad){return rad*180/Math.PI}
function validatePositive(v){return !(isNaN(v) || v<=0)}

function compute(){
  const solve = getSolveFor()
  const Hraw = parseFloat(inputs.h.value)
  const Draw = parseFloat(inputs.d.value)
  const A = parseFloat(inputs.a.value)
  const Hunit = units.hu.value, Dunit = units.du.value
  let H = validatePositive(Hraw) ? toMeters[Hunit](Hraw) : null
  let D = validatePositive(Draw) ? toMeters[Dunit](Draw) : null

  let result = null, steps = '', outUnit = 'm'

  if(solve==='height'){
    if(D===null || isNaN(A) || A<=0 || A>=90){ alert('Enter a positive distance and an angle between 0° and 90°.'); return; }
    const theta = degToRad(A)
    const Hm = D * Math.tan(theta)
    result = fromMeters[Hunit](Hm)
    outUnit = Hunit
    steps = `tan(θ) = height / distance\n⇒ height = distance × tan(θ)\n⇒ height = ${Draw} ${Dunit} × tan(${A}°)\n⇒ height ≈ ${result.toFixed(2)} ${outUnit}`
    show('Height', result, ` ${outUnit}`)
  } else if(solve==='distance'){
    if(H===null || isNaN(A) || A<=0 || A>=90){ alert('Enter a positive height and an angle between 0° and 90°.'); return; }
    const theta = degToRad(A)
    const Dm = H / Math.tan(theta)
    result = fromMeters[Dunit](Dm)
    outUnit = Dunit
    steps = `tan(θ) = height / distance\n⇒ distance = height / tan(θ)\n⇒ distance = ${Hraw} ${Hunit} / tan(${A}°)\n⇒ distance ≈ ${result.toFixed(2)} ${outUnit}`
    show('Distance', result, ` ${outUnit}`)
  } else {
    if(H===null || D===null){ alert('Enter positive height and distance.'); return; }
    const theta = radToDeg(Math.atan(H/D))
    result = theta
    steps = `tan(θ) = height / distance\n⇒ θ = arctan(height / distance)\n⇒ θ = arctan(${Hraw} ${Hunit} / ${Draw} ${Dunit})\n⇒ θ ≈ ${theta.toFixed(2)}°`
    show('Angle θ', result, '°')
  }
  sdiv.textContent = steps
  rcard.style.display = 'block'
}

function show(label, value, unit=' m'){ rdiv.textContent = `${label} = ${Number(value).toFixed(2)}${unit}` }

$('#calc').addEventListener('click', compute)
$('#clear').addEventListener('click', ()=>{ inputs.h.value=''; inputs.d.value=''; inputs.a.value=''; rcard.style.display='none' })

if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js') }
