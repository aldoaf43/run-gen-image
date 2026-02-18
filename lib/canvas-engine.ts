import { NormalizedPoint } from "@/types";

interface DrawOptions {
  color: string;
  lineWidth: number;
  padding: number;
}

/**
 * Pure drawing functions for the HTML5 Canvas API.
 */
export const CanvasEngine = {
  /**
   * Clears the entire canvas.
   */
  clear: (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },

  /**
   * Draws a normalized route on the canvas.
   * @param ctx The canvas 2D context.
   * @param points Normalized coordinates (0.0 to 1.0).
   * @param options Styling options.
   */
  drawRoute: (
    ctx: CanvasRenderingContext2D,
    points: NormalizedPoint[],
    options: DrawOptions
  ) => {
    if (points.length < 2) return;

    const { width, height } = ctx.canvas;
    const { color, lineWidth, padding } = options;

    // Calculate the usable drawing area based on padding
    const drawWidth = width * (1 - padding * 2);
    const drawHeight = height * (1 - padding * 2);
    const offsetX = width * padding;
    const offsetY = height * padding;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Map normalized points to actual pixel coordinates
    points.forEach((point, index) => {
      const x = offsetX + point.x * drawWidth;
      const y = offsetY + point.y * drawHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  },

  /**
   * Draws text centered at the bottom of the canvas.
   */
  drawText: (
    ctx: CanvasRenderingContext2D,
    text: string,
    subtext: string,
    color: string
  ) => {
    const { width, height } = ctx.canvas;
    
    ctx.fillStyle = color;
    ctx.textAlign = "center";

    // Main Title (Activity Name)
    const fontSize = Math.floor(width * 0.04);
    ctx.font = `bold ${fontSize}px var(--font-geist-sans), sans-serif`;
    ctx.fillText(text.toUpperCase(), width / 2, height * 0.88);

    // Subtitle (Distance, Date, etc.)
    const subFontSize = Math.floor(width * 0.025);
    ctx.font = `${subFontSize}px var(--font-geist-sans), sans-serif`;
    ctx.fillStyle = color + "80"; // 50% opacity
    ctx.fillText(subtext, width / 2, height * 0.92);
  },
};
