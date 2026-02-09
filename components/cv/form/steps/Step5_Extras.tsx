"use client";

import { Languages } from "../Languages";
import { Volunteer } from "../Volunteer";
import { References } from "../References";

export function Step5_Extras() {
  return (
    <div className="space-y-8">
      <Languages />
      <References />
      <Volunteer />
    </div>
  );
}
