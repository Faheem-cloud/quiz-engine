
// ===== Get Current Language Module =====

let language = localStorage.getItem("language")

// If language not set, start from HTML
if(!language){
language = "html"
localStorage.setItem("language","html")
}

let quizQuestions = questions[language]

let currentQuestion = 0
let score = 0
let selected = null

let timeLeft = 320
let timerInterval

const questionEl = document.getElementById("question")
const optionsEl = document.getElementById("options")
const timerEl = document.getElementById("timer")


// ===== Check Questions =====

if (!quizQuestions || quizQuestions.length === 0) {

questionEl.innerText = "No questions found!"

} else {

loadQuestion()
startTimer()

}


// ===== Load Question =====

function loadQuestion() {

let q = quizQuestions[currentQuestion]

questionEl.innerText =
"Question " + (currentQuestion + 1) + " / " + quizQuestions.length + " : " + q.question

optionsEl.innerHTML = ""

selected = null

q.options.forEach((option, index) => {

let div = document.createElement("div")

div.classList.add("option")

div.innerText = option

div.onclick = function () {

document.querySelectorAll(".option").forEach(opt =>
opt.classList.remove("selected")
)

div.classList.add("selected")

selected = index

}

optionsEl.appendChild(div)

})

}


// ===== Next Question =====

function nextQuestion() {

if (selected === null) {

alert("Please select an option before continuing!")

return

}

if (selected === quizQuestions[currentQuestion].correct) {

score++

}

currentQuestion++

if (currentQuestion < quizQuestions.length) {

loadQuestion()

} else {

finishQuiz()

}

}


// ===== Finish Quiz =====

function finishQuiz() {

clearInterval(timerInterval)

// Save module score
localStorage.setItem(language + "_score", score)


// ===== Module Flow =====

if (language === "html") {

localStorage.setItem("language", "css")
window.location.href = "quiz.html"

}

else if (language === "css") {

localStorage.setItem("language", "javascript")
window.location.href = "quiz.html"

}

else {

// Quiz finished → go to result page
window.location.href = "result.html"

}

}


// ===== Timer =====

function startTimer() {

timerInterval = setInterval(() => {

timeLeft--

timerEl.innerText = "Time Left: " + timeLeft + "s"

if (timeLeft <= 0) {

finishQuiz()

}

}, 1000)

}

