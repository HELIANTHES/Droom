export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  whatToExpect: string;
  conditions: string[];
  icon: string;
}

export interface Condition {
  id: string;
  name: string;
  description: string;
  examples: string[];
  icon: string;
}

export interface Testimonial {
  name: string;
  condition: string;
  outcome: string;
  quote: string;
}

export interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceInterest: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
