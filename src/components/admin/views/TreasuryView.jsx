import React from 'react'
import TreasuryReportManager from '../../finance/TreasuryReportManager'

const TreasuryView = () => {
  return (
    <div className="admin-view">
      <h2 className="view-title">Treasury Report Management</h2>
      <TreasuryReportManager hideBrand />
    </div>
  )
}

export default TreasuryView
