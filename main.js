function Agent(game, home, food) {
    this.game = game
    this.home = home
    this.food = food
    this.searchingFood = true
    this.returnedFood = false
    this.successfulTrail = []
    this.pos = Object.assign({}, this.home.pos)
    this.trail = []
    this.trail.push(Object.assign({}, this.pos))
    this.decisionTimer = 0
    this.decisionInterval = 3
    var vec = getRandomVec()
    this.dx = vec.x
    this.dy = vec.y
    this.speed = 2.5
}

Agent.prototype.constructor = Agent

Agent.prototype.save = function () {
    const state = Object.assign({}, this)
    delete state.game
}

Agent.prototype.load = function (game, state) {
    Object.assign(this, state)
    this.game = game
}

Agent.prototype.update = function () {
    if (this.searchingFood) {
        this.decisionTimer += this.game.clockTick
        if (this.decisionTimer > this.decisionInterval / this.speed) {
            this.decisionTimer = 0
            this.trail.push(Object.assign({}, this.pos))
            var randomVec = getRandomVec()
            this.dx = randomVec.x
            this.dy = randomVec.y
        }
        if (distance(this.pos, this.food.pos) < 50) {
            this.trail.push(Object.assign({}, this.pos))
            this.successfulTrail.push(Object.assign({}, this.pos))
            this.searchingFood = false
            this.speed = 1
        }
    } else if (this.returnedFood == false) {
        var nextCrumb = this.trail[Math.max(this.trail.length - this.successfulTrail.length * 2, 0)]
        var vec = vectorToward(nextCrumb, this.pos)
        this.dx = vec.x
        this.dy = vec.y
        if (distance(this.pos, nextCrumb) < 25) {
            if (this.trail[0] === nextCrumb) {
                this.returnedFood = true
            }
            this.successfulTrail.push(Object.assign({}, this.pos))

        }

    }
    if (this.returnedFood == false) {
        this.pos.x += this.dx * this.speed
        this.pos.y += this.dy * this.speed
        if (this.pos.x > this.game.ctx.canvas.width || this.pos.x < 0) {
            this.dx *= -1
        }
        if (this.pos.y > this.game.ctx.canvas.height || this.pos.y < 0) {
            this.dy *= -1
        }
    }
}

Agent.prototype.draw = function () {
    var ctx = this.game.ctx
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(this.pos.x, this.pos.y, 12, 12)
    ctx.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
    ctx.fillStyle = "#E0E0E0";
    ctx.strokeStyle = "#E0E0E0";
    var prevCrumb = this.trail[0]
    for (var i = 1; i < this.trail.length; i++) {
        var thisCrumb = this.trail[i]
        ctx.fillRect(thisCrumb.x, thisCrumb.y, 4, 4)

        ctx.beginPath();
        ctx.moveTo(prevCrumb.x, prevCrumb.y);
        ctx.lineTo(thisCrumb.x, thisCrumb.y);
        ctx.stroke();
        prevCrumb = thisCrumb
    }

    if (this.searchingFood) {
        ctx.beginPath();
        ctx.moveTo(prevCrumb.x, prevCrumb.y);
        ctx.lineTo(this.pos.x, this.pos.y);
        ctx.stroke();
    }

    ctx.fillStyle = "#32CD32";
    ctx.strokeStyle = "#32CD32";

    for (var i = 1; i < this.successfulTrail.length; i++) {
        var thisCrumb = this.successfulTrail[i]
        ctx.fillRect(thisCrumb.x, thisCrumb.y, 4, 4)

        ctx.beginPath();
        ctx.moveTo(prevCrumb.x, prevCrumb.y);
        ctx.lineTo(thisCrumb.x, thisCrumb.y);
        ctx.stroke();
        prevCrumb = thisCrumb
    }

    if (this.searchingFood === false) {
        ctx.beginPath();
        ctx.moveTo(prevCrumb.x, prevCrumb.y);
        ctx.lineTo(this.pos.x, this.pos.y);
        ctx.stroke();
    }

    if (this.returnedFood) {
        console.log('Found path')
        this.game.ctx.font = "bold 24px verdana, sans-serif ";
        this.game.ctx.fillStyle = "#ff00ff";
        this.game.ctx.fillText("Food returned", 30, 30);
    }
}

function Food(game) {
    this.game = game
    this.pos = {
        x: this.game.ctx.canvas.width - 50,
        y: this.game.ctx.canvas.height - 50
    }
}

Food.prototype.constructor = Food

Food.prototype.save = function () {
    const state = Object.assign({}, this)
    delete state.game
}

Food.prototype.load = function (game, state) {
    Object.assign(this, state)
    this.game = game
}

Food.prototype.update = function () {

}

Food.prototype.draw = function () {
    this.game.ctx.fillStyle = "#FF0000";
    this.game.ctx.fillRect(this.pos.x, this.pos.y, 20, 20)
}

function Home(game) {
    this.game = game
    this.pos = {
        x: 30,
        y: 30
    }
}

Home.prototype.constructor = Food

Home.prototype.save = function () {
    const state = Object.assign({}, this)
    delete state.game
}

Home.prototype.load = function (game, state) {
    Object.assign(this, state)
    this.game = game
}

Home.prototype.update = function () {

}

Home.prototype.draw = function () {
    this.game.ctx.fillStyle = "#32CD32";
    this.game.ctx.fillRect(this.pos.x, this.pos.y, 20, 20)
}

window.onload = function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    var food = new Food(gameEngine)
    var home = new Home(gameEngine)
    gameEngine.addEntity(home)
    gameEngine.addEntity(food)
    for (var i = 0; i < 1; i++) {
        gameEngine.addEntity(new Agent(gameEngine, home, food))
    }
    window.gameEngine = gameEngine
    console.log("All Done!");
}

function getRandomVec() {
    var x = Math.random() - 0.5
    var y = Math.random() - 0.5
    var mag = Math.sqrt(x * x + y * y)
    return {
        x: x / mag,
        y: y / mag
    }
}

function distance(p, q) {
    var a = p.x - q.x;
    var b = p.y - q.y;

    var c = Math.sqrt(a * a + b * b);
    return c
}

function vectorToward(p, q) {
    var x = p.x - q.x
    var y = p.y - q.y
    var mag = Math.sqrt(x * x + y * y)
    return {
        x: x / mag,
        y: y / mag
    }
}
