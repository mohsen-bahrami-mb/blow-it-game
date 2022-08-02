////////////Variables////////////
let frames = 0;
setInterval(() => {
    if (frames < 500) frames++
    else frames = 0
}, 1)
let random2Num = function (min, max) {
    return Math.round(Math.random() * (max - min) + min)
}
let sprite = new Image()
sprite.src = "./img/sprite1.png";
let sprite2 = new Image()
sprite2.src = "./img/sprite2.png";
let audio = new Audio()
audio.src = "./sound/Bubbles Sound.mp3"
////////////Variables-end////////////


////////////Canvas////////////
class Canvas {
    constructor(id) {
        this.cvs = document.querySelector('canvas') && document.querySelector(`#${id}`);
        this.ctx = this.cvs.getContext('2d');
    }
    drawImg(image, imgDraw, move, origin = { x: 0, y: 0 }, translate = { x: 0, y: 0 }, globalAlpha = 1, rotation = 0, scale = 1) {
        this.ctx.save();
        this.ctx.globalAlpha = globalAlpha;
        this.ctx.translate(translate.x, translate.y);
        this.ctx.rotate(rotation);
        this.ctx.drawImage(image, imgDraw.x, imgDraw.y, move.x, move.y, -origin.x * scale, -origin.y * scale, move.x * scale, move.y * scale);
        this.ctx.restore()
    }
}

let canvas = new Canvas("work-space")
////////////Canvas-end////////////


////////////client////////////
class Client {
    constructor() {
        this.game = { start: 0, play: 1, over: 2 };
        this.gameState = 0;
        this.score = 0;
        this.yourBestScore = parseInt(localStorage.getItem('bestBlowItScore')) || 0;
        this.topScore = 0
        this.topScore;
        this.levels = {
            one: 0,
            two: 12,
            three: 24,
            four: 36,
            legend: 48
        };
        this.chance = 3;
        /// strat & over Data
        this.startDraw = { x: 0, y: 0 };
        this.overDraw = { x: 0, y: 251 };
        this.move = { x: 372, y: 251 };
        this.origin = { x: 186, y: 125.5 };
        this.translate = { x: (canvas.cvs.width / 2), y: (canvas.cvs.height / 2) };
    }

    start() {
        canvas.drawImg(sprite2, this.startDraw, this.move, this.origin, this.translate);
    }

    over() {
        canvas.drawImg(sprite2, this.overDraw, this.move, this.origin, this.translate);
        canvas.ctx.lineWidth = 1
        canvas.ctx.fillStyle = "#4E342E"
        canvas.ctx.strokeStyle = "#212121"
        canvas.ctx.font = "40px IMPACT"
        // your score
        canvas.ctx.fillText(this.score, (this.startDraw.x + 280), (this.startDraw.y + 355))
        canvas.ctx.strokeText(this.score, (this.startDraw.x + 280), (this.startDraw.y + 355))
        // best your score
        canvas.ctx.fillText(this.yourBestScore, (this.startDraw.x + 280), (this.startDraw.y + 400))
        canvas.ctx.strokeText(this.yourBestScore, (this.startDraw.x + 280), (this.startDraw.y + 400))
        // top score
        canvas.ctx.fillText(this.topScore, (this.startDraw.x + 280), (this.startDraw.y + 285))
        canvas.ctx.strokeText(this.topScore, (this.startDraw.x + 280), (this.startDraw.y + 285))
    }

    play() {
        canvas.ctx.lineWidth = 1
        canvas.ctx.fillStyle = "#4E342E"
        canvas.ctx.strokeStyle = "#212121"
        canvas.ctx.font = "30px IMPACT"
        canvas.ctx.fillText("chance: " + this.chance, 20, 40);
        canvas.ctx.strokeText("chance: " + this.chance, 20, 40);
        canvas.ctx.fillText("score: " + this.score, 20, 80);
        canvas.ctx.strokeText("score: " + this.score, 20, 80);
    }
}
let client = new Client()
////////////client-end////////////


////////////HolderBtn////////////
class HolderBtn {
    constructor() {
        this.drawBtn = { x: 0, y: 350 };
        this.moveBtn = { x: 60, y: 60 };
        this.originBtn = { x: 30, y: 30 };
        this.translate = [
            ////middle-1////
            { x: 70, y: canvas.cvs.height / 2 },
            ////middle-2////
            { x: canvas.cvs.width / 2, y: canvas.cvs.height / 2 },
            ////middle-3////
            { x: canvas.cvs.width - 70, y: canvas.cvs.height / 2 },
            ////top-1////
            { x: 70, y: (canvas.cvs.height / 2) / 1.5 },
            ////top-2////
            { x: canvas.cvs.width / 2, y: (canvas.cvs.height / 2) / 1.5 },
            ////top-3////
            { x: canvas.cvs.width - 70, y: (canvas.cvs.height / 2) / 1.5 },
            ////topbutton-1////
            { x: 70, y: canvas.cvs.height / 1.5 },
            ////topbutton-2////
            { x: canvas.cvs.width / 2, y: canvas.cvs.height / 1.5 },
            ////topbutton-3////
            { x: canvas.cvs.width - 70, y: canvas.cvs.height / 1.5 }
        ];
    }
    ////draw-btn////
    draw(i) {
        canvas.drawImg(sprite, this.drawBtn, this.moveBtn, this.originBtn, this.translate[i])
    }
    ////draw-btn-end////

