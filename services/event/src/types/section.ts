export interface SectionCreateDTO {
  name: string;
}

export interface SectionItemCreateDTO {
  name: string;
  status: string;
  description?: string;
  phone?: string;
  email?: string;
}

export interface SectionResponse {
  id: string;
  eventId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface SectionItemResponse {
  id: string;
  sectionId: string;
  name: string;
  status: string;
  description?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
} 