console.log('Jogo iniciado - Flappy Bird - Joabe Chaves')

let frames = 0

const HIT_sound = new Audio()
HIT_sound.src = './effects/hit.wav'


const sprites = new Image()
sprites.src = './sprites.png'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const makeColision = (flappyBird, floor) => {
    const flappyY = flappyBird.y

    if (flappyY >= floor.y - flappyBird.height) {
        return true
    }

    return false
}

const createFlappyBird = () => {

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
            const frameInterval = 10
            const isBiggerThanInterval = frames % frameInterval
            if (isBiggerThanInterval === 0) {
                const base_increment = 1
                const increment = base_increment + this.frame
                const repeatBase = this.movements.length

                this.frame = increment % repeatBase
            }

        },
        jump() {
            this.speed = - this.jumpValue
        },
        update() {
            if (makeColision(globals.flappyBird, globals.floor)) {
                console.log('fez colisao')
                HIT_sound.play()
                setTimeout(() => {
                    changeScreen(GAME_SCREENS.INITIAL)
                }, 500)
                return
            }
            this.speed += this.gravity
            this.y += this.speed
        },
        draw() {
            this.updateFrame()
            const { spriteX, spriteY } = this.movements[this.frame]
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
            )
        }
    }

    return flappyBird
}

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
        },
        update() {
            const floorMovement = 1
            const repeatOn = this.width / 2
            const movement = this.x - floorMovement
            this.x = movement % repeatOn
        }
    }
    return floor
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

    if (activeScreen.init) {
        activeScreen.init()
    }
}

const globals = {
    flaapyBird: {},
    floor: {}
}

const GAME_SCREENS = {
    INITIAL: {
        init() {
            globals.flappyBird = createFlappyBird()
            globals.floor = createFloor()
        },
        draw() {
            background.draw.call(background)
            globals.floor.draw.call(globals.floor)
            globals.flappyBird.draw.call(globals.flappyBird)
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
            globals.floor.draw.call(globals.floor)
            globals.flappyBird.draw.call(globals.flappyBird)
        },
        update() {
            globals.flappyBird.update.call(globals.flappyBird)
            globals.floor.update()
        },
        click() {
            globals.flappyBird.jump()
        }
    }
}


const loop = () => {


    activeScreen.draw()
    activeScreen.update()
    frames += 1
    requestAnimationFrame(loop)
}

window.addEventListener('click', () => {
    if (activeScreen.click) {
        activeScreen.click()
    }
})

changeScreen(GAME_SCREENS.INITIAL)
loop()