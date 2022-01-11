console.log("Jogo iniciado - Flappy Bird - Joabe Chaves");

let frames = 0;

// =========== SFX ===========

const HIT_sound = new Audio();
HIT_sound.src = "./src/effects/hit.wav";

// =========== Game Usefull ===========

const sprites = new Image();
sprites.src = "./src/assets/sprites.png";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const storage = sessionStorage;

// =========== Game Components ===========

const createFlappyBird = () => {
  const makeColision = (flappyBird, floor) => {
    if (flappyBird.y >= floor.y - flappyBird.height) {
      return true;
    }

    return false;
  };

  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    gravity: 0.25,
    speed: 0,
    jumpValue: 4.6,
    movements: [
      { spriteX: 0, spriteY: 0 }, // asa para cima
      { spriteX: 0, spriteY: 26 }, // asa no meio
      { spriteX: 0, spriteY: 52 }, // asa para baixo
    ],
    frame: 0,
    updateFrame() {
      const frameInterval = 10;
      const isBiggerThanInterval = frames % frameInterval;
      if (isBiggerThanInterval === 0) {
        const base_increment = 1;
        const increment = base_increment + this.frame;
        const repeatBase = this.movements.length;

        this.frame = increment % repeatBase;
      }
    },
    jump() {
      this.speed = -this.jumpValue;
    },
    update() {
      if (makeColision(globals.flappyBird, globals.floor)) {
        console.log("fez colisao");
        HIT_sound.play();
        setTimeout(() => {
          changeScreen(GAME_SCREENS.GAME_OVER);
        }, 500);
        return;
      }
      this.speed += this.gravity;
      this.y += this.speed;
    },
    draw() {
      this.updateFrame();
      const { spriteX, spriteY } = this.movements[this.frame];
      context.drawImage(
        sprites,
        spriteX, // Sprite X
        spriteY, // Sprite Y
        this.width, // Tamanho no recorte da Sprite
        this.height, // Tamanho do recorte da Sprite
        this.x, // localizaçao no eixo X
        this.y, // localizaçao no eixo y
        this.width,
        this.height
      );
    },
  };

  return flappyBird;
};

const createFloor = () => {
  const floor = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    draw() {
      context.drawImage(
        sprites,
        this.spriteX, // Sprite X
        this.spriteY, // Sprite Y
        this.width, // Tamanho no recorte da Sprite
        this.height, // Tamanho do recorte da Sprite
        this.x, // localizaçao no eixo X
        this.y, // localizaçao no eixo y
        this.width,
        this.height
      );

      context.drawImage(
        sprites,
        this.spriteX, // Sprite X
        this.spriteY, // Sprite Y
        this.width, // Tamanho no recorte da Sprite
        this.height, // Tamanho do recorte da Sprite
        this.x + this.width, // localizaçao no eixo X
        this.y, // localizaçao no eixo y
        this.width,
        this.height
      );
    },
    update() {
      const floorMovement = 1;
      const repeatOn = this.width / 2;
      const movement = this.x - floorMovement;
      this.x = movement % repeatOn;
    },
  };
  return floor;
};

const background = {
  spriteX: 390,
  spriteY: 0,
  width: 276,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw() {
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      sprites,
      this.spriteX, // Sprite X
      this.spriteY, // Sprite Y
      this.width, // Tamanho no recorte da Sprite
      this.height, // Tamanho do recorte da Sprite
      this.x, // localizaçao no eixo X
      this.y, // localizaçao no eixo y
      this.width,
      this.height
    );

    context.drawImage(
      sprites,
      this.spriteX, // Sprite X
      this.spriteY, // Sprite Y
      this.width, // Tamanho no recorte da Sprite
      this.height, // Tamanho do recorte da Sprite
      this.x + this.width, // localizaçao no eixo X
      this.y, // localizaçao no eixo y
      this.width,
      this.height
    );
  },
};

