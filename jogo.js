console.log('Jogo iniciado - Flappy Bird - Joabe Chaves')

const sprites = new Image()
sprites.src = './sprites.png'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')


const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    gravity: 0.25,
    speed: 0,
    update() {
        this.speed += this.gravity
        this.y += this.speed
    },
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
        )
    }
}

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
        )

        context.drawImage(
            sprites,
            this.spriteX, // Sprite X
            this.spriteY, // Sprite Y
            this.width, // Tamanho no recorte da Sprite
            this.height, // Tamanho do recorte da Sprite
            (this.x + this.width), // localizaçao no eixo X
            this.y, // localizaçao no eixo y
            this.width,
            this.height
        )
    }
}

const background = {
    spriteX: 390,
    spriteY: 0,
    width: 276,
    height: 204,
    x: 0,
    y: canvas.height - 204,
    draw() {
        context.fillStyle = '#70c5ce'
        context.fillRect(0, 0, canvas.width, canvas.height)
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
        )

        context.drawImage(
            sprites,
            this.spriteX, // Sprite X
            this.spriteY, // Sprite Y
            this.width, // Tamanho no recorte da Sprite
            this.height, // Tamanho do recorte da Sprite
            (this.x + this.width), // localizaçao no eixo X
            this.y, // localizaçao no eixo y
            this.width,
            this.height
        )
    }
}

const getReady = {
    spriteX: 136,
    spriteY: 0,
    width: 170,
    height: 152,
    x: (canvas.width / 2) - 170 / 2,
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
        )
    }
}

let activeScreen = {}

const changeScreen = (newScreen) => {
    activeScreen = newScreen
}

const GAME_SCREENS = {
    INITIAL: {
        draw() {
            background.draw.call(background)
            floor.draw.call(floor)
            flappyBird.draw.call(flappyBird)
            getReady.draw.call(getReady)
        },
        update() { },
        click() {
            changeScreen(GAME_SCREENS.GAME)
        }
    },
    GAME: {
        draw() {
            background.draw.call(background)
            floor.draw.call(floor)
            flappyBird.draw.call(flappyBird)
        },
        update() {
            flappyBird.update.call(flappyBird)
        }
    }
}


const loop = () => {


    activeScreen.draw()
    activeScreen.update()
    requestAnimationFrame(loop)
}

window.addEventListener('click', () => {
    if (activeScreen.click) {
        activeScreen.click()
    }
})

changeScreen(GAME_SCREENS.INITIAL)
loop()