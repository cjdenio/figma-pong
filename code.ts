// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

const pong: {
  frame: FrameNode | undefined;
  userPaddle: RectangleNode | undefined;
} = {
  frame: undefined,
  userPaddle: undefined,
};

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "cool") {
    if (pong.frame) {
      pong.frame.remove();
    }
    pong.frame = figma.createFrame();
    pong.frame.resize(500, 500);

    pong.userPaddle = figma.createRectangle();
    pong.userPaddle.resize(20, 100);
    pong.userPaddle.x = 500 - 40;
    pong.userPaddle.y = 200;

    pong.frame.appendChild(pong.userPaddle);
  } else if (msg.type === "up") {
    pong.userPaddle.y += 10;
  } else if (msg.type === "down") {
    pong.userPaddle.y -= 10;
  } else {
    pong.frame.remove();
    pong.frame = undefined;
    pong.userPaddle = undefined;

    figma.closePlugin();
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
};
