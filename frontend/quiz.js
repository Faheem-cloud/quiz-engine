let language = localStorage.getItem("language")

let quizQuestions = questions[language]

let currentQuestion = 0
let score = 0
let selected = null

let timeLeft = 320
let timerInterval

const questionEl = document.getElementById("question")
const optionsEl = document.getElementById("options")
const timerEl = document.getElementById("timer")


// Check if questions exist
if (!quizQuestions || quizQuestions.length === 0) {

    questionEl.innerText = "No questions found!"

} else {

    loadQuestion()
    startTimer()

}


// Load Question
function loadQuestion() {

    let q = quizQuestions[currentQuestion]

    // Add question number
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


// Next Question
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


// Finish Quiz
function finishQuiz() {

    clearInterval(timerInterval)

    // Save score of current module
    localStorage.setItem(language + "_score", score)


    // Course Flow Control
    if (language === "html") {

        localStorage.setItem("language", "css")
        window.location.href = "quiz.html"

    }

    else if (language === "css") {

        localStorage.setItem("language", "javascript")
        window.location.href = "quiz.html"

    }

    else {

        // After JavaScript quiz
        window.location.href = "result.html"

    }

}


// Timer
function startTimer() {

    timerInterval = setInterval(() => {

        timeLeft--

        timerEl.innerText = "Time Left: " + timeLeft + "s"

        if (timeLeft <= 0) {

            finishQuiz()

        }

    }, 1000)

}