import { getBarangayInfoServer } from "@/lib";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const barangayInfo = await getBarangayInfoServer();
    return NextResponse.json(barangayInfo);
  } catch (error) {
    console.error("Failed to fetch barangay info", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
