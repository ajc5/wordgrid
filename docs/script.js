window.onload = function() {
    const rows = 10; // Number of rows
    const cols = 10; // Number of columns
    const table = document.getElementById('spreadsheet');
    const scoreDisplay = document.getElementById('scoreDisplay'); // Get the score display element
    const dictionary = ['APPLE', 'ORANGE', 'BANANA', 'GRAPE', 'CHERRY']; // Example dictionary
    let score = 0;
    let firstInputMade = false;
    createGrid(rows, cols);

    function createGrid(rows, cols) {
        for (let i = 0; i < rows; i++) {
            const row = table.insertRow();
            for (let j = 0; j < cols; j++) {
                const cell = row.insertCell();
                cell.contentEditable = "true";
                cell.tabIndex = 0;
                attachEvents(cell, i, j);
            }
        }
    }

    function attachEvents(cell, row, col) {
        cell.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                navigate(row, col + 1);
            } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
                if (firstInputMade && !canEditCell(row, col)) {
                    event.preventDefault(); // Prevent typing if the cell cannot be edited
                    return;
                }
                if (!firstInputMade || cell.innerText.length === 0) {
                    event.preventDefault();
                    let previousContent = cell.innerText;
                    cell.innerText = event.key.toUpperCase();
                    cell.contentEditable = "false";
                    firstInputMade = true;
                    updateScoreAndStyles(previousContent === '', row, col);
                }
            }

            // Handle arrow key navigation
            switch (event.key) {
                case 'ArrowLeft':
                    navigate(row, col - 1);
                    break;
                case 'ArrowRight':
                    navigate(row, col + 1);
                    break;
                case 'ArrowUp':
                    navigate(row - 1, col);
                    break;
                case 'ArrowDown':
                    navigate(row + 1, col);
                    break;
            }
        });
    }

    function navigate(newRow, newCol) {
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            const targetCell = table.rows[newRow].cells[newCol];
            targetCell.focus();
        }
    }

    function canEditCell(row, col) {
        if (!firstInputMade) return true; // All cells are editable before the first input

        let filledNeighborCount = 0;
        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // Only check left, down, right, up

        directions.forEach(direction => {
            const nRow = row + direction[0], nCol = col + direction[1];
            if (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols && table.rows[nRow].cells[nCol].innerText !== '') {
                filledNeighborCount++;
            }
        });

        return filledNeighborCount === 1; // Editable only if exactly one filled neighbor
    }
    
    function updateScoreAndStyles(wasNewLetter, row, col) {
        checkWordsAndUpdateStyles();
        scoreDisplay.innerText = 'Score: ' + score; // Update the score display
    }

    function checkWordsAndUpdateStyles() {
        updateCellStyles();
        let newScore = 0;
        for (let i = 0; i < rows; i++) {
            let word = '', wordStartIdx = -1;
            for (let j = 0; j < cols; j++) {
                const cell = table.rows[i].cells[j];
                let cellChar = table.rows[i].cells[j].innerText;
                if (cellChar === '' && wordStartIdx >= 0) {
                  if (dictionary.includes(word)) {
                      newScore += word.length;
                      highlightRow(i, wordStartIdx, word.length);
                  }
                  wordStartIdx = -1;
                  word = '';
                } else if (cellChar !== '') {
                  if (wordStartIdx < 0) {
	                    wordStartIdx = j;
                  }
                  word += cellChar;
                }
                
            }
        }

        for (let j = 0; j < cols; j++) {
            let word = '', wordStartIdx = -1;
            for (let i = 0; i < rows; i++) {
                let cellChar = table.rows[i].cells[j].innerText;
                if (cellChar === '' && wordStartIdx >= 0) {
                  if (dictionary.includes(word)) {
                      newScore += word.length;
                      highlightColumn(j, wordStartIdx, word.length);
                  }
                  wordStartIdx = -1;
                  word = '';
                } else if (cellChar !== '') {
                  if (wordStartIdx < 0) {
	                    wordStartIdx = i;
                  }
                  word += cellChar;
                }
            }
        }
        score = newScore; // Update score based on valid words found
    }

    function highlightRow(rowIdx, wordStartIdx, length) {
        let wordEndIdx = wordStartIdx + length;
        for (let i = wordStartIdx; i < wordEndIdx; i++) {
            table.rows[rowIdx].cells[i].style.backgroundColor = '#FFFF99'; // Light yellow
        }
    }
    
    function highlightColumn(colIdx, wordStartIdx, length) {
        let wordEndIdx = wordStartIdx + length;
        for (let i = wordStartIdx; i < wordEndIdx; i++) {
            table.rows[i].cells[colIdx].style.backgroundColor = '#FFFF99'; // Light yellow
        }
    }

    function updateCellStyles() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = table.rows[i].cells[j];
                if (!canEditCell(i, j) && cell.innerText === '') {
                    cell.style.backgroundColor = '#F9EBEA'; // Highlight in specified red shade if editing is not allowed
                } else {
                    cell.style.backgroundColor = ''; // Reset to default
                }
            }
        }
    }
    
    updateScoreAndStyles(true, 0, 0); // Initial score update
};
