const audioElement = document.getElementById('audio');

// Define the VoiceRSS object with methods for text-to-speech functionality
const VoiceRSS = {
    // 'speech' method to process the text-to-speech request
    speech(e) {
        this._validate(e); // Validate the input settings
        this._request(e); // Make the API request
    },
    // '_validate' method to ensure all required settings are present
    _validate(e) {
        if (!e) throw "The settings are undefined"; // Check if settings object is provided
        if (!e.key) throw "The API key is undefined"; // Check if API key is provided
        if (!e.src) throw "The text is undefined"; // Check if text to convert is provided
        if (!e.hl) throw "The language is undefined"; // Check if language is provided
        // Check if the specified audio codec is supported by the browser
        if (e.c && "auto" != e.c.toLowerCase()) {
            let a = false; // Initialize support flag
            // Determine support for various audio codecs
            switch (e.c.toLowerCase()) {
                case "mp3": a = (new Audio).canPlayType("audio/mpeg").replace("no", ""); break;
                case "wav": a = (new Audio).canPlayType("audio/wav").replace("no", ""); break;
                case "aac": a = (new Audio).canPlayType("audio/aac").replace("no", ""); break;
                case "ogg": a = (new Audio).canPlayType("audio/ogg").replace("no", ""); break;
                case "caf": a = (new Audio).canPlayType("audio/x-caf").replace("no", ""); break;
            }
            if (!a) throw `The browser does not support the audio codec ${e.c}`; // Throw error if codec not supported
        }
    },
    // '_request' method to send the API request
    _request(e) {
        const a = this._buildRequest(e); // Build the request query string
        const t = this._getXHR(); // Get an XMLHttpRequest object
        // Define the behavior for when the request state changes
        t.onreadystatechange = function () {
            // Check if the request is complete and successful
            if (4 == t.readyState && 200 == t.status) {
                // If the response indicates an error, throw it
                if (0 == t.responseText.indexOf("ERROR")) throw t.responseText;
                // Set the audio source to the response and play it
                let e = t.responseText;
                audioElement.src = e;
                audioElement.onloadedmetadata = (() => { audioElement.play(); });
            }
        };
        // Open a POST request to the VoiceRSS API endpoint
        t.open("POST", "https://api.voicerss.org/", true);
        // Set the content type for the request
        t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        // Send the request with the query string
        t.send(a);
    },
    // '_buildRequest' method to create the query string for the API request
    _buildRequest(e) {
        // Determine the audio codec, defaulting to auto-detection if not specified
        const a = e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec();
        // Construct and return the query string with the provided settings
        return `key=${e.key || ""}&src=${e.src || ""}&hl=${e.hl || ""}&r=${e.r || ""}&c=${a || ""}&f=${e.f || ""}&ssml=${e.ssml || ""}&b64=true`;
    },
    // '_detectCodec' method to auto-detect the best audio codec the browser can play
    _detectCodec() {
        const e = new Audio;
        // Check and return the first supported audio codec
        return e.canPlayType("audio/mpeg").replace("no", "") ? "mp3" :
               e.canPlayType("audio/wav").replace("no", "") ? "wav" :
               e.canPlayType("audio/aac").replace("no", "") ? "aac" :
               e.canPlayType("audio/ogg").replace("no", "") ? "ogg" :
               e.canPlayType("audio/x-caf").replace("no", "") ? "caf" : "";
    },
    // '_getXHR' method to create and return an XMLHttpRequest object
    _getXHR() {
        // Try creating a standard XMLHttpRequest object
        try { return new XMLHttpRequest(); }
        catch (e) { }
        // Fallback to ActiveXObject for older IE browsers
        try { return new ActiveXObject("Msxml3.XMLHTTP"); }
        catch (e) { }
        try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
        catch (e) { }
        try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
        catch (e) { }
        try { return new ActiveXObject("Msxml2.XMLHTTP"); }
        catch (e) { }
        try { return new ActiveXObject("Microsoft.XMLHTTP"); }
        catch (e) { }
        // If none of the above work, throw an error
        throw "The browser does not support HTTP request";
    }
};