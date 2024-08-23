// ==UserScript==
// @name         Tic Tac Toe AI for papergames
// @namespace    https://github.com/longkidkoolstar
// @version      1.0.1
// @description  AI plays Tic-Tac-Toe for you on papergames.io. Have fun and destroy some nerds 😃!!
// @author       longkidkoolstar
// @icon         https://th.bing.com/th/id/R.3502d1ca849b062acb85cf68a8c48bcd?rik=LxTvt1UpLC2y2g&pid=ImgRaw&r=0
// @match        https://papergames.io/*
// @license      none
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

(async function() {
    'use strict';

    var depth = await GM.getValue('depth', depth);
    var user = await GM.getValue('user', user);

// Function to check if the element is visible
function isElementVisible(element) {
    return element && element.style.display !== 'none';
  }

  // Function to check for the element and click it when it becomes visible
  function waitForElementAndClick(targetElementSelector, triggerElementSelector, pollingInterval) {
    var xMark = document.querySelector(targetElementSelector);
    var countDown = document.querySelector(triggerElementSelector);

    var intervalId = setInterval(function() {
      // Check if the countDown element is now visible
      if (isElementVisible(countDown)) {
        console.log("Element is visible. Clicking.");
        xMark.click();
        clearInterval(intervalId); // Stop polling
      }
    }, pollingInterval);
  }

  // Start polling every 1 second (adjust the interval as needed)
  waitForElementAndClick('svg.fa-xmark', 'app-count-down span', 1000);






  function getBoardState() {
    var boardState = [];
    var gridItems = document.querySelectorAll('.grid.size-3x3 .grid-item');

    for (var i = 0; i < 3; i++) {
        var row = [];
        for (var j = 0; j < 3; j++) {
            var cell = gridItems[i * 3 + j];
            var svg = cell.querySelector('svg');
            if (svg) {
                var label = svg.getAttribute('aria-label');
                row.push(label.toLowerCase());
            } else {
                row.push('_'); // An empty cell
            }
        }
        boardState.push(row);
    }
    return boardState;
}

function simulateCellClick(row, col) {
    var gridItems = document.querySelectorAll('.grid.size-3x3 .grid-item');
    var cell = gridItems[row * 3 + col];
    if (cell) {
        var event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            //view: window
        });
        cell.dispatchEvent(event);
    }
}

    var prevChronometerValue = null;


// Check if username is stored using GM.getValue
(async function() {
    let user = await GM.getValue('user', '');

    if (!user) {
        // Alert the user
        alert('Username is not stored.');

        // Prompt the user to enter the username
        user = prompt('Please enter your Papergames username (case-sensitive):');

        // Save the username using GM.setValue
        await GM.setValue('user', user);
    }
})();

async function logout() {
    // Remove the stored username
    await GM.deleteValue('user');
    location.reload();
}

    function createLogoutButton() {
        var logoutButton = document.createElement('button');
        logoutButton.textContent = 'Logout';
        logoutButton.style.position = 'fixed';
        logoutButton.style.bottom = '20px';
        logoutButton.style.right = '20px';
        logoutButton.style.zIndex = '9999';
        logoutButton.style.color = 'white'; // Set the text color to white
        logoutButton.classList.add('btn', 'btn-secondary', 'mb-2', 'ng-star-inserted');
        logoutButton.addEventListener('click', logout);
        logoutButton.addEventListener('mouseover', function() {
            logoutButton.style.opacity = '0.5'; // Dim the button when hovered over
        });
        logoutButton.addEventListener('mouseout', function() {
            logoutButton.style.opacity = '1'; // Restore the button opacity when mouse leaves
        });
        document.body.appendChild(logoutButton);
    }
    createLogoutButton();
//------------------------------------------------

