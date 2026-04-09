import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { Plugin } from "vite";

function stripeApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: "stripe-api",
    configureServer(server) {
      server.middlewares.use(
        "/create-checkout-session",
        async (req: any, res: any) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end("Method Not Allowed");
            return;
          }

          let body = "";
          req.on("data", (chunk: Buffer) => (body += chunk.toString()));
          req.on("end", async () => {
            try {
              const { priceId, isCustom } = JSON.parse(body);
              const { default: Stripe } = await import("stripe");
              const stripe = new Stripe(env.STRIPE_SECRET_KEY);

              let session;

              if (isCustom) {
                session = await stripe.checkout.sessions.create({
                  payment_method_types: ["card"],
                  mode: "payment",
                  line_items: [
                    {
                      price_data: {
                        currency: "usd",
                        product_data: { name: "Custom Plan" },
                        unit_amount: 50000, // $500
                      },
                      quantity: 1,
                    },
                  ],
                  success_url: "http://localhost:8080/success",
                  cancel_url: "http://localhost:8080/cancel",
                });
              } else {
                session = await stripe.checkout.sessions.create({
                  payment_method_types: ["card"],
                  mode: "subscription",
                  line_items: [{ price: priceId, quantity: 1 }],
                  success_url: "http://localhost:8080/success",
                  cancel_url: "http://localhost:8080/cancel",
                });
              }

              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ url: session.url }));
            } catch (err: any) {
              console.error("Stripe error:", err.message);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        }
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), stripeApiPlugin(env)].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three') || id.includes('postprocessing')) {
              return 'vendor-three';
            }
            if (id.includes('lucide-react') || id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
};
});
