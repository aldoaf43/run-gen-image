import { NormalizedPoint } from "@/types";

interface DrawOptions {
  color: string;
  lineWidth: number;
  padding: number;
  isDark: boolean;
  width: number;
  height: number;
}

/**
 * Pure drawing functions for the HTML5 Canvas API.
 */
export const CanvasEngine = {
  /**
   * Clears the entire canvas.
   */
  clear: (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
  },

  /**
   * Draws the route within a "Gallery Frame" box.
   */
  drawRoute: (
    ctx: CanvasRenderingContext2D,
    points: NormalizedPoint[],
    options: DrawOptions
  ) => {
    if (points.length < 2) return;

    const { color, lineWidth, padding, isDark, width, height } = options;

    // 1. Define the Frame Area (Top 80% of the canvas)
    const frameMargin = width * 0.1; // Balanced outer margin
    const frameWidth = width - frameMargin * 2;
    const frameHeight = height * 0.75;
    const frameX = frameMargin;
    const frameY = frameMargin;

    // 2. Draw Frame Background
    ctx.fillStyle = isDark ? "#121212" : "#ffffff";
    ctx.fillRect(frameX, frameY, frameWidth, frameHeight);

    // 3. Draw Frame Border
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(frameX, frameY, frameWidth, frameHeight);

    // 4. Draw Route inside the frame with internal padding
    const innerPadding = frameWidth * padding;
    const routeDrawWidth = frameWidth - innerPadding * 2;
    const routeDrawHeight = frameHeight - innerPadding * 2;
    const routeOffsetX = frameX + innerPadding;
    const routeOffsetY = frameY + innerPadding;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    points.forEach((point, index) => {
      const x = routeOffsetX + point.x * routeDrawWidth;
      const y = routeOffsetY + point.y * routeDrawHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  },

  /**
   * Draws text centered in the bottom area (footer) of the canvas.
   */
  drawText: (
    ctx: CanvasRenderingContext2D,
    text: string,
    subtext: string,
    color: string,
    width: number,
    height: number
  ) => {
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Text area centered in the bottom 20%
    const textZoneY = height * 0.88;

    // Main Title
    const fontSize = Math.floor(width * 0.04);
    ctx.font = `bold ${fontSize}px var(--font-geist-sans), sans-serif`;
    ctx.fillText(text.toUpperCase(), width / 2, textZoneY);

    // Subtitle
    const subFontSize = Math.floor(width * 0.025);
    ctx.font = `${subFontSize}px var(--font-geist-sans), sans-serif`;
    ctx.fillStyle = color + "80"; // 50% opacity
    ctx.fillText(subtext.toUpperCase(), width / 2, textZoneY + fontSize * 1.2);
  },
};
