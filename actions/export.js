import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Export to CSV
export function exportToCSV(transactions) {
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
    const url = URL.createObjectURL(blob); // creating url for this blob file 
    const link = document.createElement("a"); // creating a anchor tag 
    link.href = url; // setting the url for this anchor tag 
    link.setAttribute("download", "transactions.csv"); // setting the download attribute for this anchor tag 
    document.body.appendChild(link); // adding this anchor tag to the document 
    link.click(); // clicking the anchor tag to trigger the download 
    document.body.removeChild(link); // removing the anchor tag from the document 
}

// Export to PDF
export function exportToPDF(transactions) {
    const doc = new jsPDF(); // initialize the jsPDF object 
    const headers = [
        ["Date", "Description", "Category", "Amount", "Type", "Recurring"],
    ];

    // Map transaction data for the table rows
    const rows = transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.category,
        `$${t.amount.toFixed(2)}`,
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

    doc.save("transactions.pdf");
}
