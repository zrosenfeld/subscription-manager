import type { Card, Carrier, Service } from "../types";
import { createServerClient } from "./server";

export async function getServices(): Promise<Record<string, Service>> {
  const supabase = createServerClient();

  const { data: services } = await supabase
    .from("services")
    .select("slug, name, icon, category");

  const { data: tiers } = await supabase
    .from("service_tiers")
    .select("slug, service_slug, name, price, sort_order")
    .order("sort_order");

  const result: Record<string, Service> = {};
  for (const svc of services ?? []) {
    result[svc.slug] = {
      name: svc.name,
      icon: svc.icon,
      category: svc.category,
      tiers: (tiers ?? [])
        .filter((t) => t.service_slug === svc.slug)
        .map((t) => ({ id: t.slug, name: t.name, price: Number(t.price) })),
    };
  }
  return result;
}

export async function getCarriers(): Promise<Record<string, Carrier>> {
  const supabase = createServerClient();

  const { data: carriers } = await supabase
    .from("carriers")
    .select("slug, name, price, free_services, perks, notes");

  const { data: discounts } = await supabase
    .from("carrier_discounts")
    .select("carrier_slug, service_tier_slug, price");

  const result: Record<string, Carrier> = {};
  for (const c of carriers ?? []) {
    result[c.slug] = {
      name: c.name,
      price: c.price ? Number(c.price) : null,
      freeServices: c.free_services ?? [],
      perks: c.perks ?? false,
      notes: c.notes ?? undefined,
      discounts: (discounts ?? [])
        .filter((d) => d.carrier_slug === c.slug)
        .map((d) => ({ service: d.service_tier_slug, price: Number(d.price) })),
    };
  }
  return result;
}

export async function getCards(): Promise<Record<string, Card>> {
  const supabase = createServerClient();

  const { data: cards } = await supabase.from("cards").select("*");

  const result: Record<string, Card> = {};
  for (const c of cards ?? []) {
    result[c.slug] = {
      name: c.name,
      fee: Number(c.fee),
      streamingCredit: c.streaming_credit ? Number(c.streaming_credit) : undefined,
      creditServices: c.credit_services?.length ? c.credit_services : undefined,
      walmartCredit: c.walmart_credit ? Number(c.walmart_credit) : undefined,
      cashbackRate: c.cashback_rate ? Number(c.cashback_rate) : undefined,
      cashbackOn: c.cashback_on ?? undefined,
      disneyCredit: c.disney_credit ? Number(c.disney_credit) : undefined,
      pointsMultiplier: c.points_multiplier ?? undefined,
      pointValue: c.point_value ? Number(c.point_value) : undefined,
      notes: c.notes ?? undefined,
    };
  }
  return result;
}

export async function getAllData() {
  const [services, carriers, cards] = await Promise.all([
    getServices(),
    getCarriers(),
    getCards(),
  ]);
  return { services, carriers, cards };
}
