function Agent(game) {
    this.game = game
    this.path = []
    this.pos = { x: 2, y: 2 }
    this.decisionTimer = 0
    this.decisionInterval = 2
    var vec = getRandomVec()
}

Agent.prototype.constructor = Agent

Agent.prototype.update = function () {
    this.decisionTimer += this.game.clockTick
    if (this.decisionTimer > this.decisionInterval) {
        this.decisionTimer = 0
        this.path.push(this.pos)
        this.dx = getRandomVec() * 2
        this.dy = getRandomVec() * 2
    }
    this.pos.x += this.dx
    this.pos.y += this.dy
}

Agent.prototype.draw = function () {
    this.game.ctx.fillStyle = "#FFFFFF";
    this.game.ctx.fillRect(this.pos.x, this.pos.y, 15, 15)
}

window.onload = function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    var agent = new Agent(gameEngine)
    gameEngine.addEntity(agent)
    console.log("All Done!");
}

function getRandomVec() {
    var dx = Math.random() - 0.5
    var dy = Math.random() - 0.5
    var magnitude = Math.sqrt(dx * dx + dy * dy)
    return {
        dx: dx / magnitude,
        dy: dy / magnitude
    }
}
