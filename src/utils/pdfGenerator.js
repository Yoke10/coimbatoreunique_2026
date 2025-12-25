import { jsPDF } from 'jspdf'

export const generateReportPDF = (data, action = 'download') => {
    const doc = new jsPDF({ unit: "mm", format: "a4", compress: true })
    drawReportOnDoc(doc, data)

    if (action === 'preview') window.open(doc.output('bloburl'))
    else doc.save(`${data.eventName || 'Report'}.pdf`)
}

export const generateBulkPDF = (reports, filename = 'Bulk_Reports.pdf') => {
    if (!reports || reports.length === 0) return alert("No reports to generate")

    const doc = new jsPDF({ unit: "mm", format: "a4", compress: true })

    reports.forEach((report, index) => {
        if (index > 0) doc.addPage()
        drawReportOnDoc(doc, report)
    })

    doc.save(filename)
}

const drawReportOnDoc = (doc, data) => {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)
    let y = margin

    const colors = {
        navy: [20, 30, 90],
        black: [30, 30, 30],
        grey: [100, 100, 100],
        lightBg: [248, 249, 250],
        tableHeader: [230, 230, 235]
    }

    const ensureSpace = (heightNeeded) => {
        if (y + heightNeeded > pageHeight - margin) {
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
        doc.setFillColor(...colors.navy)
        doc.rect(margin, y, contentWidth, rowHeight, 'F')
        doc.setTextColor(255, 255, 255)
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

    const getImageType = (data) => {
        if (!data) return 'JPEG'
        if (data.startsWith('data:image/webp')) return 'WEBP'
        if (data.startsWith('data:image/png')) return 'PNG'
        return 'JPEG'
    }

    // LOGOS (Header) - Centered
    const logoSize = 25
    const logos = data.logos || []

    // Calculate total width of logos to center them
    const validLogos = logos.filter(l => l)
    const totalLogoWidth = (validLogos.length * logoSize) + ((validLogos.length - 1) * 5)
    let logoX = (pageWidth - totalLogoWidth) / 2

    validLogos.forEach(logo => {
        try { doc.addImage(logo, getImageType(logo), logoX, y, logoSize, logoSize, undefined, 'FAST') } catch (e) { }
        logoX += logoSize + 5
    })

    y += logoSize + 5

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
    y += 15

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
        { label: "DATE", value: data.eventDate }
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
}
