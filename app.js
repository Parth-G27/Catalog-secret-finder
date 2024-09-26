const fs = require('fs');

// Function to decode a value from a given base to decimal
function decodeValue(value, base) {
    return parseInt(value, base);
}

// Lagrange interpolation to find the constant term (c) of the polynomial
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

// Main function to read JSON and calculate the secret
function findSecret(jsonFile) {
    // Step 1: Read and parse the JSON file
    fs.readFile(jsonFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        const parsedData = JSON.parse(data);
        const n = parsedData.keys.n;  // number of points
        const k = parsedData.keys.k;  // minimum number of points needed

        // Step 2: Decode the values from their respective bases
        let points = [];
        for (let key in parsedData) {
            if (key !== 'keys') {
                const x = parseInt(key);
                const base = parseInt(parsedData[key].base);
                const encodedValue = parsedData[key].value;
                const y = decodeValue(encodedValue, base);  // Decode y value
                points.push({ x, y });
            }
        }

        // Step 3: Sort the points by x value (just in case they're not in order)
        points.sort((a, b) => a.x - b.x);

        // Step 4: Apply Lagrange interpolation to find the constant term 'c'
        const secret = lagrangeInterpolation(points, k);

        // Step 5: Output the constant term 'c'
        console.log(`The constant term (secret 'c') is: ${Math.round(secret)}`);
    });
}

// Run the main function with the provided JSON file
const jsonFile = 'input2.json';  // Path to your JSON file
findSecret(jsonFile);

