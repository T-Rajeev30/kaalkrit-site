"use client";
import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [done, setDone] = useState("");
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setDone("Copied"); }
    catch { const r = document.createRange(); r.selectNodeContents(document.getElementById("mail")!); const s = getSelection(); s?.removeAllRanges(); s?.addRange(r); setDone("Selected: press Ctrl+C"); }
    setTimeout(() => setDone(""), 2400);
  };
  return (
    <div className="mailrow">
      <span id="mail" className="mail">{email}</span>
      <button type="button" className="btn solid" onClick={copy}>{done || "Copy email"}</button>
    </div>
  );
}
