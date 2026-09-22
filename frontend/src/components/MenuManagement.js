import React, { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Pencil, ImagePlus, Move } from "lucide-react";
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, uploadMenuImage } from "../api";

const CATEGORIES = ["Starters", "Mains", "Dips", "Sides", "Desserts", "Drinks"];

const EMPTY_FORM = {
  name: "",
  category: "Mains",
  price: "",
  ingredients: [],
  imageUrl: "",
  imagePosition: "50% 50%",
  available: true,
};

/* ─────────────────────────────────────────────────────────────────────────────
   Drag-to-reposition image editor
   Directly mutates the img DOM node's objectPosition on every frame —
   no React re-renders during the drag.  onChange fires once on mouseup.
───────────────────────────────────────────────────────────────────────────── */
function ImagePositionEditor({ src, position, onChange }) {
  const containerRef = useRef(null);
  const imgRef       = useRef(null);
  const dragging     = useRef(false);
  const lastXY       = useRef({ x: 0, y: 0 });
  // Live position tracked as a plain ref (not state) to avoid re-renders
  const livePos      = useRef(position);
  // Keep onChange fresh without re-registering the effect
  const onChangeRef  = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  // When the committed position prop changes (e.g. reset), sync the ref
  useEffect(() => { livePos.current = position; }, [position]);

  const parse = (pos) => {
    const [x = "50%", y = "50%"] = (pos || "50% 50%").split(" ");
    return { px: parseFloat(x), py: parseFloat(y) };
  };
  const clamp = (v) => Math.max(0, Math.min(100, v));

  // Register global mouse listeners once on mount
  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const dx = e.clientX - lastXY.current.x;
      const dy = e.clientY - lastXY.current.y;
      lastXY.current = { x: e.clientX, y: e.clientY };

      const { px: curX, py: curY } = parse(livePos.current);
      const newX = clamp(curX - (dx / rect.width)  * 100);
      const newY = clamp(curY - (dy / rect.height) * 100);
      const newPos = `${newX.toFixed(1)}% ${newY.toFixed(1)}%`;

      // ✅ Mutate DOM directly — instant visual feedback, zero React lag
      livePos.current = newPos;
      if (imgRef.current) imgRef.current.style.objectPosition = newPos;
    };

    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      // Commit final position to React state once drag ends
      onChangeRef.current(livePos.current);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, []); // runs once only

  const onMouseDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    lastXY.current   = { x: e.clientX, y: e.clientY };
  };

  return (
    <div
      ref={containerRef}
      className="admin-img-reposition"
      onMouseDown={onMouseDown}
    >
      <img
        ref={imgRef}
        src={src}
        alt="Dish preview"
        className="admin-img-preview"
        style={{ objectPosition: position }}
        draggable={false}
      />
      <div className="admin-img-reposition-hint">
        <Move size={16} strokeWidth={2} />
        <span>Drag to reposition</span>
      </div>
    </div>
  );
}

