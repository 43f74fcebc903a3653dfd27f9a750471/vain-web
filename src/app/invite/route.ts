import { redirect } from "next/navigation";

export async function GET() {
  return redirect(
    `https://discord.com/oauth2/authorize?client_id=1411409392334672013`
  );
}
