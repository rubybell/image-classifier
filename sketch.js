// Followed Coding Train tutorial 7th Jan 2025
// https://www.youtube.com/watch?v=pbjR20eTLVs

let classifier; // Stores the classification model
let video; // Stores the live webcam stream
let label; // Stores the name of the predicted class from the model
let confidence; // Stores the confidence score for the predicted class (number between 0 and 1)
let questionMarks = "??????????"; // Placeholder text for initial state
let displayText = ""; // Stores the text to be displayed on the canvas, initially empty
let lastUpdateTime = 0;
let updateInterval = 500; // milliseconds (500ms = 2 updates per second)

// Function to convert confidence value to a string of question marks
function confidenceToQuestionMarks(confidenceValue) {
  let bucketIndex = floor(confidenceValue * 10); // 0-9
  let questionMarkCount = 10 - bucketIndex;
  return "?".repeat(questionMarkCount);
}

// Runs before setup and draw to load external files
function preload() {
  classifier = ml5.imageClassifier("MobileNet"); // Assigns the MobileNet model to 'classifier'
}

// Callback function to handle the results from the classifier
function gotResults(results) { // 'results' is an array of objects with 'label' and 'confidence' properties
  if (! results || results.length === 0) return;
  
  let now = millis();

  // Only update if enough time has passed
  if (now - lastUpdateTime < updateInterval) return;

  lastUpdateTime = now;
  //console.log(results); // Logs the results to the console
  label = results[0].label.split(",")[0]; // Assigns the top prediction label to 'label'. Splits string at commas and only takes the first section of the string
  confidence = results[0].confidence; // Assigns the confidence score of the top prediction to 'confidence'
  questionMarks = confidenceToQuestionMarks(confidence); // Updates question marks based on confidence
  displayText = label + questionMarks; // Combines label and question marks into displayText
}

// Runs once at the start of the sketch
function setup() {
  createCanvas(480, 480); // Creates canvas with width and height parameters in pixels
  video = createCapture(VIDEO, {flipped:true}); // Assigns a live webcam feed to 'video', specifies we want video only, and flips the image
  video.hide(); // Hides HTML the preview of the camera feed
  classifier.classifyStart(video, gotResults, 1); // Starts classifying the video feed. 'gotResults' is the callback function to handle the results. '1' specifies we want 1 prediction, instead of the default 3.
}

// Runs every frame, aiming for 60FPS
function draw() {
  background(220); // Sets the background colour to light grey
  image(video, -80, 0); // Draws the video feed to the canvas, offset to the left to centre it

// The grey rectangle behind the text
  rectMode(CENTER); // Sets rectangle mode to CENTER, so the first two parameters of rect() are the centre point
  fill(0, 100); // Sets fill colour to semi-transparent black. The parameters are (value, alpha).
  noStroke(); // Disables stroke for the rectangle
  rect(240, 240, 480, 50); // Draws a semi-transparent black rectangle behind the text. The parameters are (x, y, width, height).

// The text showing the label and confidence score, and question marks
  textSize(32); // Sets the text size to 32 pixels
  fill(255); // Sets the text fill colour to white
  textAlign(CENTER, CENTER); // Sets the text alignment to CENTER for both horizontal position and vertical position.
  noStroke(); // Disables stroke for the text
  //text(label, 240, 240); // Draws the label text to the canvas at position (240, 240)
  //text(confidence, 240, 280); // Draws the confidence score text to the canvas at position (240, 280)
  //text(questionMarks, 240, 280); // Draws the question marks text to the canvas at position (240, 280)
  text(displayText, 240, 240); // Draws the combined label and question marks text to the canvas at position (240, 240)
}