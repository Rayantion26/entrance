import { useState, useEffect } from 'react';

export interface AccessLogEntry {
  id: string;
  UserID: string;
  GateID: string;
  Timestamp: string;
  Outcome: 'Granted' | 'Denied';
  Reason?: string;
}

export function getLogs(): AccessLogEntry[] {
  if (typeof window === 'undefined') return [];
  const logs = localStorage.getItem('access_logs');
  return logs ? JSON.parse(logs) : [];
}

export function addLog(log: Omit<AccessLogEntry, 'id'>) {
  if (typeof window === 'undefined') return;
  const logs = getLogs();
  const newLog = { ...log, id: crypto.randomUUID() };
  logs.unshift(newLog); // Add to beginning
  localStorage.setItem('access_logs', JSON.stringify(logs));
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('logs_updated'));
}

export function clearLogs() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_logs');
  window.dispatchEvent(new Event('logs_updated'));
}

export function useLogs() {
  const [logs, setLogs] = useState<AccessLogEntry[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLogs(getLogs());
    const handleUpdate = () => setLogs(getLogs());
    window.addEventListener('logs_updated', handleUpdate);
    return () => window.removeEventListener('logs_updated', handleUpdate);
  }, []);

  return logs;
}
