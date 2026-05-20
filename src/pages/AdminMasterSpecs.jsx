import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Settings2, Pencil } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import API_ENDPOINTS from '../api';

const emptyForm = () => ({ label: '', options: [] });

const AdminMasterSpecs = () => {
    const [specs, setSpecs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm());
    const [newOptLabel, setNewOptLabel] = useState('');
    const [newOptPrice, setNewOptPrice] = useState('');
    const [editingOptIndex, setEditingOptIndex] = useState(null);

    useEffect(() => { fetchSpecs(); }, []);

    const fetchSpecs = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.MASTER_SPECS);
            setSpecs(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const addOption = () => {
        if (!newOptLabel.trim()) return;
        if (editingOptIndex !== null) {
            setFormData(p => ({
                ...p,
                options: p.options.map((opt, i) =>
                    i === editingOptIndex ? { label: newOptLabel.trim(), price: parseFloat(newOptPrice) || 0 } : opt
                )
            }));
            setEditingOptIndex(null);
        } else {
            setFormData(p => ({
                ...p,
                options: [...p.options, { label: newOptLabel.trim(), price: parseFloat(newOptPrice) || 0 }]
            }));
        }
        setNewOptLabel('');
        setNewOptPrice('');
    };

    const startEditOption = (index) => {
        const opt = formData.options[index];
        setNewOptLabel(opt.label);
        setNewOptPrice(opt.price > 0 ? String(opt.price) : '');
        setEditingOptIndex(index);
    };

    const cancelEditOption = () => {
        setNewOptLabel('');
        setNewOptPrice('');
        setEditingOptIndex(null);
    };

    const removeOption = (index) => {
        setFormData(p => ({ ...p, options: p.options.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? API_ENDPOINTS.MASTER_SPEC_BY_ID(editingId) : API_ENDPOINTS.MASTER_SPECS;
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) { fetchSpecs(); resetForm(); }
        } catch (e) { console.error(e); }
    };

    const handleEdit = (spec) => {
        setEditingId(spec._id);
        setFormData({ label: spec.label, options: spec.options.map(o => ({ label: o.label, price: o.price })) });
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this specification field?')) return;
        try {
            const res = await fetch(API_ENDPOINTS.MASTER_SPEC_BY_ID(id), { method: 'DELETE' });
            if (res.ok) fetchSpecs();
        } catch (e) { console.error(e); }
    };

    const resetForm = () => {
        setFormData(emptyForm());
        setEditingId(null);
        setIsAdding(false);
        setNewOptLabel('');
        setNewOptPrice('');
        setEditingOptIndex(null);
    };

    if (loading) return (
        <DashboardLayout title="Master Specifications">
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zg-accent" />
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout title="Master Specifications">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-2 flex items-center gap-3">
                        <Settings2 className="text-zg-accent" />
                        Master Specifications
                    </h1>
                    <p className="text-zg-secondary">Create reusable option fields (e.g. Bag Type, Cover Finish) and assign them to products.</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-zg-accent text-black px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20"
                    >
                        <Plus size={20} /> Add Field
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-8 mb-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-zg-secondary uppercase mb-2 tracking-wider">
                                Field Label
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Bag Type, Cover Finish"
                                className="w-full max-w-sm bg-zg-bg border border-zg-secondary/20 rounded-xl px-4 py-3 focus:border-zg-accent outline-none transition-all"
                                value={formData.label}
                                onChange={(e) => setFormData(p => ({ ...p, label: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-zg-secondary uppercase tracking-wider">Options</label>

                            <div className="flex flex-wrap gap-2 min-h-[48px] p-3 bg-zg-bg/50 rounded-xl border border-zg-secondary/10">
                                {formData.options.map((opt, i) => (
                                    <div key={i} className={`flex items-center gap-2 border pl-3 pr-1 py-1.5 rounded-lg transition-all ${editingOptIndex === i ? 'bg-zg-accent/10 border-zg-accent' : 'bg-zg-surface border-zg-secondary/20'}`}>
                                        <span className="text-sm font-bold">{opt.label}</span>
                                        {opt.price > 0 && (
                                            <span className="text-[10px] bg-zg-accent/20 text-zg-accent px-1.5 py-0.5 rounded font-mono">+₹{opt.price}</span>
                                        )}
                                        <button type="button" onClick={() => startEditOption(i)} className="p-1 hover:bg-zg-accent/10 text-zg-secondary hover:text-zg-accent rounded transition-colors">
                                            <Pencil size={11} />
                                        </button>
                                        <button type="button" onClick={() => { if (editingOptIndex === i) cancelEditOption(); removeOption(i); }} className="p-1 hover:bg-red-500/10 text-zg-secondary hover:text-red-500 rounded transition-colors">
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                {formData.options.length === 0 && (
                                    <p className="text-sm text-zg-secondary/40 italic">No options yet — add one below</p>
                                )}
                            </div>

                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-zg-secondary uppercase mb-1">Option Label</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. No Bag, Small Bag"
                                        className="w-full bg-zg-bg border border-zg-secondary/20 rounded-xl px-4 py-2.5 focus:border-zg-accent outline-none text-sm transition-all"
                                        value={newOptLabel}
                                        onChange={(e) => setNewOptLabel(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } }}
                                    />
                                </div>
                                <div className="w-36">
                                    <label className="block text-[10px] font-bold text-zg-secondary uppercase mb-1">Price Add-on (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="0 = free"
                                        className="w-full bg-zg-bg border border-zg-secondary/20 rounded-xl px-4 py-2.5 focus:border-zg-accent outline-none text-sm transition-all"
                                        value={newOptPrice}
                                        onChange={(e) => setNewOptPrice(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } }}
                                        min="0"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button
                                        type="button"
                                        onClick={addOption}
                                        className="bg-zg-secondary/10 hover:bg-zg-accent hover:text-black text-zg-primary px-4 py-2.5 rounded-xl transition-all font-bold text-sm"
                                    >
                                        {editingOptIndex !== null ? 'Update' : 'Add'}
                                    </button>
                                    {editingOptIndex !== null && (
                                        <button type="button" onClick={cancelEditOption} className="text-[10px] text-zg-secondary hover:text-zg-primary text-center transition-colors">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t border-zg-secondary/10">
                            <button type="button" onClick={resetForm} className="px-6 py-2.5 text-zg-secondary font-bold hover:text-zg-primary transition-all">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-zg-accent text-black px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20"
                            >
                                <Save size={18} /> {editingId ? 'Update Field' : 'Save Field'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {specs.length === 0 && !isAdding ? (
                <div className="py-20 text-center bg-zg-surface/30 border-2 border-dashed border-zg-secondary/10 rounded-3xl">
                    <Settings2 size={48} className="mx-auto mb-4 text-zg-secondary opacity-20" />
                    <p className="text-zg-secondary font-medium">No specification fields yet.</p>
                    <button onClick={() => setIsAdding(true)} className="mt-4 text-zg-accent font-bold hover:underline">
                        Create your first field
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {specs.map(spec => (
                        <div key={spec._id} className="bg-zg-surface/50 backdrop-blur-sm border border-zg-secondary/10 rounded-2xl p-6 hover:border-zg-accent/30 transition-all group flex flex-col gap-4 shadow-lg shadow-black/5">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg">{spec.label}</h3>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(spec)} className="p-2 text-zg-secondary hover:text-zg-accent hover:bg-zg-accent/10 rounded-lg transition-all">
                                        <Edit2 size={15} />
                                    </button>
                                    <button onClick={() => handleDelete(spec._id)} className="p-2 text-zg-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {spec.options.map((opt, i) => (
                                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-zg-bg/70 rounded-lg border border-zg-secondary/10">
                                        <span className="text-xs font-bold text-zg-primary">{opt.label}</span>
                                        {opt.price > 0 && (
                                            <span className="text-[9px] font-mono font-black text-zg-accent bg-zg-accent/15 px-1.5 py-0.5 rounded">+₹{opt.price}</span>
                                        )}
                                    </div>
                                ))}
                                {spec.options.length === 0 && (
                                    <span className="text-xs text-zg-secondary/40 italic">No options</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminMasterSpecs;
