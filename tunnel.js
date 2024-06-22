(function () {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true }); // Stay on CPU
  const height = 176;
  const width = 320;
  let running = true;
  let tick = 0;
  let texture;
  let dist = new Array();
  let angle = new Array();
  let z = new Array();

  const putPixel = (x, y, [r, g, b, a], screen) => {
    const index = y * (width * 4) + x * 4;
    screen[index] = r;
    screen[index + 1] = g;
    screen[index + 2] = b;
    screen[index + 3] = a;
  };

  const drawScreen = (tick, screen) => {
    // Calculate the shift values out of the animation value
    const shiftX = 0.1 * tick;
    const shiftY = 0.1 * tick;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        // Calculate texture coordinates
        // `u` is distance to center of screen + some scroll
        // `v` is angle from horizontal
        const u = Math.floor(dist[y * width + x] + shiftX) % texture.width;
        let v = Math.floor(angle[y * width + x] + shiftY) % texture.height;
        while (v < 0) {
          v += texture.height;
        }

        // Sample the texture
        const base = v * (texture.width * 4) + u * 4;
        const a = 255 - 255 * (z[y * width + x] / 255);
        const c = [texture.data[base], texture.data[base + 1], texture.data[base + 2], a];

        putPixel(x, y, c, screen);
      }
    }
  };

  const draw = tick => {
    const framebuffer = ctx.getImageData(0, 0, width, height);
    drawScreen(tick, framebuffer.data);
    ctx.putImageData(framebuffer, 0, 0);
  };

  const animate = () => {
    if (running) {
      draw(tick);
      tick++;
    }
    window.requestAnimationFrame(animate);
  };

  const precalc = () => {
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

        const dz = 4000 / Math.sqrt((x - width / 2) * (x - width / 2) + (y - height / 2) * (y - height / 2));
        z[y * width + x] = dz;
      }
    }
  };

  const init = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = './texture.jpg';
    img.addEventListener('load', () => {
      const buffer = document.createElement('canvas');
      const ctx = buffer.getContext('2d');
      buffer.width = img.width;
      buffer.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      texture = ctx.getImageData(0, 0, buffer.width, buffer.height);
      precalc();
      animate(0);
      // draw(0);
    });
  };

  init();

  document.addEventListener('keydown', function (event) {
    if (event.key === ' ') {
      running = !running;
    }
  });
})();
