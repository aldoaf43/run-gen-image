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

export const CanvasEngine = {
  clear: (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
  },

  drawRoute: (
    ctx: CanvasRenderingContext2D,
    points: NormalizedPoint[],
    options: DrawOptions
  ) => {
    if (points.length < 2) return;

    const { color, lineWidth, padding, isDark, width, height } = options;

    const frameMargin = width * 0.1; 
    const frameWidth = width - frameMargin * 2;
    const frameHeight = height * 0.78;
    const frameX = frameMargin;
    const frameY = frameMargin;

    const bgColor = isDark ? "#121212" : "#ffffff";
    ctx.fillStyle = bgColor;
    ctx.fillRect(frameX, frameY, frameWidth, frameHeight);

    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(frameX, frameY, frameWidth, frameHeight);

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

    if (points.length > 1) {
      const startX = routeOffsetX + points[0].x * routeDrawWidth;
      const startY = routeOffsetY + points[0].y * routeDrawHeight;
      const endX = routeOffsetX + points[points.length - 1].x * routeDrawWidth;
      const endY = routeOffsetY + points[points.length - 1].y * routeDrawHeight;

      const indicatorSize = Math.max(width * 0.012, 6);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(startX, startY, indicatorSize, 0, Math.PI * 2);
      ctx.fill();

      const dSize = indicatorSize * 1.2;
      
      ctx.strokeStyle = bgColor;
      ctx.lineWidth = indicatorSize * 0.6;
      ctx.lineJoin = "miter";
      ctx.beginPath();
      ctx.moveTo(endX, endY - dSize);
      ctx.lineTo(endX + dSize, endY);
      ctx.lineTo(endX, endY + dSize);
      ctx.lineTo(endX - dSize, endY);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.fill();
    }
  }
};
