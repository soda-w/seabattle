const boardElement = document.getElementById('computer-board');
const shotsText = document.getElementById('shots');
const statusText = document.getElementById('status');
const resultElement = document.getElementById('result');
const runner = document.getElementById('runaway-btn');
const shotsCount = 75

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];


let shotsLeft;
let computer;
let gameOver;

function createField() {
    for (let row = 0; row < 11; row++) {
        for (let col = 0; col < 11; col++) {
            if (row === 0 || col === 0) {
                const label = document.createElement('span');
                label.className = 'coordinate';

                if (row === 0 && col === 0) {
                    label.textContent = '';
                } else if (row === 0) {
                    label.textContent = col;
                } else {
                    label.textContent = letters[row - 1];
                }

                boardElement.append(label);
            } else {
                const cellIndex = (row - 1) * 10 + (col - 1);
                const button = document.createElement('button');
                button.className = 'cell';
                button.dataset.cell = cellIndex; // Нужно для функции render()
                button.addEventListener('click', () => playerShot(cellIndex));

                boardElement.append(button);
            }
        }
    }
}

function newGame() {
    computer = randomBoard();
    gameOver = false;
    statusText.textContent = 'Vyberte políčko, na které chcete vystřelit.';
    shotsLeft = shotsCount;

    render();
}

function render() {
    shotsText.textContent = `Zbývá výstřelů: ${shotsLeft}`;

    for (const button of boardElement.querySelectorAll('.cell')) {
        const cell = Number(button.dataset.cell);

        // содержит в себе массив координат ОДНОГО корабля или  false
        const ship = shipAt(computer, cell);

        let className = 'cell';
        let symbol = '';

        if (computer.shots[cell] === true) {
            if (ship) {
                className += isSunk(computer, ship) ? ' sunk' : ' hit';
                symbol =  '×';
            } else {
                className +=' miss';
                symbol =  '•';
            }
        } else if (gameOver && ship) {
            className += ' ship';
        }

        button.className = className;
        button.textContent = symbol;

        if (gameOver === true) {
            button.disabled = true
        } else if (computer.shots[cell] === true) {
            button.disabled = true
        } else {
            button.disabled = false
        }
    }
}

function finishGame(won) {
    gameOver = true;
    resultElement.hidden = false;

    if (won === true) {
        resultElement.className = 'win';
        resultElement.textContent = `Vyhráli jste! Potopili jste všechny lodě. Zůstalo vám ${shotsLeft} výstřelů.`;
    } else {
        resultElement.className = 'lose';
        resultElement.textContent = 'Prohráli jste. Došly vám výstřely. Zbývající lodě jsou zobrazeny na poli.';
    }
}

function playerShot(cell) {
    if (gameOver) return;

    const result = shoot(computer, cell);
    // если повторно выстрел в ту же точку
    if (result === null) return;

    shotsLeft--;

    if (allShipsSunk(computer)){
        finishGame(true);
        statusText.textContent = '';
    } else if (shotsLeft === 0){
        finishGame(false);
    }

    render();
}

createField();

// tlacitkoo
runner.addEventListener("mouseover", () => {
    const positionBut = runner.getBoundingClientRect();

    const jump = 100;

    let moveX = (Math.random() * jump) - 50;
    let moveY = (Math.random() * jump) - 50; //max. random hodnota bude 200px, ale skok do libovolnych stran chceme 100px -> takže x∈[0;200)-100, což může být jak kladné číslo (posun doprava) nebo záporné číslo (posun doleva)

    if (positionBut.right + moveX > window.innerWidth) {
        moveX = -Math.abs(moveX);
    }
    if (positionBut.left + moveX < 0) {
        moveX = Math.abs(moveX);
    }
    if (positionBut.top + moveY < 0) {
        moveY = Math.abs(moveY);
    }
    if (positionBut.bottom + moveY > window.innerHeight) {
        moveY = -Math.abs(moveY);
    }

    runner.style.transform = `translate(${moveX}px, ${moveY}px)`; //AI used - `` pro vkladani promen do textu
});

runner.onclick = newGame; //puvodni location.reload() nefungovalo
