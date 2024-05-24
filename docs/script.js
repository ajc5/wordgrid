window.onload = function() {
    const rows = 6; // Number of rows
    const cols = 6; // Number of columns
    const table = document.getElementById('spreadsheet');
    const scoreDisplay = document.getElementById('scoreDisplay'); // Get the score display element
    const resetBtn = document.getElementById('resetBtn');
    let firstInputMade = false;
        
    createGrid(rows, cols);

    resetBtn.addEventListener('click', function(e) {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          table.rows[i].cells[j].innerText = '';
        }
      }
      firstInputMade = false;
      checkWordsAndUpdateStyles();
    });
    
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
                    checkWordsAndUpdateStyles();
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

    function checkWordsAndUpdateStyles() {
        updateCellStyles();
        let usedWords = {};
        highlightWords(true, usedWords);
        highlightWords(false, usedWords);
        scoreDisplay.innerText = 'Score: ' + calculateScore(usedWords); // Update the score 
    }

    function highlightWords(rowwise, usedWords) {
      for (let i = 0; i < (rowwise ? rows : cols); i++) {
            let word = '', wordStartIdx = -1;
            for (let j = 0; j < (rowwise ? cols : rows); j++) {
            		let rowIdx = rowwise ? i : j;
                let colIdx = rowwise ? j : i;
                let cellChar = table.rows[rowIdx].cells[colIdx].innerText;
								let nxtRowIdx = rowIdx + (rowwise ? 0 : 1);
                let nxtColIdx = colIdx + (rowwise ? 1 : 0);
                if (cellChar === '') {
                  wordStartIdx = -1;
                  word = '';
                } else {
                  if (wordStartIdx < 0) {
	                    wordStartIdx = j;
                  }
                  word += cellChar;
                }
                if ((!table.rows[nxtRowIdx] || !table.rows[nxtRowIdx].cells[nxtColIdx] || table.rows[nxtRowIdx].cells[nxtColIdx].innerText === '') && word.length > 0 && dictionary.includes(word.toLowerCase())) {
                    usedWords[word] = true;
                    highlightWord(rowwise, i, wordStartIdx, word.length);
                    wordStartIdx = -1;
                    word = '';
                }
            }
        }
    }
    
    function calculateScore(usedWords) {
      console.log(usedWords)
    	let score = 0;
      for (let word of Object.keys(usedWords)) {
      	score += word.length;
      }
      return score;
    }
    
		function highlightWord(isRow, idx, wordStartIdx, length) {
        let wordEndIdx = wordStartIdx + length;
        for (let i = wordStartIdx; i < wordEndIdx; i++) {
            table.rows[isRow ? idx : i].cells[isRow ? i : idx].style.backgroundColor = '#FFFF99'; // Light yellow
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
    checkWordsAndUpdateStyles(); // Initial score update
};