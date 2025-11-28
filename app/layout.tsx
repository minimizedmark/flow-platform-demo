19:23:30.466 Running build in Washington, D.C., USA (East) – iad1
19:23:30.467 Build machine configuration: 4 cores, 8 GB
19:23:30.558 Cloning github.com/minimizedmark/flow-platform-demo (Branch: main, Commit: 2d6dadd)
19:23:30.559 Previous build caches not available.
19:23:30.750 Cloning completed: 192.000ms
19:23:31.068 Running "vercel build"
19:23:31.472 Vercel CLI 48.12.0
19:23:31.776 Installing dependencies...
19:23:43.908 
19:23:43.908 added 121 packages in 12s
19:23:43.908 
19:23:43.908 24 packages are looking for funding
19:23:43.909   run `npm fund` for details
19:23:43.957 Detected Next.js version: 14.0.4
19:23:43.961 Running "npm run build"
19:23:44.075 
19:23:44.075 > hvacflow-demo@0.1.0 build
19:23:44.075 > next build
19:23:44.075 
19:23:44.590 Attention: Next.js now collects completely anonymous telemetry regarding usage.
19:23:44.590 This information is used to shape Next.js' roadmap and prioritize features.
19:23:44.590 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
19:23:44.591 https://nextjs.org/telemetry
19:23:44.591 
19:23:44.668    ▲ Next.js 14.0.4
19:23:44.668 
19:23:44.668    Creating an optimized production build ...
19:23:47.129 Failed to compile.
19:23:47.130 
19:23:47.130 ./app/layout.tsx
19:23:47.130 Error: 
19:23:47.130   [31mx[0m `package` cannot be used as an identifier in strict mode
19:23:47.130     ,-[[36;1;4m/vercel/path0/app/layout.tsx[0m:25:1]
19:23:47.130  [2m25[0m | 
19:23:47.130  [2m26[0m | 1. ✅ `/app/page.tsx` - Landing page with Supabase counter + Stripe payment
19:23:47.130  [2m27[0m | 2. ✅ `/app/demo/page.tsx` - Complete 815-line demo with real map
19:23:47.131  [2m28[0m | 3. ✅ `/package.json` - All dependencies including Supabase
19:23:47.131     : [31;1m         ^^^^^^^[0m
19:23:47.131  [2m29[0m | 4. ✅ `/app/globals.css` - Tailwind + Leaflet styles
19:23:47.131  [2m30[0m | 5. ✅ `/app/layout.tsx` - Root layout with metadata
19:23:47.131     `----
19:23:47.131 
19:23:47.131   [31mx[0m `package` cannot be used as an identifier in strict mode
19:23:47.131     ,-[[36;1;4m/vercel/path0/app/layout.tsx[0m:36:1]
19:23:47.131  [2m36[0m | ### **1. Update All Files in GitHub:**
19:23:47.131  [2m37[0m | - Replace `/app/page.tsx`
19:23:47.131  [2m38[0m | - Replace `/app/demo/page.tsx`
19:23:47.131  [2m39[0m | - Replace `/package.json`
19:23:47.131     : [31;1m            ^^^^^^^[0m
19:23:47.132  [2m40[0m | - Replace `/app/globals.css`
19:23:47.132  [2m41[0m | - Replace `/app/layout.tsx`
19:23:47.132     `----
19:23:47.132 
19:23:47.132   [31mx[0m Expected ';', '}' or <eof>
19:23:47.132     ,-[[36;1;4m/vercel/path0/app/layout.tsx[0m:42:1]
19:23:47.132  [2m42[0m | 
19:23:47.132  [2m43[0m | ### **2. Commit:**
19:23:47.132  [2m44[0m | ```
19:23:47.132  [2m45[0m | git add .
19:23:47.132     : [31;1m^|^[0m[33;1m ^^^[0m
19:23:47.132     :  [31;1m`-- [31;1mThis is the expression part of an expression statement[0m[0m
19:23:47.132  [2m46[0m | git commit -m "Complete HVACflow deployment with Supabase counter and real map"
19:23:47.132  [2m47[0m | git push
19:23:47.132     `----
19:23:47.133 
19:23:47.133 Caused by:
19:23:47.133     Syntax Error
19:23:47.133 
19:23:47.133 Import trace for requested module:
19:23:47.133 ./app/layout.tsx
19:23:47.133 
19:23:47.133 
19:23:47.133 > Build failed because of webpack errors
19:23:47.166 Error: Command "npm run build" exited with 1
