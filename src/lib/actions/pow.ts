"use server";

import { queryEngine } from "./engine";
import type { PowChallenge, PowSolution } from "@/lib/pow/types";

async function generatePowChallenge(): Promise<PowChallenge> {
    const { powManager } = await import("@/lib/pow/manager");
    return powManager.generateChallenge();
}

async function validatePow(params?: Record<string, any>): Promise<boolean> {
    if (!params?.pow) throw new Error("pow is required");
    const { powManager } = await import("@/lib/pow/manager");
    return powManager.validateAndConsume(params.pow);
}

queryEngine.register("pow.generate", generatePowChallenge);
queryEngine.register("pow.validate", validatePow);