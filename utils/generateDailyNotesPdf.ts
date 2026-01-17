"use client";

import jsPDF from "jspdf";

interface NoteItem {
    patientName: string;
    notes: string;
    date: string;   // YYYY-MM-DD
    time: string;   // HH:mm
    createdBy: string;
}

export const generateDailyNotesPdf = (data: NoteItem[]) => {
    const doc = new jsPDF();
    let y = 20;

    // Title
    doc.setFontSize(16);
    doc.text("Daily Notes Report", 105, y, { align: "center" });
    y += 12;

    // Sort: Old date at top, new date at bottom
    const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });

    doc.setFontSize(11);

    sortedData.forEach((item, index) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        // Date & Time
        doc.setFont("helvetica", "bold");
        doc.text(item.date, 14, y);
        doc.text(item.time, 190, y, { align: "right" });

        y += 6;

        // Patient Name
        doc.setFont("helvetica", "normal");
        doc.text(`Patient: ${item.patientName}`, 14, y);
        y += 6;

        // Notes (auto wrap)
        const notesText = doc.splitTextToSize(
            `Notes: ${item.notes}`,
            180
        );
        doc.text(notesText, 14, y);
        y += notesText.length * 6;

        // Created By
        doc.setFontSize(10);
        doc.text(`Created By: ${item.createdBy}`, 14, y);
        y += 8;

        // Divider
        doc.line(14, y, 196, y);
        y += 8;

        doc.setFontSize(11);
    });

    doc.save("daily-notes-report.pdf");
};