const getReady = {
  spriteX: 134,
  spriteY: 0,
  width: 174,
  height: 152,
  x: canvas.width / 2 - 170 / 2,
  y: 100,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX, // Sprite X
      this.spriteY, // Sprite Y
      this.width, // Tamanho no recorte da Sprite
      this.height, // Tamanho do recorte da Sprite
      this.x, // localizaçao no eixo X
      this.y, // localizaçao no eixo y
      this.width,
      this.height
    );
  },
};

const createPipes = () => {
  const pipe = {
    width: 52,
    height: 400,
    sky: {
      spriteX: 52,
      spriteY: 169,
    },
    floor: {
      spriteX: 0,
      spriteY: 169,
    },
    spaceBetween: 40,
    pairs: [],
    pipeColision(pipe, flappyBird) {
      const flappyHead = flappyBird.y + 5;
      const flappyFeet = flappyBird.y + flappyBird.height - 5;
      if (flappyBird.x + flappyBird.width - 5 >= pipe.x) {
        if (flappyHead <= pipe.skyPipe.y) {
          return true;
        }
        if (flappyFeet >= pipe.floorPipe.y) {
          return true;
        }
      }
      return false;
    },
    draw() {
      this.pairs.forEach((pair) => {
        const yRandom = pair.y;
        const pipesSpacement = 80;

        const skyPipeX = pair.x;
        const skyPipeY = yRandom;
        // Sky Pipe
        context.drawImage(
          sprites,
          this.sky.spriteX, // Sprite X
          this.sky.spriteY, // Sprite Y
          this.width, // Tamanho no recorte da Sprite
          this.height, // Tamanho do recorte da Sprite
          skyPipeX, // localizaçao no eixo X
          skyPipeY, // localizaçao no eixo y
          this.width,
          this.height
        );

        // Floor Pipe
        const floorPipeX = pair.x;
        const floorPipeY = this.height + pipesSpacement + yRandom;
        context.drawImage(
          sprites,
          this.floor.spriteX, // Sprite X
          this.floor.spriteY, // Sprite Y
          this.width, // Tamanho no recorte da Sprite
          this.height, // Tamanho do recorte da Sprite
          floorPipeX, // localizaçao no eixo X
          floorPipeY, // localizaçao no eixo y
          this.width,
          this.height
        );

        pair.skyPipe = {
          x: skyPipeX,
          y: this.height + skyPipeY,
        };

        pair.floorPipe = {
          x: floorPipeX,
          y: floorPipeY,
        };
      });
    },
    update() {
      const hundredFramesPassed = frames % 100 === 0;
      if (hundredFramesPassed) {
        this.pairs.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      this.pairs.forEach((pair) => {
        pair.x += -2;

        if (this.pipeColision(pair, globals.flappyBird)) {
          HIT_sound.play();
          changeScreen(GAME_SCREENS.GAME_OVER);
        }

        if (pair.x <= 0 - this.width) {
          this.pairs.shift();
        }
      });
    },
  };

  return pipe;
};

const gameOver = {
  spriteX: 134,
  spriteY: 152,
  width: 226,
  height: 200,
  x: canvas.width / 2 - 226 / 2,
  y: 100,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX, // Sprite X
      this.spriteY, // Sprite Y
      this.width, // Tamanho no recorte da Sprite
      this.height, // Tamanho do recorte da Sprite
      this.x, // localizaçao no eixo X
      this.y, // localizaçao no eixo y
      this.width,
      this.height
    );
  },
};

const createPoints = () => {
  const points = {
    points: 0,
    spriteX: 134,
    spriteY: 155,
    width: 226,
    height: 198,
    x: canvas.width / 2 - 198 / 2,
    y: 100,
    bestScore: storage.getItem("bestScore") || 0,
    medalName: "silver",
    draw() {
      context.font = "35px 'VT323";
      context.textAlign = "right";
      context.fillStyle = "white";
      context.fillText(`${this.points}`, canvas.width - 35, 30);
    },
    update() {
      const baseFramesPassed = 50;
      const FramesPassed = frames % baseFramesPassed === 0;
      if (FramesPassed) {
        this.points += 1;
        if (this.points > this.bestScore) {
          this.bestScore = this.points;
          this.medalName = "gold";
          storage.setItem("bestScore", this.bestScore);
        }
      }
    },
  };

  return points;
};

