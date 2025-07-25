export interface DeliverableCreateDTO {
  name: string;
  description?: string;
  date?: string; // ISO string
  status: string;
}

export interface DeliverableUpdateDTO extends Partial<DeliverableCreateDTO> {}

export interface DeliverableResponse {
  id: string;
  eventId: string;
  vendorId: string;
  name: string;
  description?: string;
  date?: string;
  status: string;
  createdAt: string;
} 