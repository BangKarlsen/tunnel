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
  const imageData = ctx.createImageData(width, height);

  const putPixel = (x, y, [r, g, b, a], chunky) => {
    const index = y * (width * 4) + x * 4;
    chunky[index] = r;
    chunky[index + 1] = g;
    chunky[index + 2] = b;
    chunky[index + 3] = a;
  };

  const drawTable = (time, chunky) => {
    // console.log(time);
    const offset = time % 100;
    for (let x = 20; x < width - 40; x++) {
      for (let y = 20; y < height - 40; y++) {
        const c = [(15 + y + offset) % 255, 35, 200 - x / 2, 255];
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
    const texture = new Image();
    texture.crossOrigin = 'anonymous';
    texture.src = './texture.jpg';
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    texture.addEventListener('load', () => {
      animate(0);
    });
  };

  // draw(0);
  // animate(0);
  init();
})();
