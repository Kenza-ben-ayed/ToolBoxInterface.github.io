// --------------------- Variables --------------------- //

// Reference to the modal and the slider
const eraserSizeModal = document.getElementById("eraser-size-modal");
const eraserSizeSlider = document.getElementById("eraser-size-slider");
const eraserSizeCircle = document.getElementById("eraser-size-circle");
const eraserSizeDisplay = document.getElementById("eraser-size-display");
const closeEraserModalButton = document.getElementById("close-eraser-modal");

//final Viewer interface
const finalViewer = document.getElementById("final-viewer");
const viewerBody = document.getElementById("viewer-body");
const closeViewer = document.getElementById("close-viewer");
const generateQrButton = document.getElementById("generate-qr");

// Modifications to add writing and highlighting functionality with palette and brush options

const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isDrawing = false;
let currentTool = "";
let penColor = "#000000";
let penSize = 5;
let highlightColor = "#ffff00";
let highlightOpacity = 0.3;
let highlightSize = 10;
let eraserSize = 10;

//text editor modal
const edtabletext = document.getElementById("editable-text");
const edtabletextDiv = document.getElementById("text-editor-content");
// Resizable functionality
const resizer = document.getElementById("text-editor-resizer");
const textEditor = document.getElementById("text-editor");
const modal = document.getElementById("text-editor");
const textEditorContent = document.getElementById("text-editor-content");
// Resizable functionality
const editor = document.getElementById("text-editor");
const header = document.querySelector(".text-editor-header");

// 2. Screenshot Functionality with Auto-Cancel
const script = document.createElement("script");
script.src =
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
script.onload = () => {
  console.log("html2canvas loaded.");
};

// Add resizing and dragging functionality
const viewerResizer = document.getElementById("viewer-resizer");
const viewerHeader = document.querySelector(".viewer-header");

// --------------------- Functions --------------------- //
document.querySelectorAll(".draggable").forEach(function (el) {
  el.addEventListener("mousedown", function (e) {
    const offsetX = e.clientX - el.offsetLeft;
    const offsetY = e.clientY - el.offsetTop;

    function mouseMoveHandler(e) {
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
    }

    function mouseUpHandler() {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    }

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  });
});

document.getElementById("toggle-tools").addEventListener("click", () => {
  document.getElementById("tools-box").classList.toggle("hidden");
});

document.getElementById("write-btn").addEventListener("click", () => {
  resetTools();
  currentTool = "pen";
  document.getElementById("file-image-modal").style.display = "none";
  eraserSizeModal.style.display = "none"; // Hide if currently visible

  document.getElementById("highlight-modal").classList.remove("show");
  document.getElementById("text-editor").style.display = "none";
  document.getElementById("final-viewer").style.display = "none";
  document.getElementById("pen-modal").classList.toggle("show");
});

document.getElementById("highlight-btn").addEventListener("click", () => {
  resetTools();
  currentTool = "highlight";
  document.getElementById("file-image-modal").style.display = "none";
  eraserSizeModal.style.display = "none"; // Hide if currently visible

  document.getElementById("pen-modal").classList.remove("show");
  document.getElementById("text-editor").style.display = "none";
  document.getElementById("final-viewer").style.display = "none";
  document.getElementById("highlight-modal").classList.toggle("show");
});

// Default eraser size

