// Face Synthesis & Transformation Engine
// Seamlessly composites the user's real face, eyes, smile, and skin tone
// onto lean, athletic body archetypes at their target goal weight.

export interface TemplateConfig {
  key: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  imageUrl: string;
  // Normalized head/neck placement on body template (0.0 to 1.0)
  headCenter: { x: number; y: number };
  headRadius: { rx: number; ry: number };
  defaultRotationDeg: number;
}

export const FUTURE_SELF_TEMPLATES: Record<string, TemplateConfig> = {
  'athletic-cult': {
    key: 'athletic-cult',
    name: 'Cult Athletic Core',
    badge: 'ATHLETIC SCULPT',
    tagline: 'Toned midriff, athletic posture, radiant gym glow',
    description: 'Sculpted abs, defined athletic arms, and high-performance posture in signature Cult activewear.',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=85',
    headCenter: { x: 0.50, y: 0.215 },
    headRadius: { rx: 0.135, ry: 0.175 },
    defaultRotationDeg: 0
  },
  'party-dress': {
    key: 'party-dress',
    name: 'Little Black Party Dress',
    badge: 'EVENING GLAM',
    tagline: 'Sculpted waistline, elegant silhouette, evening aura',
    description: 'Sleek, body-contouring evening cocktail dress radiating magnetic confidence and razor-sharp contours.',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
    headCenter: { x: 0.50, y: 0.205 },
    headRadius: { rx: 0.13, ry: 0.17 },
    defaultRotationDeg: -1
  },
  'summer-chic': {
    key: 'summer-chic',
    name: 'Summer Linen Chic',
    badge: 'SUMMER CHIC',
    tagline: 'Defined collarbones, toned legs, sunshine freedom',
    description: 'Lightweight linen dress with delicate straps, toned legs, and sun-drenched coastal aura.',
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=85',
    headCenter: { x: 0.50, y: 0.218 },
    headRadius: { rx: 0.135, ry: 0.175 },
    defaultRotationDeg: 1
  },
  'runner': {
    key: 'runner',
    name: 'High-Performance Runner',
    badge: 'RUNNER GLOW',
    tagline: 'Lean athletic runner legs, supreme cardio stamina',
    description: 'Athletic technical running tank with a lean runner physique and radiant outdoor workout glow.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=85',
    headCenter: { x: 0.51, y: 0.21 },
    headRadius: { rx: 0.135, ry: 0.175 },
    defaultRotationDeg: 0
  }
};

export interface TransformSettings {
  scale: number;        // 0.7 - 1.5 (default 1.0)
  offsetX: number;      // -100 to 100 (in canvas px)
  offsetY: number;      // -100 to 100 (in canvas px)
  rotationDeg: number;  // -30 to 30
  featherSoftness: number; // 0.6 to 0.95 (edge feather gradient start)
  brightness: number;   // 0.8 - 1.2
  contrast: number;     // 0.8 - 1.2
  warmth: number;       // -20 to 20
}

export const DEFAULT_TRANSFORM_SETTINGS: TransformSettings = {
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
  rotationDeg: 0,
  featherSoftness: 0.8,
  brightness: 1.0,
  contrast: 1.0,
  warmth: 0
};

// Helper: load image safely with crossOrigin
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    // If source is external URL and not a data URL, route through proxy to bypass any CORS restriction
    let resolvedSrc = src;
    if (src.startsWith('http://') || src.startsWith('https://')) {
      resolvedSrc = `/api/image-proxy?url=${encodeURIComponent(src)}`;
    }

    img.onload = () => resolve(img);
    img.onerror = (err) => {
      // Retry direct src if proxy fails
      if (resolvedSrc !== src) {
        const directImg = new Image();
        directImg.crossOrigin = 'anonymous';
        directImg.onload = () => resolve(directImg);
        directImg.onerror = reject;
        directImg.src = src;
      } else {
        reject(err);
      }
    };
    img.src = resolvedSrc;
  });
}

/**
 * Synthesizes the user's uploaded portrait face onto the toned athletic body template.
 * Preserves the user's natural face, eyes, smile, skin tone and ethnicity.
 */
