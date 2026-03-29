import { fal } from "npm:@fal-ai/client@^1";
import { createClientFromRequest } from "npm:@base44/sdk@0.8.23";

// TESTING MODE — set to false when launching to real users
const TESTING_MODE = true;

// Per-model config: t2i endpoint, i2i endpoint, and how images are passed
const IMAGE_MODEL_CONFIG = {
  "Nano Banana Pro":   { t2i: "fal-ai/nano-banana-pro",          i2i: "fal-ai/nano-banana-pro",          imageParam: "reference_image_url",  multi: false, nativeSizing: true },
  "Nano Banana 2":     { t2i: "fal-ai/nano-banana-2",            i2i: "fal-ai/nano-banana-2",            imageParam: "reference_image_url",  multi: false, nativeSizing: true },
  "Soul 2.0":          { t2i: "fal-ai/flux/dev",                  i2i: "fal-ai/flux-pro/kontext",         imageParam: "image_url",             multi: false, nativeSizing: false },
  "Seedream 5.0 Lite": { t2i: "fal-ai/bytedance/seedream-3",     i2i: "fal-ai/flux-pro/kontext",         imageParam: "image_url",             multi: false, nativeSizing: false },
  "Seedream 4.5":      { t2i: "fal-ai/bytedance/seedream-3",     i2i: "fal-ai/flux-pro/kontext",         imageParam: "image_url",             multi: false, nativeSizing: false },
  "GPT Image 1.5":     { t2i: "fal-ai/gpt-image-1",              i2i: "fal-ai/gpt-image-1",              imageParam: "image_url",             multi: false, nativeSizing: false },
  "Flux Kontext":      { t2i: "fal-ai/flux-pro/kontext",          i2i: "fal-ai/flux-pro/kontext",         imageParam: "image_url",             multi: false, nativeSizing: false },
  "Flux 2":            { t2i: "fal-ai/flux-pro/v1.1",             i2i: "fal-ai/flux-pro/kontext",         imageParam: "image_url",             multi: false, nativeSizing: false },
  "Wan 2.2 Image":     { t2i: "fal-ai/wan-t2i",                  i2i: "fal-ai/wan-i2i",                  imageParam: "image_url",             multi: false, nativeSizing: false },
  "Skin Enhancer":     { t2i: "fal-ai/aura-sr",                  i2i: "fal-ai/aura-sr",                  imageParam: "image_url",             multi: false, nativeSizing: false },
  "Face Swap":         { t2i: "fal-ai/face-swap",                 i2i: "fal-ai/face-swap",                imageParam: "image_url",             multi: false, nativeSizing: false },
  "Relight":           { t2i: "fal-ai/ic-light",                  i2i: "fal-ai/ic-light",                 imageParam: "image_url",             multi: false, nativeSizing: false },
};

// Map quality label to base pixel dimension
const QUALITY_DIM = { "Draft": 512, "1K": 1024, "2K": 1536, "4K": 2048 };

// Compute width/height from aspect ratio string and base dimension
function getDimensions(ratio, quality) {
  const base = QUALITY_DIM[quality] || 1024;
  const parts = (ratio || "16:9").split(":").map(Number);
  const [w, h] = parts.length === 2 ? parts : [16, 9];
  const landscape = w >= h;
  if (landscape) {
    const width = base;
    const height = Math.round(base * h / w / 8) * 8;
    return { width, height };
  } else {
    const height = base;
    const width = Math.round(base * w / h / 8) * 8;
    return { width, height };
  }
}

