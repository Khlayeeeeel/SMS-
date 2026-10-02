import { NextResponse } from "next/server";
import { getBlockedIps, manuallyBlockIp, unblockIp } from "@/lib/ipBlocker";

export async function GET() {
  try {
    const ips = await getBlockedIps();
    return NextResponse.json({ blockedIps: ips });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la récupération des IP bloquées." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { ipAddress, reason, durationHours } = await request.json();

    if (!ipAddress) {
      return NextResponse.json(
        { error: "L'adresse IP est obligatoire." },
        { status: 400 }
      );
    }

    const success = await manuallyBlockIp(ipAddress, reason, durationHours ?? 24);

    if (!success) {
      return NextResponse.json(
        { error: "Impossible de bloquer l'adresse IP." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `L'adresse IP ${ipAddress} a été bloquée avec succès.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur lors du blocage d'IP." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const ip = searchParams.get("ip");

    const target = id || ip;

    if (!target) {
      return NextResponse.json(
        { error: "L'identifiant ou l'adresse IP à débloquer est requis." },
        { status: 400 }
      );
    }

    const success = await unblockIp(target);

    if (!success) {
      return NextResponse.json(
        { error: "Impossible de débloquer l'adresse IP." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Adresse IP débloquée avec succès.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur lors du déblocage d'IP." },
      { status: 500 }
    );
  }
}
