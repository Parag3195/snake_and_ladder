let tog = 1;
let gameStarted = false;

let rollingSound = new Audio('./dice-roll.mp3');
let winSound = new Audio('./win-sound.mp3');

let p1sum = 0;
let p2sum = 0;

// Disable game UI before start
document.querySelector('.game-container').style.display = 'none';
document.getElementById('diceBtn').disabled = true;

// START GAME FUNCTION
function startGame() {
    const p1Color = document.getElementById('p1Color').value;
    const p2Color = document.getElementById('p2Color').value;

    if (p1Color === p2Color) {
        alert("Players must choose different colors!");
        return;
    }

    const pawn1 = document.getElementById('p1');
    const pawn2 = document.getElementById('p2');

    pawn1.style.backgroundColor = p1Color;
    pawn2.style.backgroundColor = p2Color;

    document.getElementById('startScreen').style.display = 'none';
    document.querySelector('.game-container').style.display = 'flex';
    document.getElementById('diceBtn').disabled = false;
    gameStarted = true;
}

// PAWN MOVEMENT FUNCTION
function play(player, psum, correction, num) {
    let sum;

    if (psum === 'p1sum') {
        p1sum += num;
        if (p1sum > 100) p1sum -= num;

        // Ladders
        if (p1sum === 1) p1sum = 38;
        if (p1sum === 4) p1sum = 14;
        if (p1sum === 8) p1sum = 30;
        if (p1sum === 21) p1sum = 42;
        if (p1sum === 28) p1sum = 76;
        if (p1sum === 50) p1sum = 67;
        if (p1sum === 71) p1sum = 92;
        if (p1sum === 80) p1sum = 99;

        // Snakes
        if (p1sum === 32) p1sum = 10;
        if (p1sum === 36) p1sum = 6;
        if (p1sum === 48) p1sum = 26;
        if (p1sum === 62) p1sum = 18;
        if (p1sum === 88) p1sum = 24;
        if (p1sum === 95) p1sum = 56;
        if (p1sum === 97) p1sum = 78;

        sum = p1sum;
    }

    if (psum === 'p2sum') {
        p2sum += num;
        if (p2sum > 100) p2sum -= num;

        // Ladders
        if (p2sum === 1) p2sum = 38;
        if (p2sum === 4) p2sum = 14;
        if (p2sum === 8) p2sum = 30;
        if (p2sum === 21) p2sum = 42;
        if (p2sum === 28) p2sum = 76;
        if (p2sum === 50) p2sum = 67;
        if (p2sum === 71) p2sum = 92;
        if (p2sum === 80) p2sum = 99;

        // Snakes
        if (p2sum === 32) p2sum = 10;
        if (p2sum === 36) p2sum = 6;
        if (p2sum === 48) p2sum = 26;
        if (p2sum === 62) p2sum = 18;
        if (p2sum === 88) p2sum = 24;
        if (p2sum === 95) p2sum = 56;
        if (p2sum === 97) p2sum = 78;

        sum = p2sum;
    }

    const pawn = document.getElementById(player);

    let left = 0;
    let top = 0;

    if (sum < 10) {
        left = (sum - 1) * 62;
        top = -0 * 62 - correction;
    } else if (sum === 100) {
        winSound.play();
        setTimeout(() => {
            alert(player === 'p1' ? "Player 1 Won!! 🎉" : "Player 2 Won!! 🎉");
            location.reload();
        }, 100);
        return;
    } else {
        const numarr = Array.from(String(sum));
        const n1 = parseInt(numarr.length === 2 ? numarr[0] : '0');
        const n2 = parseInt(numarr.length === 2 ? numarr[1] : numarr[0]);

        if (n1 % 2 !== 0) {
            if (n2 === 0) {
                left = 9 * 62;
                top = (-n1 + 1) * 62 - correction;
            } else {
                left = (9 - (n2 - 1)) * 62;
                top = -n1 * 62 - correction;
            }
        } else {
            if (n2 === 0) {
                left = 0;
                top = (-n1 + 1) * 62 - correction;
            } else {
                left = (n2 - 1) * 62;
                top = -n1 * 62 - correction;
            }
        }
    }

    // Move the pawn and trigger jump animation
    pawn.style.left = `${left}px`;
    pawn.style.top = `${top}px`;

    // Trigger the jump animation
    pawn.classList.remove('jump');
    void pawn.offsetWidth; // Force reflow
    pawn.classList.add('jump');
}

// ROLL DICE EVENT
document.getElementById("diceBtn").addEventListener("click", function () {
    if (!gameStarted) return;

    let num = Math.floor(Math.random() * 6) + 1;
    rollingSound.play();

    const cube = document.getElementById('cube');

    const spinX = 360 * (Math.floor(Math.random() * 4) + 1);
    const spinY = 360 * (Math.floor(Math.random() * 4) + 1);

    let baseX = 0;
    let baseY = 0;

    switch (num) {
        case 1:
            baseX = 0;
            baseY = 0;
            break;
        case 2:
            baseX = 0;
            baseY = 180;
            break;
        case 3:
            baseX = 0;
            baseY = -90;
            break;
        case 4:
            baseX = 0;
            baseY = 90;
            break;
        case 5:
            baseX = -90;
            baseY = 0;
            break;
        case 6:
            baseX = 90;
            baseY = 0;
            break;
    }

    const finalX = baseX + spinX;
    const finalY = baseY + spinY;

    cube.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg)`;

    setTimeout(() => {
        if (tog % 2 !== 0) {
            document.getElementById('tog').innerText = "Player 2's Turn";
            play('p1', 'p1sum', 0, num);
        } else {
            document.getElementById('tog').innerText = "Player 1's Turn";
            play('p2', 'p2sum', 55, num);
        }
        tog++;
    }, 800);
});
