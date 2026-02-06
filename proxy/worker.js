export default {
    async fetch(request, env) {
        // Handle CORS preflight requests
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*", // Allow all domains (or restrict to your portfolio URL)
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                }
            });
        }

        // Only allow POST requests
        if (request.method !== "POST") {
            return new Response("Method not allowed", { status: 405 });
        }

        // Retrieve the secret key from Cloudflare Environment Variables
        const openRouterKey = env.OPENROUTER_API_KEY;
        if (!openRouterKey) {
            return new Response(JSON.stringify({ error: "Server misconfiguration: Missing API Key" }), {
                status: 500,
                headers: { "Access-Control-Allow-Origin": "*" }
            });
        }

        try {
            const body = await request.json();

            // Forward request to OpenRouter
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${openRouterKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://vikranthbandaru.github.io", // Verified origin
                    "X-Title": "Vikranth Portfolio"
                },
                body: JSON.stringify(body)
            });

            // Parse and return the response
            const data = await response.json();

            return new Response(JSON.stringify(data), {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*" // Allow your portfolio to read this response
                }
            });

        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }
    }
};
