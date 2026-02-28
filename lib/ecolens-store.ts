export interface GreenSwap {
    name: string;
    brand?: string;
    score?: number;
    improvement: number;
    tags?: string[];
    price?: string;
    reason?: string;
}

export interface ChemicalFlag {
    name: string;
    severity: "high" | "medium" | "low";
    description: string;
    category: string;
}

export interface ScanResult {
    id: string; // unique ID for history
    timestamp: number; // For sorting and formatting
    date: string; // Formatted date string

    productName: string;
    ecoScore: number;
    redFlags: ChemicalFlag[];
    greenSwaps: GreenSwap[];
}

const STORAGE_KEY = "ecolens_history";

export function saveScanResult(result: Omit<ScanResult, "id" | "timestamp" | "date">): ScanResult {
    const currentHistory = getHistory();
    const now = new Date();

    const newScan: ScanResult = {
        ...result,
        id: crypto.randomUUID(),
        timestamp: now.getTime(),
        date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    };

    const newHistory = [newScan, ...currentHistory];
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        // Dispatch an event so other components can listen to it
        window.dispatchEvent(new Event("ecolens_history_updated"));
    }

    return newScan;
}

export function getHistory(): ScanResult[] {
    if (typeof window === "undefined") return [];

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (err) {
        console.error("Failed to parse history from local storage", err);
        return [];
    }
}
