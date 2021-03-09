import { calculateOffset } from "./util";

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

const pong: {
  frame: FrameNode | undefined;
  userPaddle: RectangleNode | undefined;
  ball: EllipseNode | undefined;
} = {
  frame: figma.createFrame(),
  userPaddle: figma.createRectangle(),
  ball: figma.createEllipse(),
};

{
  pong.frame.resize(500, 500);
  pong.frame.name = "Pong!";

  pong.userPaddle.resize(10, 100);
  pong.userPaddle.x = 500 - 30;
  pong.userPaddle.y = 200;
  pong.userPaddle.fills = [{ type: "SOLID", color: { r: 0, g: 0.75, b: 1 } }];
  pong.userPaddle.cornerRadius = 4;

  pong.ball.resize(20, 20);
  pong.ball.x = 20;
  pong.ball.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
}

pong.frame.appendChild(pong.userPaddle);
pong.frame.appendChild(pong.ball);

let angle = 100 + Math.floor(Math.random() * 30);

setInterval(() => {
  const [x, y] = calculateOffset(angle, 10);

  pong.ball.x += x;
  pong.ball.y += y;

  if (pong.ball.x < 0) {
    angle = -angle;
  }

  if (pong.ball.x > pong.frame.width - pong.ball.width) {
    angle = -angle;
    // figma.notify("You lost :(");
    // figma.closePlugin();
  }

  // Bottom edge
  if (
    pong.ball.y > pong.frame.height - pong.ball.height &&
    (angle < -90 || angle > 90)
  ) {
    angle = 180 - angle;
  }

  if (pong.ball.y < 0 && (angle < 90 || angle > -90)) {
    angle = 180 - angle;
  }
}, 50);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "up" && pong.userPaddle.y > 0) {
    pong.userPaddle.y -= 10;
  } else if (
    msg.type === "down" &&
    pong.userPaddle.y < pong.frame.height - pong.userPaddle.height
  ) {
    pong.userPaddle.y += 10;
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
};

figma.on("close", () => {
  pong.frame.remove();
  pong.frame = undefined;
  pong.userPaddle = undefined;
  pong.ball = undefined;
});
