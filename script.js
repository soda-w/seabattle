// tlacitkoo
const runner = document.getElementById("runaway-btn");
const boardElement = document.getElementById('computer-board');
const shotsText = document.getElementById('shots');
const statusText = document.getElementById('status');
const resultElement = document.getElementById('result');
const shotsCount = 5

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

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

runner.addEventListener("click", () => {
    location.reload();
});