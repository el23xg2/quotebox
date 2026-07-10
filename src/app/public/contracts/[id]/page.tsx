"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function PublicContractPage() {
  const params = useParams();
  const [contract, setContract] = useState<any>(null);
  const [signed, setSigned] = useState(false);
  const [signatureType, setSignatureType] = useState<"typed" | "drawn">("typed");
  const [typedSignature, setTypedSignature] = useState("");
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    loadContract();
  }, [params.id]);

  async function loadContract() {
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase
      .from("contracts")
      .select("*, clients(name)")
      .eq("id", params.id)
      .single();

    if (data) {
      setContract(data);
      if (data.status === "signed") setSigned(true);
    }
    setLoading(false);
  }

  async function handleSign() {
    if (!contract) return;

    if (signatureType === "typed" && !typedSignature.trim()) {
      alert("Please type your name to sign.");
      return;
    }

    setSigning(true);

    const signatureData =
      signatureType === "typed"
        ? typedSignature
        : canvasRef?.toDataURL() || "";

    const res = await fetch(`/api/contracts/${contract.id}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        signatureType,
        signatureData,
        clientName: contract.clients?.name || "Client",
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Failed to sign contract. Please try again.");
      setSigning(false);
      return;
    }

    setSigned(true);
    setSigning(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;
  if (!contract) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">Contract not found.</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-sm font-bold text-white">Q</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">QuoteBox</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{contract.title}</h1>
          {contract.clients && (
            <p className="text-gray-500">for {contract.clients.name}</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10 mb-6">
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
            {contract.content}
          </pre>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          {signed ? (
            <div className="text-center py-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Contract Signed!</h2>
              <p className="text-gray-500 mt-2">
                Thank you. A copy of the signed contract has been sent to both parties.
              </p>
            </div>
          ) : contract.status === "sent" ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sign this contract</h2>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setSignatureType("typed")}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                    signatureType === "typed"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Type
                </button>
                <button
                  onClick={() => setSignatureType("drawn")}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                    signatureType === "drawn"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Draw
                </button>
              </div>

              {signatureType === "typed" ? (
                <input
                  type="text"
                  placeholder="Type your full name"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-medium focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <div className="border border-gray-300 rounded-lg">
                  <canvas
                    ref={(ref) => setCanvasRef(ref)}
                    width={600}
                    height={150}
                    className="w-full cursor-crosshair touch-none"
                    onMouseDown={(e) => {
                      const canvas = e.currentTarget;
                      const ctx = canvas.getContext("2d");
                      if (!ctx) return;
                      const rect = canvas.getBoundingClientRect();
                      const scaleX = canvas.width / rect.width;
                      const scaleY = canvas.height / rect.height;
                      const x = (e.clientX - rect.left) * scaleX;
                      const y = (e.clientY - rect.top) * scaleY;
                      ctx.beginPath();
                      ctx.moveTo(x, y);
                      ctx.strokeStyle = "#000";
                      ctx.lineWidth = 2 * scaleX;
                      const onMove = (me: MouseEvent) => {
                        const rx = (me.clientX - rect.left) * scaleX;
                        const ry = (me.clientY - rect.top) * scaleY;
                        ctx.lineTo(rx, ry);
                        ctx.stroke();
                      };
                      const onUp = () => {
                        document.removeEventListener("mousemove", onMove);
                        document.removeEventListener("mouseup", onUp);
                      };
                      document.addEventListener("mousemove", onMove);
                      document.addEventListener("mouseup", onUp);
                    }}
                    onTouchStart={(e) => {
                      const canvas = e.currentTarget;
                      const ctx = canvas.getContext("2d");
                      if (!ctx) return;
                      const rect = canvas.getBoundingClientRect();
                      const scaleX = canvas.width / rect.width;
                      const scaleY = canvas.height / rect.height;
                      const touch = e.touches[0];
                      const x = (touch.clientX - rect.left) * scaleX;
                      const y = (touch.clientY - rect.top) * scaleY;
                      ctx.beginPath();
                      ctx.moveTo(x, y);
                      ctx.strokeStyle = "#000";
                      ctx.lineWidth = 2 * scaleX;
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const canvas = e.currentTarget;
                      const ctx = canvas.getContext("2d");
                      if (!ctx) return;
                      const rect = canvas.getBoundingClientRect();
                      const scaleX = canvas.width / rect.width;
                      const scaleY = canvas.height / rect.height;
                      const touch = e.touches[0];
                      const x = (touch.clientX - rect.left) * scaleX;
                      const y = (touch.clientY - rect.top) * scaleY;
                      ctx.lineTo(x, y);
                      ctx.stroke();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      const ctx = e.currentTarget.getContext("2d");
                      ctx?.closePath();
                    }}
                  />
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2 mb-6">
                By signing, you agree to the terms and conditions outlined above.
              </p>

              <button
                onClick={handleSign}
                disabled={signing}
                className="w-full rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {signing ? "Signing..." : "Sign Contract"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
