# MediConnect v2 — New Pages

## Files to copy into your project:

### src/pages/ (copy all):
- Dashboard.tsx          → replaces old one
- DoctorsPage.tsx        → NEW
- AppointmentsPage.tsx   → NEW
- ChatPage.tsx           → NEW
- ProfilePage.tsx        → NEW

### src/components/ (copy):
- SideNav.tsx            → replaces old one (now has all 6 nav items)

### src/ (copy):
- routes.tsx             → replaces old one (all routes added)

## No new npm installs needed — everything uses existing packages.

## Security added:
- Input sanitization on all forms (strips < > { })
- Date validation — cannot book past appointments
- Phone number format validation
- Name length validation
- Message length limit in chat (500 chars)
- All routes protected — login required
- Chat disclaimer warning (not real medical advice)
