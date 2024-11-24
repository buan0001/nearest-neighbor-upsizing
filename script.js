// document.querySelector("#img").addEventListener("load", start);
window.addEventListener("load", start);

function start() {
  document.querySelector("#imageUpload").addEventListener("change", uploadImage);
  document.querySelector("#fileForm").addEventListener("submit", scaleImage);
  // document.querySelector("#canvasContainer").hidden = true
  // document.querySelector("#canvasContainer").style.visibility = "hidden";
}

let img = undefined;
function uploadImage(event) {
  const file = event.target.files[0];
  console.log(file);
  if (file) {
    img = new Image();
    img.src = URL.createObjectURL(file);
  }
}

const MAX_SIZE = 300;

function scaleImage(e) {
  e.preventDefault();
  if (!img.src) {
    alert("No image uploaded!");
    return;
  }
  const form = e.target;
  const scalingFactor = form.scalingFactor.value;
  const pixelsPerFrame = form.pixelsPerFrame.value;

  if (scalingFactor >= 11 || scalingFactor <= 0 || isNaN(scalingFactor)) {
    alert("pls use number between 0.1 and 10");
    return;
  }

  let width = img.width;
  let height = img.height;

  console.log("before width:", width);
  console.log("before height:", height);

  if (width > MAX_SIZE || height > MAX_SIZE) {
    if (width > height) {
      height = (height / width) * MAX_SIZE;
      width = MAX_SIZE;
      console.log("width > height");
    } else {
      width = (width / height) * MAX_SIZE;
      height = MAX_SIZE;
      console.log("height > width");
    }
  }

  img.width = width;
  img.height = height;
  console.log("after width:", img.width);
  console.log("after height:", img.height);

  document.querySelector("#canvasContainer").classList.remove("hidden");
  nearestNeighbourScaling(scalingFactor, pixelsPerFrame);
}

async function nearestNeighbourScaling(scalingFactor, pixelsPerFrame) {
  const END_WIDTH = img.width * scalingFactor;
  const END_HEIGHT = img.height * scalingFactor;

  const inputCanvas = document.querySelector("#inputCanvas");
  const inputCtx = inputCanvas.getContext("2d");
  inputCanvas.width = img.width;
  inputCanvas.height = img.height;

  inputCtx.drawImage(img, 0, 0, inputCanvas.width, inputCanvas.height);

  const inputData = inputCtx.getImageData(0, 0, img.width, img.height);
  const inputPixels = inputData.data;
  console.log(inputPixels);

  const outputCanvas = document.querySelector("#outputCanvas");
  const outputCtx = outputCanvas.getContext("2d");
  outputCanvas.width = END_WIDTH;
  outputCanvas.height = END_HEIGHT;

  const outputData = outputCtx.createImageData(END_WIDTH, END_HEIGHT);
  const outputPixels = outputData.data;
  console.log(outputData);

  let outputX = 0;
  let outputY = 0;
  function drawStep() {
    let iterations = 0;
    while (iterations < pixelsPerFrame) {
      if (outputY >= END_HEIGHT) {
        outputCanvas.style.border = "0px";
        console.log("returning");
        outputCtx.putImageData(outputData, 0, 0);
        return;
      }
      const originalX = Math.round(outputX / scalingFactor);
      const originalY = Math.round(outputY / scalingFactor);
      // Multiply by 4 since that's the amount of array indexes used to represent a pixel value
      const index = (originalY * img.width + originalX) * 4;

      const [r, g, b, a] = inputPixels.slice(index, index + 4);

      const outputIndex = (outputY * END_WIDTH + outputX) * 4;
      outputPixels[outputIndex] = r;
      outputPixels[outputIndex + 1] = g;
      outputPixels[outputIndex + 2] = b;
      outputPixels[outputIndex + 3] = a;

      outputX++;
      if (outputX >= END_WIDTH) {
        outputX = 0;
        outputY++;
      }
      iterations++;
    }
    outputCtx.putImageData(outputData, 0, 0);

    requestAnimationFrame(drawStep);
  }

  drawStep();
  console.log(outputPixels);
}
