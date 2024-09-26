const fs = require('fs').promises;

function decodeValue(value, base) {
    return parseInt(value, base);
}

function lagrangeInterpolation(points, k) {
    let secret = 0;

    for (let i = 0; i < k; i++) {
        let term = points[i].y;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                term *= (0 - points[j].x) / (points[i].x - points[j].x);
            }
        }
        secret += term;
    }

    return secret;
}

async function processFile(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        const jsonData = JSON.parse(data);
        const k = jsonData.keys.k;
        let points = [];
        for (let key in jsonData) {
            if (key !== 'keys') {
                const x = parseInt(key);
                const base = parseInt(jsonData[key].base);
                const encodedValue = jsonData[key].value;
                const y = decodeValue(encodedValue, base);
                points.push({ x, y });
            }
        }
        points.sort((a, b) => a.x - b.x);
        const secret = lagrangeInterpolation(points, k);
        return Math.round(secret);
    } catch (error) {
        throw new Error(`Error processing ${filename}: ${error.message}`);
    }
}

async function main() {
    try {
        const [result1, result2] = await Promise.all([
            processFile('input.json'),
            processFile('input2.json')
        ]);

        console.log(`Result from input.json: ${result1}`);
        console.log(`Result from input2.json: ${result2}`);
    } catch (error) {
        console.error(error.message);
    }
}

main();