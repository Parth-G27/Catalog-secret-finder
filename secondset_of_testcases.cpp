#include <iostream>
#include <map>
#include <cmath>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// Function to convert a string number from any base to decimal
long long decodeValue(const string &value, int base) {
    long long result = 0;
    long long power = 1;
    for (int i = value.length() - 1; i >= 0; --i) {
        char digit = value[i];
        if (digit >= '0' && digit <= '9') {
            result += (digit - '0') * power;
        } else if (digit >= 'A' && digit <= 'F') {
            result += (digit - 'A' + 10) * power;
        }
        power *= base;
    }
    return result;
}

// Lagrange interpolation to find the constant term (c) of the polynomial
double lagrangeInterpolation(const vector<pair<int, long long>>& points, int k) {
    double secret = 0;
    
    for (int i = 0; i < k; i++) {
        double term = points[i].second;
        for (int j = 0; j < k; j++) {
            if (i != j) {
                term *= (0 - points[j].first) * 1.0 / (points[i].first - points[j].first);
            }
        }
        secret += term;
    }
    
    return secret;
}

int main() {
    // Input data parsed from the second JSON example
    map<int, pair<int, string>> data = {
        {1, {10, "28735619723837"}},
        {2, {16, "1A228867F0CA"}},
        {3, {12, "32811A4AA0B7B"}},
        {4, {11, "917978721331A"}},
        {5, {16, "1A22886782E1"}},
        {6, {10, "28735619654702"}},
        {7, {14, "71AB5070CC4B"}},
        {8, {9, "122662581541670"}},
        {9, {8, "642121030037605"}}
    };

    // Number of points provided (n) and minimum points needed (k)
    int n = 9;
    int k = 6;

    // Step 1: Decode the values from their respective bases
    vector<pair<int, long long>> points;
    for (auto &entry : data) {
        int x = entry.first;
        int base = entry.second.first;
        string encodedValue = entry.second.second;
        long long y = decodeValue(encodedValue, base);  // Decode y value
        points.push_back({x, y});
    }

    // Step 2: Find the constant term 'c' using Lagrange interpolation
    double secret = lagrangeInterpolation(points, k);

    // Output the secret (constant term 'c')
    cout << "The constant term (secret 'c') is: " << (long long)secret << endl;

    return 0;
}
