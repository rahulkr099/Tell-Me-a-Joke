
const button = document.getElementById('button');

function tellMe(joke){
   console.log(joke);
   VoiceRSS.speech({
    key:'f4861831a63948e99f97c4e358d9d82a',
    src: joke,
    hl:'en-us',
    r:0,
    c:'mp3',
    f:'44khz_16bit_stereo',
    ssml:false,
});
}

//Get Jokes from Joke API
async function getJokes(){
    const apiUrl= 'https://v2.jokeapi.dev/joke/Any';
    let joke = '';
    try{
        const response = await fetch(apiUrl);
        const data = await response.json();
        if(data.setup){
            joke = `${data.setup}...${data.delivery}`;
        }
        else{
            joke = data.joke;
        }
        console.log(joke);
        tellMe(joke);
    }catch(error){
        console.log('whoops error',error);
    }
}
getJokes();
button.addEventListener('click',getJokes);