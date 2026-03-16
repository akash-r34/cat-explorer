import type { Config, Context } from "@netlify/functions";
import * as https from "https";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const targetHost = "gps6cdg7h9.execute-api.eu-central-1.amazonaws.com";
  
  // Rewrite /api/* to /prod/* for AWS Lambda endpoint
  const targetPath = url.pathname.replace(/^\/api/, "/prod");

  // Read the body fully if present
  let bodyText = "";
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    bodyText = await req.text();
  }

  return new Promise<Response>((resolve) => {
    const options: https.RequestOptions = {
      hostname: targetHost,
      port: 443,
      path: `${targetPath}${url.search}`,
      method: req.method,
      headers: {
        // EXACT CASING REQUIRED BY BACKEND
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    };

    if (bodyText) {
      options.headers!["Content-Length"] = Buffer.byteLength(bodyText);
    }

    const proxyReq = https.request(options, (proxyRes) => {
      let responseData = "";
      proxyRes.on("data", (chunk) => {
        responseData += chunk;
      });

      proxyRes.on("end", () => {
        // Filter out hop-by-hop or problematic AWS response headers if necessary
        // but passing standard headers back is usually fine.
        resolve(new Response(responseData, {
          status: proxyRes.statusCode,
          headers: {
            "Content-Type": proxyRes.headers["content-type"] || "application/json"
          }
        }));
      });
    });

    proxyReq.on("error", (e) => {
      console.error("Proxy Error:", e);
      resolve(
        new Response(JSON.stringify({ error: "Node Proxy Error", message: e.message }), {
          status: 502,
          headers: { "Content-Type": "application/json" }
        })
      );
    });

    if (bodyText) {
      proxyReq.write(bodyText);
    }
    proxyReq.end();
  });
};

export const config: Config = {
  path: "/api/*"
};
