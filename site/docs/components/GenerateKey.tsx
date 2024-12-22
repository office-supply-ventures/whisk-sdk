import { useMemo, useState } from "react";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import clsx from "clsx";

export default function GenerateKey() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email");

    if (email) {
      setState("loading");

      try {
        const resp = await fetch(`https://api.whisk.so/generate-key`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (resp.ok) {
          const data = await resp.json();
          console.log(`Generated key:`, data);
          setState("success");
        } else {
          console.error(`Failed to generate key:`, resp.statusText, await resp.text());
          setState("error");
        }
      } catch (err) {
        console.error(`Fetch error GenerateKey:`, err);
        setState("error");
      }
    }
  }

  const inner = useMemo(() => {
    switch (state) {
      case "success":
        return (
          <div className="flex flex-col gap-4 items-center justify-center text-center">
            <CircleCheck size={80} className="stroke-green-400" />
            <span className="text-[24px] text-green-400">Success</span>
            <span className="text-[#A7A7A8]">Check your email for your API key!</span>
            <button onClick={() => setState("idle")}>Go back</button>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col gap-4 items-center justify-center text-center">
            <CircleX size={80} className="stroke-red-400" />
            <span className="text-[24px] text-red-400">OOPS</span>
            <span className="text-[#A7A7A8]">Something went wrong and we are looking into it. Try again later</span>
            <button onClick={() => setState("idle")}>Go back</button>
          </div>
        );
      default:
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="p-3 rounded-[4px]"
            />
            <button
              type="submit"
              className={clsx(
                "bg-[#5b5bd6] rounded-[4px] p-2 border  text-white disabled:bg-white/10 items-center justify-center flex h-[42px]",
                state == "loading" ? "border-transparent" : "border-[#6e6ade]"
              )}
              disabled={state != "idle"}
            >
              {state == "loading" ? <LoaderCircle size={20} className="animate-spin" /> : "Create API Key"}
            </button>
            <div className="text-xs text-center text-[#A7A7A8]">
              By submitting this form, you agree to our terms and privacy policy as well as give consent to reach you
              for marketing purposes.
            </div>
          </form>
        );
    }
  }, [state]);

  return <div className="bg-[#323035] p-5 max-w-[400px] rounded-[4px] border border-[#3c393f]">{inner}</div>;
}
