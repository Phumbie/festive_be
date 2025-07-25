export interface PaymentCreateDTO {
  amount: number;
  paidAt: string; // ISO string
}

export interface PaymentUpdateDTO extends Partial<PaymentCreateDTO> {}

export interface PaymentResponse {
  id: string;
  eventId: string;
  amount: number;
  paidAt: string;
  createdAt: string;
} 