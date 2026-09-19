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

export const memberItemSchema = z.object({
  tempId: z.string(),
  fullName: z.string().min(2, 'Full name required'),
  age: z.coerce.number().min(3, 'Minimum age is 3 years').max(100, 'Invalid age'),
  gender: z.enum(['Male', 'Female', 'Other']),
  relation: z.enum(['Self', 'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Sibling', 'Other']),
  tShirtSize: z.enum(['Kids-S', 'Kids-M', 'Kids-L', 'S', 'M', 'L', 'XL', 'XXL']),
  medicalNotes: z.string().optional(),
});

export const sportAllocationSchema = z.object({
  tempMemberId: z.string(),
  eventId: z.string(),
  role: z.string().optional(),
  partnerName: z.string().optional(),
  bicycleOption: z.string().optional(),
  notes: z.string().optional(),
});