// Show the modal when the eraser button is clicked
document.getElementById("eraser-btn").addEventListener("click", () => {
  // Show the eraser size modal
  if (eraserSizeModal.style.display === "block") {
    eraserSizeModal.style.display = "none"; // Hide if currently visible
  } else {
    eraserSizeModal.style.display = "block"; // Show if currently hidden
    document.getElementById("pen-modal").classList.remove("show");
    document.getElementById("text-editor").style.display = "none";
    document.getElementById("file-image-modal").style.display = "none";
    document.getElementById("final-viewer").style.display = "none";
    document.getElementById("highlight-modal").classList.remove("show");

    // Set the initial value of the slider
    eraserSizeSlider.value = eraserSize;
    eraserSizeDisplay.textContent = `Size: ${eraserSize}px`;
    eraserSizeCircle.style.width = `${eraserSize}px`;
    eraserSizeCircle.style.height = `${eraserSize}px`;
    resetTools(); // Hide other tools
    document.getElementById("file-image-modal").style.display = "none";
    // eraserSizeModal.style.display = "none"; // Hide if currently visible

    document.getElementById("highlight-modal").classList.remove("show");
    document.getElementById("pen-modal").classList.remove("show");
    document.getElementById("final-viewer").style.display = "none";
    document.getElementById("text-editor").style.display = "none";
    currentTool = "eraser";
  }
});

// Update the eraser size when the slider is changed
eraserSizeSlider.addEventListener("input", (e) => {
  eraserSize = e.target.value;
  eraserSizeDisplay.textContent = `Size: ${eraserSize}px`;
  eraserSizeCircle.style.width = `${eraserSize}px`;
  eraserSizeCircle.style.height = `${eraserSize}px`;
});

// Close the eraser size modal
closeEraserModalButton.addEventListener("click", () => {
  eraserSizeModal.style.display = "none";
});

// Close the modal if clicked outside the modal content
window.addEventListener("click", (e) => {
  if (e.target === eraserSizeModal) {
    eraserSizeModal.style.display = "none";
  }
});

// document.getElementById("clear-canvas").addEventListener("click", () => {
//   // Show confirmation dialog

//   const modal = document.getElementById("clear-canvas-modal");
//   modal.style.display = "block";
//   // If user clicks "OK," proceed with clearing
//   resetTools();
//   document.getElementById("pen-modal").classList.remove("show");
//   document.getElementById("text-editor").style.display = "none";
//   document.getElementById("file-image-modal").style.display = "none";
//   eraserSizeModal.style.display = "none"; // Hide if currently visible

//   document.getElementById("final-viewer").style.display = "none";
//   document.getElementById("highlight-modal").classList.remove("show");
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   if (userConfirmed) {
//   } else {
//     // If user clicks "Cancel," do nothing
//     console.log("Canvas clear action canceled by the user.");
//   }
// });

document.getElementById("clear-canvas").addEventListener("click", () => {
  // Show the modal
  const modal = document.getElementById("clear-canvas-modal");
  modal.style.display = "block";
});

document.getElementById("delete-canvas").addEventListener("click", () => {
  // If user clicks "OK," proceed with clearing
  resetTools();
  document.getElementById("pen-modal").classList.remove("show");
  document.getElementById("text-editor").style.display = "none";
  document.getElementById("file-image-modal").style.display = "none";
  eraserSizeModal.style.display = "none"; // Hide if currently visible

  document.getElementById("final-viewer").style.display = "none";
  document.getElementById("highlight-modal").classList.remove("show");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const modal = document.getElementById("clear-canvas-modal");
  modal.style.display = "none";

  console.log("Canvas cleared.");
});

document.getElementById("ignore-clear").addEventListener("click", () => {
  // Close the modal without clearing the canvas
  const modal = document.getElementById("clear-canvas-modal");
  modal.style.display = "none";

  console.log("Canvas clear action canceled.");
});

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  if (currentTool === "pen") {
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
  } else if (currentTool === "highlight") {
    ctx.globalAlpha = highlightOpacity; // Set opacity for highlighter
    ctx.globalCompositeOperation = "source-over"; // Normal blending mode
    ctx.strokeStyle = highlightColor;
    ctx.lineWidth = highlightSize;
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  } else if (currentTool === "eraser") {
    ctx.globalAlpha = 1.0; // Full opacity for eraser
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)"; // Erase with full opacity
    ctx.lineWidth = eraserSize; // Use the updated eraser size
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  }
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  ctx.closePath();
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  ctx.closePath();
});

