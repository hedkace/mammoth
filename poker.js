let body = document.body
players = []
let vals = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"]
let altVals = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]
let suits = ["&diams;", "&clubs;", "&hearts;", "&spades;"]
let deck = []

let ranks = ["royal flush","straight flush","four of a kind","full house","flush","straight","three of a kind","two pair","pair","high card"]

let testHand = [
    {
        val: 4,
        suit: "&clubs;"
    },
    {
        val: 5,
        suit: "&clubs;"
    },
    {
        val: 5,
        suit: "&clubs;"
    },
    {
        val: 5,
        suit: "&clubs;"
    },
    {
        val: 4,
        suit: "&clubs;"
    }
]

for (suit of suits){
    for(val of vals){
        deck.push({val: val, suit: suit})
    }
}
for(index in deck){
    let otherIndex = Math.floor(Math.random()*deck.length)
    let thisCard = { val: deck[index].val, suit: deck[index].suit}
    deck[index] = {val: deck[otherIndex].val, suit: deck[otherIndex].suit}
    deck[otherIndex] = thisCard
}

/*for(card of deck){
    body.innerHTML += card.suit+" "+card.val+", <br>"
}*/

for (let i=0; i<10; i++){
    players.push([])
}

for (player of players){
    player.push(deck.pop())
}
for (player of players){
    player.push(deck.pop())
}

//deck.sort((a, b) => vals.indexOf(a.val) - vals.indexOf(b.val))

let communityCards = []
for(let i=0; i<5; i++){
    communityCards.push(deck.pop())
}

//communityCards = testHand

let subsets = []
for(player of players){
    let subset = []
    let fullset = player.concat(communityCards)
    for(let i = 0; i<7; i++){
        for(let j = i+1; j<7; j++){
            for(let k = j+1; k<7; k++){
                for(let l = k+1; l<7; l++){
                    for(let m = l+1; m<7; m++){
                        if(new Set([i,j,k,l,m]).size == 5) subset.push([fullset[i],fullset[j],fullset[k],fullset[l],fullset[m]])
                    }
                }
            }
        }
    }
    subsets.push(subset)
}

for(card of communityCards){
    body.innerHTML += card.val+card.suit+"<br>"
}

body.innerHTML += "<br><br><br>"
console.log(subsets)



let checkForStraight = (hand)=>{
    let conseqs = 1
    let hasAces = hand[0].val == "A"
    for (let i = 0; i<hand.length-1; i++){ 
        hasAces = hasAces || hand[i+1].val == "A"
        if(vals.indexOf(hand[i+1].val) - vals.indexOf(hand[i].val)==1) conseqs ++
        else if(conseqs<5) conseqs = 1
    }
    if(conseqs > 4) return true
    if(hasAces){
        conseqs = 1
        hand.sort((a, b) => altVals.indexOf(a.val) - altVals.indexOf(b.val))
        for (let i = 0; i<hand.length-1; i++){ 
            if(altVals.indexOf(hand[i+1].val) - altVals.indexOf(hand[i].val)==1) conseqs ++
            else if(conseqs<5) conseqs = 1
        }
        if(conseqs > 4) return true
        else hand.sort((a, b) => vals.indexOf(a.val) - vals.indexOf(b.val))
    }
    return false
}
let checkForFlush = (hand)=>{
    let bFlush = hand[0].suit==hand[1].suit
    for(let i = 1; i < hand.length-1; i++){
        bFlush = bFlush && hand[i].suit == hand[i+1].suit
    }
    if(bFlush) return true
    else return false
}
checkForOther = (hand)=>{
    let temp = []
    for(val of vals){
        let tally = 0
        for(card of hand){
            if(val == card.val){
                tally ++
            }
        }
        if(tally > 1) temp.push([val, tally])
    }
    temp.sort((a, b) => altVals.indexOf(b[1]) - altVals.indexOf(a[1]))
    return temp
}

let hands = subsets

let hasStraight = []
for(player of hands){
    let bStraight = false
    for(hand of player){
        hand.sort((a, b) => vals.indexOf(a.val) - vals.indexOf(b.val))
        bStraight = bStraight || checkForStraight(hand)
    }
    hasStraight.push(bStraight)
}



