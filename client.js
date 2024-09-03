const socket = io();

// Canvas and drawing context
let canvas = document.querySelector("#board");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let tool = canvas.getContext("2d");

let isDrawing = false;

canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    tool.beginPath();
    tool.moveTo(e.clientX, e.clientY);
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    tool.lineTo(e.clientX, e.clientY);
    tool.stroke();
    socket.emit('drawing', { x: e.clientX, y: e.clientY });
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

// Listen for drawing events
socket.on('drawing', (data) => {
    tool.lineTo(data.x, data.y);
    tool.stroke();
});

// Additional event listeners for sticky notes, undo, redo, etc.
