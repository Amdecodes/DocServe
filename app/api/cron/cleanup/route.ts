import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

// This route can be called by a cron job service (like Vercel Cron, GitHub Actions, or manually)
// It deletes PDF files from storage that have expired (link expired > 6 hours ago to be safe, or just expired)
// Since we have auto-regeneration, we can aggressively clean up.

export async function GET() {
  // Security: You should ideally verify a secret token here
  // const authHeader = req.headers.get('Authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

  try {
    const now = new Date();

    // Find orders where the signed URL has expired
    const expiredOrders = await prisma.order.findMany({
      where: {
        pdf_url: { not: null },
        expires_at: { lt: now }, // expired
      },
      take: 50, // Process in batches to avoid timeouts
    });

    if (expiredOrders.length === 0) {
      return NextResponse.json({
        message: "No expired files directly found to clean.",
        count: 0,
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const BUCKET_NAME = "generated-docs";

    let deletedCount = 0;
    let errors = 0;

    await Promise.all(
      expiredOrders.map(async (order) => {
        try {
          // Robust cleanup: List all files in the order's folder and delete them
          // This handles both 'cv.pdf' and older timestamped files
          const folderPath = `orders/${order.id}`;

          const { data: files, error: listError } = await supabase.storage
            .from(BUCKET_NAME)
            .list(folderPath);

          if (listError) throw listError;

          if (files && files.length > 0) {
            const pathsToDelete = files.map((f) => `${folderPath}/${f.name}`);

            const { error: removeError } = await supabase.storage
              .from(BUCKET_NAME)
              .remove(pathsToDelete);

            if (removeError) throw removeError;
          }

          // Update DB: clear the URL so standard regeneration logic kicks in next time
          await prisma.order.update({
            where: { id: order.id },
            data: {
              pdf_url: null,
              expires_at: null,
            },
          });

          deletedCount++;
        } catch (err) {
          console.error(`[Cleanup] Failed for Order ${order.id}:`, err);
          errors++;
        }
      }),
    );

    return NextResponse.json({
      success: true,
      cleaned: deletedCount,
      errors: errors,
      message: `Cleaned up ${deletedCount} orders.`,
    });
  } catch (error) {
    console.error("[Cleanup] Job Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