for(i in hands){
    let hasAStraight = false
    let hasAFlush = false
    let bestHand = null
    let others = []
    let highCard = null
    let handValues = []
    let handRanks = []
    for(hand in hands[i]){
        let thisHandRank = []
        let cardValues = []
        for(card of hands[i][hand]){
            cardValues.push(card.val)
        }
        cardValues.sort((a,b)=>vals.indexOf(a)-vals.indexOf(b))
        let thisHandValue = "high card"
        let thisHandIsAFlush = checkForFlush(hands[i][hand])
        let thisHandIsAStraight = checkForStraight(hands[i][hand])
        if(thisHandIsAFlush){
            if(thisHandIsAStraight){
                thisHandValue = "straight flush"
                if(cardValues[4] == "A") {
                    if(cardValues[0] == 10){
                        thisHandValue = "royal flush"
                        handValues.push([thisHandValue,"A"])
                        thisHandRank.push(10)
                    }
                    else {
                        handValues.push([thisHandValue, "5"])
                        thisHandRank.push(9)
                    }
                }
                else{
                    handValues.push([thisHandValue, cardValues[4]])
                    thisHandRank.push(9)
                    thisHandRank.push(cardValues[4])
                }
            }
            else{
                thisHandValue = "flush"
                thisHandRank.push(6)
                for(c in hands[i][hand]){
                    let card = hands[i][hand][4-c]
                    thisHandRank.push(card.val)
                }
            }
        }
        else{
            if(thisHandIsAStraight){
                thisHandValue = "straight"
                if(cardValues[4] == "A") {
                    if(cardValues[0] == 10){
                        handValues.push([thisHandValue,"A"])
                        thisHandRank.push(5)
                        thisHandRank.push("A")
                    }
                    else {
                        handValues.push([thisHandValue, "5"])
                        thisHandRank.push(5)
                        thisHandRank.push(5)
                    }
                }
                else{
                    thisHandRank.push(5)
                    thisHandRank.push(cardValues[4])
                }
            }
            let multiples = checkForOther(hands[i][hand])
            multiples.sort((a,b)=>b[1]-a[1] || b[0]-a[0])
            if(multiples.length == 2){
                if(multiples[0][1]==3){
                    thisHandValue = "full house"
                    handValues.push([thisHandValue, multiples[0][0]])
                    thisHandRank.push(7)
                    thisHandRank.push(cardValues[4])
                    thisHandRank.push(cardValues[0])
                }
                else{
                    thisHandValue = "two pair"
                    handValues.push([thisHandValue, multiples[0][0]])
                    thisHandRank.push(3)
                    thisHandRank.push(multiples[0][0])
                    thisHandRank.push(multiples[1][0])
                    for(c in hands[i][hand]){
                        let card = hands[i][hand][4-c]
                        if(card.val != multiples[0][0] && card.val != multiples[1][0]) thisHandRank.push(card.val)
                    }
                }
            }
            else if(multiples.length == 1){
                if(multiples[0][1]==4){
                    thisHandValue = "four of a kind"
                    handValues.push([thisHandValue, multiples[0][0]])
                    thisHandRank.push(8)
                    thisHandRank.push(multiples[0][0])
                    for(card of hands[i][hand]){
                        if(card.val != multiples[0][0]) thisHandRank.push(card.val)
                    }
                }
                else if(multiples[0][1]==3){
                    thisHandValue = "three of a kind"
                    handValues.push([thisHandValue, multiples[0][0]])
                    thisHandRank.push(4)
                    thisHandRank.push(multiples[0][0])
                    for(card of hands[i][hand]){
                        if(card.val != multiples[0][0]) thisHandRank.push(card.val)
                    }
                }
                else if (multiples[0][1]==2){
                    thisHandValue = "pair"
                    handValues.push([thisHandValue, multiples[0][0]])
                    thisHandRank.push(2)
                    thisHandRank.push(multiples[0][0])
                    for(c in hands[i][hand]){
                        let card = hands[i][hand][4-c]
                        if(card.val != multiples[0][0]) thisHandRank.push(card.val)
                    }
                }
            }
            else {
                thisHandRank.push(1)
                handValues.push([thisHandValue, cardValues[4]])
                if(!thisHandIsAStraight && !thisHandIsAFlush){
                    for(let n = 4; n > -1; n--){
                        thisHandRank.push(hands[i][hand][n].val)
                    }
                }
            }
        }
        hands[i][hand].push(thisHandValue)
        hands[i][hand].push(thisHandRank)
        let temp = 0
        for(v in thisHandRank){
            let cv = thisHandRank[v]
            if(cv == "A") cv = 14
            if(cv == "K") cv = 13
            if(cv == "Q") cv = 12
            if(cv == "J") cv = 11
            temp += cv*(Math.pow(100,5-v))
        }
        hands[i][hand].push(temp)
    }
    //hands[i].sort((a,b)=>ranks.indexOf(a[5])-ranks.indexOf(b[5]) || vals.indexOf(b[4].val)-vals.indexOf(a[4].val))
    hands[i].sort((a,b)=>b[7]-a[7])
    console.log(hands[i])
    for (hand in hands[i]){
        for(let n = 0; n<5; n++){
            body.innerHTML += hands[i][hand][n].val+hands[i][hand][n].suit+", "
        }
        body.innerHTML += hands[i][hand][5]+", "
        body.innerHTML += hands[i][hand][6]+", "
        body.innerHTML += hands[i][hand][7]
        /*for(let n=6; n<hands[i][hand].length-1; n++){
            body.innerHTML += hands[i][hand][n]+", "
        }*/
        /*for(card of hands[i][hand]){
            if(card.val) body.innerHTML += card.val+card.suit+", "
            else if(typeof card == ){
                body.innerHTML += card.val+", "
            }
            else body.innerHTML += card
        }*/
        //body.innerHTML += "&nbsp;&nbsp;"+handValues[hand]
        body.innerHTML += "<br>"
    }
    body.innerHTML += "<br><br><br>"
}


