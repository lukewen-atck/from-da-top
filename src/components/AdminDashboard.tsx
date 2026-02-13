'use client';

import React, { useState } from 'react';
import { adminResetUser, adminAssignSong, adminUpdateUser } from '../app/admin/actions';
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

    // Edit State
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editNote, setEditNote] = useState('');

    // --- AUTH ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '2026';
        if (pin === correctPin) {
            setUnlocked(true);
        } else {
            alert('密碼錯誤 (ACCESS DENIED)');
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
                            placeholder="輸入 PIN 碼"
                            autoFocus
                        />
                        <CyberButton variant="primary" className="w-full py-3" type="submit">登入系統</CyberButton>
                    </form>
                </div>
            </div>
        );
    }

    // --- ACTIONS ---
    const handleResetUser = async (uid: string) => {
        if (!confirm(`確定要重置使用者 ${uid} 嗎？\n這將清除他的選歌與換歌狀態。`)) return;
        const res = await adminResetUser(uid);
        if (res.success) {
            alert('使用者重置成功');
        } else {
            alert('操作失敗: ' + res.message);
        }
    };

    const handleAssignSong = async () => {
        if (!assignTargetUid || !assignSongId) return;

        const id = parseInt(assignSongId);
        if (isNaN(id)) {
            alert('無效的歌曲 ID');
            return;
        }

        if (!confirm(`強制將歌曲 ID ${id} 分配給使用者 ${assignTargetUid}？`)) return;

        const res = await adminAssignSong(assignTargetUid, id);
        if (res.success) {
            alert('分配成功');
            setAssignTargetUid(null);
            setAssignSongId('');
        } else {
            alert('操作失敗: ' + res.message);
        }
    };

    const startEditing = (u: any) => {
        setEditingUser(u.uid);
        setEditName(u.name || '');
        setEditNote(u.note || '');
    };

    const saveEdit = async (uid: string) => {
        const res = await adminUpdateUser(uid, editName, editNote);
        if (res.success) {
            setEditingUser(null);
        } else {
            alert('更新失敗: ' + res.message);
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
                        <span className="text-neon-green">SYS.ADMIN</span> // 控制台
                    </h1>
                    <button onClick={() => setUnlocked(false)} className="text-red-500 hover:underline">登出</button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <StatCard label="總歌曲數 (TOTAL SONGS)" value={stats.totalSongs} />
                    <StatCard label="已占用 (TAKEN)" value={stats.takenSongs} />
                    <StatCard label="剩餘可用 (AVAILABLE)" value={stats.totalSongs - stats.takenSongs} />
                    <StatCard label="總觸及人數 (TOTAL USERS)" value={stats.totalUsers} />
                </div>
            </header>

            {/* --- TABS --- */}
            <div className="flex gap-2 mb-6">
                <TabButton active={activeTab === 'USERS'} onClick={() => setActiveTab('USERS')}>使用者管理 (USERS)</TabButton>
                <TabButton active={activeTab === 'SONGS'} onClick={() => setActiveTab('SONGS')}>歌曲資料庫 (SONGS)</TabButton>
            </div>

            {/* --- CONTENT --- */}
            <div className="bg-black/50 border border-neon-green/30 min-h-[500px] p-4 relative">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-green"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-green"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-green"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-green"></div>

                {activeTab === 'USERS' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="text-metal-silver border-b border-white/10 uppercase tracking-wider">
                                <tr>
                                    <th className="p-3">UID</th>
                                    <th className="p-3 w-32">名稱 (Name)</th>
                                    <th className="p-3 w-48">備註 (Note)</th>
                                    <th className="p-3">狀態</th>
                                    <th className="p-3">歌曲 ID</th>
                                    <th className="p-3">已換歌?</th>
                                    <th className="p-3">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((u: any) => (
                                    <tr key={u.uid} className="hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-bold text-white text-xs">{u.uid.substring(0, 8)}...</td>

                                        {/* Name & Note Editing */}
                                        {editingUser === u.uid ? (
                                            <>
                                                <td className="p-3">
                                                    <input
                                                        className="bg-black border border-neon-green text-white p-1 w-full text-xs"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        placeholder="輸入名稱..."
                                                        autoFocus
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        className="bg-black border border-neon-green text-white p-1 w-full text-xs"
                                                        value={editNote}
                                                        onChange={(e) => setEditNote(e.target.value)}
                                                        placeholder="輸入備註..."
                                                    />
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-3 text-white truncate max-w-[150px]" onClick={() => startEditing(u)}>
                                                    {u.name || <span className="text-metal-silver/50 italic">-</span>}
                                                </td>
                                                <td className="p-3 text-metal-silver truncate max-w-[200px]" onClick={() => startEditing(u)}>
                                                    {u.note || <span className="text-metal-silver/50 italic">-</span>}
                                                </td>
                                            </>
                                        )}

                                        <td className="p-3">
                                            {u.selected_song_id
                                                ? <span className="text-neon-purple border border-neon-purple px-1 text-xs">已鎖定</span>
                                                : <span className="text-gray-500 text-xs">抽選中</span>
                                            }
                                        </td>
                                        <td className="p-3 text-metal-silver">
                                            {u.selected_song_id || '-'}
                                        </td>
                                        <td className="p-3">
                                            {u.has_rerolled ? <span className="text-red-500">是</span> : '否'}
                                        </td>
                                        <td className="p-3 flex gap-2 items-center">
                                            {editingUser === u.uid ? (
                                                <button onClick={() => saveEdit(u.uid)} className="text-neon-green hover:underline">
                                                    儲存
                                                </button>
                                            ) : (
                                                <button onClick={() => startEditing(u)} className="text-metal-silver hover:text-white text-xs">
                                                    編輯
                                                </button>
                                            )}

                                            <span className="text-metal-silver/30">|</span>

                                            <button
                                                onClick={() => handleResetUser(u.uid)}
                                                className="px-2 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs"
                                                type="button"
                                            >
                                                重置
                                            </button>
                                            <button
                                                onClick={() => setAssignTargetUid(u.uid)}
                                                className="px-2 py-1 border border-neon-green text-neon-green hover:bg-neon-green hover:text-black text-xs"
                                                type="button"
                                            >
                                                指派
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
                            <button onClick={() => setSongFilter('ALL')} className={`px-2 py-1 ${songFilter === 'ALL' ? 'bg-neon-green text-black' : 'border border-neon-green text-neon-green'}`}>全部 (ALL)</button>
                            <button onClick={() => setSongFilter('TAKEN')} className={`px-2 py-1 ${songFilter === 'TAKEN' ? 'bg-neon-green text-black' : 'border border-neon-green text-neon-green'}`}>已占用 (TAKEN)</button>
                            <button onClick={() => setSongFilter('AVAILABLE')} className={`px-2 py-1 ${songFilter === 'AVAILABLE' ? 'bg-neon-green text-black' : 'border border-neon-green text-neon-green'}`}>未占用 (AVAILABLE)</button>
                        </div>
                        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-metal-silver border-b border-white/10 uppercase tracking-wider sticky top-0 bg-black">
                                    <tr>
                                        <th className="p-3">ID</th>
                                        <th className="p-3">歌名 (Title)</th>
                                        <th className="p-3">歌手 (Artist)</th>
                                        <th className="p-3">狀態</th>
                                        <th className="p-3">持有者 UID</th>
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
                                                    ? <span className="text-red-500">已占用</span>
                                                    : <span className="text-neon-green">可用</span>
                                                }
                                            </td>
                                            <td className="p-3 font-mono text-xs">
                                                {s.taken_by ? s.taken_by.substring(0, 8) + '...' : '-'}
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
                        <h3 className="text-xl font-bold text-white">強制指派歌曲 (FORCE ASSIGN)</h3>
                        <p className="text-sm text-metal-silver">目標使用者: {assignTargetUid}</p>

                        <input
                            type="number"
                            value={assignSongId}
                            onChange={(e) => setAssignSongId(e.target.value)}
                            placeholder="輸入歌曲 ID (例如: 1)"
                            className="bg-black border border-metal-silver p-2 w-full text-white focus:border-neon-green outline-none"
                            autoFocus
                        />

                        <div className="flex gap-2 pt-2">
                            <CyberButton onClick={() => handleAssignSong()} variant="primary" className="flex-1">確認指派</CyberButton>
                            <CyberButton onClick={() => setAssignTargetUid(null)} variant="default" className="flex-1">取消</CyberButton>
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
