// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/Projects/titon-main/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Projects/titon-main/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
var __vite_injected_original_dirname = "D:\\Projects\\titon-main";
function stripeApiPlugin(env) {
  return {
    name: "stripe-api",
    configureServer(server) {
      server.middlewares.use(
        "/api/checkout",
        async (req, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end("Method Not Allowed");
            return;
          }
          let body = "";
          req.on("data", (chunk) => body += chunk.toString());
          req.on("end", async () => {
            try {
              const { priceId, isCustom } = JSON.parse(body);
              const { default: Stripe } = await import("file:///D:/Projects/titon-main/node_modules/stripe/esm/stripe.esm.node.js");
              const stripe = new Stripe(env.STRIPE_SECRET_KEY);
              let session;
              if (isCustom) {
                const { entries } = JSON.parse(body);
                const entryCount = parseInt(entries) || 1e3;
                const unitAmount = Math.round(entryCount * 0.18 * 100);
                session = await stripe.checkout.sessions.create({
                  payment_method_types: ["card"],
                  mode: "payment",
                  line_items: [
                    {
                      price_data: {
                        currency: "usd",
                        product_data: {
                          name: `Neural Sector Custom Expansion`,
                          description: `Operational capacity: ${entryCount.toLocaleString()} units.`
                        },
                        unit_amount: unitAmount
                      },
                      quantity: 1
                    }
                  ],
                  success_url: `${env.VITE_SITE_URL || "http://localhost:8080"}/success?session_id={CHECKOUT_SESSION_ID}&entries=${entryCount}`,
                  cancel_url: `${env.VITE_SITE_URL || "http://localhost:8080"}/cancel`
                });
              } else {
                session = await stripe.checkout.sessions.create({
                  payment_method_types: ["card"],
                  mode: "subscription",
                  line_items: [{ price: priceId, quantity: 1 }],
                  success_url: `${env.VITE_SITE_URL || "http://localhost:8080"}/success?session_id={CHECKOUT_SESSION_ID}`,
                  cancel_url: `${env.VITE_SITE_URL || "http://localhost:8080"}/cancel`
                });
              }
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ url: session.url }));
            } catch (err) {
              console.error("Stripe error:", err.message);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        }
      );
      server.middlewares.use(
        "/api/webhook",
        async (req, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end("Method Not Allowed");
            return;
          }
          let body = "";
          req.on("data", (chunk) => body += chunk.toString());
          req.on("end", () => {
            try {
              const event = JSON.parse(body);
              console.log(`[Stripe Webhook Dev] Received event: ${event.type}`);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ received: true }));
            } catch (err) {
              console.error("[Stripe Webhook Dev] Error parsing webhook body");
              res.statusCode = 400;
              res.end("Invalid JSON");
            }
          });
        }
      );
    }
  };
}
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false
      }
    },
    plugins: [react(), stripeApiPlugin(env)].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("three") || id.includes("@react-three") || id.includes("postprocessing")) {
                return "vendor-three";
              }
              if (id.includes("lucide-react") || id.includes("@radix-ui")) {
                return "vendor-ui";
              }
              if (id.includes("gsap") || id.includes("framer-motion")) {
                return "vendor-animation";
              }
              if (id.includes("@supabase") || id.includes("stripe")) {
                return "vendor-services";
              }
              return "vendor";
            }
          }
        }
      },
      chunkSizeWarningLimit: 2e3
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFx0aXRvbi1tYWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFx0aXRvbi1tYWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Qcm9qZWN0cy90aXRvbi1tYWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tIFwidml0ZVwiO1xyXG5cclxuZnVuY3Rpb24gc3RyaXBlQXBpUGx1Z2luKGVudjogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFBsdWdpbiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6IFwic3RyaXBlLWFwaVwiLFxyXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xyXG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKFxyXG4gICAgICAgIFwiL2FwaS9jaGVja291dFwiLFxyXG4gICAgICAgIGFzeW5jIChyZXE6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChyZXEubWV0aG9kICE9PSBcIlBPU1RcIikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwNTtcclxuICAgICAgICAgICAgcmVzLmVuZChcIk1ldGhvZCBOb3QgQWxsb3dlZFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxldCBib2R5ID0gXCJcIjtcclxuICAgICAgICAgIHJlcS5vbihcImRhdGFcIiwgKGNodW5rOiBCdWZmZXIpID0+IChib2R5ICs9IGNodW5rLnRvU3RyaW5nKCkpKTtcclxuICAgICAgICAgIHJlcS5vbihcImVuZFwiLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgeyBwcmljZUlkLCBpc0N1c3RvbSB9ID0gSlNPTi5wYXJzZShib2R5KTtcclxuICAgICAgICAgICAgICBjb25zdCB7IGRlZmF1bHQ6IFN0cmlwZSB9ID0gYXdhaXQgaW1wb3J0KFwic3RyaXBlXCIpO1xyXG4gICAgICAgICAgICAgIGNvbnN0IHN0cmlwZSA9IG5ldyBTdHJpcGUoZW52LlNUUklQRV9TRUNSRVRfS0VZKTtcclxuXHJcbiAgICAgICAgICAgICAgbGV0IHNlc3Npb247XHJcblxyXG4gICAgICAgICAgICAgIGlmIChpc0N1c3RvbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeyBlbnRyaWVzIH0gPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZW50cnlDb3VudCA9IHBhcnNlSW50KGVudHJpZXMpIHx8IDEwMDA7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1bml0QW1vdW50ID0gTWF0aC5yb3VuZChlbnRyeUNvdW50ICogMC4xOCAqIDEwMCk7IC8vIDAuMTggcGVyIGVudHJ5IGluIGNlbnRzXHJcblxyXG4gICAgICAgICAgICAgICAgc2Vzc2lvbiA9IGF3YWl0IHN0cmlwZS5jaGVja291dC5zZXNzaW9ucy5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgICBwYXltZW50X21ldGhvZF90eXBlczogW1wiY2FyZFwiXSxcclxuICAgICAgICAgICAgICAgICAgbW9kZTogXCJwYXltZW50XCIsXHJcbiAgICAgICAgICAgICAgICAgIGxpbmVfaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBwcmljZV9kYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbmN5OiBcInVzZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0X2RhdGE6IHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYE5ldXJhbCBTZWN0b3IgQ3VzdG9tIEV4cGFuc2lvbmAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGBPcGVyYXRpb25hbCBjYXBhY2l0eTogJHtlbnRyeUNvdW50LnRvTG9jYWxlU3RyaW5nKCl9IHVuaXRzLmAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRfYW1vdW50OiB1bml0QW1vdW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NfdXJsOiBgJHtlbnYuVklURV9TSVRFX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJ30vc3VjY2Vzcz9zZXNzaW9uX2lkPXtDSEVDS09VVF9TRVNTSU9OX0lEfSZlbnRyaWVzPSR7ZW50cnlDb3VudH1gLFxyXG4gICAgICAgICAgICAgICAgICBjYW5jZWxfdXJsOiBgJHtlbnYuVklURV9TSVRFX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJ30vY2FuY2VsYCxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZXNzaW9uID0gYXdhaXQgc3RyaXBlLmNoZWNrb3V0LnNlc3Npb25zLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgIHBheW1lbnRfbWV0aG9kX3R5cGVzOiBbXCJjYXJkXCJdLFxyXG4gICAgICAgICAgICAgICAgICBtb2RlOiBcInN1YnNjcmlwdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICBsaW5lX2l0ZW1zOiBbeyBwcmljZTogcHJpY2VJZCwgcXVhbnRpdHk6IDEgfV0sXHJcbiAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NfdXJsOiBgJHtlbnYuVklURV9TSVRFX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJ30vc3VjY2Vzcz9zZXNzaW9uX2lkPXtDSEVDS09VVF9TRVNTSU9OX0lEfWAsXHJcbiAgICAgICAgICAgICAgICAgIGNhbmNlbF91cmw6IGAke2Vudi5WSVRFX1NJVEVfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjgwODAnfS9jYW5jZWxgLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgdXJsOiBzZXNzaW9uLnVybCB9KSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlN0cmlwZSBlcnJvcjpcIiwgZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xyXG4gICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogZXJyLm1lc3NhZ2UgfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcblxyXG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKFxyXG4gICAgICAgIFwiL2FwaS93ZWJob29rXCIsXHJcbiAgICAgICAgYXN5bmMgKHJlcTogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHJlcS5tZXRob2QgIT09IFwiUE9TVFwiKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDA1O1xyXG4gICAgICAgICAgICByZXMuZW5kKFwiTWV0aG9kIE5vdCBBbGxvd2VkXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbGV0IGJvZHkgPSBcIlwiO1xyXG4gICAgICAgICAgcmVxLm9uKFwiZGF0YVwiLCAoY2h1bms6IEJ1ZmZlcikgPT4gKGJvZHkgKz0gY2h1bmsudG9TdHJpbmcoKSkpO1xyXG4gICAgICAgICAgcmVxLm9uKFwiZW5kXCIsICgpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBjb25zdCBldmVudCA9IEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtTdHJpcGUgV2ViaG9vayBEZXZdIFJlY2VpdmVkIGV2ZW50OiAke2V2ZW50LnR5cGV9YCk7XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHJlY2VpdmVkOiB0cnVlIH0pKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltTdHJpcGUgV2ViaG9vayBEZXZdIEVycm9yIHBhcnNpbmcgd2ViaG9vayBib2R5XCIpO1xyXG4gICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAwO1xyXG4gICAgICAgICAgICAgIHJlcy5lbmQoXCJJbnZhbGlkIEpTT05cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgXCJcIik7XHJcbiAgcmV0dXJuIHtcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBob3N0OiBcIjo6XCIsXHJcbiAgICAgIHBvcnQ6IDgwODAsXHJcbiAgICAgIGhtcjoge1xyXG4gICAgICAgIG92ZXJsYXk6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCBzdHJpcGVBcGlQbHVnaW4oZW52KV0uZmlsdGVyKEJvb2xlYW4pLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3RocmVlJykgfHwgaWQuaW5jbHVkZXMoJ0ByZWFjdC10aHJlZScpIHx8IGlkLmluY2x1ZGVzKCdwb3N0cHJvY2Vzc2luZycpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItdGhyZWUnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbHVjaWRlLXJlYWN0JykgfHwgaWQuaW5jbHVkZXMoJ0ByYWRpeC11aScpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItdWknO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZ3NhcCcpIHx8IGlkLmluY2x1ZGVzKCdmcmFtZXItbW90aW9uJykpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1hbmltYXRpb24nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnQHN1cGFiYXNlJykgfHwgaWQuaW5jbHVkZXMoJ3N0cmlwZScpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3Itc2VydmljZXMnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMjAwMCxcclxuICB9LFxyXG59O1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwUCxTQUFTLGNBQWMsZUFBZTtBQUNoUyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBS3pDLFNBQVMsZ0JBQWdCLEtBQXFDO0FBQzVELFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLGdCQUFnQixRQUFRO0FBQ3RCLGFBQU8sWUFBWTtBQUFBLFFBQ2pCO0FBQUEsUUFDQSxPQUFPLEtBQVUsUUFBYTtBQUM1QixjQUFJLElBQUksV0FBVyxRQUFRO0FBQ3pCLGdCQUFJLGFBQWE7QUFDakIsZ0JBQUksSUFBSSxvQkFBb0I7QUFDNUI7QUFBQSxVQUNGO0FBRUEsY0FBSSxPQUFPO0FBQ1gsY0FBSSxHQUFHLFFBQVEsQ0FBQyxVQUFtQixRQUFRLE1BQU0sU0FBUyxDQUFFO0FBQzVELGNB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
