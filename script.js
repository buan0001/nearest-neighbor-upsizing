// document.querySelector("#myImage").addEventListener("load", start);
window.addEventListener("load", start);

async function start() {
  //   const htmlImg = document.querySelector("#myImage");
  //   console.log(htmlImg.height);
  //   console.log(htmlImg.width);

  const IMAGE_HEIGHT = 550;
  const IMAGE_WIDTH = 550;
  const PIXEL_SIZE = 4;

  const myImage = new Image();
  myImage.src = "/skål fra lise.jpg";
  myImage.height = IMAGE_HEIGHT;
  myImage.width = IMAGE_WIDTH;

  myImage.onload = () => {
    const myCanvas = document.querySelector("#myCanvas");
    const inputCtx = myCanvas.getContext("2d");
    myCanvas.width = myImage.width;
    myCanvas.height = myImage.height;

    inputCtx.drawImage(myImage, 0, 0, myCanvas.width, myCanvas.height);

    const imageData = inputCtx.getImageData(0, 0, myImage.width, myImage.height);
    const inputPixels = imageData.data;

    
    const outputCanvas = document.getElementById("outputCanvas");
    const outputCtx = outputCanvas.getContext("2d");
    outputCanvas.width = IMAGE_WIDTH;
    outputCanvas.height = IMAGE_HEIGHT;

    const outputData = outputCtx.createImageData(IMAGE_WIDTH, IMAGE_HEIGHT);
    const outputPixels = outputData.data;

    const pixelsToOverride = 12;
    for (let y = 0; y < IMAGE_HEIGHT; y += pixelsToOverride) {
      for (let x = 0; x < IMAGE_WIDTH; x += pixelsToOverride) {
        if ( x === IMAGE_WIDTH || y === 0 || y === IMAGE_HEIGHT - 1) {
          continue;
        }
        const index = (y * IMAGE_WIDTH + x) * 4;
        const [r, g, b, a] = inputPixels.slice(index, index + 4);
        // Set the pixel below and the pixel to the right of that pixel to the current pixels values
        for (let dy = 0; dy < pixelsToOverride; dy++) {
          for (let dx = 0; dx < pixelsToOverride; dx++) {
            // const outputIndex = ((inputX + dy) * IMAGE_WIDTH + (inputX + dx)) * 4;
            const outputIndex = ((y + dy) * IMAGE_WIDTH + (x + dx)) * 4;
            outputPixels[outputIndex] = r;
            outputPixels[outputIndex + 1] = g;
            outputPixels[outputIndex + 2] = b;
            outputPixels[outputIndex + 3] = a;
          }
        }
      }
    }
    outputCtx.putImageData(outputData, 0, 0);
    const finalData = outputCtx.getImageData(0, 0, myImage.width, myImage.height);
    console.log(finalData);
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
