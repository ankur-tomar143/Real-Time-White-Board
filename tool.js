//select element
//add the event listner
//aaply changes
//Document refer to HTML page who has a script tag.
//if we want to draw browser will tell how to do it.

// let pencilElement = document.querySelector("#pencil");
// let eraserElement = document.querySelector("#eraser");
// let stickyElement = document.querySelector("#sticky");
// let uploadElement = document.querySelector("#upload");
// let downloadElement = document.querySelector("#download");
// let undoElement = document.querySelector("#undo");
// let redoElement = document.querySelector("#redo");




// pencilElement.addEventListener("click", function tellPencil() {
//   console.log("pencil clicked");
// });

// eraserElement.addEventListener("click", function tellEraser() {
//   console.log("eraser clicked");
// });

// stickyElement.addEventListener("click", function tellSticky() {
//   console.log("sticky clicked");
// });

// uploadElement.addEventListener("click", function tellUpload() {
//   console.log("upload clicked");
// });

// downloadElement.addEventListener("click", function tellDownload() {
//   console.log("download clicked");
// });

// undoElement.addEventListener("click", function tellUndo() {
//   console.log("undo clicked");
// });

// redoElement.addEventListener("click", function tellRedo() {
//   console.log("redo clicked");
// });

//select canvas tag and gives height and width as window
let canvas = document.querySelector("#board");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// draw something on canvas

//tool begin path - you want to start drawing
// tool.beginPath();
// // moveTo(x,y) define starting point of deawing 
// tool.moveTo(90,140);
// //end point of drawing is lineTO
// tool.lineTo(400,150);
// tool.moveTo(40,110);
// tool.lineTo(800,250);
// //It essentially connects the points you've specified using 
// tool.stroke();
// //used to close current path of drawing before start new one
//  tool.closePath();

// /*****path 2 */
// tool.beginPath();//start point of new instance of drawing
// tool.strokeStyle = "red";
// //width of line which wil we draw
// tool.lineWidth = 5;
// tool.moveTo(90,140);
// tool.lineTo(300,350);
// tool.stroke();

// Implement line
// 1. Mouse canvas press
// 2. Mouse canvas lift
// Mouse down use to get the position of mouse when we clicked
// e.clientX,y;// Position of the mouse on and off the screen horizontally, vertically
//This method returns an object that gives us access to various drawing functions and properties.

let tool = canvas.getContext("2d");
// tool selector logic
let toolsArr = document.querySelectorAll(".tool");
let currentTool = "pencil";
for (let i = 0; i < toolsArr.length; i++) {
  toolsArr[i].addEventListener("click", function(e) {
    // console.log("clicked on",toolsArr[i]);
    const toolName = toolsArr[i].id;
    if (toolName === "pencil") {
      currentTool = "pencil";
      tool.strokeStyle = "black";
    } else if (toolName === "eraser") {
      currentTool = "eraser";
      tool.strokeStyle = "white";
      tool.lineWidth = 10;
    } else if (toolName === "sticky") {
      currentTool = "sticky";
      createSticky();
    } else if (toolName === "upload") {
      currentTool = "upload";
      uploadFile();
    } else if (toolName === "download") {
      currentTool = "download";
      downloadFile();
    } else if (toolName === "undo") {
      currentTool = "undo";
      undoFN();
    } else if (toolName === "redo") {
      currentTool = "redo";
      redoFN();
    }
  })
}


// drawing logic
let undoStack = [];
let redoStack = [];

let isDrawing = false;
// pencil logic
canvas.addEventListener("mousedown", function(e) {
  let sidx = e.clientX;
  let sidy = e.clientY;
  tool.beginPath();
  let toolBarHeight = getYDelta();
  tool.moveTo(sidx, sidy - toolBarHeight);
  isDrawing = true;

  let pointDesc = {
    x: sidx,
    y: sidy - toolBarHeight,
    desc: "md"
  }
  undoStack.push(pointDesc);
})
//mouseUP used when we lift mouse

canvas.addEventListener("mousemove", function(e) {
  //continue runing untill mouse on screen
  if (isDrawing == false) {
    return;
  }
  let eidx = e.clientX;
  let eidy = e.clientY;//from window 0.0
  let toolBarHeight = getYDelta();
  tool.lineTo(eidx, eidy - toolBarHeight);//from canvas 0.0//
  tool.stroke();
  //store point undo
  let pointDesc = {
    x: eidx,
    y: eidy - toolBarHeight,
    desc: "mn"
  }
  undoStack.push(pointDesc);

})

