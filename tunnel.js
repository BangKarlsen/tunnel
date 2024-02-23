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
  const height = 176;
  const width = 320;
  let texture;

  const putPixel = (x, y, [r, g, b, a], chunky) => {
    const index = y * (width * 4) + x * 4;
    chunky[index] = r;
    chunky[index + 1] = g;
    chunky[index + 2] = b;
    chunky[index + 3] = a;
  };

  const drawTable = (time, chunky) => {
    const offset = time % 100;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        // const c = [(15 + y + offset) % 255, 35, 200 - x / 2, 255];
        const index = y * (texture.width * 4) + x * 4;
        const c = [texture.data[index], texture.data[index + 1], texture.data[index + 2], texture.data[index + 3]];
        putPixel(x, y, c, chunky);
      }
    }
  };

  const draw = time => {
    const framebuffer = ctx.getImageData(0, 0, width, height);
    drawTable(time, framebuffer.data);
    ctx.putImageData(framebuffer, 0, 0);
  };

  let start = undefined;
  const animate = timestamp => {
    if (!start) start = timestamp;

    const interval = timestamp - start;
    if (interval > 600) {
      start = timestamp;
      draw(timestamp);
    }
    window.requestAnimationFrame(animate);
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
      animate(0);
    });
  };

  // draw(0);
  // animate(0);
  init();
})();
