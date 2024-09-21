let data = []
let gridDims = 24
let bShift = false
let bDropper = false
let bFill = false
let bDraw = false
let history = []
let hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
let hexToHSL = (hex) => {
    var result = []
    let r = hue
    let g = sat
    let b = lit
    if(hex.length == 7){
        result.push(parseInt(hex[1], 16)*16+parseInt(hex[2], 16))
        result.push(parseInt(hex[3], 16)*16+parseInt(hex[4], 16))
        result.push(parseInt(hex[5], 16)*16+parseInt(hex[6], 16))
        r = result[0]
        g = result[1]
        b = result[2]
    }
    else if(hex.length == 4){
        result.push(parseInt(hex[1], 16)*16+parseInt(hex[1],16))
        result.push(parseInt(hex[2], 16)*16+parseInt(hex[2],16))
        result.push(parseInt(hex[3], 16)*16+parseInt(hex[3],16))
        r = result[0]
        g = result[1]
        b = result[2]
    }
    if(result.length>0) {
        if(r && b && g ){
            r /= 255, g /= 255, b /= 255
            var max = Math.max(r, g, b), min = Math.min(r, g, b)
            var h, s, l = (max + min) / 2
        
            if(max == min){
                h = s = 0; // achromatic
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
                switch(max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break
                    case g: h = (b - r) / d + 2; break
                    case b: h = (r - g) / d + 4; break
                }
                h /= 6
            }
        
            h *= 360
            s = s*100
            s = Math.round(s)
            l = l*100
            l = Math.round(l)
        
            hue = h
            sat = s
            lit = l
            redrawColorPicker()
        }
        else{
            colorCode.value = hslToHex(hue,sat,lit)
        }
    }
    else{
        colorCode.value = hslToHex(hue,sat,lit)
    }
}
let buildData = (dims)=>{
    let temp = []
    for (let i = 0; i <dims; i++){
        let newRow = []
        for(let j = 0; j<dims; j++){
            if(typeof data[i] == 'undefined' || typeof data[i][j] == 'undefined') newRow.push([0,0,100])
            else newRow.push(data[i][j])
        }
        temp.push(newRow)
    }
    data = temp
}
buildData(gridDims)
history.push(data)
let body = document.body
let main = document.createElement("main")
let branding = document.createElement("div")
body.innerHTML = ""
body.appendChild(branding)
body.style.padding = 0
body.style.margin = 0
/*let mark = document.createElement("img")
mark.src = "mammoth mark.svg"
branding.appendChild(mark)
mark.style.height = "32px"
mark.style.paddingRight = "4px"
let logo = document.createElement("div")
branding.appendChild(logo)
logo.innerHTML += "Mammoth"
logo.width = "250px"
logo.style.display = "inline-block"
branding.style.display = "grid"
branding.style.gap = "16px"
branding.style.gridTemplateRows = "1fr"
branding.style.gridTemplateColumns = "40px 1fr"*/
branding.style.fontWeight = "500"
branding.style.fontSize = "1.5rem"
branding.style.marginLeft = "20px"
branding.style.display = "grid"
branding.style.marginTop = "6px"
branding.innerHTML += "Mammoth"
body.appendChild(main)
main.style.display = "grid"
main.style.alignItems = "center"
main.style.justifyItems = "center"
main.style.minHeight = "90vh"
let wrapper = document.createElement("div")
let artBox = document.createElement("div")
artBox.style.display = "grid"
artBox.style.gridTemplateRows = "1fr"
artBox.style.gridTemplateColumns = "1fr"
artBox.style.width = "480px"
artBox.style.height = "480px"
main.appendChild(wrapper)
let dimChooser = document.createElement("div")
wrapper.appendChild(dimChooser)
let grid24Button = document.createElement("div")
let grid48Button = document.createElement("div")
grid24Button.innerHTML = "24x24"
grid48Button.innerHTML = "48x48"
dimChooser.style.display = "grid"
dimChooser.style.gridTemplateColumns = "1fr 1fr"
dimChooser.appendChild(grid24Button)
dimChooser.appendChild(grid48Button)
grid24Button.style.display = "grid"
grid48Button.style.display = "grid"
grid24Button.style.alignItems = "center"
grid24Button.style.justifyContent = "center"
grid48Button.style.alignItems = "center"
grid48Button.style.justifyContent = "center"
grid24Button.style.padding = "20px"
grid24Button.style.background = "lightblue"
grid48Button.style.padding = "20px"
grid48Button.style.background = "#55a"
let switchTo24 = ()=>{
    grid24Button.style.background = "lightblue"
    grid48Button.style.background = "#55a"
    gridDims = 24
    buildData(24)
    showGrid()
    drawData()
}

