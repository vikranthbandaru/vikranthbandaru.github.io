export default {
    async fetch(request, env) {
        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };

        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // Only allow POST
        if (request.method !== "POST") {
            return new Response("Method not allowed", { status: 405, headers: corsHeaders });
        }

        // Origin validation
        const origin = request.headers.get("Origin") || "";
        const referer = request.headers.get("Referer") || "";
        const allowedOrigins = [
            "vikranthbandaru.github.io",
            "localhost",
            "127.0.0.1"
        ];
        const isAllowed = allowedOrigins.some(o => origin.includes(o) || referer.includes(o));
        if (!isAllowed && origin !== "") {
            return new Response(JSON.stringify({ error: "Unauthorized origin" }), {
                status: 403,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // Rate limiting (simple per-IP, using KV or in-memory)
        const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
        const rateLimitKey = `ratelimit:${clientIP}`;

        if (env.RATE_LIMIT_KV) {
            const count = parseInt(await env.RATE_LIMIT_KV.get(rateLimitKey) || "0");
            if (count >= 30) { // Max 30 requests per minute per IP
                return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a minute." }), {
                    status: 429,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }
            await env.RATE_LIMIT_KV.put(rateLimitKey, String(count + 1), { expirationTtl: 60 });
        }

        // API Key
        const openRouterKey = env.OPENROUTER_API_KEY;
        if (!openRouterKey) {
            return new Response(JSON.stringify({ error: "Server misconfiguration: Missing API Key" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        try {
            const body = await request.json();

            // Enforce curated model list server-side
            const allowedModels = [
                "google/gemini-2.5-flash:free",
                "meta-llama/llama-4-maverick:free",
                "google/gemma-3-27b-it:free",
                "mistralai/mistral-small-3.1-24b-instruct:free"
            ];

            // Use client's model if it's in the allowed list, otherwise default
            if (!body.model || !allowedModels.includes(body.model)) {
                body.model = allowedModels[0];
            }

            // Enforce max tokens
            body.max_tokens = Math.min(body.max_tokens || 500, 800);

            // Forward to OpenRouter
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${openRouterKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://vikranthbandaru.github.io",
                    "X-Title": "Vikranth Portfolio Chatbot"
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            return new Response(JSON.stringify(data), {
                status: response.status,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });

        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }
    }
};
