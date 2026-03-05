import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#060708] flex flex-col items-center justify-center px-5">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            cardBox: "w-full bg-[#060708] shadow-none border-0",
            card: "w-full bg-[#060708] shadow-none border-0 p-0",
            headerTitle: "text-2xl font-bold tracking-tight text-neutral-100",
            headerSubtitle: "text-neutral-500 text-sm",
            socialButtonsBlockButton:
              "w-full py-3.5 rounded-xl border border-white/[0.07] bg-white/[0.025] text-neutral-300 hover:bg-white/[0.04] text-sm",
            socialButtonsBlockButtonText: "text-neutral-300 text-sm",
            dividerLine: "bg-white/[0.07]",
            dividerText: "text-neutral-600 text-xs",
            formFieldLabel: "text-neutral-400 text-sm",
            formFieldInput:
              "w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-neutral-100 text-sm placeholder:text-neutral-600",
            formButtonPrimary:
              "w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-400 text-[#060708] font-semibold text-[15px] shadow-none",
            footerActionLink: "text-green-500 hover:text-green-400",
            footer: "bg-transparent",
            footerAction: "text-neutral-500",
            identityPreviewText: "text-neutral-300",
            identityPreviewEditButton: "text-green-500",
          },
        }}
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}
