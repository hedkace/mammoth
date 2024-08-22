let body = document.body
let main = document.createElement("main")
body.innerHTML = ""
body.appendChild(main)
main.style.display = "grid"
let colorPicker = document.createElement("div")
colorPicker.style.display ="grid"
colorPicker.style.maxWidth = "444px"
colorPicker.style.maxHeight = "76px"
colorPicker.style.gridTemplateColumns = "1fr 4fr"
colorPicker.style.gridTemplateRows = "1fr 1fr 1fr"
colorPicker.style.gap = "4px"
let currentColor = document.createElement("div")
currentColor.height = parseInt(colorPicker.style.height)
let hueBar = document.createElement("div")
let satBar = document.createElement("div")
let litBar = document.createElement("div")
colorPicker.appendChild(currentColor)
colorPicker.appendChild(hueBar)
colorPicker.appendChild(satBar)
colorPicker.appendChild(litBar)
currentColor.style.gridRowStart = 1
currentColor.style.gridRowEnd = 4
currentColor.style.gridColumnStart = 1
currentColor.style.gridColumnEnd = 2
hueBar.style.gridRowStart = 1
hueBar.style.gridRowEnd = 2
hueBar.style.gridColumnStart = 2
hueBar.style.gridColumnEnd = 3
satBar.style.gridRowStart = 2
satBar.style.gridRowEnd = 3
satBar.style.gridColumnStart = 2
satBar.style.gridColumnEnd = 3
litBar.style.gridRowStart = 3
litBar.style.gridRowEnd = 4
litBar.style.gridColumnStart = 2
litBar.style.gridColumnEnd = 3
main.appendChild(colorPicker)
let hue = 0
let sat = 100
let lit = 50
currentColor.style.border = "1px solid white"
currentColor.style.background = "hsl("+hue+","+sat+"%,"+lit+"%)"
//hueBar.style.background = "linear-gradient(90deg,hsl(0,100%,50%),hsl(45,100%,50%),hsl(90,100%,50%),hsl(135,100%,50%),hsl(180,100%,50%),hsl(225,100%,50%),hsl(270,100%,50%),hsl(315,100%,50%),hsl(360,100%,50%))"
let hueCanvas = document.createElement("canvas")
hueBar.appendChild(hueCanvas)
let satCanvas = document.createElement("canvas")
satBar.appendChild(satCanvas)
let litCanvas = document.createElement("canvas")
litBar.appendChild(litCanvas)
hueBar.style.width = "100%"
hueBar.style.height = "100%"
satBar.style.width = "100%"
satBar.style.height = "100%"
litBar.style.width = "100%"
litBar.style.height = "100%"
hueCanvas.height = hueBar.clientHeight
hueCanvas.width = hueBar.clientWidth
satCanvas.height = satBar.clientHeight
satCanvas.width = satBar.clientWidth
litCanvas.height = litBar.clientHeight
litCanvas.width = litBar.clientWidth
let hueCtx = hueCanvas.getContext("2d")
let satCtx = satCanvas.getContext("2d")
let litCtx = litCanvas.getContext("2d")
let redrawColorPicker = ()=>{
    currentColor.style.background = "hsl("+hue+","+sat+"%,"+lit+"%)"
    for(let xx = 0; xx < hueCanvas.width; xx++){
        hueCtx.beginPath()
        hueCtx.fillStyle = "hsl("+xx/hueCanvas.width*360+",100%,50%)"
        hueCtx.rect(xx,0,1,hueCanvas.height)
        hueCtx.fill()
    }
    for(let xx = 0; xx < satCanvas.width; xx++){
        satCtx.beginPath()
        satCtx.fillStyle = "hsl("+hue+","+xx/satCanvas.width*100+"%,"+lit+"%)"
        satCtx.rect(xx,0,1,satCanvas.height)
        satCtx.fill()
    }
    for(let xx = 0; xx < litCanvas.width; xx++){
        litCtx.beginPath()
        litCtx.fillStyle = "hsl("+hue+","+sat+"%,"+xx/litCanvas.width*100+"%)"
        litCtx.rect(xx,0,1,litCanvas.height)
        litCtx.fill()
    }
    //hue marker
    hueCtx.beginPath()
    hueCtx.moveTo(hue/360*hueCanvas.width-4,0)
    hueCtx.lineTo(hue/360*hueCanvas.width,4)
    hueCtx.lineTo(hue/360*hueCanvas.width+4,0)
    hueCtx.fillStyle = "white"
    hueCtx.strokeStyle = "black"
    hueCtx.lineWidth = .5
    hueCtx.fill()
    hueCtx.stroke()
    hueCtx.beginPath()
    hueCtx.moveTo(hue/360*hueCanvas.width-4,hueCanvas.height)
    hueCtx.lineTo(hue/360*hueCanvas.width,hueCanvas.height-4)
    hueCtx.lineTo(hue/360*hueCanvas.width+4,hueCanvas.height)
    hueCtx.fill()
    hueCtx.stroke()
    //sat marker
    satCtx.beginPath()
    satCtx.moveTo(sat/100*satCanvas.width-4,0)
    satCtx.lineTo(sat/100*satCanvas.width,4)
    satCtx.lineTo(sat/100*satCanvas.width+4,0)
    satCtx.fillStyle = "white"
    satCtx.strokeStyle = "black"
    satCtx.lineWidth = .5
    satCtx.fill()
    satCtx.stroke()
    satCtx.beginPath()
    satCtx.moveTo(sat/100*satCanvas.width-4,satCanvas.height)
    satCtx.lineTo(sat/100*satCanvas.width,satCanvas.height-4)
    satCtx.lineTo(sat/100*satCanvas.width+4,satCanvas.height)
    satCtx.fill()
    satCtx.stroke()
    //lit marker
    litCtx.beginPath()
    litCtx.moveTo(lit/100*litCanvas.width-4,0)
    litCtx.lineTo(lit/100*litCanvas.width,4)
    litCtx.lineTo(lit/100*litCanvas.width+4,0)
    litCtx.fillStyle = "white"
    litCtx.strokeStyle = "black"
    litCtx.lineWidth = .5
    litCtx.fill()
    litCtx.stroke()
    litCtx.beginPath()
    litCtx.moveTo(lit/100*litCanvas.width-4,litCanvas.height)
    litCtx.lineTo(lit/100*litCanvas.width,litCanvas.height-4)
    litCtx.lineTo(lit/100*litCanvas.width+4,litCanvas.height)
    litCtx.fill()
    litCtx.stroke()
}

redrawColorPicker()

hueCanvas.onclick = (e)=>{
    let box = e.target.getBoundingClientRect()
    let mx = e.clientX - box.left
    //let my = e.clientY - box.top
    hue = mx/hueCanvas.width*360
    redrawColorPicker()
}
satCanvas.onclick = (e)=>{
    let box = e.target.getBoundingClientRect()
    let mx = e.clientX - box.left
    //let my = e.clientY - box.top
    sat = mx/satCanvas.width*100
    redrawColorPicker()
}
litCanvas.onclick = (e)=>{
    let box = e.target.getBoundingClientRect()
    let mx = e.clientX - box.left
    //let my = e.clientY - box.top
    lit = mx/litCanvas.width*100
    redrawColorPicker()
}