let switchTo48 = ()=>{
    grid24Button.style.background = "#55a"
    grid48Button.style.background = "lightblue"
    gridDims = 48
    buildData(gridDims)
    showGrid()
    drawData()
}

grid24Button.onclick = switchTo24
grid48Button.onclick = switchTo48

wrapper.appendChild(artBox)
//wrapper.style.gap = "8px"
let preview = document.createElement("div")
let overlay = document.createElement("div")
artBox.appendChild(preview)
artBox.appendChild(overlay)
preview.style.gridRowStart = 1
preview.style.gridRowEnd = 2
preview.style.gridColumnStart = 1
preview.style.gridColumnEnd = 2
overlay.style.gridRowStart = 1
overlay.style.gridRowEnd = 2
overlay.style.gridColumnStart = 1
overlay.style.gridColumnEnd = 2
overlay.style.zIndex = 3
let previewCanvas = document.createElement("canvas")
preview.appendChild(previewCanvas)
previewCanvas.height = 480
previewCanvas.width = 480
let overlayCanvas = document.createElement("canvas")
overlay.appendChild(overlayCanvas)
overlayCanvas.height = 480
overlayCanvas.width = 480
showGrid = ()=>{
    let overlayCtx = overlayCanvas.getContext("2d")
    overlayCtx.clearRect(0,0,overlayCanvas.width,overlayCanvas.height)
    for(let xx=0; xx<=480; xx+=480/gridDims){
        overlayCtx.beginPath()
        overlayCtx.moveTo(xx,0)
        overlayCtx.lineTo(xx,480)
        overlayCtx.lineWidth = .5
        overlayCtx.strokeStyle = "#444"
        overlayCtx.stroke()
    }
    for(let yy=0; yy<=480; yy+=480/gridDims){
        overlayCtx.beginPath()
        overlayCtx.moveTo(0,yy)
        overlayCtx.lineTo(480,yy)
        overlayCtx.lineWidth = .5
        overlayCtx.strokeStyle = "#444"
        overlayCtx.stroke()
    }
}
showGrid()
let dataButtons = document.createElement("div")
let artButtons = document.createElement("div")
let dropperButton = document.createElement("div")
let fillButton = document.createElement("div")
let dragButton = document.createElement("div")
let clearButton = document.createElement("div")
wrapper.appendChild(dataButtons)
wrapper.appendChild(artButtons)
dataButtons.style.margin = "14px 0 10px 0"
dataButtons.style.display = "grid"
artButtons.style.display = "grid"
dataButtons.style.gridTemplateColumns = "repeat(4, 1fr)"
artButtons.style.gridTemplateColumns = "repeat(4, 1fr)"
artButtons.appendChild(dropperButton)
dropperButton.style.gridColumnStart = 1
dropperButton.style.gridColumnEnd = 2
dropperButton.style.gridRowStart = 1
dropperButton.style.gridRowEnd = 2
dropperButton.style.background = "blue"
dropperIcon = document.createElement("img")
dropperIcon.src = "public/images/dropper.svg"
dropperButton.appendChild(dropperIcon)
artButtons.appendChild(fillButton)
fillButton.style.gridColumnStart = 2
fillButton.style.gridColumnEnd = 3
fillButton.style.gridRowStart = 1
fillButton.style.gridRowEnd = 2
fillButton.style.background = "blue"
fillIcon = document.createElement("img")
fillIcon.src = "public/images/fill.svg"
fillButton.appendChild(fillIcon)
artButtons.appendChild(dragButton)
dragButton.style.gridColumnStart = 3
dragButton.style.gridColumnEnd = 4
dragButton.style.gridRowStart = 1
dragButton.style.gridRowEnd = 2
dragButton.style.background = "blue"
dragIcon = document.createElement("img")
dragIcon.src = "public/images/shiftArrows.svg"
dragButton.appendChild(dragIcon)
artButtons.appendChild(clearButton)
clearButton.style.gridColumnStart = 4
clearButton.style.gridColumnEnd = 5
clearButton.style.gridRowStart = 1
clearButton.style.gridRowEnd = 2
clearButton.style.background = "blue"
clearIcon = document.createElement("img")
clearIcon.src = "public/images/delete.svg"
clearButton.appendChild(clearIcon)
let dataButton = document.createElement("div")
let imageButton = document.createElement("div")
let saveButton = document.createElement("div")
let mintButton = document.createElement("div")
dataButtons.appendChild(dataButton)
dataButton.style.gridColumnStart = 1
dataButton.style.gridColumnEnd = 2
dataButton.style.gridRowStart = 1
dataButton.style.gridRowEnd = 2
dataButton.style.background = "blue"
dataButton.innerHTML = "DATA"
dataButtons.appendChild(imageButton)
imageButton.style.gridColumnStart = 2
imageButton.style.gridColumnEnd = 3
imageButton.style.gridRowStart = 1
imageButton.style.gridRowEnd = 2
imageButton.style.background = "blue"
imageButton.innerHTML = "IMAGE"
dataButtons.appendChild(saveButton)
saveButton.style.gridColumnStart = 3
saveButton.style.gridColumnEnd = 4
saveButton.style.gridRowStart = 1
saveButton.style.gridRowEnd = 2
saveButton.style.background = "blue"
saveButton.innerHTML = "SAVE"
dataButtons.appendChild(mintButton)
mintButton.style.gridColumnStart = 4
mintButton.style.gridColumnEnd = 5
mintButton.style.gridRowStart = 1
mintButton.style.gridRowEnd = 2
mintButton.style.background = "blue"
mintButton.innerHTML = "MINT"
mintButton.style.background = "#5f5"
mintButton.style.color = "#333"
dataButtons.style.gap = "4px"
artButtons.style.gap = "4px"
dataButtons.style.height = "40px"
artButtons.style.height = "40px"
dataButtons.querySelectorAll("div").forEach(item=>{
    item.style.display ="grid"
    item.style.alignContent = "center"
    item.style.justifyContent = "center"
    item.padding = "4px"
})
artButtons.querySelectorAll("div").forEach(item=>{
    item.style.display ="grid"
    item.style.alignContent = "center"
    item.style.justifyContent = "center"
})
let colorCode = document.createElement("input")
colorCode.style.textAlign = "center"
colorCode.value = "#ff0000"
colorCode.style.marginTop = "30px"
wrapper.style.textAlign = "center"
wrapper.appendChild(colorCode)
colorCode.style.color = "black"
colorCode.onkeydown = (e) =>{
    if(e.key == "Enter") hexToHSL(e.target.value)
} 
let colorPicker = document.createElement("div")
colorPicker.style.display ="grid"
colorPicker.style.maxWidth = "320px"
colorPicker.style.maxHeight = "76px"
colorPicker.style.gridTemplateColumns = "1fr 3fr"
colorPicker.style.gridTemplateRows = "1fr 1fr 1fr"
colorPicker.style.gap = "4px"
let currentColor = document.createElement("div")
let hueBar = document.createElement("div")
let satBar = document.createElement("div")
let litBar = document.createElement("div")
colorPicker.appendChild(currentColor)
colorPicker.appendChild(hueBar)
colorPicker.appendChild(satBar)
colorPicker.appendChild(litBar)
hueBar.classList.add("colorBar")
satBar.classList.add("colorBar")
litBar.classList.add("colorBar")
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
hueBar.style.width = "240px"
hueBar.style.height = "23px"
satBar.style.width = "240px"
satBar.style.height = "23px"
litBar.style.width = "240px"
litBar.style.height = "23px"
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
    colorCode.innerHTML = hslToHex(hue,sat, lit)
    /*
    let rgbvector = []
    let xval = Math.cos(hue/180*Math.PI)
    let yval = Math.sin(hue/180*Math.PI)
    let redval = (xval+1)/2
    let greenval = (-xval/Math.sqrt(3)+yval/2)
    let blueval = (-xval/Math.sqrt(3)-yval/2)
    rgbvector.push(redval*255)
    rgbvector.push(greenval*255)
    rgbvector.push(blueval*255)
    colorPicker.style.background = "rgb("+rgbvector[0]+","+rgbvector[1]+","+rgbvector[2]+")"
    */
    for(let xx = 0; xx <= hueCanvas.width; xx++){
        hueCtx.beginPath()
        hueCtx.fillStyle = "hsl("+xx/hueCanvas.width*360+",100%,50%)"
        hueCtx.rect(xx,0,1,hueCanvas.height)
        hueCtx.fill()
    }
    for(let xx = 0; xx <= satCanvas.width; xx++){
        satCtx.beginPath()
        satCtx.fillStyle = "hsl("+hue+","+xx/satCanvas.width*100+"%,"+lit+"%)"
        satCtx.rect(xx,0,1,satCanvas.height)
        satCtx.fill()
    }
    for(let xx = 0; xx <= litCanvas.width; xx++){
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
    colorCode.value = hslToHex(hue,sat,lit)
    redrawColorPicker()
}
satCanvas.onclick = (e)=>{
    let box = e.target.getBoundingClientRect()
    let mx = e.clientX - box.left
    //let my = e.clientY - box.top
    sat = mx/satCanvas.width*100
    colorCode.value = hslToHex(hue,sat,lit)
    redrawColorPicker()
}
litCanvas.onclick = (e)=>{
    let box = e.target.getBoundingClientRect()
    let mx = e.clientX - box.left
    //let my = e.clientY - box.top
    lit = mx/litCanvas.width*100
    colorCode.value = hslToHex(hue,sat,lit)
    redrawColorPicker()
}
let popUpImage= ()=>{
    let popUp = document.createElement("div")
    let popUpWrapper = document.createElement("div")
    let popUpTitle = document.createElement("div")
    let popUpBody = document.createElement("img")
    let popUpButtonWrapper = document.createElement("div")
    let popUpButton2 = document.createElement("div")
    popUpWrapper.style.padding = "30px"
    popUpTitle.style.marginBottom = "10px"
    popUpButton2.style.margin = "10px 0"
    popUpButton2.style.padding = "10px"
    popUp.appendChild(popUpWrapper)
    popUpWrapper.appendChild(popUpTitle)
    popUpWrapper.appendChild(popUpBody)
    popUpButtonWrapper.appendChild(popUpButton2)
    popUpWrapper.appendChild(popUpButtonWrapper)
    popUpButtonWrapper.style.display = "grid"
    popUpButtonWrapper.style.gridTemplateColumns = "1fr"
    popUpButtonWrapper.style.gap = "4px"
    popUp.style.zIndex = 1000
    popUp.style.display = "grid"
    popUp.style.alignItems = "center"
    popUp.style.justifyContent = "center"
    popUpTitle.style.fontSize = "1.2rem"
    popUpTitle.style.fontWeight = 600
    popUpTitle.style.color = "#8af"
    popUp.style.background = "#000d"
    popUpWrapper.style.background = "#025"
    popUpButton2.style.background = "#acf"
    popUpButton2.style.color = "#444"
    popUpBody.src = previewCanvas.toDataURL()
    popUpTitle.innerHTML = "NFT Data"
    popUpButton2.innerHTML = "OK"
    document.body.appendChild(popUp)
    popUp.style.textAlign = "center"
    popUp.style.position = "fixed"
    popUp.style.height = "100vh"
    popUp.style.width = "100vw"
    popUp.style.top = 0
    popUp.style.left = 0
    popUpButton2.onclick = (e)=>{
        document.body.removeChild(popUp)
        drawData()
    }
}


