/*
 * This script grabs games via the https://lichess.org/api/games/user/{username}
 * header:x-chess-pgn endpoint. It serves only as a scaffold to test this endpoint
 * and to learn about javascript closures.
 */ 


 // Closure allows the response to be accessed in this manner
function readStream(processLine) {
    return function (response) {
        const stream = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        const loop = () => {
            stream.read().then(
                ({done, value}) => {
                    if (done) {
                        if (buffer.length > 0) {
                            processLine(buffer);
                        }
                    }
                    else {
                        const chunk = decoder.decode(value, {
                            stream: true
                        });
                    buffer += chunk;
                    return loop();
                    }
            });
        }
        return loop();
    }
} // End fn
const stream = fetch('https://lichess.org/api/games/user/lovlas?max=3', {headers:{Accept:'application/x-chess-pgn'}});
const games = new Array();
stream.then(readStream( (obj) => console.log(obj)));
