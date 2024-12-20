'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.querySelector('.card-container');
    const cards = document.querySelectorAll('.card');
    const nextButton = document.getElementById('next-button');

    function initCards() {
        const newCards = document.querySelectorAll('.card:not(.removed)');
        newCards.forEach((card, index) => {
            card.style.zIndex = cards.length - index;
            card.style.transform = `scale(${1 - index * 0.05}) translateY(-${index * 30}px)`;
            card.style.opacity = 1 - index * 0.2;
        });
    }

    initCards();

    cards.forEach((card) => {
        const hammer = new Hammer(card);
        
        // Handle swipe/pan gestures
        hammer.on('pan', (event) => {
            card.classList.add('moving');
            const x = event.deltaX;
            const y = event.deltaY;
            const rotation = x / 20;
            card.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        });

        // Handle end of pan gesture
        hammer.on('panend', (event) => {
            card.classList.remove('moving');
            const keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

            if (keep) {
                card.style.transform = '';
            } else {
                const moveOutWidth = document.body.clientWidth;
                const endX = event.deltaX > 0 ? moveOutWidth : -moveOutWidth;
                const endY = event.deltaY;
                card.style.transform = `translate(${endX}px, ${endY}px) rotate(${event.deltaX > 0 ? 30 : -30}deg)`;
                card.classList.add('removed');
                setTimeout(() => {
                    cardContainer.removeChild(card);
                    initCards();
                }, 300);
            }
        });
    });

    // Next button functionality
    nextButton.addEventListener('click', () => {
        const currentCard = document.querySelector('.card:not(.removed)');
        if (!currentCard) return;
        currentCard.classList.add('removed');
        currentCard.style.transform = `translate(${window.innerWidth}px, -100px) rotate(30deg)`;
        setTimeout(() => {
            cardContainer.removeChild(currentCard);
            initCards();
        }, 300);
    });
});