export async function synthesizeFutureSelf(
  userPhotoBase64: string,
  templateKey: string,
  settings: TransformSettings = DEFAULT_TRANSFORM_SETTINGS,
  targetWeightKg: number = 55
): Promise<string> {
  const template = FUTURE_SELF_TEMPLATES[templateKey] || FUTURE_SELF_TEMPLATES['athletic-cult'];

  // Load both user photo and body template
  const [userImg, bodyImg] = await Promise.all([
    loadImage(userPhotoBase64),
    loadImage(template.imageUrl)
  ]);

  // Set standard canvas dimensions for high quality output
  const canvasWidth = 800;
  const canvasHeight = 1000;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // 1. Draw body template scaled to canvas
  ctx.drawImage(bodyImg, 0, 0, canvasWidth, canvasHeight);

  // 2. Prepare user face crop on an offscreen canvas
  // Extract face region from user photo (centered face assuming portrait selfie)
  const faceCanvas = document.createElement('canvas');
  const fw = 400;
  const fh = 480;
  faceCanvas.width = fw;
  faceCanvas.height = fh;
  const fctx = faceCanvas.getContext('2d');
  if (!fctx) throw new Error('Could not get face canvas context');

  // Estimate face bounds in user photo (center 60% of user image)
  const userW = userImg.naturalWidth || userImg.width;
  const userH = userImg.naturalHeight || userImg.height;

  // Assume user's face is centered in upper 65% of photo
  const cropW = Math.min(userW, userH * 0.85);
  const cropH = cropW * 1.15;
  const cropX = Math.max(0, (userW - cropW) / 2);
  const cropY = Math.max(0, (userH * 0.45) - (cropH / 2));

  // Draw user's face onto faceCanvas
  fctx.save();
  // Apply brightness / contrast / warmth filters to face if adjusted
  if (settings.brightness !== 1 || settings.contrast !== 1) {
    fctx.filter = `brightness(${settings.brightness}) contrast(${settings.contrast})`;
  }
  fctx.drawImage(userImg, cropX, cropY, cropW, cropH, 0, 0, fw, fh);
  fctx.restore();

  // Apply warm/cool tint overlay if adjusted
  if (settings.warmth !== 0) {
    fctx.save();
    fctx.globalCompositeOperation = settings.warmth > 0 ? 'color-burn' : 'color';
    fctx.fillStyle = settings.warmth > 0 ? `rgba(255, 140, 80, ${Math.abs(settings.warmth) * 0.008})` : `rgba(100, 180, 255, ${Math.abs(settings.warmth) * 0.008})`;
    fctx.fillRect(0, 0, fw, fh);
    fctx.restore();
  }

  // Apply smooth feathered elliptical mask to eliminate hard edges
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = fw;
  maskCanvas.height = fh;
  const mctx = maskCanvas.getContext('2d');
  if (!mctx) throw new Error('Could not get mask context');

  const centerX = fw / 2;
  const centerY = fh / 2;
  const radiusX = fw * 0.42;
  const radiusY = fh * 0.46;

  // Draw feathered radial gradient ellipse
  mctx.save();
  mctx.translate(centerX, centerY);
  mctx.scale(1, radiusY / radiusX);

  const grad = mctx.createRadialGradient(0, 0, radiusX * settings.featherSoftness, 0, 0, radiusX);
  grad.addColorStop(0, 'rgba(0,0,0,1)');
  grad.addColorStop(0.7, 'rgba(0,0,0,0.95)');
  grad.addColorStop(0.9, 'rgba(0,0,0,0.4)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');

  mctx.fillStyle = grad;
  mctx.beginPath();
  mctx.arc(0, 0, radiusX, 0, Math.PI * 2);
  mctx.fill();
  mctx.restore();

  // Mask the face
  fctx.globalCompositeOperation = 'destination-in';
  fctx.drawImage(maskCanvas, 0, 0);

  // 3. Composite user's feathered face onto body template at calibrated position
  const targetX = (template.headCenter.x * canvasWidth) + settings.offsetX;
  const targetY = (template.headCenter.y * canvasHeight) + settings.offsetY;
  const targetW = (template.headRadius.rx * 2 * canvasWidth) * settings.scale;
  const targetH = (template.headRadius.ry * 2 * canvasHeight) * settings.scale;

  ctx.save();
  ctx.translate(targetX, targetY);
  const totalRot = (template.defaultRotationDeg + settings.rotationDeg) * (Math.PI / 180);
  ctx.rotate(totalRot);

  // Draw face centered at target
  ctx.drawImage(faceCanvas, -targetW / 2, -targetH / 2, targetW, targetH);
  ctx.restore();

  // 4. Add subtle photographic tone balance overlay & vignette for unified lighting
  ctx.save();
  const vignette = ctx.createRadialGradient(
    canvasWidth / 2,
    canvasHeight * 0.4,
    canvasWidth * 0.3,
    canvasWidth / 2,
    canvasHeight / 2,
    canvasWidth * 0.85
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.3)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.restore();

  // 5. Draw Cult Athletic Future Self watermark badge
  ctx.save();
  // Pill badge at bottom right
  const badgeText = `${targetWeightKg} KG LEAN VISION`;
  ctx.font = 'bold 18px sans-serif';
  const textWidth = ctx.measureText(badgeText).width;
  const pillW = textWidth + 36;
  const pillH = 34;
  const pillX = canvasWidth - pillW - 24;
  const pillY = canvasHeight - pillH - 24;

  // Background
  ctx.fillStyle = 'rgba(10, 10, 18, 0.85)';
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(204, 255, 0, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Text
  ctx.fillStyle = '#CCFF00';
  ctx.fillText(badgeText, pillX + 18, pillY + 23);
  ctx.restore();

  return canvas.toDataURL('image/png', 0.95);
}
