/**
 * ====================================================================
 * TIGER AI — BROWSER-LOCAL INFERENCE ENGINE (WebLLM / WebGPU)
 * ====================================================================
 * 100% free, unlimited architecture: a small open-weight LLM runs
 * entirely inside the visitor's browser via WebGPU (WebLLM). There is
 * NO server, NO API key, NO quota — the visitor's GPU does the work and
 * model weights are fetched once from the free Hugging Face CDN and
 * cached by the browser (repeat visits don't re-download).
 *
 * The `@mlc-ai/web-llm` module is imported DYNAMICALLY, on first use,
 * so it never blocks initial page rendering and is absent from the
 * initial JS payload of the website.
 *
 * Fallback policy (honest, no fake AI):
 *   • No WebGPU / no adapter → status "unsupported": a clean, friendly
 *     message tells the visitor which browsers can run the assistant.
 *     The chat history stays fully usable; no fake answers are shown.
 *   • Load/generation failures → status "error" with a retry action.
 * ====================================================================
 */

import type {
  ChatCompletionMessageParam,
  MLCEngineInterface,
  InitProgressReport,
} from "@mlc-ai/web-llm";

export type EngineStatus = "idle" | "loading" | "ready" | "error" | "unsupported";

export type EngineProgress = {
  /** 0..1 download/init progress when known. */
  progress: number;
  /** Human-readable stage line (already localized by the UI when shown). */
  text: string;
};

export type TigerEngineError = {
  kind: "unsupported" | "network" | "runtime";
  message: string;
};

/* Small models from WebLLM's prebuilt list — free open weights, cached
   by the browser after the first download:
   • Balanced (desktop default): Llama 3.2 1B Instruct, ~880 MB VRAM.
   • Fast (mobile / low-memory): Qwen2.5 0.5B Instruct, ~1 GB VRAM but
     much smaller download, snappier generation. */
const MODEL_BALANCED = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
const MODEL_FAST = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

export type ModelChoice = "balanced" | "fast";

export function autoModelChoice(): ModelChoice {
  try {
    const nav = navigator as Navigator & { deviceMemory?: number; userAgentData?: { mobile?: boolean } };
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
    const mobileUA = /android|iphone|ipad|ipod|mobile/i.test(nav.userAgent);
    if ((nav.deviceMemory !== undefined && nav.deviceMemory <= 4) || coarse || mobileUA) {
      return "fast";
    }
  } catch {
    /* default below */
  }
  return "balanced";
}

export function modelIdFor(choice: ModelChoice): string {
  return choice === "fast" ? MODEL_FAST : MODEL_BALANCED;
}

/* ------------------------------------------------------------------ */
/* WebGPU capability check                                            */
/* ------------------------------------------------------------------ */

export async function checkWebGPUSupport(): Promise<boolean> {
  try {
    const gpu = (navigator as Navigator & { gpu?: GPU }).gpu;
    if (!gpu) return false;
    /* requestAdapter() returns null when no real implementation exists
       (e.g. headless browsers without GPU) — don't trust the API alone. */
    const adapter = await Promise.race([
      gpu.requestAdapter(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000)),
    ]);
    return !!adapter;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Engine lifecycle (singleton per model id)                          */
/* ------------------------------------------------------------------ */

let enginePromise: Promise<MLCEngineInterface> | null = null;
let loadedModelId: string | null = null;

function resolveModelId(preferred: string, prebuilt: { model_id: string }[]): string {
  if (prebuilt.some((m) => m.model_id === preferred)) return preferred;
  const prefix = preferred.split("-q4")[0];
  const loose = prebuilt.find((m) => m.model_id.startsWith(prefix));
  if (loose) return loose.model_id;
  throw { kind: "runtime", message: `model ${preferred} is not available` } as TigerEngineError;
}

export function isEngineReady(): boolean {
  return enginePromise !== null && loadedModelId !== null;
}

export function loadedModel(): string | null {
  return loadedModelId;
}

/** Load (or reuse) the engine. `onProgress` receives 0..1 progress and
 *  the loader's own stage text, for the UI's loading state. */
export async function loadEngine(
  choice: ModelChoice,
  onProgress?: (p: EngineProgress) => void
): Promise<MLCEngineInterface> {
  const preferred = modelIdFor(choice);

  if (enginePromise && loadedModelId === preferred) return enginePromise;

  /* A different model was requested — drop the previous engine. */
  if (enginePromise && loadedModelId !== preferred) {
    enginePromise = null;
    loadedModelId = null;
  }

  enginePromise = (async () => {
    const webllm = await import("@mlc-ai/web-llm");
    const wanted = resolveModelId(
      preferred,
      webllm.prebuiltAppConfig.model_list as unknown as { model_id: string }[]
    );
    const engine = await webllm.CreateMLCEngine(wanted, {
      initProgressCallback: (report: InitProgressReport) => {
        onProgress?.({
          progress: typeof report.progress === "number" ? report.progress : 0,
          text: report.text ?? "",
        });
      },
    });
    loadedModelId = wanted;
    return engine;
  })().catch((err) => {
    /* Reset so a retry can start fresh. */
    enginePromise = null;
    loadedModelId = null;
    const message = err instanceof Error ? err.message : String(err);
    /* Missing/failed weight downloads surface as fetch errors. */
    if (/fetch|network|download|load/i.test(message)) {
      throw { kind: "network", message } as TigerEngineError;
    }
    throw { kind: "runtime", message } as TigerEngineError;
  });

  return enginePromise;
}

/* ------------------------------------------------------------------ */
/* Generation (streaming)                                             */
/* ------------------------------------------------------------------ */

export async function generateAnswer(
  messages: ChatCompletionMessageParam[],
  onDelta: (fullText: string) => void,
  opts?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  if (!enginePromise) {
    throw { kind: "runtime", message: "engine not loaded" } as TigerEngineError;
  }
  let full = "";
  try {
    const engine = await enginePromise;
    const stream = await engine.chat.completions.create({
      messages,
      temperature: opts?.temperature ?? 0.65,
      top_p: 0.9,
      max_tokens: opts?.maxTokens ?? 420,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content ?? "";
      if (delta) {
        full += delta;
        onDelta(full);
      }
    }
    return full.trim();
  } catch (err) {
    /* An "interrupt" (stop button) is a normal early exit — keep the
       partial text generated so far. */
    const message = err instanceof Error ? err.message : String(err ?? "");
    if (/interrupt|abort/i.test(message)) return full.trim();
    if (/fetch|network|download/i.test(message)) {
      throw { kind: "network", message } as TigerEngineError;
    }
    throw { kind: "runtime", message } as TigerEngineError;
  }
}

/** Cooperative stop for the current generation (stop button). */
export async function interruptGeneration(): Promise<void> {
  try {
    if (enginePromise) {
      const engine = await enginePromise;
      engine.interruptGenerate();
    }
  } catch {
    /* non-fatal */
  }
}
