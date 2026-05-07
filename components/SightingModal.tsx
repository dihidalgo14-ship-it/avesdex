"use client";
import { useState, useRef } from "react";
import { Bird } from "@/types";
import { useSightings } from "@/hooks/useSightings";

interface Props {
  bird: Bird;
  onClose: () => void;
}

export default function SightingModal({ bird, onClose }: Props) {
  const { addSighting } = useSightings();
  const [location, setLocation]   = useState("");
  const [notes, setNotes]         = useState("");
  const [isPublic, setIsPublic]   = useState(true);
  const [photo, setPhoto]         = useState<File | null>(null);
  const [preview, setPreview]     = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhoto(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await addSighting({
        birdUid:   bird.uid,
        birdName:  bird.name.spanish,
        birdThumb: bird.images?.thumb || "",
        location, notes, isPublic,
        photo: photo || undefined,
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          {bird.images?.thumb && (
            <img src={bird.images.thumb} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
          )}
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>
              ¡Vista! {bird.name.spanish}
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-muted)", fontStyle: "italic" }}>{bird.name.latin}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--ink-faint)", lineHeight: 1 }}>×</button>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          <div>
            <label style={{ fontSize: 11, color: "var(--ink-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>LUGAR</label>
            <input
              type="text" value={location} onChange={(e) => setLocation(e.target.value)}
              placeholder="ej: Laguna de Aculeo, Santiago"
              style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "var(--ink)", outline: "none", fontFamily: "var(--font-body)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: "var(--ink-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>NOTAS</label>
            <textarea
              value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="¿Qué comportamiento observaste? ¿Con quién ibas?"
              rows={3}
              style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "var(--ink)", outline: "none", resize: "none", fontFamily: "var(--font-body)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Photo */}
          <div>
            <label style={{ fontSize: 11, color: "var(--ink-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>FOTO (opcional)</label>
            {preview ? (
              <div style={{ position: "relative", display: "inline-block" }}>
                <img src={preview} alt="" style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover", border: "1px solid var(--border)" }} />
                <button onClick={() => { setPhoto(null); setPreview(null); }}
                  style={{ position: "absolute", top: -6, right: -6, background: "var(--accent)", border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", fontSize: 11, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()}
                style={{ background: "var(--bg)", border: "1.5px dashed var(--border)", borderRadius: 8, padding: "10px 16px", fontSize: 12, color: "var(--ink-muted)", cursor: "pointer", width: "100%" }}>
                📷 Agregar foto
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
          </div>

          {/* Public toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>Compartir en el feed</div>
              <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>Visible para la comunidad</div>
            </div>
            <button onClick={() => setIsPublic(!isPublic)} style={{
              width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
              background: isPublic ? "var(--accent)" : "var(--border)",
              position: "relative", transition: "background 0.2s",
            }}>
              <span style={{ position: "absolute", top: 3, left: isPublic ? 20 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", border: "1px solid var(--border)", borderRadius: 8, background: "none", cursor: "pointer", fontSize: 13, color: "var(--ink-muted)", fontFamily: "var(--font-body)" }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ flex: 2, padding: "10px", border: "none", borderRadius: 8, background: "var(--accent)", cursor: saving ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: "var(--font-body)", opacity: saving ? 0.7 : 1, transition: "opacity 0.15s" }}>
            {saving ? "Guardando..." : "✓ Marcar como vista"}
          </button>
        </div>
      </div>
    </div>
  );
}
