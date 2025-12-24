import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePdf = (analysis) => {
    try {
        console.log("Generating PDF for:", analysis);
        if (!analysis || !analysis.topics) {
            console.error("Invalid analysis data for PDF generation");
            alert("Error: No syllabus data found to export.");
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Title
        doc.setFontSize(22);
        doc.setTextColor(44, 62, 80);
        doc.text('BlueprintX Study Roadmap', 14, 22);

        doc.setFontSize(12);
        doc.setTextColor(127, 140, 141);
        doc.text(`Generated for: ${analysis.filename || 'Syllabus'}`, 14, 30);
        doc.text(`Total Study Hours: ${analysis.total_study_hours?.toFixed(1) || 'N/A'} hrs`, 14, 37);

        doc.setDrawColor(52, 152, 219);
        doc.setLineWidth(1);
        doc.line(14, 42, pageWidth - 14, 42);

        // Topics Table
        doc.setFontSize(16);
        doc.setTextColor(44, 62, 80);
        doc.text('Course Topics', 14, 55);

        const tableData = [];
        const flattenTopics = (topics, level = 0) => {
            topics.forEach(t => {
                const prefix = '- '.repeat(level);
                tableData.push([
                    t.name,
                    t.importance,
                    t.estimated_hours ? `${t.estimated_hours}h` : '-',
                    t.completed ? 'Done' : 'Pending'
                ]);
                if (t.subtopics) flattenTopics(t.subtopics, level + 1);
            });
        };
        flattenTopics(analysis.topics);

        autoTable(doc, {
            startY: 60,
            head: [['Topic', 'Importance', 'Time', 'Status']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [52, 152, 219] },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        // Schedule if exists
        if (analysis.schedule && analysis.schedule.length > 0) {
            doc.addPage();
            doc.setFontSize(18);
            doc.text('Study Schedule', 14, 22);

            const scheduleData = analysis.schedule.map(s => [
                `Week ${s.week}`,
                s.day,
                s.topic_name,
                `${s.hours}h`
            ]);

            autoTable(doc, {
                startY: 30,
                head: [['Week', 'Day', 'Topic', 'Duration']],
                body: scheduleData,
                theme: 'grid',
                headStyles: { fillColor: [46, 204, 113] }
            });
        }

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.getHeight() - 10);
            doc.text('Powered by BlueprintX - AI Study Plan Generator', 14, doc.internal.pageSize.getHeight() - 10);
        }

        doc.save(`BlueprintX_${analysis.filename || 'StudyPlan'}.pdf`);
    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Failed to generate PDF. Check console for details.");
    }
};
