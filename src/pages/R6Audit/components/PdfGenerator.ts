import jsPDF from "jspdf";
import "jspdf-autotable";
import { AuditResponses, AuditResults } from "../types";

export const generatePdf = (responses: AuditResponses, results: AuditResults) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(11, 31, 51); // #050b18
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("TITON R6 Audit Results", 105, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(31, 182, 166); // #84ce3a
  doc.text("Fastest Path to Measurable Results", 105, 30, { align: "center" });
  
  // Body
  doc.setTextColor(50, 50, 50);
  
  // Profile Section
  doc.setFontSize(16);
  doc.text("Agency Profile", 14, 55);
  
  doc.setFontSize(10);
  doc.text(`Name: ${responses.fullName}`, 14, 65);
  doc.text(`Agency: ${responses.agencyName}`, 14, 72);
  doc.text(`Email: ${responses.email}`, 14, 79);
  if (responses.website) doc.text(`Website: ${responses.website}`, 14, 86);
  
  let currentY = responses.website ? 96 : 89;
  
  // Results Section
  doc.setFontSize(16);
  doc.text("Your Recommended Path", 14, currentY);
  currentY += 10;
  
  doc.setFontSize(10);
  doc.text(`Quick BreakPoints™ Opportunity: ${results.quickBreakpointOpportunity}`, 14, currentY, { maxWidth: 180 });
  currentY += 10;
  doc.text(`Recommended First Proof Tile™: ${results.recommendedFirstProofTile}`, 14, currentY, { maxWidth: 180 });
  currentY += 10;
  doc.text(`TITON Fleet Match: ${results.fleetRecommendation}`, 14, currentY);
  currentY += 10;
  doc.text(`Estimated Time to First Proof Tile™: ${results.estimatedTimeToProof}`, 14, currentY);
  currentY += 10;
  doc.text(`Quadrant Match: ${results.quadrantMatch}`, 14, currentY);
  
  currentY += 20;
  
  // Detailed Responses Table
  doc.setFontSize(16);
  doc.text("Detailed Responses", 14, currentY);
  currentY += 10;
  
  const tableData = [
    ["Country", responses.country],
    ["Timezone", responses.timezone],
    ["Core Workflows", responses.workflowCount],
    ["SOP Status", responses.sopsDocumented],
    ["Pain Points", responses.painPoints.join(", ")],
    ["Confidence Score", `${responses.confidenceScore}/10`],
    ["Quick BreakPoints", responses.quickBreakpoints.join(", ")],
    ["Target Workflow", responses.targetWorkflow],
    ["GHL Status", responses.ghlStatus],
    ["Tools Used", responses.toolsUsed.join(", ")],
    ["Readiness", responses.readinessTimeline]
  ];
  
  // @ts-ignore - jspdf-autotable extends jsPDF but types might be missing
  doc.autoTable({
    startY: currentY,
    head: [["Category", "Response"]],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [11, 31, 51] },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: 'bold' },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `TITON System - Generated on ${new Date().toLocaleDateString()}`,
      105,
      290,
      { align: "center" }
    );
  }
  
  doc.save(`TITON_R6_Audit_${responses.agencyName.replace(/\s+/g, '_')}.pdf`);
};
