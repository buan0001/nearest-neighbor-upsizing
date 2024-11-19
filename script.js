// document.querySelector("#myImage").addEventListener("load", start);
window.addEventListener("load", start);

async function start() {
  //   const htmlImg = document.querySelector("#myImage");
  //   console.log(htmlImg.height);
  //   console.log(htmlImg.width);

  const IMAGE_HEIGHT = 550;
  //   const IMAGE_HEIGHT = 420;
  const IMAGE_WIDTH = 550;
  const PIXEL_SIZE = 4;

  const myImage = new Image();
  myImage.src = "/skål fra lise.jpg";
  myImage.height = IMAGE_HEIGHT;
  myImage.width = IMAGE_WIDTH;
  //   htmlImg.src = "./tiles/cliff.png";

  myImage.onload = () => {
    const myCanvas = document.querySelector("#myCanvas");
    const inputCtx = myCanvas.getContext("2d");
    myCanvas.width = myImage.width;
    myCanvas.height = myImage.height;

    // Draw the scaled image on the canvas
    inputCtx.drawImage(myImage, 0, 0, myCanvas.width, myCanvas.height);

    const imageData = inputCtx.getImageData(0, 0, myImage.width, myImage.height);
    console.log(imageData);

    const inputPixels = imageData.data;

    // Opret et output canvas
    const outputCanvas = document.getElementById("outputCanvas");
    const outputCtx = outputCanvas.getContext("2d");

    const outputHeight = myImage.height ;
    const outputWidth = myImage.width ;
    outputCanvas.width = outputWidth;
    outputCanvas.height = outputHeight;
    
    const xScale = IMAGE_WIDTH / outputWidth;
    const yScale = IMAGE_HEIGHT / outputHeight;

    // Skaler hver pixel i output-billedet ved nearest-neighbor
    const outputData = outputCtx.createImageData(outputWidth, outputHeight);
    // const outputData = outputCtx.createImageData(IMAGE_WIDTH, IMAGE_HEIGHT);
    const outputPixels = outputData.data;

    const pixelsToOverride = 12;
    for (let y = 0; y < IMAGE_HEIGHT; y += pixelsToOverride) {
      for (let x = 0; x < IMAGE_WIDTH; x += pixelsToOverride) {
        const index = (y * IMAGE_WIDTH + x) * 4;
        const [r, g, b, a] = inputPixels.slice(index, index + 4);
        // Set the pixel below and the pixel to the right of that pixel to the current pixels values
        for (let dy = 0; dy < pixelsToOverride; dy++) {
          for (let dx = 0; dx < pixelsToOverride; dx++) {
            const outputIndex = ((y + dy) * IMAGE_WIDTH + (x + dx)) * 4;
            outputPixels[outputIndex] = r;
            outputPixels[outputIndex + 1] = g;
            outputPixels[outputIndex + 2] = b;
            outputPixels[outputIndex + 3] = a;
          }
        }
        // outputPixels[y * IMAGE_WIDTH + x + PIXEL_SIZE] = r;
        // outputPixels[y * IMAGE_WIDTH + x + PIXEL_SIZE + 1] = g;
        // outputPixels[y * IMAGE_WIDTH + x + PIXEL_SIZE + 2] = b;
        // outputPixels[y * IMAGE_WIDTH + x + PIXEL_SIZE + 3] = a;

        // for (let i = 1; i <= 2; i++) {
        // // Set the pixel below and the pixel to the right of that pixel to the current pixels values
        //   outputPixels[y + 1 * IMAGE_WIDTH + i * x] = r;
        //   outputPixels[y + 1 * IMAGE_WIDTH + i * x + 1] = g;
        //   outputPixels[y + 1 * IMAGE_WIDTH + i * x + 2] = b;
        //   outputPixels[y + 1 * IMAGE_WIDTH + i * x + 3] = a;
        // }
      }
    }
    outputCtx.putImageData(outputData, 0, 0);
    const finalData = outputCtx.getImageData(0, 0, myImage.width, myImage.height);
    console.log(finalData);
  };
}