const VIDEO_MODELS = {
  "Kling 3.0 Omni":        "fal-ai/kling-video/v2.1/pro/text-to-video",
  "Kling 3.0":             "fal-ai/kling-video/v2.1/standard/text-to-video",
  "Kling 2.6":             "fal-ai/kling-video/v1.6/pro/text-to-video",
  "Kling 2.5":             "fal-ai/kling-video/v1.5/pro/text-to-video",
  "Kling 2.1":             "fal-ai/kling-video/v1/pro/text-to-video",
  "Kling O1":              "fal-ai/kling-video/v1.6/pro/text-to-video",
  "Kling Motion Control":  "fal-ai/kling-video/v1.6/pro/text-to-video",
  "Wan 2.6":               "fal-ai/wan-i2v",
  "Wan 2.2":               "fal-ai/wan-t2v",
  "Seedance 1.5 Pro":      "fal-ai/bytedance/seedance-1-5-pro-t2v",
  "Seedance 2.0":          "fal-ai/bytedance/seedance-1-5-pro-t2v",
  "Seedance 1":            "fal-ai/bytedance/seedance-1-lite-t2v",
  "LTX 2":                 "fal-ai/ltx-video-13b-distilled",
  "Hailuo 2.3":            "fal-ai/minimax/video-01-live",
  "PixVerse 5":            "fal-ai/pixverse/v4.5/text-to-video",
  "Vidu Q3":               "fal-ai/vidu/q1",
  "Vidu Q2":               "fal-ai/vidu/q1",
  "Veo 3.1":               "fal-ai/veo2",
  "Sora 2":                "fal-ai/sora",
  "Nano Banana Pro Video": "fal-ai/kling-video/v1.6/pro/text-to-video",
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await req.json();
  let { model, prompt, type, duration, ratio, imageUrls, negativePrompt } = body;
  // Support legacy single referenceImageUrl
  if (!imageUrls && body.referenceImageUrl) imageUrls = [body.referenceImageUrl];
  if (!imageUrls) imageUrls = [];

  if (!model || typeof model !== "string" || model.length > 100) {
    return Response.json({ error: "Invalid model" }, { status: 400 });
  }
  if (!prompt || typeof prompt !== "string" || prompt.length > 2000) {
    return Response.json({ error: "Prompt required" }, { status: 400 });
  }
  if (!type || (type !== "image" && type !== "video")) {
    return Response.json({ error: "Type must be image or video" }, { status: 400 });
  }

  const falKey = (Deno.env.get("FAL_KEY") || "").trim();
  if (!falKey) {
    return Response.json({ error: "FAL_KEY not configured" }, { status: 500 });
  }
  fal.config({ credentials: falKey });

  // If referenceImageUrl is a base64 data URL, upload it to fal storage first
  if (referenceImageUrl && referenceImageUrl.startsWith('data:')) {
    const [header, base64Data] = referenceImageUrl.split(',');
    const mimeMatch = header.match(/data:([^;]+)/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const byteChars = atob(base64Data);
    const byteArray = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
    const blob = new Blob([byteArray], { type: mime });
    referenceImageUrl = await fal.storage.upload(blob);
  }

  try {
    // ── IMAGE GENERATION ──
    if (type === "image") {
      const cfg = IMAGE_MODEL_CONFIG[model];
      if (!cfg) {
        return Response.json({ error: "Unknown image model: " + model }, { status: 400 });
      }

      const readyUrls = (imageUrls || []).filter(u => u && u.startsWith('http'));
      const hasImages = readyUrls.length > 0;

      // Pick t2i or i2i endpoint
      const falModelId = hasImages ? cfg.i2i : cfg.t2i;

      // Build input
      const aspectRatioStr = ratio || "16:9";
      const resolutionMap = { "Draft": "0.5K", "1K": "1K", "2K": "2K", "4K": "4K" };
      const { width, height } = getDimensions(ratio, body.quality);

      const input = {
        prompt,
        ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
        ...(cfg.nativeSizing
          ? { aspect_ratio: aspectRatioStr, resolution: resolutionMap[body.quality] || "1K" }
          : hasImages
            ? {} // kontext doesn't need image_size when given image_url
            : { image_size: { width, height } }
        ),
      };

      // Add image references
      if (hasImages) {
        input[cfg.imageParam] = readyUrls[0];
      }

      const result = await fal.subscribe(falModelId, { input });
      const imageUrl = result.data?.images?.[0]?.url || result.data?.image?.url;

      return Response.json({
        success: true,
        type: "image",
        result_url: imageUrl,
        mode: hasImages ? "image-to-image" : "text-to-image",
      });
    }

    // ── VIDEO GENERATION ──
    if (type === "video") {
      const modelId = VIDEO_MODELS[model];
      if (!modelId) {
        return Response.json({ error: "Unknown video model: " + model }, { status: 400 });
      }

      const input = {
        prompt,
        duration: String(duration || 5),
        aspect_ratio: ratio || "16:9",
        ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
        ...(referenceImageUrl ? { image_url: referenceImageUrl } : {}),
      };

      const submitted = await fal.queue.submit(modelId, { input });

      return Response.json({
        success: true,
        type: "video",
        job_id: submitted.request_id,
        model_id: modelId,
      });
    }

    return Response.json({ error: "Unsupported type" }, { status: 400 });

  } catch (error) {
    console.error("Generation error:", error.message, error.stack);
    return Response.json({ error: error.message || "Generation failed. Please try again." }, { status: 500 });
  }
});