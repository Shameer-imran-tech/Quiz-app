document.addEventListener("DOMContentLoaded", () => {
  let currentQuestionIndex = 0;
  let score = 0;
  let timer;
  let shuffledQuestions = [];
  let questionHistory = [];

  // DOM Elements
  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultsScreen = document.getElementById("results-screen");
  const questionNumber = document.getElementById("question-number");
  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const nextButton = document.getElementById("next-btn");
  const prevButton = document.getElementById("prev-btn");
  const resultButton = document.getElementById("result-btn");
  const timerDisplay = document.getElementById("timer");
  const scoreDisplay = document.getElementById("score");

  document.getElementById("start-btn").addEventListener("click", startQuiz);
  nextButton.addEventListener("click", nextQuestion);
  prevButton.addEventListener("click", prevQuestion);
  resultButton.addEventListener("click", showResults);
  document.getElementById("restart-btn").addEventListener("click", restartQuiz);

  function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    questionHistory = [];
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    loadQuestion();
  }

  function loadQuestion() {
    const question = shuffledQuestions[currentQuestionIndex];
    questionNumber.textContent = `Question ${currentQuestionIndex + 1}/${
      shuffledQuestions.length
    }`;
    questionText.textContent = question.question;
    optionsContainer.innerHTML = "";

    prevButton.classList.toggle("hidden", currentQuestionIndex === 0);
    nextButton.classList.toggle(
      "hidden",
      currentQuestionIndex === shuffledQuestions.length - 1
    );
    resultButton.classList.toggle(
      "hidden",
      currentQuestionIndex !== shuffledQuestions.length - 1
    );

    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.classList.add("option");
      button.textContent = option;
      if (question.answer > -1) {
        button.style.pointerEvents = "none";
        if (question.answer === index) {
          button.classList.add(
            question.answer === question.correct ? "correct" : "wrong"
          );
        }
        if (question.answer !== index && question.correct === index) {
          button.classList.add("correct");
        }
      }
      button.addEventListener("click", () => checkAnswer(index));
      optionsContainer.appendChild(button);
    });

    startTimer();
  }

  function startTimer() {
    let timeLeft = 30;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `Time: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        checkAnswer(-1);
      }
    }, 1000);
  }

  function checkAnswer(selectedIndex) {
    clearInterval(timer);
    const question = shuffledQuestions[currentQuestionIndex];
    const options = optionsContainer.children;

    Array.from(options).forEach((option) => {
      option.style.pointerEvents = "none";
    });

    if (selectedIndex === question.correct) {
      options[selectedIndex].classList.add("correct");
      score += 10;
    } else {
      if (selectedIndex !== -1) {
        options[selectedIndex].classList.add("wrong");
      }
      options[question.correct].classList.add("correct");
    }
    question.answer = selectedIndex;
    if (!questionHistory.includes(question)) {
      questionHistory.push(question);
    }
  }

  function nextQuestion() {
    if (currentQuestionIndex < questionHistory.length - 1) {
      currentQuestionIndex++;
    } else {
      let remainingQuestions = shuffledQuestions.filter(
        (q) => !questionHistory.includes(q)
      );
      if (remainingQuestions.length > 0) {
        let nextQuestion =
          remainingQuestions[
            Math.floor(Math.random() * remainingQuestions.length)
          ];
        questionHistory.push(nextQuestion);
        currentQuestionIndex++;
      }
    }
    loadQuestion();
  }

  function prevQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      loadQuestion();
    }
  }

  function showResults() {
    quizScreen.classList.add("hidden");
    resultsScreen.classList.remove("hidden");
    scoreDisplay.textContent = score;
  }

  function restartQuiz() {
    resultsScreen.classList.add("hidden");
    questions.forEach((q) => (q.answer = -1));
    startQuiz();
  }
});
