# How to Deploy Your Secure Chatbot Backend

To make your chatbot work on the live site securely, you need to deploy the "backend proxy" we just created. This takes about 5 minutes and is completely free.

## Step 1: Set up Cloudflare Worker
1.  Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) and sign up/log in.
2.  Navigate to **Workers & Pages** > **Create Application**.
3.  Click **Create Worker**.
4.  Name it something like `portfolio-chat-proxy` and click **Deploy**.

## Step 2: Add Your Code
1.  Click **Edit Code**.
2.  Delete the existing code in `worker.js`.
3.  Copy and paste the code from `proxy/worker.js` (in your project folder).
4.  Click **Save and Deploy**.

## Step 3: Add Your Secret Key
1.  Go back to the Worker's **Settings** tab.
2.  Click **Variables and Secrets**.
3.  Click **Add**.
4.  Set the name to: `OPENROUTER_API_KEY`
5.  Set the value to your **API Key** (starting with `sk-or-v1...`).
6.  Click **Deploy** (or Save and Deploy) to apply changes.

## Step 4: Connect Your Portfolio
1.  Copy your Worker's URL (e.g., `https://portfolio-chat-proxy.yourname.workers.dev`).
2.  Open `config.js` in your project folder.
3.  Update it to use the `backendUrl` instead of the key:

```javascript
const CHATBOT_SECRETS = {
    // openRouterKey: "...", // COMMENT THIS OUT
    backendUrl: "https://portfolio-chat-proxy.yourname.workers.dev" // ADD THIS
};
```

4.  **Important**: Because `config.js` is ignored by git, you must manually perform this update for yourself locally.
5.  **For the Live Site**: Since `config.js` is not uploaded, you have two options:
    *   **Option A (Recommended)**: Edit `script.js` directly to put the `backendUrl` as a fallback (since the URL itself is not a secret, it's safe to expose!).
    *   **Option B**: Manually upload `config.js` (with ONLY the `backendUrl` inside) to GitHub.

## Final Check
Your `script.js` has been updated to automatically look for `backendUrl`. Once you deploy the worker and update the URL, it will work!
