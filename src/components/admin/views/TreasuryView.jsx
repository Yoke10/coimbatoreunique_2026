import React, { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'
import TreasuryReportManager from '../../finance/TreasuryReportManager'
import AdminModal from '../common/AdminModal'
import { AdminInput } from '../common/FormComponents'
import { firebaseService } from '../../../services/firebaseService'
import { useToast } from '../../ui/Toast/ToastContext'

const TreasuryView = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      const cfg = await firebaseService.getClubConfig();
      setPassword(cfg.treasuryPassword || 'rotaract123');
      setIsLoading(false);
    };
    fetchConfig();
  }, []);

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      toast({ title: 'Password cannot be empty', variant: 'destructive' });
      return;
    }
    try {
      await firebaseService.saveClubConfig({ treasuryPassword: password });
      toast({ title: 'Password updated successfully', variant: 'success' });
      setIsModalOpen(false);
    } catch (error) {
      toast({ title: 'Failed to update password', variant: 'destructive' });
    }
  };

  return (
    <div className="admin-view">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="view-title">Treasury Report Management</h2>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="btn-add-new" 
          style={{ background: 'var(--primary-magenta)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          disabled={isLoading}
        >
          <Lock size={18} />
          Change Access Password
        </button>
      </div>
      <TreasuryReportManager hideBrand />

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Change Treasury Password">
        <form onSubmit={handleSavePassword}>
          <div style={{ marginBottom: '1.5rem', color: 'var(--dark-gray)', fontSize: '0.9rem' }}>
            This password is required by members to access the Treasury section in the Member Space.
          </div>
          <AdminInput 
            label="Treasury Access Password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Enter new password"
          />
          <button type="submit" className="admin-btn-primary" style={{ marginTop: '1.5rem' }}>
            Update Password
          </button>
        </form>
      </AdminModal>
    </div>
  )
}

export default TreasuryView
