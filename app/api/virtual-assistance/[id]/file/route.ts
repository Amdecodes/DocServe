import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

// Helper to enforce admin auth
async function requireAdmin() {
  const user = await currentUser();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!user || !adminEmail) {
    throw new Error("Unauthorized");
  }

  const isEmailMatch = user.emailAddresses.some(
    (e) => e.emailAddress.toLowerCase() === adminEmail.toLowerCase()
  );

  if (!isEmailMatch) {
    throw new Error("Unauthorized");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { fileUrl } = await request.json();
    const { id } = await params;

    if (!fileUrl) {
      return NextResponse.json({ error: "File URL required" }, { status: 400 });
    }

    // Extract file key from UploadThing URL
    // URL format: https://utfs.io/f/FILE_KEY
    const fileKey = fileUrl.split("/f/")[1];

    if (!fileKey) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
    }

    // Delete from UploadThing
    await utapi.deleteFiles(fileKey);

    // Update database to remove resume_url
    await prisma.virtualAssistanceRequest.update({
      where: { id },
      data: { resume_url: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[VA File Delete Error]", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
