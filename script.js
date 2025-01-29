const root = document.getElementById('root'); 

let currentQuestionIndex = 0; 
let score = 0; 

fetch('questions.json')
  .then((response) => response.json())
  .then((questions) => {
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Frågedatan är inte korrekt laddad!");
    }
    showStartScreen(questions); 
  })
  .catch((err) => {
    root.innerHTML = `<p>Ett fel inträffade: ${err.message}</p>`;
    console.error("Frågedatan kunde inte laddas:", err);
  });

function showStartScreen(questions) {
  root.innerHTML = `
    <div id="home" class="flex-center flex-column">
      <h1>Quiz Spel</h1>
      <button id="startBtn" class="btn">Starta Quiz</button>
    </div>
  `;
  document.getElementById('startBtn').addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion(questions); 
  });
}

function showQuestion(questions) {
  const question = questions[currentQuestionIndex];

  if (!question) {
    showResults(questions.length); 
    return;
  }

  root.innerHTML = `
    <div id="score">
      <p>Fråga ${currentQuestionIndex + 1}/${questions.length}</p>
      <p>Poäng: ${score}</p>
    </div>
    <div class="quiz-container">
      <h2>${question.question}</h2>
      <div class="options">
        ${question.options.map((option) => `<button class="btn option">${option}</button>`).join('')}
      </div>
    </div>
  `;


  document.querySelectorAll('.option').forEach((button) => {
    button.addEventListener('click', (e) => handleAnswer(e, questions));
  });
}

function handleAnswer(e, questions) {
  const selectedOption = e.target.textContent;
  const correctAnswer = questions[currentQuestionIndex].answer;

  const message = document.createElement('p');
  message.classList.add('answer-message'); 

  if (selectedOption === correctAnswer) {
    score++;
    e.target.classList.add('correct');
    message.textContent = "Rätt!";  
    message.style.color = '#28a745';
  } else {
    e.target.classList.add('incorrect');
    const correctButton = Array.from(document.querySelectorAll('.option')).find(
      (btn) => btn.textContent === correctAnswer
    );
    correctButton.classList.add('correct');
    message.textContent = "Fel!";  
    message.style.color = '#da202a';
  }

  const questionContainer = document.querySelector('.quiz-container');
  questionContainer.appendChild(message);

  setTimeout(() => {
    message.remove();
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion(questions); 
    } else {
      showResults(questions.length);
    }
  }, 1500);
}

function showResults(totalQuestions) {
  root.innerHTML = `
    <h1 id="endTitle">Quizet är slut!</h1> 
    <p id="endMessage">Du fick ${score}/${totalQuestions} rätt.</p>
    <button class="btn" id="restartBtn">Startsida</button>
  `;
  document.getElementById('restartBtn').addEventListener('click', () => {
    fetch('questions.json')
      .then((response) => response.json())
      .then((questions) => showStartScreen(questions));
  });
}

