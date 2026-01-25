/**
 * Diff-Viewer Logic
 * Implements a basic Longest Common Subsequence (LCS) algorithm to find differences.
 */

// DOM Elements
const editorView = document.getElementById('editor-view');
const diffView = document.getElementById('diff-view');
const inputOrig = document.getElementById('input-original');
const inputMod = document.getElementById('input-modified');
const outOrig = document.getElementById('output-original');
const outMod = document.getElementById('output-modified');

const btnCompare = document.getElementById('btn-compare');
const btnClear = document.getElementById('btn-clear');
const btnEdit = document.getElementById('btn-edit');

// Event Listeners
btnCompare.addEventListener('click', runCompare);
btnEdit.addEventListener('click', toggleView);
btnClear.addEventListener('click', () => {
    inputOrig.value = '';
    inputMod.value = '';
    toggleView(true); // Switch back to edit
});

// Sync Scrolling
// When one panel scrolls, scroll the other
outOrig.addEventListener('scroll', () => {
    outMod.scrollTop = outOrig.scrollTop;
});
outMod.addEventListener('scroll', () => {
    outOrig.scrollTop = outMod.scrollTop;
});

function toggleView(forceEdit = false) {
    if (forceEdit || diffView.classList.contains('hidden')) {
        // Switch to Diff
        return; 
    }
    
    // Toggle classes
    if (editorView.classList.contains('hidden')) {
        editorView.classList.remove('hidden');
        diffView.classList.add('hidden');
        btnCompare.style.display = 'flex';
    } else {
        editorView.classList.add('hidden');
        diffView.classList.remove('hidden');
        btnCompare.style.display = 'none';
    }
}

function runCompare() {
    const text1 = inputOrig.value;
    const text2 = inputMod.value;

    if (!text1 && !text2) return;

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');

    // Calculate Diff Matrix
    const matrix = lcsMatrix(lines1, lines2);
    // Backtrack to find path
    const diff = backtrack(matrix, lines1, lines2);

    renderDiff(diff, lines1, lines2);

    // Switch View
    editorView.classList.add('hidden');
    diffView.classList.remove('hidden');
    btnCompare.style.display = 'none';
}

/**
 * Standard LCS Algorithm (Dynamic Programming)
 * Returns a matrix of lengths of LCS.
 */
function lcsMatrix(arr1, arr2) {
    const rows = arr1.length;
    const cols = arr2.length;
    const dp = Array(rows + 1).fill(null).map(() => Array(cols + 1).fill(0));

    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {
            if (arr1[i - 1] === arr2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp;
}

/**
 * Backtrack through the matrix to classify lines as:
 * 'common', 'removed' (from A), or 'added' (to B)
 */
function backtrack(dp, arr1, arr2) {
    let i = arr1.length;
    let j = arr2.length;
    const result = [];

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && arr1[i - 1] === arr2[j - 1]) {
            result.unshift({ type: 'common', content: arr1[i - 1], lineA: i, lineB: j });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            result.unshift({ type: 'added', content: arr2[j - 1], lineB: j });
            j--;
        } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
            result.unshift({ type: 'removed', content: arr1[i - 1], lineA: i });
            i--;
        }
    }
    return result;
}

function renderDiff(diffData) {
    let htmlOrig = '';
    let htmlMod = '';

    diffData.forEach(item => {
        if (item.type === 'common') {
            htmlOrig += createLineHTML(item.lineA, item.content, '');
            htmlMod += createLineHTML(item.lineB, item.content, '');
        } 
        else if (item.type === 'removed') {
            htmlOrig += createLineHTML(item.lineA, item.content, 'removed');
            htmlMod += createLineHTML('', '', 'empty'); // Filler
        } 
        else if (item.type === 'added') {
            htmlOrig += createLineHTML('', '', 'empty'); // Filler
            htmlMod += createLineHTML(item.lineB, item.content, 'added');
        }
    });

    outOrig.innerHTML = htmlOrig;
    outMod.innerHTML = htmlMod;
}

function createLineHTML(num, content, type) {
    // Escape HTML to prevent injection
    const safeContent = content ? content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
    
    return `
    <div class="diff-line ${type}">
        <div class="line-num">${num || ''}</div>
        <div class="line-content">${safeContent || '&nbsp;'}</div>
    </div>`;
}

// Initial Sample
inputOrig.value = `function hello() {
  console.log("Hello World");
  return true;
}`;
inputMod.value = `function hello() {
  console.log("Hello Universe"); // Changed
  const x = 10;
  return true;
}`;