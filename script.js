let board;
const humanPlayer ='O';
const aiPlayer ='X';
const wincombo = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8],
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8],
   [0, 4, 8],
   [6, 4, 2]
]; 
const cells = document.querySelectorAll('.cell');
let over ;
startGame();
function startGame(){
   over=false;
   document.querySelector('.endGame').style.display = "none";
   document.getElementById('pyro').style.display="none";
   board = [ 0,1,2,3,4,5,6,7,8 ];
   for(let i=0; i<cells.length; i++){
           cells[i].innerText='';
           cells[i].style.removeProperty('background-color');
           cells[i].addEventListener('click' , turnClick  , false );
   }
}

function turnClick(square){
    if(  typeof board[square.target.id] == 'number' ){ 
    turn( square.target.id  , humanPlayer );
    if ( over==false && !checkTie()) { 
       if(document.getElementById("check").checked) turn(bestSpot() , aiPlayer );
       else  turn(randomSpot() , aiPlayer );
    }

    }
}
function randomSpot(){
   return emptySquares()[0];
}
function emptySquares() {
   return board.filter(s => typeof s == 'number');
}
function turn(squareid , player ){
   board[squareid] = player;
   document.getElementById(squareid).innerHTML=player;
   let isWon = checkWin( board , player );
   if(isWon ) { over=true; gameOver(isWon) } 
}

function checkWin(currBoard , player ){
    let array = [];
    for (let index = 0; index < currBoard.length; index++) {
        if( currBoard[index] == player )
            array.push(index);
    }
   let result = null;
    for(let row=0;row<wincombo.length; row++ ){
        let flag = true;
        for(let col=0; col<3; col++  ){
            if( array.indexOf( wincombo[row][col]) < 0  )
            flag=false;
        }
        if(flag) {
               result = {
                   player  : player ,
                   index : row
               }
               break;
        }
    }
    return result;
}

function gameOver( wonObject  ){
   for (let index = 0; index < wincombo.length; index++) {
       if(index == wonObject.index ){
           for (let itr = 0; itr < 3; itr++) {
               //console.log(wincombo[index][itr] )
               document.getElementById(wincombo[index][itr]).style.backgroundColor=wonObject.player==="O" ? 'green' : 'rgb(255, 80, 80)' ;	
           }
       }
       
   }
   for (let index = 0; index < cells.length; index++) {
       cells[index].removeEventListener('click' , turnClick , false );
   }
   
   declareWinner(wonObject.player == humanPlayer ? "You Won!" :"You Lose!" );
   if(wonObject.player == humanPlayer ){
       document.getElementById('pyro').style.display="block";
   } 
} 

function emptySquare() {
   return board.filter(s => typeof s == 'number');
}

function bestSpot() {
   return minimax(board, aiPlayer).index;
}
function checkTie(){
   if(emptySquare().length == 0 ) {
       for (let index = 0; index < cells.length; index++) {
           cells[index].style.backgroundColor = 'grey';
           cells[index].removeEventListener('click', turnClick, false);
       }
       declareWinner("Tie Game!");
       return true;
   }
   return false;
}
function declareWinner(who){
   document.querySelector(".endGame").style.display = 'block';
   document.querySelector(".endGame .text").innerText = who;
}
let huPlayer =humanPlayer;
function minimax(newBoard, player) {
   var availSpots = emptySquare();

   if (checkWin(newBoard, huPlayer)) {
       return {score: -10};
   } else if (checkWin(newBoard, aiPlayer)) {
       return {score: 10};
   } else if (availSpots.length === 0) {
       return {score: 0};
   }
   var moves = [];
   for (var i = 0; i < availSpots.length; i++) {
       var move = {};
       move.index = newBoard[availSpots[i]];
       newBoard[availSpots[i]] = player;

       if (player == aiPlayer) {
           var result = minimax(newBoard, huPlayer);
           move.score = result.score;
       } else {
           var result = minimax(newBoard, aiPlayer);
           move.score = result.score;
       }

       newBoard[availSpots[i]] = move.index;

       moves.push(move);
   }

   var bestMove;
   if(player === aiPlayer) {
       var bestScore = -10000;
       for(var i = 0; i < moves.length; i++) {
           if (moves[i].score > bestScore) {
               bestScore = moves[i].score;
               bestMove = i;
           }
       }
   } else {
       var bestScore = 10000;
       for(var i = 0; i < moves.length; i++) {
           if (moves[i].score < bestScore) {
               bestScore = moves[i].score;
               bestMove = i;
           }
       }
   }

   return moves[bestMove];
}

