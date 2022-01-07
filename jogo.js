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





const loop = () => {
    background.draw.call(background)
    floor.draw.call(floor)
    flappyBird.draw.call(flappyBird)


    requestAnimationFrame(loop)
}

loop()