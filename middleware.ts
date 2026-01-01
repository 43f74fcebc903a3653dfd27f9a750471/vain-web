import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PREFIX = `/_v/t00001/${process.env.buildbase64}`;

export function middleware(req: NextRequest) {
    if (process.env.NODE_ENV !== "production") {
        return NextResponse.next();
    }

    const p = req.nextUrl.pathname;
    if (p.startsWith(`${PREFIX}/_next/`)) {
        const r = p.replace(PREFIX, "");
        return NextResponse.rewrite(new URL(r, req.url));
    }
    return NextResponse.next();
}
