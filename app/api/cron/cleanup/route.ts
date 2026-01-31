import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// This route can be called by a cron job service (like Vercel Cron, GitHub Actions, or manually)
// It deletes PDF files from storage that have expired (link expired > 6 hours ago to be safe, or just expired)
// Since we have auto-regeneration, we can aggressively clean up.

export async function GET() {
  // Security: You should ideally verify a secret token here
  // const authHeader = req.headers.get('Authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

  try {
    const now = new Date();

    // CLEANUP DISABLED BY USER REQUEST
    // We now allow files to persist indefinitely.
    // Manual cleanup can be performed if storage limits are reached.
    
    // const expiredOrders = await prisma.order.findMany({ ... });
    // ... deletion logic ...

    return NextResponse.json({
      success: true,
      message: "Cleanup is currently disabled. Files are kept indefinitely.",
      cleaned: 0,
    });
  } catch (error) {
    console.error("[Cleanup] Job Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
