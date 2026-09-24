"use client";

export interface PyodideInterface {
  loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
  setStdout: (options: { batched: (text: string) => void }) => void;
  setStderr: (options: { batched: (text: string) => void }) => void;
  runPythonAsync: (code: string) => Promise<unknown>;
}

// Singleton Pyodide Instance
let pyodidePromise: Promise<PyodideInterface> | null = null;

export async function getPyodide(): Promise<PyodideInterface | null> {
  if (typeof window === "undefined") return null;

  if (!pyodidePromise) {
    pyodidePromise = new Promise((resolve, reject) => {
      const win = window as unknown as Record<string, unknown>;
      if (win.loadPyodide) {
        (win.loadPyodide as (config: { indexURL: string }) => Promise<PyodideInterface>)({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
        })
          .then(resolve)
          .catch(reject);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
      script.onload = async () => {
        try {
          const pyodide = await (win.loadPyodide as (config: { indexURL: string }) => Promise<PyodideInterface>)({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
          });
          resolve(pyodide);
        } catch (err) {
          reject(err);
        }
      };
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }

  return pyodidePromise;
}

export interface ExecutionResult {
  success: boolean;
  output: string[];
  executionTimeMs: number;
  error?: string;
}

export async function runPythonCode(code: string): Promise<ExecutionResult> {
  const startTime = performance.now();
  const output: string[] = [];

  try {
    const pyodide = await getPyodide();
    if (!pyodide) {
      throw new Error("Pyodide engine unavailable");
    }

    // Setup Python stdout & stderr capturing
    pyodide.setStdout({
      batched: (text: string) => {
        output.push(text);
      },
    });

    pyodide.setStderr({
      batched: (text: string) => {
        output.push(`⚠️ ${text}`);
      },
    });

    // Mock built-in lesson helper functions if referenced
    const prelude = `
import sys

def illuminate(star):
    print(f"✓ [PASS] star: {star} illuminated")

def render_canvas():
    print("✓ [PASS] Canvas rendered successfully")
`;

    await pyodide.runPythonAsync(prelude + "\n" + code);

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    return {
      success: true,
      output: output.length > 0 ? output : ["✓ Code executed successfully with zero errors."],
      executionTimeMs: duration,
    };
  } catch (err: unknown) {
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    const errorMsg = err instanceof Error ? err.message : String(err);
    const cleanError = errorMsg
      .split("\n")
      .filter((line: string) => !line.includes("PythonError") && !line.includes("File \"<exec>\""))
      .join("\n");

    return {
      success: false,
      output: [
        `❌ Traceback Error:`,
        cleanError || "Execution stopped due to syntax or reference error.",
      ],
      executionTimeMs: duration,
      error: cleanError,
    };
  }
}