let popUpData = ()=>{
    let popUp = document.createElement("div")
    let popUpWrapper = document.createElement("div")
    let popUpTitle = document.createElement("div")
    let popUpBody = document.createElement("textarea")
    let popUpButtonWrapper = document.createElement("div")
    let popUpButton1 = document.createElement("div")
    let popUpButton2 = document.createElement("div")
    popUpWrapper.style.padding = "30px"
    popUpTitle.style.marginBottom = "10px"
    popUpButton1.style.margin = "10px 0"
    popUpButton2.style.margin = "10px 0"
    popUpButton1.style.padding = "10px"
    popUpButton2.style.padding = "10px"
    popUp.appendChild(popUpWrapper)
    popUpWrapper.appendChild(popUpTitle)
    popUpWrapper.appendChild(popUpBody)
    popUpButtonWrapper.appendChild(popUpButton1)
    popUpButtonWrapper.appendChild(popUpButton2)
    popUpWrapper.appendChild(popUpButtonWrapper)
    popUpButtonWrapper.style.display = "grid"
    popUpButtonWrapper.style.gridTemplateColumns = "1fr 1fr"
    popUpButtonWrapper.style.gap = "4px"
    popUp.style.zIndex = 1000
    popUp.style.display = "grid"
    popUp.style.alignItems = "center"
    popUp.style.justifyContent = "center"
    popUpTitle.style.fontSize = "1.2rem"
    popUpTitle.style.fontWeight = 600
    popUpTitle.style.color = "#8af"
    popUp.style.background = "#000d"
    popUpWrapper.style.background = "#025"
    popUpButton1.style.background = "#acf"
    popUpButton2.style.background = "#acf"
    popUpButton1.style.color = "#444"
    popUpButton2.style.color = "#444"
    popUpBody.value = JSON.stringify({version: 2, dims: gridDims, dat: data})
    popUpBody.rows = "10"
    popUpBody.cols = "63"
    popUpTitle.innerHTML = "NFT Data"
    popUpButton1.innerHTML = "Copy"
    popUpButton2.innerHTML = "OK"
    document.body.appendChild(popUp)
    popUp.style.textAlign = "center"
    popUp.style.position = "fixed"
    popUp.style.height = "100vh"
    popUp.style.width = "100vw"
    popUp.style.top = 0
    popUp.style.left = 0
    popUpButton1.onclick = (e)=>{
        navigator.clipboard.writeText(JSON.stringify(JSON.parse(popUpBody.value)));
        alert("data copied to clipboard")
    }
    popUpButton2.onclick = (e)=>{
        let newobj = JSON.parse(popUpBody.value)
        data = newobj.dat
        document.body.removeChild(popUp)
        gridDims = newobj.dims
        if(gridDims == 48) switchTo48()
        else switchTo24()
        drawData()
    }
}


