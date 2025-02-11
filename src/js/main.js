// ----------------------------------------------------- Базовые скрипты --------------------------------------------------------
import { BaseHelpers } from './helpers/base-helpers';
BaseHelpers.addLoadedClass();
BaseHelpers.checkWebpSupport();
BaseHelpers.calcScrollbarWidth();
BaseHelpers.addTouchClass();
BaseHelpers.headerFixed();

let gam = document.querySelector('.game')

let CRU = document.querySelector('#CRU-touch')
let CRD = document.querySelector('#CRD-touch')
let CLD = document.querySelector('#CLD-touch')
let CLU = document.querySelector('#CLU-touch')

let scoreElement = document.querySelector('#score b')
let levelElement = document.querySelector('#level b')
let livesElement = document.querySelector('#lives')
let pauseElement = document.querySelector('#pause')
let lock = document.querySelector('.game-place-lock')

let crashSound = document.querySelector('#crash-sound')
let laySound = document.querySelector('#layed-sound')
let pauseSound = document.querySelector('#pause-sound')
let lostSound = document.querySelector('#lost-sound')
let winSound = document.querySelector('#win-sound')


let score = 0
let level = 1
let lives = 5

let wolf = document.querySelector('#wolf')
let wolfLevel = 'up'
let wolfSide = 'right'
let speedUpdatePosition = 100;

let currPos
let gameProcess = true

let rollingSpeed
let fallingSpeed
let resetSpeed
let nextEgg
let sunFlag = 0
let pauseFlag = false

let game
// --------------------------------------------- Eggs -------------------------------------------------------------

let nestLU = document.querySelector('#chicken-left-up').querySelector('.pomost-left')
let nestLD = document.querySelector('#chicken-left-down').querySelector('.pomost-left')
let nestRU = document.querySelector('#chicken-right-up').querySelector('.pomost-right')
let nestRD = document.querySelector('#chicken-right-down').querySelector('.pomost-right')


// ---------------------------- Старт катиться яицам -------------------------------

game = setInterval(nextRandomEgg, 2000)
showScore()


pauseElement.addEventListener('click', pauseHandler)
function pauseHandler() {
    if (gameProcess && !pauseFlag) {
        pauseFlag = true
        clearInterval(game)
        gameProcess = false
        pauseElement.innerHTML = 'Играть !'
        pauseElement.classList.add('active')
        removeAllEggs()
        clearAllTimeouts()
        // anounce('Игра на паузе !', 2000)
        pauseFlag = false
        pauseSound.play()
        wolf.className = 'rc'
        lock.classList.add('active')

    } else if (!gameProcess && !pauseFlag) {
        pauseFlag = true
        game = setInterval(nextRandomEgg, rollingSpeed)
        pauseElement.innerHTML = 'Пауза !'
        pauseElement.classList.remove('active')
        gameProcess = true
        pauseSound.play()
        showScore()
        wolf.className = 'lc'
        anounce('Поехали !', 2000)
        lock.classList.remove('active')

    }
}
pauseElement.click()

// ----------------------------- For Mobile ---------------------------
CRU.addEventListener('click', cruTap)
CLU.addEventListener('click', cluTap)
CRD.addEventListener('click', crdTap)
CLD.addEventListener('click', cldTap)
function cruTap() {
    if (gameProcess) {
        wolf.className = ''
        wolf.classList.add('ru')
        currPos = 'ru'
    }
}
function cluTap() {
    if (gameProcess) {
        wolf.className = ''
        wolf.classList.add('lu')
        currPos = 'lu'
    }
}
function crdTap() {
    if (gameProcess) {
        wolf.className = ''
        wolf.classList.add('rd')
        currPos = 'rd'
    }
}
function cldTap() {
    if (gameProcess) {
        wolf.className = ''
        wolf.classList.add('ld')
        currPos = 'ld'
    }
}

