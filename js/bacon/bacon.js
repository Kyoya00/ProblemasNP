document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('csvFileInput').addEventListener('change', handleFileSelect, false);
});

let movies = [];
let actorsGraph = {};

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                movies = results.data;
                buildGraph();
                alert('CSV carregado com sucesso!');
            },
            error: function(error) {
                console.error('Erro ao processar o arquivo:', error);
            }
        });
    }
}

function buildGraph() {
    actorsGraph = {}; // Reset the graph
    movies.forEach(movie => {
        let cast;
        try {
            cast = JSON.parse(movie.cast);  // Assume cast is a JSON array of actors
        } catch (e) {
            console.error(`Erro ao parsear o cast do filme: ${movie.title}`);
            return;
        }

        let actors = cast.map(actor => actor.name);
        actors.forEach(actor => {
            if (!actorsGraph[actor]) {
                actorsGraph[actor] = [];
            }
            actors.forEach(coactor => {
                if (actor !== coactor && !actorsGraph[actor].includes(coactor)) {
                    actorsGraph[actor].push(coactor);
                }
            });
        });
    });
}

function calculateBaconNumber() {
    let actor1 = document.getElementById('actor1').value.trim();
    let actor2 = document.getElementById('actor2').value.trim();

    if (!actor1 || !actor2) {
        alert('Por favor, insira os nomes de ambos os atores.');
        return;
    }

    let result = bfs(actor1, actor2);
    if (result.path.length > 0) {
        displayResult(result);
    } else {
        alert('Nenhum caminho encontrado entre ' + actor1 + ' e ' + actor2);
    }
}

function bfs(start, goal) {
    let queue = [[start]];
    let visited = new Set();

    while (queue.length > 0) {
        let path = queue.shift();
        let node = path[path.length - 1];

        if (node === goal) {
            return { path: path, length: path.length - 1 };
        }

        if (!visited.has(node)) {
            visited.add(node);
            let neighbors = actorsGraph[node] || [];
            neighbors.forEach(neighbor => {
                let newPath = [...path, neighbor];
                queue.push(newPath);
            });
        }
    }

    return { path: [], length: -1 };
}

function displayResult(result) {
    let stepsContainer = document.getElementById('steps');
    stepsContainer.innerHTML = '';

    result.path.forEach((actor, index) => {
        let step = document.createElement('p');
        step.textContent = `${index + 1}: ${actor}`;
        stepsContainer.appendChild(step);
    });

    let baconNumber = document.createElement('p');
    baconNumber.textContent = `Número de Bacon: ${result.length}`;
    stepsContainer.appendChild(baconNumber);
}
