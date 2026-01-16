// src/types/codeforces.ts

export interface CfProblem {
    contestId: number;
    index: string;
    name?: string;
    rating?: number;
    tags?: string[];
  }
  
  export interface CfSubmission {
    creationTimeSeconds: number;
    verdict?: string;
    problem: CfProblem;
  }
  
  export interface CfResponse<T> {
    status: "OK" | "FAILED";
    result: T;
    comment?: string;
  }
  