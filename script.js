let questions = [];
let results = [];

document.addEventListener('DOMContentLoaded', function() {
    fetch('combined_questions.json')
        .then(response => response.json())
        .then(data => {
            questions = selectRandomQuestions(data, 10);
            displayQuestions(questions);
        })
        .catch(error => console.error('Error loading questions:', error));

    document.getElementById('submit').addEventListener('click', function() {
        calculateAndDisplayScore();
        highlightAnswers();
        this.disabled = true;
    });

    document.getElementById('copyScore').addEventListener('click', copyScoreToClipboard);

    displayLegend();
});

//function selectRandomQuestions(data, count) {
//    const shuffled = data.sort(() => 0.5 - Math.random());
//    return shuffled.slice(0, count);
//}

function seedBasedOnDate() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return seed;
}

function pseudoRandom(seed) {
    return () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
}


function selectRandomQuestions(data, count) {
    const seed = seedBasedOnDate();
    const random = pseudoRandom(seed);
    
    // Custom shuffle function using the pseudo-random generator
    const shuffled = data.sort(() => 0.5 - random());
    return shuffled.slice(0, count);
}


function displayQuestions(questions) {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = '';
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `<div style="background-color: ${getCategoryColor(q.category)};">${q.question}</div>`;
        const optionsDiv = document.createElement('div');

        q.options.forEach((option, optionIndex) => {
            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = `question-${index}`;
            optionInput.value = optionIndex;
            const optionLabel = document.createElement('label');
            optionLabel.appendChild(optionInput);
            optionLabel.append(option);
            optionsDiv.appendChild(optionLabel);
        });

        questionDiv.appendChild(optionsDiv);
        gameDiv.appendChild(questionDiv);
    });
}

function calculateAndDisplayScore() {
    let score = 0;
    results = [];
    questions.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
        const correct = selectedOption && parseInt(selectedOption.value) === q.answer;
        score += correct ? 1 : 0;
        results.push(correct);
    });
    document.getElementById('score').textContent = `Your score: ${score}/${questions.length}`;
}

function highlightAnswers() {
    questions.forEach((q, index) => {
        const options = document.querySelectorAll(`input[name="question-${index}"]`);
        options.forEach((option, optionIndex) => {
            const parentLabel = option.parentElement;
            parentLabel.style.backgroundColor = optionIndex === q.answer ? (results[index] ? '#90ee90' : '#ffcccb') : 'transparent';
            option.disabled = true;
        });
    });
}

function copyScoreToClipboard() {
    const scoreText = document.getElementById('score').textContent;
    const emojiResults = results.map(result => result ? '🟩' : '🟥').join('');
    const clipboardText = `${scoreText} ${emojiResults}`;

    navigator.clipboard.writeText(clipboardText).then(() => {
        alert('Score copied to clipboard!');
    }, err => {
        console.error('Could not copy text: ', err);
    });
}

function getCategoryColor(category) {
    const colors = {
        "Animals": "#FFD700",
        "Brain Teasers": "#FFA07A",
        "Entertainment": "#20B2AA",
        "Geography": "#E6E6FA",
        "History": "#FF6347",
        "Humanities": "#DA70D6",
        "Literature": "#6495ED",
        "Movies": "#F08080",
        "Music": "#DB7093",
        "People": "#AFEEEE",
        "Rated": "#BDB76B",
        "Science & Technology": "#6A5ACD",
        "Sports": "#48D1CC",
        "Television": "#DDA0DD",
        "Video Games": "#9ACD32",
        "Other": "#D3D3D3", // Combines 'General' and 'World'
    };
    return colors[category] || "#D3D3D3"; // Default color
}

function displayLegend() {
    const legendDiv = document.getElementById('legend');
    legendDiv.innerHTML = '';

    const categories = ["Animals", "Brain Teasers", "Entertainment", "Geography", "History", "Humanities", "Literature", "Movies", "Music", "People", "Rated", "Science & Technology", "Sports", "Television", "Video Games", "Other"];
    
    categories.forEach(category => {
        const color = getCategoryColor(category);
        const colorSwatch = document.createElement('div');
        colorSwatch.style.backgroundColor = color;
        colorSwatch.style.width = "20px";
        colorSwatch.style.height = "20px";
        colorSwatch.style.display = "inline-block";
        colorSwatch.style.marginRight = "10px";
        const textSpan = document.createElement('span');
        textSpan.textContent = category;
        const legendItem = document.createElement('div');
        legendItem.className = "legend-item";
        legendItem.appendChild(colorSwatch);
        legendItem.appendChild(textSpan);
        legendDiv.appendChild(legendItem);
    });
}

