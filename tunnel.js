// Line drawer
// tri rasterizer + blending/alpha?
// hvide tri med orange/lilla/lysgrøn
// 2d noise vind
// model interpolate between poses
// tunnel / cylinder / lut effects
// remake kkowboy???
(function () {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const height = 176 * 2;
  const width = 320 * 2;
  let texture;
  let dist = new Array();
  let angle = new Array();

  const putPixel = (x, y, [r, g, b, a], screen) => {
    const index = y * (width * 4) + x * 4;
    screen[index] = r;
    screen[index + 1] = g;
    screen[index + 2] = b;
    screen[index + 3] = a;
  };

  const drawScreen = (time, screen) => {
    //calculate the shift values out of the animation value
    // int shiftX = int(texWidth * 1.0 * animation);
    // int shiftY = int(texHeight * 0.25 * animation);
    const shiftX = texture.width * 0.0001 * time;
    const shiftY = Math.sin(0.001 * time) * 0.01;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        // const c = [(15 + y + offset) % 255, 35, 200 - x / 2, 255];
        // const index = y * (texture.width * 4) + x * 4;
        // int color = texture[(unsigned int)(distanceTable[y][x] + shiftX)  % texWidth][(unsigned int)(angleTable[y][x] + shiftY) % texHeight];
        const texX = Math.floor(dist[y * width + x] + shiftX) % texture.width;
        let texY = Math.floor(angle[y * width + x] + shiftY) % texture.height;
        while (texY < 0) {
          texY += texture.height;
        }
        const base = texY * (texture.width * 4) + texX * 4;
        const c = [texture.data[base], texture.data[base + 1], texture.data[base + 2], 255];
        putPixel(x, y, c, screen);
      }
    }
  };

  const draw = time => {
    const framebuffer = ctx.getImageData(0, 0, width, height);
    drawScreen(time, framebuffer.data);
    ctx.putImageData(framebuffer, 0, 0);
  };

  let start = undefined;
  const animate = timestamp => {
    if (!start) start = timestamp;

    const interval = timestamp - start;
    if (interval > 0) {
      start = timestamp;
      draw(timestamp);
    }
    window.requestAnimationFrame(animate);
  };

  const precalc = () => {
    /*
      //generate non-linear transformation table
  for(int y = 0; y < h; y++)
  for(int x = 0; x < w; x++)
  {
    int angle, distance;
    float ratio = 32.0;
    distance = int(ratio * texHeight / sqrt((x - w / 2.0) * (x - w / 2.0) + (y - h / 2.0) * (y - h / 2.0))) % texHeight;
    angle = (unsigned int)(0.5 * texWidth * atan2(y - h / 2.0, x - w / 2.0) / 3.1416);
    distanceTable[y][x] = distance;
    angleTable[y][x] = angle;
  }
      * */
    const ratio = 32;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        // distance from this pixel to center of screen
        const d =
          ((ratio * texture.height) /
            Math.sqrt((x - width / 2) * (x - width / 2) + (y - height / 2) * (y - height / 2))) %
          texture.height;
        // angle from this pixel to center of screen
        const a = (0.5 * texture.width * Math.atan2(y - height / 2, x - width / 2)) / Math.PI;
        dist[y * width + x] = d;
        angle[y * width + x] = a;
      }
    }
  };

  const init = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = './texture_small.jpg';
    img.addEventListener('load', () => {
      const buffer = document.createElement('canvas');
      const ctx = buffer.getContext('2d');
      buffer.width = img.width;
      buffer.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      texture = ctx.getImageData(0, 0, buffer.width, buffer.height);
      precalc();
      animate(0);
    });
  };

  // draw(0);
  init();
})();
