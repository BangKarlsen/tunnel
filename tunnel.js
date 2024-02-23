// Line drawer
// tri rasterizer + blending/alpha?
// hvide tri med orange/lilla/lysgrøn
// 2d noise vind
// model interpolate between poses
(function() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const height = 200;
  const width = 400;
  const imageData = ctx.createImageData(width, height);

  const putPixel = (x, y, [r, g, b, a], chunky) => {
    const index = y * (width * 4) + x * 4;
    chunky[index] = r;
    chunky[index + 1] = g;
    chunky[index + 2] = b;
    chunky[index + 3] = a;
  };

  const bresemhamYstep = (v0, v1, chunky) => {
    // check steepness here
    let x0 = v0.x;
    let y0 = v0.y;
    let x1 = v1.x;
    let y1 = v1.y;
    /*
int dx=x2-x1;
int dy=y2-y1;
int d=2*dy-dx;
int e=2*dy;
int ne=2*(dy-dx);
int x=x1;
int y=y1;
      */ 
    const dx = x1 - x0;
    const dy = y1 - y0;
    const d = 2 * dy - dx;
    const err = 2 * dy;
    const ne = 2 * (dy - dx);
    const x = x0;
    const y = y0;
  }

  const drawLine = (v0, v1, chunky) => {
    let x0 = v0.x;
    let y0 = v0.y;
    let x1 = v1.x;
    let y1 = v1.y;
    if (Math.abs(v0.x - v1.x) > Math.abs(v0.y - v1.y)) {
      console.log('not steep');
      if (v0.x > v1.x) {
        x0 = v1.x;
        y0 = v1.y;
        x1 = v0.x;
        y1 = v0.y;
      }
      for (let x = x0; x <= x1; x++) {
        const t = (x - x0) / (x1 - x0);
        const y = y0 * (1 - t) + y1 * t;
        const outlineColor = [39, 39, 34, 255];
        putPixel(x, Math.floor(y), outlineColor, chunky);
      }
    } else {
      console.log('steep');
      if (v0.x > v1.x) {
        x0 = v1.x;
        y0 = v1.y;
        x1 = v0.x;
        y1 = v0.y;
      }
      for (let y = y0; y <= y1; y++) {
        const t = (y - y0) / (y1 - y0);
        const x = x0 * (1 - t) + x1 * t;
        const outlineColor = [139, 39, 234, 255];
        putPixel(Math.floor(x), y, outlineColor, chunky);
      }
    }
  };

  const edgeFunction = (a, b, c) => {
    const det = (c.x - a.x) * (b.y - a.y) - (c.y - a.y) * (b.x - a.x);
    return det >= 0;
  };

  const isInTriangle = (p, vertices) => {
    const [v0, v1, v2] = vertices;
    return edgeFunction(v0, v1, p) && edgeFunction(v1, v2, p) && edgeFunction(v2, v0, p);
  };

  const drawOutline = ([v0, v1, v2], chunky) => {
    drawLine(v0, v1, chunky);
    drawLine(v2, v0, chunky);
    drawLine(v1, v2, chunky);
  };

  const drawTriangleMult = (vertices, chunky) => {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const isTri = isInTriangle({ x, y }, vertices);
        if (isTri) {
          putPixel(x, y, vertices[1].c, chunky);
        }
      }
    }
    // drawOutline(vertices, chunky);
  };

  const drawVertices = (vertices, chunky) => {
    vertices.forEach(vertex => {
      const { x, y, c } = vertex;
      putPixel(x, y - 1, c, chunky);
      putPixel(x, y + 1, c, chunky);
      putPixel(x, y, c, chunky);
      putPixel(x - 1, y, c, chunky);
      putPixel(x + 1, y, c, chunky);
    });
  };

  const draw = time => {
    const framebuffer = ctx.getImageData(0, 0, width, height);
    const v0 = { x: 10, y: 10, c: [255, 0, 0, 255] };
    const v1 = { x: 150, y: 140, c: [0, 255, 0, 255] };
    const v2 = { x: 110, y: 30, c: [0, 0, 255, 255] };
    drawVertices([v0, v1, v2], framebuffer.data);
    drawTriangleMult([v0, v1, v2], framebuffer.data);
    ctx.putImageData(framebuffer, 0, 0);
  };

  let start = null;

  const animate = timestamp => {
    if (!start) start = timestamp;

    const interval = timestamp - start;
    if (interval > 1000) {
      start = timestamp;
      draw(timestamp);
    }
    window.requestAnimationFrame(animate);
  };

  //window.requestAnimationFrame(animate);
  draw(0);
})();
