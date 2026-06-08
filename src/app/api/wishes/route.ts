import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Failed to read wishes:", error);
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message, isAnonymous } = body;

    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }

    // Get IP Address
    const forwardedFor = request.headers.get("x-forwarded-for");
    let ipAddress = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

    // Check if IP already submitted
    if (ipAddress !== "unknown" && ipAddress !== "127.0.0.1" && ipAddress !== "::1") {
      const { data: existing } = await supabase
        .from("wishes")
        .select("id")
        .eq("ip_address", ipAddress)
        .limit(1);

      if (existing && existing.length > 0) {
        return NextResponse.json({ error: "Anda sudah mengirimkan ucapan sebelumnya." }, { status: 429 });
      }
    }

    const finalName = isAnonymous ? `${name.trim()}||ANON` : name.trim();

    // Insert into Supabase
    const { data, error } = await supabase
      .from("wishes")
      .insert([
        {
          name: finalName,
          message: message.trim(),
          ip_address: ipAddress,
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, wish: data[0] }, { status: 201 });
  } catch (error) {
    console.error("Failed to write wish:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
