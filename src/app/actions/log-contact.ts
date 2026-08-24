"use server";

// Escalón del embudo que faltaba: qué botón de contacto se tocó en la landing.
// Mismo propósito que logResultTap/logContact del Flutter — device_id anónimo
// para cruzar actividad y excluir uso propio, canal no persona.

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

// Best-effort a propósito, igual que logScan: medir el contacto no debe
// interponerse entre el usuario y el botón de llamar/WhatsApp.
export async function logContact(
  businessId: string,
  channel: "call" | "whatsapp",
  deviceId: string,
) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/business_contacts`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_id: businessId,
        channel,
        device_id: deviceId,
        source: "landing",
      }),
    });
  } catch {
    // best-effort, ver comentario arriba
  }
}