(async function() {
    'use strict';

    // Create a container for the dropdown
    var dropdownContainer = document.createElement('div');
    dropdownContainer.style.position = 'fixed';
    dropdownContainer.style.bottom = '20px';
    dropdownContainer.style.left = '20px';
    dropdownContainer.style.zIndex = '9998';
    dropdownContainer.style.backgroundColor = '#1b2837';
    dropdownContainer.style.border = '1px solid #18bc9c';
    dropdownContainer.style.borderRadius = '5px';

    // Create a button to toggle the dropdown
    var toggleButton = document.createElement('button');
    toggleButton.textContent = 'Settings';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.border = 'none';
    toggleButton.classList.add('btn', 'btn-secondary', 'mb-2', 'ng-star-inserted');
    toggleButton.style.backgroundColor = '#007bff';
    toggleButton.style.color = 'white';
    toggleButton.style.borderRadius = '5px';
    toggleButton.addEventListener('mouseover', function() {
        toggleButton.style.opacity = '0.5'; // Dim the button when hovered over
    });
    toggleButton.addEventListener('mouseout', function() {
        toggleButton.style.opacity = '1'; // Restore the button opacity when mouse leaves
    });

    // Create the dropdown content
    var dropdownContent = document.createElement('div');
    dropdownContent.style.display = 'none';
    dropdownContent.style.padding = '8px';


    // Create the "Auto Queue" tab
    var autoQueueTab = document.createElement('div');
    autoQueueTab.textContent = 'Auto Queue';
    autoQueueTab.style.padding = '5px 0';
    autoQueueTab.style.cursor = 'pointer';

    // Create the "Depth Slider" tab
    var depthSliderTab = document.createElement('div');
    depthSliderTab.textContent = 'Depth Slider';
    depthSliderTab.style.padding = '5px 0';
    depthSliderTab.style.cursor = 'pointer';

    // Create the settings for "Auto Queue"
    var autoQueueSettings = document.createElement('div');
    autoQueueSettings.textContent = 'Auto Queue Settings';
    autoQueueSettings.style.display = 'none'; // Initially hidden
    autoQueueSettings.style.padding = '10px';

    // Create the settings for "Depth Slider"
    var depthSliderSettings = document.createElement('div');
    depthSliderSettings.style.display = 'none'; // Initially displayed for this tab
    depthSliderSettings.style.padding = '10px';

    // Create the depth slider
    var depthSlider = document.createElement('input');
    depthSlider.type = 'range';
    depthSlider.min = '1';
    depthSlider.max = '100';
    var storedDepth = await GM.getValue('depth');
    depthSlider.value = storedDepth !== null ? storedDepth : '20';

    // Add event listener to the depth slider
    depthSlider.addEventListener('input', async function(event) {
        var depth = Math.round(depthSlider.value);
        await GM.setValue('depth', depth.toString());

        // Show the popup with the current depth value
        var popup = document.querySelector('.depth-popup'); // Use an existing popup or create a new one
        if (!popup) {
            popup = document.createElement('div');
            popup.classList.add('depth-popup');
            popup.style.position = 'fixed';
            popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            popup.style.color = 'white';
            popup.style.padding = '5px 10px';
            popup.style.borderRadius = '5px';
            popup.style.zIndex = '9999';
            popup.style.display = 'none';
            document.body.appendChild(popup);
        }

        popup.innerText = 'Depth: ' + depth;
        popup.style.display = 'block';

        // Calculate slider position and adjust popup position
        var sliderRect = depthSlider.getBoundingClientRect();
        var popupX = sliderRect.left + ((depthSlider.value - depthSlider.min) / (depthSlider.max - depthSlider.min)) * sliderRect.width - popup.clientWidth / 2;
        var popupY = sliderRect.top - popup.clientHeight - 10;

        popup.style.left = popupX + 'px';
        popup.style.top = popupY + 'px';

        // Start a timer to hide the popup after a certain duration (e.g., 2 seconds)
        setTimeout(function() {
            popup.style.display = 'none';
        }, 2000);
    });

    // Append the depth slider to the "Depth Slider" settings
    depthSliderSettings.appendChild(depthSlider);


    // Create the settings for "Auto Queue"
    var autoQueueSettings = document.createElement('div');
    autoQueueSettings.style.padding = '10px';

    // Create the "Auto Queue" toggle button
    var autoQueueToggleButton = document.createElement('button');
    autoQueueToggleButton.textContent = 'Auto Queue Off';
    autoQueueToggleButton.style.marginTop = '10px';
    autoQueueToggleButton.style.display = 'none';
    autoQueueToggleButton.classList.add('btn', 'btn-secondary', 'mb-2', 'ng-star-inserted');
    autoQueueToggleButton.style.backgroundColor = 'red'; // Initially red for "Off"
    autoQueueToggleButton.style.color = 'white';
    autoQueueToggleButton.addEventListener('click', toggleAutoQueue);

    autoQueueSettings.appendChild(autoQueueToggleButton);

    var isAutoQueueOn = false; // Track the state

    function toggleAutoQueue() {
        // Toggle the state
        isAutoQueueOn = !isAutoQueueOn;
        localStorage.setItem('isToggled', isAutoQueueOn);

        // Update the button text and style based on the state
        autoQueueToggleButton.textContent = isAutoQueueOn ? 'Auto Queue On' : 'Auto Queue Off';
        autoQueueToggleButton.style.backgroundColor = isAutoQueueOn ? 'green' : 'red';
    }

    function clickLeaveRoomButton() {
        var leaveRoomButton = document.querySelector("button.btn-light.ng-tns-c189-7");
        if (leaveRoomButton) {
            leaveRoomButton.click();
        }
    }


    function clickPlayOnlineButton() {
        var playOnlineButton = document.querySelector("button.btn-secondary.flex-grow-1");
        if (playOnlineButton) {
            playOnlineButton.click();
        }
    }

    // Periodically check for buttons when the toggle is on
    function checkButtonsPeriodically() {
        if (isAutoQueueOn) {
            clickLeaveRoomButton();
            clickPlayOnlineButton();
        }
    }




    // Set up periodic checking
    setInterval(checkButtonsPeriodically, 1000);

//------------------------------------------------------------------------Testing Purposes

let previousNumber = null; // Initialize the previousNumber to null

function trackAndClickIfDifferent() {
  // Select the <span> element using its class name
  const spanElement = document.querySelector('app-count-down span');

  if (spanElement) {
    // Extract the number from the text content
    const number = parseInt(spanElement.textContent, 10);

    // Check if parsing was successful
    if (!isNaN(number)) {


      // Check if the number has changed since the last check
      if (previousNumber !== null && number !== previousNumber && isAutoQueueOn) {
        spanElement.click();
      }

      // Update the previousNumber with the current value
      previousNumber = number;
    }
  }
}

// Set up an interval to call the function at regular intervals (e.g., every 1 second)
setInterval(trackAndClickIfDifferent, 1000); // 1000 milliseconds = 1 second



//-------------------------------------------------------------------------------------------


    // Append the toggle button to the "Auto Queue" settings
    autoQueueSettings.appendChild(autoQueueToggleButton);

    // Add event listeners to the tabs to toggle their respective settings
    autoQueueTab.addEventListener('click', function() {
        // Hide the depth slider settings
        depthSliderSettings.style.display = 'none';
        // Show the auto queue settings
        autoQueueSettings.style.display = 'block';
        autoQueueToggleButton.style.display = 'block';
    });

    depthSliderTab.addEventListener('click', function() {
        // Hide the auto queue settings
        autoQueueSettings.style.display = 'none';
        // Show the depth slider settings
        depthSliderSettings.style.display = 'block';
    });

    // Append the tabs and settings to the dropdown content
    dropdownContent.appendChild(autoQueueTab);
    dropdownContent.appendChild(autoQueueSettings);
    dropdownContent.appendChild(depthSliderTab);
    dropdownContent.appendChild(depthSliderSettings);

    // Append the button and dropdown content to the container
    dropdownContainer.appendChild(toggleButton);
    dropdownContainer.appendChild(dropdownContent);

    // Toggle the dropdown when the button is clicked
    toggleButton.addEventListener('click', function() {
        if (dropdownContent.style.display === 'none') {
            dropdownContent.style.display = 'block';
        } else {
            dropdownContent.style.display = 'none';
        }
    });

    // Append the dropdown container to the document body
    document.body.appendChild(dropdownContainer);
})();




