# Riepilogo Viaggi Autoarticolati

Weekly trip logging system for a traditional Italian trucking company. Digitizes a paper matrix tracking driver trips, routes, fuel consumption, and vehicle usage.

## Language

**Tripsheet**:
A weekly aggregate root. One per driver per truck per calendar week. Contains header metadata (driver name, truck license plate, starting/ending tachograph KM) and exactly seven DailyEntries (Monday–Sunday).
_Avoid_: Weekly log, trip report, foglio di viaggio

**Driver**:
A person who drives the truck for a week's trips. Identified internally by a database ID; presented by full name. A Driver can be assigned to multiple Tripsheets over time.
_Avoid_: Autista, conductor, employee

**Truck**:
A vehicle with a license plate (targa). Identified internally by a database ID; presented by its license plate. One Truck per Tripsheet.
_Avoid_: Camion, vehicle, autoarticolato

**Trailer**:
A towed unit with a license plate (targa rimorchio). Identified internally by a database ID; presented by its license plate. A DailyEntry may reference one or more Trailers.
_Avoid_: Rimorchio, semirimorchio, trailer

**Client**:
A company or customer that receives a shipment on a given day. Referenced by a DailyEntry. Identified internally by a database ID; presented by company name.
Carries a full profile: company name, street address, city, VAT number (partita IVA), and phone.
_Avoid_: Company, customer, cliente

**DailyEntry**:
A single day's record within a Tripsheet. Belongs exclusively to one Tripsheet — never exists independently. References a Client, one or more Trailers, ordered Stops, zero or more Fuelings, a day status (working/festa/ferie/riposo), and optional notes.
_Avoid_: Day row, giornata

**Stop**:
A leg of a route with a departure location (From) and arrival location (To), e.g., "Milan → Bologna". A DailyEntry has one or more ordered Stops forming the full route for that day.
_Avoid_: Tappa, leg, segment

**Fueling**:
A refueling event with liters and cost. A DailyEntry has zero or more Fuelings.
_Avoid_: Gasolio entry, rifornimento

**Company**:
An organization (azienda) that owns Drivers, Trucks, Trailers, Clients, and Tripsheets. Maps to Better Auth's `organization`. Carries a full profile: company name, street address, city, VAT number (partita IVA), and phone. Identified by a UUID.
_Avoid_: Azienda, org, tenant

**User**:
A person who can log in to the system. A `superadmin` flag grants cross-company access. Belongs to zero or more Companies via a membership with a Role. Maps to Better Auth's `user`.
_Avoid_: Utente, account

**Role**:
A label (`owner`, `admin`, or `member`) assigned to a User within a Company. `owner` is the company admin who can invite/manage employees and transfer ownership. `admin` can manage most settings. `member` has read/write access to tripsheets and entities.
_Avoid_: Ruolo, permission
