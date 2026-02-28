"use client"

import { useState, useCallback } from "react"
import { ProductScanner } from "./product-scanner"
import { SustainabilityGauge } from "./sustainability-gauge"
import { ChemicalFlags, type ChemicalFlag } from "./chemical-flags"
import { GreenSwaps, type GreenSwap } from "./green-swaps"
import { StatCards } from "./stat-cards"
import { saveScanResult } from "@/lib/ecolens-store"
import { Leaf } from "lucide-react"
import { toast } from "sonner"

const mockFlags: ChemicalFlag[] = [
  {
    name: "Sodium Lauryl Sulfate (SLS)",
    severity: "high",
    description:
      "A harsh surfactant that can cause skin irritation, dryness, and allergic reactions. Found in many cleaning and personal care products.",
    category: "Surfactant",
  },
  {
    name: "Phthalates (DEP)",
    severity: "high",
    description:
      "Endocrine disruptors linked to hormonal imbalances. Often hidden under 'fragrance' in ingredient lists.",
    category: "Plasticizer",
  },
  {
    name: "Triclosan",
    severity: "medium",
    description:
      "An antibacterial agent associated with antibiotic resistance and environmental contamination of waterways.",
    category: "Antimicrobial",
  },
  {
    name: "Artificial Fragrance",
    severity: "medium",
    description:
      "Can contain up to 3,000 undisclosed chemicals, many linked to allergies, migraines, and respiratory issues.",
    category: "Fragrance",
  },
  {
    name: "Methylparaben",
    severity: "low",
    description:
      "A preservative with lower toxicity concerns. Some studies suggest weak estrogenic activity.",
    category: "Preservative",
  },
]

const mockSwaps: GreenSwap[] = [
  {
    name: "Plant-Based All-Purpose Cleaner",
    brand: "Seventh Generation",
    score: 91,
    improvement: 58,
    tags: ["Biodegradable", "Plant-Based", "Cruelty-Free"],
    price: "$6.99",
  },
  {
    name: "Organic Castile Soap Bar",
    brand: "Dr. Bronner's",
    score: 94,
    improvement: 65,
    tags: ["Organic", "Fair Trade", "Vegan"],
    price: "$4.79",
  },
  {
    name: "Enzyme-Based Stain Remover",
    brand: "Ecover",
    score: 88,
    improvement: 42,
    tags: ["Enzyme-Based", "Recyclable", "Low-Impact"],
    price: "$8.49",
  },
]

export function DashboardView() {
  const [isScanning, setIsScanning] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)

  // State for genuine results
  const [scanResult, setScanResult] = useState<{
    productName: string;
    ecoScore: number;
    redFlags: ChemicalFlag[];
    greenSwaps: GreenSwap[];
  }>({
    productName: "",
    ecoScore: 0,
    redFlags: [],
    greenSwaps: [],
  })

  const handleScan = useCallback(async (file: File) => {
    setIsScanning(true)
    setHasScanned(false)

    try {
      // 1. Resize and Convert File to Base64 using Canvas to avoid huge payloads
      const base64Image = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            const MAX_SIZE = 800; // Cap width/height to 800px

            if (width > height) {
              if (width > MAX_SIZE) {
                height = Math.round((height * MAX_SIZE) / width);
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width = Math.round((width * MAX_SIZE) / height);
                height = MAX_SIZE;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);

            // Compress to JPEG with 0.7 quality
            const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
            resolve(dataUrl);
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // 2. Call API
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      const data = await response.json();

      // 3. Map constraints: 
      // Ensure the returned objects match our component expectations and provide fallbacks
      // so we never crash on undefined properties like tags.map() again.
      const mappedFlags: ChemicalFlag[] = Array.isArray(data.redFlags) ? data.redFlags.map((flag: any) => {
        // If the old API returned a string by accident, handle it
        if (typeof flag === 'string') {
           return { name: flag, severity: "medium", description: "", category: "Notice" };
        }
        return {
          name: flag?.name || "Unknown Flag",
          severity: (["high", "medium", "low"].includes(flag?.severity)) ? flag.severity : "medium",
          description: flag?.description || "Potential environmental or health concern.",
          category: flag?.category || "Alert"
        };
      }) : [];

      const mappedSwaps: GreenSwap[] = Array.isArray(data.greenSwaps) ? data.greenSwaps.map((swap: any) => ({
        name: swap?.name || "Eco Alternative",
        brand: swap?.brand || "Green Brand",
        score: typeof swap?.score === 'number' ? swap.score : 85,
        improvement: typeof swap?.improvement === 'number' ? swap.improvement : 25,
        // CRITICAL FIX: Ensure tags is always an array so map() doesn't fail
        tags: Array.isArray(swap?.tags) ? swap.tags : ["Eco-Friendly"],
        price: swap?.price || "N/A"
      })) : [];

      const newScanData = {
        productName: data.productName,
        ecoScore: data.ecoScore,
        redFlags: mappedFlags,
        greenSwaps: mappedSwaps,
      };

      setScanResult(newScanData);
      setHasScanned(true);

      // Save to local storage for history & impact
      saveScanResult({
        productName: data.productName,
        ecoScore: data.ecoScore,
        redFlags: mappedFlags,
        greenSwaps: mappedSwaps,
      });

    } catch (error) {
      console.error(error);
      // Optional: error toast
      // toast.error("Failed to analyze product. Please try again.")
    } finally {
      setIsScanning(false)
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Stats row */}
      <StatCards />

      {/* Scanner + Gauge row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductScanner onScan={handleScan} isScanning={isScanning} />
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center justify-center min-h-[300px]">
          {isScanning ? (
            <div className="flex flex-col items-center gap-3 text-center py-4">
              <div className="size-12 rounded-full bg-secondary/50 flex items-center justify-center">
                <div className="size-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">Analyzing sustainability...</p>
            </div>
          ) : hasScanned ? (
            <SustainabilityGauge
              score={scanResult.ecoScore}
              label={scanResult.productName}
            />
          ) : (
             <div className="flex flex-col items-center gap-3 text-center py-4 opacity-50">
                <div className="size-12 rounded-full bg-secondary/30 flex items-center justify-center">
                  <Leaf className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Awaiting Scan</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Upload or take a photo of a product to evaluate its environmental impact.</p>
             </div>
          )}
        </div>
      </div>

      {/* Chemical Flags + Green Swaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChemicalFlags flags={scanResult.redFlags} />
        <GreenSwaps swaps={scanResult.greenSwaps} />
      </div>
    </div>
  )
}