document.getElementById("pen-color").addEventListener("input", (e) => {
  penColor = e.target.value;
});

document.getElementById("pen-size").addEventListener("input", (e) => {
  penSize = e.target.value;
});

document.getElementById("highlight-color").addEventListener("input", (e) => {
  highlightColor = e.target.value;
});

document.getElementById("highlight-opacity").addEventListener("input", (e) => {
  highlightOpacity = e.target.value;
});

document.getElementById("highlight-size").addEventListener("input", (e) => {
  highlightSize = e.target.value;
});

function resetTools() {
  currentTool = "";
}

function openModal(modalId) {
  document.getElementById(modalId).classList.add("show");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("show");
}

document.getElementById("close-pen-modal").addEventListener("click", () => {
  closeModal("pen-modal");
});

document
  .getElementById("close-highlight-modal")
  .addEventListener("click", () => {
    closeModal("highlight-modal");
  });

document.getElementById("note-btn").addEventListener("click", function () {
  resetTools();
  currentTool = "add-note";
  document.getElementById("file-image-modal").style.display = "none";
  eraserSizeModal.style.display = "none"; // Hide if currently visible

  document.getElementById("highlight-modal").classList.remove("show");
  document.getElementById("pen-modal").classList.remove("show");
  document.getElementById("final-viewer").style.display = "none";

  const textEditor = document.getElementById("text-editor");
  if (textEditor.style.display === "none" || textEditor.style.display === "") {
    textEditor.style.display = "block";
  } else {
    textEditor.style.display = "none";
  }
});

document.getElementById("toggle-viewer").addEventListener("click", function () {
  resetTools();
  currentTool = "toggle-viewer";
  const viewer = document.getElementById("final-viewer");
  document.getElementById("highlight-modal").classList.remove("show");
  document.getElementById("pen-modal").classList.remove("show");
  document.getElementById("text-editor").style.display = "none";
  document.getElementById("file-image-modal").style.display = "none";
  eraserSizeModal.style.display = "none"; // Hide if currently visible

  viewer.style.display = viewer.style.display === "flex" ? "none" : "flex";
});
// Initialize the default state for bold and other styles
let isBold = false;

// Color Picker
const colorPicker = document.getElementById("format-color");
colorPicker.addEventListener("input", function () {
  const color = colorPicker.value;
  applyStyleToSelection("color", color); // Apply selected color directly to selected text
});

// Font Size Selector
const fontSizeSelector = document.getElementById("format-size");
fontSizeSelector.addEventListener("change", function () {
  const fontSize = fontSizeSelector.value + "px"; // Convert to px unit
  applyStyleToSelection("fontSize", fontSize); // Apply selected font size directly to selected text
});

// Bold Icon Toggle
const boldButton = document.getElementById("bold-toggle");
boldButton.addEventListener("click", function () {
  isBold = !isBold; // Toggle bold state
  applyStyleToSelection("fontWeight", isBold ? "bold" : "normal"); // Apply or remove bold styling from selected text

  // Toggle the 'active' class for the bold icon to reflect the state
  boldButton.classList.toggle("active", isBold);
});

// Function to apply styles to the selected text
function applyStyleToSelection(style, value) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const selectedText = range.cloneContents();

  // Create a temporary span element to apply the style
  const span = document.createElement("span");
  span.style[style] = value;
  span.appendChild(selectedText);

  // Replace the selected text with the styled span
  range.deleteContents();
  range.insertNode(span);
}
const editableText = document.getElementById("editable-text");

// Function to save content to localStorage
function saveContentToLocalStorage() {
  const content = editableText.innerHTML; // Get the content with styles
  localStorage.setItem("textEditorContent", content); // Save to localStorage
  console.log("Content saved to localStorage"); // Optional: Log for debugging
}

// Function to load content from localStorage
function loadContentFromLocalStorage() {
  const savedContent = localStorage.getItem("textEditorContent");
  if (savedContent) {
    editableText.innerHTML = savedContent; // Load the saved content
    console.log("Content loaded from localStorage"); // Optional: Log for debugging
  }
}

