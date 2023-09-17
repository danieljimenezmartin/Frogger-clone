const squareElement = document.querySelectorAll(".board div");
const timeLeftElement = document.getElementById("time-left");
const resultElement = document.getElementById("result");
const startPauseButtonElement = document.getElementById("start");
const restartButtonElement = document.getElementById("restart");
let carsRightLineElement = document.querySelectorAll(".cars-to-right");
let carsRightElement = document.querySelectorAll(".cars-to-right.car");
let carsLeftLineElement = document.querySelectorAll(".cars-to-left");
let carsLeftElement = document.querySelectorAll(".cars-to-left.car");
const trunksRightElement = document.querySelectorAll(".trunks-to-right");
const trunksLeftElement = document.querySelectorAll(".trunks-to-left");
let lifesElement = document.querySelector(".lifes");
const pointsElement = document.querySelector(".points");
const rootStyles = document.documentElement.style;
let intervalId;
let resultCheckIntervalId;
//Número de div en el ancho del tablero de juego
const width = 9;
//Posición inicial de la rana
let frogCurrentSquare = 76;
//Establecemos el tiempo disponible para alcanzar la meta
let timeToFinish = 20;
//Contador de objetivos alcanzados
let target = 0;
//Contador de vidas restantes
let lifes = 5;
//Contador de puntos
let points = 0;

//Colocamos la rana en la posición inicial
squareElement[frogCurrentSquare].classList.add("frog");

//Función para definir el color del suelo de la rana en función de la casilla en la que se encuentre
const FrogSquareColor = () => {
  const currentSquareClass = squareElement[frogCurrentSquare].classList;
  switch (true) {
    case currentSquareClass.contains("start-line"):
      rootStyles.setProperty("--frog-square-color", "var(--url-start)");
      break;
    case currentSquareClass.contains("grass"):
      rootStyles.setProperty("--frog-square-color", "var(--url-grass)");
      break;
    case currentSquareClass.contains("road") || currentSquareClass.contains("car"):
      rootStyles.setProperty("--frog-square-color", "var(--url-road)");
      break;
    case currentSquareClass.contains("water"):
      rootStyles.setProperty("--frog-square-color", "var(--url-water)");
      break;
    case currentSquareClass.contains("trunk1") && currentSquareClass.contains("trunks-to-left"):
      rootStyles.setProperty("--frog-square-color", "var(--url-trunk1-left");
      break;
    case currentSquareClass.contains("trunk3") && currentSquareClass.contains("trunks-to-left"):
      rootStyles.setProperty("--frog-square-color", "var(--url-trunk3-left");
      break;
    case currentSquareClass.contains("trunk1") && currentSquareClass.contains("trunks-to-right"):
      rootStyles.setProperty("--frog-square-color", "var(--url-trunk1-right");
      break;
    case currentSquareClass.contains("trunk3") && currentSquareClass.contains("trunks-to-right"):
      rootStyles.setProperty("--frog-square-color", "var(--url-trunk3-right");
      break;
    case currentSquareClass.contains("trunk2"):
      rootStyles.setProperty("--frog-square-color", "var(--url-trunk2");
      break;
  }
};

//Función para mover la rana
const moveFrog = e => {
  let key = e.key;
  squareElement[frogCurrentSquare].classList.remove("frog");
  switch (e.key) {
    case "ArrowLeft":
      if (frogCurrentSquare % width !== 0) frogCurrentSquare--;
      rootStyles.setProperty("--frog-position", "var(--frog-left)");
      break;
    case "ArrowRight":
      if (frogCurrentSquare % width < width - 1) frogCurrentSquare++;
      rootStyles.setProperty("--frog-position", "var(--frog-right)");
      break;
    case "ArrowUp":
      if (frogCurrentSquare - width >= 0) frogCurrentSquare -= width;
      rootStyles.setProperty("--frog-position", "var(--frog-up)");
      break;
    case "ArrowDown":
      if (frogCurrentSquare + width < width * width) frogCurrentSquare += width;
      rootStyles.setProperty("--frog-position", "var(--frog-down)");
      break;
  }
  FrogSquareColor();
  squareElement[frogCurrentSquare].classList.add("frog");
};

//Función para que la rana se mueva cuando está encima de un tronco
const moveFrogOnTrunks = () => {
  squareElement[frogCurrentSquare].classList.remove("frog");
  if (squareElement[frogCurrentSquare].classList.contains("trunks-to-left") && frogCurrentSquare % width !== 0) {
    frogCurrentSquare--;
  } else if (squareElement[frogCurrentSquare].classList.contains("trunks-to-right") && frogCurrentSquare % width < width - 1) {
    frogCurrentSquare++;
  }
  squareElement[frogCurrentSquare].classList.add("frog");
};

