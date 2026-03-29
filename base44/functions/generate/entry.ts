import { fal } from "npm:@fal-ai/client@^1";
import { createClientFromRequest } from "npm:@base44/sdk@0.8.23";

// TESTING MODE — set to false when launching to real users
const TESTING_MODE = true;

const IMAGE_MODELS = {
  "Nano Banana Pro":   "fal-ai/nano-banana-pro",
  "Nano Banana 2":     "fal-ai/nano-banana-2",
  "Soul 2.0":          "fal-ai/flux/dev",
  "Seedream 5.0 Lite": "fal-ai/bytedance/seedream-3",
  "Seedream 4.5":      "fal-ai/bytedance/seedream-3",
  "GPT Image 1.5":     "fal-ai/gpt-image-1",
  "Flux Kontext":      "fal-ai/flux-pro/kontext",
  "Flux 2":            "fal-ai/flux-pro/v1.1",
  "Wan 2.2 Image":     "fal-ai/wan-i2i",
  "Skin Enhancer":     "fal-ai/aura-sr",
  "Face Swap":         "fal-ai/face-swap",
  "Relight":           "fal-ai/ic-light",
};

// When user provides a reference image, map each model to its i2i endpoint
// Nano Banana models support reference_image_url natively on their own endpoint
// All other models fall back to Flux Kontext for editing
const NATIVE_I2I_MODELS = new Set(["fal-ai/nano-banana-pro", "fal-ai/nano-banana-2"]);

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
  let { model, prompt, type, duration, ratio, referenceImageUrl, negativePrompt } = body;

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
      const modelId = IMAGE_MODELS[model];
      if (!modelId) {
        return Response.json({ error: "Unknown image model: " + model }, { status: 400 });
      }

      const { width, height } = getDimensions(ratio, body.quality);
      const hasRef = !!referenceImageUrl;

      // Route to correct i2i endpoint based on selected model
      // Nano Banana models: use same endpoint with reference_image_url
      // All other models: fall back to Flux Kontext which accepts image_url for editing
      const isNanoBanana = NATIVE_I2I_MODELS.has(modelId);
      let falModelId = modelId;
      if (hasRef && !isNanoBanana) {
        falModelId = "fal-ai/flux-pro/kontext";
      }
      const aspectRatioStr = (ratio || "16:9");
      const resolutionMap = { "Draft": "0.5K", "1K": "1K", "2K": "2K", "4K": "4K" };
      const nanoBananaInput = {
        prompt,
        aspect_ratio: aspectRatioStr,
        resolution: resolutionMap[body.quality] || "1K",
        ...(hasRef ? { reference_image_url: referenceImageUrl } : {}),
        ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
      };
      const standardInput = {
        prompt,
        ...(hasRef ? { image_url: referenceImageUrl } : { image_size: { width, height } }),
        ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
      };
      const input = isNanoBanana ? nanoBananaInput : standardInput;

      const result = await fal.subscribe(falModelId, { input });
      const imageUrl = result.data?.images?.[0]?.url || result.data?.image?.url;

      return Response.json({
        success: true,
        type: "image",
        result_url: imageUrl,
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