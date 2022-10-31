/* global context, canvas*/

$(document).ready(function(){
    for(var i=1;i<=10;i++){
//        localStorage.setItem(i,"1");
        $("#n"+i).text(localStorage.getItem(i));
    }
    sort();
    $("#set").hide();
    $("#rate").hide();
    $("#buttons").hide();
    $("#playstop").hide();
    $("#endgame").hide();
    canvas = $("#pingpong");
    speed = 0;
    context = $("#pingpong")[0].getContext("2d");
    count = 0;
    current = 0;
    Speed1 = 1.5;
    Speed2 = 5;
    user = {
        x: 5,
        y: canvas.height() / 2 - 50,
        width: 15,
        height: 100,
        color: "white",
        score: 0,
        uname: "Stranger"
    };
    computer = {
        x: canvas.width() - 20,
        y: canvas.height() / 2 - 50,
        width: 15,
        height: 100,
        color: "white",
        score: 0,
        speed: 10
    };
    ball = {
        x: canvas.width() / 2,
        y: canvas.height() / 2,
        width: 10,
        height: 60,
        radius: 20,
        color: "white",
        stepX: 6,
        stepY: 0,
        speed: 6
    };
    line = {
        x: canvas.width() / 2 - 2.5,
        width: 5,
        height: 15,
        color: "white"
    };
    
    $("#start").click(function(){
        $(".control").hide();
        $("#set").show();  
        $("#playstop").show().html("Назад");
    });
    $("#startgame").click(function(){
        $("#set").hide();
        $("#playstop").show().html("Стоп");
        if(!$("#nam").val() == "")
            user.uname = $("#nam").val();
      
        if(!$("#num").val() == "")
            count = $("#num").val();
        else count = 3;
        canvas.on("mousemove", changePos);
        setInterval(play, 20);
        $("#endgame").show();
    });
    $("#rating").click(function(){
        $(".control").hide();
        $("#rate").show();
        $("#playstop").show().html("Назад");
    });
    $("#playstop").click(resumeorstop);
    $("#endgame").click(winner);
});

function drawRectangle(x, y, width, height, color){
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fill();
    context.closePath();
}

function drawScore(text, x, y, color){
    context.fillStyle = color;
    context.font = "40px arial";
    context.fillText(text, x, y);
}

function drawLine(){
    for(var i=5; i<canvas.height(); i+=25)
        drawRectangle(line.x, i, line.width, line.height, line.color);
    
}
function initialization(){
    drawRectangle(0, 0, canvas.width(), canvas.height(), "BLACK");
    
    drawRectangle(user.x, user.y, user.width, user.height, user.color);
    drawRectangle(computer.x, computer.y, computer.width, computer.height, computer.color);
    
    drawScore(user.score, canvas.width() / 4, canvas.height() / 5, "white");
    drawScore(computer.score, canvas.width() * 3 / 4, canvas.height() / 5, "white");
    
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    drawLine();
}

function play(){
    if(current === 0){
    initialization();
   
    refreshPosition();
    physics();
    }
}
function refreshPosition(){
    ball.x += ball.stepX;
    ball.y += ball.stepY;

//    var n = (this.y - computer.y/2) / (computer.y );
//    Intelligence = 0.25 * Math.PI * (2*n - 1);
//    computer.y = (ball.y - computer.height/2) * Intelligence;
    if(computer.y > ball.y - (computer.height / 2)){
        if(dir === 1) computer.y -= computer.speed/Speed1;
        else computer.y -= computer.speed/Speed2;
    }
    if(computer.y < ball.y - (computer.height / 2)){
        if(dir === 1) computer.y += computer.speed/Speed1;
        else computer.y += computer.speed/Speed2;
    }
    
}

function physics(){
    if(ball.y + ball.radius  > canvas.height() || ball.y - ball.radius < 0)
        ball.stepY = -ball.stepY;
    if(ball.x < canvas.width() / 2){
        player = user;
        dir = 1;
    }
    else{
        player = computer;
        dir = -1;
    }
    
    if(isCollision(ball, player)){
        var point = (ball.y - (player.y + player.height)) / (player.height / 2);
        var angle = point * Math.PI/4;
        ball.stepX = dir * ball.speed * Math.cos(angle);
        ball.stepY = ball.speed * Math.sin(angle);
        ball.speed += 1;
        
    }
    if(ball.x - ball.radius < 0){
        computer.score++;
        if(computer.score >= count || user.score >= count)
            winner();
        else
            reset();
    }
    if(ball.x + ball.radius > canvas.width()){
        user.score++;
        computer.speed += 4;
        if(computer.score >= count || user.score >= count)
            winner();
        else
            reset();
    }
    
} 
function changePos(event){
    user.y = event.clientY - user.height / 2 - 80;
}

function isCollision(ball, player){
    ball.top = ball.y - ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;
    ball.bottom = ball.y + ball.radius;
    
    player.top = player.y;
    player.left = player.x;
    player.right = player.x + player.width;
    player.bottom = player.y + player.height;
    
    return player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top;
    
}
function reset(){
    ball.x = canvas.width() / 2;
    ball.y = canvas.height() / 2;
    ball.stepX = -ball.stepX;
    ball.speed = 6;
    ball.stepY = 0;
}
function stopGame(){
    speed = ball.speed;
    ball.speed = 0;
    current = 1;
    initialization();
}
function continueGame(){
    current = 0;
    ball.speed = speed;
    
}
function resumeorstop(){
    if($("#playstop").text() === "Стоп"){
        stopGame();
        $("#playstop").html("Пуск");
    }
    else if($("#playstop").text() === "Назад"){
        $("#playstop").html("Стоп").hide();
        $("#rate").hide();
        $("#set").hide();
        $(".control").show();
    }
    else if($("#playstop").text() === "Рестарт"){
        $("#playstop").html("Стоп");
        continueGame();
        reset();
        user.score = 0;
        computer.score = 0;
    }
    else{
        continueGame();
        $("#playstop").html("Стоп");
    }
}
function winner(){
    stopGame();
    $("#playstop").html("Рестарт");
    if(user.score > computer.score)
        drawScore("Победил " + user.uname + "!", canvas.width()/3, canvas.height()/3);
    else if(user.score < computer.score)
        drawScore("Победил компьютер!", canvas.width()/3, canvas.height()/3);
    else
        drawScore("Ничья!", canvas.width()/2 - 50, canvas.height()/3);

    user.result = user.score + " : " + computer.score + " " + user.uname;
    for(var i=1; i<=10 ; i++){
        if(user.score > parseInt(localStorage.getItem(i))){
            for(var j = 10 ; j > i ; j--){
                localStorage.setItem(j, localStorage.getItem(j - 1));
            }
            localStorage.setItem(i, user.result);
            break;
        }
    }   
    sort();
    
};
function sort(){
    for (var i = 1, endI = 10 ; i <= endI; i++) {
        var wasSwap = false;
        for (var j = 1, endJ = endI - i; j <= endJ; j++) {
            if(localStorage.getItem(j) < localStorage.getItem(j + 1)){
            var o = localStorage.getItem(j);
            localStorage.setItem(j, localStorage.getItem(j + 1));
            localStorage.setItem(j + 1, o);
            wasSwap = true;
            }           
        }
        if (!wasSwap) break;
    }
}
