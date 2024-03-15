document.addEventListener('DOMContentLoaded', function() {
    const questions = generateQuestionsForToday();
    displayQuestions(questions);

    document.getElementById('submit').addEventListener('click', function() {
        const score = calculateScore(questions);
        document.getElementById('score').textContent = `Your score: ${score}/${questions.length}`;
    });
});

function generateQuestionsForToday() {
    // Simulate loading questions based on today's date
    // For simplicity, we're using the date to generate question IDs
    const seed = new Date().getDate();
    const questions = [];
    for (let i = 0; i < 5; i++) {
        questions.push({
            question: `What is ${seed + i}?`,
            options: [seed + i - 1, seed + i, seed + i + 1, seed + i + 2],
            answer: 1 // The correct answer is always the second option for simplicity
        });
    }
    return questions;
}

function displayQuestions(questions) {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = ''; // Clear previous content
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `<div>${q.question}</div>`;

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';
        q.options.forEach((option, optionIndex) => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question-${index}`;
            input.value = optionIndex;
            label.appendChild(input);
            label.append(option);
            optionsDiv.appendChild(label);
        });

        questionDiv.appendChild(optionsDiv);
        gameDiv.appendChild(questionDiv);
    });
}

function calculateScore(questions) {
    let score = 0;
    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="question-${index}"]:checked`);
        if (selected && parseInt(selected.value) === q.answer) {
            score++;
        }
    });
    return score;
}
