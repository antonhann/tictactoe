var feedback = document.querySelector('.feedback')
var tiles = document.querySelectorAll('.tile')
//HTML

const playerFactory = (user, mark) => {
    return {user, mark}
}

const gameboard = (() =>{
    var board = ['','','','','','','','','']

    const getBoard = () => {
        return board
    }
    const updateBoard = (index, currentPlayerMark) =>{
        board[index] = currentPlayerMark
    }
    const resetBoard = () => {
        board = ['','','','','','','','','']
    }
    return {getBoard, updateBoard, resetBoard}
})();

const gameController = (() => {
    let playerOne = playerFactory('Player X', 'X')
    let playerTwo = playerFactory('Player O', 'O')
    let playerAI = playerFactory('Computer', 'O')
    let currentPlayer = playerOne
    let gameOn = true
    let openspots = 9
    let gameType = 'player'
    const winCon = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    const checkWin = () => {
        let board = gameboard.getBoard()
        for(let i of winCon){
            if (board[i[0]] == '' || board[i[1]] == '' || board[i[2]] == ''){
                continue;
            }
            if(board[i[0]] == board[i[1]] && board[i[1]] == board[i[2]]){
                feedback.innerHTML = currentPlayer.user + ' wins!'
                gameOn = false
                return
            }
        }
        if (openspots == 0){
            gameOn = false
            feedback.innerHTML = 'TIE!'
        }
    }
    const userAction = (tile,index) => {
        if (gameOn && validSpot(index) && gameType == 'player'){
            tile.innerHTML = currentPlayer.mark
            openspots -= 1
            gameboard.updateBoard(index,currentPlayer.mark)
            checkWin()
            changePlayer()
        }
        if (gameOn && validSpot(index) && gameType == 'easy'){
            tile.innerHTML = currentPlayer.mark
            openspots -= 1
            gameboard.updateBoard(index,currentPlayer.mark)
            checkWin()
            aiPlayerEasy()
        }
    }
    const getOpenspots = () => {
        return openspots
    }
    const getCurrentPlayer = () =>{
        return currentPlayer
    }
    const changePlayer = () =>{
        if (gameOn && gameType == 'player'){
            currentPlayer == playerOne ? currentPlayer = playerTwo: currentPlayer = playerOne;
            feedback.innerHTML = currentPlayer.user + "'s turn!"
        }
        else if(gameOn){
            currentPlayer == playerOne ? currentPlayer = playerAI: currentPlayer = playerOne;
        }
    }
    const aiPlayerEasy = () => {
        while (true){
            let aiChoice = Math.floor(Math.random() * 9)
            let aiTile = document.getElementById(aiChoice)
            if (validSpot(aiChoice) && gameOn){
                changePlayer()
                aiTile.innerHTML = 'O'
                openspots -= 1
                gameboard.updateBoard(aiChoice,'O')
                checkWin()
                changePlayer()
                return
            }
            if (!gameOn){
                return
            }
        }
    }
    const validSpot = (index) =>{
        return gameboard.getBoard()[index] == ''
    }
    const changeGameType = (button) => {
        resetBoard()
        gameType = button.id
    }
    const resetGame = () => {
        currentPlayer = playerOne
        gameOn = true
        openspots = 9
    }
    tiles.forEach((tile, index) => {
        tile.addEventListener('click',() => {
            userAction(tile,index)
        });
    });
    return {getOpenspots, getCurrentPlayer, resetGame, changeGameType}
})();

function resetBoard(){
    gameboard.resetBoard()
    gameController.resetGame()
    tiles.forEach((tile, index) => {
        tile.innerHTML = ''
    });
    feedback.innerHTML = gameController.getCurrentPlayer().user + "'s turn!"
}

var gameButtons = document.querySelectorAll('.gameButton')
gameButtons.forEach((button) =>{
    button.addEventListener('click',() =>{
        gameButtons.forEach((button) => {
            button.classList.remove('active')
        })
        button.classList.add('active')
        gameController.changeGameType(button)
    })
});