//------------------------------------------------



function updateBoard(squareId) {
    var row = parseInt(squareId[0]);
    var col = parseInt(squareId[1]);

    var profileOpeners = document.querySelectorAll(".text-truncate.cursor-pointer");
    var profileOpener = null;

    profileOpeners.forEach(function(opener) {
        if (opener.textContent.trim() === user) {
            profileOpener = opener;
        }
    });

    var chronometer = document.querySelector("app-chronometer");

    var numberElement = profileOpener.parentNode.querySelectorAll("span")[4];
    var profileOpenerParent = profileOpener.parentNode.parentNode;
    var svgElement = profileOpenerParent.querySelector("circle[class*='circle-dark-stroked']");
    if (!svgElement) {
        svgElement = profileOpenerParent.querySelector("svg[class*='fa-xmark']");
    }

    if (svgElement && svgElement.closest("circle[class*='circle-dark-stroked']")) {
        player = 'o'; // Player is playing as "O"
    } else if (svgElement && svgElement.closest("svg[class*='fa-xmark']")) {
        player = 'x'; // Player is playing as "X"
    }

    var currentElement = chronometer || numberElement;

    if (currentElement.textContent !== prevChronometerValue && profileOpener) {
        prevChronometerValue = currentElement.textContent;
        simulateCellClick(row, col);
    } else {
        console.log("Waiting for AI's turn...");
    }

    return player;
}

