# ColonyGames API Reference Documentation

## Base URL
`/api`

## Authentication
Session authentication is handled via the `auth_token` HttpOnly cookie or an optional `Authorization: Bearer <token>` header.

---

### Authentication Endpoints

#### POST `/api/auth/register`
Registers a new resident account and creates the linked family record.
- **Body**: `{ name, email, password, houseNumber, blockTower, phone }`
- **Response**: `201 Created` with user details and session cookie.

#### POST `/api/auth/login`
Authenticates resident or administrator.
- **Body**: `{ email, password }`
- **Response**: `200 OK` with user object and JWT cookie.

#### GET `/api/auth/me`
Fetches current authenticated session from cookie.
- **Response**: `200 OK` with user profile or `401 Unauthorized`.

#### POST `/api/auth/logout`
Clears session cookie.
- **Response**: `200 OK`.

---

### Tournament Events Endpoints

#### GET `/api/events`
Returns all scheduled sports events.
- **Query Params**: `?category=Outdoor&status=active`
- **Response**: `200 OK` array of event objects.

#### POST `/api/events` (Admin Only)
Creates a new sporting event.
- **Body**: `{ title, slug, description, category, maxParticipants, minAge, maxAge, schedule, venue }`

#### GET `/api/events/:id`
Returns single event details with participant count.

---

### Registrations & Passes Endpoints

#### POST `/api/registrations`
Submits a complete multi-step family registration.
- **Body**: `{ contact, family, members, allocations, waiverAccepted }`
- **Response**: `201 Created` with registrationId and pass metadata.

#### GET `/api/registrations/:id`
Fetches single registration record with athlete details.

#### GET `/api/registrations/:id/pdf`
Streams generated binary PDF entry pass with QR code and committee watermark.

#### POST `/api/registrations/:id/checkin` (Admin Only)
Validates entry pass and logs gate check-in timestamp.
- **Body**: `{ gateNumber, notes }`

---

### Analytics & Results Endpoints

#### GET `/api/results`
Returns tournament standings and podium medalists.

#### POST `/api/results` (Admin Only)
Records Gold, Silver, and Bronze winners for an event.

#### GET `/api/admin/stats` (Admin Only)
Returns aggregate metrics: total athletes, registrations, check-in completion rate, and event breakdown.

#### GET `/api/export` (Admin Only)
Exports tournament roster as CSV attachment.
