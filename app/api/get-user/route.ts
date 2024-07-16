import { getUser } from "@server/utils/get-user";

// We created this POST request route to workaround prisma not working in
// the middleware due to edge
export async function POST(req: Request) {
  const { appApiKey, userId } = await req.json();

  if (!appApiKey || appApiKey !== process.env.APP_API_KEY || !userId) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await getUser(userId);

  return Response.json(user);
}
