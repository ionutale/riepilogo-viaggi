import { z } from "zod";
import type { DayStatus } from "$lib/types";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const CompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  address: z.string().optional().default(""),
  city: z.string().optional().default(""),
  vat: z.string().optional().default(""),
  phone: z.string().optional().default(""),
});

export const TruckSchema = z.object({
  licensePlate: z.string().min(1, "License plate is required").transform((s) => s.toUpperCase()),
});

export const TrailerSchema = z.object({
  licensePlate: z.string().min(1, "License plate is required").transform((s) => s.toUpperCase()),
});

export const DriverSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const ClientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  address: z.string().optional().default(""),
  city: z.string().optional().default(""),
  vat: z.string().optional().default(""),
  phone: z.string().optional().default(""),
});

const StopSchema = z.object({
  fromLocation: z.string(),
  toLocation: z.string(),
});

const FuelingSchema = z.object({
  liters: z.string(),
  cost: z.string(),
});

export const TripsheetHeaderSchema = z.object({
  driverId: z.number(),
  truckId: z.number(),
  startKm: z.number().min(0),
  endKm: z.number().min(0),
});

export const DailyEntryPayloadSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  dayStatus: z.string(),
  clientId: z.number().nullable().optional(),
  dailyKm: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  stops: z.array(StopSchema),
  fuelings: z.array(FuelingSchema),
});

export const TripsheetPayloadSchema = z.object({
  header: TripsheetHeaderSchema,
  days: z.array(DailyEntryPayloadSchema),
});
