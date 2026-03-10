import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, List, X, Search, Loader2, Edit2, Trash2, Printer, Mail, Send, FileText, CheckCircle2 } from 'lucide-react';

const CourtRegister = () => {
    const [activeTab, setActiveTab] = useState('MarInward');
    const [entries, setEntries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [otherSection, setOtherSection] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // --- नवीन स्टेट्स (Selection & Amount साठी) ---
    const [selectedEntries, setSelectedEntries] = useState([]);
    const [showStampModal, setShowStampModal] = useState(false);
    const [stampAmount, setStampAmount] = useState("");

    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    const getTodayDate = () => new Date().toISOString().split('T')[0];
    const sectionOptions = ["Statistical", "Computer", "EST", "Building", "HighCourt", "Legal Aid", "Police Station", "Other"];

    const config = {
        MarInward: { title: "मराठी आवक रजिस्टर", endpoint: "/inward/marathi", lang: "marathi", color: "orange", fields: [{ id: 'date', label: 'तारीख' }, { id: 'officeSrNo', label: 'अनु. क्र.' }, { id: 'section', label: 'विभाग' }, { id: 'inwardRef', label: 'आवक संदर्भ' }, { id: 'fromWhom', label: 'कोणाकडून आले' }, { id: 'subject', label: 'विषय' }, { id: 'remarks', label: 'शेरा' }] },
        EngInward: { title: "English Inward Register", endpoint: "/inward/english", lang: "english", color: "blue", fields: [{ id: 'date', label: 'Date' }, { id: 'officeSrNo', label: 'Sr. No.' }, { id: 'section', label: 'Section' }, { id: 'inwardRef', label: 'Inward Ref' }, { id: 'fromWhom', label: 'From Whom' }, { id: 'subject', label: 'Subject' }, { id: 'remarks', label: 'Remarks' }] },
        MarOutward: { title: "मराठी जावक रजिस्टर", endpoint: "/outward/marathi", lang: "marathi", color: "orange", isOutward: true, fields: [{ id: 'date', label: 'तारीख' }, { id: 'officeSrNo', label: 'अनु. क्र.' }, { id: 'section', label: 'विभाग' }, { id: 'outwardRef', label: 'जावक संदर्भ' }, { id: 'toWhom', label: 'कोणास पाठविले' }, { id: 'subject', label: 'विषय' }, { id: 'deliveryMode', label: 'मोड', type: 'radio', options: ['By Hand', 'By Post'] }, { id: 'remarks', label: 'शेरा' }] },
        EngOutward: { title: "English Outward Register", endpoint: "/outward/english", lang: "english", color: "blue", isOutward: true, fields: [{ id: 'date', label: 'Date' }, { id: 'officeSrNo', label: 'Sr. No.' }, { id: 'section', label: 'Section' }, { id: 'outwardRef', label: 'Outward Ref' }, { id: 'toWhom', label: 'To Whom' }, { id: 'subject', label: 'Subject' }, { id: 'deliveryMode', label: 'Mode', type: 'radio', options: ['By Hand', 'By Post'] }, { id: 'remarks', label: 'Remarks' }] },
        PostTracking: { title: "Post Tracking Sheet", endpoint: "/post-tracking", lang: "both", color: "purple", isTracking: true, fields: [{ id: 'date', label: 'Date' }, { id: 'officeSrNo', label: 'Sr. No.' }, { id: 'source', label: 'Register' }, { id: 'toWhom', label: 'Sent To' }, { id: 'subject', label: 'Subject' }, { id: 'stampAmount', label: 'Amount (₹)' }] }
    };

    const current = config[activeTab];

    const closeForm = useCallback(() => {
        setShowForm(false);
        setFormData({});
        setOtherSection("");
        setEditingId(null);
    }, []);

    const fetchEntries = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}${current.endpoint}`);
            setEntries(Array.isArray(res.data) ? res.data : []);
        } catch (err) { setEntries([]); }
        finally { setLoading(false); }
    }, [BASE_URL, current.endpoint]);

    useEffect(() => {
        fetchEntries();
        setSelectedEntries([]); // टॅब बदलल्यावर सिलेक्शन रिसेट करा
    }, [activeTab, fetchEntries]);

    // --- Bulk Save Function ---
    const handleBulkPostSave = async () => {
        if (!stampAmount) return alert("कृपया रक्कम टाका");
        setLoading(true);
        const source = current.lang === "marathi" ? "Marathi" : "English";
        try {
            await axios.post(`${BASE_URL}/post-tracking`, {
                ids: selectedEntries,
                amount: stampAmount,
                source: source
            });
            alert("Updated Successfully!");
            setSelectedEntries([]);
            setStampAmount("");
            setShowStampModal(false);
            fetchEntries();
        } catch (err) { alert("Error saving amount"); }
        finally { setLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        const submissionData = { ...formData };
        if (submissionData.section === "Other") submissionData.section = otherSection;
        try {
            if (editingId) await axios.put(`${BASE_URL}${current.endpoint}/${editingId}`, submissionData);
            else await axios.post(`${BASE_URL}${current.endpoint}`, submissionData);
            closeForm();
            fetchEntries();
        } catch (err) { alert("Save error: " + (err.message)); }
        finally { setLoading(false); }
    };
    const handleEdit = (entry) => {
        // Pick whichever value exists, favoring 'mode' if 'deliveryMode' is old
        const currentMode = entry.mode || entry.deliveryMode || 'By Post';

        setFormData({
            ...entry,
            deliveryMode: currentMode // This controls the Radio Buttons
        });

        if (entry.section && !sectionOptions.includes(entry.section)) {
            setOtherSection(entry.section);
        }
        setEditingId(entry.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete entry?")) return;
        try { await axios.delete(`${BASE_URL}${current.endpoint}/${id}`); fetchEntries(); }
        catch (err) { alert("Delete failed"); }
    };

    const filteredEntries = entries.filter(entry => {
        const matchesSearch = Object.values(entry).some(v => v?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesDate = (!startDate || entry.date >= startDate) && (!endDate || entry.date <= endDate);
        return matchesSearch && matchesDate;
    });

    return (
        <div className="p-4 md:p-8 bg-slate-100 min-h-screen font-sans">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body * { visibility: hidden !important; }
                    #printable-area, #printable-area * { visibility: visible !important; }
                    #printable-area { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; margin: 0 !important; }
                    .print-header-only { display: block !important; text-align: center; font-size: 18pt; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #000; }
                    .print-hidden { display: none !important; }
                    table { border-collapse: collapse !important; width: 100% !important; }
                    th, td { border: 1px solid #000 !important; padding: 6px !important; color: #000 !important; font-size: 9pt !important; }
                }
                .print-header-only { display: none; }
                .custom-scroll-container { max-height: calc(100vh - 320px); overflow: auto; border-radius: 0 0 1.5rem 1.5rem; }
                .custom-scroll-container::-webkit-scrollbar { width: 8px; height: 8px; }
                .custom-scroll-container::-webkit-scrollbar-track { background: #f1f5f9; }
                .custom-scroll-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .sticky-header th { position: sticky; top: 0; background: #f8fafc; z-index: 20; box-shadow: 0 1px 0 #e2e8f0; }
            ` }} />

            {/* TAB NAVIGATION */}
            <div className="max-w-[1600px] mx-auto mb-6 grid grid-cols-2 lg:grid-cols-5 gap-3 print-hidden">
                {Object.keys(config).map((tabKey) => (
                    <button key={tabKey} onClick={() => setActiveTab(tabKey)}
                        className={`p-4 rounded-2xl font-bold transition-all border-2 flex flex-col items-center justify-center gap-1
                        ${activeTab === tabKey ? `bg-indigo-600 text-white border-indigo-600 shadow-xl scale-[1.02]` : 'bg-white text-slate-500 border-white hover:border-indigo-200 shadow-sm'}`}>
                        <span className="text-[10px] uppercase tracking-widest opacity-70">{config[tabKey].lang}</span>
                        <span className="text-sm">{config[tabKey].title}</span>
                    </button>
                ))}
            </div>

            <div className="max-w-[1600px] mx-auto bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 print-hidden">
                    <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4 w-full xl:w-auto">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><List size={28} /></div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">{current.title}</h2>
                                <p className="text-slate-400 text-sm font-medium">Total: {filteredEntries.length}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="text" placeholder="Quick search..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none"
                                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            <button onClick={() => window.print()} className="p-3 bg-slate-800 text-white rounded-2xl hover:bg-black transition-all flex items-center gap-2"><Printer size={20} /></button>
                            {!current.isTracking && (
                                <button onClick={() => { setFormData({ date: getTodayDate(), officeSrNo: "Auto", deliveryMode: "By Post" }); setShowForm(true); }}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all">
                                    <Plus size={20} /> New Entry
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div id="printable-area">
                    <div className="print-header-only">न्यायालयीन रजिस्टर: {current.title}</div>
                    <div className="custom-scroll-container">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="sticky-header">
                                <tr>
                                    {/* CHECKBOX HEADER (Only for Outward) */}
                                    {current.isOutward && <th className="p-5 w-10 print-hidden"></th>}
                                    {current.fields.map(f => (
                                        <th key={f.id} className="p-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">{f.label}</th>
                                    ))}
                                    <th className="p-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest print-hidden">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={10} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" size={40} /></td></tr>
                                ) : filteredEntries.length > 0 ? (
                                    filteredEntries.map((e, i) => {
                                        // --- GROUPING LOGIC START ---
                                        const isTrackingTab = activeTab === 'PostTracking';

                                        // Check if this row is the first one in a combined batch
                                        const isFirstInGroup = !isTrackingTab || i === 0 || !e.trackingGroupId || e.trackingGroupId !== filteredEntries[i - 1].trackingGroupId;

                                        // Apply a different background color and remove the top border for subsequent rows in the same group
                                        const rowClass = isTrackingTab && !isFirstInGroup
                                            ? "border-t-0 bg-slate-50/40"
                                            : "border-t border-slate-100";
                                        // --- GROUPING LOGIC END ---

                                        return (
                                            <tr key={i} className={`hover:bg-indigo-50/30 transition-colors group ${selectedEntries.includes(e.id) ? 'bg-indigo-50' : ''} ${rowClass}`}>

                                                {/* CHECKBOX COLUMN */}
                                                {current.isOutward && (
                                                    <td className="p-5 print-hidden text-center">
                                                        {e.mode === 'By Post' ? (
                                                            <input
                                                                type="checkbox"
                                                                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                                                                checked={selectedEntries.includes(e.id)}
                                                                onChange={() => setSelectedEntries(prev =>
                                                                    prev.includes(e.id) ? prev.filter(id => id !== e.id) : [...prev, e.id]
                                                                )}
                                                            />
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400 font-bold">BY HAND</span>
                                                        )}
                                                    </td>
                                                )}

                                                {current.fields.map(f => {
                                                    let value = e[f.id] || e['mode'] || e['deliveryMode'] || '-';

                                                    // --- ROWSPAN LOGIC FOR AMOUNT ---
                                                    if (f.id === 'stampAmount') {
                                                        // 1. Skip rendering this cell if it's not the first in the group
                                                        if (!isFirstInGroup) return null;

                                                        // 2. Calculate how many rows this cell should "cover"
                                                        const groupSize = e.trackingGroupId
                                                            ? filteredEntries.filter(item => item.trackingGroupId === e.trackingGroupId).length
                                                            : 1;

                                                        const amountValue = e.stampAmount || e.postAmount;

                                                        return (
                                                            <td
                                                                key={f.id}
                                                                rowSpan={groupSize}
                                                                className="p-5 text-sm font-black text-indigo-600 bg-indigo-50/30 border-l-2 border-indigo-200 align-middle text-center"
                                                            >
                                                                <div className="flex flex-col items-center justify-center">
                                                                    <span className="text-lg">₹ {amountValue}</span>
                                                                    {groupSize > 1 && (
                                                                        <span className="text-[9px] text-indigo-400 uppercase font-bold tracking-tighter">
                                                                            Merged ({groupSize} Items)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        );
                                                    }

                                                    // Default rendering for other columns
                                                    return (
                                                        <td key={f.id} className="p-5 text-sm font-semibold text-slate-700">
                                                            {value}
                                                        </td>
                                                    );
                                                })}

                                                <td className="p-5 text-center print-hidden">
                                                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEdit(e)} className="p-2 bg-white text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Edit2 size={16} /></button>
                                                        {!current.isTracking && <button onClick={() => handleDelete(e.id)} className="p-2 bg-white text-rose-500 border border-rose-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16} /></button>}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan={10} className="p-20 text-center text-slate-400 font-medium italic">No entries found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* FLOATING ACTION BAR (When checkboxes are selected) */}
            {selectedEntries.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-6 z-[110] animate-bounce-in">
                    <span className="text-sm font-bold"><CheckCircle2 className="inline mr-2 text-emerald-400" /> {selectedEntries.length} Records Selected</span>
                    <button onClick={() => setShowStampModal(true)} className="bg-indigo-500 px-6 py-2 rounded-xl font-black text-sm hover:bg-indigo-600 transition-all">COMBINE & SET AMOUNT</button>
                    <button onClick={() => setSelectedEntries([])} className="text-slate-400 hover:text-white transition-all"><X size={20} /></button>
                </div>
            )}

            {/* AMOUNT MODAL */}
            {showStampModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-white/20">
                        <h3 className="text-xl font-black mb-2 text-slate-800 text-center">Set Total Postage</h3>
                        <p className="text-sm text-slate-500 mb-6 text-center">Total amount for these {selectedEntries.length} items.</p>
                        <input
                            type="number"
                            className="w-full p-4 bg-slate-100 rounded-2xl mb-6 outline-none font-black text-3xl text-center focus:ring-2 focus:ring-indigo-500"
                            placeholder="₹ 0.00"
                            value={stampAmount}
                            onChange={e => setStampAmount(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-4">
                            <button onClick={() => setShowStampModal(false)} className="flex-1 font-bold text-slate-400 hover:text-slate-600 transition-all">Cancel</button>
                            <button onClick={handleBulkPostSave} disabled={!stampAmount || loading} className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all">
                                {loading ? "Updating..." : "CONFIRM & SAVE"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FORM MODAL (Original Code) */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 print-hidden">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-800">{editingId ? 'Update Entry' : 'Create New Entry'}</h3>
                            <button onClick={closeForm} className="p-3 bg-slate-100 rounded-2xl hover:bg-rose-100 hover:text-rose-600 transition-all"><X /></button>
                        </div>
                        <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
                            {current.fields.filter(f => !f.readOnly || editingId).map(f => {
                                // १. जर आपण नवीन एंट्री करत असू तर 'stampAmount' दाखवू नका
                                // २. पण जर आपण 'Editing' मोडमध्ये असू तर 'stampAmount' दाखवा जेणेकरून रक्कम बदलता येईल
                                if (f.id === 'stampAmount' && !editingId) return null;

                                return (
                                    <div key={f.id} className={f.type === 'radio' || f.id === 'subject' || f.id === 'remarks' || f.id === 'stampAmount' ? 'col-span-2' : ''}>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                            {f.label}
                                        </label>

                                        {f.type === 'radio' ? (
                                            <div className="flex gap-4">
                                                {f.options.map(o => (
                                                    <label key={o} className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all 
                ${formData.deliveryMode === o ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-slate-200'}`}>
                                                        <input
                                                            type="radio"
                                                            name="deliveryMode"
                                                            value={o}
                                                            checked={formData.deliveryMode === o}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, deliveryMode: e.target.value }))}
                                                            className="accent-indigo-600 w-4 h-4"
                                                        />
                                                        <span className="font-bold text-slate-700">{o}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : f.id === 'section' ? (
                                            <select required className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all appearance-none"
                                                value={formData[f.id] || ''} onChange={(e) => setFormData(prev => ({ ...prev, [f.id]: e.target.value }))}>
                                                <option value="">Choose Department...</option>
                                                {sectionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                type={f.id === 'stampAmount' ? 'number' : (f.type || 'text')}
                                                readOnly={f.readOnly}
                                                required={f.id !== 'remarks'} // रिमार्क्स सोडून बाकी आवश्यक
                                                className={`w-full p-4 border-2 border-transparent rounded-2xl focus:border-indigo-500 outline-none font-bold transition-all ${f.id === 'stampAmount' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-700'}`}
                                                value={formData[f.id] || ''}
                                                onChange={(e) => setFormData(prev => ({ ...prev, [f.id]: e.target.value }))}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                            {formData.section === "Other" && (
                                <div className="col-span-2 animate-in slide-in-from-top-2">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Custom Section Name</label>
                                    <input type="text" className="w-full p-4 bg-indigo-50/50 border-2 border-indigo-200 rounded-2xl focus:border-indigo-500 outline-none font-bold text-indigo-700"
                                        value={otherSection} onChange={(e) => setOtherSection(e.target.value)} required />
                                </div>
                            )}
                            <div className="col-span-2 flex justify-end gap-4 mt-8">
                                <button type="button" onClick={closeForm} className="px-8 py-4 font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                                <button type="submit" disabled={loading} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                                    {editingId ? 'UPDATE RECORD' : 'SAVE RECORD'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourtRegister;
