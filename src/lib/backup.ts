import { toast } from "sonner";

// all zustand persist keys owned by the app
const BACKUP_KEYS = [
  "clocks-storage",
  "countdowns-storage",
  "stopwatches-storage",
  "clock-config-storage",
  "theme-storage",
] as const;

type BackupFile = {
  app: "standby.sh";
  version: 1;
  exportedAt: string;
  data: Partial<Record<(typeof BACKUP_KEYS)[number], unknown>>;
};

export function exportData() {
  const data: BackupFile["data"] = {};
  for (const key of BACKUP_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try {
        data[key] = JSON.parse(raw);
      } catch {
        // skip malformed entry
      }
    }
  }
  const file: BackupFile = {
    app: "standby.sh",
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
  const blob = new Blob([JSON.stringify(file, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `standby-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Data exported");
}

export async function importData(file: File) {
  let parsed: BackupFile;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    toast.error("Invalid file: not valid JSON");
    return;
  }
  if (parsed?.app !== "standby.sh" || typeof parsed?.data !== "object") {
    toast.error("Invalid backup file: not a standby.sh export");
    return;
  }
  let restored = 0;
  for (const key of BACKUP_KEYS) {
    const value = parsed.data[key];
    if (value === undefined) continue;
    localStorage.setItem(key, JSON.stringify(value));
    restored++;
  }
  if (restored === 0) {
    toast.error("No recognizable data found in backup");
    return;
  }
  // ponytail: flag survives the reload that applies imported state
  sessionStorage.setItem("standby-imported", String(restored));
  location.reload();
}

const importedCount = sessionStorage.getItem("standby-imported");
if (importedCount !== null) {
  sessionStorage.removeItem("standby-imported");
  // defer until <Toaster> mounted — called at import time before React renders
  setTimeout(() => toast.success(`Imported ${importedCount} section(s)`), 400);
}
