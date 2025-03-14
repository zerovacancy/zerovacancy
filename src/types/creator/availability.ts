/**
 * Creator Availability Types
 */

import { AvailabilityStatus } from './index';

// Availability calendar data
export interface AvailabilityCalendar {
  creatorId: string;
  availableDates: AvailabilityDate[];
  bookingLeadTime: number; // Days in advance required for booking
  timezone: string;
}

// Single date availability
export interface AvailabilityDate {
  date: string; // ISO format date
  status: AvailabilityStatus;
  availableSlots?: TimeSlot[];
}

// Time slot for bookings
export interface TimeSlot {
  start: string; // HH:MM format
  end: string; // HH:MM format
  isBooked: boolean;
}

// Booking request
export interface BookingRequest {
  creatorId: string;
  clientId: string;
  date: string;
  timeSlot?: TimeSlot;
  projectDetails: string;
  location: string;
}

// Component props
export interface AvailabilityDisplayProps {
  availability: AvailabilityCalendar;
  className?: string;
  onDateSelect?: (date: AvailabilityDate) => void;
}