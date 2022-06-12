class Particle {
    constructor(x, y, vx, vy) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.r = 2
    }

    tick(t) {
        this.x += this.vx * t
        this.y += this.vy * t
        //Removes particles that are off the screen or very slow
        if (   this.x < 0
            || this.x > window.innerWidth
            || this.y < 0
            || this.y > window.innerHeight
            || Math.sqrt(Math.pow(this.vx) + Math.pow(this.vy)) < 0.01) {
            particles.splice(particles.indexOf(this), 1)
        }
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.fillStyle = "lightgray"
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false)
        ctx.fill()
    }
}

function drawBackground() {
    //Resizes the canvas and sets the background color
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight)
}

function joinParticles() {
    //Draws a line between particles that are close to each other
    let distance, color
    let maxDistance = 100
    for (let i=0; i<particles.length; i++) {
        for (let j=i+1; j<particles.length; j++) {
            distance = Math.sqrt(Math.pow(particles[i].x - particles[j].x, 2) + Math.pow(particles[i].y - particles[j].y, 2))
            if (distance < maxDistance) {
                color = 255*(1-distance/maxDistance)
                ctx.strokeStyle = `rgb(${color},${color},${color})`
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(particles[i].x, particles[i].y)
                ctx.lineTo(particles[j].x, particles[j].y)
                ctx.stroke()
            }
        }
    }
}

function tick(d) {
    //This function runs every frame
    spawnParticle()
    let t = (d - lastFrame) / 60
    lastFrame = d
    drawBackground()
    particles.map(p => p.tick(t))
    joinParticles()
    particles.map(p => p.draw(ctx))
    requestAnimationFrame(tick)
}

function randInt(min, max) {
    //I miss randint from python
    return Math.floor(Math.random() * (max+1-min)) + min
}

function generateParticles(n) {
    //Fills the screen with particles
    for (let i=0; i<n; i++) {
        particles.push(new Particle(randInt(0, window.innerWidth), randInt(0, window.innerHeight), randInt(-10, 10), randInt(-10, 10)))
    }
}

function spawnParticle() {
    //Creates a particle at the edge of the screen
    let edge = randInt(0,4) //0=top, 1=bottom, 2=left, 3=right
    let distanceAlongEdge = randInt(0, (edge <= 1) ? window.innerWidth : window.innerHeight)
    let x, y, vx, vy
    if (edge == 0) {
        x = distanceAlongEdge
        y = 0
        vx = randInt(-10, 10)
        vy = randInt(0, 10)
    } else if (edge == 1) {
        x = distanceAlongEdge
        y = window.innerHeight
        vx = randInt(-10, 10)
        vy = randInt(0, -10)
    } else if (edge == 2) {
        x = 0
        y = distanceAlongEdge
        vx = randInt(0, 10)
        vy = randInt(-10, 10)
    } else {
        x = window.innerWidth
        y = distanceAlongEdge
        vx = randInt(0, -10)
        vy = randInt(-10, 10)
    }
    particles.push(new Particle(x, y, vx, vy))
}

let canvas = document.getElementById("background")
canvas.style.position = "fixed"
canvas.style.zIndex = -1

let ctx = canvas.getContext("2d")
let particles = []
let lastFrame = 0

drawBackground()
generateParticles(500)
requestAnimationFrame(tick)