// ----------------------------- For Keyword ---------------------------
document.addEventListener('keydown', keyDown)
function keyDown(e) {
    e.stopPropagation()
    // ------------------- вверх -----------------
    if (e.keyCode == 38 && gameProcess) {
        wolfLevel = 'up'
        if (wolfSide == 'right') {
            wolf.className = ''
            wolf.classList.add('ru')
            currPos = 'ru'
        }
        if (wolfSide == 'left') {
            wolf.className = ''
            wolf.classList.add('lu')
            currPos = 'lu'
        }
    }
    // ------------------- вниз -----------------
    if (e.keyCode == 40 && gameProcess) {
        wolfLevel = 'down'
        if (wolfSide == 'right') {
            wolf.className = ''
            wolf.classList.add('rd')
            currPos = 'rd'
        }
        if (wolfSide == 'left') {
            wolf.className = ''
            wolf.classList.add('ld')
            currPos = 'ld'
        }
    }
    // ------------------- вправо -----------------
    if (e.keyCode == 39 && gameProcess) {
        if (wolfSide !== 'right') {
            wolf.className = ''
            wolf.classList.add('rc')
        }
        wolfSide = 'right'
        if (wolfLevel == 'up') {
            setTimeout(() => {
                wolf.className = ''
                wolf.classList.add('ru')
                currPos = 'ru'
            }, speedUpdatePosition)
        }
        if (wolfLevel == 'down') {
            setTimeout(() => {
                wolf.className = ''
                wolf.classList.add('rd')
                currPos = 'rd'
            }, speedUpdatePosition)
        }
    }
    // ------------------- влево -----------------
    if (e.keyCode == 37 && gameProcess) {
        if (wolfSide !== 'left') {
            wolf.className = ''
            wolf.classList.add('lc')
        }
        wolfSide = 'left'
        if (wolfLevel == 'up') {
            setTimeout(() => {
                wolf.className = ''
                wolf.classList.add('lu')
                currPos = 'lu'
            }, speedUpdatePosition)
        }
        if (wolfLevel == 'down') {
            setTimeout(() => {
                wolf.className = ''
                wolf.classList.add('ld')
                currPos = 'ld'
            }, speedUpdatePosition)
        }
    }
}
// ---------------------------- Очищаем все таймеры -------------------------------
function clearAllTimeouts() {
    var highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
    }
}
// ---------------------------- удаляем все яйца из DOM -------------------------------
function removeAllEggs() {
    let all = document.querySelectorAll('.egg')
    all.forEach(egg => {
        egg.remove()
    })

}

// ---------------------------- Случайное гнездо -------------------------------
function nextRandomEgg() {
    nextEgg = getRandomInt(1, 4)
    if (nextEgg == 1) { startEgg(nestRD) }
    if (nextEgg == 2) { startEgg(nestRU) }
    if (nextEgg == 3) { startEgg(nestLD) }
    if (nextEgg == 4) { startEgg(nestLU) }
}
// ---------------------------- рождение яйца -------------------------------
function createEgg(nest) {
    let egg = document.createElement('div')
    egg.className = 'egg'

    getRandomInt(1, 2) == 1 ? egg.classList.add('egg-white') : egg.classList.add('egg-brown')

    if (nest == nestRD || nest == nestRU) {
        egg.classList.add('egg-right')
    }
    if (nest == nestLD || nest == nestLU) {
        egg.classList.add('egg-left')
    }
    egg.classList.add('rolling')
    return egg;
}

// ---------------------------- движение яйца -------------------------------
function startEgg(nest) {
    let newEgg = createEgg(nest)
    nest.appendChild(newEgg)

    eggSpeed(newEgg)

    let fallingTimer = setTimeout(() => {
        newEgg.classList.remove('falling')
        newEgg.classList.add('cracked')
        crashSound.play()
        lives--;
        showScore()
    }, fallingSpeed + rollingSpeed)
    let resetTimer = setTimeout(() => {
        newEgg.className = ''
        newEgg.remove();
    }, resetSpeed)

    let rolingTimer = setTimeout(() => {
        newEgg.classList.remove('rolling')
        newEgg.classList.add('falling')
        if (nest == nestLU && currPos == 'lu') {
            clearTimeout(fallingTimer)
            clearTimeout(resetTimer)
            newEgg.remove()
            score++;
            showScore()
            laySound.play()
            return
        }
        if (nest == nestLD && currPos == 'ld') {
            clearTimeout(fallingTimer)
            clearTimeout(resetTimer)
            newEgg.remove()
            score++;
            showScore()
            laySound.play()
            return
        }
        if (nest == nestRU && currPos == 'ru') {
            clearTimeout(fallingTimer)
            clearTimeout(resetTimer)
            newEgg.remove()
            score++;
            showScore()
            laySound.play()
            return
        }
        if (nest == nestRD && currPos == 'rd') {
            clearTimeout(fallingTimer)
            clearTimeout(resetTimer)
            newEgg.remove()
            score++;
            showScore()
            laySound.play()
            return
        }
    }, rollingSpeed)
}

