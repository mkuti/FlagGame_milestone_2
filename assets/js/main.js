// setting variables for the whole game
const url = 'https://restcountries.eu/rest/v2/all';
const homeContainer = document.getElementById("home-container");
const gameContainer = document.getElementById("game-container");
const gameOver = document.getElementById("game-over");
const reset = document.getElementById("reset");
const mode = document.getElementById("mode");
const matchFlagBanner = document.getElementById("attention");
const clickGame = document.getElementsByClassName("game");
const startFlag = document.getElementById("flag-button");
const startCountry = document.getElementById("country-button");
const flag = document.querySelector("#flag img");
const answerItem = document.getElementsByClassName("answer-item");
const answers = Array.from(document.getElementsByClassName("answer-item"));
const questionInfo = document.getElementById("question-count");
const scoreInfo = document.getElementById("score-count");
let number;
let countryArray; //contains fetched data
let currentQuestion = [];
let MatchCountry;
let filteredQuestion;
let filteredAnswers;

let score = 0;
let questionCount = 0;
const maxQuestions = 20;

console.log(matchFlagBanner);

/* add events listeners */
startFlag.addEventListener("click", function(){
        homeContainer.classList.add("d-none");
        matchFlagBanner.classList.add("d-none");
        gameContainer.classList.remove("d-none");
        reset.classList.remove("d-none");
        mode.classList.remove("d-none");
        fetchApi();
})

/* fetching rest country API */
function fetchApi () {
    return fetch(url)
    .then(response => response.json())
    .then(data => {
        countryArray = data; /*defining countryArray variable to the fetched data*/
       
    startGame();
      })
    
    .catch(err => console.log(err))

}

function startGame() {
  questionCount = 0;
  score = 0;
  pushCurrentQuestion();
}


/* function retrieves a random number with Math.random() and through array.sort, it compares two items and sorts their index depending on the result being positive negative or 0. */
function shuffleData () {
    return countryArray.sort(() => Math.random() - 0.5);   /*while sorting the array and comparing its items, applying function to return a floating-point, pseudo-random number in the range of 0 and 1: The sole determinant of whether the elements are swapped or not is the return value of the compare function.*/
}

/* function to mix the html answers items which I have created an array from */
function mixAnswersItem () {
    number = Math.floor(Math.random() * answers.length); /* Math.floor() function returns the largest integer less than or equal to a floating-point, pseudo-random number in the range of array length */
}

/* function to pull question which is an array of the first 4 countries after original arraw was shuffled */
function pushCurrentQuestion () {
    if(questionCount >= maxQuestions) {
        gameContainer.classList.add("d-none");
        gameOver.classList.remove("d-none");
    }

    questionCount++;
    questionInfo.innerText = `${questionCount}/${maxQuestions}`;
    scoreInfo.innerText = score;
    currentQuestion = []; /* empty current question array each time this function is called and current question is answered correctly */
    shuffleData(); /* calling function to shuffle countryArray each time a current question is pulled */
    currentQuestion.push(...countryArray.slice(0,4));
    
    selectingCountrytoMatch(); /* calling function to select country to match from the current question */
}

/* function to select randomly country to match from the current question array */
function selectingCountrytoMatch() {
    let countryIndex = Math.floor(Math.random() * currentQuestion.length); /* defining a random index to each country in the array */
    MatchCountry = currentQuestion[countryIndex]; /* defining an empty variable to a random index of current question array */
/* calling here functions to make the game displayed and after being clicked match verified */
    displayingFlag()
    displayingCountriesName()
    verifyMatch();

    console.log(currentQuestion)
    console.log(MatchCountry);
}

/* function to display flag from the MatchCountry variable */
function displayingFlag() {
    flag.src = MatchCountry.flag;
}

/* function to assign a random country name from the current question array to a different answer item */
function displayingCountriesName() {
    mixAnswersItem (answers)
    answers[0].innerText = currentQuestion[3].name;
    answers[1].innerText = currentQuestion[2].name;
    answers[2].innerText = currentQuestion[0].name;
    answers[3].innerText = currentQuestion[1].name;
}

/* function to verify match after clicking on each answer item */
function verifyMatch() {
    answers.forEach(answer => { /* for each element of the answers array, we listen to a click and we study its value */
        answer.addEventListener("click", e => {
            let clickedAnswer = e.target;
            let match = clickedAnswer.innerText.toLowerCase() == MatchCountry.name.toLowerCase(); /* define a variable to confirm a match with boolean value between 2 conditions */
            console.log(match)
            if(match == true){ /* if match variable is true, alert is displayed */
                Swal.fire('Well done! Continue to the next match challenge').then((result) => {
                    if (result.value) {
                        score++;
                        pushCurrentQuestion();
                        console.log(countryArray)
                    }
                });  
                        } else Swal.fire(`Sorry it was ${MatchCountry.name}.`).then((result) => {
                    if (result.value) {
                        pushCurrentQuestion();
                        console.log(countryArray)
                    }
                });  ;
          });
        })
    }