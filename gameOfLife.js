const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const res = 9
let rows = Math.floor(canvas.height/ res)
let cols = Math.floor(canvas.width / res)

let cellWidth = canvas.width/cols
let cellHeight = canvas.height/rows

let iteration = 0

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    rows = Math.floor(canvas.height/ res)
    cols = Math.floor(canvas.width / res)
    init()
    setAlive(grid)
})

class Cell {
    constructor(x, y, width, height, isAlive) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.isAlive = isAlive
        
    }
    
    setStatus(liveStat) {
        this.isAlive = liveStat
    }
    draw(liveNeighbors, i, j) {
        if (liveNeighbors > 0) {
            let filStyle = c.createRadialGradient(this.x+(this.width/2), this.y+(this.height/2), 22, 
                                                  this.x+(this.width/2), this.y+(this.height/2), 40)
            if (liveNeighbors >= 3) {    
                filStyle.addColorStop(0, `rgba(0,255,255,0.5)`)
                filStyle.addColorStop(1, `rgba(0,255,255,0)`)
                c.lineWidth = 3
                c.strokeStyle = `rgba(0,255,255,0.3)`
                c.fillStyle = filStyle
            }
            else {
                filStyle.addColorStop(0, `rgba(0,255,255,1)`)
                filStyle.addColorStop(1, `rgba(0,255,255,0)`)
                c.lineWidth = 3
                c.strokeStyle = `rgba(0,255,255,0.6)`
                c.fillStyle = filStyle
            }
            c.strokeRect(this.x+3,this.y+3,this.width-6,this.height-6)
            c.fillRect(this.x+5,this.y+5,this.width-10,this.height-10)
        }
        else {  // dead cell is just black
            c.fillStyle = 'black'
            c.fillRect(this.x,this.y,this.width,this.height)
        }
    }
}

// 2d array
let grid;
function init() {
    grid = new Array(cols)
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows)
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i*cellWidth+i,j*cellHeight+j,cellWidth,cellHeight, false)
        }
    }
}

function showGrid() {
    c.clearRect(0,0,canvas.width,canvas.height)
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let liveNeighbors = findLiveNeighbors(grid, i, j)

            grid[i][j].draw(liveNeighbors, i, j)
        }
    }
}

function nextGen(grd, rws, cls) {
    iteration++;
    let future = new Array(cls)
    for (let i = 0; i < cls; i++) {
        future[i] = new Array(rws)
        for (let j = 0; j < rws; j++) {
            let aliveNeighbors = findLiveNeighbors(grd, i, j)

            if (grd[i][j].isAlive && aliveNeighbors < 2) {
                future[i][j] = new Cell(i*cellWidth+i,j*cellHeight+j,cellWidth,cellHeight, false)
            }
            else if (grd[i][j].isAlive && aliveNeighbors > 3) {
                future[i][j] = new Cell(i*cellWidth+i,j*cellHeight+j,cellWidth,cellHeight, false)
            }
            else if (grd[i][j].isAlive == false && aliveNeighbors == 3) {
                future[i][j] = new Cell(i*cellWidth+i,j*cellHeight+j,cellWidth,cellHeight, true)
            }
            else {
                future[i][j] = grid[i][j]
            }
        }
    }
    grid = future
    showGrid()
}

function findLiveNeighbors(grd, i, j) {
    let rowLim = grd.length-1
    let colLim = grd[0].length-1
    let live = 0;
    for (let x = Math.max(0,i-1);x <= Math.min(i+1, rowLim);x++){
        for (let y = Math.max(0,j-1);y <= Math.min(j+1, colLim);y++){
            if ((x === i) && (y === j)) {
                live += 0
            }
            else {
                live += grid[x][y].isAlive
            }   
        }
    }
    return live;
}

function create10CellRow(grid) { //for testing
    for (let i = 0; i < 10; i++) {
        grid[10+i][10].setStatus(true);
    }
}

function setAlive(grid) {
    // beginning point
    let x = Math.floor(cols/2) + 5
    let y = Math.floor(rows/2) - 3
    grid[x][y].setStatus(true)
    grid[x-23][y].setStatus(true)
    for (let i = 1; i <= 7; i++) {  // 7 next to first 
        grid[x+i][y].setStatus(true)
        grid[x-31+i][y].setStatus(true)
        grid[x+25+i][y].setStatus(true)
        grid[x-56+i][y].setStatus(true)
    }
    for (let i = 1; i <= 5; i++) {  // 5 
        grid[x+8+i][y].setStatus(true)
        grid[x-37+i][y].setStatus(true)
        grid[x+33+i][y].setStatus(true)
        grid[x-62+i][y].setStatus(true)
    }
    for (let i = 1; i <= 3; i++) {  // 3
        grid[x+16+i][y].setStatus(true)
        grid[x-43+i][y].setStatus(true)
    }
}

let stop = false;
let frameCount = 0;
let fps, fpsInterval, startTime, now, then, elapsed

function startAnimation(fps) {
    fpsInterval = 1000/fps
    then = Date.now()
    startTime = then
    animate()
}

function animate() {
    requestAnimationFrame(animate)
    showGrid()
    now = Date.now()
    elapsed = now - then
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval)
        nextGen(grid, rows, cols)
    }
    if (iteration == 870) {
        init()
        setAlive(grid)
        iteration = 0
    }
}

init()
setAlive(grid)
startAnimation(60)