let fill = (checkList, overwriteColor) =>{
    let currentCell = checkList[0]
    temp = []
    for(let i = 1; i < checkList.length; i++)
    {
        temp.push(checkList[i])
    }
    if(currentCell[0]+1 < gridDims) {
        let elemCheck = true
        elemCheck = elemCheck && data[currentCell[0]+1][currentCell[1]][0] == overwriteColor[0]
        elemCheck = elemCheck && data[currentCell[0]+1][currentCell[1]][1] == overwriteColor[1]
        elemCheck = elemCheck && data[currentCell[0]+1][currentCell[1]][2] == overwriteColor[2]
        if(elemCheck) {
            temp.push([currentCell[0]+1,currentCell[1]])
            data[currentCell[0]+1][currentCell[1]] = data[currentCell[0]][currentCell[1]]
        }
    }
    if(currentCell[0]-1 > -1) {
        elemCheck = true
        elemCheck = elemCheck && data[currentCell[0]-1][currentCell[1]][0] == overwriteColor[0]
        elemCheck = elemCheck && data[currentCell[0]-1][currentCell[1]][1] == overwriteColor[1]
        elemCheck = elemCheck && data[currentCell[0]-1][currentCell[1]][2] == overwriteColor[2]
        if(elemCheck) {
            temp.push([currentCell[0]-1,currentCell[1]])
            data[currentCell[0]-1][currentCell[1]] = data[currentCell[0]][currentCell[1]]
        }
    }
    if(currentCell[1]+1 < gridDims) {
        elemCheck = true
        elemCheck = elemCheck && data[currentCell[0]][currentCell[1]+1][0] == overwriteColor[0]
        elemCheck = elemCheck && data[currentCell[0]][currentCell[1]+1][1] == overwriteColor[1]
        elemCheck = elemCheck && data[currentCell[0]][currentCell[1]+1][2] == overwriteColor[2]
        if(elemCheck) {
            temp.push([currentCell[0],currentCell[1]+1])
            data[currentCell[0]][currentCell[1]+1] = data[currentCell[0]][currentCell[1]]
        }
    }
    if(currentCell[1]-1 > -1) {
        elemCheck = true
        elemCheck = elemCheck && data[currentCell[0]][currentCell[1]-1][0] == overwriteColor[0]
        elemCheck = elemCheck && data[currentCell[0]][currentCell[1]-1][1] == overwriteColor[1]
        elemCheck = elemCheck && data[currentCell[0]][currentCell[1]-1][2] == overwriteColor[2]
        if(elemCheck) {
            temp.push([currentCell[0],currentCell[1]-1])
            data[currentCell[0]][currentCell[1]-1] = data[currentCell[0]][currentCell[1]]
        }
    }
    if(temp.length > 0) fill(temp, overwriteColor)
}

