"use client";

import { useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { scanReceipt } from "@/actions/transaction";

export function ReceiptScanner({ onScanComplete }) {
    const fileInputRef = useRef(null); // reference to file input element

    // custom hook for fetching data with loading and error handling
    const {
        loading: scanReceiptLoading,
        fn: scanReceiptFn,
        data: scannedData,
    } = useFetch(scanReceipt);

    
    // Add this helper function inside ReceiptScanner (or above it)
    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const maxDimension = 1200; // Optimal resolution for Gemini OCR
                let { width, height } = img;

                // Maintain aspect ratio while scaling down
                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    } else {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                // Export as JPEG with 80% quality
                canvas.toBlob(
                    (blob) => {
                        const compressedFile = new File([blob], file.name, {
                            type: "image/jpeg",
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    },
                    "image/jpeg",
                    0.8
                );
            };

            // Fallback to original file if browser fails to render
            img.onerror = () => resolve(file);
        });
    };

    // validate file size and trigger scanReceiptFn (from transaction server action)
    const handleReceiptScan = async (file) => {
        const clientStart = performance.now();
        const processedFile = await compressImage(file);
        const clientDuration = Math.round(performance.now() - clientStart);

        console.log(`[CLIENT COMPRESSION]`);
        console.log(`  Original: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
        console.log(`  Compressed: ${(processedFile.size / 1024).toFixed(1)} KB`);
        console.log(`  Reduction: ${(100 - (processedFile.size / file.size) * 100).toFixed(1)}%`);
        console.log(`  Time Taken: ${clientDuration} ms`);

        await scanReceiptFn(processedFile);
    };


    // watch for result from server action and notify parent component [AddTransactionForm]
    useEffect(() => {
        if (scannedData && !scanReceiptLoading) {
            onScanComplete(scannedData);
            toast.success("Receipt scanned successfully");
        }
    }, [scanReceiptLoading, scannedData]);

    return (
        <div className="flex items-center gap-4">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleReceiptScan(file);
                }}
            />
            <Button
                type="button"
                variant="outline"
                className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
                onClick={() => fileInputRef.current?.click()}
                disabled={scanReceiptLoading}
            >
                {scanReceiptLoading ? (
                    <>
                        <Loader2 className="mr-2 animate-spin" />
                        <span>Scanning Receipt...</span>
                    </>
                ) : (
                    <>
                        <Camera className="mr-2" />
                        <span>Scan Receipt with AI</span>
                    </>
                )}
            </Button>
        </div>
    );
}