var player;

function debugVariables() {
    console.log("player:", player);
    console.log("row:", row);
    console.log("col:", col);
    console.log("profileOpener:", profileOpener);
    console.log("chronometer:", chronometer);
    console.log("numberElement:", numberElement);
    console.log("profileOpenerParent:", profileOpenerParent);
    console.log("svgElement:", svgElement);
    console.log("prevChronometerValue:", prevChronometerValue);
}
setInterval(debugVariables, 1000);

    function initGame() {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.id === 'tic-tac-toe-board') {
                    initAITurn();
                }
            });
        });

        observer.observe(document.getElementById('tic-tac-toe-board'), { attributes: true, childList: true, subtree: true });
    }
console.log(player)

function initAITurn() {
    displayBoardAndPlayer();
    var boardState = getBoardState();
    var bestMove = findBestMove(boardState, player);
    updateBoard(bestMove.row.toString() + bestMove.col.toString());
}

function findBestMove(board, player) {
    console.log("Current player: " + player); // Debug statement to show the value of the player variable

    var bestVal = -1000;
    var bestMove = { row: -1, col: -1 };

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] === '_') {
                board[i][j] = player;
                var moveVal = minimax(board, 0, false, depth);
                board[i][j] = '_';

                if (moveVal > bestVal) {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestVal = moveVal;
                }
            }
        }
    }

    console.log("The value of the best Move is: " + bestVal);
    return bestMove;
}

    function displayBoardAndPlayer() {
        var boardState = getBoardState();
        //console.log("AI Player: " + player);
        console.log("Board State:");
        boardState.forEach(function(row) {
            console.log(row.join(' | '));
        });
    }

    function getOpponent(player) {
        return player === 'x' ? 'o' : 'x';
    }
    function minimax(board, depth, isMaximizingPlayer, maxDepth) {
        var score = evaluateBoard(board);

        if (depth === maxDepth) {
            return evaluateBoard(board);
        }

        if (score === 10)
            return score - depth;

        if (score === -10)
            return score + depth;

        if (areMovesLeft(board) === false)
            return 0;

        if (isMaximizingPlayer) {
            var best = -1000;

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    if (board[i][j] === '_') {
                        board[i][j] = player; // AI places the current player's symbol
                        best = Math.max(best, minimax(board, depth + 1, !isMaximizingPlayer));
                        board[i][j] = '_';
                    }
                }
            }
            return best;
        } else {
            var best = 1000;

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    if (board[i][j] === '_') {
                        board[i][j] = getOpponent(player); // Opponent places the opposite symbol of the current player
                        best = Math.min(best, minimax(board, depth + 1, !isMaximizingPlayer));
                        board[i][j] = '_';
                    }
                }
            }
            return best;
        }
    }
    function evaluateBoard(board) {
        // Check rows for victory
        for (let row = 0; row < 3; row++) {
            if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
                if (board[row][0] === player) return +10;
                else if (board[row][0] !== '_') return -10;
            }
        }

        // Check columns for victory
        for (let col = 0; col < 3; col++) {
            if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
                if (board[0][col] === player) return +10;
                else if (board[0][col] !== '_') return -10;
            }
        }

        // Check diagonals for victory
        if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            if (board[0][0] === player) return +10;
            else if (board[0][0] !== '_') return -10;
        }

        if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            if (board[0][2] === player) return +10;
            else if (board[0][2] !== '_') return -10;
        }

        // If no one has won, return 0
        return 0;
    }

    function areMovesLeft(board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '_') return true;
            }
        }
        return false;
    }

    setInterval(function() {
        initAITurn();
    }, 1000);

    document.addEventListener('DOMContentLoaded', function() {
        initGame();
        console.log(player);
    });
})();