    ////update-btn-on-level////
    update() {
        if (client.score >= client.levels.one) {
            for (let i = 0; i < 3; i++) {
                this.draw(i)
            }
        }
        if (client.score >= client.levels.two) {
            for (let i = 3; i < 6; i++) {
                this.draw(i)
            }
        }
        if (client.score >= client.levels.three) {
            for (let i = 6; i < 9; i++) {
                this.draw(i)
            }
        }
    }
    ////update-btn-on-level-end////
}

let holder = new HolderBtn()
////////////HolderBtn-end////////////


////blow-bubble////
class Blod {
    constructor() {
        this.blDraw = { x: 0, y: 411 }
        this.blMove = { x: 123, y: 157 }
        this.blOrigin = { x: 61.5, y: 78.5 }
        this.growing = true;
        this.blowes = []
    }

    draw() {
        this.blowes.forEach((bl) => {
            canvas.drawImg(sprite, this.blDraw, this.blMove, this.blOrigin, bl.blodPos, bl.blodOpacity, bl.blodRotation, bl.blodScale);
        })
    }

    update() {
        this.blowes.forEach((bl) => {
            if (bl.blodScale > 1 && bl.blodOpacity > 1 && this.growing == true) {
                this.growing = false;
            }
            if (bl.blodScale < 1 && bl.blodOpacity < 1 && this.growing == false) {
                this.blowes.shift()
                this.growing = true
            }
            bl.blodScale += frames % 3 == 0 && this.growing == true ? 0.5 : 0;
            bl.blodOpacity += frames % 3 == 0 && this.growing == true ? 0.5 : 0;
            bl.blodScale -= frames % 3 == 0 && this.growing == false ? 0.5 : 0;
            bl.blodOpacity -= frames % 3 == 0 && this.growing == false ? 0.5 : 0;
        })
    }
}
let blod = new Blod()
////blow-bubble-end////


////////////Bubble////////////
class Bubble {
    constructor() {
        ////bubble-draw////
        this.moveBubble = { x: 50, y: 50 };
        this.originBubble = { x: 25, y: 25 };
        ////bubble-draw-end////
        ////bubble-speed////
        this.durationChange = 90;
        this.durationBubbleOn = 90;
        ////bubble-speed-end////
        this.bubbleOn = true;
        this.bubbles = [];
    }

    ////create-bubble////
    draw(btnNumber) {
        let drawBubble = { x: 0, y: 0 };
        let bubbleState = 0;
        let random = random2Num(0, btnNumber);
        let bub = { random, drawBubble, bubbleState };
        this.bubbles.push(bub);
    }
    ////create-bubble-end////

    update() {
        ////process-bubble////
        this.bubbles.forEach((bubs) => {
            if (this.bubbles.length == 2 && this.bubbles[0].random == this.bubbles[1].random ||
                this.bubbles.length > 2 && this.bubbles[0].random == this.bubbles[1].random ||
                this.bubbles.length > 2 && this.bubbles[0].random == this.bubbles[2].random ||
                this.bubbles.length > 2 && this.bubbles[1].random == this.bubbles[2].random) {
                this.bubbles.length = 0
                return
            } else {
                /// growing bubble
                if (bubs.bubbleState >= 7) {
                    this.bubbleOn = false
                }
                /// shrinking bubble
                if (bubs.bubbleState < 0 && bubs.bubbleState > -2) {
                    this.bubbles.length = 0
                    this.bubbleOn = true
                }
                /// blow bubble (do blow)
                if (this.bubbles.every(blow => blow.bubbleState == -4)) {
                    this.bubbles.length = 0
                    this.bubbleOn = true
                }
                /// loss bubble (don't blow)
                if (bubs.bubbleState == -1) {
                    client.chance -= 1
                    if (client.chance == 0 && client.gameState == client.game.play) {
                        client.gameState = client.game.over;
                    }
                }
                let drawBubbleY = [0, 50, 100, 150, 200, 250, 300, 300]
                let bubbleSpeed = Math.ceil(this.durationBubbleOn / 14);
                bubs.bubbleState += frames % bubbleSpeed == 0 && this.bubbleOn == true && bubs.bubbleState > -2 ? 1 : 0;
                bubs.bubbleState -= frames % bubbleSpeed == 0 && this.bubbleOn == false && bubs.bubbleState > -2 ? 1 : 0;
                bubs.drawBubble.y = drawBubbleY[bubs.bubbleState]
                canvas.drawImg(sprite, bubs.drawBubble, this.moveBubble, this.originBubble, holder.translate[bubs.random]);
            }
            ////process-bubble-end////
        })
    }

