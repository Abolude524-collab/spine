"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Eye, RefreshCw } from "lucide-react";

interface VisualSandboxProps {
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  onConsoleLog?: (log: string) => void;
}

export const VisualSandbox: React.FC<VisualSandboxProps> = ({
  initialHtml = `<div class="card">
  <h1>Hello Spine! 👋</h1>
  <p>Visual sandbox running live in WebAssembly/browser.</p>
  <button id="btn">Click Me</button>
</div>`,
  initialCss = `body {
  background: #0A0A0C;
  color: #EDEDED;
  font-family: sans-serif;
  padding: 24px;
}
.card {
  border: 1px solid #222226;
  padding: 20px;
  background: #121215;
}
h1 { color: #00E699; margin-top: 0; }
button {
  background: #00E699;
  color: #000;
  border: none;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
}`,
  initialJs = `document.getElementById('btn').addEventListener('click', () => {
  console.log('Button clicked! Triggering active recall callback.');
  alert('Interactive event fired!');
});`,
  onConsoleLog,
}) => {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [js, setJs] = useState(initialJs);
  const [activeTab, setActiveTab] = useState<"preview" | "html" | "css" | "js">("preview");

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updateIframe = useCallback(() => {
    if (!iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const consoleInterceptorScript = `
      <script>
        const _log = console.log;
        const _error = console.error;
        console.log = function(...args) {
          _log(...args);
          window.parent.postMessage({ type: 'CONSOLE_LOG', message: args.join(' ') }, '*');
        };
        console.error = function(...args) {
          _error(...args);
          window.parent.postMessage({ type: 'CONSOLE_ERROR', message: args.join(' ') }, '*');
        };
      </script>
    `;

    const fullContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
          ${consoleInterceptorScript}
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(fullContent);
    doc.close();
  }, [css, html, js]);

  useEffect(() => {
    updateIframe();
  }, [updateIframe]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "CONSOLE_LOG" && onConsoleLog) {
        onConsoleLog(`> console.log: ${event.data.message}`);
      } else if (event.data?.type === "CONSOLE_ERROR" && onConsoleLog) {
        onConsoleLog(`❌ console.error: ${event.data.message}`);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onConsoleLog]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0A0A0C] font-mono text-xs border border-[#222226]">
      {/* Header Bar */}
      <div className="px-4 py-2 bg-[#0A0A0C] border-b border-[#222226] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 border flex items-center gap-1.5 transition-all text-xs font-bold ${
              activeTab === "preview"
                ? "bg-[#00E699]/15 border-[#00E699] text-[#00E699]"
                : "bg-[#121215] border-[#222226] text-zinc-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>
          <button
            onClick={() => setActiveTab("html")}
            className={`px-2.5 py-1 border transition-all text-xs ${
              activeTab === "html"
                ? "bg-[#00E699]/15 border-[#00E699] text-[#00E699]"
                : "bg-[#121215] border-[#222226] text-zinc-400 hover:text-white"
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => setActiveTab("css")}
            className={`px-2.5 py-1 border transition-all text-xs ${
              activeTab === "css"
                ? "bg-[#00E699]/15 border-[#00E699] text-[#00E699]"
                : "bg-[#121215] border-[#222226] text-zinc-400 hover:text-white"
            }`}
          >
            CSS
          </button>
          <button
            onClick={() => setActiveTab("js")}
            className={`px-2.5 py-1 border transition-all text-xs ${
              activeTab === "js"
                ? "bg-[#00E699]/15 border-[#00E699] text-[#00E699]"
                : "bg-[#121215] border-[#222226] text-zinc-400 hover:text-white"
            }`}
          >
            JS
          </button>
        </div>

        <button
          onClick={updateIframe}
          className="px-2.5 py-1 bg-[#121215] border border-[#222226] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors text-[11px]"
        >
          <RefreshCw className="w-3 h-3" /> Refresh Sandbox
        </button>
      </div>

      {/* Main Sandbox Canvas / Viewport */}
      <div className="flex-1 w-full h-full relative bg-[#0A0A0C]">
        {activeTab === "preview" && (
          <iframe
            ref={iframeRef}
            title="Visual Sandbox Preview"
            sandbox="allow-scripts"
            className="w-full h-full border-none bg-[#0A0A0C]"
          />
        )}

        {activeTab === "html" && (
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full h-full p-4 bg-[#0A0A0C] text-zinc-200 font-mono text-xs focus:outline-none resize-none"
          />
        )}

        {activeTab === "css" && (
          <textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            className="w-full h-full p-4 bg-[#0A0A0C] text-zinc-200 font-mono text-xs focus:outline-none resize-none"
          />
        )}

        {activeTab === "js" && (
          <textarea
            value={js}
            onChange={(e) => setJs(e.target.value)}
            className="w-full h-full p-4 bg-[#0A0A0C] text-zinc-200 font-mono text-xs focus:outline-none resize-none"
          />
        )}
      </div>
    </div>
  );
};

export default VisualSandbox;
