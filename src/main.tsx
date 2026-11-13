import { Application, Graphics } from 'pixi.js';
(async () => {
  const app = new Application();
  await app.init({ width: 300, height: 200, background: 0x221122, antialias: false });
  document.body.appendChild(app.canvas);
  const g = new Graphics().rect(10, 10, 100, 50).fill(0xff0000);
  app.stage.addChild(g);
  (window as any).__pixi = app.renderer.name + ':' + app.renderer.type;
})();
