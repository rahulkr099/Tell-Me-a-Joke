// Get a reference to the HTML element with the ID 'button'
const button = document.getElementById('button');
const loader = document.getElementById('loader');
const jokeData = document.querySelector('.joke-box p');

// Function to speak a joke using VoiceRSS API
function tellMe(joke) {
    console.log(joke); // Log the joke to the console
    VoiceRSS.speech({
        key: 'f4861831a63948e99f97c4e358d9d82a', // VoiceRSS API key
        src: joke, // The joke text to be spoken
        hl: 'en-us', // Language (English, US)
        r: 0, // Speech rate (0 = default)
        c: 'mp3', // Audio format (mp3)
        f: '44khz_16bit_stereo', // Audio quality
        ssml: false, // Not using SSML (Speech Synthesis Markup Language)
    });
}

// Async function to fetch jokes from the Joke API
async function getJokes() {
    // Show a loading spinner or perform other UI-related actions
    
    const apiUrl = 'https://v2.jokeapi.dev/joke/Programming'; // API URL for fetching jokes
    let joke = '';
    try {
        const response = await fetch(apiUrl); // Fetch data from the API
        const data = await response.json(); // Parse the response as JSON

        // Check if the joke has a 'setup' (for two-part jokes)
        if (data.setup) {
            joke = `${data.setup}...${data.delivery}`; // Combine setup and delivery
        } else {
            joke = data.joke; // Use the single-part joke
        }

        
        console.log(joke); // Log the joke to the console
        jokeData.parentElement.hidden = false;
        jokeData.textContent=joke;
        tellMe(joke); // Speak the joke using VoiceRSS
        
    } catch (error) {
        console.log('Whoops, an error occurred:', error); // Handle any errors
    }
}

// Call the getJokes function to fetch and display a joke
//  getJokes();
// Add a click event listener to the button
button.addEventListener('click',getJokes);
jokeData.parentElement.hidden = true;


