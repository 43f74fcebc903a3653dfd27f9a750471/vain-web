import type { PowChallenge, PowSolution } from "./types";
import { verifyPow } from "./index";

interface ChallengeRecord {
  challenge: PowChallenge;
  createdAt: number;
  used: boolean;
}

class PowManager {
  private challenges = new Map<string, ChallengeRecord>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.cleanupInterval = setInterval(() => this.cleanup(), 30000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [id, record] of this.challenges.entries()) {
      if (now - record.createdAt > 120000) {
        this.challenges.delete(id);
      }
    }
  }

  private getChallengeId(challengeObj: {
    d: string;
    s: string;
    p: string;
    n: string;
    c: string;
  }): string {
    return `${challengeObj.d}:${challengeObj.s}:${challengeObj.p}:${challengeObj.n}:${challengeObj.c}`;
  }

  generateChallenge(): PowChallenge {
    const challenge: PowChallenge = {
      c: {
        d: Array.from({ length: 4 }, () =>
          Math.random().toString(36).substring(2, 8)
        ).join(":"),
        s: Array.from({ length: 2 }, () =>
          Math.random().toString(16).substring(2, 6)
        ).join(""),
        p: Array.from({ length: 2 }, () =>
          Math.random().toString(36).substring(2, 8)
        ).join(";"),
        n: Math.floor(Math.random() * 10000).toString(16),
        c: Array.from({ length: 3 }, () =>
          Math.random().toString(36).substring(2, 6)
        ).join("~"),
      },
      d: 2,
      t: Date.now(),
    };

    const id = this.getChallengeId(challenge.c);
    this.challenges.set(id, {
      challenge,
      createdAt: Date.now(),
      used: false,
    });

    return challenge;
  }

  validateAndConsume(solution: PowSolution): boolean {
    const id = this.getChallengeId(solution.c);
    const record = this.challenges.get(id);

    if (!record) return false;
    if (record.used) return false;
    if (Date.now() - record.createdAt > 120000) {
      this.challenges.delete(id);
      return false;
    }

    const isValid = verifyPow(solution, 2);

    if (isValid) {
      record.used = true;
    }

    return isValid;
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.challenges.clear();
  }
}

export const powManager = new PowManager();