// Load content on page load
window.addEventListener("DOMContentLoaded", loadContentFromLocalStorage);

// Add event listener to detect changes and save
let saveTimeout;

editableText.addEventListener("input", () => {
  clearTimeout(saveTimeout); // Clear the previous timeout
  saveTimeout = setTimeout(() => {
    saveContentToLocalStorage(); // Save after 500ms of inactivity
  }, 500); // Adjust the delay as needed
});

const DEFAULT_STYLES = {
  color: "black",
  fontSize: "16px",
  fontWeight: "normal",
};
// Add event listener for keydown (Enter key press to handle new line)
editableText.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    // e.preventDefault(); // Prevent the default new line behavior

    // Create a new line with default styles
    const newLine = document.createElement("div");
    newLine.style.color = "black"; // Reset color to black
    newLine.style.fontSize = "16px"; // Reset font size to 16px
    newLine.style.fontWeight = "normal"; // Reset to normal weight (non-bold)

    // Insert the new line and set the cursor inside it
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    range.insertNode(newLine);
    range.setStart(newLine, 0);
    range.setEnd(newLine, 0);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
// Function to check the styles of the selected text and update the UI controls
function updateStyleControls() {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  if (range) {
    const selectedNode = range.startContainer;

    // Check for font color
    const color = getComputedStyle(selectedNode.parentNode).color;
    colorPicker.value = rgbToHex(color); // Update color picker value

    // Check for font size
    const fontSize = getComputedStyle(selectedNode.parentNode).fontSize;
    fontSizeSelector.value = parseInt(fontSize, 10); // Update font size selector

    // Check for bold style
    const fontWeight = getComputedStyle(selectedNode.parentNode).fontWeight;
    if (fontWeight === "bold" || parseInt(fontWeight) >= 700) {
      boldButton.classList.add("active"); // Update bold button state
      isBold = true;
    } else {
      boldButton.classList.remove("active");
      isBold = false;
    }
  }
}

// Function to convert RGB to Hex
function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  return result
    ? "#" +
        ("0" + parseInt(result[0]).toString(16)).slice(-2) +
        ("0" + parseInt(result[1]).toString(16)).slice(-2) +
        ("0" + parseInt(result[2]).toString(16)).slice(-2)
    : rgb;
}

// Add event listener for text selection
editableText.addEventListener("select", updateStyleControls);

// Ensure styles are reset when new line is created (via mouse or keyboard)
editableText.addEventListener("select", function () {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const selectedText = selection.getRangeAt(0);

    // Apply the styles (bold, color, font size) to selected text
    const color = colorPicker.value;
    const fontSize = fontSizeSelector.value + "px";
    applyStyleToSelection("color", color);
    applyStyleToSelection("fontSize", fontSize);

    // Apply or remove bold styling
    applyStyleToSelection("fontWeight", isBold ? "bold" : "normal");
  }
});

// Ensure new lines reset to default styles
document.getElementById("editable-text").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    // e.preventDefault(); // Prevent the default new line behavior

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // Create a new line with default styles
    const newLine = document.createElement("div");
    newLine.textContent = ""; // Empty new line
    newLine.style.color = DEFAULT_STYLES.color;
    newLine.style.fontSize = DEFAULT_STYLES.fontSize;
    newLine.style.fontWeight = DEFAULT_STYLES.fontWeight;

    // Insert the new line and set the cursor inside it
    range.insertNode(newLine);
    range.setStart(newLine, 0);
    range.setEnd(newLine, 0);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
// Save functionality
document.getElementById("save-to-viewer").addEventListener("click", () => {
  const content = document.getElementById("editable-text").innerHTML;

  // Adding text content
  addContentToViewer({
    type: "text",
    data: content,
  });

  // Save the updated content to localStorage
  saveViewerContentToLocalStorage();

  // Hide the text editor modal
  document.getElementById("text-editor").style.display = "none";
});