const createGameOverScore = () => {
  const gameOverScore = {
    points: 0,
    draw() {
      context.font = "30px 'VT323";
      context.fillStyle = "white";
      context.textAlign = "right";
      context.fillText(`${this.points}`, canvas.width - 70, 196);
    },
    update() {
      this.points = globals.points.points;
    },
  };
  return gameOverScore;
};

const createGameOverBestScore = () => {
  const gameOverBestScore = {
    bestScore: 0,
    draw() {
      context.font = "30px 'VT323";
      context.fillStyle = "white";
      context.textAlign = "right";
      context.fillText(`${this.bestScore}`, canvas.width - 70, 240);
    },
    update() {
      this.bestScore = globals.points.bestScore;
    },
  };
  return gameOverBestScore;
};

const medal = {
  medals: {
    gold: {
      spriteX: 0,
      spriteY: 124,
    },
    silver: {
      spriteX: 0,
      spriteY: 78,
    },
  },
  spriteX: 0,
  spriteY: 124,
  width: 44,
  height: 44,
  x: 73,
  y: 188,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX, // Sprite X
      this.spriteY, // Sprite Y
      this.width, // Tamanho no recorte da Sprite
      this.height, // Tamanho do recorte da Sprite
      this.x, // localizaçao no eixo X
      this.y, // localizaçao no eixo y
      this.width,
      this.height
    );
  },
  update() {
    this.spriteX = this.medals[globals.points.medalName].spriteX;
    this.spriteY = this.medals[globals.points.medalName].spriteY;
  },
};

// =========== Functions and globals ===========

let activeScreen = {};

const changeScreen = (newScreen) => {
  activeScreen = newScreen;

  if (activeScreen.init) {
    activeScreen.init();
  }
};

const globals = {
  flappyBird: {},
  floor: {},
  pipes: {},
  points: {},
  gameOverScore: {},
  bestScore: 0,
};

// =========== Game Screens ===========

const GAME_SCREENS = {
  INITIAL: {
    init() {
      globals.flappyBird = createFlappyBird();
      globals.floor = createFloor();
      globals.pipes = createPipes();
    },
    draw() {
      background.draw.call(background);
      globals.flappyBird.draw.call(globals.flappyBird);
      getReady.draw.call(getReady);
      globals.pipes.draw.call(globals.pipes);
      globals.floor.draw.call(globals.floor);
    },
    update() {},
    click() {
      changeScreen(GAME_SCREENS.GAME);
    },
  },
  GAME: {
    init() {
      globals.points = createPoints();
      globals.gameOverScore = createGameOverScore();
      globals.bestScore = createGameOverBestScore();
    },
    draw() {
      background.draw.call(background);
      globals.pipes.draw.call(globals.pipes);
      globals.floor.draw.call(globals.floor);
      globals.flappyBird.draw.call(globals.flappyBird);
      globals.points.draw.call(globals.points);
    },
    update() {
      globals.flappyBird.update.call(globals.flappyBird);
      globals.pipes.update();
      globals.floor.update();
      globals.points.update();
      medal.update();
      globals.gameOverScore.update();
      globals.bestScore.update();
    },
    click() {
      globals.flappyBird.jump();
    },
  },
  GAME_OVER: {
    init() {},
    draw() {
      gameOver.draw.call(gameOver);
      globals.gameOverScore.draw.call(globals.gameOverScore);
      medal.draw.call(medal);
      globals.bestScore.draw.call(globals.bestScore);
    },
    update() {},
    click() {
      changeScreen(GAME_SCREENS.INITIAL);
    },
  },
};

// =========== Main Game loaders ===========

const loop = () => {
  activeScreen.draw();
  activeScreen.update();
  frames += 1;
  requestAnimationFrame(loop);
};

window.addEventListener("click", () => {
  if (activeScreen.click) {
    activeScreen.click();
  }
});

changeScreen(GAME_SCREENS.INITIAL);
loop();
