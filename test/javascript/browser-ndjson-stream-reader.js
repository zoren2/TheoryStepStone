    // Utility script written by Thibault Duplessis / ornicar@github
    // https://gist.github.com/ornicar/a097406810939cf7be1df8ea30e94f3e

    //onMessage function is passed to readStream
    //onMessage is a callback function which just prints a line
    const readStream = processLine => response => {

        // 
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
                    //
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
                    
                    // This segment
                    for (const i of parts.filter(p => p)) processLine(JSON.parse(i));

                    return loop();
                    }
            });

        // Read from the stream until it's complete
        return loop();
    }
// const stream = fetch('https://lichess.org/api/tv/feed');
// or any other ND-JSON endpoint such as:

// fetch() returns a Promise that resolves to a Response Interface
const stream = fetch('https://lichess.org/api/games/user/lovlas?max=5&moves=false',{headers:{Accept:'application/x-ndjson'}});
console.log(stream);

// Callback function that simply logs a passed in object
const onMessage = obj => console.log(obj);
const onComplete = () => console.log('The stream has completed');


// If fetching API endpoint succeeds, resolve the Fetch promise
stream
.then(readStream(onMessage))
.then(onComplete);
