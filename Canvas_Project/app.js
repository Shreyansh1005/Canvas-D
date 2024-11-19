const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let textHistory = [];
let redoHistory = [];
let currentText = {
  text: '',
  x: 50,
  y: 50,
  font: '20px Arial',
  bold: false,
  italic: false,
  underline: false
};

let isDragging = false;
let offsetX, offsetY;

// Function to draw all the text on the canvas
function drawText() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  textHistory.forEach(item => {
    ctx.font = item.font;
    if (item.bold) ctx.font = "bold " + ctx.font;
    if (item.italic) ctx.font = "italic " + ctx.font;
    ctx.fillText(item.text, item.x, item.y);

    if (item.underline) {
      const textWidth = ctx.measureText(item.text).width;
      const textHeight = parseInt(item.font, 10); // Approximate text height
      ctx.beginPath();
      ctx.moveTo(item.x, item.y + 1);
      ctx.lineTo(item.x + textWidth, item.y + 1);
      ctx.stroke();
    }
  });
}

// Function to add text to the canvas
function addText() {
  const textInput = document.getElementById('textInput').value;
  const fontSelect = document.getElementById('fontSelect').value;
  const fontSize = document.getElementById('fontSize').value;

  const boldCheckbox = document.getElementById('boldCheckbox');
  const italicCheckbox = document.getElementById('italicCheckbox');
  const underlineCheckbox = document.getElementById('underlineCheckbox');

  if (textInput.trim() !== '') {
    // Apply the selected text styles
    currentText = {
      text: textInput,
      x: 50,
      y: 50,
      font: `${fontSize}px ${fontSelect}`,
      bold: boldCheckbox.checked,
      italic: italicCheckbox.checked,
      underline: underlineCheckbox.checked
    };

    // Push to text history and reset redo history
    textHistory.push({ ...currentText });
    redoHistory = []; // Clear redo history when new action is made
    drawText();
  }
}

// Mouse down event to start dragging
canvas.addEventListener('mousedown', (e) => {
  const { offsetX: mouseX, offsetY: mouseY } = e;
  // Check if the click is within the text boundaries
  textHistory.forEach((item, index) => {
    ctx.font = item.font;
    if (item.bold) ctx.font = "bold " + ctx.font;
    if (item.italic) ctx.font = "italic " + ctx.font;
    const textWidth = ctx.measureText(item.text).width;
    const textHeight = parseInt(item.font, 10); // Approximate text height

    if (
      mouseX >= item.x &&
      mouseX <= item.x + textWidth &&
      mouseY >= item.y - textHeight &&
      mouseY <= item.y
    ) {
      isDragging = true;
      offsetX = mouseX - item.x;
      offsetY = mouseY - item.y;
      currentText = { ...item, index };
    }
  });
});

// Mouse move event to drag the text
canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const { offsetX: mouseX, offsetY: mouseY } = e;
    const index = currentText.index;
    textHistory[index].x = mouseX - offsetX;
    textHistory[index].y = mouseY - offsetY;
    drawText();
  }
});

// Mouse up event to stop dragging
canvas.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    redoHistory = []; // Clear redo history when new action is made
  }
});

// Undo functionality
function undo() {
  if (textHistory.length > 0) {
    redoHistory.push(textHistory.pop());
    drawText();
  }
}

// Redo functionality
function redo() {
  if (redoHistory.length > 0) {
    textHistory.push(redoHistory.pop());
    drawText();
  }
}
