const cards = document.querySelectorAll('.card');
const nextButton = document.getElementById('next-button');

let startX = 0;
let currentX = 0;

const handleStart = (event) => {
    startX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
    const card = event.currentTarget;
    card.style.transition = 'none';
};

const handleMove = (event) => {
    if (!startX) return;

    currentX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
    const deltaX = currentX - startX;
    const card = event.currentTarget;

    card.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
};

const handleEnd = (event) => {
    const card = event.currentTarget;
    const deltaX = currentX - startX;
    const moveOutWidth = window.innerWidth / 2;

    if (Math.abs(deltaX) > moveOutWidth) {
        swipeCard(card, deltaX > 0 ? 1 : -1);
    } else {
        card.style.transition = 'transform 0.5s ease-out';
        card.style.transform = 'translateX(0) rotate(0)';
    }

    startX = 0;
};

const swipeCard = (card, direction) => {
    const moveOutWidth = window.innerWidth / 2;
    card.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    card.style.transform = `translateX(${direction * moveOutWidth * 2}px) rotate(${direction * 30}deg)`;
    card.style.opacity = '0';

    // Remove card after animation
    setTimeout(() => {
        card.remove();
        updateCardStack();
    }, 500);
};

const updateCardStack = () => {
    const remainingCards = document.querySelectorAll('.card');
    remainingCards.forEach((card, index) => {
        card.style.zIndex = remainingCards.length - index;
        card.style.transform = `scale(${1 - index * 0.05}) translateY(${index * 10}px)`;
    });
};

// Programmatically swipe the next card
nextButton.addEventListener('click', () => {
    const topCard = document.querySelector('.card');
    if (topCard) {
        swipeCard(topCard, 1); // Swipe to the right
    }
});

// Attach event listeners to cards
cards.forEach((card) => {
    card.addEventListener('mousedown', handleStart);
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseup', handleEnd);

    card.addEventListener('touchstart', handleStart);
    card.addEventListener('touchmove', handleMove);
    card.addEventListener('touchend', handleEnd);
});
