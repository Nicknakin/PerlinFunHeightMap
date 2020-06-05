let noiseScale;
let grid;
let balls;

const gridSize = 16;

let img;

function setup(){
    //1440x2560
    createCanvas(windowWidth, windowHeight);
    const diag = mag(width, height)/2;
    noiseDetail(8);
    noiseScale = 0.01;
    let theta = radians(0);
    grid = new Array(height).fill().map((_, y) => new Array(width).fill().map((_, x) => {
        theta = 45; //map(cos(map(x/width, 0, 1, 0, TWO_PI)), -1, 1, 0, PI/4); //mag(x-(width/2), y-(height/2))/mag(width/2, height/2)*PI/8;
        return map(cos((x*cos(theta)-y*sin(theta))/height*TWO_PI*gridSize)*sin((x*sin(theta)+y*cos(theta))/height*TWO_PI*gridSize), -1, 1, 0, 255)
    }));
    grid2 = new Array(height).fill().map((_, y) => new Array(width).fill().map((_, x) => {
        const Az = (x+1 < width)? grid[y][x+1]: grid[y][x];
        const Bz = (y+1 < height)? grid[y+1][x]: grid[y][x];
        const Cz = (x-1 >= 0)? grid[y][x-1]: grid[y][x];
        const Dz = (y-1 >= 0)? grid[y-1][x]: grid[y][x];
        return createVector(Cz-Az, Dz-Bz).rotate(PI/2-radians(2)).normalize();
    }));

    img = createGraphics(width, height);
    img.noStroke();
    for(y = 0; y < height; y+=4){
        for(x = 0; x < width; x+=4){
            img.fill(grid[y][x]);
            img.rect(x, y, 4, 4);
        }
    }

    const numBalls = 1000;
    balls = new Array(numBalls).fill().map((_, it) => {
        ball = randomBall();
        const pos = width*height/numBalls*it;
        ball.pos = createVector(pos%width, floor(pos/width));
        return ball;
    });
    background(0);
    // image(img, 0, 0, width, height);

}

function draw(){
    balls.forEach(ball => {
        ball.v = grid2[round(ball.pos.y)][round(ball.pos.x)];
        //ball.v.limit(1);
        ball.move();
        ball.draw();
        if(round(ball.pos.x) < 0 || round(ball.pos.x) >= width || round(ball.pos.y) < 0 || round(ball.pos.y) >= height){
            ball.pos = createVector(floor(random(1, width-1)), floor(random(1, height-1)));
        }
    });
}

function mouseClicked(){
    balls.push(new Ball(mouseX, mouseY, {r:255, g:128, b:255}));
}