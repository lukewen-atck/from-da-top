'use client';

import React, { useState } from 'react';
import { adminResetUser, adminAssignSong } from '../app/admin/actions';
import { CyberButton, CyberWindow } from './Win95Window';

export default function AdminDashboard({ initialData }: { initialData: any }) {
    const [unlocked, setUnlocked] = useState(false);
    const [pin, setPin] = useState('');
    const [activeTab, setActiveTab] = useState<'USERS' | 'SONGS'>('USERS');

    // Data State (though we rely on revalidatePath, consistent local state is good)
    // Actually revalidatePath refreshing the server component prop `initialData` depends on router refresh.
    // simpler to just use router.refresh() after actions, but server actions revalidatePath() should handle it.

    const { users, songs, stats } = initialData;

    // Filter State
    const [songFilter, setSongFilter] = useState<'ALL' | 'TAKEN' | 'AVAILABLE'>('ALL');
    const [assignTargetUid, setAssignTargetUid] = useState<string | null>(null);
    const [assignSongId, setAssignSongId] = useState('');

    // --- AUTH ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '2026';
        if (pin === correctPin) {
            setUnlocked(true);
        } else {
            alert('ACCESS DENIED');
            setPin('');
        }
    };

    if (!unlocked) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center font-mono p-4">
                <div className="w-full max-w-md border border-neon-green p-8 text-center space-y-6 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                    <h1 className="text-3xl font-bold text-neon-green gltich-effect">ADMIN_CONSOLE</h1>
                    <div className="text-metal-silver text-xs tracking-widest">RESTRICTED ACCESS AREA</div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="bg-black border border-neon-green text-neon-green text-center text-2xl p-2 w-full focus:outline-none focus:shadow-[0_0_10px_#00ff41]"
                            placeholder="ENTER PIN"
                            autoFocus
                        />
                        <CyberButton variant="primary" className="w-full py-3">AUTHENTICATE</CyberButton>
                    </form>
                </div>
            </div>
        );
    }

    // --- ACTIONS ---
    const handleResetUser = async (uid: string) => {
        if (!confirm(`Confirm RESET for user ${uid}? This will clear their song selection.`)) return;
        const res = await adminResetUser(uid);
        if (res.success) {
            alert('User reset successfully');
        } else {
            alert('Failed: ' + res.message);
        }
    };

    const handleAssignSong = async () => {
        if (!assignTargetUid || !assignSongId) return;

        const id = parseInt(assignSongId);
        if (isNaN(id)) {
            alert('Invalid Song ID');
            return;
        }

        if (!confirm(`Force ASSIGN Song ID ${id} to User ${assignTargetUid}?`)) return;

        const res = await adminAssignSong(assignTargetUid, id);
        if (res.success) {
            alert('Assignment successful');
            setAssignTargetUid(null);
            setAssignSongId('');
        } else {
            alert('Failed: ' + res.message);
        }
    };

    // --- RENDER HELPERS ---
    const filteredSongs = songs.filter((s: any) => {
        if (songFilter === 'TAKEN') return s.is_taken;
        if (songFilter === 'AVAILABLE') return !s.is_taken;
        return true;
    });

    return (
        <div className="min-h-screen bg-black font-mono text-neon-green p-4 md:p-8">
            {/* --- HEADER --- */}
            <header className="mb-8 border-b border-neon-green/30 pb-4">
                <div className="flex justify-between items-end">
                    <h1 className="text-4xl font-bold tracking-tighter text-white">
                        <span className="text-neon-green">SYS.ADMIN</span> // DASHBOARD
                    </h1>
                    <button onClick={() => setUnlocked(false)} className="text-red-500 hover:underline">LOGOUT</button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <StatCard label="TOTAL SONGS" value={stats.totalSongs} />
                    <StatCard label="TAKEN" value={stats.takenSongs} />
                    <StatCard label="AVAILABLE" value={stats.totalSongs - stats.takenSongs} />
                    <StatCard label="TOTAL USERS" value={stats.totalUsers} />
                </div>
            </header>

            {/* --- TABS --- */}
            <div className="flex gap-2 mb-6">
                <TabButton active={activeTab === 'USERS'} onClick={() => setActiveTab('USERS')}>USER MANAGEMENT</TabButton>
                <TabButton active={activeTab === 'SONGS'} onClick={() => setActiveTab('SONGS')}>SONG DATABASE</TabButton>
            </div>

            {/* --- CONTENT --- */}
            <div className="bg-black/50 border border-neon-green/30 min-h-[500px] p-4 relative">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-green"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-green"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-green"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-green"></div>

                {activeTab === 'USERS' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-metal-silver border-b border-white/10 uppercase tracking-wider">
                                <tr>
                                    <th className="p-3">UID</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Song ID</th>
                                    <th className="p-3">Rerolled?</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((u: any) => (
                                    <tr key={u.uid} className="hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-bold text-white">{u.uid}</td>
                                        <td className="p-3">
                                            {u.selected_song_id
                                                ? <span className="text-neon-purple border border-neon-purple px-1">LOCKED</span>
                                                : <span className="text-gray-500">drawing...</span>
                                            }
                                        </td>
                                        <td className="p-3 text-metal-silver">
                                            {u.selected_song_id || '-'}
                                        </td>
                                        <td className="p-3">
                                            {u.has_rerolled ? <span className="text-red-500">YES</span> : 'NO'}
                                        </td>
                                        <td className="p-3 flex gap-2">
                                            <button
                                                onClick={() => handleResetUser(u.uid)}
                                                className="px-2 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs"
                                            >
                                                RESET
                                            </button>
                                            <button
                                                onClick={() => setAssignTargetUid(u.uid)}
                                                className="px-2 py-1 border border-neon-green text-neon-green hover:bg-neon-green hover:text-black text-xs"
                                            >
                                                ASSIGN
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'SONGS' && (
                    <div className="space-y-4">
                        <div className="flex gap-2 text-xs">
                            <button onClick={() => setSongFilter('ALL')} className={`px-2 py-1 ${songFilter === 'ALL' ? 'bg-neon-green text-black' : 'border border-neon-green text-neon-green'}`}>ALL</button>
                            <button onClick={() => setSongFilter('TAKEN')} className={`px-2 py-1 ${songFilter === 'TAKEN' ? 'bg-neon-green text-black' : 'border border-neon-green text-neon-green'}`}>TAKEN</button>
                            <button onClick={() => setSongFilter('AVAILABLE')} className={`px-2 py-1 ${songFilter === 'AVAILABLE' ? 'bg-neon-green text-black' : 'border border-neon-green text-neon-green'}`}>AVAILABLE</button>
                        </div>
                        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-metal-silver border-b border-white/10 uppercase tracking-wider sticky top-0 bg-black">
                                    <tr>
                                        <th className="p-3">ID</th>
                                        <th className="p-3">Title</th>
                                        <th className="p-3">Artist</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Taken By</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredSongs.map((s: any) => (
                                        <tr key={s.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-3 text-metal-silver">#{s.id}</td>
                                            <td className="p-3 font-bold text-white">{s.title}</td>
                                            <td className="p-3 text-metal-silver">{s.artist}</td>
                                            <td className="p-3">
                                                {s.is_taken
                                                    ? <span className="text-red-500">TAKEN</span>
                                                    : <span className="text-neon-green">AVAILABLE</span>
                                                }
                                            </td>
                                            <td className="p-3 font-mono text-xs">
                                                {s.taken_by || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* ASSIGN MODAL */}
            {assignTargetUid && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-black border border-neon-green p-6 w-full max-w-sm space-y-4 shadow-[0_0_50px_rgba(0,255,65,0.2)]">
                        <h3 className="text-xl font-bold text-white">FORCE ASSIGN SONG</h3>
                        <p className="text-sm text-metal-silver">Target User: {assignTargetUid}</p>

                        <input
                            type="number"
                            value={assignSongId}
                            onChange={(e) => setAssignSongId(e.target.value)}
                            placeholder="Song ID (e.g. 1)"
                            className="bg-black border border-metal-silver p-2 w-full text-white focus:border-neon-green outline-none"
                            autoFocus
                        />

                        <div className="flex gap-2 pt-2">
                            <CyberButton onClick={handleAssignSong} variant="primary" className="flex-1">CONFIRM</CyberButton>
                            <CyberButton onClick={() => setAssignTargetUid(null)} variant="default" className="flex-1">CANCEL</CyberButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value }: { label: string, value: number }) {
    return (
        <div className="border border-neon-green/30 p-4 bg-neon-green/5">
            <div className="text-xs text-metal-silver mb-1">{label}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </div>
    );
}

function TabButton({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2 font-bold transition-all ${active
                ? 'bg-neon-green text-black clip-path-polygon'
                : 'bg-transparent text-neon-green border border-neon-green/30 hover:border-neon-green'}`}
        >
            {children}
        </button>
    );
}