let drawData = (shiftX = 0, shiftY = 0)=>{
    let previewCtx = previewCanvas.getContext('2d')
    previewCtx.beginPath()
    previewCtx.clearRect(0,0,previewCanvas.width,previewCanvas.height)
    for(let i=0; i<gridDims; i++){
        for(let j=0; j<gridDims; j++){
            previewCtx.beginPath()
            previewCtx.rect((i+shiftX)*480/gridDims,(j+shiftY)*480/gridDims,480/gridDims, 480/gridDims)
            previewCtx.fillStyle = "hsl("+data[i][j][0]+","+ data[i][j][1]+"%,"+ data[i][j][2]+"%)"
            previewCtx.fill()
        }   
    }
}

drawData()

overlayCanvas.onmousedown = (e)=>{
    let mx = e.clientX - e.target.getBoundingClientRect().left
    let my = e.clientY - e.target.getBoundingClientRect().top
    mx *= gridDims/480
    my *= gridDims/480
    mx = Math.floor(mx)
    my = Math.floor(my)
    if(!bDropper && !bFill){
        data[mx][my] = [hue,sat,lit]
        drawData()
        bDraw = true
    }
    else{
        if(bDropper){

        }
    }
}
overlayCanvas.onmouseup = (e)=>{
    let mx = e.clientX - e.target.getBoundingClientRect().left
    let my = e.clientY - e.target.getBoundingClientRect().top
    mx *= gridDims/480
    my *= gridDims/480
    mx = Math.floor(mx)
    my = Math.floor(my)
    if(bDropper){
        hue = data[mx][my][0]
        sat = data[mx][my][1]
        lit = data[mx][my][2]
        redrawColorPicker()
        colorCode.value = hslToHex(hue,sat,lit)
    }
    if(bFill){
        let checkList = [[mx,my]]
        overwriteColor = data[mx][my]
        data[mx][my] = [hue,sat,lit]
        fill([[mx,my]], overwriteColor)
        drawData()
    }
    else bDraw = false
}
document.body.onmouseup = (e)=>{
    if(bDraw) {
        bDraw = false
    }
}
overlayCanvas.onmousemove = (e)=>{
    if(bDraw) {
        let mx = e.clientX - e.target.getBoundingClientRect().left
        let my = e.clientY - e.target.getBoundingClientRect().top
        mx *= gridDims/480
        my *= gridDims/480
        mx = Math.floor(mx)
        my = Math.floor(my)
        data[mx][my] = [hue,sat,lit]
        drawData()
    }
}

