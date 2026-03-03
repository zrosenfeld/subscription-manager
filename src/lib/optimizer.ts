import type { Card, Carrier, Household, OptimizationResult, Recommendation, Service, UserSub } from "./types";

export function optimize(
  userSubs: UserSub[],
  userCarrier: string,
  userCards: string[],
  userHousehold: Household & { totalMembers: number },
  userWants: UserSub[],
  data: {
    services: Record<string, Service>;
    carriers: Record<string, Carrier>;
    cards: Record<string, Card>;
  }
): OptimizationResult {
  const { services: SERVICES, carriers: CARRIERS, cards: CARDS } = data;
  const recommendations: Recommendation[] = [];
  let totalCurrentMonthly = 0;

  const allDesiredServices = [...userSubs];
  userWants.forEach((w) => {
    if (!allDesiredServices.find((s) => s.serviceId === w.serviceId)) {
      allDesiredServices.push(w);
    }
  });

  const activeServices = allDesiredServices.filter((s) => !s.wantsRemoved);
  const removals = userSubs.filter((s) => s.wantsRemoved);

  activeServices.forEach((s) => { totalCurrentMonthly += s.currentPrice || 0; });

  const carrier = CARRIERS[userCarrier] || {};
  const cards = userCards.map((c) => CARDS[c]).filter(Boolean);
  const hasAmexPlatinum = userCards.includes("amex_platinum");
  const hasVerizon = userCarrier?.startsWith("verizon");

  // 1. CARRIER FREE SERVICES
  if (carrier.freeServices) {
    carrier.freeServices.forEach((freeTier) => {
      const match = activeServices.find((s) => {
        const svc = SERVICES[s.serviceId];
        return svc && svc.tiers.some((t) => t.id === freeTier);
      });
      if (match) {
        const tier = Object.values(SERVICES)
          .flatMap((s) => s.tiers)
          .find((t) => t.id === freeTier);
        if (tier) {
          recommendations.push({
            type: "carrier_free",
            priority: 1,
            service: match.serviceId,
            action: `${SERVICES[match.serviceId].name} is FREE with your ${carrier.name} plan`,
            detail: `You're paying $${match.currentPrice}/mo. Activate the carrier perk to get ${tier.name} at no cost.${match.currentTier !== freeTier ? ` Note: carrier covers the "${tier.name}" tier — if you need a higher tier, you'll pay the upgrade difference.` : ""}`,
            savings: freeTier === match.currentTier ? match.currentPrice : Math.min(match.currentPrice, tier.price),
          });
        }
      }
    });
  }

  // 2. VERIZON PERK BUNDLES
  if (hasVerizon) {
    const disneyServices = ["disney", "hulu"].filter((s) => activeServices.find((a) => a.serviceId === s));
    if (disneyServices.length >= 2) {
      const disneyTotal = disneyServices.reduce(
        (sum, s) => sum + (activeServices.find((a) => a.serviceId === s)?.currentPrice || 0), 0
      );
      if (disneyTotal > 10) {
        recommendations.push({
          type: "verizon_perk",
          priority: 1,
          service: "disney+hulu",
          action: "Switch Disney+ & Hulu to Verizon Disney Bundle perk ($10/mo)",
          detail: `You're paying $${disneyTotal.toFixed(2)}/mo separately. The Verizon Disney Bundle perk gets you Disney+ + Hulu + ESPN for $10/mo (ad-supported tiers).`,
          savings: disneyTotal - 10,
        });
      }
    }
    const netflixMax = ["netflix", "max"].filter((s) => activeServices.find((a) => a.serviceId === s));
    if (netflixMax.length >= 2) {
      const nmTotal = netflixMax.reduce(
        (sum, s) => sum + (activeServices.find((a) => a.serviceId === s)?.currentPrice || 0), 0
      );
      if (nmTotal > 10) {
        recommendations.push({
          type: "verizon_perk",
          priority: 1,
          service: "netflix+max",
          action: "Switch Netflix & Max to Verizon Netflix+Max perk ($10/mo)",
          detail: `You're paying $${nmTotal.toFixed(2)}/mo. Get both with ads through Verizon for $10/mo. If you need ad-free, pay just the upgrade difference.`,
          savings: nmTotal - 10,
        });
      }
    }
  }

  // 3. AMEX PLATINUM STREAMING CREDIT
  if (hasAmexPlatinum) {
    const eligibleSubs = activeServices.filter((s) =>
      CARDS.amex_platinum.creditServices?.includes(s.serviceId)
    );
    const totalEligible = eligibleSubs.reduce((sum, s) => sum + (s.currentPrice || 0), 0);
    const creditUsed = Math.min(totalEligible, 25);
    if (creditUsed > 0 && !eligibleSubs.every((s) => s.usingAmexCredit)) {
      recommendations.push({
        type: "card_credit",
        priority: 2,
        service: "amex_platinum",
        action: "Use your Amex Platinum $25/mo entertainment credit",
        detail: `You have ${eligibleSubs.length} eligible service(s): ${eligibleSubs.map((s) => SERVICES[s.serviceId]?.name).join(", ")}. Switch payment to your Amex Platinum to get up to $25/mo back. ${totalEligible > 25 ? `Your eligible spend is $${totalEligible.toFixed(2)}/mo, so you'd get the full $25 credit.` : `You'd get $${creditUsed.toFixed(2)}/mo back.`}`,
        savings: creditUsed,
      });
    }

    const hasPeacock = activeServices.find((s) => s.serviceId === "peacock");
    const hasParamount = activeServices.find((s) => s.serviceId === "paramount");
    if (hasPeacock || hasParamount) {
      const target = hasPeacock ? "Peacock" : "Paramount+";
      const targetSub = hasPeacock || hasParamount;
      const targetPrice = targetSub?.currentPrice || 0;
      recommendations.push({
        type: "stack",
        priority: 2,
        service: "walmart_stack",
        action: `Get ${target} FREE via Amex Platinum → Walmart+ stack`,
        detail: `Your Amex Platinum covers Walmart+ ($12.95/mo credit). Walmart+ includes free ${target} with ads. Cancel your current ${target} subscription.`,
        savings: targetPrice,
      });
    }
  }

  // 4. DISNEY BUNDLES
  const hasDisney = activeServices.find((s) => s.serviceId === "disney");
  const hasHulu = activeServices.find((s) => s.serviceId === "hulu");
  const hasMax = activeServices.find((s) => s.serviceId === "max");

  if (hasDisney && hasHulu && !hasVerizon) {
    const combined = (hasDisney.currentPrice || 0) + (hasHulu.currentPrice || 0);
    const duoAds = 10.99;
    const duoNoAds = 19.99;
    if (combined > duoAds) {
      recommendations.push({
        type: "bundle",
        priority: 2,
        service: "disney_duo",
        action: `Bundle Disney+ & Hulu into Duo plan ($${duoAds}/mo with ads, $${duoNoAds}/mo without)`,
        detail: `You're paying $${combined.toFixed(2)}/mo separately. The Duo bundle saves $${(combined - duoAds).toFixed(2)}/mo with ads or $${(combined - duoNoAds).toFixed(2)}/mo without.`,
        savings: combined - duoAds,
      });
    }
  }
  if (hasDisney && hasHulu && hasMax) {
    const combined = (hasDisney.currentPrice || 0) + (hasHulu.currentPrice || 0) + (hasMax.currentPrice || 0);
    recommendations.push({
      type: "bundle",
      priority: 1,
      service: "disney_hulu_max",
      action: "Bundle Disney+ / Hulu / Max ($16.99/mo with ads, $29.99/mo without)",
      detail: `You're paying $${combined.toFixed(2)}/mo for all three separately. The cross-company bundle saves $${(combined - 16.99).toFixed(2)}/mo with ads.`,
      savings: combined - 16.99,
    });
  }

  // 5. FAMILY PLAN UPGRADES
  if (userHousehold.totalMembers >= 2) {
    const spotifySub = activeServices.find((s) => s.serviceId === "spotify" && s.currentTier === "spotify_individual");
    if (spotifySub) {
      recommendations.push({
        type: "family",
        priority: 3,
        service: "spotify",
        action: "Switch Spotify to Family plan ($19.99/mo for up to 6)",
        detail: `With ${userHousehold.totalMembers} household members, Family covers everyone. If anyone else pays separately, combining saves $${(11.99 * Math.min(userHousehold.totalMembers, 6) - 19.99).toFixed(2)}/mo total.`,
        savings: Math.max(0, 11.99 * Math.min(userHousehold.totalMembers, 2) - 19.99),
      });
    }
    const ytSub = activeServices.find((s) => s.serviceId === "youtube_premium" && s.currentTier === "yt_individual");
    if (ytSub) {
      recommendations.push({
        type: "family",
        priority: 3,
        service: "youtube_premium",
        action: "Switch YouTube Premium to Family plan ($22.99/mo for up to 5)",
        detail: `Covers ${Math.min(userHousehold.totalMembers, 5)} people. With 2 users, that's $5/mo in savings.`,
        savings: Math.max(0, 13.99 * 2 - 22.99),
      });
    }
  }

  // 6. REDUNDANCY DETECTION
  const hasSpotify = activeServices.find((s) => s.serviceId === "spotify");
  const hasAppleMusic = activeServices.find((s) => s.serviceId === "apple_music");
  if (hasSpotify && hasAppleMusic) {
    const cheaper = (hasSpotify.currentPrice || 0) <= (hasAppleMusic.currentPrice || 0) ? "apple_music" : "spotify";
    const cheaperSub = activeServices.find((s) => s.serviceId === cheaper);
    recommendations.push({
      type: "redundant",
      priority: 2,
      service: cheaper,
      action: "You're paying for both Spotify and Apple Music — drop one",
      detail: `These are redundant music services. Consider dropping ${SERVICES[cheaper]?.name} ($${cheaperSub?.currentPrice}/mo) unless you have a specific reason for both.`,
      savings: cheaperSub?.currentPrice || 0,
    });
  }

  const hasDropbox = activeServices.find((s) => s.serviceId === "dropbox");
  const hasICloud = activeServices.find((s) => s.serviceId === "icloud");
  if (hasDropbox && hasICloud) {
    recommendations.push({
      type: "redundant",
      priority: 3,
      service: "dropbox",
      action: "Dropbox + iCloud overlap — consider consolidating",
      detail: `You're paying for both cloud storage services. iCloud 2TB ($9.99/mo) may replace Dropbox ($${hasDropbox.currentPrice}/mo) if you're in the Apple ecosystem.`,
      savings: hasDropbox.currentPrice || 0,
    });
  }

  // 7. REMOVALS
  removals.forEach((r) => {
    recommendations.push({
      type: "removal",
      priority: 4,
      service: r.serviceId,
      action: `Cancel ${SERVICES[r.serviceId]?.name || r.serviceId}`,
      detail: "You indicated you no longer want this service.",
      savings: r.currentPrice || 0,
    });
  });

  // Sort by priority then savings, deduplicate by service
  recommendations.sort((a, b) => a.priority - b.priority || b.savings - a.savings);
  const seen = new Set<string>();
  const deduped = recommendations.filter((r) => {
    if (seen.has(r.service)) return false;
    seen.add(r.service);
    return true;
  });

  const totalSavings = deduped.reduce((s, r) => s + (r.savings || 0), 0);
  return { recommendations: deduped, totalCurrentMonthly, totalSavings };
}