/* ── Dish modal (add & edit) ─────────────────────────────────────────────── */
function DishModal({ initial, onSave, onDelete, onClose, saving }) {
  const isEdit = Boolean(initial?._id);
  const [form, setForm] = useState(
    initial
      ? { ...EMPTY_FORM, ...initial, ingredients: initial.ingredients ?? [], imagePosition: initial.imagePosition || "50% 50%" }
      : EMPTY_FORM
  );
  const [ingInput,      setIngInput]      = useState("");
  const [imgUploading,  setImgUploading]  = useState(false);
  const [imgPreview,    setImgPreview]    = useState(initial?.imageUrl || "");
  const fileInputRef = useRef(null);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const addIngredient = () => {
    const val = ingInput.trim().toLowerCase();
    if (val && !form.ingredients.includes(val)) {
      set("ingredients", [...form.ingredients, val]);
    }
    setIngInput("");
  };

  const removeIngredient = (ing) =>
    set("ingredients", form.ingredients.filter((i) => i !== ing));

  const handleIngKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient();
    }
  };

  const handleImageSelect = async (file) => {
    if (!file) return;
    setImgPreview(URL.createObjectURL(file));
    // Reset position for a new image
    set("imagePosition", "50% 50%");
    setImgUploading(true);
    try {
      const { imageUrl } = await uploadMenuImage(file);
      set("imageUrl", imageUrl);
    } catch {
      alert("Image upload failed. Please try again.");
      setImgPreview(form.imageUrl || "");
    } finally {
      setImgUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalIngredients = [...form.ingredients];
    const pending = ingInput.trim().toLowerCase();
    if (pending && !finalIngredients.includes(pending)) finalIngredients.push(pending);
    onSave({ ...form, ingredients: finalIngredients });
  };

  return (
    <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">{isEdit ? "Edit dish" : "Add dish"}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Dish name *</label>
            <input
              className="admin-form-input"
              placeholder="e.g. Charcoal Grilled Chicken"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>

          {/* ── Image upload + reposition ─────────────────────────────── */}
          <div className="admin-form-group">
            <label className="admin-form-label">Dish photo</label>

            {/* Show reposition editor once we have a preview */}
            {imgPreview && !imgUploading ? (
              <>
                <ImagePositionEditor
                  src={imgPreview}
                  position={form.imagePosition}
                  onChange={(pos) => set("imagePosition", pos)}
                />
                <div className="admin-img-actions">
                  <button
                    type="button"
                    className="admin-img-change-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change photo
                  </button>
                  <button
                    type="button"
                    className="admin-img-remove-btn"
                    onClick={() => { setImgPreview(""); set("imageUrl", ""); set("imagePosition", "50% 50%"); }}
                  >
                    Remove photo
                  </button>
                </div>
              </>
            ) : (
              <div
                className={`admin-img-dropzone${imgUploading ? " uploading" : ""}`}
                onClick={() => !imgUploading && fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              >
                {imgUploading ? (
                  <div className="admin-img-overlay">
                    <span>Uploading…</span>
                  </div>
                ) : (
                  <div className="admin-img-placeholder">
                    <ImagePlus size={28} strokeWidth={1.4} style={{ color: "rgba(189,159,103,0.5)" }} />
                    <span>Click or drag &amp; drop a photo</span>
                    <span style={{ fontSize: 11, opacity: 0.5 }}>JPG, PNG, WebP — max 5 MB</span>
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageSelect(e.target.files[0])}
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Category *</label>
              <select
                className="admin-form-select"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                required
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Price (Rs) *</label>
              <input
                className="admin-form-input"
                type="number"
                min="0"
                placeholder="1650"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                required
              />
            </div>
          </div>

          {/* ── Ingredients tag input ──────────────────────────────────── */}
          <div className="admin-form-group">
            <label className="admin-form-label">Ingredients</label>
            <div className="admin-ingredient-box">
              {form.ingredients.map((ing) => (
                <span className="admin-ingredient-pill" key={ing}>
                  {ing}
                  <button
                    type="button"
                    className="admin-ingredient-pill__remove"
                    onClick={() => removeIngredient(ing)}
                    aria-label={`Remove ${ing}`}
                  >×</button>
                </span>
              ))}
              <input
                className="admin-ingredient-input"
                placeholder="e.g. chicken — press Enter or comma"
                value={ingInput}
                onChange={(e) => setIngInput(e.target.value)}
                onKeyDown={handleIngKeyDown}
                onBlur={addIngredient}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Availability</label>
            <select
              className="admin-form-select"
              value={form.available ? "true" : "false"}
              onChange={(e) => set("available", e.target.value === "true")}
            >
              <option value="true">Available</option>
              <option value="false">86'd (unavailable)</option>
            </select>
          </div>

          <div className="admin-modal-footer">
            {isEdit && (
              <button
                type="button"
                className="admin-btn-danger"
                onClick={() => onDelete(initial._id)}
                disabled={saving}
              >
                Delete
              </button>
            )}
            <button type="submit" className="admin-btn-primary" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add dish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function MenuManagement() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null); // null | "add" | { item }
  const [saving, setSaving]   = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getMenuItems()
      .then((data) => setItems(data.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleAvailability = async (item) => {
    try {
      const updated = await updateMenuItem(item._id, { available: !item.available });
      setItems((prev) => prev.map((i) => (i._id === item._id ? updated.item : i)));
    } catch {}
  };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal?.item) {
        const res = await updateMenuItem(modal.item._id, {
          name:          form.name,
          category:      form.category,
          price:         Number(form.price),
          ingredients:   form.ingredients,
          imageUrl:      form.imageUrl,
          imagePosition: form.imagePosition,
          available:     form.available,
        });
        setItems((prev) => prev.map((i) => (i._id === modal.item._id ? res.item : i)));
      } else {
        const res = await createMenuItem({
          name:          form.name,
          category:      form.category,
          price:         Number(form.price),
          ingredients:   form.ingredients,
          imageUrl:      form.imageUrl,
          imagePosition: form.imagePosition,
          available:     form.available,
        });
        setItems((prev) => [...prev, res.item]);
      }
      setModal(null);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this dish?")) return;
    setSaving(true);
    try {
      await deleteMenuItem(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
      setModal(null);
    } catch {
      alert("Failed to delete.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-section-header">
        <span>Menu items</span>
        <button type="button" className="admin-add-btn" onClick={() => setModal("add")}>
          <Plus size={15} strokeWidth={2} />
          Add dish
        </button>
      </div>

      {loading && <p className="admin-menu-loading">Loading menu…</p>}

      {!loading && items.length === 0 && (
        <p className="admin-menu-loading">No dishes yet. Click "Add dish" to get started.</p>
      )}

      {CATEGORIES.map((category) => {
        const categoryItems = items.filter((item) => item.category === category);
        return (
          <div key={category} className="admin-menu-group">
            <div className="admin-menu-category">{category}</div>
            <div className="admin-menu-grid">
              {categoryItems.length === 0 ? (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontStyle: "italic", margin: "8px 0" }}>
                  No dishes in this category yet.
                </p>
              ) : (
                categoryItems.map((item) => (
                  <div className="admin-menu-card" key={item._id}>
                    {item.imageUrl && (
                      <div className="admin-card-thumb">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{ objectPosition: item.imagePosition || "50% 50%" }}
                        />
                      </div>
                    )}
                    <div className="admin-menu-card-top">
                      <span className="admin-menu-name">{item.name}</span>
                      <button
                        type="button"
                        className="admin-icon-btn small"
                        aria-label={`Edit ${item.name}`}
                        onClick={() => setModal({ item })}
                      >
                        <Pencil size={14} strokeWidth={1.8} />
                      </button>
                    </div>

                    {item.ingredients && item.ingredients.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, display: "block", marginBottom: 5 }}>Ingredients</span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {item.ingredients.map((ing) => (
                            <span key={ing} style={{
                              background: "rgba(201,163,97,0.15)",
                              border: "1px solid rgba(201,163,97,0.35)",
                              color: "rgba(201,163,97,0.9)",
                              fontSize: 11,
                              padding: "2px 8px",
                              borderRadius: 999,
                              textTransform: "capitalize",
                            }}>{ing}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="admin-menu-card-bottom">
                      <span className="admin-menu-price">
                        Rs {Number(item.price).toLocaleString("en-PK")}
                      </span>
                      <button
                        type="button"
                        className={`admin-availability-toggle${item.available ? " on" : ""}`}
                        onClick={() => toggleAvailability(item)}
                      >
                        {item.available ? "Available" : "86'd"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}

      {modal && (
        <DishModal
          initial={modal === "add" ? null : { ...modal.item, price: modal.item.price }}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}
    </>
  );
}