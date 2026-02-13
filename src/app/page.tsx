
import { getOrCreateUser } from './actions';
import HomeClient from '../components/HomeClient';

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { uid: rawUid } = await searchParams;
    const uid = Array.isArray(rawUid) ? rawUid[0] : rawUid;

    if (!uid) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="text-center border-2 border-red-500 p-8 rounded-lg animate-pulse">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">ACCESS DENIED</h1>
                    <p className="text-white font-mono">請使用實體卡片感應進入</p>
                    <p className="text-gray-500 text-xs mt-4">MISSING_UID_TOKEN</p>
                </div>
            </div>
        );
    }

    // Server Action call directly in component (Next.js 13+)
    const initData = await getOrCreateUser(uid);

    return (
        <HomeClient
            initialUser={initData.user}
            initialSong={initData.selectedSong}
            uid={uid}
        />
    );
}
