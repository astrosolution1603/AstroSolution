"use client";

import { useState, useEffect } from "react";
import { Video, Upload } from "lucide-react";

export default function AstrologerPoojasPage() {
  const [poojas, setPoojas] = useState([]);
  const [uploading, setUploading] = useState<string | null>(null);

  // In a real app, this would fetch from an API
  // useEffect(() => { fetch("/api/astrologer/poojas").then(res => res.json()).then(setPoojas); }, []);

  const handleUpload = async (poojaId: string, file: File) => {
    setUploading(poojaId);
    const formData = new FormData();
    formData.append("poojaId", poojaId);
    formData.append("video", file);

    try {
      const res = await fetch("/api/pooja/upload-proof", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        alert("Video uploaded successfully!");
        // refresh poojas
      } else {
        alert("Upload failed. Ensure Supabase is configured.");
      }
    } catch (e) {
      alert("Error uploading video.");
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-white/5 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Video className="text-primary w-8 h-8" />
            My Assigned Poojas
          </h1>
          <p className="text-muted-foreground mt-1">Upload video proofs for completed Poojas.</p>
        </div>
      </div>

      <div className="bg-card p-8 rounded-2xl border border-white/5 text-center text-muted-foreground">
        <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-foreground">No Pending Poojas</h2>
        <p className="mt-2 text-sm">When users book a Pooja with you, they will appear here so you can upload the video proof.</p>
        
        {/* Example hidden UI for upload */}
        <div className="hidden">
          <input type="file" accept="video/mp4,video/quicktime" onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleUpload("test-pooja-id", e.target.files[0]);
            }
          }} />
        </div>
      </div>
    </div>
  );
}
