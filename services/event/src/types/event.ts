export interface EventCreateDTO {
  name: string;
  description?: string;
  eventType: string;
  startDate: string; // ISO string
  endDate?: string; // Optional ISO string - null for single-day events
  currency: string;
  budget: number;
  phoneNumber?: string;
  projectManager?: string;
  userId: string;
}

export interface EventUpdateDTO extends Partial<EventCreateDTO> {}

export interface EventResponse {
  id: string;
  name: string;
  description?: string;
  eventType: string;
  startDate: string;
  endDate: string | null; // Can be null for single-day events
  currency: string;
  budget: number;
  phoneNumber?: string;
  projectManager?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
} 