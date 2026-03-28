import { fal } from "npm:@fal-ai/client@^1";
import { createClientFromRequest } from "npm:@base44/sdk@0.8.23";

// TESTING MODE — set to false when launching to real users
const TESTING_MODE = true;

const IMAGE_MODELS = {
  "Nano Banana 2":     "fal-ai/nano-banana-2",
  "Nano Banana Pro":   "fal-ai/nano-banana-pro",
  "Soul 2.0":          "fal-ai/flux/dev",
  "Seedream 5.0 Lite": "fal-ai/bytedance/seedream-3",
  "Seedream 4.5":      "fal-ai/bytedance/seedream-3",
  "Flux Kontext":      "fal-ai/flux-pro/kontext",
  "Flux 2":            "fal-ai/flux-pro/v1.1",
  "Wan 2.2 Image":     "fal-ai/wan-i2i",
  "Skin Enhancer":     "fal-ai/aura-sr",
  "Face Swap":         "fal-ai/face-swap",
  "Relight":           "fal-ai/ic-light",
};

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
  const { model, prompt, type, duration, ratio, referenceImageUrl, negativePrompt } = body;

  if (!model || typeof model !== "string" || model.length > 100) {
    return Response.json({ error: "Invalid model" }, { status: 400 });
  }
  if (!prompt || typeof prompt !== "string" || prompt.length > 2000) {
    return Response.json({ error: "Prompt required" }, { status: 400 });
  }
  if (!type || (type !== "image" && type !== "video")) {
    return Response.json({ error: "Type must be image or video" }, { status: 400 });
  }

  // Credit check — SKIPPED during testing
  if (!TESTING_MODE) {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Please log in" }, { status: 401 });
    }
    // Add credit deduction logic here before launch
  }

  const falKey = (Deno.env.get("FAL_KEY") || "").trim();
  if (!falKey) {
    return Response.json({ error: "FAL_KEY not configured" }, { status: 500 });
  }
  fal.config({ credentials: falKey });

  try {
    // ── IMAGE GENERATION ──
    if (type === "image") {
      const modelId = IMAGE_MODELS[model];
      if (!modelId) {
        return Response.json({ error: "Unknown image model: " + model }, { status: 400 });
      }

      const aspectRatio =
        ratio === "9:16" ? "9:16" :
        ratio === "1:1"  ? "1:1"  :
        ratio === "4:3"  ? "4:3"  : "16:9";

      const falModelId = referenceImageUrl ? modelId + "/edit" : modelId;

      const input = {
        prompt,
        aspect_ratio: aspectRatio,
        ...(referenceImageUrl ? { image_urls: [referenceImageUrl] } : {}),
        ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
      };

      const result = await fal.subscribe(falModelId, { input });
      const imageUrl = result.data?.images?.[0]?.url;

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