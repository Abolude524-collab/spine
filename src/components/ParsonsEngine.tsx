"use client";

import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useLessonStore, ParsonsBlock } from "@/store/useLessonStore";
import { useUserStore } from "@/store/useUserStore";
import {
  GripVertical,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Play,
} from "lucide-react";

export const ParsonsEngine: React.FC = () => {
  const {
    parsonsSourceBlocks,
    parsonsUserSolution,
    parsonsValidationStatus,
    reorderUserSolution,
    moveBlockToSolution,
    moveBlockToSource,
    indentBlock,
    validateParsons,
    resetLesson,
  } = useLessonStore();

  const { addXp, setModuleProgress, moduleProgress } = useUserStore();

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    // Dropped within same list (Solution reordering)
    if (
      source.droppableId === "solution-list" &&
      destination.droppableId === "solution-list"
    ) {
      reorderUserSolution(source.index, destination.index);
      return;
    }

    // Moved from Source Pool to Solution Workspace
    if (
      source.droppableId === "source-list" &&
      destination.droppableId === "solution-list"
    ) {
      const block = parsonsSourceBlocks[source.index];
      if (block) {
        moveBlockToSolution(block.id);
      }
      return;
    }

    // Moved back from Solution to Source Pool
    if (
      source.droppableId === "solution-list" &&
      destination.droppableId === "source-list"
    ) {
      const block = parsonsUserSolution[source.index];
      if (block) {
        moveBlockToSource(block.id);
      }
      return;
    }
  };

  const handleValidate = () => {
    const passed = validateParsons();
    if (passed) {
      addXp(25);
      if (moduleProgress < 100) {
        setModuleProgress(Math.min(100, moduleProgress + 10));
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0A0A0C] font-mono text-xs select-none">
      {/* Header Bar */}
      <div className="px-4 py-2 bg-[#0A0A0C] border-b border-[#222226] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#00E699] font-bold uppercase tracking-wider text-[11px]">
            PARSONS PROBLEM ENGINE
          </span>
          <span className="text-zinc-500 text-[10px]">
            Drag blocks to structure the loop logic
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetLesson}
            className="px-2.5 py-1 bg-[#121215] border border-[#222226] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors text-[11px]"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={handleValidate}
            className="px-3 py-1 bg-[#00E699] hover:bg-[#00FF9D] text-black font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all text-[11px]"
          >
            <Play className="w-3 h-3 fill-black" /> Validate Solution
          </button>
        </div>
      </div>

      {/* Validation Result Banner */}
      {parsonsValidationStatus !== "untested" && (
        <div
          className={`px-4 py-2 text-xs font-mono flex items-center justify-between border-b ${
            parsonsValidationStatus === "passed"
              ? "bg-[#00E699]/10 border-[#00E699]/40 text-[#00E699]"
              : "bg-rose-500/10 border-rose-500/40 text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {parsonsValidationStatus === "passed" ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#00E699]" />
                <span className="font-bold">
                  ✓ [PASS] Sequence & Indentation Perfectly Matched! (+25 XP)
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>
                  ✗ Sequence incomplete or misaligned. Check block order & indentation.
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Drag and Drop Workspace Grid */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#222226] p-4 gap-4 md:gap-0 overflow-hidden">
          {/* LEFT: Unordered Source Code Pool */}
          <div className="flex flex-col bg-[#0D0D10] border border-[#222226] p-3 overflow-y-auto">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>UNORDERED CODE BLOCKS</span>
              <span className="text-zinc-600 text-[10px]">
                {parsonsSourceBlocks.length} available
              </span>
            </div>

            <Droppable droppableId="source-list">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 space-y-2 p-2 transition-colors min-h-[160px] ${
                    snapshot.isDraggingOver ? "bg-[#141418]" : ""
                  }`}
                >
                  {parsonsSourceBlocks.map((block, index) => (
                    <Draggable
                      key={block.id}
                      draggableId={block.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-2.5 bg-[#121215] border border-[#222226] hover:border-zinc-700 flex items-center gap-2 transition-all font-mono text-xs ${
                            snapshot.isDragging
                              ? "shadow-[0_0_15px_rgba(0,230,153,0.3)] border-[#00E699] opacity-90"
                              : ""
                          }`}
                        >
                          <GripVertical className="w-3.5 h-3.5 text-zinc-600 cursor-grab" />
                          <span className="text-zinc-200">{block.text}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* RIGHT: Target Solution Workspace */}
          <div className="flex flex-col bg-[#0A0A0C] border border-[#222226] p-3 overflow-y-auto">
            <div className="text-[11px] font-bold text-[#00E699] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>TARGET SOLUTION WORKSPACE</span>
              <span className="text-zinc-500 text-[10px]">
                Arrange & indent correctly
              </span>
            </div>

            <Droppable droppableId="solution-list">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 space-y-2 p-2 border-2 border-dashed transition-colors min-h-[220px] ${
                    snapshot.isDraggingOver
                      ? "border-[#00E699] bg-[#00E699]/5"
                      : "border-[#222226]"
                  }`}
                >
                  {parsonsUserSolution.length === 0 && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 text-xs py-8">
                      <span>Drag code blocks here to build the loop sequence</span>
                    </div>
                  )}

                  {parsonsUserSolution.map((block, index) => (
                    <Draggable
                      key={block.id}
                      draggableId={block.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-2.5 bg-[#121215] border transition-all flex items-center justify-between ${
                            block.isCorrect === true
                              ? "border-[#00E699] bg-[#00E699]/10"
                              : block.isCorrect === false
                              ? "border-rose-500 bg-rose-500/10"
                              : "border-[#222226] hover:border-zinc-700"
                          } ${
                            snapshot.isDragging
                              ? "shadow-lg border-[#00E699]"
                              : ""
                          }`}
                          style={{
                            ...provided.draggableProps.style,
                            marginLeft: `${block.indent * 24}px`,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="w-3.5 h-3.5 text-zinc-500 cursor-grab" />
                            </div>
                            <span className="text-white font-mono">
                              {block.text}
                            </span>
                          </div>

                          {/* Indentation Controls */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => indentBlock(block.id, -1)}
                              disabled={block.indent === 0}
                              title="Outdent block"
                              className="px-1.5 py-0.5 bg-[#0A0A0C] border border-[#222226] text-zinc-400 hover:text-white disabled:opacity-30"
                            >
                              ←
                            </button>
                            <span className="text-[10px] text-zinc-500 px-1">
                              {block.indent * 4}s
                            </span>
                            <button
                              onClick={() => indentBlock(block.id, 1)}
                              disabled={block.indent === 2}
                              title="Indent block"
                              className="px-1.5 py-0.5 bg-[#0A0A0C] border border-[#222226] text-zinc-400 hover:text-white disabled:opacity-30"
                            >
                              →
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default ParsonsEngine;
