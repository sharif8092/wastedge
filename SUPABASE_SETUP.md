# ⚡ Supabase Integration & Provisioning Guide

This document assists developers with setting up the remote database backends on Supabase for **Wasteage Solution**.

---

## 📅 Initial Installation Flow

### 1. Cloud Database Creation
1. Go to the [Supabase Dashboard](https://supabase.com).
2. Click **New Project** and allocate it to your closest database region (e.g., `ap-south-1` for Indian users).
3. Assign a robust security password and save it securely.

### 2. Table Schemas Configuration
1. Open the **SQL Editor** tab in the left-hand navigation pane.
2. Click **New Query** to instantiate a blank workspace.
3. Open `DATABASE_SCHEMA.sql` located inside the root project directory, copy the complete script, and paste it into the Supabase editor.
4. Click **Run** to execute. Verify that all 5 tables (`profiles`, `vendors`, `categories`, `pickup_requests`, `notifications`) build successfully.

---

## 🔒 Row-Level Security Verification (RLS)

Safety is highly enforced. Our database schema implements strict rules regarding data isolation:

- **Customers** are prevented from reading or viewing other customers' requests or contact details.
- **Vendors** can query requests located only in their assigned tasks panel.
- **Admins** maintain a global view across all customer directory profiles and dispatch operations.

To inspect RLS settings, browse the **Database -> Policies** view in the Supabase workspace. Ensure that ALL 5 tables are protected.

---

## 🔌 Web Application Settings

Enable the connection by configuring the local runtime environment variable keys inside your production server details:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"
```

For server actions or route protection, the application references standard credentials directly from Supabase Authentication Metadata.
