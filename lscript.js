const fleet = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

function createBoard() {
    const ships = [];
    const shots = Array(100).fill(false);

    return { ships, shots };
}

/* функция возвращает массив индексов клеток (кораблей), куда будет вписан корабль:
[11,12,13] или [11,21,31]; если однотрубный корабль - [11]
 */
function getShipCells(startCell, length, horizontal) {
    const row = Math.floor(startCell / 10);
    const col = startCell % 10;

    if (horizontal && col + length > 10) return [];
    if (!horizontal && row + length > 10) return [];

    const step = horizontal ? 1 : 10;

    const cells = [];
    for (let i = 0; i < length; i++) {
        cells.push(startCell + i * step);
    }

    return cells;
}

function placeShip(board, startCell, length, horizontal) {
    const ship = getShipCells(startCell, length, horizontal);
    if (ship.length === 0) return false;

    const occupiedCells = board.ships.flatMap(ship => ship.cells); // AI used, Model: Gemini-Pro

    for (const cell of ship) {
        const row = Math.floor(cell / 10);
        const col = cell % 10;

        for (const occupied of occupiedCells) {
            const rowDistance = Math.abs(row - Math.floor(occupied / 10));
            const colDistance = Math.abs(col - occupied % 10);
            if (rowDistance <= 1 && colDistance <= 1)
                return false;
        }
    }

    board.ships.push({ cells: ship }); // AI used, Model: Gemini-Pro

    return true;
}

function randomBoard() {
    while (true) {
        const board = createBoard();

        for (const shipLength of fleet) {
            let attempts = 0;

            while (attempts < 500) {
                const startCell = Math.floor(Math.random() * 100);
                const horizontal =  Math.random() < 0.5;

                let placeResult = placeShip(board, startCell, shipLength, horizontal);
                if (placeResult === true) break;

                attempts++;
            }

            if (attempts === 500) break;
        }

        if (board.ships.length === fleet.length) return board;
    }
}

function shipAt(board, cell) {
    // вернет, ЕСЛИ найдёт, массив с координатами одного корабля
    // ищет по одной точке
    return board.ships.find(shipObj => shipObj.cells.includes(cell)); // AI used, Model: Gemini-Pro
}

function isSunk(board, shipObj) {
    return shipObj.cells.every(cell => board.shots[cell]); // AI used, Model: Gemini-Pro
}

function shoot(board, cell) {
    if (board.shots[cell] === true) return null;

    board.shots[cell] = true;

    const shipObj = shipAt(board, cell);

    if (!shipObj) return 'miss';

    return isSunk(board, shipObj) ? 'sunk' : 'hit';
}

function allShipsSunk(board) {
    return board.ships.every(shipObj => isSunk(board, shipObj)); // AI used, Model: Gemini-Pro
}
