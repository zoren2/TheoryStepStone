    /*
     * This script contains the logic which will process three recently played games filtered by user
     * defined restrictions (by time control) and allow the user to learn from their chess opening mistakes by 
     * choosing suggestions offered by the lichess cloud. If no suggestions can be made then the user has succeeded
     * in surviving the opening phase within playable bounds of browser-based Stockfish.
     * 
     * In order to use this script, create a new TheoryStepStone object 
     * 
     * eg: const theoryStepStone = new TheoryStepStone('user')
     * 
     * in user defined javasScript or inside HTML script and use the API granted by the object methods.
     */


    class TheoryStepStone {
        constructor(userName) {
            const stream = fetch(`https://lichess.org/api/games/user/${userName}?max=3`,{headers:{Accept:'application/x-ndjson'}});
            const pushGames = (obj) => this.games.push(obj);
            this.games = new Array();
            this.userName = userName;
            this.errorMessage = '';
            stream.then(this.readStream(pushGames)); // readStream handles and populates the user games array
            console.log(this.games);
        }
 
        getUserName() {
            return this.userName;
        }

        // This method requires the game index eg: games[1] to access the index.
        getCurrentOpponent(game) {

        }

        // Returns whether or not the user is White or Black in order to orient the board properly.
        getCurrentPlayerIsWhite(game){

        }

        /*
         * NDJson script adapted by browser-ndjson-stream-reader by 
         * Thibault Duplessis / ornicar@github
         * https://gist.github.com/ornicar/a097406810939cf7be1df8ea30e94f3e
         */ 
        readStream(processLine) {
            return function (response) {
                const stream = response.body.getReader();
                const matcher = /\r?\n/;

                // A decoder takes a stream of bytes as input and emits a stream of code points
                const decoder = new TextDecoder();

                let buf = '';

                const loop = () =>
                    // read() returns a promise that resolves when a value has been received
                    stream.read().then(
                    // Result objects contain two properties:
                    // done  - true if the stream has already given you all its data.
                    // value - some data. Always undefined when done is true.
                    ({ done, value }) => {
                        if (done) {
                            if (buf.length > 0) processLine(JSON.parse(buf));
                        }      

                        // Not finished, populate the buffer with stream content
                        else {
                            const chunk = decoder.decode(value, {
                            stream: true
                        });         
                        buf += chunk;

                        // Splits the content in order to display it
                        const parts = buf.split(matcher);
                        buf = parts.pop();
                    
                        for (const i of parts.filter(p => p)) processLine(JSON.parse(i));
                            return loop();
                        }
            });

            //Read from the stream until it's complete
            return loop();
            }
        } // End fn

        // Placeholder to validate user name
        validateUser(userName) {

        }
    } // End class
      