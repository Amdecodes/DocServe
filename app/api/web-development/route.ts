import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { webDevSchema } from "@/validators/web-dev.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validatedData = webDevSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const { full_name, email, phone, project_type, budget_range, description } = validatedData.data;

    // Create record in database
    const request = await prisma.webDevRequest.create({
      data: {
        fullName: full_name,
        email,
        phone,
        projectType: project_type,
        budgetRange: budget_range,
        description,
      },
    });

    return NextResponse.json(
      { message: "Request submitted successfully", request },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting web dev request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
