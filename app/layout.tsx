import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HVACflow - HVAC Management Software for Alberta Contractors',
  description: 'Professional HVAC management software built for 1-5 truck Alberta operations. Real-time GPS tracking, smart scheduling, automatic invoicing, refrigerant tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

## 🎯 SUMMARY - YOU NOW HAVE 5 FILES:

1. ✅ `/app/page.tsx` - Landing page with Supabase counter + Stripe payment
2. ✅ `/app/demo/page.tsx` - Complete 815-line demo with real map
3. ✅ `/package.json` - All dependencies including Supabase
4. ✅ `/app/globals.css` - Tailwind + Leaflet styles
5. ✅ `/app/layout.tsx` - Root layout with metadata

---

## 🚀 DEPLOYMENT STEPS:

### **1. Update All Files in GitHub:**
- Replace `/app/page.tsx`
- Replace `/app/demo/page.tsx`
- Replace `/package.json`
- Replace `/app/globals.css`
- Replace `/app/layout.tsx`

### **2. Commit:**
```
git add .
git commit -m "Complete HVACflow deployment with Supabase counter and real map"
git push
