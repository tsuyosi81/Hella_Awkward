'use strict';
if (window.location.pathname.endsWith("play.html")) {

    document.addEventListener('DOMContentLoaded', () => {

        initDisplayCards();
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
            newCardLogic();
            const newCard = document.createElement('div');
            newCard.className = `card ${playDeck.queue[2].categoryID}`;
            newCard.innerHTML = `
                <div class="card-text-container">
                    <p class="card-category-text">${playDeck.queue[2].displayCategory()}</p>
                    <p class="card-question-text">${playDeck.queue[2].question}</p>
                </div>
                <h1 class="weird">weird</h1>
        `;
            cardContainer.appendChild(newCard);

            // Attach pan listeners to the new card
            attachPanListeners(newCard);
        }


        //// SWIPE FUNCTION /////////////////////////////////////////
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

                const keep = Math.abs(deltaX) < 120; //radius of not letting card

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

        // NEXT BUTTON //////////////////////////
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

}








/* 

The Data structure consists of a singleton MasterDeck class, 
categories class (ex: dating, relationships, real talk, sex),
and card class. The plan is to have



*/
class MasterDeck {
    constructor() {
        this.categories = []; // array of categories
    }

    print() {

        console.log("Deck:");
        this.categories.forEach(x => {
            x.printDeck();
        });
    }

    size() {
        var size = 0;
        this.categories.forEach(x => {
            size += x.deck.length;
        })

        console.log(`Size of Deck: ${size}`);
    };
}

class Category {
    constructor(nameID) {
        this.nameID = nameID;
        this.deck = []; // aray of cards
        this.flag = 0;
    }

    add(card) {
        this.deck.push(card);
    }

    toggle() {
        if (this.flag) { this.flag = 0; }
        else { this.flag = 1; }
        console.log(`${this.nameID} is toggled: ${this.flag}`);
    }

    printDeck() {
        console.log(`  ${this.nameID}:`);
        this.deck.forEach(card => {
            console.log("    ", card.question);
        });
    }
}

class Card {
    constructor(categoryID, question) {
        this.categoryID = categoryID;
        this.question = question;
    }

    displayCategory() {
        return this.categoryID.replace("_", " ");
    }
}

function createCard(category, question) {
    const card = new Card(category, question);
    var foundCategory = 0;

    //deck_category named that way to avoid circular references
    masterDeck.categories.forEach(deck_category => {
        if (deck_category.nameID == category) {
            deck_category.add(card);
            foundCategory = 1;
        }
    });

    if (foundCategory == 0) {
        throw new Error(`Input category not found: ${category}`);
    }
    else { console.log("Card successfully added to: ", category); }
}

const dating = new Category("dating");
const relationships = new Category("relationships");
const real_talk = new Category("real_talk");
const sex = new Category("sex");

const masterDeck = new MasterDeck();
masterDeck.categories.push(dating);
masterDeck.categories.push(relationships);
masterDeck.categories.push(sex);
masterDeck.categories.push(real_talk);

sex.deck = [
    new Card('sex', "What's the sexiest part of your body?"),
    new Card('sex', "Have you ever received an STD from someone you trusted?"),
    new Card('sex', "Does body count matter? How many is too many?"),
    new Card('sex', "Quickies are fun, but how do you tell your partner the quickies are too quick?"),
    new Card('sex', "What would you do if someone farted during sex?"),
    new Card('sex', "If you could only have sex in one position for the rest of your life, what would it be?"),
    new Card('sex', "What's your favorite porn category?"),
    new Card('sex', "Are you into phone sex?"),
    new Card('sex', "What is your sexual fantasy?"),
    new Card('sex', "Are you comfortable giving feedback during or after sex?"),
    new Card('sex', "For you, does having sex depend on time spent or attraction?"),
    new Card('sex', "Does size matter? What size is good for you?"),
    new Card('sex', "Do you and your partner record yourselves having sex?"),
    new Card('sex', "Do you need to be emotionally connected with someone to have sex?"),
    new Card('sex', "What is the appropriate interval before starting round two?"),
    new Card('sex', "Nude pics? Yay or nay?"),
    new Card('sex', "How long should sex last?"),
    new Card('sex', "Would you ever eat ass? What circumstances would you let someone toss your salad?"),
    new Card('sex', "What do you think about your partner discussing your sex life with their friends?"),
    new Card('sex', "Period sex? Yes or no?"),
    new Card('sex', "Do you have a sex policy for first dates?"),
    new Card('sex', "How many people in the ideal roster? Who's starting and who's on the bench?"),
    new Card('sex', "If your identity could remain anonymous, would you go to a sex party?"),
    new Card('sex', "Are you open to anal? If so, how open is it?"),
    new Card('sex', "Lights on or lights off?"),
    new Card('sex', "Where is the craziest place you've had sex?"),
    new Card('sex', "How do you feel about sucking toes?"),
    new Card('sex', "What's one thing you could do to improve your sex life?"),
    new Card('sex', "Are you a fan of the pull-out method?"),
    new Card('sex', "Have you ever had a hoe phase or player phase? Did you enjoy it?"),
    new Card('sex', "Marathon sex or one-hundred-meter smash?"),
    new Card('sex', "Is giving head equal opportunity?"),
    new Card('sex', "Should cum landings be a pre-sex discussion? Where do you like it?"),
    new Card('sex', "Would you accept below average sex if everything else in the relationship was perfect?"),
    new Card('sex', "Be honest! Do you have a full bush, trimmed hedges, or a bald eagle right now?")
];
relationships.deck = [
    new Card('relationships', "When is it okay to lie to your partner?"),
    new Card('relationships', "Your lover doesn't meet your parent's standards. You love them anyway, but will your love be good?"),
    new Card('relationships', "Tell a story. How did you and your partner meet?"),
    new Card('relationships', "What is the next milestone for you and your partner?"),
    new Card('relationships', "What is something your partner wants you to be more thoughtful about?"),
    new Card('relationships', "Should you have the password to your partner's phone?"),
    new Card('relationships', "Someone leaves the sexy smirk emoji in bae's comments. Are you going to stalk them?"),
    new Card('relationships', "Without you in the equation, could you see a friendship between your ex and your current boo?"),
    new Card('relationships', "Ask each person in the group: What relationship advice would you give me?"),
    new Card('relationships', "How would you manage finances in a relationship? Joint, separate, or somewhere in between?"),
    new Card('relationships', "How would you handle a surprise pregnancy? What if you're not in love?"),
    new Card('relationships', "When do you expect to get the keys to your partner's apartment? Would you feel some type of way if it takes longer than expected?"),
    new Card('relationships', "Would you move to a new city for your partner? What are the key factors?"),
    new Card('relationships', "Sometimes love isn't enough. What is missing in your relationship?"),
    new Card('relationships', "How has your partner made you a better person?"),
    new Card('relationships', "Are you open to interracial relationships? What about marriage?"),
    new Card('relationships', "Is it okay to watch porn while in a relationship?"),
    new Card('relationships', "How important is it to raise your children with your spiritual beliefs?"),
    new Card('relationships', "Are you open to a long distance relationship? What are your ground rules?"),
    new Card('relationships', "Do you stalk your exes on social media? If so, how many burners do you have?"),
    new Card('relationships', "Ask each person in the group: What about me annoys you the most?"),
    new Card('relationships', "Would you marry someone with opposing political views?"),
    new Card('relationships', "How has your parent's relationship impacted your love life?"),
    new Card('relationships', "Friendships with exes? Is it all love or no chance in hell? Is it different for a one-time hookup?"),
    new Card('relationships', "Would you sign a prenup?"),
    new Card('relationships', "Do you believe in gender roles?"),
    new Card('relationships', "Does it matter who brings home the bacon?"),
    new Card('relationships', "What have you sacrificed for your relationship?"),
    new Card('relationships', "Has a friend or lover ever used their mental health as a crutch to take advantage of you? Can mental health ever be used in that way?"),
    new Card('relationships', "Have you ever fallen out of love and stayed in the relationship anyway?"),
    new Card('relationships', "Ask each person in the group: How can I communicate better?"),
    new Card('relationships', "Should relationships be easy?"),
    new Card('relationships', "Would you marry someone with a low credit score?"),
    new Card('relationships', "If you could erase an ex from your memory, would you do it?"),
    new Card('relationships', "Your best friend and your partner aren't vibing. What do you do?")
];
dating.deck = [
    new Card('dating', "How did you process your last breakup?"),
    new Card('dating', "Do you believe in second chances for bad first dates?"),
    new Card('dating', "Monogamous dating or roster vibes?"),
    new Card('dating', "Does your family have any issues with you dating someone from a different ethnic background? If yes, would you do it anyway?"),
    new Card('dating', "Dinner is over, the waiter asks, together or separate? What's it gonna be?"),
    new Card('dating', "In a relationship, when is it okay to video call in your durag or scarf?"),
    new Card('dating', "Do you want to have kids? Why or why not? What's the ideal age?"),
    new Card('dating', "At what point do you have the 'so what are we?' talk?"),
    new Card('dating', "When do you ask the person you're dating if they're having sex with someone else?"),
    new Card('dating', "How do you end a casual situationship? Ghost, slow fade, or direct and honest?"),
    new Card('dating', "Your friend or sibling is dating someone, but they can do better. Do you say something or mind ya business?"),
    new Card('dating', "Is ghosting ever acceptable?"),
    new Card('dating', "How much money are you willing to spend on the first date?"),
    new Card('dating', "How late is too late to show up for the first date?"),
    new Card('dating', "Would you date someone with kids? Why or why not?"),
    new Card('dating', "Ask each person in the group: How many times do you think I'd call my ex after a breakup?"),
    new Card('dating', "When should you share the login to your streaming platforms?"),
    new Card('dating', "Would you date a coworker and does seniority matter?"),
    new Card('dating', "According to your friends, are your dating standards too low, too high, or just right? What do you think?"),
    new Card('dating', "How would you react if you discovered your friend is dating your ex?"),
    new Card('dating', "When can you post your relationship on social?"),
    new Card('dating', "Which phase of dating makes open farting okay?"),
    new Card('dating', "How did your last relationship end and are you two still f*ckin'?"),
    new Card('dating', "Are you letting someone fly you out (all expenses paid) on the second date?"),
    new Card('dating', "Ask each person in the group: What do you think my love language is?"),
    new Card('dating', "Tell us about your worst date"),
    new Card('dating', "Have you ever taken part in an affair? Did you know beforehand or did you find out later?"),
    new Card('dating', "Rank these in order of priority- personality, looks, and money."),
    new Card('dating', "Have you ever cheated or been cheated on? What happened?"),
    new Card('dating', "Ask your date: What made you ask me out?"),
    new Card('dating', "Are you keeping pictures of your ex on social media? What about your camera roll?"),
    new Card('dating', "You don't want to break up over text; that isn't classy, so where are the best places to break up?"),
    new Card('dating', "Butt injections-yes or no? What about other cosmetic plastic surgeries?"),
    new Card('dating', "What is your type?"),
    new Card('dating', "It is the most wonderful time of the year, but face it, your family is crazy. Are you inviting your partner over for the holidays?")
];
real_talk.deck = [
    new Card('real_talk', "Tell us the story of your first time getting wasted. We need all the deets.."),
    new Card('real_talk', "Stop frontin' you have a favorite friend. Who is it?"),
    new Card('real_talk', "Parenting is hard. What should your parents have taught you when you were younger?"),
    new Card('real_talk', "If money wasn't an issue, how would you spend your time?"),
    new Card('real_talk', "How many times have you been in love?"),
    new Card('real_talk', "Tell us about the best (unfinished question)"),
    new Card('real_talk', "If you could fix one world issue, what would it be?"),
    new Card('real_talk', "When was the last time you cried?"),
    new Card('real_talk', "You can only stream one album for the rest of your life, which album are you listening to?"),
    new Card('real_talk', "What's your favorite city in the world and why?"),
    new Card('real_talk', "Are your parents still in love? Does it matter to you now?"),
    new Card('real_talk', "Ask each person in the group: When were you most proud of me?"),
    new Card('real_talk', "Life is fragile, so is money. Would you want ten more years or one more million?"),
    new Card('real_talk', "Are you living the life you dreamed of?"),
    new Card('real_talk', "Do you brush before or after you floss?"),
    new Card('real_talk', "What's your experience with race?"),
    new Card('real_talk', "When was the last time you forgave yourself?"),
    new Card('real_talk', "What is the one thing you want to accomplish before the year ends?"),
    new Card('real_talk', "What were your childhood hobbies? Are they still part of who you are?"),
    new Card('real_talk', "How much do you make a year?"),
    new Card('real_talk', "Without mentioning any tech, name your most prized possession."),
    new Card('real_talk', "Define love."),
    new Card('real_talk', "Which actor should play me in a movie about my life?"),
    new Card('real_talk', "What is something you're too scared to go after?"),
    new Card('real_talk', "What's something about you that nobody else would believe?"),
    new Card('real_talk', "What was your spiritual background as a child, and how does it impact your life today?"),
    new Card('real_talk', "If you could snap your fingers and change one thing about yourself, what would it be?"),
    new Card('real_talk', "Ask each person in the group: How can I improve my relationship with you?"),
    new Card('real_talk', "Do you believe you've met your soulmate?"),
    new Card('real_talk', "Who did you vote for in the last election?"),
    new Card('real_talk', "How can we repair race relations in America?"),
    new Card('real_talk', "Have you ever gone to therapy? If not, are you open to it?"),
    new Card('real_talk', "What is the ideal age to die?"),
    new Card('real_talk', "Was your childhood idyllic? Would you change anything about it today?"),
    new Card('real_talk', "Ask each person in the group: What are my greatest strengths?")
];

// Play Game Section ///////////////////////////////////////
class Queue {
    constructor() {
        this.queue = [];
        this.displayedCards = []; //show the next 3 cards for front end
        this.undo = "";
    }
}

const playDeck = new Queue();
function playGame() {
    // creating an unshuffled play deck with toggled categories
    var pdeck = [];

    console.log("real talk flag:", sessionStorage.getItem("real_talkToggle"));
    console.log("relationships flag:", sessionStorage.getItem("relationshipsToggle"));
    console.log("dating flag:", sessionStorage.getItem("datingToggle"));
    console.log("sex flag:", sessionStorage.getItem("sexToggle"));
    if (sessionStorage.getItem("datingToggle") === "true") pdeck = pdeck.concat(dating.deck);
    if (sessionStorage.getItem("relationshipsToggle") === "true") pdeck = pdeck.concat(relationships.deck);
    if (sessionStorage.getItem("sexToggle") === "true") pdeck = pdeck.concat(sex.deck);
    if (sessionStorage.getItem("real_talkToggle") === "true") pdeck = pdeck.concat(real_talk.deck);

    // shuffle and put into queue to easily pop
    playDeck.queue = shuffleArray(pdeck);

    // when queue is finished
    var lastCards = [
        new Card('real_talk', "You finished your deck!"),
        new Card('real_talk', "You finished your deck!"),
        new Card('real_talk', "You finished your deck!")
    ]
    playDeck.queue = playDeck.queue.concat(lastCards);

    // create display cards
    playDeck.displayedCards = [
        playDeck.queue[0],
        playDeck.queue[1],
        playDeck.queue[2]
    ]

    console.log("Playing Game...");
}

//helper function for playGame()
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function firstCard() {
    return playDeck.displayedCards[0];
    console.log("firstCard() activated");
}
function secondCard() {
    return playDeck.displayedCards[1];
}
function thirdCard() {
    return playDeck.displayedCards[2];
}

function newCardLogic() {
    playDeck.queue.shift();
    playDeck.displayedCards = [
        playDeck.queue[0],
        playDeck.queue[1],
        playDeck.queue[2]
    ]
    if (playDeck.queue.length === 2) {
        window.location.href = "index.html";
    }
    console.log("===New Card===");
}

function initDisplayCards() {
    if (document.getElementById("card1-category")) {
        console.log(playDeck.displayedCards);
        document.getElementById("card1-category").innerHTML = firstCard().displayCategory();
        document.getElementById("card2-category").innerHTML = secondCard().displayCategory();
        document.getElementById("card3-category").innerHTML = thirdCard().displayCategory();
        document.getElementById("card1-question").innerHTML = firstCard().question;
        document.getElementById("card2-question").innerHTML = secondCard().question;
        document.getElementById("card3-question").innerHTML = thirdCard().question;

        document.getElementById("card1").classList.add(firstCard().categoryID);
        document.getElementById("card2").classList.add(secondCard().categoryID);
        document.getElementById("card3").classList.add(thirdCard().categoryID);

    }
    else {
        console.log("not hello");
    }
}

/////////////////////// TOGGLE ////////////////////////////////

let sexToggleBtn = document.getElementById('sexToggleBtn');
if (sexToggleBtn) {
    sexToggleBtn.addEventListener('click', () => {
        const value = sessionStorage.getItem("sexToggle") === "true";
        sessionStorage.setItem("sexToggle", !value);
        console.log(sessionStorage.getItem("sexToggle"));
    });
}

let real_talkToggleBtn = document.getElementById('real_talkToggleBtn');
if (real_talkToggleBtn) {
    real_talkToggleBtn.addEventListener('click', () => {
        const value = sessionStorage.getItem("real_talkToggle") === "true";
        sessionStorage.setItem("real_talkToggle", !value);
        console.log(sessionStorage.getItem("real_talkToggle"));
    });
}

let relationshipsToggleBtn = document.getElementById('relationshipsToggleBtn');
if (relationshipsToggleBtn) {
    relationshipsToggleBtn.addEventListener('click', () => {
        const value = sessionStorage.getItem("relationshipsToggle") === "true";
        sessionStorage.setItem("relationshipsToggle", !value);
        console.log(sessionStorage.getItem("relationshipsToggle"));
    });
}

let datingToggleBtn = document.getElementById('datingToggleBtn');
if (datingToggleBtn) {
    datingToggleBtn.addEventListener('click', () => {
        const value = sessionStorage.getItem("datingToggle") === "true";
        sessionStorage.setItem("datingToggle", !value);
        console.log(sessionStorage.getItem("datingToggle"));
    });
}
// Event Listeners //////////////////////////////////////////

//restart toggles when entering homescreen
if (window.location.pathname.endsWith("index.html")) {
    window.addEventListener('load', () => {
        sessionStorage.setItem("sexToggle", false);
        document.getElementById('sexToggleBtn').checked = false;
        sessionStorage.setItem("real_talkToggle", false);
        document.getElementById('real_talkToggleBtn').checked = false;
        sessionStorage.setItem("relationshipsToggle", false);
        document.getElementById('relationshipsToggleBtn').checked = false;
        sessionStorage.setItem("datingToggle", false);
        document.getElementById('datingToggleBtn').checked = false;
    });
}

if (window.location.pathname.endsWith("play.html")) {
    playGame();
}
/////////////////////////////////////////
