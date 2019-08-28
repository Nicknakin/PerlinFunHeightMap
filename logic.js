let noiseScale;
let grid;
let balls;

let img;

function setup(){
    createCanvas(1600, 800);
    const diag = mag(width, height)/2;
    noiseDetail(8);
    noiseScale = 0.01;
    grid = new Array(height).fill().map((_, y) => new Array(width).fill().map((_, x) => map(noise(x*noiseScale, y*noiseScale)/*(diag-mag(x-width/2, y-height/2))/diag*/, 0, 1, 0, 255)));
    grid2 = new Array(height).fill().map((_, y) => new Array(width).fill().map((_, x) => {
        const Az = (x+1 < width)? grid[y][x+1]: grid[y][x];
        const Bz = (y+1 < height)? grid[y+1][x]: grid[y][x];
        const Cz = (x-1 >= 0)? grid[y][x-1]: grid[y][x];
        const Dz = (y-1 >= 0)? grid[y-1][x]: grid[y][x];
        return createVector(Cz-Az, Dz-Bz).rotate(PI/2).normalize();
    }));

    balls = new Array(250).fill().map(() => {
        ball = randomBall();
        return ball;
    });

    img = createGraphics(width, height);
    background(0);
    
    img.noStroke();
    for(y = 0; y < height; y++){
        for(x = 0; x < width; x++){
            img.fill(grid[y][x]);
            img.rect(x, y, 1, 1);
        }
    }
    
}

function draw(){
    image(img, 0, 0, width, height);
    balls.forEach(ball => {
        if(round(ball.pos.x) < width && round(ball.pos.y) < height)
        ball.v = grid2[round(ball.pos.y)][round(ball.pos.x)];
        ball.move();
        ball.draw();
        if(ball.pos.x < 0 || ball.pos.x >= width || ball.pos.y < 0 || ball.pos.y >= height){
            ball.pos = createVector(floor(random(width-1)), floor(random(height-1)));
        }
    });
}