// Close modal
document.getElementById("text-editor-close").addEventListener("click", () => {
  document.getElementById("text-editor").style.display = "none";
});

document.getElementById("close-viewer").addEventListener("click", function () {
  document.getElementById("final-viewer").style.display = "none";
});

header.addEventListener("mousedown", (e) => {
  e.preventDefault();
  const offsetX = e.clientX - modal.offsetLeft;
  const offsetY = e.clientY - modal.offsetTop;

  function mouseMoveHandler(e) {
    modal.style.left = `${e.clientX - offsetX}px`;
    modal.style.top = `${e.clientY - offsetY}px`;
  }

  function mouseUpHandler() {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  }

  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
});

// Adjust editable text height on modal resize
resizer.addEventListener("mousedown", (e) => {
  e.preventDefault();
  const startX = e.clientX;
  const startY = e.clientY;
  const startWidth = modal.offsetWidth;
  const startHeight = modal.offsetHeight;

  function mouseMoveHandler(e) {
    const newWidth = startWidth + (e.clientX - startX);
    const newHeight = startHeight + (e.clientY - startY);
    modal.style.width = `${newWidth}px`;
    modal.style.height = `${newHeight}px`;
    updateTextEditorHeight(); // Adjust text editor dynamically
  }

  function mouseUpHandler() {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  }

  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
});
function updateTextEditorHeight() {
  textEditorContent.style.height = `calc(100% - 120px)`; // Dynamically adjust height
}
document.getElementById("text-editor-close").addEventListener("click", () => {
  textEditor.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  const icon = document.getElementById("iconStyleTextEditor");
  const modal = document.getElementById("text-style-modal");

  icon.addEventListener("click", (event) => {
    // Toggle the modal visibility
    if (modal.style.display === "none" || modal.style.display === "") {
      const rect = icon.getBoundingClientRect();

      modal.style.display = "block";
    } else {
      modal.style.display = "none";
    }
  });

  // Close the modal when clicking outside
  document.addEventListener("click", (event) => {
    if (!modal.contains(event.target) && !icon.contains(event.target)) {
      modal.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const icon = document.getElementById("iconStyleAlignParagraphEditor");
  const modal = document.getElementById("paragraph-align-style-modal");

  icon.addEventListener("click", (event) => {
    // Toggle the modal visibility
    if (modal.style.display === "none" || modal.style.display === "") {
      const rect = icon.getBoundingClientRect();

      modal.style.display = "block";
    } else {
      modal.style.display = "none";
    }
  });

  // Close the modal when clicking outside
  document.addEventListener("click", (event) => {
    if (!modal.contains(event.target) && !icon.contains(event.target)) {
      modal.style.display = "none";
    }
  });
});

// 1. Create Modal for File/Image Upload
const fileImageModal = document.createElement("div");
fileImageModal.id = "file-image-modal";
fileImageModal.className = "modal file-image-modal";
fileImageModal.innerHTML = `
  <span class="close" id="file-image-modal-close">&times;</span>
  <div class="modal-header"><h2> Upload File</h2>
      <hr class="tooltip-hr" /></div>
  <div class="modal-body">
    <div class="file-upload-container">
      <label for="file-image-upload" class="custom-file-upload">
        <i class="fa fa-cloud-upload"></i> Choose File
      </label>
      <input type="file" id="file-image-upload" accept="image/*,application/pdf,text/plain">
    </div>
  </div>
  <div class="modal-footer">
    <button id="file-image-modal-add" class="modern-button">
      <i class="fa fa-check"></i> Add
    </button>
  </div>

<style>
  .file-upload-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 4px;
    padding: 10px;
    box-sizing: border-box;
  }

  .custom-file-upload {
    display: inline-block;
    padding: 5px 10px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
    font-size: 12px;
    text-align: center;
    width: auto;
  }

  #file-image-upload {
    display: none;
  }

  .modern-button {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    background-color: #ff5733;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    margin-left: auto;
  }

  .modern-button i {
    margin-right: 5px;
    pointer-events: none; /* Ensure the icon does not block pointer events */
  }

  .modern-button:hover {
    background-color: #c70039;
  }

  .close {
    font-size: 16px;
    font-weight: bold;
    color: #aaa;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .close:hover {
    color: #000;
  }

  .modal-header {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
  }
</style>
`;
document.body.appendChild(fileImageModal);

document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "file-image-modal-close") {
    fileImageModal.style.display = "none";
  }

  if (e.target && e.target.id === "add-file-image") {
    resetTools();
    currentTool = "add-file-image";
    if (
      fileImageModal.style.display === "none" ||
      fileImageModal.style.display === ""
    ) {
      fileImageModal.style.display = "block";
    } else {
      fileImageModal.style.display = "none";
    }
    document.getElementById("pen-modal").classList.remove("show");
    document.getElementById("text-editor").style.display = "none";
    document.getElementById("final-viewer").style.display = "none";
    document.getElementById("highlight-modal").classList.remove("show");
  }

  if (e.target && e.target.id === "file-image-modal-add") {
    const fileInput = document.getElementById("file-image-upload");
    const file = fileInput.files[0];
    if (!file) return;

    // Create form data to send the file
    const formData = new FormData();
    formData.append("file", file);

    // Send the file to the server
    fetch("upload_file.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.filePath) {
          // Add the uploaded file to the viewer with the returned file path
          if (file.type.startsWith("image/")) {
            addContentToViewer({
              type: "image",
              data: data.filePath, // File path returned by the server
            });
          } else {
            addContentToViewer({
              type: "pdf",
              data: data.filePath, // File path returned by the server
            });
          }
        } else {
          console.error("Error uploading file:", data.error);
        }
      })
      .catch((error) => console.error("Error:", error));

    fileImageModal.style.display = "none";
  }
});

