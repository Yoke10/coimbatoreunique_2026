import { jsPDF } from 'jspdf'

// Helper to convert WEBP with alpha to PNG so jsPDF doesn't render a black background
const convertWebPToPNG = (base64) => {
    return new Promise((resolve) => {
        if (!base64 || !base64.startsWith('data:image/webp')) {
            return resolve(base64)
        }
        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            resolve(canvas.toDataURL('image/png'))
        }
        img.onerror = () => resolve(base64) // fallback
        img.src = base64
    })
}

const formatDate = (dateStr) => {
    if (!dateStr) return "N/A"
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/
    const match = String(dateStr).match(regex)
    if (match) return `${match[3]}-${match[2]}-${match[1]}`
    return dateStr
}

export const generateReportPDF = async (data, action = 'download') => {
    if (data.logos && data.logos.length > 0) {
        data.logos = await Promise.all(data.logos.map(l => convertWebPToPNG(l)))
    }
    const doc = new jsPDF({ unit: "mm", format: "a4", compress: true })
    drawReportOnDoc(doc, data)

    if (action === 'preview') window.open(doc.output('bloburl'))
    else doc.save(`${data.eventName || 'Report'}.pdf`)
}

export const generateBulkPDF = async (reports, filename = 'Bulk_Reports.pdf') => {
    if (!reports || reports.length === 0) return alert("No reports to generate")

    const doc = new jsPDF({ unit: "mm", format: "a4", compress: true })

    for (let i = 0; i < reports.length; i++) {
        let report = reports[i]
        if (report.logos && report.logos.length > 0) {
            report.logos = await Promise.all(report.logos.map(l => convertWebPToPNG(l)))
        }
        if (i > 0) doc.addPage()
        drawReportOnDoc(doc, report)
    }

    doc.save(filename)
}

const getImageType = (data) => {
    if (!data) return 'JPEG'
    if (data.startsWith('data:image/webp')) return 'WEBP'
    if (data.startsWith('data:image/png')) return 'PNG'
    return 'JPEG'
}