    ////blow-it-process////
    blowIt(e) {
        switch (client.gameState) {
            case client.game.start:
                client.gameState = client.game.play;
                break;
            case client.game.play:
                this.bubbles.forEach((bubs) => {
                    let mouseX
                    let mouseY
                    let trueKey = false
                    /// key event
                    if ((e.which == 81 && bubs.random == 3) || (e.which == 87 && bubs.random == 4) || (e.which == 69 && bubs.random == 5) ||
                        (e.which == 65 && bubs.random == 0) || (e.which == 83 && bubs.random == 1) || (e.which == 68 && bubs.random == 2) ||
                        (e.which == 90 && bubs.random == 6) || (e.which == 88 && bubs.random == 7) || (e.which == 67 && bubs.random == 8)) {
                        trueKey = true
                    }
                    /// touch event
                    if (navigator.maxTouchPoints > 0) {
                        for (let i = 0; i < e.touches.length; i++) {
                            mouseX = e.touches.item(i).clientX
                            mouseY = e.touches.item(i).clientY
                        }
                        /// mouse event
                    } else {
                        mouseX = e.clientX
                        mouseY = e.clientY
                    }
                    /// start blowing
                    let dx = (mouseX - e.target.offsetLeft) - holder.translate[bubs.random].x,
                        dy = (mouseY - e.target.offsetTop) - holder.translate[bubs.random].y
                    let distance = Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)))
                    if (distance < 35 || trueKey) {
                        bubs.bubbleState = -4;
                        client.score += 1;
                        audio.play()
                        client.yourBestScore = Math.max(client.score, client.yourBestScore)
                        localStorage.setItem("bestBlowItScore", client.yourBestScore)
                        /// bubble-speed-tuning
                        this.durationBubbleOn -= client.score % 7 == 0 && this.durationBubbleOn > 20 ? 10 : 0;
                        this.durationBubbleOn += client.score % 14 == 0 && this.durationBubbleOn >= 20 ? 10 : 0;
                        /// duration-between-tuning
                        this.durationChange -= client.score % 10 == 0 && this.durationChange > 40 ? 10 : 0;
                        this.durationChange += client.score % 20 == 0 && this.durationChange >= 40 ? 10 : 0;
                        /// add braks
                        client.chance += client.score % 35 == 0 ? 1 : 0;
                        /// create blod
                        let blodPos = holder.translate[bubs.random],
                            blodOpacity = 0.2,
                            blodScale = Math.random(),
                            blodRotation = random2Num(0, 6)
                        blod.blowes.push({ blodPos, blodOpacity, blodScale, blodRotation });
                    }
                })
                break;
            case client.game.over:
                // 
                if (![81, 87, 69, 65, 83, 68, 90, 88, 67].includes(e.which)) {
                    client.gameState = client.game.start;
                    client.chance = 3
                    client.score = 0;
                    frames = 0;
                    this.durationBubbleOn = 90;
                    this.durationChange = 90;
                }
                break;
        }
    }
    ////blow-it-process-end////   
}

let bubble = new Bubble()
////////////Bubble-end////////////


////////////GameWorld////////////
class GameWorld {
    constructor() {
        ////blow-bubble-action//// 
        if (navigator.maxTouchPoints > 0) {
            document.getElementById('work-space').addEventListener("touchstart", bubble.blowIt.bind(bubble));
        } else {
            document.getElementById('work-space').addEventListener("mousedown", bubble.blowIt.bind(bubble));
        }
        document.documentElement.addEventListener("keydown", bubble.blowIt.bind(bubble));
        ////blow-bubble-action-end//// 
    }

    draw() {
        ////level-1-blow it////
        if (bubble.bubbles.length < 1 && frames % bubble.durationChange == 0 && client.score <= client.levels.two) {
            bubble.draw(2)
        }
        ////level-1-blow it-end////
        ////level-2-blow it////
        else if (bubble.bubbles.length < 1 && frames % bubble.durationChange == 0 && client.score <= client.levels.three) {
            bubble.draw(5)
        }
        ////level-2-blow it-end////
        ////level-3-blow it////
        else if (bubble.bubbles.length < 1 && frames % bubble.durationChange == 0 && client.score <= client.levels.four) {
            bubble.draw(8)
        }
        ////level-3-blow it-end////
        ////level-4-blow it////
        else if (bubble.bubbles.length < 1 && frames % bubble.durationChange == 0 && client.score < client.levels.legend) {
            for (let i = 0; i < 2; i++) { bubble.draw(8) }
        }
        ////level-4-blow it-end////
        ////level-legend-blow it////
        else if (bubble.bubbles.length < 1 && frames % bubble.durationChange == 0 && client.score >= client.levels.legend) {
            for (let i = 0; i < 3; i++) { bubble.draw(8) }
        }
        ////level-legend-blow it-end////
        blod.draw();
    };

    update() {
        holder.update()
        bubble.update()
        blod.update()
    };

    animate() {
        canvas.drawImg(sprite, { x: 123, y: 0 }, { x: 390, y: 600 })

        if (client.gameState == client.game.start) {
            client.start()
        }
        if (client.gameState == client.game.play) {
            this.draw()
            this.update()
            client.play()
        }
        if (client.gameState == client.game.over) {
            client.over()
        }
        requestAnimationFrame(this.animate.bind(this))
    }
}
let game = new GameWorld()
game.animate()
////////////GameWorld-end////////////