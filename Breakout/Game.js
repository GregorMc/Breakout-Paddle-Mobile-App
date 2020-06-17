var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.canvas.width  = window.innerWidth - (window.innerWidth*0.05);
ctx.canvas.height = window.innerHeight - (window.innerHeight*0.1);

var paddleWidth = 75,
    paddleHeight = 10,
    paddleX =  (canvas.width-paddleWidth)/2;

var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height/2;

var dx = 1.5


;
var dy = -1.5;

var lives = 3;

var brickRowCount = 4,
    brickColumnCount = 13,
    brickWidth = canvas.width/14,
    brickHeight = 10,
    brickPadding = (brickWidth)/14,
    brickOffsetTop = brickPadding,
    brickOffsetLeft = brickPadding;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


if(window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function(event) {
        var g = event.gamma;
        draw(g);
    });
}


function drawPaddle() {
        ctx.beginPath();
        ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0080ff";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#ff6600";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                }
            }
        }
    }
}

function draw(g) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    drawBricks();
    collisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > (canvas.height-ballRadius)-ballRadius)  {
        if (x > paddleX + 10 && x < paddleX + paddleWidth) {
            dy = -dy;
        } else if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
            dy = -dy;
            lives -= 1;
        }else if (lives == 0) {
            lives = 3;
            alert("GAME OVER, CLICK TO RESTART");
            document.location.refresh();
        }
    }


    if (Math.round(g) < 0 && (paddleX > 0)){
        paddleX = paddleX - 4;
    } else if (Math.round(g) > 0 && paddleX < (canvas.width - paddleWidth)){
        paddleX = paddleX + 4;
    }

    x += dx;
    y += dy;
    document.getElementById("lives").innerHTML = "Lives remaining: " + lives;

}

setInterval(draw, 10);