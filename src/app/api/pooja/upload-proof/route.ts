import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ASTROLOGER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const poojaId = formData.get("poojaId") as string;
    const file = formData.get("video") as File;

    if (!poojaId || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Validate File Size (Max 50MB)
    const MAX_SIZE_MB = 50;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `File size exceeds ${MAX_SIZE_MB}MB limit` }, { status: 413 });
    }

    // 2. Validate MIME Type (Only allow common video formats)
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only MP4, WebM, and MOV are allowed." }, { status: 415 });
    }

    const pooja = await prisma.poojaBooking.findUnique({
      where: { id: poojaId }
    });

    if (!pooja || pooja.status !== "PENDING") {
      return NextResponse.json({ error: "Invalid Pooja or not pending" }, { status: 400 });
    }

    if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const fileName = `pooja_${poojaId}_${Date.now()}.mp4`;

    const { data, error } = await supabase.storage
      .from("pooja-videos")
      .upload(fileName, file, {
        contentType: file.type || "video/mp4",
        upsert: true
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: "Failed to upload video to cloud" }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from("pooja-videos").getPublicUrl(fileName);

    await prisma.poojaBooking.update({
      where: { id: poojaId },
      data: { videoUrl: publicUrl, status: "COMPLETED" }
    });

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Upload proof error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