const drawReportOnDoc = (doc, data) => {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)
    let y = margin

    const colors = {
        navy: [0, 51, 102], // Navy blue
        black: [30, 30, 30],
        grey: [100, 110, 120],
        lightBg: [245, 248, 252], // Light blue tint
        tableHeader: [225, 235, 245] // Soft blue
    }

    // Draw the page footer: a thin rule + page number at the bottom
    const drawPageFooter = (pageNum) => {
        const footerY = pageHeight - 10
        doc.setDrawColor(180, 180, 190)
        doc.setLineWidth(0.4)
        doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.setTextColor(120, 120, 130)
        doc.text(`Page ${pageNum}`, pageWidth - margin, footerY, { align: "right" })
    }

    const ensureSpace = (heightNeeded) => {
        if (y + heightNeeded > pageHeight - 18) {
            drawPageFooter(doc.internal.getNumberOfPages())
            doc.addPage()
            y = margin
            return true
        }
        return false
    }

    const drawSectionLabel = (label) => {
        ensureSpace(15)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(10)
        doc.setTextColor(...colors.navy)
        doc.text(label.toUpperCase(), margin, y)
        y += 6
    }

    const drawBodyText = (text) => {
        if (!text) return
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        doc.setTextColor(...colors.black)

        const lineHeight = 5
        const lines = doc.splitTextToSize(text, contentWidth)

        lines.forEach((line) => {
            if (ensureSpace(lineHeight)) { }
            doc.text(line, margin, y)
            y += lineHeight
        })
        y += 8
    }

    const drawSmartTable = (title, headers, rows, colWidths) => {
        if (!rows || rows.length === 0) return
        const rowHeight = 8
        const titleHeight = 10
        const tableHeight = (rows.length + 1) * rowHeight

        ensureSpace(tableHeight + titleHeight)

        doc.setFont("helvetica", "bold")
        doc.setFontSize(10)
        doc.setTextColor(...colors.navy)
        doc.text(title.toUpperCase(), margin, y)
        y += 6

        // Header
        doc.setFillColor(...colors.tableHeader)
        doc.rect(margin, y, contentWidth, rowHeight, 'F')
        doc.setTextColor(...colors.navy)
        doc.setFontSize(9)

        let cx = margin + 2
        headers.forEach((h, i) => {
            doc.text(h, cx, y + 5.5)
            cx += colWidths[i]
        })
        y += rowHeight

        // Rows
        doc.setTextColor(...colors.black)
        doc.setFont("helvetica", "normal")

        rows.forEach((row, rowIndex) => {
            if (rowIndex % 2 === 1) {
                doc.setFillColor(...colors.lightBg)
                doc.rect(margin, y, contentWidth, rowHeight, 'F')
            }
            doc.setDrawColor(220)
            doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight)

            let rcx = margin + 2
            row.forEach((cell, i) => {
                doc.text(String(cell), rcx, y + 5.5)
                rcx += colWidths[i]
            })
            y += rowHeight
        })
        y += 8
    }

    // LOGOS (Header) - Centered and Aspect-Ratio-Aware
    const logoHeight = 14
    const logoGap = 6
    const logos = data.logos || []
    const validLogos = logos.filter(l => l)

    if (validLogos.length > 0) {
        const logoInfos = validLogos.map(logo => {
            try {
                const props = doc.getImageProperties(logo)
                const aspect = props.width / props.height
                return { logo, aspect, width: logoHeight * aspect }
            } catch (e) {
                return { logo, aspect: 1, width: logoHeight }
            }
        })

        const totalLogosWidth = logoInfos.reduce((sum, item) => sum + item.width, 0) + (logoGap * (logoInfos.length - 1))
        let logoX = (pageWidth - totalLogosWidth) / 2

        logoInfos.forEach(item => {
            try {
                doc.addImage(item.logo, getImageType(item.logo), logoX, y, item.width, logoHeight, undefined, 'FAST')
            } catch (e) { }
            logoX += item.width + logoGap
        })

        y += logoHeight + 5
    }

    // CLUB INFO
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.setTextColor(...colors.navy)
    doc.text((data.clubName || "ROTARACT CLUB OF COIMBATORE UNIQUE").toUpperCase(), pageWidth / 2, y, { align: "center" })
    y += 7

    doc.setFontSize(12)
    doc.setTextColor(...colors.grey)
    doc.text(data.parentClub || "PARENTED BY ROTARY CLUB OF THONDAMUTHUR", pageWidth / 2, y, { align: "center" })
    y += 7

    // META INFO
    doc.setFontSize(10)
    doc.setTextColor(...colors.black)
    const metaString = `${data.clubId || 'CLUB ID : 50295'} | ${data.group || 'GROUP 1'} | ${data.rid || 'RI DISTRICT : 3206'}`
    doc.text(metaString, pageWidth / 2, y, { align: "center" })
    y += 6

    // TITLE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...colors.navy);
    const title = data.eventName || "Event Name";
    const leftMargin = 20;
    doc.text(title, leftMargin, y);
    y += 15;


    // META GRID
    const metaData = [
        { label: "EVENT CHAIR", value: data.eventChair },
        { label: "LOCATION", value: data.location },
        { label: "AVENUE", value: data.avenue },
        { label: "DATE", value: formatDate(data.eventDate) }
    ]
    const metaStartY = y
    const colW = contentWidth / 2
    metaData.forEach((item, index) => {
        const col = index % 2
        const row = Math.floor(index / 2)
        const xPos = margin + (col * colW)
        const yPos = metaStartY + (row * 12)
        doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(...colors.navy)
        doc.text(item.label, xPos, yPos)
        doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(...colors.black)
        doc.text(item.value || "—", xPos, yPos + 5)
    })
    y = metaStartY + (2 * 12) + 15

    // SECTIONS
    drawSectionLabel("DESCRIPTION")
    drawBodyText(data.description)

    // ATTENDANCE CARD
    ensureSpace(40)
    drawSectionLabel("ATTENDANCE SUMMARY")
    doc.setFillColor(...colors.lightBg)
    doc.setDrawColor(220)
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD')

    const counts = [
        { label: "ROTARACTORS", val: data.rotaractors },
        { label: "ROTARY MEMBERS", val: data.rotary },
        { label: "OTHERS", val: data.others },
        { label: "TOTAL", val: data.total }
    ]
    const cardColW = contentWidth / 4
    let cardY = y + 7
    counts.forEach((c, i) => {
        const cx = margin + (i * cardColW) + (cardColW / 2)
        doc.setFont("helvetica", "bold"); doc.setFontSize(7); doc.setTextColor(...colors.navy)
        doc.text(c.label, cx, cardY, { align: "center" })
        doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(...colors.black)
        doc.text(String(c.val || 0), cx, cardY + 6, { align: "center" })
    })
    y += 35

    drawSectionLabel("COMPLETION REPORT")
    drawBodyText(data.report)
    drawSectionLabel("WHY THIS EVENT")
    drawBodyText(data.why)
    drawSectionLabel("IMPACT OF THE EVENT")
    drawBodyText(data.impact)

    // FINANCIALS
    if (data.income && data.income.length > 0) {
        const rows = data.income.map(i => [i.desc, "Rs. " + i.amount])
        const total = data.income.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
        rows.push(["TOTAL INCOME", "Rs. " + total])
        drawSmartTable("INCOME", ["SOURCE", "AMOUNT"], rows, [contentWidth * 0.7, contentWidth * 0.3])
    }
    if (data.expense && data.expense.length > 0) {
        const rows = data.expense.map(i => [i.desc, "Rs. " + i.amount])
        const total = data.expense.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
        rows.push(["TOTAL EXPENSE", "Rs. " + total])
        drawSmartTable("EXPENSE", ["PURPOSE", "AMOUNT"], rows, [contentWidth * 0.7, contentWidth * 0.3])
    }

    // DETAILED ATTENDANCE
    const formatDetails = (arr) => arr ? arr.map((d, i) => [i + 1, d.name, d.club]) : []
    if (data.rotaractorsDetails?.length > 0)
        drawSmartTable("ROTARACTORS", ["#", "NAME", "CLUB"], formatDetails(data.rotaractorsDetails), [10, contentWidth * 0.4, contentWidth * 0.5])
    if (data.rotaryDetails?.length > 0)
        drawSmartTable("ROTARY MEMBERS", ["#", "NAME", "CLUB"], formatDetails(data.rotaryDetails), [10, contentWidth * 0.4, contentWidth * 0.5])
    if (data.othersDetails?.length > 0)
        drawSmartTable("OTHERS", ["#", "NAME", "CLUB"], formatDetails(data.othersDetails), [10, contentWidth * 0.4, contentWidth * 0.5])

    // POSTER
    if (data.poster) {
        ensureSpace(80)
        drawSectionLabel("PROJECT POSTER")
        try {
            const imgProps = doc.getImageProperties(data.poster)
            // Reduced size: 35% width, max 80mm height
            const maxW = contentWidth * 0.35
            const maxH = 80

            const ratio = Math.min(maxW / imgProps.width, maxH / imgProps.height)
            const newW = imgProps.width * ratio
            const newH = imgProps.height * ratio

            // Left align
            const posterX = margin

            doc.addImage(data.poster, getImageType(data.poster), posterX, y, newW, newH, undefined, 'FAST')
            y += newH + 10 // Adjust Y dynamically based on height
        } catch (e) {
            console.error("Poster Error:", e)
        }
        y += 10
    }

    // GALLERY
    if (data.images && data.images.length > 0) {
        ensureSpace(60)
        drawSectionLabel("COMPLETION IMAGES")

        const gap = 5
        const imgBoxW = (contentWidth - (gap * (data.images.length - 1))) / data.images.length
        const imgBoxH = 50 // Reduced height
        let gx = margin

        data.images.forEach((g) => {
            if (g) {
                try {
                    const imgProps = doc.getImageProperties(g)
                    const ratio = Math.min(imgBoxW / imgProps.width, imgBoxH / imgProps.height)
                    const newW = imgProps.width * ratio
                    const newH = imgProps.height * ratio

                    const offsetX = (imgBoxW - newW) / 2
                    const offsetY = (imgBoxH - newH) / 2

                    doc.addImage(g, getImageType(g), gx + offsetX, y + offsetY, newW, newH, undefined, 'FAST')
                    gx += imgBoxW + gap
                } catch (e) {
                    console.error("Gallery Error:", e)
                }
            }
        })
        y += imgBoxH + 10
    }

    // Draw footer on the last (or only) page
    drawPageFooter(doc.internal.getNumberOfPages())
}

