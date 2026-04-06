let questions = {
  EI: [],
  SN: [],
  FT: [],
  JP: []
};

let currentIndices = {
  EI: 0,
  SN: 0,
  FT: 0,
  JP: 0
};

let scores = {
  EI: 0,
  SN: 0,
  FT: 0,
  JP: 0
};

let finalResult = {
  EI: '50',
  SN: '50',
  FT: '50',
  JP: '50'
};

let currentCategory = ''; // To hold the current category

let qnum = 0;

// Load questions from text files
async function loadQuestions() {
  const db = ['db/EI.txt', 'db/SN.txt', 'db/FT.txt', 'db/JP.txt'];
  const categories = ['EI', 'SN', 'FT', 'JP'];

  for (let i = 0; i < db.length; i++) {
      const response = await fetch(db[i]);
      const text = await response.text();
      questions[categories[i]] = text.split('\n');

      // Store questions in the corresponding category

  }
}

// Function to get a random question
// Function to get a random question
function getRandomQuestion() {
  // Check if all trait indices are equal to 10
  if (currentIndices.EI === 10 && currentIndices.SN === 10 && currentIndices.FT === 10 && currentIndices.JP === 10) {
      return null; // Return null if all questions have been answered
  }

  const categories = Object.keys(questions);
  let selectedCategory;
  let randomIndex;

  // Try to find a valid question
  do {
      // Randomly select a category
      const randomCategoryIndex = Math.floor(Math.random() * categories.length);
      selectedCategory = categories[randomCategoryIndex];

      // Get the current index for the selected category
      randomIndex = currentIndices[selectedCategory];
      console.log(randomIndex);

  } while (randomIndex >= 10); // Continue only if the index is within the bounds

  currentCategory = selectedCategory; // Set the current category
  return { question: questions[selectedCategory][randomIndex], category: selectedCategory, index: randomIndex};
}

// Render the current question
// Render the current question
function renderQuestion() {
  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = ''; // Clear previous content
  const questionData = getRandomQuestion(); // Get a random question
  console.log(currentCategory + " "+ questionData.index);

  if (questionData) {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'question';
      questionDiv.innerHTML = `<h3>${questionData.question}</h3>`;

      // Create radio buttons for agreement levels
      const agreementLevels = ["Fully Disagree", "Disagree", "Neutral", "Agree", "Fully Agree"];
      agreementLevels.forEach((level, index) => {
          const radioInput = document.createElement('input');
          radioInput.type = 'radio';
          radioInput.name = `question${questionData.category}`; // Use category name for grouping
          radioInput.value = index; // Store the index of the answer
          questionDiv.appendChild(radioInput);

          const label = document.createElement('label');
          label.innerText = level;
          questionDiv.appendChild(label);
          questionDiv.appendChild(document.createElement('br')); // Line break for better formatting
      });

      quizContainer.appendChild(questionDiv);
  } else {
      // If no question data is returned, display results
      displayResults(); // Call displayResults if all questions have been answered
  }
  qnum++;
  updateProgressBar();
}

// Handle next button click
function handleNext() {
  const selectedOption = document.querySelector(`input[name="question${currentCategory}"]:checked`);
  
  if (!selectedOption) {
      alert("Please select an answer before proceeding.");
      return; // Prevent moving to the next question if no answer is selected
  }

  // Store the selected answer index
  const selectedAnswerIndexValue = parseInt(selectedOption.value);

  // Update scores based on the selected answer
  const scoreValue = selectedAnswerIndexValue === 0 ? -10 :
                     selectedAnswerIndexValue === 1 ? -5 :
                     selectedAnswerIndexValue === 2 ? 0 :
                     selectedAnswerIndexValue === 3 ? 5 :
                     selectedAnswerIndexValue === 4 ? 10 : 0;

  // Update the score based on the index of the question
  if (currentIndices[currentCategory] % 2 === 1) {
      // Even index: add score
      scores[currentCategory] += scoreValue;
  } else {
      // Odd index: subtract score
      scores[currentCategory] -= scoreValue;
  }
  console.log(currentCategory + " Score: " + scores[currentCategory]);
  // Update the current index for the selected category
  currentIndices[currentCategory]++;

  // Check if all trait indices are equal to 10
  if (currentIndices.EI === 10 && currentIndices.SN === 10 && currentIndices.FT === 10 && currentIndices.JP === 10) {
      displayResults(); // Display results if all questions have been answered
      return;
  }

  // Render the next question
  renderQuestion();
}

// Display results
function displayResults() {

  scores.EI=scores.EI/2+50;
  scores.SN=scores.SN/2+50;
  scores.FT=scores.FT/2+50;
  scores.JP=scores.JP/2+50;

  if(scores.EI>=50)
    finalResult.EI = 'E';
  else
    finalResult.EI = 'I';

  if(scores.SN>=50)
    finalResult.SN = 'S';
  else
    finalResult.SN = 'N';

  if(scores.FT>=50)
    finalResult.FT = 'F';
  else
    finalResult.FT = 'T';

  if(scores.JP>=50)
    finalResult.JP = 'J';
  else
    finalResult.JP = 'P';
  const yourType = finalResult.EI+finalResult.SN+finalResult.FT+finalResult.JP;
  const path = "/personality-types/"+finalResult.EI+"/"+finalResult.SN+"/"+finalResult.FT+"/"+finalResult.JP+"/index.html";
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = `
      <h2>Result: <a href= ${path}>${yourType}</a></h2>
      <p class= \"resultt\">Your scores:</p>
      <ul>
          <li>E/I: ${scores.EI}</li>
          <li>S/N: ${scores.SN}</li>
          <li>F/T: ${scores.FT}</li>
          <li>J/P: ${scores.JP}</li>
      </ul>
  `;
  document.getElementById('quiz-container').innerHTML = '';
  document.getElementById('next').disabled = true; // Disable next button after finishing
}

// Event listeners for buttons
document.getElementById('next').addEventListener('click', handleNext);

// Event listener for spacebar to trigger the Next button
document.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
      event.preventDefault(); // Prevent scrolling when space is pressed
      handleNext(); // Call the handleNext function
  }
});

function updateProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  const progress = (qnum / 40) * 100;
  progressBar.style.width = `${progress}%`;
}

// Load questions and start the quiz
loadQuestions().then(() => {
  renderQuestion();
});