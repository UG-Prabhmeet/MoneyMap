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

    // validate file size and trigger scanReceiptFn (from transaction server action)
    const handleReceiptScan = async (file) => {
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than 5MB");
            return;
        }

        await scanReceiptFn(file);
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
