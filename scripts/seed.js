import postgres from "postgres";

const COMPANY_ID = "seed-company-001";
const sql = postgres("postgres://app:devpassword@localhost:5433/riepilogo");

await sql`
  INSERT INTO companies (id, name, address, city, vat, phone) VALUES
    (${COMPANY_ID}, 'Azienda Seed', 'Via Roma 1', 'Milano', 'IT12345678901', '+39 02 1234567')
  ON CONFLICT (id) DO NOTHING
`;

await sql`
  INSERT INTO drivers (company_id, name) VALUES
    (${COMPANY_ID}, 'Mario Rossi'),
    (${COMPANY_ID}, 'Giuseppe Verdi'),
    (${COMPANY_ID}, 'Franco Bianchi')
`;

await sql`
  INSERT INTO trucks (company_id, license_plate) VALUES
    (${COMPANY_ID}, 'AB123CD'),
    (${COMPANY_ID}, 'EF456GH'),
    (${COMPANY_ID}, 'IL789MN')
`;

await sql`
  INSERT INTO trailers (company_id, license_plate) VALUES
    (${COMPANY_ID}, 'TR001XY'),
    (${COMPANY_ID}, 'TR002ZA'),
    (${COMPANY_ID}, 'TR003BC')
`;

await sql`
  INSERT INTO clients (company_id, name, address, city, vat, phone) VALUES
    (${COMPANY_ID}, 'Kortimed', 'Via Roma 10', 'Milano', 'IT01234567890', '+39 02 1234567'),
    (${COMPANY_ID}, 'Eurotransport', 'Corso Italia 55', 'Torino', 'IT09876543210', '+39 011 7654321'),
    (${COMPANY_ID}, 'Logistica Italia', 'Piazza Duomo 1', 'Firenze', 'IT0555666777', '+39 055 8888888'),
    (${COMPANY_ID}, 'Trasporti Nord', 'Via Garibaldi 22', 'Bologna', 'IT0111222333', '+39 051 9999999'),
    (${COMPANY_ID}, 'Merci Sud', 'Corso Umberto 33', 'Napoli', 'IT0444555666', '+39 081 7777777')
`;

console.log("Seed completed.");
await sql.end();
