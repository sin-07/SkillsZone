import { z } from 'zod';

export const personalStepSchema = z.object({
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().min(10, 'Please enter a valid 10-digit phone number'),
  emergencyContact: z.string().optional(),
});

export const familyStepSchema = z.object({
  familyName: z.string().min(2, 'Family name is required (e.g. Sharma Family)'),
  houseNumber: z.string().min(1, 'Flat or Villa number is required'),
  blockTower: z.string().min(1, 'Please select your Block or Tower'),
});

