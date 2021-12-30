document.addEventListener('DOMContentLoaded', ()=>{


    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const DisplayScores = document.querySelector('#score')
    const ButtonIsHere =  document.querySelector('#start-button')
    const width = 10
    let timerId
    let nextRandom = 0
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    

//the tetrominoes
const Ltetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]
        
const Ztetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
]

const Ttetromino = [
    [1,width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1],
]

const Otetromino = [
    [0,1, width, width+1],
    [0,1,width, width+1],
    [0,1, width, width+1],
    [0, 1, width, width+1]
]

const Itetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
]

const TotalTetrominoes = [Ltetromino, Ztetromino, Ttetromino, Otetromino, Itetromino ]

let currentPosition = 4
let currentRotation = 0
 //lets assume the first square of our chosen tetrominoes first rotation array is going to start at the index 4 //
//randomly select a tetromino and it's first rotation
let random = Math.floor(Math.random()*TotalTetrominoes.length)
let current = TotalTetrominoes[random][currentRotation]// it indicates the first index of of thefirst array that is first index( first_rotation) of L tetromino

//draw the first rotation in the first tetromino
function draw(){
    current.forEach(index=>{
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}

//undraw the tetrominoes

function undraw(){
    current.forEach(index=>{
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor=''
    })
}

//make the tetromino move down every millisecond
//timerId= setInterval(moveDown, 1000)

//assign functions to key codes
function control(e){
    if(e.keyCode ===37){
        moveLeft()
    }else if(e.keyCode ===38){
        rotate()
    } else if (e.keyCode ===39){
        moveRight()
    } else if (e.keyCode === 40){
        moveDown()
    }
}
document.addEventListener('keyup', control)
//movedown function
function moveDown(){
undraw()
currentPosition+= width
draw()
freeze()
}

//we need a freeze function otherwise the tetris shape won't freeze on the bottom of the screen and go beyond, disappear
function freeze(){
   if(current.some(index=>squares[currentPosition+index+width].classList.contains('taken'))){
       current.forEach(index=>squares[currentPosition + index].classList.add('taken'))
        random = nextRandom
       //, euta naya tetromino lai khasauna paryo
      nextRandom = Math.floor(Math.random()*TotalTetrominoes.length)
       current = TotalTetrominoes[random][currentRotation]
       currentPosition = 4
       draw()
       displayShape()
       addScore()
       gameOver()
   }
}

//move the tetromino to the left,  unless it is at the edge or there is a blokage
function moveLeft(){
    undraw() //we start by removing any trace of the shape in it's current location before we start, we are looking for a clean slate
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width===0)

    if(!isAtLeftEdge) currentPosition -=1 // we want to stop if we are at the left edge  

        //we want our tetromino to stop if there is already another tetromino there 
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition +=1
        
    }
    draw()
    
}

//move the tetromino to the right unless there is a blockage or the shape is at the edge of the board

function moveRight(){
    undraw()
    const isAtRightEdge = current.some(index=>(currentPosition + index)% width === width - 1)

    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -=1
    }

    draw()
}
//rotate the tetromino
function rotate(){
   undraw()
    currentRotation ++
    if(currentRotation === current.length){ //if the current rotation gets to 4, make it go back to 0
        currentRotation = 0
    }
    current = TotalTetrominoes[random][currentRotation]
    draw()
}   

//show up the next tetromino in mini-grid

const displaysquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0


//the tetrominoes without rotation
const upNextTetromino = [
    [1, displayWidth+1, displayWidth*2+1, 2], //l tetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1 ], //z tetromino
    [1, displayWidth, displayWidth+1, displayWidth+2] , //t tetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //itetromino

]

// display the shape  in the mini-grid display
function displayShape(){
    //remove any trace of a tetromino from the entire grid  
    displaysquares.forEach(square=>{
        square.classList.remove('tetromino')
        square.style.backgroundColor=''
    })

    upNextTetromino[nextRandom].forEach( index =>{
        displaysquares[displayIndex + index].classList.add('tetromino')
        displaysquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

//add functionality to the button
ButtonIsHere.addEventListener('click', ()=>{
    if(timerId){
        clearInterval(timerId)
        timerId = null
    } else{
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*TotalTetrominoes.length)
        displayShape()
    }
})

//add score
function addScore(){
    for(let i = 0; i<199; i+=width){
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index=> squares[index].classList.contains('taken'))){
            score+=10
            DisplayScores.innerHTML = score
            row.forEach(index=>{
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''           
             })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell=> grid.appendChild(cell))
        }

    }
}
//game over 
function gameOver(){
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        DisplayScores.innerHTML = 'end'
        clearInterval(timerId)
    }
}

})