import { useState, useEffect } from 'react';
import { getRandomTask, getTaskById } from '../data/tasks';

const STORAGE_KEY = 'sony_gacha_users';

export function useUserState() {
  const [uid, setUid] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 從 URL 取得 uid
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlUid = params.get('uid');
    
    if (urlUid) {
      setUid(urlUid);
      loadUserData(urlUid);
    } else {
      // 開發模式：如果沒有 uid，生成一個臨時的
      const devUid = 'dev_' + Math.random().toString(36).substring(7);
      setUid(devUid);
      loadUserData(devUid);
    }
    setIsLoading(false);
  }, []);

  // 載入使用者資料
  const loadUserData = (userId) => {
    try {
      const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (allUsers[userId]) {
        setUserData(allUsers[userId]);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('載入使用者資料失敗:', error);
      setUserData(null);
    }
  };

  // 儲存抽取結果（第一次抽取）
  const saveDrawResult = (songId) => {
    try {
      const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const newUserData = {
        uid: uid,
        drawnSongId: songId,
        drawCount: 1,
        firstDrawTime: new Date().toISOString(),
        lastDrawTime: new Date().toISOString(),
        // 任務相關狀態
        taskAssigned: false,
        assignedTaskId: null,
        taskCompleted: false,
        taskCompletedTime: null,
        taskVideoInfo: null,
        // 第二次抽取狀態
        secondDrawUnlocked: false,
        secondDrawUsed: false,
      };
      allUsers[uid] = newUserData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers));
      setUserData(newUserData);
      return newUserData;
    } catch (error) {
      console.error('儲存抽取結果失敗:', error);
      return null;
    }
  };

  // 指派任務（隨機從三個任務中選一個）
  const assignTask = () => {
    try {
      const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (allUsers[uid] && !allUsers[uid].taskAssigned) {
        const task = getRandomTask();
        allUsers[uid].taskAssigned = true;
        allUsers[uid].assignedTaskId = task.id;
        allUsers[uid].taskAssignedTime = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers));
        setUserData(allUsers[uid]);
        return task;
      }
      // 如果已經指派過，返回已指派的任務
      if (allUsers[uid]?.assignedTaskId) {
        return getTaskById(allUsers[uid].assignedTaskId);
      }
      return null;
    } catch (error) {
      console.error('指派任務失敗:', error);
      return null;
    }
  };

  // 完成任務（上傳影片後）
  const completeTask = (videoInfo) => {
    try {
      const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (allUsers[uid] && allUsers[uid].taskAssigned && !allUsers[uid].taskCompleted) {
        allUsers[uid].taskCompleted = true;
        allUsers[uid].taskCompletedTime = new Date().toISOString();
        allUsers[uid].taskVideoInfo = videoInfo;
        allUsers[uid].secondDrawUnlocked = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers));
        setUserData(allUsers[uid]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('完成任務失敗:', error);
      return false;
    }
  };

  // 使用第二次抽取機會
  const useSecondDraw = (newSongId) => {
    try {
      const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (allUsers[uid] && allUsers[uid].secondDrawUnlocked && !allUsers[uid].secondDrawUsed) {
        allUsers[uid].drawnSongId = newSongId;
        allUsers[uid].secondDrawUsed = true;
        allUsers[uid].drawCount = 2;
        allUsers[uid].lastDrawTime = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers));
        setUserData(allUsers[uid]);
        return allUsers[uid];
      }
      return null;
    } catch (error) {
      console.error('使用第二次抽取失敗:', error);
      return null;
    }
  };

  // 檢查是否已抽取過
  const hasDrawn = userData !== null && userData.drawnSongId !== undefined;

  // 檢查是否可以開始任務（已抽取但未指派任務）
  const canStartTask = hasDrawn && !userData?.taskAssigned && !userData?.secondDrawUsed;

  // 檢查是否有進行中的任務
  const hasActiveTask = userData?.taskAssigned && !userData?.taskCompleted;

  // 檢查是否可以進行第二次抽取
  const canSecondDraw = userData?.secondDrawUnlocked && !userData?.secondDrawUsed;

  // 檢查是否已完全鎖定（已使用第二次抽取）
  const isFullyLocked = userData?.secondDrawUsed === true;

  // 獲取已指派的任務
  const getAssignedTask = () => {
    if (userData?.assignedTaskId) {
      return getTaskById(userData.assignedTaskId);
    }
    return null;
  };

  // 重置（開發用）
  const resetUser = () => {
    try {
      const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      delete allUsers[uid];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers));
      setUserData(null);
    } catch (error) {
      console.error('重置失敗:', error);
    }
  };

  return {
    uid,
    userData,
    isLoading,
    hasDrawn,
    canStartTask,
    hasActiveTask,
    canSecondDraw,
    isFullyLocked,
    saveDrawResult,
    assignTask,
    completeTask,
    useSecondDraw,
    getAssignedTask,
    resetUser,
  };
}

export default useUserState;