document.head.appendChild(script);

let isSelecting = false;
let selectionDiv;
let startX, startY;

// Start selection
function startSelection(e) {
  if (isSelecting) return;
  isSelecting = true;
  startX = e.clientX;
  startY = e.clientY;

  selectionDiv = document.createElement("div");
  selectionDiv.style.position = "absolute";
  selectionDiv.style.border = "2px dashed #4caf50";
  selectionDiv.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
  selectionDiv.style.zIndex = "10000";
  document.body.appendChild(selectionDiv);

  document.addEventListener("mousemove", updateSelection);
  document.addEventListener("mouseup", endSelection);
}

// Update selection dimensions
function updateSelection(e) {
  if (!isSelecting) return;

  const width = Math.abs(e.clientX - startX);
  const height = Math.abs(e.clientY - startY);
  const left = Math.min(e.clientX, startX);
  const top = Math.min(e.clientY, startY);

  selectionDiv.style.width = `${width}px`;
  selectionDiv.style.height = `${height}px`;
  selectionDiv.style.left = `${left}px`;
  selectionDiv.style.top = `${top}px`;
}

// End selection and capture screenshot
function endSelection(e) {
  isSelecting = false;
  document.removeEventListener("mousemove", updateSelection);
  document.removeEventListener("mouseup", endSelection);

  const selectionRect = selectionDiv.getBoundingClientRect();
  document.body.removeChild(selectionDiv);

  // Capture the selected area as a screenshot using html2canvas
  html2canvas(document.body, {
    x: selectionRect.left,
    y: selectionRect.top,
    width: selectionRect.width,
    height: selectionRect.height,
  }).then((canvas) => {
    const imgSrc = canvas.toDataURL(); // Convert the canvas to a base64 image

    // Send the image to the server
    fetch("upload_screenshot.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageData: imgSrc }), // Send base64 data
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.filePath) {
          // Add the image to the Final Viewer with the returned file path
          addContentToViewer({
            type: "image",
            data: data.filePath, // Use the returned file path
          });
        } else {
          console.error("Error uploading screenshot:", data.error);
        }
      })
      .catch((error) => console.error("Error:", error));
  });

  // Remove the mousedown listener to prevent initiating new selections after one is taken
  document.removeEventListener("mousedown", startSelection);
}

