import prisma from "@/lib/prisma"; // updated import

export async function fetchBarangayInfo() {
  try {
    const res = await fetch("/api/barangay");

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching barangay info:", err);
    return null;
  }
}

export async function getBarangayInfoServer() {
  try {
    const barangay = await prisma.barangay.findFirst();
    const chairperson = await prisma.admin.findFirst({
      where: { hierarchyRole: "CAPTAIN" },
      select: { name: true },
    });

    return {
      ...barangay,
      chairperson: chairperson?.name || "Unavailable",
    };
  } catch (error) {
    console.error("Failed to fetch barangay info (server):", error);
    return {
      name: "Barangay",
      chairperson: "Unavailable",
    };
  }
}
