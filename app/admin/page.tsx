'use client';

import { useLogs, clearLogs } from '@/lib/store';
import { ShieldAlert, ShieldCheck, Trash2, Clock, User, DoorOpen } from 'lucide-react';

export default function AdminPage() {
  const logs = useLogs();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Access Logs</h1>
          <p className="text-slate-500">View real-time access events across the campus.</p>
        </div>
        <button
          onClick={clearLogs}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear Logs
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No access logs recorded yet.</p>
            <p className="text-sm mt-1">Go to the Simulator to swipe some cards.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User ID</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gate ID</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Outcome</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                      {new Date(log.Timestamp).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        <User className="w-4 h-4 text-slate-400" />
                        {log.UserID}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <DoorOpen className="w-4 h-4 text-slate-400" />
                        {log.GateID}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                        ${log.Outcome === 'Granted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {log.Outcome === 'Granted' ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                        {log.Outcome}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {log.Reason || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
