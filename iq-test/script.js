let questions = [];
let currentQuestionIndex = 0;
let score = [];
let trueScore = 0;
let selectedAnswerIndex = [];
let timer; // Variable to hold the timer interval
let elapsedTime = 0; // Time in seconds

// Function to load questions from a text file
async function loadQuestions() {
    const response = await fetch('questions.txt');
    const text = await response.text();
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; ) {
        const questionText = lines[i++];
        const numberOfAnswers = parseInt(lines[i++]);
        const answers = [];

        for (let j = 0; j < numberOfAnswers; j++) {
            answers.push(lines[i++]);
            score.push(0); // Initialize score for each question
        }

        const correctAnswerIndex = parseInt(lines[i++]); // Read the correct answer index
        questions.push({ questionText, answers, correctAnswerIndex });
    }
}

// Function to start the stopwatch
function startStopwatch() {
    timer = setInterval(() => {
        elapsedTime++;
        updateTimestamp();
    }, 1000); // Update every second
}

// Function to update the timestamp display
function updateTimestamp() {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    document.getElementById('timestamp').innerText = `Time: ${minutes}m ${seconds}s`;
}

// Function to render the current question
function renderQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ''; // Clear previous content

    const currentQuestion = questions[currentQuestionIndex];
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `<h3>${currentQuestion.questionText}</h3>`;

    currentQuestion.answers.forEach((answer, index) => {
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = `question${currentQuestionIndex}`;
        radioInput.value = index; // Store the index of the answer
        if (index === selectedAnswerIndex[currentQuestionIndex]) radioInput.checked = true; // Check previously selected answer
        questionDiv.appendChild(radioInput);

        const label = document.createElement('label');
        label.innerText = answer;
        questionDiv.appendChild(label);
        questionDiv.appendChild(document.createElement('br')); // Line break for better formatting
    });

    quizContainer.appendChild(questionDiv);
    updateButtons();
    updateProgressBar();
}

// Function to update button states
function updateButtons() {
    document.getElementById('prev').disabled = currentQuestionIndex === 0;
    document.getElementById('next').innerText = currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next';
}

// Function to handle next button click
function handleNext() {
    const selectedOption = document.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);
    
    if (!selectedOption) {
        alert("Please select an answer before proceeding.");
        return; // Prevent moving to the next question if no answer is selected
    }

    // Check if the selected answer is correct
    selectedAnswerIndex[currentQuestionIndex] = parseInt(selectedOption.value);
    const currentQuestion = questions[currentQuestionIndex];

    // Verify the answer
    if (selectedAnswerIndex[currentQuestionIndex] === currentQuestion.correctAnswerIndex) {
        console.log("Correct answer!");
        score[currentQuestionIndex] = 1;
    } else {
        console.log("Incorrect answer.");
        score[currentQuestionIndex] = 0;
    }

    // Move to the next question
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
        updateProgressBar(); // Update progress bar
    } else {
        clearInterval(timer);
        displayResults();
    }
}

function handlePrev() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
        updateProgressBar(); // Update progress bar
    }
}

// Function to update the progress bar
function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progress = ((currentQuestionIndex + 1) / 20) * 100;
    progressBar.style.width = `${progress}%`;
}

// Function to display results and estimate IQ
function displayResults() {
    const adjustedScore = calculateAdjustedScore();
    const estimatedIQ = estimateIQ(adjustedScore);
    const feedback = generateFeedback(estimatedIQ);

    // Display results
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `
        <p>Quiz Finished! You scored ${trueScore} out of ${questions.length}. ${document.getElementById('timestamp').innerText}</p>
        <p>Your estimated IQ is: <strong>${estimatedIQ}</strong></p>
        <ul>${feedback}</ul>
    `;

    document.getElementById('quiz-container').innerHTML = '';
    document.getElementById('prev').disabled = true;
    document.getElementById('next').disabled = true;
}

// Function to calculate adjusted score based on time
function calculateAdjustedScore() {
    let multiplier;
    if (elapsedTime <= 5 * 60) { // 5 minutes or less
        multiplier = 1.5; // Excellent performance
    } else if (elapsedTime <= 7 * 60) { // 5 to 7 minutes
        multiplier = 1.2; // Good performance
    } else if (elapsedTime <= 10 * 60) { // 8 to 10 minutes
        multiplier = 1.0; // Average performance
    } else { // More than 10 minutes
        multiplier = 0.8; // Below average performance
    }
    // Add all values in the score array to trueScore
    score.forEach(value => {
        trueScore += value;
    });

    // Calculate the adjusted score
    const adjustedScore = trueScore * multiplier;

    // Cap the adjusted score at 30
    return Math.min(adjustedScore, 30);
}

// Function to estimate IQ based on adjusted score
function estimateIQ(adjustedScore) {
    if (adjustedScore >= 27) {
        return "IQ 140+";
    } else if (adjustedScore >= 22) {
        return "IQ 120-139";
    } else if (adjustedScore >= 15) {
        return "IQ 100-119";
    } else if (adjustedScore >= 10) {
        return "IQ 85-99";
    } else {
        return "Below IQ 85";
    }
}

// Function to generate feedback based on estimated IQ
function generateFeedback(estimatedIQ) {
    let feedback = '';

    if (estimatedIQ === "IQ 140+") {
        feedback = `
            <li><strong>Impressive Achievement!</strong> You must be a genius!</li>
            <li>Your advanced problem-solving skills are remarkable.</li>
            <li>Consider exploring elite programs or organizations like MENSA.</li>
        `;
    } else if (estimatedIQ === "IQ 120-139") {
        feedback = `
            <li><strong>Above Average Intelligence!</strong> You are likely to excel in academic and professional settings.</li>
            <li>With continued effort, you can reach even higher levels of achievement.</li>
        `;
    } else if (estimatedIQ === "IQ 100-119") {
        feedback = `
            <li><strong>Average to Above Average!</strong> You have a good understanding of the material.</li>
            <li>Consider targeting specific skills to enhance your performance.</li>
        `;
    } else if (estimatedIQ === "IQ 85-99") {
        feedback = `
            <li><strong>Room for Improvement!</strong> There are significant areas to work on.</li>
            <li>Identify specific weaknesses and seek resources to improve.</li>
        `;
    } else {
        feedback = `
            <li><strong>Below Average!</strong> It's important to engage with the material more.</li>
            <li>With dedication and practice, you can enhance your abilities.</li>
        `;
    }

    return feedback;
}

// Event listeners for buttons
document.getElementById('next').addEventListener('click', handleNext);
document.getElementById('prev').addEventListener('click', handlePrev);

// Event listener for spacebar to trigger the Next button
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault(); // Prevent scrolling when space is pressed
        handleNext(); // Call the handleNext function
    }
  });  

// Load questions and start the quiz
loadQuestions().then(() => {
    renderQuestion();
    startStopwatch();
});