let testArray = [
    [1,2,3],
    [4,4,1],
    [4,2,4],
    [1,5,5],
    [2,3,3],
    [1,1,1]
]

console.log(testArray.sort((a,b)=>a[0] - b[0] || a[1] - b[1]))

let board = document.createElement("canvas")
document.body.appendChild(board)
board.height = 660
board.width = 973
let ctx = board.getContext("2d")
let boardImage = document.createElement("img")
boardImage.src = "public/images/poker table alt.png"
ctx.drawImage(boardImage, 0, 0, 973, 660)
ctx.font = "700 14pt Poppins"
ctx.fillStyle = "#7d8ea5ff"
ctx.fillText("MAMMOTH", 14, 24)
ctx.font = "12pt Voltaire"
ctx.fillStyle = "#0fa"
ctx.fillStyle = "#3ea"
ctx.fillText("Poker", 124, 24)
let pfp = document.createElement("img")
pfp.src = "public/images/avatar1m.png"
ctx.drawImage(pfp,580,5,72, 72)
pfp.src = "public/images/avatar1f.png"
ctx.drawImage(pfp,320,5,72, 72)
pfp.src = "public/images/avatar1f.png"
ctx.drawImage(pfp,100,80,72, 72)
pfp.src = "public/images/avatar1m.png"
ctx.drawImage(pfp,100,230,72, 72)
pfp.src = "public/images/avatar1f.png"
ctx.drawImage(pfp,100,390,72, 72)
pfp.src = "public/images/avatar1f.png"
ctx.drawImage(pfp,800,80,72, 72)
pfp.src = "public/images/avatar1m.png"
ctx.drawImage(pfp,800,230,72, 72)
pfp.src = "public/images/avatar1f.png"
ctx.drawImage(pfp,800,390,72, 72)
pfp.src = "public/images/avatar1m.png"
ctx.drawImage(pfp,380,495,72, 72)
pfp.src = "public/images/cardblank.png"
ctx.drawImage(pfp,300, 300, 81, 105)
pfp.src = "public/images/cardback.png"
ctx.drawImage(pfp,600, 300, 81, 105)
ctx.beginPath()
ctx.rect(0,570,400,90)
ctx.fillStyle = "#021020"
ctx.fill()
ctx.strokeStyle = "#999"
ctx.lineWidth = .5
ctx.stroke()


ctx.textAlign = "left"
ctx.font = "12pt Voltaire"
ctx.fillStyle = "#999"
ctx.fillText("Dr.Jameson wins with a pair.", 10, 590)

//LEft Button
ctx.beginPath()
ctx.rect(400,610,191,50)
ctx.strokeStyle = "#999"
ctx.lineWidth = .5
ctx.stroke()
for(let pp = 0; pp <51; pp++){
    ctx.beginPath()
    ctx.moveTo(400,610+pp)
    ctx.strokeStyle = "hsl(215,"+(pp*3)+"%,"+(29-pp/1.2)+"%)"
    ctx.lineTo(591,610+pp)
    ctx.stroke()
}
ctx.textAlign = "center"
ctx.font = "20pt Voltaire"
ctx.fillStyle = "#999"
ctx.fillText("Fold", 496, 646)
ctx.beginPath()
ctx.rect(410,620,10,30)
ctx.fillStyle = "black"
ctx.fill()
//Middle Button

ctx.beginPath()
ctx.rect(591,610,191,50)
ctx.strokeStyle = "#999"
ctx.lineWidth = .5
ctx.stroke()
for(let pp = 0; pp <51; pp++){
    ctx.beginPath()
    ctx.moveTo(591,610+pp)
    ctx.strokeStyle = "hsl(215,"+(pp*3)+"%,"+(29-pp/1.2)+"%)"
    ctx.lineTo(782,610+pp)
    ctx.stroke()
}
ctx.textAlign = "center"
ctx.font = "20pt Voltaire"
ctx.fillStyle = "#999"
ctx.fillText("Call", 687, 646)
ctx.beginPath()
ctx.rect(601,620,10,30)
ctx.fillStyle = "#3ea"
ctx.fill()
//Rioght Button

ctx.beginPath()
ctx.rect(782,610,191,50)
ctx.strokeStyle = "#999"
ctx.lineWidth = .5
ctx.stroke()
for(let pp = 0; pp <51; pp++){
    ctx.beginPath()
    ctx.moveTo(782,610+pp)
    ctx.strokeStyle = "hsl(215,"+(pp*3)+"%,"+(29-pp/1.2)+"%)"
    ctx.lineTo(973,610+pp)
    ctx.stroke()
}
ctx.textAlign = "center"
ctx.font = "20pt Voltaire"
ctx.fillStyle = "#999"
ctx.fillText("Call Any", 888, 646)
ctx.beginPath()
ctx.rect(792,620,10,30)
ctx.fillStyle = "black"
ctx.fill()