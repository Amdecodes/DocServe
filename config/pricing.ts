import { AGREEMENT_TEMPLATES } from "./agreements";

export const SERVICE_PRICES = {
  // Service ID corresponds to service_type in Order model
  cv_writing: 100,
  // Fallback for unknown services
  default: 100,
};

export const PRICE_CURRENCY = "ETB";

export const getPriceForService = (serviceType: string): number => {
  // Check if it's an agreement service (format: agreement:templateId)
  if (serviceType.startsWith("agreement:")) {
    const templateId = serviceType.split(":")[1];
    const template = AGREEMENT_TEMPLATES.find((t) => t.id === templateId);
    return template ? template.price : SERVICE_PRICES.default;
  }

  const price = SERVICE_PRICES[serviceType as keyof typeof SERVICE_PRICES];
  return price || SERVICE_PRICES.default;
};
