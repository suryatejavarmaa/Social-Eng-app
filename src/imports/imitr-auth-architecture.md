🎯 IMITR – New Phone-Based Authentication Architecture

(Without One-Time Login System)

🔐 CORE PRINCIPLE

Phone Number = Primary Identity

OTP = First-Level Authentication

Role-Based Access = Controlled by Backend

No manual credential sharing

No auto-generated login IDs

No pre-generated passwords

👑 1️⃣ SUPER ADMIN CREATES CREATOR ADMIN
Creation Flow (Super Admin Panel)

Super Admin enters:

Admin Name

Admin Phone Number

Territory (optional)

Commission structure (optional)

Clicks: Create Admin

Backend Action

System stores:

{
  phoneNumber: "9876543210",
  name: "Suresh Kumar",
  role: "ADMIN",
  createdBy: "SUPER_ADMIN_ID",
  isApproved: true,
  profileCompleted: false
}

No password generated.
No OTP sent at creation.

📱 2️⃣ ADMIN LOGIN FLOW (PHONE + OTP)
Step 1: Admin enters phone number

If phone exists AND role = ADMIN:

→ Send OTP

If phone exists BUT role ≠ ADMIN:

→ Show popup:

"Access restricted. This login is available for Creator Admin accounts only."

If phone not found:

→ Show:

"Admin account not found. Contact Super Admin."

Step 2: OTP Verification

If OTP valid:

Check:

profileCompleted?

If false:
→ Redirect to Profile Setup

If true:
→ Redirect to Admin Dashboard

Step 3: First-Time Profile Setup (Admin)

Admin sets:

Display Name

Email (optional)

Profile Photo

Optional Password (optional future login method)

After save:

profileCompleted: true

Notification sent to:

Super Admin → "Admin profile activated"

Admin → "Welcome to IMITR Admin Panel"

👤 3️⃣ ADMIN CREATES USER
Admin Panel → Create User

Admin enters:

User Name

User Phone Number

Clicks: Create User

Backend Stores:
{
  phoneNumber: "9123456780",
  name: "Rajesh",
  role: "USER",
  createdByAdmin: "ADMIN_ID",
  profileCompleted: false
}

No OTP yet.

👤 4️⃣ USER LOGIN FLOW
Step 1: User enters phone number

System checks:

CASE A — Phone exists & role = USER
→ Send OTP

CASE B — Phone exists & role = ADMIN
→ Show: "Please login via Admin Portal"

CASE C — Phone exists & role = CELEBRITY
→ Show: "Please login via Celebrity Portal"

CASE D — Phone not found
→ Redirect to Sign Up

Step 2: OTP Verification

If first login:

→ Profile Setup

If returning user:

→ User Dashboard

Step 3: First-Time Profile Setup (User)

User sets:

Username

Profile photo

Interests

Gender (optional)

Wallet auto-links to:

Admin Name: Visible in Wallet
Admin Territory: Visible
Admin Support Contact: Visible

Notification sent to:

Admin → "New user activated under your network"

User → "Welcome to IMITR"

⭐ 5️⃣ SUPER ADMIN CREATES CELEBRITY
Super Admin Panel → Add Celebrity

Enter:

Celebrity Name

Celebrity Phone Number

Category

Commission % (if applicable)

Click Create

Stored as:

{
  phoneNumber: "9988776655",
  role: "CELEBRITY",
  isApproved: false,
  profileCompleted: false
}
Optional Approval Flow

Super Admin can:

Send approval request notification

Celebrity receives SMS:
"You have been invited to join IMITR as a Verified Celebrity"

⭐ 6️⃣ CELEBRITY LOGIN FLOW

Celebrity enters phone number.

If phone exists & role = CELEBRITY:

→ Send OTP

If phone exists but role ≠ CELEBRITY:

→ Show restricted popup

If not registered:

→ "Celebrity account not found"

After OTP:

If first login:
→ Profile setup

After setup:
→ Celebrity Dashboard

Notification sent to:

Super Admin

Assigned Admin (if applicable)

🔔 7️⃣ NOTIFICATION SYSTEM RULES

Whenever:

Admin created → Notify Super Admin
Admin activated → Notify Super Admin
User created → Notify Admin
User activated → Notify Admin
Celebrity activated → Notify Super Admin
Withdraw request → Notify Admin
Settlement → Notify Super Admin

Everything visible in:

Notification panel

Audit logs

🧠 ROLE-BASED LOGIN ARCHITECTURE

Instead of separate login screens, you can also do:

Single Phone Login Screen:

User enters phone
Backend detects role
System routes to correct dashboard

Cleaner. Modern. Scalable.

🏗 DATABASE STRUCTURE SIMPLIFIED

Users Table:

id

phoneNumber

role (USER | ADMIN | CELEBRITY | SUPER_ADMIN)

createdBy

profileCompleted

isApproved

walletBalance

diamonds

status (active / blocked)

No loginId.
No one-time password stored.
No permanent password required unless optional.

🎯 Why This Is Better

✅ Mobile-first
✅ Scales to 1 lakh users
✅ No credential confusion
✅ No support burden
✅ Cleaner backend
✅ Lower friction
✅ Higher conversion
✅ Easier investor explanation

🔥 Final Architecture Summary

Super Admin
↓
Creates Admin (Phone-based)
↓
Admin creates Users (Phone-based)
↓
All logins via OTP
↓
Role-based routing
↓
Profile completion on first login

🏆 My Honest Opinion

This new structure is:

Much cleaner
Production ready
Scalable
Investor-friendly
Operationally simpler

Your earlier system = enterprise complexity.
This one = scalable consumer fintech model.