document
  .getElementById("screenshot-btn")
  .addEventListener("click", function () {
    resetTools();
    currentTool = "screenshot";
    document.getElementById("pen-modal").classList.remove("show");
    document.getElementById("text-editor").style.display = "none";
    document.getElementById("file-image-modal").style.display = "none";
    eraserSizeModal.style.display = "none"; // Hide if currently visible

    document.getElementById("final-viewer").style.display = "none";
    document.getElementById("highlight-modal").classList.remove("show");
    document.addEventListener("mousedown", startSelection);
    alert("Click and drag to select an area for the screenshot.");
  });

// Add 'show' class to modals when displaying and remove it when closing.
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add("show");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove("show");
}

// Function to add editable content in its own container
// Function to add content to the viewer
// Function to add editable content in its own container (supports text, images, PDFs)
function addContentToViewer(content) {
  const container = document.createElement("div");
  container.classList.add("content-container");
  container.contentEditable = true; // Only the text container is editable
  // Check content type and wrap it accordingly
  if (content.type === "text") {
    container.innerHTML = content.data;
  } else if (content.type === "image") {
    const img = document.createElement("img");
    img.src = content.data;
    img.style.maxWidth = "100%";
    img.alt = "Image";
    container.appendChild(img);
  } else if (content.type === "pdf") {
    const pdfEmbed = document.createElement("embed");
    pdfEmbed.src = content.data;
    pdfEmbed.type = "application/pdf";
    pdfEmbed.style.width = "100%";
    pdfEmbed.style.height = "500px"; // Or any custom height you prefer
    container.appendChild(pdfEmbed);
  }
  // Create a delete icon
  const deleteIcon = document.createElement("span");
  deleteIcon.classList.add("delete-icon");
  deleteIcon.innerHTML = "&#x1F5D1;"; // Unicode for trash can icon 🗑️
  deleteIcon.style.display = "none"; // Initially hide the delete icon
  container.appendChild(deleteIcon); // Add delete icon to the container

  // Add event listener to show the delete icon when the container is focused
  container.addEventListener("focus", function () {
    deleteIcon.style.display = "block"; // Show delete icon when focused
  });

  // Add event listener to hide the delete icon when the container loses focus
  container.addEventListener("blur", function () {
    deleteIcon.style.display = "none"; // Hide delete icon when focus is lost
  });

  // Add event listener to the delete icon to remove the content
  deleteIcon.addEventListener("click", function () {
    container.remove(); // Remove the content container
    saveViewerContentToLocalStorage(); // Save the updated content to localStorage
  });
  // Append the new content container to the final viewer
  viewerBody.appendChild(container);
  saveViewerContentToLocalStorage();
}

// Save Final Viewer content to localStorage
function saveViewerContentToLocalStorage() {
  const containers = viewerBody.querySelectorAll(".content-container");
  const contentArray = Array.from(containers).map((container) => {
    const content = {
      type: container.querySelector("img")
        ? "image"
        : container.querySelector("embed")
        ? "pdf"
        : "text",
      data:
        container.querySelector("img")?.src ||
        container.querySelector("embed")?.src ||
        container.innerHTML, // Store the content correctly
    };
    return content;
  });
  localStorage.setItem("finalViewerContent", JSON.stringify(contentArray));
}

// Load Final Viewer content from localStorage
function loadViewerContentFromLocalStorage() {
  const savedContent = JSON.parse(localStorage.getItem("finalViewerContent"));
  if (savedContent) {
    viewerBody.innerHTML = ""; // Clear existing content
    savedContent.forEach((content) => {
      // Ensure proper rendering based on content type
      addContentToViewer(content);
    });
  }
}

