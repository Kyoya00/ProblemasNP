let delay = 500;
let cities = [
    { name: "A", x: 50, y: 150 },
    { name: "B", x: 130, y: 150 },
    { name: "C", x: 60, y: 130 },
    { name: "D", x: 110, y: 130 },
    { name: "E", x: 20, y: 110 },
    { name: "F", x: 80, y: 110 },
    { name: "G", x: 140, y: 110 },
    { name: "H", x: 110, y: 90 },
    { name: "I", x: 30, y: 70 },
    { name: "J", x: 80, y: 70 }
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function euclideanDistance(city1, city2) {
    return Math.sqrt(Math.pow(city1.x - city2.x, 2) + Math.pow(city1.y - city2.y, 2));
}

function totalDistance(path) {
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        distance += euclideanDistance(path[i], path[i + 1]);
    }
    distance += euclideanDistance(path[path.length - 1], path[0]); // return to start
    return distance;
}

async function solveBruteForce(cities) {
    const permutations = permute(cities);
    let minDistance = Infinity;
    let bestPath = null;

    for (const path of permutations) {
        const distance = totalDistance(path);
        updateSteps(path, distance);
        drawPath(path);
        await sleep(delay);
        if (distance < minDistance) {
            minDistance = distance;
            bestPath = path;
        }
    }

    return { path: bestPath, distance: minDistance };
}

function permute(arr) {
    if (arr.length === 0) return [[]];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const rest = permute(arr.slice(0, i).concat(arr.slice(i + 1)));
        rest.forEach(subperm => {
            result.push([arr[i], ...subperm]);
        });
    }
    return result;
}

async function solveGreedy(cities) {
    const unvisited = new Set(cities);
    const path = [];
    let currentCity = cities[0];
    path.push(currentCity);
    unvisited.delete(currentCity);

    while (unvisited.size > 0) {
        let nearestCity = null;
        let minDistance = Infinity;
        for (const city of unvisited) {
            const distance = euclideanDistance(currentCity, city);
            if (distance < minDistance) {
                minDistance = distance;
                nearestCity = city;
            }
        }
        path.push(nearestCity);
        unvisited.delete(nearestCity);
        currentCity = nearestCity;
        updateSteps(path, totalDistance(path));
        drawPath(path);
        await sleep(delay);
    }

    return { path, distance: totalDistance(path) };
}

function updateSteps(path, distance) {
    const stepsElement = document.getElementById('steps');
    const step = document.createElement('p');
    step.textContent = `Caminho: ${path.map(city => city.name).join(' -> ')} | Distância: ${distance.toFixed(2)}`;
    stepsElement.appendChild(step);
    stepsElement.scrollTop = stepsElement.scrollHeight;
}

function drawPath(path) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cities
    ctx.fillStyle = 'red';
    for (const city of cities) {
        ctx.beginPath();
        ctx.arc(city.x, city.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(city.name, city.x + 8, city.y + 8);
    }

    // Draw path
    if (path.length > 0) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < path.length; i++) {
            const city = path[i];
            if (i === 0) {
                ctx.moveTo(city.x, city.y);
            } else {
                ctx.lineTo(city.x, city.y);
            }
        }
        ctx.stroke();
    }
}

async function startSolving() {
    const algorithm = document.getElementById('algorithm').value;
    delay = parseInt(document.getElementById('delay').value);
    document.getElementById('steps').innerHTML = '';

    let path = [];

    if (algorithm === 'bruteForce') {
        const result = await solveBruteForce(cities);
        path = result.path;
        alert(`Solução encontrada!\nCaminho: ${result.path.map(city => city.name).join(' -> ')}\nDistância: ${result.distance.toFixed(2)}`);
    } else if (algorithm === 'greedy') {
        const result = await solveGreedy(cities);
        path = result.path;
        alert(`Solução encontrada!\nCaminho: ${result.path.map(city => city.name).join(' -> ')}\nDistância: ${result.distance.toFixed(2)}`);
    }

    drawPath(path);
}

function randomizeCities() {
    cities.forEach(city => {
        city.x = Math.floor(Math.random() * 480) + 10; // Ensure the city stays within the canvas
        city.y = Math.floor(Math.random() * 180) + 10; // Ensure the city stays within the canvas
    });
    drawPath([]); // Draw the randomized cities
}

drawPath([]);