export const generateTreasuryPDF = async (data, action = 'download') => {
    if (data.logos && data.logos.length > 0) {
        data.logos = await Promise.all(data.logos.map(l => convertWebPToPNG(l)))
    }
    const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
    drawTreasuryReportOnDoc(doc, data)

    if (action === 'preview') window.open(doc.output('bloburl'))
    else if (action === 'bloburl') return doc.output('bloburl')
    else doc.save(`Treasury_Report_${data.period || 'Summary'}.pdf`)
}

const drawTreasuryReportOnDoc = (doc, data) => {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 12
    const contentWidth = pageWidth - margin * 2
    let y = margin

    // Navy blue theme colors
    const colors = {
        navy: [0, 51, 102], // Navy blue
        black: [30, 30, 30],
        red: [220, 53, 69], // Red for negative balances
        lightBlueBg: [225, 235, 245], // Soft blue for headers
        lighterBlueBg: [245, 248, 252], // Very light blue for rows
        white: [255, 255, 255],
        border: [180, 200, 220] // Soft border
    }

    const ensureSpace = (heightNeeded) => {
        if (y + heightNeeded > pageHeight - 15) {
            drawPageFooter(doc.internal.getNumberOfPages())
            doc.addPage()
            y = margin
            return true
        }
        return false
    }

    const drawPageFooter = (pageNum) => {
        const footerY = pageHeight - 8
        doc.setDrawColor(180)
        doc.setLineWidth(0.4)
        doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.setTextColor(120)
        doc.text(`Page ${pageNum}`, pageWidth - margin, footerY, { align: 'right' })
    }

    // --- HEADER ---
    const logos = data.logos || []
    const validLogos = logos.filter(l => l)

    if (validLogos.length > 0) {
        const logoHeight = 14
        const logoGap = 6
        const logoInfos = validLogos.map(logo => {
            try {
                const props = doc.getImageProperties(logo)
                const aspect = props.width / props.height
                return { logo, aspect, width: logoHeight * aspect }
            } catch (e) {
                return { logo, aspect: 1, width: logoHeight }
            }
        })

        const totalLogosWidth = logoInfos.reduce((sum, item) => sum + item.width, 0) + (logoGap * (logoInfos.length - 1))
        let logoX = (pageWidth - totalLogosWidth) / 2

        logoInfos.forEach(item => {
            try {
                doc.addImage(item.logo, getImageType(item.logo), logoX, y, item.width, logoHeight, undefined, 'FAST')
            } catch (e) { }
            logoX += item.width + logoGap
        })

        y += logoHeight + 5
    }

    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.setTextColor(...colors.navy)
    doc.text((data.clubName || "ROTARACT CLUB OF COIMBATORE UNIQUE").toUpperCase(), pageWidth / 2, y, { align: "center" })
    y += 6

    doc.setFontSize(11)
    doc.text(data.parentClub || "SPONSORED BY : ROTARY CLUB OF THONDAMUTHUR", pageWidth / 2, y, { align: "center" })
    y += 6

    doc.setFontSize(10)
    doc.setTextColor(...colors.black)
    doc.text(`${data.clubId || 'CLUB ID : 50295'} | ${data.group || 'GROUP 1'} | ${data.rid || 'RI DISTRICT 3206'}`, pageWidth / 2, y, { align: "center" })
    y += 6

    doc.setFontSize(12)
    doc.setTextColor(...colors.navy)
    const accTitle = `Club's Account Statement (${data.period || 'All Time'})`
    const accTitleW = doc.getTextWidth(accTitle)
    doc.text(accTitle, (pageWidth - accTitleW) / 2, y)
    y += 8

    // HELPER: Draw bordered cell with text
    const drawCell = (text, x, yPos, w, h, bg, align = 'center', fontStyle = 'normal', textColor = colors.black) => {
        if (bg) {
            doc.setFillColor(...bg)
            doc.rect(x, yPos, w, h, 'F')
        }
        doc.setDrawColor(...colors.border)
        doc.setLineWidth(0.3)
        doc.rect(x, yPos, w, h, 'S')

        doc.setFont("helvetica", fontStyle)
        doc.setTextColor(...textColor)
        doc.setFontSize(9)

        // Vertical centering offset
        const textY = yPos + (h / 2) + 1.2

        // Clip text if it's too long
        let printText = String(text)
        // basic clipping logic (approx)
        if (printText.length > (w / 2)) {
            // Very simple truncation to avoid text bleeding out of cell
            const maxChars = Math.floor(w / 1.6)
            if (printText.length > maxChars) printText = printText.substring(0, maxChars - 3) + "..."
        }

        if (align === 'center') {
            doc.text(printText, x + (w / 2), textY, { align: 'center' })
        } else if (align === 'right') {
            doc.text(printText, x + w - 2, textY, { align: 'right' })
        } else {
            doc.text(printText, x + 2, textY, { align: 'left' })
        }
    }

    const formatCurrencyPDF = (amount) => {
        if (amount === undefined || amount === null || isNaN(amount)) return "Rs. 0.00"
        return 'Rs. ' + Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    // --- SUMMARY TABLE ---
    const rowH = 7.5

    // Summary Header
    drawCell("OVERALL FINANCIAL OVERVIEW", margin, y, contentWidth, rowH, colors.lightBlueBg, 'center', 'bold')
    y += rowH

    const totalIncome = Number(data.totalEventIncome || 0) + Number(data.totalDuesIncome || 0)

    const summaryColW1 = contentWidth * 0.50
    const summaryColW2 = contentWidth * 0.50

    const summaryRows = [
        ["TOTAL CLUB DUES", formatCurrencyPDF(data.totalDuesIncome)],
        ["TOTAL INCOME", formatCurrencyPDF(totalIncome)],
        ["TOTAL EXPENSE", formatCurrencyPDF(data.totalEventExpense)]
    ]

    summaryRows.forEach(row => {
        drawCell(row[0], margin, y, summaryColW1, rowH, colors.lighterBlueBg, 'center', 'bold')
        drawCell(row[1], margin + summaryColW1, y, summaryColW2, rowH, colors.white, 'center', 'bold')
        y += rowH
    })
    y += 5

    // --- EVENTS TABLE ---
    const colDate = 24
    const colInc = 28
    const colExp = 28
    const colEvt = contentWidth - colDate - colInc - colExp
    const halfEvt = colEvt / 2

    // Main Header
    drawCell("DATE", margin, y, colDate, rowH, colors.lightBlueBg, 'center', 'bold')
    drawCell("EVENTS", margin + colDate, y, colEvt, rowH, colors.lightBlueBg, 'center', 'bold')
    drawCell("INCOME", margin + colDate + colEvt, y, colInc, rowH, colors.lightBlueBg, 'center', 'bold')
    drawCell("EXPENSE", margin + colDate + colEvt + colInc, y, colExp, rowH, colors.lightBlueBg, 'center', 'bold')
    y += rowH

    const events = data.matchingEvents || []
    events.forEach(evt => {
        const incs = evt.incomes || []
        const exps = evt.expenses || []
        const maxLines = Math.max(incs.length, exps.length, 1)

        const eventTotalHeight = rowH + rowH + (maxLines * rowH)
        ensureSpace(eventTotalHeight)

        // Merged Cells for Date, Total Income, Total Expense (spanning full event height)
        drawCell(formatDate(evt.date), margin, y, colDate, eventTotalHeight, colors.white, 'center', 'bold')
        drawCell(formatCurrencyPDF(evt.totalIncome), margin + colDate + colEvt, y, colInc, eventTotalHeight, colors.white, 'center', 'bold')
        drawCell(formatCurrencyPDF(evt.totalExpenses), margin + colDate + colEvt + colInc, y, colExp, eventTotalHeight, colors.white, 'center', 'bold')

        let currentY = y

        // Event Header Row (e.g. VIBE CHECK)
        drawCell((evt.name || "UNTITLED EVENT").toUpperCase(), margin + colDate, currentY, colEvt, rowH, colors.lighterBlueBg, 'center', 'bold')
        currentY += rowH

        // Subheader Row (INCOME | EXPENSE)
        drawCell("INCOME DETAILS", margin + colDate, currentY, halfEvt, rowH, colors.lighterBlueBg, 'center', 'bold')
        drawCell("EXPENSE DETAILS", margin + colDate + halfEvt, currentY, halfEvt, rowH, colors.lighterBlueBg, 'center', 'bold')
        currentY += rowH

        // Line Items
        for (let i = 0; i < maxLines; i++) {
            const inc = incs[i]
            const exp = exps[i]

            const incText = inc ? `${inc.name} (${formatCurrencyPDF(inc.amount)})` : "-"
            const expText = exp ? `${exp.name} (${formatCurrencyPDF(exp.amount)})` : "-"

            drawCell(incText, margin + colDate, currentY, halfEvt, rowH, colors.white, 'center', 'normal')
            drawCell(expText, margin + colDate + halfEvt, currentY, halfEvt, rowH, colors.white, 'center', 'normal')
            currentY += rowH
        }

        y += eventTotalHeight
    })

    // Add Member Dues Payments at the bottom
    const duesPayments = data.matchingDuesPayments || []
    if (duesPayments.length > 0) {
        y += 8
        ensureSpace(rowH * 3)
        drawCell("MEMBER DUES PAYMENTS", margin, y, contentWidth, rowH, colors.lightBlueBg, 'center', 'bold')
        y += rowH
        drawCell("DATE PAID", margin, y, contentWidth * 0.3, rowH, colors.lighterBlueBg, 'center', 'bold')
        drawCell("MEMBER NAME", margin + contentWidth * 0.3, y, contentWidth * 0.4, rowH, colors.lighterBlueBg, 'center', 'bold')
        drawCell("TOTAL DUE", margin + contentWidth * 0.7, y, contentWidth * 0.3, rowH, colors.lighterBlueBg, 'center', 'bold')
        y += rowH

        duesPayments.forEach(payment => {
            ensureSpace(rowH)
            drawCell(formatDate(payment.date), margin, y, contentWidth * 0.3, rowH, colors.white, 'center', 'normal')
            drawCell(payment.memberName, margin + contentWidth * 0.3, y, contentWidth * 0.4, rowH, colors.white, 'left', 'normal')
            drawCell(formatCurrencyPDF(payment.amount), margin + contentWidth * 0.7, y, contentWidth * 0.3, rowH, colors.white, 'center', 'normal')
            y += rowH
        })
    }

    // GRAND TOTAL SUMMARY
    y += 10
    ensureSpace(rowH * 4)
    drawCell("GRAND TOTAL SUMMARY", margin, y, contentWidth, rowH, colors.lightBlueBg, 'center', 'bold')
    y += rowH

    const grandTotalIncome = Number(data.totalEventIncome || 0) + Number(data.totalDuesIncome || 0)
    const grandTotalExpense = Number(data.totalEventExpense || 0)
    const grandBalance = grandTotalIncome - grandTotalExpense

    drawCell("TOTAL INCOME", margin, y, contentWidth * 0.7, rowH, colors.white, 'right', 'bold')
    drawCell(formatCurrencyPDF(grandTotalIncome), margin + contentWidth * 0.7, y, contentWidth * 0.3, rowH, colors.white, 'center', 'bold', colors.navy)
    y += rowH

    drawCell("TOTAL EXPENSE", margin, y, contentWidth * 0.7, rowH, colors.white, 'right', 'bold')
    drawCell(formatCurrencyPDF(grandTotalExpense), margin + contentWidth * 0.7, y, contentWidth * 0.3, rowH, colors.white, 'center', 'bold', colors.navy)
    y += rowH

    drawCell("NET BALANCE", margin, y, contentWidth * 0.7, rowH, colors.white, 'right', 'bold')
    drawCell(formatCurrencyPDF(grandBalance), margin + contentWidth * 0.7, y, contentWidth * 0.3, rowH, colors.lighterBlueBg, 'center', 'bold', colors.black)
    y += rowH

    drawPageFooter(doc.internal.getNumberOfPages())
}
