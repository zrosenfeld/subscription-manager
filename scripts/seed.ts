import { createClient } from "@supabase/supabase-js";
import { SERVICES, CARRIERS, VERIZON_PERKS, CARDS } from "../src/lib/data";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log("Seeding services...");
  const serviceRows = Object.entries(SERVICES).map(([slug, s]) => ({
    slug,
    name: s.name,
    icon: s.icon,
    category: s.category,
  }));
  const { error: svcErr } = await supabase.from("services").upsert(serviceRows);
  if (svcErr) throw svcErr;

  console.log("Seeding service tiers...");
  const tierRows = Object.entries(SERVICES).flatMap(([serviceSlug, s]) =>
    s.tiers.map((t, i) => ({
      slug: t.id,
      service_slug: serviceSlug,
      name: t.name,
      price: t.price,
      sort_order: i,
    }))
  );
  const { error: tierErr } = await supabase.from("service_tiers").upsert(tierRows);
  if (tierErr) throw tierErr;

  console.log("Seeding carriers...");
  const carrierRows = Object.entries(CARRIERS).map(([slug, c]) => ({
    slug,
    name: c.name,
    price: c.price,
    free_services: c.freeServices ?? [],
    perks: c.perks ?? false,
    notes: c.notes ?? null,
  }));
  const { error: carrErr } = await supabase.from("carriers").upsert(carrierRows);
  if (carrErr) throw carrErr;

  console.log("Seeding carrier discounts...");
  const discountRows = Object.entries(CARRIERS).flatMap(([slug, c]) =>
    (c.discounts ?? []).map((d) => ({
      carrier_slug: slug,
      service_tier_slug: d.service,
      price: d.price,
    }))
  );
  if (discountRows.length) {
    const { error: discErr } = await supabase
      .from("carrier_discounts")
      .upsert(discountRows, { onConflict: "carrier_slug,service_tier_slug" });
    if (discErr) throw discErr;
  }

  console.log("Seeding cards...");
  const cardRows = Object.entries(CARDS).map(([slug, c]) => ({
    slug,
    name: c.name,
    fee: c.fee,
    streaming_credit: c.streamingCredit ?? null,
    credit_services: c.creditServices ?? [],
    walmart_credit: c.walmartCredit ?? null,
    cashback_rate: c.cashbackRate ?? null,
    cashback_on: c.cashbackOn ?? null,
    disney_credit: c.disneyCredit ?? null,
    points_multiplier: c.pointsMultiplier ?? null,
    point_value: c.pointValue ?? null,
    notes: c.notes ?? null,
  }));
  const { error: cardErr } = await supabase.from("cards").upsert(cardRows);
  if (cardErr) throw cardErr;

  console.log("Seeding verizon perks...");
  const perkRows = VERIZON_PERKS.map((p) => ({
    slug: p.id,
    name: p.name,
    price: p.price,
    covers_services: p.coversServices,
    savings_vs_retail: p.savingsVsRetail,
    notes: p.notes ?? null,
  }));
  const { error: perkErr } = await supabase.from("verizon_perks").upsert(perkRows);
  if (perkErr) throw perkErr;

  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
