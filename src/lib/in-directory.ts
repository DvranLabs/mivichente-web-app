// Whether a business appears in the directory of the region (gr96hhp28).
//
// A business outside it (the cafés in the city of Durango) opens by link but
// its pages do not send the customer to the app, to other businesses or to the
// store. It is read in its own request, apart from the page query, so that a
// failure here, or a database that does not have the column yet, leaves the
// page as it was instead of turning it into a 404.

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

/** False only when the business is known to be outside the directory. */
export async function isInDirectory(by: { slug: string } | { id: string }): Promise<boolean> {
  const filter =
    "slug" in by ? `slug=eq.${encodeURIComponent(by.slug)}` : `id=eq.${encodeURIComponent(by.id)}`;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/businesses?${filter}&select=in_directory&limit=1`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return true;
    const [row] = (await res.json()) as { in_directory?: boolean }[];
    return row?.in_directory !== false;
  } catch {
    return true;
  }
}
