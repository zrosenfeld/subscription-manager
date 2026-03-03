import { getAllData } from "@/lib/supabase/queries";
import { SERVICES, CARRIERS, CARDS } from "@/lib/data";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  let data;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    data = await getAllData();
  } else {
    data = { services: SERVICES, carriers: CARRIERS, cards: CARDS };
  }
  return <Dashboard services={data.services} carriers={data.carriers} cards={data.cards} />;
}
