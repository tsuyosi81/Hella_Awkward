// Initialize a Map with string keys and arrays as values
// key is category
// value is a string array of questions
const cardDeck = new Map([
    ["real talk", []],
    ["dating", []],
    ["relationships", []],
    ["sex", []]
  ]);
  
const real_talk = cardDeck.get("real talk");
const dating = cardDeck.get("dating");
const relationships = cardDeck.get("relationships");
const sex = cardDeck.get("sex");

// Add cards to a specific category
real_talk.push("A", "2", "3");
sex.push("K", "Q", "J");
relationships.push("hello");
dating.push("this","is","a","test");

// Print the Map
console.log(cardDeck);

function randomCard(category) {
const randomIndex = Math.floor(Math.random() * category.length);
return category[randomIndex];
}

console.log("Random Card from \"sex\":", randomCard(sex));
console.log("Random Card from \"relationships\":", randomCard(relationships));
console.log("Random Card from \"dating\":", randomCard(dating));

// Toggle section ///////////////////////////////////////////
const flag_real_talk = 0;
const flag_relationship = 0;
const flag_sex = 0;
const flag_dating = 0;

function toggle_flag(flag_category){
if (flag_category) flag_category = 0;
if (!flag_category) flag_category = 1;
}

// Play Game Section ///////////////////////////////////////

function shuffle(){
    let queue = [];

    var play_stack = [];

    if (flag_dating) play_stack.concat(dating);
    if (flag_relationship) play_stack.concat(relationship);
    if (flag_sex) play_stack.concat(sex);
    if (flag_real_talk) play_stack.concat(real_talk);

    console.log(play_stack);

    // Enqueue (Add elements to the queue)
    queue.push(1); // Queue: [1]
    queue.push(2); // Queue: [1, 2]
    queue.push(3); // Queue: [1, 2, 3]

    // Dequeue (Remove elements from the front of the queue)
    let frontElement = queue.shift(); // Removes 1, Queue: [2, 3]

    console.log(frontElement); // Output: 1
    console.log(queue);        // Output: [2, 3]
    }

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));
  
      // Swap elements at indices i and j
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

flag_relationship = 1;
shuffle();