canvas.addEventListener("mouseup", function(e) {
  isDrawing = false;// if we dont use it run endless never stop

})

let toolBar = document.querySelector(".toolbar");

function getYDelta() {
  // information about the element's size and position relative to the viewport
  let heightOfToolBar = toolBar.getBoundingClientRect().height;
  return heightOfToolBar;
}

function createOuterShell() {
  let stickyDiv = document.createElement("div");
  let navDiv = document.createElement("div");
  let closeDiv = document.createElement("div");
  let minimizeDiv = document.createElement("div");
  let textArea = document.createElement("textarea");

  //add classes
  stickyDiv.setAttribute("class", "sticky");
  navDiv.setAttribute("class", "nav");
  textArea.setAttribute("class", "text-area");

  closeDiv.innerText = "X";
  minimizeDiv.innerText = "MIN";
  //structure of sticky
  stickyDiv.appendChild(navDiv);
  // stickyDiv.appendChild(textArea);
  navDiv.appendChild(minimizeDiv);
  navDiv.appendChild(closeDiv);

  //add page to HTML
  document.body.appendChild(stickyDiv);

  closeDiv.addEventListener("click", function() {
    stickyDiv.remove();
  })

  let isMinimized = false;
  minimizeDiv.addEventListener("click", function() {
    textArea.style.display = isMinimized ? "block" : "none";
    isMinimized = !isMinimized;

  })

  //navbar - mouseup and mouse move

  let isStickyDown = false;
  let initialX;
  let initialY;

  navDiv.addEventListener("mousedown", function(e) {
    initialX = e.clientX;
    initialY = e.clientY;
    isStickyDown = true;
  })

  navDiv.addEventListener("mousemove", function(e) {
    if (isStickyDown == true) {
      let dx = e.clientX - initialX;
      let dy = e.clientY - initialY;
      let { top, left } = stickyDiv.getBoundingClientRect();
      stickyDiv.style.top = top + dy + "px";
      stickyDiv.style.left = left + dx + "px";
      initialX = e.clientX;
      initialY = e.clientY;
    }
  })

  navDiv.addEventListener("mouseup", function() {
    isStickyDown = false;
  })
  return stickyDiv;
}

//create stiky
// 1.static version, how it will add to UI. funcationality

function createSticky() {
  let stickyDiv = createOuterShell();
  let textArea = document.createElement("textarea");
  textArea.setAttribute("class", "text-area");
  stickyDiv.appendChild(textArea);
}


//upload file logic
let inputTag = document.querySelector(".input-tag");
function uploadFile() {
  // 1.input tag -> to get input for user(Its open POP UP)
  // 2.click on image then input tag is click so that user gives input
  // 3.file read from input tag and add it to UI.

  inputTag.click();
  // console.log(inputTag.files);

  inputTag.addEventListener('change', function() {
    let data = inputTag.files[0];
    //add data to UI
    let img = document.createElement("img");
    //convert img to URL
    img.src = URL.createObjectURL(data);
    // add it inside stickky
    img.setAttribute("class", "upload-img");

    // document.body.appendChild(img);
    let stickyDiv = createOuterShell();
    stickyDiv.appendChild(img);

  })

}

//download file logic

function downloadFile() {
  // 1.First make anchor button
  // 2. then assing canvas to href 
  // 3.click on achor and then remove

  let a = document.createElement("a");
  a.download = "file.png";
  let url = canvas.toDataURL('image/jpeg;bas64');
  a.href = url;
  a.click();
  a.remove();
}


//undo redo function logic
// 1.First store all co ordinates(point to access draw points)
// remove last point
// then redraw the last point


function redRow() {
  for (let i = 0; i < undoStack.length; i++) {
    let { x, y, desc } = undoStack[i];
    if (desc === "md") {
      tool.beginPath();
      tool.moveTo(x, y);
    } else if (desc == "mn") {
      tool.lineTo(x, y);
      tool.stroke();
    }
  }
}

function undoFN() {
  tool.clearRect(0, 0, canvas.width, canvas.height);
  if (undoStack.length > 0) {
    redoStack.push(undoStack.pop());

    redRow();
  }
}

//redo function
function redoFN() {
  if (redoStack.length > 0) {
    undoStack.push(redoStack.pop());

    redRow();
  }
}

//fix the toolbar at top 
//fix the toolbar at top 

