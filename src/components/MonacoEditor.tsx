"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import { Lock } from "lucide-react";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  lockedLines?: number[];
  readOnly?: boolean;
}

export const SpineMonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language = "python",
  lockedLines = [],
  readOnly = false,
}) => {
  const editorRef = useRef<unknown>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [lockWarning, setLockWarning] = useState<string | null>(null);

  const updateLockedDecorations = useCallback(
    (editor: unknown, monaco: Monaco) => {
      if (!editor || !monaco) return;
      const ed = editor as { deltaDecorations: (old: unknown[], newDec: unknown[]) => void };
      const decorations = lockedLines.map((line) => ({
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: "bg-[#00E699]/5 border-l-2 border-[#00E699]/40",
          glyphMarginClassName: "locked-glyph-margin",
        },
      }));
      ed.deltaDecorations([], decorations);
    },
    [lockedLines]
  );

  // Handle Monaco Editor Mounting & Theme Definition
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define Spine Dark Custom Monaco Theme
    monaco.editor.defineTheme("spine-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", background: "0A0A0C", foreground: "EDEDED" },
        { token: "keyword", foreground: "00E699", fontStyle: "bold" },
        { token: "string", foreground: "FFE600" },
        { token: "comment", foreground: "52525B", fontStyle: "italic" },
        { token: "function", foreground: "60A5FA" },
        { token: "number", foreground: "F472B6" },
      ],
      colors: {
        "editor.background": "#0A0A0C",
        "editor.foreground": "#EDEDED",
        "editor.lineHighlightBackground": "#16161A",
        "editorCursor.foreground": "#00E699",
        "editorLineNumber.foreground": "#333338",
        "editorLineNumber.activeForeground": "#00E699",
        "editorIndentGuide.background": "#1A1A1E",
        "editorIndentGuide.activeBackground": "#222226",
      },
    });

    monaco.editor.setTheme("spine-dark");

    // Intercept Keys for Locked Lines in Faded Examples
    editor.onKeyDown((e) => {
      const position = editor.getPosition();
      if (!position) return;

      const currentLine = position.lineNumber;

      if (lockedLines.includes(currentLine)) {
        // Prevent editing key actions on locked lines
        const isEditKey =
          e.keyCode !== monaco.KeyCode.LeftArrow &&
          e.keyCode !== monaco.KeyCode.RightArrow &&
          e.keyCode !== monaco.KeyCode.UpArrow &&
          e.keyCode !== monaco.KeyCode.DownArrow;

        if (isEditKey) {
          e.preventDefault();
          e.stopPropagation();
          setLockWarning(`Line ${currentLine} is locked by the instructor.`);
          setTimeout(() => setLockWarning(null), 2500);
        }
      }
    });

    // Add Glyph Lock Indicators in Margin
    updateLockedDecorations(editor, monaco);
  };

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      updateLockedDecorations(editorRef.current, monacoRef.current);
    }
  }, [lockedLines, updateLockedDecorations]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#0A0A0C]">
      {/* Locked Line Warning Toast */}
      {lockWarning && (
        <div className="absolute top-2 right-4 z-50 px-3 py-1.5 bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center gap-2 animate-bounce shadow-lg">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>{lockWarning}</span>
        </div>
      )}

      {/* Editor Main Canvas */}
      <div className="flex-1 w-full h-full relative">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorDidMount}
          theme="spine-dark"
          options={{
            fontSize: 13,
            fontFamily: "var(--font-jetbrains-mono), JetBrains Mono, monospace",
            lineNumbers: "on",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            roundedSelection: false,
            readOnly: readOnly,
            cursorBlinking: "smooth",
            smoothScrolling: true,
            tabSize: 4,
            padding: { top: 12, bottom: 12 },
          }}
          loading={
            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-zinc-500 bg-[#0A0A0C]">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E699] animate-pulse"></span>
                Initializing Monaco Engine...
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default SpineMonacoEditor;
