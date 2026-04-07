
import { jsPDF } from 'jspdf';
import { Student, TaskAttempt, SessionSummary } from '../types';

export const exportResultsToPdf = (
  student: Student,
  summary: SessionSummary,
  attempts: TaskAttempt[]
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Titel
  doc.setFontSize(22);
  doc.text('Type Trainer – Resultaat', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Leerling Informatie
  doc.setFontSize(12);
  doc.text(`Naam: ${student.name}`, 20, yPos);
  yPos += 7;
  doc.text(`Nummer: ${student.studentNumber}`, 20, yPos);
  yPos += 10;

  // Tijd
  const start = new Date(summary.startTimestampISO).toLocaleString();
  const end = new Date(summary.endTimestampISO).toLocaleString();
  doc.text(`Begonnen: ${start}`, 20, yPos);
  yPos += 7;
  doc.text(`Klaar: ${end}`, 20, yPos);
  yPos += 15;

  // Samenvatting
  doc.setFontSize(14);
  doc.text('Hoe heb je het gedaan?', 20, yPos);
  yPos += 8;
  doc.setFontSize(12);
  doc.text(`Meteen goed: ${summary.correctOnFirstTryCount} van de 50`, 25, yPos);
  yPos += 7;
  doc.text(`Aantal foutjes: ${summary.totalErrors}`, 25, yPos);
  yPos += 7;
  doc.text(`Overgeslagen: ${summary.totalSkipped}`, 25, yPos);
  yPos += 15;

  // Tabel
  doc.setFontSize(14);
  doc.text('Al je antwoorden', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  const headers = ['Nr', 'Teken', 'Meteen goed?', 'Hoe vaak?', 'Klaar?'];
  const colWidths = [15, 25, 40, 30, 30];
  const startX = 20;

  // Koptekst Tabel
  let currentX = startX;
  headers.forEach((h, i) => {
    doc.text(h, currentX, yPos);
    currentX += colWidths[i];
  });
  yPos += 5;
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 7;

  // Rijtjes invullen
  attempts.forEach((attempt, index) => {
    // Nieuwe pagina als het vol is
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
      currentX = startX;
      headers.forEach((h, i) => {
        doc.text(h, currentX, yPos);
        currentX += colWidths[i];
      });
      yPos += 5;
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 7;
    }

    currentX = startX;
    doc.text(`${attempt.index}`, currentX, yPos);
    currentX += colWidths[0];
    doc.text(`'${attempt.target}'`, currentX, yPos);
    currentX += colWidths[1];
    doc.text(attempt.firstTryCorrect ? 'Ja' : 'Nee', currentX, yPos);
    currentX += colWidths[2];
    doc.text(`${attempt.attempts}`, currentX, yPos);
    currentX += colWidths[3];
    doc.text(attempt.skipped ? 'Nee' : 'Ja', currentX, yPos);
    
    yPos += 7;
  });

  // Opslaan
  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`TypeTrainer_${student.studentNumber}_${dateStr}.pdf`);
};
