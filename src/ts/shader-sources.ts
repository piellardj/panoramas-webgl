const cachedSources: { [id: string]: string } = {};

/* Fetches asynchronously the shader source from server and stores it in cache. */
function loadSource(filename: string, callback: (success: boolean) => void) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "./shaders/" + filename, true);
    xhr.onload = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                cachedSources[filename] = xhr.responseText;
                callback(true);
            } else {
                console.error("Could not load '" + filename + "' shader source: " + xhr.statusText);
                callback(false);
            }
        }
    };
    xhr.onerror = () => {
        console.error("Could not load '" + filename + "' shader source: " + xhr.statusText);
        callback(false);
    };

    xhr.send(null);
}

function loadSources(filenames: string[], callback: (success: boolean) => void) {
    let nbResponses = 0;
    let nbFailed = 0;

    function incrementNbReponses() {
        nbResponses++;
        if (nbResponses === filenames.length) {
            callback(nbFailed === 0);
        }
    }

    for (const filename of filenames) {
        if (typeof cachedSources[filename] === "undefined") {
            loadSource(filename, (success) => {
                if (!success) {
                    nbFailed++;
                }

                incrementNbReponses();
            });
        } else {
            incrementNbReponses();
        }
    }
}

function getSource(filename: string): string {
    return cachedSources[filename];
}

export {
    getSource,
    loadSource,
    loadSources,
};