//Mover coches a la derecha
const moveCarsRight = () => {
  carsRightElement.forEach(square => {
    if (square.classList.contains("car")) {
      square.classList.remove("car");
      square.classList.add("road");
      square.nextElementSibling.classList.remove("road");
      square.nextElementSibling.classList.add("car");
    }
    if (square.classList.contains("endLine")) {
      carsRightLineElement[0].classList.remove("road");
      carsRightLineElement[0].classList.add("car");
    }
    carsRightElement = document.querySelectorAll(".cars-to-right.car");
    carsRightLineElement = document.querySelectorAll(".cars-to-right");
  });
};
//Mover coches a la izquierda
const moveCarsLeft = () => {
  carsLeftElement.forEach(square => {
    if (square.classList.contains("startLine")) {
      square.classList.remove("car");
      square.classList.add("road");
      carsLeftLineElement[8].classList.remove("road");
      carsLeftLineElement[8].classList.add("car");
    }
    if (square.classList.contains("car") && !square.classList.contains("startLine")) {
      square.classList.remove("car");
      square.classList.add("road");
      square.previousElementSibling.classList.remove("road");
      square.previousElementSibling.classList.add("car");
    }
    carsLeftElement = document.querySelectorAll(".cars-to-left.car");
    carsLeftLineElement = document.querySelectorAll(".cars-to-left");
  });
};
//Mover troncos a la derecha
const squareTrunksRightArray = ["water", "trunk1", "trunk2", "trunk3", "water", "water", "trunk1", "trunk2", "trunk3", "water"];
const moveTrunksRight = () => {
  for (i = 0; i < squareTrunksRightArray.length - 1; i++) {
    trunksRightElement[i].classList.remove("trunk1", "trunk2", "trunk3", "water");
    trunksRightElement[i].classList.add(squareTrunksRightArray[i]);
  }
  const lastElement = squareTrunksRightArray.pop();
  squareTrunksRightArray.unshift(lastElement);
};
//Mover los troncos a la izquierda
const squareTrunksLeftArray = ["trunk1", "trunk2", "trunk3", "water", "water", "trunk1", "trunk2", "trunk3", "water", "water"];
const moveTrunksLeft = () => {
  for (i = 0; i < squareTrunksLeftArray.length - 1; i++) {
    trunksLeftElement[i].classList.remove("trunk1", "trunk2", "trunk3", "water");
    trunksLeftElement[i].classList.add(squareTrunksLeftArray[i]);
  }
  const firstElement = squareTrunksLeftArray.shift();
  squareTrunksLeftArray.push(firstElement);
};

//Función para que aparezca una mosca de forma aleatoria
let checkIsFlyShow = false;

const showFly = () => {
  const randomNumber = Math.floor(Math.random() * 81);
  if (squareElement[randomNumber].classList.contains("grass")) {
    squareElement[randomNumber].classList.add("fly");
    checkIsFlyShow = true;
  } else {
    showFly();
  }
};

//Calculamos un número de segundos aleatorio para que aparezca la mosca
const timeShowFly = () => {
  return Math.floor(Math.random() * 10000);
};

//Función para mostrar una mosca cada x segundos (aleatorios)
let timeoutId;
const resetTimeout = () => {
  checkIsFlyShow = false;
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    showFly();
  }, timeShowFly());
};

//Función para sumar puntos al comer una mosca
const eatFly = () => {
  if (squareElement[frogCurrentSquare].classList.contains("fly")) {
    points += 200;
    pointsElement.textContent = `${points} points`;
    squareElement[frogCurrentSquare].classList.remove("fly");
    checkIsFlyShow = false;
    resetTimeout();
  }
};

//Función para restaurar tiempo
const restartTime = () => {
  frogCurrentSquare = 76;
  timeToFinish = 20;
  timeLeftElement.textContent = timeToFinish;
  squareElement[frogCurrentSquare].classList.add("frog");
  rootStyles.setProperty("--frog-position", "var(--frog-up)");
  intervalId = setInterval(moveElements, 1000);
  resultCheckIntervalId = setInterval(checkResult, 50);
  document.addEventListener("keydown", moveFrog);
};

//Función para cambiar del botón start/pause por restart
const changeButton = (buttonHide, buttonShow) => {
  buttonHide.classList.add("hide");
  buttonShow.classList.remove("hide");
};

