document.addEventListener('DOMContentLoaded', () => {
    const grid = [];
    const gridContainer = document.querySelector('.grid-container');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const newGameBtn = document.getElementById('new-game');
    const tryAgainBtn = document.getElementById('try-again');
    const gameOverScreen = document.querySelector('.game-over');
    
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let isGameOver = false;
    
    // Initialize the game
    function initGame() {
        // Clear the grid
        gridContainer.innerHTML = '';
        grid.length = 0;
        score = 0;
        isGameOver = false;
        updateScore(0);
        gameOverScreen.style.display = 'none';
        
        // Create empty grid
        for (let i = 0; i < 4; i++) {
            grid[i] = [];
            for (let j = 0; j < 4; j++) {
                grid[i][j] = 0;
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                gridContainer.appendChild(cell);
            }
        }
        
        // Add initial tiles
        addRandomTile();
        addRandomTile();
        
        // Update best score display
        bestScoreDisplay.textContent = bestScore;
    }
    
    // Add a new tile (2 or 4) to a random empty cell
    function addRandomTile() {
        const emptyCells = [];
        
        // Find all empty cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 0) {
                    emptyCells.push({row: i, col: j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            // Choose a random empty cell
            const {row, col} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            
            // 90% chance for 2, 10% chance for 4
            grid[row][col] = Math.random() < 0.9 ? 2 : 4;
            
            // Create and animate the new tile
            createTile(row, col, grid[row][col]);
        }
    }
    
    // Create a tile element with animation
    function createTile(row, col, value) {
        const tile = document.createElement('div');
        tile.className = `tile tile-${value}`;
        tile.textContent = value;
        tile.dataset.value = value;
        tile.dataset.row = row;
        tile.dataset.col = col;
        
        // Position the tile
        updateTilePosition(tile, row, col);
        
        gridContainer.appendChild(tile);
        
        // Add animation class
        setTimeout(() => {
            tile.classList.add('appear');
        }, 10);
        
        return tile;
    }
    
    // Update tile position on the grid
    function updateTilePosition(tile, row, col) {
        const cellSize = gridContainer.offsetWidth / 4;
        const padding = 15;
        const gap = 15;
        
        tile.style.width = `${cellSize - gap}px`;
        tile.style.height = `${cellSize - gap}px`;
        tile.style.left = `${col * cellSize + padding}px`;
        tile.style.top = `${row * cellSize + padding}px`;
    }
    
    // Update the score
    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = score;
        
        // Update best score if current score is higher
        if (score > bestScore) {
            bestScore = score;
            bestScoreDisplay.textContent = bestScore;
            localStorage.setItem('bestScore', bestScore);
        }
    }
    
    // Check if there are any moves left
    function hasValidMoves() {
        // Check for empty cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 0) return true;
                
                // Check adjacent cells for possible merges
                if (j < 3 && grid[i][j] === grid[i][j + 1]) return true;
                if (i < 3 && grid[i][j] === grid[i + 1][j]) return true;
            }
        }
        return false;
    }
    
    // Handle game over
    function gameOver() {
        isGameOver = true;
        gameOverScreen.style.display = 'flex';
    }
    
    // Move tiles in the specified direction
    async function moveTiles(direction) {
        if (isGameOver) return;
        
        let moved = false;
        const size = 4;
        const newGrid = JSON.parse(JSON.stringify(grid));
        
        // Get all tiles
        const tiles = Array.from(document.querySelectorAll('.tile'));
        const movingTiles = [];
        
        // Create a copy of the grid to track merged tiles
        const merged = Array(size).fill().map(() => Array(size).fill(false));
        
        // Process the grid based on direction
        const processCell = (i, j) => {
            if (grid[i][j] === 0) return;
            
            let x = i, y = j;
            let newX = x, newY = y;
            let value = grid[x][y];
            
            // Calculate new position based on direction
            if (direction === 'up') {
                while (newX > 0 && grid[newX - 1][y] === 0) newX--;
                if (newX > 0 && grid[newX - 1][y] === value && !merged[newX - 1][y]) {
                    // Merge with the tile above
                    newX--;
                    value *= 2;
                    merged[newX][y] = true;
                    updateScore(value);
                }
            } else if (direction === 'right') {
                while (newY < size - 1 && grid[x][newY + 1] === 0) newY++;
                if (newY < size - 1 && grid[x][newY + 1] === value && !merged[x][newY + 1]) {
                    // Merge with the tile to the right
                    newY++;
                    value *= 2;
                    merged[x][newY] = true;
                    updateScore(value);
                }
            } else if (direction === 'down') {
                while (newX < size - 1 && grid[newX + 1][y] === 0) newX++;
                if (newX < size - 1 && grid[newX + 1][y] === value && !merged[newX + 1][y]) {
                    // Merge with the tile below
                    newX++;
                    value *= 2;
                    merged[newX][y] = true;
                    updateScore(value);
                }
            } else if (direction === 'left') {
                while (newY > 0 && grid[x][newY - 1] === 0) newY--;
                if (newY > 0 && grid[x][newY - 1] === value && !merged[x][newY - 1]) {
                    // Merge with the tile to the left
                    newY--;
                    value *= 2;
                    merged[x][newY] = true;
                    updateScore(value);
                }
            }
            
            // If position changed, mark as moved
            if (x !== newX || y !== newY) {
                moved = true;
            }
            
            // Update the grid
            grid[x][y] = 0;
            grid[newX][newY] = value;
            
            // Find the tile element and update its position
            const tile = tiles.find(t => 
                parseInt(t.dataset.row) === i && 
                parseInt(t.dataset.col) === j
            );
            
            if (tile) {
                movingTiles.push({
                    element: tile,
                    from: { row: x, col: y },
                    to: { row: newX, col: newY },
                    value: value,
                    merged: (x !== newX || y !== newY) && (x !== i || y !== j)
                });
            }
        };
        
        // Process cells in the correct order based on direction
        if (direction === 'up') {
            for (let i = 1; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    processCell(i, j);
                }
            }
        } else if (direction === 'right') {
            for (let j = size - 2; j >= 0; j--) {
                for (let i = 0; i < size; i++) {
                    processCell(i, j);
                }
            }
        } else if (direction === 'down') {
            for (let i = size - 2; i >= 0; i--) {
                for (let j = 0; j < size; j++) {
                    processCell(i, j);
                }
            }
        } else if (direction === 'left') {
            for (let j = 1; j < size; j++) {
                for (let i = 0; i < size; i++) {
                    processCell(i, j);
                }
            }
        }
        
        // Animate the movement
        if (moved) {
            // Update tile positions with animation
            const promises = movingTiles.map(tileData => {
                return new Promise(resolve => {
                    const { element, to, value, merged } = tileData;
                    
                    // Update tile data attributes
                    element.dataset.row = to.row;
                    element.dataset.col = to.col;
                    
                    // If merged, update the value and class
                    if (merged) {
                        element.textContent = value;
                        element.className = `tile tile-${value}`;
                    }
                    
                    // Animate the movement
                    element.style.transition = 'all 0.1s ease-in-out';
                    updateTilePosition(element, to.row, to.col);
                    
                    // Resolve after animation completes
                    setTimeout(() => {
                        element.style.transition = '';
                        resolve();
                    }, 150);
                });
            });
            
            // Wait for animations to complete
            await Promise.all(promises);
            
            // Remove any duplicate tiles (from merges)
            const tileMap = new Map();
            const tilesToRemove = [];
            
            document.querySelectorAll('.tile').forEach(tile => {
                const key = `${tile.dataset.row},${tile.dataset.col}`;
                if (tileMap.has(key)) {
                    tilesToRemove.push(tile);
                } else {
                    tileMap.set(key, tile);
                }
            });
            
            tilesToRemove.forEach(tile => tile.remove());
            
            // Add a new tile after move
            addRandomTile();
            
            // Check for game over
            if (!hasValidMoves()) {
                setTimeout(gameOver, 200);
            }
        }
    }
    
    // Handle keyboard events
    document.addEventListener('keydown', (e) => {
        if (isGameOver) return;
        
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                moveTiles('up');
                break;
            case 'ArrowRight':
                e.preventDefault();
                moveTiles('right');
                break;
            case 'ArrowDown':
                e.preventDefault();
                moveTiles('down');
                break;
            case 'ArrowLeft':
                e.preventDefault();
                moveTiles('left');
                break;
        }
    });
    
    // Handle touch events for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, false);
    
    document.addEventListener('touchend', (e) => {
        if (isGameOver || !touchStartX || !touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        
        // Determine the direction of the swipe
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 30) {
                moveTiles('right');
            } else if (dx < -30) {
                moveTiles('left');
            }
        } else {
            if (dy > 30) {
                moveTiles('down');
            } else if (dy < -30) {
                moveTiles('up');
            }
        }
        
        touchStartX = 0;
        touchStartY = 0;
    }, false);
    
    // New game button
    newGameBtn.addEventListener('click', initGame);
    tryAgainBtn.addEventListener('click', initGame);
    
    // Initialize the game
    initGame();
});
