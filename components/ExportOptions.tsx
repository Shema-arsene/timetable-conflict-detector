"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowDownToLine,
  FileText,
  FileSpreadsheet,
  Download,
} from "lucide-react"
import { toast } from "sonner"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

interface PrintOptionsProps {
  timetable: any
  fileName?: string
}

const ExportOptions = ({
  timetable,
  fileName = "timetable",
}: PrintOptionsProps) => {
  const [exporting, setExporting] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Prepare data for export
  const prepareData = () => {
    const headers = [
      "School",
      "Module",
      "Code",
      "Lecturer",
      "Room",
      "Campus",
      "Start Time",
      "End Time",
    ]

    const rows = timetable.entries.map((entry: any) => [
      entry.schoolId?.name || "N/A",
      entry.moduleId?.name || "N/A",
      entry.moduleId?.code || "N/A",
      entry.lecturerId
        ? `${entry.lecturerId.firstName} ${entry.lecturerId.lastName}`
        : "N/A",
      entry.roomId?.name || "N/A",
      entry.campus || "N/A",
      entry.startTime || "N/A",
      entry.endTime || "N/A",
    ])

    return { headers, rows }
  }

  // Export to PDF
  const exportToPDF = () => {
    try {
      setExporting(true)
      const { headers, rows } = prepareData()

      const doc = new jsPDF()

      // Add title
      doc.setFontSize(16)
      doc.text(timetable.title, 14, 20)

      // Add metadata
      doc.setFontSize(10)
      doc.text(`Session: ${timetable.session}`, 14, 30)
      doc.text(
        `Date Range: ${formatDate(timetable.startDate)} - ${formatDate(timetable.endDate)}`,
        14,
        35,
      )
      doc.text(`Created: ${formatDate(timetable.createdAt)}`, 14, 40)

      // Create table
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 45,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      })

      // Save PDF
      doc.save(`${fileName.replace(/\s+/g, "_")}.pdf`)
      toast.success("PDF downloaded successfully!")
    } catch (error) {
      console.error("PDF export error:", error)
      toast.error("Failed to export PDF")
    } finally {
      setExporting(false)
    }
  }

  // Export to Excel
  const exportToExcel = () => {
    try {
      setExporting(true)
      const { headers, rows } = prepareData()

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])

      // Add metadata
      const wscols = [
        { wch: 25 }, // School
        { wch: 30 }, // Module
        { wch: 15 }, // Code
        { wch: 25 }, // Lecturer
        { wch: 15 }, // Room
        { wch: 10 }, // Campus
        { wch: 12 }, // Start Time
        { wch: 12 }, // End Time
      ]
      ws["!cols"] = wscols

      // Create workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Timetable")

      // Add metadata sheet
      const metaData = [
        ["Title", timetable.title],
        ["Session", timetable.session],
        ["Start Date", formatDate(timetable.startDate)],
        ["End Date", formatDate(timetable.endDate)],
        ["Created", formatDate(timetable.createdAt)],
        ["Total Entries", timetable.entries.length],
      ]
      const metaWs = XLSX.utils.aoa_to_sheet(metaData)
      XLSX.utils.book_append_sheet(wb, metaWs, "Summary")

      // Save Excel file
      XLSX.writeFile(wb, `${fileName.replace(/\s+/g, "_")}.xlsx`)
      toast.success("Excel file downloaded successfully!")
    } catch (error) {
      console.error("Excel export error:", error)
      toast.error("Failed to export Excel")
    } finally {
      setExporting(false)
    }
  }

  // Printing (Improvement that can be made later)
  //   const handlePrint = () => {
  //     try {
  //       const printWindow = window.open("", "_blank")
  //       if (!printWindow) {
  //         toast.error("Please allow pop-ups to print")
  //         return
  //       }

  //       const { headers, rows } = prepareData()

  //       // Generate HTML table
  //       const tableHtml = `
  //         <!DOCTYPE html>
  //         <html>
  //         <head>
  //           <title>${timetable.title}</title>
  //           <style>
  //             body { font-family: Arial, sans-serif; margin: 40px; }
  //             h1 { color: #333; }
  //             .metadata { margin: 20px 0; color: #666; }
  //             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  //             th { background-color: #4a90e2; color: white; padding: 10px; text-align: left; }
  //             td { padding: 8px; border-bottom: 1px solid #ddd; }
  //             tr:nth-child(even) { background-color: #f9f9f9; }
  //             .footer { margin-top: 30px; font-size: 12px; color: #999; text-align: right; }
  //           </style>
  //         </head>
  //         <body>
  //           <h1>${timetable.title}</h1>
  //           <div class="metadata">
  //             <p><strong>Session:</strong> ${timetable.session}</p>
  //             <p><strong>Date Range:</strong> ${formatDate(timetable.startDate)} - ${formatDate(timetable.endDate)}</p>
  //             <p><strong>Created:</strong> ${formatDate(timetable.createdAt)}</p>
  //           </div>

  //           <table>
  //             <thead>
  //               <tr>
  //                 ${headers.map((h) => `<th>${h}</th>`).join("")}
  //               </tr>
  //             </thead>
  //             <tbody>
  //               ${rows
  //                 .map(
  //                   (row) => `
  //                 <tr>
  //                   ${row.map((cell) => `<td>${cell}</td>`).join("")}
  //                 </tr>
  //               `,
  //                 )
  //                 .join("")}
  //             </tbody>
  //           </table>

  //           <div class="footer">
  //             Generated on ${new Date().toLocaleString()}
  //           </div>
  //         </body>
  //         </html>
  //       `

  //       printWindow.document.write(tableHtml)
  //       printWindow.document.close()
  //       printWindow.print()
  //     } catch (error) {
  //       console.error("Print error:", error)
  //       toast.error("Failed to print")
  //     }
  //   }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={exporting}>
          <ArrowDownToLine className="w-4 h-4 mr-2" />
          {exporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToPDF} className="font-semibold">
          <FileText className="w-4 h-4 mr-2" />
          Download as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel} className="font-semibold">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Download as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExportOptions
