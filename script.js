// document.querySelector("#myImage").addEventListener("load", start);
window.addEventListener("load", start);

function start() {
  document.querySelector("#imageUpload").addEventListener("change", uploadImage);
  document.querySelector("#fileForm").addEventListener("submit", scaleImage);
  // document.querySelector("#canvasContainer").hidden = true
  // document.querySelector("#canvasContainer").style.visibility = "hidden";
}

function uploadImage(event) {
  const file = event.target.files[0];
  console.log(file);
  if (file) {
    const img = new Image();
    img.onload = () => {
    };
    img.src = URL.createObjectURL(file);
  }
}

function scaleImage(){

}

async function nearestNeighbourScaling() {
  // Make all of these input values
  const HEIGHT_WIDTH_RATIO = 9 / 16;
  const START_WIDTH = 250;
  const START_HEIGHT = START_WIDTH;
  // const START_HEIGHT = START_WIDTH * HEIGHT_WIDTH_RATIO;

  const UPSCALING_NUMBER = 3;
  const END_WIDTH = START_WIDTH * UPSCALING_NUMBER;
  const END_HEIGHT = START_HEIGHT * UPSCALING_NUMBER;
  // const END_HEIGHT = 550 * HEIGHT_WIDTH_RATIO
  const PIXEL_SIZE = END_WIDTH / START_WIDTH;

  const myImage = new Image();
  myImage.src = "/å med rødt hus.jpeg";
  // myImage.src = "/skål fra lise.jpg";
  myImage.height = START_HEIGHT;
  myImage.width = START_WIDTH;

  myImage.onload = () => {
    const inputCanvas = document.querySelector("#inputCanvas");
    const inputCtx = inputCanvas.getContext("2d");
    inputCanvas.width = myImage.width;
    inputCanvas.height = myImage.height;

    inputCtx.drawImage(myImage, 0, 0, inputCanvas.width, inputCanvas.height);

    const inputData = inputCtx.getImageData(0, 0, myImage.width, myImage.height);
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
      while (iterations < 500) {
        if (outputY >= END_HEIGHT) {
          outputCanvas.style.border = "0px";
          console.log("returning");
          return;
        }
        const originalX = Math.round(outputX / UPSCALING_NUMBER);
        const originalY = Math.round(outputY / UPSCALING_NUMBER);
        // Multiply by 4 since that's the amount of array indexes used to represent a pixel value
        const index = (originalY * START_WIDTH + originalX) * 4;

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
  };
}

function boxBlur() {
  // Box blur
  // for (let y = 0; y < IMAGE_HEIGHT; y++) {
  //     for (let x = 0; x < IMAGE_WIDTH; x++) {
  //         if (x === 0 || x === IMAGE_WIDTH - 1 || y === 0 || y === IMAGE_HEIGHT - 1) {
  //             continue;
  //         }
  //         const outputIndex = (y * IMAGE_WIDTH + x) * 4;
  //         let r = 0;
  //         let g = 0;
  //         let b = 0;
  //         let a = 0;
  //         for (let dy = -1; dy <= 1; dy++) {
  //             for (let dx = -1; dx <= 1; dx++) {
  //                 const inputX = x + dx;
  //                 const inputY = y + dy;
  //                 const inputIndex = (inputY * IMAGE_WIDTH + inputX) * 4;
  //                 r += inputPixels[inputIndex];
  //                 g += inputPixels[inputIndex + 1];
  //                 b += inputPixels[inputIndex + 2];
  //                 a += inputPixels[inputIndex + 3];
  //             }
  //         }
  //         outputPixels[outputIndex] = r / 9;
  //         outputPixels[outputIndex + 1] = g / 9;
  //         outputPixels[outputIndex + 2] = b / 9;
  //         outputPixels[outputIndex + 3] = a / 9;
  //     }
  // }
}

// const pixelsToOverride = 12;
// for (let y = 0; y < START_HEIGHT; y += pixelsToOverride) {
//   for (let x = 0; x < START_WIDTH; x += pixelsToOverride) {
//     if ( x === START_WIDTH || y === 0 || y === START_HEIGHT - 1) {
//       continue;
//     }
//     const index = (y * START_WIDTH + x) * 4;
//     const [r, g, b, a] = imageData.slice(index, index + 4);
//     // Set the pixel below and the pixel to the right of that pixel to the current pixels values
//     for (let dy = 0; dy < pixelsToOverride; dy++) {
//       for (let dx = 0; dx < pixelsToOverride; dx++) {
//         // const outputIndex = ((inputX + dy) * IMAGE_WIDTH + (inputX + dx)) * 4;
//         const outputIndex = ((y + dy) * START_WIDTH + (x + dx)) * 4;
//         outputPixels[outputIndex] = r;
//         outputPixels[outputIndex + 1] = g;
//         outputPixels[outputIndex + 2] = b;
//         outputPixels[outputIndex + 3] = a;
//       }
//     }
//   }
// }
