"use client";

export interface VerificationResult {
  stepId: number;
  passed: boolean;
  message: string;
}

export function runLessonAssertions(code: string): {
  allPassed: boolean;
  results: VerificationResult[];
} {
  const results: VerificationResult[] = [
    {
      stepId: 1,
      passed: /galaxy\s*=\s*\[.*\]/.test(code) && (code.match(/["'].*?["']/g) || []).length >= 3,
      message: "Define the list galaxy with 3 items",
    },
    {
      stepId: 2,
      passed: /for\s+\w+\s+in\s+galaxy\s*:/.test(code),
      message: "Iterate each member using for star in galaxy",
    },
    {
      stepId: 3,
      passed: /illuminate\s*\(\s*\w+\s*\)/.test(code),
      message: "Call illuminate(star)",
    },
  ];

  const allPassed = results.every((r) => r.passed);
  return { allPassed, results };
}
