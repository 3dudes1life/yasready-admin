export async function onRequest(context) {
  const request = context.request;
  const token =
    request.headers.get("Cf-Access-Jwt-Assertion") ||
    request.headers.get("cf-access-jwt-assertion");

  if (!token) {
    return new Response(JSON.stringify({
      error: "missing_access_assertion",
      message: "Cloudflare Access did not forward an application token to this protected page."
    }), {
      status: 401,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}
