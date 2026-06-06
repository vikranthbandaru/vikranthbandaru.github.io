export default {
    async fetch(request, env) {
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        if (request.method !== "POST") {
            return new Response("Method not allowed", { status: 405, headers: corsHeaders });
        }

        const openRouterKey = env.OPENROUTER_API_KEY;
        if (!openRouterKey) {
            return new Response(JSON.stringify({ error: "Server misconfiguration: Missing API Key" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        try {
            const body = await request.json();

            // Enforce max tokens to prevent abuse
            body.max_tokens = Math.min(body.max_tokens || 500, 800);

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
