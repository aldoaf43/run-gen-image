import { NormalizedPoint } from "@/types";

interface DrawOptions {
  color: string;
  lineWidth: number;
  padding: number;
  isDark: boolean;
  width: number;
  height: number;
}

interface StatData {
  distance: number;
  elevationGain: number;
  movingTime: number;
  averageSpeed: number;
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

    // 1. Define the Frame Area (Top 78% of the canvas to leave room for HTML footer)
    const frameMargin = width * 0.1; 
    const frameWidth = width - frameMargin * 2;
    const frameHeight = height * 0.78;
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

    // 5. Draw Start/Finish Dots
    if (points.length > 0) {
      const startX = routeOffsetX + points[0].x * routeDrawWidth;
      const startY = routeOffsetY + points[0].y * routeDrawHeight;
      const endX = routeOffsetX + points[points.length - 1].x * routeDrawWidth;
      const endY = routeOffsetY + points[points.length - 1].y * routeDrawHeight;

      // Start Dot (Filled)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(startX, startY, lineWidth * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Finish Dot (Outline)
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth * 0.8;
      ctx.beginPath();
      ctx.arc(endX, endY, lineWidth * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = isDark ? "#121212" : "#ffffff";
      ctx.fill();
    }
  },

  /**
   * NOTE: drawElevationSparkline and drawStatGrid have been removed.
   * Labels and statistics are now handled via HTML in the Poster component
   * to allow for better styling, accessibility, and dynamic layout.
   */
};
