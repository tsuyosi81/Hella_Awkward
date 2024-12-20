'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.querySelector('.card-container');
    const cards = document.querySelectorAll('.card');
    const nextButton = document.getElementById('next-button');
    let isPanActive = false;
    let currentCard = null;
    let lastX = 0;
    let lastY = 0;

    function initCards() {
        const newCards = document.querySelectorAll('.card:not(.removed)');
        newCards.forEach((card, index) => {
            card.style.zIndex = newCards.length - index;
            card.style.transform = `scale(${1 - index * 0.05}) translateY(-${index * 30}px)`;
        });
    }

    function createNewCard() {
        const newCard = document.createElement('div');
        newCard.className = 'card';
        newCard.innerHTML = `
            <p><span style="text-decoration: underline;">New Card</span><br><br>How has your partner made you a better person?</p>
            <h1 class="weird">Weird</h1>
        `;
        cardContainer.appendChild(newCard);

        // Attach pan listeners to the new card
        attachPanListeners(newCard);
    }

    function attachPanListeners(card) {
        const hammer = new Hammer(card);

        hammer.on('panstart', (event) => {
            isPanActive = true;
            currentCard = card;
            currentCard.classList.add('moving');
        });

        hammer.on('panmove', (event) => {
            if (!isPanActive || !currentCard) return;

            // Use requestAnimationFrame to avoid layout thrashing
            requestAnimationFrame(() => {
                const deltaX = event.deltaX;
                const deltaY = event.deltaY;

                // Apply the translation and rotation directly
                const rotation = deltaX / 20;
                currentCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
            });
        });

        hammer.on('panend', (event) => {
            if (!isPanActive || !currentCard) return;

            isPanActive = false;

            const deltaX = event.deltaX;
            const deltaY = event.deltaY;

            const moveOutWidth = document.body.clientWidth;
            const endX = deltaX > 0 ? moveOutWidth : -moveOutWidth;

            const keep = Math.abs(deltaX) < 80;

            if (keep) {
                currentCard.style.transform = '';
            } else {
                currentCard.style.transform = `translate(${endX}px, ${deltaY}px) rotate(${deltaX > 0 ? 30 : -30}deg)`;
                currentCard.classList.add('removed');
                setTimeout(() => {
                    cardContainer.removeChild(currentCard);
                    createNewCard();
                    initCards();
                }, 300);
            }
        });

        // Reset card if pan is canceled
        hammer.on('pancancel', () => {
            if (isPanActive && currentCard) {
                currentCard.style.transform = '';
                isPanActive = false;
            }
        });
    }

    // Initialize existing cards
    initCards();
    cards.forEach((card) => attachPanListeners(card));

    // Next button functionality
    nextButton.addEventListener('click', () => {
        const currentCard = document.querySelector('.card:not(.removed)');
        if (!currentCard) return;
        currentCard.classList.add('removed');
        currentCard.style.transform = `translate(${window.innerWidth}px, -100px) rotate(30deg)`;
        setTimeout(() => {
            cardContainer.removeChild(currentCard);
            createNewCard();
            initCards();
        }, 300);
    });
});
