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
  
export interface CodeforcesResponse<T> {
  status: "OK" | "FAILED";
  result: T;
  comment?: string;
}

 export interface CodeforcesUser {
  handle: string;
  rating?: number;
  rank?: string;
  maxRating?: number;
  maxRank?: string;
  contribution: number;
  friendOfCount: number;
  avatar: string;
  titlePhoto: string;
}