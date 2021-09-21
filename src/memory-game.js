const gameCards = [...document.querySelectorAll(".card")];
const board = document.querySelector(".board");
const images = document.querySelectorAll("img");
const options = [...document.querySelectorAll("input")];
const time = document.querySelector(".time");
const cardFlips = document.querySelector(".card-flips");
const gameData = {
    turnedOver: false,
    numberOfCards: [],
    fixedBoard: false,
    gridSize: 6,
    gridTotal: 0,
    flipCount: 1
}
let [minutes, seconds, milliseconds] = [0, 0, 0];
let interval = null;

options.map((item) => {
    item.addEventListener("click", () => {
        if(item.id == "twoBy3") {
            itemRemover("twoBy3", 6);
            gameData.gridSize = 3;
        } else if(item.id == "twoBy2") {
            itemRemover("twoBy2", 4);
            gameData.gridSize = 2;
        } else {
            reloadPage();
        }
    });
});

window.addEventListener("load", loadCards);
window.addEventListener("load", reArrange);

function loadCards() {
    gameCards.map((item) => {
        item.addEventListener("click", turnCard);
        item.addEventListener("click", removeBoardOption);
        item.addEventListener("click", () => {
            if( interval !== null) {
                clearInterval(interval);
            }
            interval = setInterval(startTimer, 10);
        });
    });
}

function turnCard() {
    if(gameData.fixedBoard) { return }
    if(gameData.numberOfCards[0] == this) { return }

    this.classList.toggle("turn");
    cardFlipCounter();
    
    if(!gameData.turnedOver) {
        gameData.turnedOver = true;
        gameData.numberOfCards[0] = this;
    } else {
        gameData.numberOfCards[1] = this;
        match();
    }
}

function match() {
    if(gameData.numberOfCards[0].dataset.card == gameData.numberOfCards[1].dataset.card) {
        disable();
        if(gameData.gridSize == gameData.gridTotal) {
            stopTimer();
        }
    } else {
        turnBack();
    }
}

function disable() {
    gameData.gridTotal++;

    gameData.numberOfCards.map((item) => {
        setTimeout(() => {
            item.removeEventListener("click", turnCard);
        }, 600)
    });
    reset();
}

function turnBack() {
    gameData.fixedBoard = true;
    
    setTimeout(() => {
        gameData.numberOfCards.map((item) => { item.classList.remove("turn") });
        reset();
    }, 1400);
}

function reset() {
    [gameData.fixedBoard, gameData.turnedOver] = [false, false];
    [gameData.numberOfCards[0], gameData.numberOfCards[1]] = [null, null];
}

function reArrange() {
    gameCards.map((item) => {
        let gameCardsPosition = Math.round(Math.random() * 11);
        item.style.order = gameCardsPosition;
    });
}

function removeBoardOption() {
    board.classList.add("display-factor");
}

function itemRemover(itemId, itemIndex) {
    gameCards.map((item) => {
        return (item.classList.add(itemId),
            item.classList.remove("display-factor")
        );
    });

    for(let i = itemIndex; i < gameCards.length; i++) {
        if(itemId == "twoBy2") {
            gameCards[i].classList.remove("twoBy3");
            gameCards[i].classList.add("display-factor");
        } else {
            gameCards[i].classList.remove("twoBy2");
            gameCards[i].classList.add("display-factor");
        }
    }
}

function reloadPage() {
    window.location.reload(true);
}

function startTimer() { 
    milliseconds+=10;

    if(milliseconds == 1000){
        milliseconds = 0;
        seconds++;
        if(seconds == 60){
            seconds = 0;
            minutes++;
            if(minutes == 60){
                minutes = 0;
            }
        }
    }

    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;

    let output = `${m} : ${s} : ${ms}`;
    time.innerHTML = output.substring(0, output.length -1);
}

function stopTimer(int=interval) {
    setTimeout(() => {
        let result = confirm(
            `Mission Complete :)\n
            Time Taken To Finish: ${time.innerHTML}\n
            Moves Taken To Finish: ${cardFlips.innerHTML}\n
            Play Again?`
            );
        if(result) {
            reloadPage();
        } else {
            window.close();
        }
    },610);
}

function cardFlipCounter() {
    if(!gameData.fixedBoard) {
        cardFlips.innerHTML = gameData.flipCount;
        gameData.flipCount++;
    }
}


module.exports = {
    gameCards,
    board,
    options,
    images,
    gameData,
    turnCard,
    removeBoardOption,
    startTimer,
    cardFlipCounter
}
