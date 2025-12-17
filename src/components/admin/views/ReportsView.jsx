import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter } from 'lucide-react';
import { firebaseService } from '../../../services/firebaseService';
import { generateReportPDF, generateBulkPDF } from '../../../utils/pdfGenerator';
import '../layout/AdminLayout.css';

const ReportsView = () => {
    const [reports, setReports] = useState([]);
    const [filterMonth, setFilterMonth] = useState(new Date().toISOString().substring(0, 7));

    useEffect(() => {
        const load = async () => setReports(await firebaseService.getReports());
        load();
    }, []);

    const filteredReports = reports.filter(r => !filterMonth || r.eventDate.startsWith(filterMonth));

    return (
        <div className="admin-view">
            <h2 className="view-title">Reports</h2>

            <div className="admin-filter-bar">
                <Filter size={20} color="#666" />
                <input
                    type="month"
                    value={filterMonth}
                    onChange={e => setFilterMonth(e.target.value)}
                    className="admin-input-field"
                    style={{ width: '200px', margin: 0 }}
                />
                <div style={{ flex: 1 }} />
                {filteredReports.length > 0 && (
                    <button onClick={() => generateBulkPDF(filteredReports, `Reports_${filterMonth}.pdf`)} className="btn-add-new">
                        <Download size={18} /> Download All ({filteredReports.length})
                    </button>
                )}
            </div>

            <div className="admin-list-container">
                {filteredReports.length === 0 ? <p className="empty-state">No reports for this month.</p> : (
                    filteredReports.map(report => (
                        <div key={report.id} className="list-row-card">
                            <div className="row-content">
                                <h4 className="row-title">{report.eventName}</h4>
                                <p className="row-subtitle">Date: {report.eventDate}</p>
                            </div>
                            <div className="row-actions">
                                <button onClick={() => generateReportPDF(report)} className="action-btn view">
                                    <Download size={16} /> Download PDF
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReportsView;
