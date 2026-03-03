"use client";

import { useState } from "react";
import { CARDS, CARRIERS, SERVICES } from "@/lib/data";
import { optimize } from "@/lib/optimizer";
import type { Household, OptimizationResult, RecommendationType, UserSub } from "@/lib/types";

type Step = "services" | "carrier" | "cards" | "household" | "review" | "results";

const STEPS: Step[] = ["services", "carrier", "cards", "household", "review", "results"];

const TYPE_COLORS: Record<RecommendationType, string> = {
  carrier_free: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  verizon_perk: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  card_credit: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  stack: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  bundle: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  family: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  redundant: "text-red-400 bg-red-400/10 border-red-400/20",
  removal: "text-neutral-500 bg-neutral-500/10 border-neutral-500/20",
};

const TYPE_LABELS: Record<RecommendationType, string> = {
  carrier_free: "Carrier Perk",
  verizon_perk: "Carrier Bundle",
  card_credit: "Card Credit",
  stack: "Stacking Trick",
  bundle: "Bundle Deal",
  family: "Family Plan",
  redundant: "Redundant",
  removal: "Cancel",
};

export default function Dashboard() {
  const [step, setStep] = useState<Step>("services");
  const [userSubs, setUserSubs] = useState<UserSub[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [carrier, setCarrier] = useState<string | null>(null);
  const [cards, setCards] = useState<string[]>([]);
  const [household, setHousehold] = useState<Household>({ adults: 1, kids: 0, homes: 1 });
  const [results, setResults] = useState<OptimizationResult | null>(null);
  const [acceptedRecs, setAcceptedRecs] = useState<number[]>([]);

  const goBack = () => {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
  };

  const addSub = (serviceId: string, tierId: string, price: number) => {
    setUserSubs((prev) => [
      ...prev.filter((s) => s.serviceId !== serviceId),
      { serviceId, currentTier: tierId, currentPrice: price },
    ]);
    setSelectedService(null);
  };

  const removeSub = (serviceId: string) =>
    setUserSubs((prev) => prev.filter((s) => s.serviceId !== serviceId));

  const toggleWantRemoved = (serviceId: string) =>
    setUserSubs((prev) =>
      prev.map((s) => s.serviceId === serviceId ? { ...s, wantsRemoved: !s.wantsRemoved } : s)
    );

  const runOptimizer = () => {
    const r = optimize(
      userSubs,
      carrier ?? "other",
      cards,
      { totalMembers: household.adults + household.kids, ...household },
      []
    );
    setResults(r);
    setStep("results");
  };

  const totalMonthly = userSubs.reduce((s, x) => s + x.currentPrice, 0);

  return (
    <div className="min-h-screen bg-[#060708] text-neutral-300 font-sans">
      <div className="max-w-2xl mx-auto px-5 pb-20 pt-2">

        {/* Header */}
        <div className="flex justify-between items-center mb-7 pt-2">
          <span className="font-bold text-[17px] tracking-tight">
            sub<span className="text-neutral-600">stack</span>
          </span>
          {step !== "services" && (
            <button onClick={goBack} className="text-neutral-600 text-sm hover:text-neutral-400 transition-colors">
              ← Back
            </button>
          )}
        </div>

        {/* STEP 1: Services */}
        {step === "services" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            <h2 className="text-2xl font-bold tracking-tight mb-1">What do you currently subscribe to?</h2>
            <p className="text-neutral-500 text-sm mb-6">Select each service and the tier you're on. The tier matters for optimization.</p>

            {userSubs.length > 0 && (
              <div className="mb-6">
                <p className="text-[11px] text-neutral-600 uppercase tracking-widest font-semibold mb-2">
                  Your services ({userSubs.length})
                </p>
                <div className="flex flex-col gap-1">
                  {userSubs.map((s) => {
                    const svc = SERVICES[s.serviceId];
                    const tier = svc?.tiers.find((t) => t.id === s.currentTier);
                    return (
                      <div key={s.serviceId} className="flex justify-between items-center px-3.5 py-2.5 bg-green-500/5 border border-green-500/15 rounded-xl">
                        <span className="text-sm">
                          <span className="mr-2">{svc?.icon}</span>
                          {svc?.name}
                          <span className="text-neutral-600 text-xs ml-1">· {tier?.name}</span>
                        </span>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[13px] text-green-500">${s.currentPrice}/mo</span>
                          <button onClick={() => removeSub(s.serviceId)} className="text-neutral-600 hover:text-neutral-400 text-xs transition-colors">✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-right mt-2">
                  <span className="font-mono text-sm text-neutral-500">
                    Total: <span className="text-neutral-200 font-semibold">${totalMonthly.toFixed(2)}/mo</span>
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {Object.entries(SERVICES).map(([id, svc]) => {
                const alreadyAdded = userSubs.find((s) => s.serviceId === id);
                const isExpanded = selectedService === id;
                return (
                  <div key={id}>
                    <div
                      onClick={() => !alreadyAdded && setSelectedService(isExpanded ? null : id)}
                      className={`flex justify-between items-center px-3.5 py-3 border transition-all
                        ${isExpanded ? "rounded-t-xl rounded-b-none border-b-0" : "rounded-xl"}
                        ${alreadyAdded ? "bg-green-500/[0.03] border-green-500/10 opacity-40 cursor-default" : "bg-white/[0.025] border-white/[0.07] cursor-pointer hover:bg-white/[0.04]"}
                      `}
                    >
                      <span className="text-sm flex items-center gap-2">
                        <span>{svc.icon}</span>
                        {svc.name}
                        {alreadyAdded && <span className="text-[10px] text-green-500">✓ added</span>}
                      </span>
                      {!alreadyAdded && (
                        <span className={`text-[11px] text-neutral-600 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>▼</span>
                      )}
                    </div>
                    {isExpanded && (
                      <div className="px-3.5 py-2.5 bg-white/[0.015] border border-white/[0.07] border-t-0 rounded-b-xl flex flex-wrap gap-1.5">
                        {svc.tiers.map((tier) => (
                          <button
                            key={tier.id}
                            onClick={() => addSub(id, tier.id, tier.price)}
                            className="px-3.5 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-400 text-sm hover:bg-white/[0.06] transition-colors"
                          >
                            {tier.name} — <span className="font-mono text-green-500">${tier.price}</span>/mo
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-7">
              <button
                disabled={userSubs.length === 0}
                onClick={() => setStep("carrier")}
                className="px-7 py-3.5 rounded-xl font-semibold text-[15px] transition-colors disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed bg-neutral-100 text-[#060708] hover:bg-white"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Carrier */}
        {step === "carrier" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            <h2 className="text-2xl font-bold tracking-tight mb-1">Who's your cell phone carrier?</h2>
            <p className="text-neutral-500 text-sm mb-6">Your phone plan might already include streaming you're paying for separately.</p>
            <div className="flex flex-col gap-1.5">
              {Object.entries(CARRIERS).map(([id, c]) => (
                <button
                  key={id}
                  onClick={() => { setCarrier(id); setStep("cards"); }}
                  className={`px-4.5 py-3.5 rounded-xl text-left border text-sm transition-all flex justify-between items-center
                    ${carrier === id ? "border-white/20 bg-white/[0.06]" : "border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.04]"}
                  `}
                >
                  <span className="text-neutral-300">{c.name}</span>
                  {c.freeServices && c.freeServices.length > 0 && (
                    <span className="text-[11px] text-green-500">has streaming perks</span>
                  )}
                  {c.perks && <span className="text-[11px] text-green-500">$10/mo perks available</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Cards */}
        {step === "cards" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            <h2 className="text-2xl font-bold tracking-tight mb-1">Which credit cards do you have?</h2>
            <p className="text-neutral-500 text-sm mb-6">Select all that apply. Many premium cards include streaming credits you might not be using.</p>
            <div className="flex flex-col gap-1.5">
              {Object.entries(CARDS).map(([id, c]) => {
                const selected = cards.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => setCards((prev) => selected ? prev.filter((x) => x !== id) : [...prev, id])}
                    className={`px-4 py-3.5 rounded-xl text-left border transition-all
                      ${selected ? "border-green-500/30 bg-green-500/[0.06] text-neutral-200" : "border-white/[0.07] bg-white/[0.025] text-neutral-500 hover:bg-white/[0.04]"}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{selected ? "✓ " : ""}{c.name}</span>
                      <span className="text-xs text-neutral-600">{c.fee > 0 ? `$${c.fee}/yr fee` : "No fee"}</span>
                    </div>
                    {c.streamingCredit && <p className="text-xs text-green-500 mt-1">💳 Up to ${c.streamingCredit}/mo streaming credit</p>}
                    {c.cashbackRate && <p className="text-xs text-green-500 mt-1">💳 {c.cashbackRate * 100}% back on streaming</p>}
                    {c.disneyCredit && <p className="text-xs text-green-500 mt-1">💳 ${c.disneyCredit}/mo Disney credit</p>}
                    {c.pointsMultiplier && <p className="text-xs text-neutral-600 mt-1">💳 {c.pointsMultiplier}x points on streaming</p>}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setStep("household")}
              className="mt-6 px-7 py-3.5 rounded-xl bg-neutral-100 text-[#060708] font-semibold text-[15px] hover:bg-white transition-colors"
            >
              Continue →
            </button>
          </div>
        )}

        {/* STEP 4: Household */}
        {step === "household" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            <h2 className="text-2xl font-bold tracking-tight mb-1">Household details</h2>
            <p className="text-neutral-500 text-sm mb-7">Family plans and multi-home setups unlock the biggest savings.</p>
            {([
              { label: "Adults in household", key: "adults" as const, options: [1, 2, 3, 4] },
              { label: "Kids", key: "kids" as const, options: [0, 1, 2, 3, "4+"] },
              { label: "Homes / properties", key: "homes" as const, options: [1, 2, 3, "4+"] },
            ]).map((q) => (
              <div key={q.key} className="mb-5">
                <p className="text-sm text-neutral-500 font-medium mb-2">{q.label}</p>
                <div className="flex gap-1.5">
                  {q.options.map((n) => {
                    const val = typeof n === "string" ? 4 : n;
                    return (
                      <button
                        key={n}
                        onClick={() => setHousehold((h) => ({ ...h, [q.key]: val }))}
                        className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all
                          ${household[q.key] === val ? "border-white/25 bg-white/[0.08] text-neutral-200" : "border-white/[0.07] bg-transparent text-neutral-600 hover:text-neutral-400"}
                        `}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              onClick={() => setStep("review")}
              className="mt-3 px-7 py-3.5 rounded-xl bg-neutral-100 text-[#060708] font-semibold text-[15px] hover:bg-white transition-colors"
            >
              Continue →
            </button>
          </div>
        )}

        {/* STEP 5: Review */}
        {step === "review" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            <h2 className="text-2xl font-bold tracking-tight mb-1">Any changes you want to make?</h2>
            <p className="text-neutral-500 text-sm mb-6">Mark services you want to drop, or we'll optimize everything as-is.</p>
            <div className="flex flex-col gap-1 mb-6">
              {userSubs.map((s) => {
                const svc = SERVICES[s.serviceId];
                return (
                  <div
                    key={s.serviceId}
                    onClick={() => toggleWantRemoved(s.serviceId)}
                    className={`flex justify-between items-center px-4 py-3 rounded-xl border cursor-pointer transition-all
                      ${s.wantsRemoved ? "bg-red-500/[0.06] border-red-500/20 line-through text-neutral-600" : "bg-white/[0.025] border-white/[0.07] text-neutral-300 hover:bg-white/[0.04]"}
                    `}
                  >
                    <span className="text-sm">{svc?.icon} {svc?.name}</span>
                    <span className={`text-xs ${s.wantsRemoved ? "text-red-400" : "text-neutral-600"}`}>
                      {s.wantsRemoved ? "Will cancel" : "Tap to drop"}
                    </span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={runOptimizer}
              className="w-full py-4 rounded-xl bg-green-500 text-[#060708] font-bold text-base hover:bg-green-400 transition-colors"
            >
              🔍 Optimize my subscriptions →
            </button>
          </div>
        )}

        {/* STEP 6: Results */}
        {step === "results" && results && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Hero */}
            <div className="text-center py-8">
              <p className="text-[11px] text-neutral-600 uppercase tracking-widest font-semibold mb-2">Your optimization plan</p>
              <p className="font-mono text-[52px] font-extrabold text-green-500 leading-none mb-1 tracking-tight">
                -${results.totalSavings.toFixed(0)}<span className="text-xl text-green-600">/mo</span>
              </p>
              <p className="text-sm text-neutral-600">
                ${(results.totalSavings * 12).toFixed(0)}/year saved · {results.recommendations.length} action{results.recommendations.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Before / After */}
            <div className="grid grid-cols-2 gap-3 mb-7">
              <div className="px-5 py-4 rounded-xl bg-red-500/[0.05] border border-red-500/15 text-center">
                <p className="text-[11px] text-red-400 uppercase tracking-widest font-semibold mb-1">Current</p>
                <p className="font-mono text-3xl font-bold text-red-400">
                  ${results.totalCurrentMonthly.toFixed(0)}<span className="text-sm">/mo</span>
                </p>
              </div>
              <div className="px-5 py-4 rounded-xl bg-green-500/[0.05] border border-green-500/15 text-center">
                <p className="text-[11px] text-green-500 uppercase tracking-widest font-semibold mb-1">Optimized</p>
                <p className="font-mono text-3xl font-bold text-green-500">
                  ${(results.totalCurrentMonthly - results.totalSavings).toFixed(0)}<span className="text-sm">/mo</span>
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="flex flex-col gap-2">
              {results.recommendations.map((rec, i) => {
                const accepted = acceptedRecs.includes(i);
                return (
                  <div
                    key={i}
                    onClick={() => setAcceptedRecs((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])}
                    className={`px-4 py-4 rounded-xl border cursor-pointer transition-all
                      ${accepted ? "bg-green-500/[0.06] border-green-500/20" : "bg-white/[0.025] border-white/[0.07] hover:bg-white/[0.035]"}
                    `}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${accepted ? "border-green-500 bg-green-500" : "border-neutral-700 bg-transparent"}`}>
                          {accepted && <span className="text-[#060708] text-xs font-bold">✓</span>}
                        </div>
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${TYPE_COLORS[rec.type]}`}>
                          {TYPE_LABELS[rec.type]}
                        </span>
                      </div>
                      <span className="font-mono text-base font-bold text-green-500">
                        -${rec.savings.toFixed(0)}<span className="text-xs text-green-600">/mo</span>
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-100 mb-1">{rec.action}</p>
                    <p className="text-[13px] text-neutral-600 leading-relaxed">{rec.detail}</p>
                  </div>
                );
              })}
            </div>

            {/* Accept summary */}
            {acceptedRecs.length > 0 && (
              <div className="mt-5 p-5 rounded-2xl bg-green-500/[0.06] border border-green-500/20 text-center">
                <p className="text-sm text-green-500 font-semibold mb-1">
                  {acceptedRecs.length} optimization{acceptedRecs.length !== 1 ? "s" : ""} accepted
                </p>
                <p className="text-sm text-neutral-600 mb-3">
                  Saving ${acceptedRecs.reduce((s, i) => s + (results.recommendations[i]?.savings || 0), 0).toFixed(0)}/mo ·{" "}
                  ${(acceptedRecs.reduce((s, i) => s + (results.recommendations[i]?.savings || 0), 0) * 12).toFixed(0)}/year
                </p>
                <button className="px-7 py-3 rounded-xl bg-green-500 text-[#060708] text-sm font-bold hover:bg-green-400 transition-colors">
                  Execute Plan →
                </button>
              </div>
            )}

            <button
              onClick={() => { setStep("services"); setResults(null); setAcceptedRecs([]); }}
              className="mt-4 w-full py-3 rounded-xl border border-white/[0.07] text-neutral-600 text-sm hover:text-neutral-400 transition-colors"
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