// Load content on page load
window.addEventListener("DOMContentLoaded", loadViewerContentFromLocalStorage);
function uploadFile(file, callback) {
  const formData = new FormData();
  formData.append("file", file);

  fetch("file_upload.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      callback(data.url);
    })
    .catch((error) => console.error("Error uploading file:", error));
}

// Function to escape only text content (not HTML tags)
// Function to escape only the text content (not HTML tags)
function escapeHTML(text) {
  return text.replace(/[&<>"'`]/g, function (match) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "`": "&#96;",
    }[match];
  });
}

document.getElementById("generate-qr").addEventListener("click", () => {
  // Load saved content from localStorage
  const savedContent = JSON.parse(localStorage.getItem("finalViewerContent"));
  console.log(savedContent);

  if (!savedContent || savedContent.length === 0) {
    console.error("Error: No content in localStorage to generate PDF.");
    return;
  }

  // Create HTML content from the saved content
  let viewerContent = savedContent
    .map((content) => {
      switch (content.type) {
        case "image":
          return `<img src="${content.data}" alt="Image" style="max-width: 100%;">`;
        case "pdf":
          return `<embed src="${content.data}" type="application/pdf" style="width: 100%; height: 500px;">`;
        case "text":
          // Escape only the text content, not the HTML tags
          return `<div>${escapeHTML(content.data)}</div>`;
        default:
          return "";
      }
    })
    .join("");

  // Remove delete icons and contenteditable attributes
  viewerContent = viewerContent.replace(
    /<span class="delete-icon"[^>]*>.*?<\/span>/g,
    ""
  );
  viewerContent = viewerContent.replace(/contenteditable="true"/g, "");

  // Log the cleaned HTML content
  console.log("Sending HTML content:", viewerContent);

  fetch("generate_pdf.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ viewerContent: viewerContent }), // Send cleaned HTML content
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      if (data.url) {
        // Generate QR code for the PDF link
        QRCode.toDataURL(data.url, (err, url) => {
          if (err) throw err;
          const qrCodeContainer = document.getElementById("qr-code-container");
          qrCodeContainer.innerHTML = `<img src="${url}" alt="QR Code" />`;
          document.getElementById("qr-code-modal").style.display = "block";
        });
      } else {
        console.error("Error: Could not generate PDF URL.");
      }
    })
    .catch((error) => console.error("Error generating PDF:", error));
});

// Dragging logic (similar to the Text Editor)
viewerHeader.addEventListener("mousedown", function (e) {
  const offsetX = e.clientX - finalViewer.offsetLeft;
  const offsetY = e.clientY - finalViewer.offsetTop;

  function mouseMoveHandler(e) {
    finalViewer.style.left = `${e.clientX - offsetX}px`;
    finalViewer.style.top = `${e.clientY - offsetY}px`;
  }

  function mouseUpHandler() {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  }

  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
});

// Resizing logic
viewerResizer.addEventListener("mousedown", function (e) {
  const initialWidth = finalViewer.offsetWidth;
  const initialHeight = finalViewer.offsetHeight;
  const initialMouseX = e.clientX;
  const initialMouseY = e.clientY;

  function mouseMoveHandler(e) {
    const newWidth = initialWidth + (e.clientX - initialMouseX);
    const newHeight = initialHeight + (e.clientY - initialMouseY);
    finalViewer.style.width = `${newWidth}px`;
    finalViewer.style.height = `${newHeight}px`;
  }

  function mouseUpHandler() {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  }

  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
});

// Close viewer
closeViewer.addEventListener("click", () => {
  finalViewer.style.display = "none";
});

// Save content on changes
viewerBody.addEventListener("input", saveViewerContentToLocalStorage);

// Load content on page load
window.addEventListener("DOMContentLoaded", loadViewerContentFromLocalStorage);
