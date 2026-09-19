# ColonyGames Database Schema Reference

## Collections Overview

### 1. `users`
Authentication credentials, role, and linked family mapping.
- `name`: String (Required)
- `email`: String (Unique, Indexed)
- `password`: String (Bcrypt hash)
- `role`: Enum `['resident', 'admin', 'volunteer']`
- `familyId`: ObjectId -> `families`
- `phone`: String

### 2. `families`
Household information and society tower allocations.
- `familyName`: String (e.g. "Verma Family")
- `houseNumber`: String (Flat / Villa number)
- `blockTower`: String (Tower A-F / Villas)
- `primaryContact`: Object `{ name, email, phone, emergencyContact }`
- `status`: Enum `['active', 'inactive']`

### 3. `participants`
Individual athletes and household family members.
- `familyId`: ObjectId -> `families`
- `fullName`: String
- `age`: Number
- `gender`: Enum `['Male', 'Female', 'Other']`
- `relation`: Enum `['Self', 'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Sibling', 'Other']`
- `tShirtSize`: Enum `['Kids-S', 'Kids-M', 'Kids-L', 'S', 'M', 'L', 'XL', 'XXL']`
- `medicalNotes`: String

### 4. `events`
Tournament sports catalog and scheduling.
- `title`: String
- `slug`: String (Unique, Indexed)
- `description`: String
- `category`: Enum `['Outdoor', 'Indoor', 'Kids', 'Fun', 'All Ages']`
- `sportType`: Enum `['individual', 'team']`
- `maxParticipants`: Number
- `minAge`: Number, `maxAge`: Number
- `genderAllowed`: Enum `['all', 'male_only', 'female_only', 'mixed']`
- `schedule`: String, `venue`: String

### 5. `registrations`
Official fest entries, athlete allocations, and digital entry pass.
- `registrationId`: String (Unique, e.g. `CG2026-TWR-A-042`)
- `familyId`: ObjectId -> `families`
- `events`: Array of allocated athletes and sports
- `status`: Enum `['confirmed', 'cancelled', 'pending']`
- `qrData`: String (Embedded verification payload)
- `waiverAccepted`: Boolean
- `checkIn`: Object `{ isCheckedIn, checkedInAt, gateNumber, checkedInBy }`

### 6. `results`
Tournament podium standings and medal counts.
- `eventId`: ObjectId -> `events`
- `sportName`: String
- `goldWinner`: Object `{ name, familyName, houseNumber }`
- `silverWinner`: Object `{ name, familyName, houseNumber }`
- `bronzeWinner`: Object `{ name, familyName, houseNumber }`
- `recordedBy`: String
