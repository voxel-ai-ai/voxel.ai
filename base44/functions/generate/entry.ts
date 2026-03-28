import { fal } from "npm:@fal-ai/client@1.3.1";
import { createClientFromRequest } from "npm:@base44/sdk@0.8.23";

// TESTING MODE — set to false when launching to real users
const TESTING_MODE = true;

const MODEL_ROUTING = {
  // IMAGE
  "Nano Banana Pro":     { provider: "nano_banana", type: "image" },
  "Nano Banana 2":       { provider: "nano_banana", type: "image" },
  "GPT Image 1.5":       { provider: "fal", id: "fal-ai/flux-pro", type: "image" },
  "Flux Kontext":        { provider: "fal", id: "fal-ai/flux-pro/kontext", type: "image" },
  "Flux 2":              { provider: "fal", id: "fal-ai/flux-pro/v1.1", type: "image" },
  "Seedream 5.0 Lite":   { provider: "fal", id: "fal-ai/bytedance/seedream-3", type: "image" },
  "Seedream 4.5":        { provider: "fal", id: "fal-ai/bytedance/seedream-3", type: "image" },
  "Soul 2.0":            { provider: "fal", id: "fal-ai/flux/dev", type: "image" },
  "Wan 2.2 Image":       { provider: "fal", id: "fal-ai/wan-i2i", type: "image" },
  "Skin Enhancer":       { provider: "fal", id: "fal-ai/aura-sr", type: "image" },
  "Face Swap":           { provider: "fal", id: "fal-ai/face-swap", type: "image" },
  "Relight":             { provider: "fal", id: "fal-ai/ic-light", type: "image" },

  // VIDEO
  "Kling 3.0 Omni":      { provider: "fal", id: "fal-ai/kling-video/v2.1/pro/text-to-video", type: "video" },
  "Kling 3.0":           { provider: "fal", id: "fal-ai/kling-video/v2.1/standard/text-to-video", type: "video" },
  "Kling 2.6":           { provider: "fal", id: "fal-ai/kling-video/v1.6/pro/text-to-video", type: "video" },
  "Kling 2.5":           { provider: "fal", id: "fal-ai/kling-video/v1.5/pro/text-to-video", type: "video" },
  "Kling 2.1":           { provider: "fal", id: "fal-ai/kling-video/v1/pro/text-to-video", type: "video" },
  "Kling O1":            { provider: "fal", id: "fal-ai/kling-video/v1.6/pro/text-to-video", type: "video" },
  "Kling Motion Control":{ provider: "fal", id: "fal-ai/kling-video/v1.6/pro/text-to-video", type: "video" },
  "Wan 2.6":             { provider: "fal", id: "fal-ai/wan-i2v", type: "video" },
  "Wan 2.2":             { provider: "fal", id: "fal-ai/wan-t2v", type: "video" },
  "Seedance 1.5 Pro":    { provider: "fal", id: "fal-ai/bytedance/seedance-1-5-pro-t2v", type: "video" },
  "Seedance 2.0":        { provider: "fal", id: "fal-ai/bytedance/seedance-1-5-pro-t2v", type: "video" },
  "Seedance 1":          { provider: "fal", id: "fal-ai/bytedance/seedance-1-lite-t2v", type: "video" },
  "LTX 2":               { provider: "fal", id: "fal-ai/ltx-video-13b-distilled", type: "video" },
  "Hailuo 2.3":          { provider: "fal", id: "fal-ai/minimax/video-01-live", type: "video" },
  "PixVerse 5":          { provider: "fal", id: "fal-ai/pixverse/v4.5/text-to-video", type: "video" },
  "Vidu Q3":             { provider: "fal", id: "fal-ai/vidu/q1", type: "video" },
  "Vidu Q2":             { provider: "fal", id: "fal-ai/vidu/q1", type: "video" },
  "Veo 3.1":             { provider: "fal", id: "fal-ai/veo2", type: "video" },
  "Sora 2":              { provider: "fal", id: "fal-ai/sora", type: "video" },
  "Nano Banana Pro Video":{ provider: "fal", id: "fal-ai/kling-video/v1.6/pro/text-to-video", type: "video" },
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

  const modelConfig = MODEL_ROUTING[model];
  if (!modelConfig) {
    return Response.json({ error: "Unknown model: " + model }, { status: 400 });
  }

  // Credit check — SKIPPED during testing
  if (!TESTING_MODE) {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Please log in" }, { status: 401 });
    }
    // Credit check logic goes here when launched
  }

  // Configure fal with key from env only
  fal.config({ credentials: Deno.env.get("FAL_API_KEY") });

  try {
    // ── IMAGE GENERATION ──
    if (type === "image") {

      if (modelConfig.provider === "nano_banana") {
        const response = await fetch(
          `${Deno.env.get("NANO_BANANA_BASE_URL")}/generate/image`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${Deno.env.get("NANO_BANANA_API_KEY")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt,
              negative_prompt: negativePrompt || "",
              aspect_ratio: ratio || "16:9",
            }),
          }
        );
        const data = await response.json();
        return Response.json({
          success: true,
          type: "image",
          result_url: data.image_url || data.url,
        });
      }

      if (modelConfig.provider === "fal") {
        const result = await fal.run(modelConfig.id, {
          input: {
            prompt,
            negative_prompt: negativePrompt || "",
            image_size:
              ratio === "9:16" ? "portrait_16_9" :
              ratio === "1:1"  ? "square_hd" : "landscape_16_9",
            num_inference_steps: 28,
            guidance_scale: 3.5,
            num_images: 1,
            enable_safety_checker: true,
            ...(referenceImageUrl ? { image_url: referenceImageUrl } : {}),
          },
        });
        const imageUrl = result.images?.[0]?.url || result.image?.url;
        return Response.json({
          success: true,
          type: "image",
          result_url: imageUrl,
        });
      }
    }

    // ── VIDEO GENERATION ──
    if (type === "video") {
      if (modelConfig.provider === "fal") {
        const input = {
          prompt,
          duration: String(duration || 5),
          aspect_ratio: ratio || "16:9",
          ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
          ...(referenceImageUrl ? { image_url: referenceImageUrl } : {}),
        };

        const submitted = await fal.queue.submit(modelConfig.id, { input });

        return Response.json({
          success: true,
          type: "video",
          job_id: submitted.request_id,
          model_id: modelConfig.id,
        });
      }
    }

    return Response.json({ error: "Unsupported provider" }, { status: 400 });

  } catch (error) {
    console.error("Generation error:", error.message);
    return Response.json({ error: "Generation failed. Please try again." }, { status: 500 });
  }
});