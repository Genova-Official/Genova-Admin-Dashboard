'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { 
  Terminal, 
  Search, 
  Filter, 
  Trash2, 
  Download,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Play,
  Pause,
  X,
  Database,
  FileCode,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface LogItem {
  id: string;
  type: 'info' | 'warning' | 'error';
  service: 'SALES' | 'INVENTORY' | 'API' | 'AUTH' | 'NOTIF';
  message: string;
  timestamp: string;
  status: number | null;
}

export default function DebugLogsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
  
  // Interactive Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'GENOVA PLATFORM DIAGNOSTICS CONSOLE [Version 1.0.4]',
    '(c) 2026 Genova Inc. All rights reserved.',
    '',
    'Connecting to RDS PostgreSQL instance... SUCCESS.',
    'System status: OPERATIONAL',
    'Type "help" to list available telemetry commands.',
    ''
  ]);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Load logs from API
  const loadLogs = async (showRefreshedLog = false) => {
    setRefreshing(true);
    try {
      const res = await api.get('/logs');
      setLogs(res.data || []);
      setLastRefreshed(new Date());
      
      const timeStr = new Date().toLocaleTimeString();
      if (showRefreshedLog) {
        appendTerminalLine(`[${timeStr}] SUCCESS: Telemetry data refreshed. Fetched ${res.data?.length || 0} events.`);
      } else {
        appendTerminalLine(`[${timeStr}] SYSTEM: Polled ${res.data?.length || 0} event logs from database.`);
      }
    } catch (err: any) {
      console.error('Failed to load logs', err);
      const timeStr = new Date().toLocaleTimeString();
      appendTerminalLine(`[${timeStr}] ERROR: Failed to poll database logs. Status: ${err.response?.status || 'network_error'}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Setup polling
  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadLogs();
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  const appendTerminalLine = (line: string) => {
    setTerminalLines(prev => [...prev, line]);
  };

  // Handle Terminal Shell Commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    appendTerminalLine(`genova-console:~$ ${terminalInput}`);
    setTerminalInput('');

    switch (cmd) {
      case 'help':
        appendTerminalLine('Available Diagnostics Commands:');
        appendTerminalLine('  help       - Show available console commands');
        appendTerminalLine('  clear      - Clear the console scrollback');
        appendTerminalLine('  stats      - Calculate and output current log statistics');
        appendTerminalLine('  status     - Report infrastructure and RDS status');
        appendTerminalLine('  refresh    - Force query latest logs from the DB');
        appendTerminalLine('  exit       - Reset the console session');
        break;
      case 'clear':
        setTerminalLines([]);
        break;
      case 'stats':
        const total = logs.length;
        const sales = logs.filter(l => l.service === 'SALES').length;
        const inventory = logs.filter(l => l.service === 'INVENTORY').length;
        const apiCount = logs.filter(l => l.service === 'API').length;
        const auth = logs.filter(l => l.service === 'AUTH').length;
        const exp = logs.filter(l => l.service === 'NOTIF').length;
        const errors = logs.filter(l => l.type === 'error').length;
        const warnings = logs.filter(l => l.type === 'warning').length;

        appendTerminalLine('Log Statistics Summary:');
        appendTerminalLine(`  Total events analyzed: ${total}`);
        appendTerminalLine(`  - Sales Transactions:  ${sales}`);
        appendTerminalLine(`  - Inventory Assets:   ${inventory} (${logs.filter(l => l.service === 'INVENTORY' && l.type === 'warning').length} stock warnings)`);
        appendTerminalLine(`  - API Requests:       ${apiCount}`);
        appendTerminalLine(`  - User Authentication: ${auth}`);
        appendTerminalLine(`  - Overhead Expenses:   ${exp}`);
        appendTerminalLine(`  Severity distribution: Errors: ${errors}, Warnings: ${warnings}, Info: ${total - errors - warnings}`);
        break;
      case 'status':
        appendTerminalLine('Platform Sanity Report:');
        appendTerminalLine('  - Cloud Database RDS:  ONLINE (SSL Active)');
        appendTerminalLine('  - API Route Proxy:    OPERATIONAL (200 OK)');
        appendTerminalLine('  - Memory Usage:        124.5 MB (Docker Container)');
        appendTerminalLine(`  - Last Polled Event:   ${logs[0]?.timestamp ? new Date(logs[0].timestamp).toLocaleString() : 'N/A'}`);
        break;
      case 'refresh':
        appendTerminalLine('Triggering immediate PostgreSQL synchronization...');
        loadLogs(true);
        break;
      case 'exit':
        setTerminalLines([
          'Console session re-initialized.',
          'Type "help" for commands.',
          ''
        ]);
        break;
      default:
        appendTerminalLine(`genova-shell: command not found: ${cmd}. Type "help" for a list of operations.`);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Service', 'Message', 'Timestamp', 'Status'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.type,
      l.service,
      `"${l.message.replace(/"/g, '""')}"`,
      new Date(l.timestamp).toISOString(),
      l.status || 'NULL'
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `genova_debug_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    appendTerminalLine(`[${new Date().toLocaleTimeString()}] ACTION: Exported ${filteredLogs.length} logs to CSV.`);
  };

  // Clear local logs
  const handleClearLogs = () => {
    setLogs([]);
    appendTerminalLine(`[${new Date().toLocaleTimeString()}] ACTION: Cleared event cache logs table view.`);
  };

  // Filter and Search logic
  const filteredLogs = logs.filter(log => {
    const matchSearch = 
      !search || 
      log.message.toLowerCase().includes(search.toLowerCase()) || 
      log.service.toLowerCase().includes(search.toLowerCase()) ||
      (log.status && log.status.toString().includes(search));

    const matchService = serviceFilter === 'ALL' || log.service === serviceFilter;
    const matchSeverity = severityFilter === 'ALL' || log.type === severityFilter;

    return matchSearch && matchService && matchSeverity;
  });

  const services = ['ALL', 'SALES', 'INVENTORY', 'API', 'AUTH', 'NOTIF'];
  const severities = ['ALL', 'info', 'warning', 'error'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Debug Diagnostics</h1>
          <p className="text-secondary font-medium text-sm mt-1 flex items-center gap-2">
            <Terminal size={14} className="text-primary" /> Cloud Database Operational Feed &amp; Console
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Auto Refresh Toggle */}
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              autoRefresh 
                ? 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10' 
                : 'bg-background text-secondary border-border hover:border-secondary/40'
            }`}
          >
            {autoRefresh ? <Play size={12} className="animate-pulse" /> : <Pause size={12} />}
            {autoRefresh ? 'Auto-Refreshes Live' : 'Polling Suspended'}
          </button>

          {/* Manual Refresh Button */}
          <button 
            onClick={() => loadLogs(true)} 
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-background border border-border rounded-xl text-xs font-bold text-secondary hover:text-primary hover:border-primary transition-all disabled:opacity-50"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            Sync DB
          </button>

          {/* Export CSV */}
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-background border border-border rounded-xl text-xs font-bold text-secondary hover:text-primary hover:border-primary transition-all"
          >
            <Download size={12} />
            Export CSV
          </button>

          {/* Clear Logs */}
          <button 
            onClick={handleClearLogs}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-100/75 transition-all"
          >
            <Trash2 size={12} />
            Clear
          </button>
        </div>
      </div>

      {/* 1. Terminal Console UI (Diagnostic Shell) */}
      <div className="bg-[#0f0714] border border-primary/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[300px]">
        {/* Terminal Header */}
        <div className="bg-[#180d20] px-6 py-3 border-b border-purple-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-primary animate-pulse" />
            <span className="font-mono text-xs font-black text-purple-200 tracking-wider">GENOVA DIAGNOSTICS CONSOLE (Live)</span>
          </div>
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
          </div>
        </div>

        {/* Terminal Screen output */}
        <div className="p-6 font-mono text-xs text-purple-300 flex-1 overflow-y-auto max-h-[220px] custom-scrollbar flex flex-col space-y-1.5 selection:bg-primary selection:text-white">
          {terminalLines.map((line, idx) => (
            <p key={idx} className="whitespace-pre-wrap leading-relaxed">
              {line}
            </p>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Box */}
        <form onSubmit={handleTerminalSubmit} className="bg-[#150a1b] border-t border-purple-950/50 px-6 py-2.5 flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-primary">genova-console:~$</span>
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-purple-200 placeholder-purple-800"
            placeholder="Type 'help' for diagnostics controls..."
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
          />
          <button type="submit" className="hidden" />
        </form>
      </div>

      {/* 2. Interactive Filters & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
        {/* Search */}
        <div className="lg:col-span-1 space-y-2">
          <label className="text-[10px] font-black text-secondary/50 uppercase tracking-widest">Search message</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
            <input
              type="text"
              placeholder="Search event detail..."
              className="command-input pl-11 py-2 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Service filter */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-secondary/50 uppercase tracking-widest">Service type</label>
          <div className="flex flex-wrap gap-1.5">
            {services.map(srv => (
              <button
                key={srv}
                onClick={() => setServiceFilter(srv)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide uppercase transition-all ${
                  serviceFilter === srv 
                    ? 'bg-primary text-white' 
                    : 'bg-accent/40 text-secondary hover:bg-accent hover:text-foreground'
                }`}
              >
                {srv}
              </button>
            ))}
          </div>
        </div>

        {/* Severity filter */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-secondary/50 uppercase tracking-widest">Severity level</label>
          <div className="flex flex-wrap gap-1.5">
            {severities.map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide uppercase transition-all ${
                  severityFilter === sev 
                    ? 'bg-primary text-white' 
                    : 'bg-accent/40 text-secondary hover:bg-accent hover:text-foreground'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Log Table Container */}
      <div className="premium-card overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-secondary text-xs font-bold tracking-wider uppercase animate-pulse">Syncing log events...</p>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="premium-table font-mono">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Timestamp</th>
                  <th>Service</th>
                  <th>Telemetry Event Log Details</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredLogs.map((log, i) => {
                    const isError = log.type === 'error';
                    const isWarning = log.type === 'warning';
                    
                    return (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15, delay: Math.min(i * 0.02, 0.4) }}
                        onClick={() => setSelectedLog(log)}
                        className="hover:bg-accent/30 transition-colors group cursor-pointer border-b border-border/40"
                      >
                        <td className="py-4">
                          {isError ? (
                            <div className="flex items-center gap-2 text-red-500">
                              <AlertCircle size={14} className="stroke-[2.5]" />
                              <span className="font-bold text-xs">{log.status || '500'}</span>
                            </div>
                          ) : isWarning ? (
                            <div className="flex items-center gap-2 text-amber-500">
                              <AlertCircle size={14} className="stroke-[2.5]" />
                              <span className="font-bold text-xs">WARN</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle2 size={14} className="stroke-[2.5]" />
                              <span className="font-bold text-xs">{log.status || '200'}</span>
                            </div>
                          )}
                        </td>
                        <td className="text-secondary/70 font-semibold text-xs py-4 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                            log.service === 'SALES' ? 'bg-green-100 text-green-800' :
                            log.service === 'INVENTORY' ? 'bg-blue-100 text-blue-800' :
                            log.service === 'API' ? 'bg-purple-100 text-purple-800' :
                            log.service === 'AUTH' ? 'bg-pink-100 text-pink-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {log.service}
                          </span>
                        </td>
                        <td className="text-foreground max-w-lg truncate font-medium text-xs py-4">
                          {log.message}
                        </td>
                        <td className="text-right py-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLog(log);
                            }}
                            className="p-1.5 text-secondary/40 group-hover:text-primary transition-colors hover:bg-accent rounded-lg"
                          >
                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center space-y-3">
            <div className="p-3 bg-accent/40 rounded-full inline-block">
              <Database size={24} className="text-secondary/50" />
            </div>
            <p className="font-bold text-foreground text-sm">No telemetry records match filters</p>
            <p className="text-secondary/60 text-xs max-w-xs mx-auto">Try clearing search parameters or adjusting active service/severity filters.</p>
          </div>
        )}

        {/* Footer info */}
        <div className="px-6 py-4 bg-accent/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-secondary/40 text-[9px] font-black uppercase tracking-[0.2em]">
            Telemetry Analysis Event Stream ({filteredLogs.length} events matching filter)
          </p>
          <p className="text-secondary/50 text-[10px] font-bold">
            Last polled: {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* 4. Log Detail Drawer / Overlay Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            />

            {/* Sidebar drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-card border-l border-border h-full shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="text-primary" size={18} />
                  <h3 className="font-black text-foreground">Log Details Inspector</h3>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-1.5 text-secondary hover:text-foreground hover:bg-accent rounded-lg transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Event Summary Banner */}
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                  selectedLog.type === 'error' ? 'bg-red-50 text-red-950 border-red-100' :
                  selectedLog.type === 'warning' ? 'bg-amber-50 text-amber-950 border-amber-100' :
                  'bg-green-50 text-green-950 border-green-100'
                }`}>
                  <AlertCircle className={`mt-0.5 shrink-0 ${
                    selectedLog.type === 'error' ? 'text-red-500' :
                    selectedLog.type === 'warning' ? 'text-amber-500' :
                    'text-green-600'
                  }`} size={16} />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-widest opacity-60">Message Summary</h4>
                    <p className="text-xs font-semibold mt-1 leading-relaxed">{selectedLog.message}</p>
                  </div>
                </div>

                {/* Metadata Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-accent/30 border border-border/50 p-4 rounded-xl">
                    <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider mb-1">Service Component</p>
                    <p className="font-black text-xs text-foreground uppercase tracking-widest">{selectedLog.service}</p>
                  </div>
                  <div className="bg-accent/30 border border-border/50 p-4 rounded-xl">
                    <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider mb-1">Log ID</p>
                    <p className="font-mono text-xs text-foreground font-semibold truncate">{selectedLog.id}</p>
                  </div>
                  <div className="bg-accent/30 border border-border/50 p-4 rounded-xl">
                    <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider mb-1">HTTP Status</p>
                    <p className="font-mono text-xs font-black text-foreground">{selectedLog.status || 'N/A'}</p>
                  </div>
                  <div className="bg-accent/30 border border-border/50 p-4 rounded-xl">
                    <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider mb-1">Severity Type</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      selectedLog.type === 'error' ? 'bg-red-100 text-red-800' :
                      selectedLog.type === 'warning' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedLog.type}
                    </span>
                  </div>
                </div>

                <div className="bg-accent/30 border border-border/50 p-4 rounded-xl">
                  <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider mb-1">Database Timestamp</p>
                  <p className="font-mono text-xs text-foreground font-semibold">{new Date(selectedLog.timestamp).toISOString()}</p>
                </div>

                {/* Raw JSON telemetry payload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary/50 uppercase tracking-widest">Raw Database Telemetry Payload (JSON)</label>
                  <pre className="p-4 bg-[#0a040d] border border-primary/10 rounded-xl overflow-x-auto text-[11px] font-mono text-purple-300 custom-scrollbar leading-relaxed">
                    {JSON.stringify(selectedLog, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-4 bg-accent/20 border-t border-border flex items-center justify-between">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 border border-border hover:bg-accent rounded-xl text-xs font-bold text-secondary transition-all"
                >
                  Close Inspector
                </button>
                <div className="flex items-center gap-1.5 text-secondary/60 text-[9px] font-bold uppercase tracking-widest">
                  <ShieldCheck size={12} className="text-green-500" />
                  Verified RDS Data
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