dataButton.onclick = (e)=>{
    popUpData()
}
imageButton.onclick = (e)=>{
    popUpImage()
}
fillButton.onclick = (e)=>{
    if(bFill) {
        fillButton.style.background = "blue"
        dropperButton.style.fillStyle = "blue"
        dragButton.style.fillStyle = "blue"
        clearButton.style.fillStyle = "blue"
        bFill = false
        bDropper = false
        bShift = false
    }
    else{
        bFill = true
        fillButton.style.background = "lightblue"
        dropperButton.style.background = "blue"
        dragButton.style.fillStyle = "blue"
        clearButton.style.fillStyle = "blue"
        bDropper = false
        bShift = false
    }
}
dropperButton.onclick = (e)=>{
    if(bDropper) {
        fillButton.style.background = "blue"
        dropperButton.style.background = "blue"
        dragButton.style.background = "blue"
        clearButton.style.background = "blue"
        bFill = false
        bDropper = false
        bShift = false
    }
    else{
        fillButton.style.background = "blue"
        dropperButton.style.background = "lightblue"
        dragButton.style.background = "blue"
        clearButton.style.background = "blue"
        bFill = false
        bDropper = true
        bShift = false
    }
}
clearButton.onclick = (e)=>{
    let clearResponse = confirm("Are you sure you want to reset the image? You will lose your work.")
    if(clearResponse){
        data = []
        buildData(gridDims)
        drawData()
    }
}
//console.log(new Date(Date.now()).toLocaleString('en-US',{timeZone: 'America/Chicago', timeZoneName: 'short'}))