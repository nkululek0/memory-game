const jsdom = require("jsdom");
const fs = require("fs");
const index = fs.readFileSync("index.html", "UTF-8");

const { JSDOM } = jsdom;
const { window } = new JSDOM(index, { runScripts: "dangerously", resources: "usable" });
global.window = window;
global.document = window.document;

const {
    gameCards,
    board,
    options,
    images,
    gameData,
    turnCard,
    removeBoardOption,
    startTimer,
    cardFlipCounter
} = require("../src/memory-game.js");

describe("Document elements checkup,", () => {

    it("should have images", () => {
        expect(images).not.toEqual(null);
    });
    it("should have gameCards of an even number", () => {
        expect(gameCards.length % 2).toEqual(0);
        
    });
    it("should have game cards half of the amount of images", () => {
        expect((images.length - gameCards.length) % 2).toEqual(0);
    });
    it("should have 3 inputs", () => {
        expect(options.length).toEqual(3);
    });
});

describe("DOM manipulation basic functionality,", () => {

    let event = document.createEvent("MouseEvent");
    event.initEvent("click", true, true);
    gameCards[0].addEventListener("click", turnCard);
    
    gameCards[0].dispatchEvent(event);
    
    it("should toggle the turn class", () => {
        let gameCardClassList = gameCards[0].classList.toString();

        expect(gameCardClassList.includes("turn")).toEqual(true);
    });
    it("should set turned over to true", () => {
        expect(gameData.turnedOver).toEqual(true);
    });
    it("should set fixed to false", () => {
        expect(gameData.fixedBoard).toEqual(false);
    });
});

describe("Grid,", () => {

    let event = document.createEvent("MouseEvent");
    event.initEvent("click", true, true);
    gameCards[0].addEventListener("click", removeBoardOption);

    gameCards[0].dispatchEvent(event);

    it("should add the display-factor class when game starts", () => {
        let boardClassList = board.classList.toString();
        
        expect(boardClassList.includes("display-factor")).toEqual(true);
    });
});

describe("Timer,", () => {

    let event = document.createEvent("MouseEvent");
    event.initEvent("click", true, true);
    gameCards[0].addEventListener("click", startTimer);

    gameCards[0].dispatchEvent(event);

    it("should start the timer", () => {
        let timer = document.querySelector(".time");

        expect(timer.innerHTML).not.toEqual("00:00:00");
    });
});

describe("Card flips,", () => {

    it("should add a count flip", () => {
        let cardFlips = document.querySelector(".card-flips");

        cardFlipCounter()

        expect(cardFlips.innerHTML).not.toEqual("0");
    });
});