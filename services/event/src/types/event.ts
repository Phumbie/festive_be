export interface EventCreateDTO {
  name: string;
  description?: string;
  eventType: string;
  eventDate: string; // ISO string
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
  eventDate: string;
  currency: string;
  budget: number;
  phoneNumber?: string;
  projectManager?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
} 