//Función para ocultar elementos tras varios segundos
const hideItem = () => {
  squareElement[frogCurrentSquare].classList.remove("skull");
};

//Función si perdemos
gameOver = () => {
  if (squareElement[frogCurrentSquare].classList.contains("car") || squareElement[frogCurrentSquare].classList.contains("water") || timeToFinish === 0) {
    lifes--;
    clearInterval(intervalId);
    clearInterval(resultCheckIntervalId);
    clearTimeout(timeoutId);
    squareElement[frogCurrentSquare].classList.remove("frog");
    squareElement[frogCurrentSquare].classList.add("skull");
    document.removeEventListener("keydown", moveFrog);
    if (lifes === 0) {
      lifesElement.children[lifesElement.children.length - 1].remove();
      resultElement.classList.add("show");
      resultElement.textContent = "You Lose";
      changeButton(startPauseButtonElement, restartButtonElement);
    } else {
      squareElement[frogCurrentSquare].classList.remove("skull");
      restartTime();
      if (!checkIsFlyShow) resetTimeout();
      lifesElement.children[lifesElement.children.length - 1].remove();
      lifesElement = document.querySelector(".lifes");
    }
  }
};

//Función si ganamos
const win = () => {
  if (squareElement[frogCurrentSquare].classList.contains("finish-line")) {
    target++;
    clearInterval(intervalId);
    clearInterval(resultCheckIntervalId);
    clearTimeout(timeoutId);
    squareElement[frogCurrentSquare].classList.remove("finish-line");
    squareElement[frogCurrentSquare].classList.remove("frog");
    squareElement[frogCurrentSquare].classList.add("frog-win");
    document.removeEventListener("keydown", moveFrog);
    points += timeToFinish * 10;
    pointsElement.textContent = `${points} points`;
    if (target === 3) {
      resultElement.classList.add("show");
      resultElement.textContent = "You Win";
      changeButton(startPauseButtonElement, restartButtonElement);
    } else {
      restartTime();
      if (!checkIsFlyShow) resetTimeout();
    }
  }
};

//Función para mover los elementos
const moveElements = () => {
  timeToFinish--;
  timeLeftElement.textContent = timeToFinish;
  moveCarsRight();
  moveCarsLeft();
  moveTrunksRight();
  moveTrunksLeft();
  moveFrogOnTrunks();
};

//Comprobamos el resultado para ejecutar la función de ganar o perder
const checkResult = () => {
  gameOver();
  win();
  FrogSquareColor();
  eatFly();
};

//Restaurar las vidas al reiniciar el juego
const restartLifes = () => {
  const newLifeSpan = document.createElement("span");
  newLifeSpan.classList.add("lifes-left");
  lifesElement.append(newLifeSpan);
};

//Función para volver a iniciar el juego
const restartGame = () => {
  squareElement.forEach(square => {
    if (square.classList.contains("frog-win")) {
      square.classList.remove("frog-win");
      square.classList.add("finish-line");
    }
    if (square.classList.contains("skull")) {
      square.classList.remove("skull");
    }
    if (square.classList.contains("fly")) {
      square.classList.remove("fly");
      checkIsFlyShow = false;
    }
  });
  restartTime();
  if (!checkIsFlyShow) resetTimeout();
  lifes = 5;
  resultElement.classList.remove("show");
  points = 0;
  target = 0;
  pointsElement.textContent = `${points} points`;
  changeButton(restartButtonElement, startPauseButtonElement);
  lifesElement.textContent = "";
  for (let i = 0; i < 5; i++) {
    restartLifes();
  }
  lifesElement = document.querySelector(".lifes");
};

//Función para el botón restart
restartButtonElement.addEventListener("click", restartGame);

//Función para el botón play/pause
startPauseButtonElement.addEventListener("click", () => {
  if (intervalId) {
    startPauseButtonElement.textContent = "Start";
    clearInterval(intervalId);
    clearInterval(resultCheckIntervalId);
    clearTimeout(timeoutId);
    resultCheckIntervalId = null;
    intervalId = null;
    document.removeEventListener("keydown", moveFrog);
  } else {
    startPauseButtonElement.textContent = "Pause";
    //Configuramos el movimiento de los elementos cada segundo
    intervalId = setInterval(moveElements, 1000);
    resultCheckIntervalId = setInterval(checkResult, 50);
    document.addEventListener("keydown", moveFrog);
    if (!checkIsFlyShow) resetTimeout();
  }
});
