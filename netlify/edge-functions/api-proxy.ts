/**
 * Netlify Edge Function: API Proxy
 * This function proxies requests from /api/* to the AWS Lambda backend.
 * It provides better control over headers (like Content-Type casing) 
 * and avoids common issues with standard Netlify redirects for complex APIs.
 */

export default async (request: Request) => {
  const url = new URL(request.url);
  
  // Define target backend details
  const targetHost = "gps6cdg7h9.execute-api.eu-central-1.amazonaws.com";
  // Rewrite /api/* to /prod/* for the AWS Lambda endpoint
  const targetPath = url.pathname.replace(/^\/api/, "/prod");
  const targetUrl = `https://${targetHost}${targetPath}${url.search}`;
  
  console.log(`Proxying ${request.method} ${url.pathname} to ${targetUrl}`);

  // Clone headers and specifically set the ones that need precise casing
  const headers = new Headers(request.headers);
  headers.set("Host", targetHost);
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  const options: RequestInit = {
    method: request.method,
    headers: headers,
    cache: "no-cache",
  };

  // Only include body for methods that support it
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    // Read the body fully to avoid sending 'Transfer-Encoding: chunked'
    // which AWS API Gateway might reject or fail to handle properly.
    options.body = await request.text();
  }

  try {
    const response = await fetch(targetUrl, options);
    
    // Create a new response to ensure we can modify it if needed
    // or just return the response directly.
    return response;
  } catch (error) {
    console.error("Edge Proxy Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Edge Proxy Error", 
        message: (error as Error).message,
        path: targetPath 
      }), 
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const config = {
  path: "/api/*",
};
