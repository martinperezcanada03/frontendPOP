const sections = document.querySelectorAll('#productForm > div');
let currentSection = 0;

document.getElementById('button1').addEventListener('click', () => showNextSection(1));
document.getElementById('button2').addEventListener('click', () => showNextSection(2));
document.getElementById('button3').addEventListener('click', () => showNextSection(3));
document.getElementById('button4').addEventListener('click', () => showNextSection(4));

function showNextSection(buttonClicked) {
    const currentButton = document.getElementById(`button${buttonClicked}`);
    currentButton.style.display = 'none'; 
    
    if (currentSection < sections.length - 1) {
        currentSection++; 
        sections[currentSection].style.display = 'block';
        sections[currentSection].style.clear = 'both'; 
    }

    const publicarBtn = document.getElementById('publicarBtn');
    publicarBtn.disabled = currentSection !== sections.length - 1;
}
