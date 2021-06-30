//Documented HTML selectors 
var startButton = document.querySelector('#start');
var timerEl = document.querySelector('#timer');
var results = document.querySelector('.result-box');
var gameover = document.querySelector('#gameover');
var questionTitle = document.querySelector('#question');
var multipleChoices = document.querySelector('#multiplechoices');
var correctAnswer = document.querySelector('#correctAnswer');
var submitButton = document.querySelector('#submit');
var answerTextInfo = document.querySelector('#answerText');
var scorecard = document.querySelector('#score');
var infoBox = document.querySelector('#info-box');
var quizBox = document.querySelector('.quiz-box');

var initials = ""; // this is for the user initials
var timeLeft = 40; // initial start time 
var score = 0; //intial score 
var current; // holds the index of the current question

// Lists the five questions in a list of dictionaries
let myQuestions = [{
        question: "Which of the following is true about variable naming conventions in JavaScript?",
        answers: {
            a: "Begin with a letter or underscore character",
            b: "Names are case sensitive",
            c: "Both A and B",
            d: "None of the above",
        },
        correctAnswer: "c"
    },
    {
        question: "Which tool can you use to ensure code quality?",
        answers: {
            a: "Angular",
            b: "jQuery",
            c: "RequireJS",
            d: "ESLint"
        },
        correctAnswer: "d"
    },
    {
        question: "Which of the following is the correct syntax to print a page using JavaScript?",
        answers: {
            a: "window.print()",
            b: "browser.print()",
            c: "navigator.print()",
            d: "none of the above"
        },
        correctAnswer: "a"
    },
    {
        question: "Which of the following type of variable takes precedence over other if names are same?",
        answers: {
            a: "local variable",
            b: "global variable",
            c: "both of the above",
            d: "none of the above"
        },
        correctAnswer: "a"
    },
    {
        question: "Which built-in method sorts the elements of an array?",
        answers: {
            a: "changeOrder()",
            b: "order()",
            c: "sort()",
            d: "none of the above"
        },
        correctAnswer: "c"
    }
]

//local storage for the score card
var lastScore = localStorage.getItem("scorecard");
scorecard.textContent = lastScore;

//initiate functions to start game and submit answer 
submitButton.addEventListener("click", submitAnswer);
startButton.addEventListener("click", initiate);

// Function that states the quiz, prompts user for initials, and shuffles the questions to begin, as well as starts the timer
function initiate() {
    score = 0;
    initials = prompt("What are your initials?");
    submitButton.style.display = '';
    shuffle(myQuestions);
    current = 0; // points at the initial marker
    multipleChoices.textContent = "";
    showQuestion(myQuestions[current]);
    infoBox.style.display = 'none';
    gameover.textContent = "";
    quizBox.style.display = '';
    results.style.display = '';
    timeLeft = 40;
    countdown();
}

//shuffles the questions array 
function shuffle(array) {
    var currentIndex = array.length;
    var randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

function submitAnswer() {
    // 1 - get the correct answer for the current question <- this is the letter
    let answerToCurrentQuestion = myQuestions[current].correctAnswer;
    let answerText = myQuestions[current].answers[answerToCurrentQuestion];
    // change answer field to reflect the answer
    correctAnswer.textContent = `Answer to Previous Question: ${answerToCurrentQuestion}`;
    // 2 - check if the submitted answer matches the correct answer
    if (document.querySelector('input[name="answer"]:checked') === null) {
        alert('Please select an answer');
        return;
    }

    // Getting the answer checked by the user 
    var checkedAnswer = document.querySelector('input[name="answer"]:checked').value;

    // If the user answer is correct, increase the score for the user (which means we need a variable to keep track of the score)
    // If the answer is wrong, we decrement the timer
    if (checkedAnswer === answerText) {
        answerTextInfo.textContent = "Correct Answer!";
        score++;
    } else {
        answerTextInfo.textContent = "Wrong Answer!";
        timeLeft -= 5;
    }

    //index that increases as we filter through the given questions. once you have reached the total questions, game will end 
    current++;
    multipleChoices.textContent = "";
    if (current < myQuestions.length) {
        showQuestion();
    } else {
        setGameOver();
        timeLeft = 0;
    }
}

var timerInterval = null;

//display the questions with multiple choice answers to the browser
function showQuestion() {
    let questionInfo = myQuestions[current];
    questionTitle.textContent = questionInfo.question;

    for (let key in questionInfo.answers) {
        let node = document.createElement("input");
        node.type = "radio";
        node.id = "answer" + key;
        node.name = "answer";
        node.value = questionInfo.answers[key];
        multipleChoices.appendChild(node)
        let label = document.createElement("label");
        label.for = "answer" + key;
        label.textContent = key + ". " + questionInfo.answers[key];
        multipleChoices.appendChild(label)
        let brk = document.createElement("br");
        multipleChoices.appendChild(brk)
    }
}

//countdown for timer, once the timer is equal to 0 the game will end
function countdown() {
    clearInterval(timerInterval);
    timerInterval = setInterval(function () {
        timerEl.textContent = `${timeLeft} seconds left!`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timerInterval);
            timerEl.textContent = "";
            setGameOver();
        }
    }, 1000);
}

//displays text for quiz over, and scorecard that is stored to local storage
function setGameOver() {
    gameover.textContent = "Quiz is Over!";
    multipleChoices.textContent = "";
    questionTitle.textContent = "";
    correctAnswer.textContent = "";
    answerTextInfo.textContent = "";
    submitButton.style.display = 'none';
    quizBox.style.display = 'none';
    scorecard.textContent = `${initials}'s score: ${score / 5 * 100}% `;
    localStorage.setItem("scorecard", scorecard.textContent);
}