import {
  areBoundsTouching,
  calculateBallTrajectory,
  calculateOffset,
  getBounds,
} from "./util";
async function main() {
  // This shows the HTML page in "ui.html".
  figma.showUI(__html__);

  const pong: {
    frame: FrameNode | undefined;
    userPaddle: RectangleNode | undefined;
    otherPaddle: RectangleNode | undefined;
    ball: EllipseNode | undefined;
    userText: TextNode;
    otherText: TextNode;
  } = {
    frame: figma.createFrame(),
    userPaddle: figma.createRectangle(),
    otherPaddle: figma.createRectangle(),
    ball: figma.createEllipse(),
    userText: figma.createText(),
    otherText: figma.createText(),
  };

  {
    await figma.loadFontAsync({ family: "Arial", style: "Bold" });
    pong.frame.resize(500, 500);
    pong.frame.name = "Pong!";

    pong.userPaddle.resize(10, 100);
    pong.userPaddle.x = 500 - 30;
    pong.userPaddle.y = 200;
    pong.userPaddle.fills = [{ type: "SOLID", color: { r: 0, g: 0.75, b: 1 } }];
    pong.userPaddle.cornerRadius = 4;

    pong.otherPaddle.resize(10, 100);
    pong.otherPaddle.x = 30;
    pong.otherPaddle.y = 200;
    pong.otherPaddle.fills = [
      { type: "SOLID", color: { r: 0, g: 0.75, b: 1 } },
    ];
    pong.otherPaddle.cornerRadius = 4;

    pong.ball.resize(20, 20);
    pong.ball.x = 50;
    pong.ball.y = 0;
    pong.ball.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];

    pong.userText.fontName = { family: "Arial", style: "Bold" };
    pong.userText.fontSize = 30;
    pong.userText.characters = "0";
    pong.userText.x = pong.frame.width - pong.userText.width;

    pong.otherText.fontName = { family: "Arial", style: "Bold" };
    pong.otherText.fontSize = 30;
    pong.otherText.characters = "0";
  }

  pong.frame.appendChild(pong.userPaddle);
  pong.frame.appendChild(pong.otherPaddle);
  pong.frame.appendChild(pong.userText);
  pong.frame.appendChild(pong.otherText);
  pong.frame.appendChild(pong.ball);

  figma.viewport.scrollAndZoomIntoView([pong.frame]);

  let angle = 100 + Math.floor(Math.random() * 30);

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
    } else if (msg.type === "start") {
      start();
    }

    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
  };

  function start() {
    setInterval(() => {
      // automatic paddle stuffs
      {
        let x = pong.ball.x;

        const modAngle = angle % 360;

        const isLeftFacing = modAngle < 0 || modAngle > 180;

        let desired =
          pong.ball.y -
          calculateBallTrajectory(angle + 90, x) -
          pong.otherPaddle.height / 2;

        if (desired < 0) desired = 0;
        if (desired > pong.frame.height - pong.otherPaddle.height)
          desired = pong.frame.height - pong.otherPaddle.height;

        if (pong.otherPaddle.y < desired - 5 && isLeftFacing) {
          pong.otherPaddle.y += 10;
        } else if (pong.otherPaddle.y > desired + 5 && isLeftFacing) {
          pong.otherPaddle.y -= 10;
        }
      }

      const [x, y] = calculateOffset(angle, 15);

      pong.ball.x += x;
      pong.ball.y += y;

      if (pong.ball.x < 0) {
        figma.notify("You won! 🎉");
        pong.userText.characters = (
          parseInt(pong.userText.characters) + 1
        ).toString();

        angle = 100 + Math.floor(Math.random() * 30);
        pong.userPaddle.x = 500 - 30;
        pong.userPaddle.y = 200;

        pong.otherPaddle.x = 30;
        pong.otherPaddle.y = 200;

        pong.ball.x = 50;
        pong.ball.y = 0;
      }

      if (pong.ball.x > pong.frame.width - pong.ball.width) {
        figma.notify("You lost :(");
        pong.otherText.characters = (
          parseInt(pong.otherText.characters) + 1
        ).toString();

        angle = 100 + Math.floor(Math.random() * 30);
        pong.userPaddle.x = 500 - 30;
        pong.userPaddle.y = 200;

        pong.otherPaddle.x = 30;
        pong.otherPaddle.y = 200;

        pong.ball.x = 50;
        pong.ball.y = 0;
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

      const userPaddleBounds = getBounds(pong.userPaddle);
      const otherPaddleBounds = getBounds(pong.otherPaddle);
      const ballBounds = getBounds(pong.ball);
      if (
        areBoundsTouching(userPaddleBounds, ballBounds) ||
        areBoundsTouching(otherPaddleBounds, ballBounds)
      ) {
        angle = -angle;
      }
    }, 50);
  }

  figma.on("close", () => {
    pong.frame.remove();
    pong.frame = undefined;
    pong.userPaddle = undefined;
    pong.ball = undefined;
  });
}

main();
