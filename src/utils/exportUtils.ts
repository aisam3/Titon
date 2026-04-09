import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SOPDetails } from '@/services/sopService';

/**
 * Utility to handle data export functionality.
 */
export const exportUtils = {
  /**
   * Export SOP performance logs to CSV.
   */
  exportToCSV(data: SOPDetails) {
    const { sop, logs } = data;
    
    // Define headers
    const headers = [
      'Date',
      'Time Spent (mins)',
      'Output Units',
      'Errors',
      'Efficiency (units/hr)',
      'Error Rate (%)',
      'Score (0-100)'
    ];

    // Map logs to rows
    const rows = logs.map(log => [
      new Date(log.created_at).toLocaleDateString(),
      log.time_taken,
      log.output,
      log.errors,
      log.efficiency.toFixed(2),
      (log.error_rate * 100).toFixed(1),
      (log.score * 100).toFixed(0)
    ]);

    // Construct CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${sop.name.toLowerCase().replace(/\s+/g, '-')}-report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Generate a professional PDF report for the SOP.
   */
  exportToPDF(data: SOPDetails) {
    const { sop, logs, metrics_summary, insights } = data;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Header Section
    doc.setFontSize(22);
    doc.setTextColor(20, 30, 50);
    doc.text('TITON PERFORMANCE REPORT', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 35, pageWidth - 14, 35);

    // 2. SOP Info
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(sop.name.toUpperCase(), 14, 45);
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const description = sop.description || 'No description found.';
    const splitDescription = doc.splitTextToSize(description, pageWidth - 28);
    doc.text(splitDescription, 14, 52);

    // 3. Summary Statistics
    let currentY = 65 + (splitDescription.length * 4);
    doc.setFontSize(12);
    doc.setTextColor(20, 30, 50);
    doc.text('NUMBERS AT A GLANCE', 14, currentY);
    
    const stats = [
      { label: 'Avg Efficiency', value: `${metrics_summary.avg_efficiency.toFixed(2)} units/hr` },
      { label: 'Avg Error Rate', value: `${(metrics_summary.avg_error_rate * 100).toFixed(1)}%` },
      { label: 'Avg Score', value: `${metrics_summary.avg_score.toFixed(0)} / 100` },
      { label: 'Best Score', value: `${metrics_summary.best_score.toFixed(0)}` },
    ];

    doc.setFontSize(10);
    stats.forEach((stat, i) => {
      doc.setTextColor(100, 100, 100);
      doc.text(stat.label, 14 + (i * 45), currentY + 10);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text(stat.value, 14 + (i * 45), currentY + 16);
      doc.setFont(undefined, 'normal');
    });

    // 4. Insights Section
    currentY += 30;
    doc.setFontSize(12);
    doc.setTextColor(20, 30, 50);
    doc.text('WHAT WE FOUND', 14, currentY);
    
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    insights.slice(0, 5).forEach((insight, i) => {
      doc.text(`• ${insight}`, 16, currentY + 8 + (i * 6));
    });

    // 5. Execution Logs Table
    currentY += 45;
    doc.setFontSize(12);
    doc.setTextColor(20, 30, 50);
    doc.text('LOG HISTORY', 14, currentY);

    const tableHeaders = [['Date', 'Time (m)', 'Output', 'Errors', 'Work Rate', 'Score']];
    const tableData = logs.map(log => [
      new Date(log.created_at).toLocaleDateString(),
      log.time_taken,
      log.output,
      log.errors,
      log.efficiency.toFixed(1),
      (log.score * 100).toFixed(0)
    ]);

    autoTable(doc, {
      startY: currentY + 5,
      head: tableHeaders,
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [40, 50, 70], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 }
    });

    // Save PDF
    doc.save(`${sop.name.toLowerCase().replace(/\s+/g, '-')}-performance-report.pdf`);
  }
};
