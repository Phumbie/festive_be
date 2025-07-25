export interface ScheduleCreateDTO {
  forType: 'client' | 'vendor' | 'self';
  forId?: string;
  description: string;
  date: string; // ISO string
  status: string;
}

export interface ScheduleUpdateDTO extends Partial<ScheduleCreateDTO> {}

export interface ScheduleResponse {
  id: string;
  eventId: string;
  forType: 'client' | 'vendor' | 'self';
  forId?: string;
  description: string;
  date: string;
  status: string;
  createdAt: string;
} 