function eggSpeed(egg) {
    if (level == 1) { levelSet(2500, 250, 1) }
    if (level == 2) { levelSet(2200, 230, 1) }
    if (level == 3) { levelSet(2000, 200, 0.75) }
    if (level == 4) { levelSet(1800, 200, 0.65) }
    if (level == 5) { levelSet(1500, 200, 0.65) }
    if (level == 6) { levelSet(1300, 150, 0.65) }
    if (level == 7) { levelSet(1100, 150, 0.85) }
    if (level == 8) { levelSet(950, 150, 0.75) }
    if (level == 9) { levelSet(850, 150, 0.80) }
    if (level == 10) { levelSet(750, 150, 0.85) }

    function levelSet(rolling, falling, kef) {
        rollingSpeed = rolling
        fallingSpeed = falling
        resetSpeed = rollingSpeed + fallingSpeed + 1500
        egg.setAttribute('style', `--rolling-time: ${rolling}ms; --falling-time: ${falling}ms; `)
        clearInterval(game)
        game = setInterval(nextRandomEgg, rollingSpeed * kef)
    }

}

// ---------------------------- обновление и показ очков и др. -------------------------------
function showScore() {
    let livesHTML = '<ul>'
    for (let i = 0; i < lives; i++) {
        livesHTML += '<li></li>'
    }
    livesHTML += '</ul>';
    scoreElement.innerHTML = `<span>${score}</span>`
    levelElement.innerHTML = `<span>${level}</span>`
    livesElement.innerHTML = livesHTML
    if (lives == 0) { gameOver() }

    if (score == 10) { level = 2; sunFlag++; sunFlag == 1 ? sunRotate() : ''; }
    score > 10 && score < 20 ? sunFlag = 0 : ''
    if (score == 20) { level = 3; sunFlag++; sunFlag == 1 ? sunRotate() : ''; }
    score > 20 && score < 30 ? sunFlag = 0 : ''
    if (score == 30) { level = 4; sunFlag++; sunFlag == 1 ? sunRotate() : ''; }
    score > 30 && score < 40 ? sunFlag = 0 : ''
    if (score == 40) { level = 5; sunFlag++; sunFlag == 1 ? sunRotate() : ''; }
    score > 40 && score < 50 ? sunFlag = 0 : ''
    if (score == 50) { level = 6; sunFlag++; sunFlag == 1 ? sunRotate() : ''; }
    score > 50 && score < 60 ? sunFlag = 0 : ''
    if (score == 60) { level = 7; sunFlag++; sunFlag == 1 ? sunRotate() : ''; }
    score > 60 && score < 70 ? sunFlag = 0 : ''
    if (score == 70) { level = 8; sunFlag++; sunFlag == 1 ? sunRotate() : ''; }
    score > 70 && score < 80 ? sunFlag = 0 : ''
    if (score == 80) { level = 9; sunFlag++; sunFlag == 1 ? sunRotate() : ''; }
    score > 80 && score < 90 ? sunFlag = 0 : ''
    if (score == 90) { level = 10; sunFlag++; sunFlag == 1 ? sunRotate() : ''; }
    score > 90 && score < 99 ? sunFlag = 0 : ''
    if (score == 99) { youWin() }
}

// ---------------------------- Гамеовер -------------------------------
function gameOver() {
    lostSound.play()
    clearTimeout(game)
    gameProcess = false
    wolf.className = 'rc'
    currPos = 'rc'
    anounce('ВЫ ПРОИГРАЛИ !', 4000)
    pauseElement.disabled = 'true'
    setTimeout(() => {
        lives = 5
        level = 1
        score = 0
        pauseElement.innerHTML = 'Заново !'
        pauseElement.removeAttribute('disabled')
    }, 4000)
}

function youWin() {
    winSound.play()
    clearTimeout(game)
    gameProcess = false
    wolf.className = 'lc'
    currPos = 'lc'
    removeAllEggs()
    clearAllTimeouts()
    anounce('ПОБЕДА !', 15000)
    gam.classList.add('bright')
    pauseElement.disabled = 'true'
    setTimeout(() => { gam.classList.remove('bright') }, 450)
    setTimeout(() => {
        lives = 5
        level = 1
        score = 0
        pauseElement.innerHTML = 'Заново !'
        pauseElement.removeAttribute('disabled')
    }, 22000)
}

// ---------------------------- Случайное число -------------------------------
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------------------------- Вылетающий текст -------------------------------
function anounce(content, delay) {
    let element = document.createElement('div')
    let body = document.querySelector('body')
    body.append(element)
    element.innerHTML = content;
    element.className = "anounce";
    element.classList.add('active')

    setTimeout(() => {
        element.classList.remove('active')
        pauseFlag = false
    }, delay)
    setTimeout(() => {
        element.remove()
    }, delay + 1000)
}

// ---------------------------- крутить солнце -------------------------------
function sunRotate() {
    let s = document.querySelector('#sun')
    s.classList.add('active')
    pauseSound.play()
    setTimeout(() => {
        s.classList.remove('active')
    }, 1000)

}
