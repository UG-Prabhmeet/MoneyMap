import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Export to CSV
export function exportToCSV(transactions) {
    const startTime = performance.now();

    // Column Headers
    const headers = [
        "Date",
        "Description",
        "Category",
        "Amount",
        "Type",
        "Recurring",
    ];

    // Map transaction data to rows
    const rows = transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.category,
        t.amount.toFixed(2),
        t.type,
        t.isRecurring ? t.recurringInterval : "One-time",
    ]);

    // Convert records to CSV format (removing quotes and adding commas to each row)
    const csvContent = [headers, ...rows]
        .map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" }); // blob = binary large object 
    const duration = Math.max(1, Math.round(performance.now() - startTime));

    // 📊 Log Benchmark Metrics
    console.log("\n================ [EXPORT BENCHMARK: CSV] ================");
    console.log(`📄 Records Exported: ${transactions.length}`);
    console.log(`⏱️ Generation Latency: ${duration} ms`);
    console.log(`📦 Payload Size: ${(blob.size / 1024).toFixed(2)} KB (${blob.size} bytes)`);
    console.log(`⚡ Processing Speed: ${Math.round((transactions.length / (duration / 1000)))} records/sec`);
    console.log("=========================================================\n");

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Export to PDF
export function exportToPDF(transactions) {
    const startTime = performance.now();

    const doc = new jsPDF();
    const headers = [
        ["Date", "Description", "Category", "Amount", "Type", "Recurring"],
    ];

    // Map transaction data for the table rows
    const rows = transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.category,
        `${t.amount.toFixed(2)}`,
        t.type,
        t.isRecurring ? t.recurringInterval : "One-time",
    ]);

    // Auto-generate the table with custom purple styling for headers
    autoTable(doc, {
        head: headers,
        body: rows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [147, 51, 234] }, // purple-600
    });

    const pdfBlob = doc.output("blob");
    const duration = Math.max(1, Math.round(performance.now() - startTime));

    // 📊 Log Benchmark Metrics
    console.log("\n================ [EXPORT BENCHMARK: PDF] ================");
    console.log(`📄 Records Exported: ${transactions.length}`);
    console.log(`⏱️ Vector Render Latency: ${duration} ms`);
    console.log(`📦 Payload Size: ${(pdfBlob.size / 1024).toFixed(2)} KB (${pdfBlob.size} bytes)`);
    console.log(`⚡ Processing Speed: ${Math.round((transactions.length / (duration / 1000)))} records/sec`);
    console.log("=========================================================\n");

    doc.save("transactions.pdf");
}

