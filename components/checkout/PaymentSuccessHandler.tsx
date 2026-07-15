"use client";

import { useEffect } from "react";

export function PaymentSuccessHandler() {
  useEffect(() => {
    // Clear all wizard data
    localStorage.removeItem("paperless.personal");
    localStorage.removeItem("paperless.education");
    localStorage.removeItem("paperless.experience");
    localStorage.removeItem("paperless.skills"); // If we add skills persistence
    localStorage.removeItem("paperless.cv"); // If we use a global key
    localStorage.removeItem("paperless.customer");
    localStorage.removeItem("paperless.orderId");
    localStorage.removeItem("paperless.cvData");

    console.log("Wizard data cleared after successful payment");
  }, []);

  return null;
}
