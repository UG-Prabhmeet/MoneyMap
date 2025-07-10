import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToCSV(transactions) {
    const headers = [
        "Date",
        "Description",
        "Category",
        "Amount",
        "Type",
        "Recurring",
    ];
    const rows = transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.category,
        t.amount.toFixed(2),
        t.type,
        t.isRecurring ? t.recurringInterval : "One-time",
    ]);

    const csvContent = [headers, ...rows]
        .map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportToPDF(transactions) {
    const doc = new jsPDF();
    const headers = [
        ["Date", "Description", "Category", "Amount", "Type", "Recurring"],
    ];
    const rows = transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.category,
        `$${t.amount.toFixed(2)}`,
        t.type,
        t.isRecurring ? t.recurringInterval : "One-time",
    ]);

    autoTable(doc, {
        head: headers,
        body: rows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [147, 51, 234] }, // purple-600
    });

    doc.save("transactions.pdf");
}
