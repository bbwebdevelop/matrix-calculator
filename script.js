function createMatrix(matrixId, size) {
    const matrixDiv = document.getElementById(`matrix${matrixId}`);
    matrixDiv.innerHTML = '';
    matrixDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            matrixDiv.appendChild(input);
        }
    }
}

function resizeMatrix(matrixId, change) {
    const matrixDiv = document.getElementById(`matrix${matrixId}`);
    const currentSize = Math.sqrt(matrixDiv.childElementCount);
    const newSize = Math.max(currentSize + change, 1);
    createMatrix(matrixId, newSize);
}

function getMatrixValues(matrixId) {
    const matrixDiv = document.getElementById(`matrix${matrixId}`);
    const inputs = matrixDiv.getElementsByTagName('input');
    const size = Math.sqrt(inputs.length);
    const matrix = [];
    let row = [];
    let filledCols = 0;

    for (let i = 0; i < inputs.length; i++) {
        const value = inputs[i].value;
        if (value === "") {
            row.push(null); 
        } else {
            row.push(parseFloat(value));
            filledCols = Math.max(filledCols, row.length); 
        }
        if ((i + 1) % size === 0) {
            matrix.push(row);
            row = [];
        }
    }

   
    const filteredMatrix = matrix.filter(row => row.some(cell => cell !== null))
        .map(row => row.slice(0, filledCols));

    return filteredMatrix;
}

function setMatrixValues(matrixId, matrix) {
    const matrixDiv = document.getElementById(`matrix${matrixId}`);
    const inputs = matrixDiv.getElementsByTagName('input');
    let index = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            inputs[index].value = matrix[i][j];
            index++;
        }
    }
}

function swapMatrices() {
    const matrixA = getMatrixValues('A');
    const matrixB = getMatrixValues('B');
    const sizeA = matrixA.length;
    const sizeB = matrixB.length;

    createMatrix('A', sizeB);
    createMatrix('B', sizeA);

    setMatrixValues('A', matrixB);
    setMatrixValues('B', matrixA);
}

function displayResult(matrix, operation = null, resultText = '') {
    const resultDiv = document.getElementById('resultMatrix');
    resultDiv.innerHTML = '';

    if (operation === 'determinant' || operation === 'power') {
        const textDiv = document.createElement('div');
        textDiv.textContent = resultText;
        resultDiv.appendChild(textDiv);
    }

    if (matrix.length === 0) {
        return;
    }

    const matrixContainer = document.createElement('div');
    matrixContainer.style.display = 'inline-block';
    matrixContainer.style.marginTop = '10px';
    matrixContainer.style.textAlign = 'center';

    matrixContainer.style.gridTemplateColumns = `repeat(${matrix[0].length}, 1fr)`;
    matrixContainer.style.display = 'grid';
    matrixContainer.style.gap = '5px';

    matrix.forEach(row => {
        row.forEach(value => {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.textContent = value !== null ? value : ''; 
            matrixContainer.appendChild(cell);
        });
    });

    resultDiv.appendChild(matrixContainer);
}

function calculateDeterminant(matrix) {
    const size = matrix.length;

    if (size === 2) {
        // 2x2 matrix determinant
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    } else if (size === 3) {
        // 3x3 matrix determinant
        return matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1])
             - matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0])
             + matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
    } else {
        alert('Determinant calculation for matrices larger than 3x3 is not implemented.');
        return null;
    }
}

function calculateInverse(matrix) {
    const size = matrix.length;

    if (size === 2) {
        // 2x2 matrix inverse
        const determinant = calculateDeterminant(matrix);
        if (determinant === 0) {
            alert('Matrix is singular and cannot be inverted.');
            return null;
        }
        return [
            [matrix[1][1] / determinant, -matrix[0][1] / determinant],
            [-matrix[1][0] / determinant, matrix[0][0] / determinant]
        ];
    } else if (size === 3) {
        // 3x3 matrix inverse
        const determinant = calculateDeterminant(matrix);
        if (determinant === 0) {
            alert('Matrix is singular and cannot be inverted.');
            return null;
        }

        const cofactorMatrix = [
            [
                (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]),
                -(matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]),
                (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
            ],
            [
                -(matrix[0][1] * matrix[2][2] - matrix[0][2] * matrix[2][1]),
                (matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]),
                -(matrix[0][0] * matrix[2][1] - matrix[0][1] * matrix[2][0])
            ],
            [
                (matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]),
                -(matrix[0][0] * matrix[1][2] - matrix[0][2] * matrix[1][0]),
                (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0])
            ]
        ];

        const adjugate = cofactorMatrix[0].map((_, colIndex) => cofactorMatrix.map(row => row[colIndex]));
        return adjugate.map(row => row.map(value => value / determinant));
    } else {
        alert('Inverse calculation for matrices larger than 3x3 is not implemented.');
        return null;
    }
}

function matrixMultiply(matrixA, matrixB) {
    const result = [];
    for (let i = 0; i < matrixA.length; i++) {
        const row = [];
        for (let j = 0; j < matrixB[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < matrixA[0].length; k++) {
                sum += matrixA[i][k] * matrixB[k][j];
            }
            row.push(sum);
        }
        result.push(row);
    }
    return result;
}

function matrixPower(matrix, power) {
    if (power === 0) {
        
        return matrix.map((row, i) => row.map((_, j) => (i === j ? 1 : 0)));
    }

    if (power < 0) {
       
        matrix = calculateInverse(matrix);
        if (!matrix) return null;
        power = -power;
    }

    let result = matrix;
    for (let i = 1; i < power; i++) {
        result = matrixMultiply(result, matrix);
    }
    return result;
}

function calculate(operation) {
    const matrixA = getMatrixValues('A');
    let resultMatrix = [];

    if (matrixA.length === 0) {
        alert('Matrix A must have at least one filled cell.');
        return;
    }

    if (operation === 'determinant') {
        const determinant = calculateDeterminant(matrixA);
        if (determinant !== null) {
            displayResult([], 'determinant', `det(A) = ${determinant}`);
        }
    } else if (operation === 'power') {
        const power = parseInt(document.getElementById('powerInput').value);
        if (isNaN(power)) {
            alert('Please enter a valid integer power.');
            return;
        }
        resultMatrix = matrixPower(matrixA, power);
        if (resultMatrix !== null) {
            displayResult(resultMatrix, 'power', `A^${power}`);
        }
    } else if (operation === 'add' || operation === 'subtract') {
        const matrixB = getMatrixValues('B');
        if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
            alert('Matrices must have the same dimensions for this operation.');
            return;
        }
        for (let i = 0; i < matrixA.length; i++) {
            const row = [];
            for (let j = 0; j < matrixA[0].length; j++) {
                if (operation === 'add') {
                    row.push(matrixA[i][j] + matrixB[i][j]);
                } else {
                    row.push(matrixA[i][j] - matrixB[i][j]);
                }
            }
            resultMatrix.push(row);
        }
        displayResult(resultMatrix);
    } else if (operation === 'multiply') {
        const matrixB = getMatrixValues('B');
        if (matrixA[0].length !== matrixB.length) {
            alert('Number of columns in Matrix A must match number of rows in Matrix B.');
            return;
        }
        resultMatrix = matrixMultiply(matrixA, matrixB);
        displayResult(resultMatrix);
    }
}


createMatrix('A', 3);
createMatrix('B', 3);
