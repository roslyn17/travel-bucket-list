import { getAvatarColorHex, getInitials } from "@/lib/avatarDisplay";

export type SnapshotOptions = {
  name: string;
  avatarUrl: string | null;
  levelName: string;
  totalPoints: number;
  totalVisited: number;
  /** Display string for the footer, e.g. "travelbucketlist.app/u/Jane". */
  publicUrl: string;
};

const SIZE = 1080;

/**
 * Draws a 1080x1080 shareable "teaser" snapshot of a profile onto a canvas
 * and returns it as a PNG blob. Deliberately excludes list-level detail
 * (names, progress bars) -- that's what the linked public profile is for.
 * Client-only (uses `document`/`Image`); call from a "use client" component.
 */
export async function generateProfileSnapshot(opts: SnapshotOptions): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas isn't supported in this browser.");

  ctx.textAlign = "center";

  // Background.
  const bg = ctx.createLinearGradient(0, 0, 0, SIZE);
  bg.addColorStop(0, "#18181b");
  bg.addColorStop(1, "#09090b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Brand mark.
  ctx.fillStyle = "#a1a1aa";
  ctx.font = "600 32px system-ui, sans-serif";
  ctx.fillText("🧳 Travel Bucket List", SIZE / 2, 110);

  // Avatar.
  const avatarSize = 300;
  const avatarTop = 230;
  const cx = SIZE / 2;
  const cy = avatarTop + avatarSize / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  let drewImage = false;
  if (opts.avatarUrl) {
    try {
      const img = await loadImage(opts.avatarUrl);
      ctx.drawImage(img, cx - avatarSize / 2, cy - avatarSize / 2, avatarSize, avatarSize);
      drewImage = true;
    } catch {
      // Network hiccup, CORS-tainted source, whatever -- fall back to
      // initials below rather than failing the whole snapshot.
    }
  }
  if (!drewImage) {
    const { bg: avatarBg, fg } = getAvatarColorHex(opts.name);
    ctx.fillStyle = avatarBg;
    ctx.fillRect(cx - avatarSize / 2, cy - avatarSize / 2, avatarSize, avatarSize);
    ctx.fillStyle = fg;
    ctx.font = "700 120px system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(getInitials(opts.name), cx, cy + 6);
    ctx.textBaseline = "alphabetic";
  }
  ctx.restore();

  // Name.
  ctx.fillStyle = "#fafafa";
  ctx.font = "700 56px system-ui, sans-serif";
  ctx.fillText(opts.name, cx, avatarTop + avatarSize + 80);

  // Level chip.
  const chipLabel = opts.levelName.toUpperCase();
  ctx.font = "600 26px system-ui, sans-serif";
  const chipPaddingX = 28;
  const chipWidth = ctx.measureText(chipLabel).width + chipPaddingX * 2;
  const chipHeight = 56;
  const chipTop = avatarTop + avatarSize + 110;
  roundRect(ctx, cx - chipWidth / 2, chipTop, chipWidth, chipHeight, chipHeight / 2);
  ctx.fillStyle = "#3f3f46";
  ctx.fill();
  ctx.fillStyle = "#fafafa";
  ctx.textBaseline = "middle";
  ctx.fillText(chipLabel, cx, chipTop + chipHeight / 2 + 2);
  ctx.textBaseline = "alphabetic";

  // Stats row -- points and items completed only, no lists-completed count,
  // to keep the card a simple teaser rather than a full stat dump.
  const statsY = chipTop + chipHeight + 90;
  drawStat(ctx, cx - 160, statsY, String(opts.totalPoints), "points");
  drawStat(ctx, cx + 160, statsY, String(opts.totalVisited), "items completed");

  // Divider + footer.
  ctx.strokeStyle = "#27272a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.2, SIZE - 150);
  ctx.lineTo(SIZE * 0.8, SIZE - 150);
  ctx.stroke();

  ctx.fillStyle = "#71717a";
  ctx.font = "500 24px system-ui, sans-serif";
  ctx.fillText("See the full profile", cx, SIZE - 100);
  ctx.fillStyle = "#e4e4e7";
  ctx.font = "600 28px system-ui, sans-serif";
  ctx.fillText(opts.publicUrl, cx, SIZE - 60);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Couldn't generate the image."));
    }, "image/png");
  });
}

function drawStat(ctx: CanvasRenderingContext2D, x: number, y: number, value: string, label: string) {
  ctx.fillStyle = "#fafafa";
  ctx.font = "700 48px system-ui, sans-serif";
  ctx.fillText(value, x, y);
  ctx.fillStyle = "#a1a1aa";
  ctx.font = "500 22px system-ui, sans-serif";
  ctx.fillText(label, x, y + 36);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load avatar image"));
    img.src = src;
  });
}
