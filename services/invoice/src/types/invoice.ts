export interface InvoiceItemCreateDTO {
  name: string;
  quantity: number;
  description?: string;
  amount: number;
}

export interface InvoiceItemUpdateDTO extends Partial<InvoiceItemCreateDTO> {}

export interface InvoiceItemResponse {
  id: string;
  invoiceId: string;
  name: string;
  quantity: number;
  description?: string;
  amount: number;
}

export interface InvoiceCreateDTO {
  eventId: string;
  name: string;
  companyName: string;
  date: string; // ISO string
  status: string;
  total: number;
  currency: string;
  items?: InvoiceItemCreateDTO[];
}

export interface InvoiceUpdateDTO extends Partial<InvoiceCreateDTO> {}

export interface InvoiceResponse {
  id: string;
  eventId: string;
  name: string;
  companyName: string;
  date: string;
  status: string;
  total: number;
  currency: string;
  items: InvoiceItemResponse[];
  createdAt: string;
  updatedAt: string;
} 