import { Sha256 } from "./sha256";
import type { PowChallenge, PowSolution, PowResult } from "./types";

export type { PowChallenge, PowSolution, PowResult };
export { powManager } from "./manager";

const sha256 = new Sha256();

export const solvePow = async (challenge: PowChallenge): Promise<PowResult> => {
  const { c: challengeObj, d } = challenge;
  const target = "0".repeat(d);
  const challengeString = `${challengeObj.d}:${challengeObj.s}:${challengeObj.p}:${challengeObj.n}:${challengeObj.c}`;

  return new Promise((resolve) => {
    const startTime = Date.now();
    let nonce = 0;

    const solve = () => {
      const batchSize = 1000;
      const endNonce = nonce + batchSize;

      while (nonce < endNonce) {
        const input = `${challengeString}:${nonce}`;
        const hash = sha256.hash(input);

        if (hash.startsWith(target)) {
          resolve({
            s: true,
            sol: { c: challengeObj, n: nonce, h: hash },
          });
          return;
        }

        nonce++;
      }

      if (Date.now() - startTime > 10000) {
        resolve({ s: false, e: "timeout" });
        return;
      }
      setTimeout(solve, 0);
    };

    solve();
  });
};

export const verifyPow = (
  solution: PowSolution,
  difficulty: number
): boolean => {
  const { c: challengeObj, n: nonce, h: hash } = solution;
  const challengeString = `${challengeObj.d}:${challengeObj.s}:${challengeObj.p}:${challengeObj.n}:${challengeObj.c}`;
  const input = `${challengeString}:${nonce}`;
  const computedHash = sha256.hash(input);

  return computedHash === hash && hash.startsWith("0".repeat(difficulty));
};
