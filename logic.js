let noiseScale;
let grid;
let balls;

let img;

function setup(){
    createCanvas(1600, 800);
    const diag = mag(width, height)/2;
    noiseDetail(8);
    noiseScale = 0.01;
    grid = new Array(height).fill().map((_, y) => new Array(width).fill().map((_, x) => round(map(noise(x*noiseScale, y*noiseScale), 0, 1, 0, 255))));
    grid2 = new Array(height).fill().map((_, y) => new Array(width).fill().map((_, x) => {
        const Az = (x+1 < width)? grid[y][x+1]: grid[y][x];
        const Bz = (y+1 < height)? grid[y+1][x]: grid[y][x];
        const Cz = (x-1 >= 0)? grid[y][x-1]: grid[y][x];
        const Dz = (y-1 >= 0)? grid[y-1][x]: grid[y][x];
        return createVector(Cz-Az, Dz-Bz).rotate(PI/2).normalize().mult(1/2);
    }));

    balls = new Array(250).fill().map(() => {
        ball = randomBall();
        return ball;
    });
    background(0);
}

function draw(){
    background(0,8);
    balls.forEach(ball => {
        ball.a = grid2[round(ball.pos.y)][round(ball.pos.x)];
        ball.v.limit(1);
        ball.move();
        ball.draw();
        if(round(ball.pos.x) < 0 || round(ball.pos.x) >= width || round(ball.pos.y) < 0 || round(ball.pos.y) >= height){
            ball.pos = createVector(floor(random(1, width-1)), floor(random(1, height-1)));
        }
    });
}