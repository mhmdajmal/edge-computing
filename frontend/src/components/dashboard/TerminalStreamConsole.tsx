'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Activity } from 'lucide-react';

interface TerminalStreamConsoleProps {
  currentFrame?: number;
  occupancyLevel?: string;
  acStatus?: {
    power: string;
    temperature: number | null;
    mode: string;
  };
  isProcessing?: boolean;
  currentVideo?: string | null;
}

interface LogEntry {
  id: string;
  timestamp: string;
  frame: number;
  occupancy: string;
  acText: string;
}

export default function TerminalStreamConsole({
  currentFrame = 0,
  occupancyLevel = 'LOW',
  acStatus,
  isProcessing = false,
  currentVideo,
}: TerminalStreamConsoleProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const lastFrameRef = useRef<number>(-1);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Erase all terminal stream data when video is deleted/removed
  useEffect(() => {
    if (!currentVideo) {
      setLogs([]);
      lastFrameRef.current = -1;
    }
  }, [currentVideo]);

  useEffect(() => {
    if (!isProcessing || currentFrame === 0 || currentFrame === lastFrameRef.current) {
      return;
    }
    lastFrameRef.current = currentFrame;

    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    const acText = acStatus?.power === 'ON' 
      ? `${acStatus.temperature}°C (${acStatus.mode} Mode)`
      : 'POWER OFF';

    const newEntry: LogEntry = {
      id: `${currentFrame}-${Date.now()}`,
      timestamp: timeStr,
      frame: currentFrame,
      occupancy: occupancyLevel,
      acText,
    };

    // Store total terminal output without truncation
    setLogs((prev) => [...prev, newEntry]);
  }, [currentFrame, occupancyLevel, acStatus, isProcessing]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" /> Real-Time Telemetry Terminal Stream
        </span>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1.5">
          <Activity className="w-3 h-3 animate-pulse" /> LIVE STREAM
        </span>
      </div>

      <div
        ref={logContainerRef}
        className="bg-black/90 rounded-xl p-3 font-mono text-xs overflow-y-auto max-h-[220px] space-y-1.5 border border-white/10 shadow-inner"
      >
        {logs.length === 0 ? (
          <p className="text-gray-500 italic text-[11px]">&gt; Waiting for active video telemetry stream...</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-center gap-2 leading-relaxed">
              <span className="text-gray-500">[{log.timestamp}]</span>
              <span className="text-cyan-400">Frame #{log.frame}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">State:</span>
              <span
                className={
                  log.occupancy === 'HIGH'
                    ? 'text-rose-400 font-bold'
                    : log.occupancy === 'MEDIUM'
                    ? 'text-amber-400 font-bold'
                    : 'text-emerald-400 font-bold'
                }
              >
                {log.occupancy}
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400">AC Target:</span>
              <span className="text-blue-300">{log.acText}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
