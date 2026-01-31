import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { virtualAssistanceSchema } from "@/validators/virtual-assistance.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validationResult = virtualAssistanceSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = validationResult.data;

    // Create the virtual assistance request
    // Note: disclaimer_accepted is validated but not stored - we store the timestamp instead
    // Using type assertion because the generated Prisma client may need regeneration
    const request = await prisma.virtualAssistanceRequest.create({
      data: {
        full_name: data.full_name,
        phone_number: data.phone_number,
        email: data.email || null,
        telegram_username: data.telegram_username || null,
        job_category: data.job_category,
        experience_level: data.experience_level,
        education_level: data.education_level,
        location: data.location,
        notes: data.notes || null,
        resume_url: data.resume_url || null,
        language: data.language,
        source: data.source,
        disclaimer_accepted_at: new Date(),
        status: "PENDING",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    // Return success - no email sent, no promises made
    return NextResponse.json({
      success: true,
      id: request.id,
    });
  } catch (error) {
    console.error("[Virtual Assistance API] Error creating request:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 },
    );
  }
}

// GET endpoint for admin to list requests (optional, can be expanded later)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where = status
      ? { status: status.toUpperCase() as "PENDING" | "CONTACTED" | "CLOSED" }
      : {};

    const requests = await prisma.virtualAssistanceRequest.findMany({
      where,
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("[Virtual Assistance API] Error fetching requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 },
    );
  }
}
