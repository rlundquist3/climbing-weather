import { APIContext, APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request, ...rest }) => {
  console.log({ ...rest });
  const { timezone } = await request.json();

  console.log("User timezone:", timezone);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
};
