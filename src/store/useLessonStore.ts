import { create } from "zustand";
import { Lesson } from "@/data/curriculumData";

export type ChallengeType = "faded_example" | "parsons" | "blank_canvas";

export interface ParsonsBlock {
  id: string;
  text: string;
  indent: number;
  isCorrect?: boolean;
}

export interface LessonState {
  challengeType: ChallengeType;
  
  // Faded Examples State
  fadedCode: string;
  lockedLines: number[];
  
  // Parsons Problem State
  parsonsSourceBlocks: ParsonsBlock[];
  parsonsUserSolution: ParsonsBlock[];
  expectedSequence: { id: string; indent: number }[];
  parsonsValidationStatus: "untested" | "passed" | "failed";

  // Actions
  setChallengeType: (type: ChallengeType) => void;
  setFadedCode: (code: string) => void;
  setParsonsUserSolution: (blocks: ParsonsBlock[]) => void;
  reorderUserSolution: (startIndex: number, endIndex: number) => void;
  moveBlockToSolution: (blockId: string) => void;
  moveBlockToSource: (blockId: string) => void;
  indentBlock: (blockId: string, delta: number) => void;
  validateParsons: () => boolean;
  loadLesson: (lesson: Lesson) => void;
  resetLesson: () => void;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  challengeType: "faded_example",
  fadedCode: "",
  lockedLines: [],
  parsonsSourceBlocks: [],
  parsonsUserSolution: [],
  expectedSequence: [],
  parsonsValidationStatus: "untested",

  setChallengeType: (type) => set({ challengeType: type }),
  setFadedCode: (code) => set({ fadedCode: code }),
  setParsonsUserSolution: (blocks) => set({ parsonsUserSolution: blocks }),

  reorderUserSolution: (startIndex, endIndex) => {
    const solution = [...get().parsonsUserSolution];
    const [removed] = solution.splice(startIndex, 1);
    solution.splice(endIndex, 0, removed);
    set({ parsonsUserSolution: solution, parsonsValidationStatus: "untested" });
  },

  moveBlockToSolution: (blockId) => {
    const source = [...get().parsonsSourceBlocks];
    const solution = [...get().parsonsUserSolution];
    const index = source.findIndex((b) => b.id === blockId);
    if (index !== -1) {
      const [block] = source.splice(index, 1);
      solution.push(block);
      set({
        parsonsSourceBlocks: source,
        parsonsUserSolution: solution,
        parsonsValidationStatus: "untested",
      });
    }
  },

  moveBlockToSource: (blockId) => {
    const source = [...get().parsonsSourceBlocks];
    const solution = [...get().parsonsUserSolution];
    const index = solution.findIndex((b) => b.id === blockId);
    if (index !== -1) {
      const [block] = solution.splice(index, 1);
      block.indent = 0;
      source.push(block);
      set({
        parsonsSourceBlocks: source,
        parsonsUserSolution: solution,
        parsonsValidationStatus: "untested",
      });
    }
  },

  indentBlock: (blockId, delta) => {
    const solution = get().parsonsUserSolution.map((block) => {
      if (block.id === blockId) {
        const newIndent = Math.min(2, Math.max(0, block.indent + delta));
        return { ...block, indent: newIndent };
      }
      return block;
    });
    set({ parsonsUserSolution: solution, parsonsValidationStatus: "untested" });
  },

  validateParsons: () => {
    const { parsonsUserSolution, expectedSequence } = get();
    if (parsonsUserSolution.length !== expectedSequence.length) {
      set({ parsonsValidationStatus: "failed" });
      return false;
    }

    let isCorrect = true;
    const evaluatedSolution = parsonsUserSolution.map((userBlock, idx) => {
      const expected = expectedSequence[idx];
      const match =
        userBlock.id === expected.id && userBlock.indent === expected.indent;
      if (!match) isCorrect = false;
      return { ...userBlock, isCorrect: match };
    });

    set({
      parsonsUserSolution: evaluatedSolution,
      parsonsValidationStatus: isCorrect ? "passed" : "failed",
    });

    return isCorrect;
  },

  loadLesson: (lesson) => {
    set({
      fadedCode: lesson.initialCode,
      lockedLines: lesson.lockedLines || [],
      parsonsSourceBlocks: [...(lesson.parsonsBlocks || [])],
      parsonsUserSolution: [],
      expectedSequence: [...(lesson.expectedParsons || [])],
      parsonsValidationStatus: "untested",
    });
  },

  resetLesson: () => {
    set({
      parsonsUserSolution: [],
      parsonsValidationStatus: "untested",
    });
  },
}));
