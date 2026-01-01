export interface PowChallenge {
  c: {
    d: string;
    s: string;
    p: string;
    n: string;
    c: string;
  };
  d: number;
  t: number;
}

export interface PowSolution {
  c: {
    d: string;
    s: string;
    p: string;
    n: string;
    c: string;
  };
  n: number;
  h: string;
}

export interface PowResult {
  s: boolean;
  sol?: PowSolution;
  e?: string;
}
