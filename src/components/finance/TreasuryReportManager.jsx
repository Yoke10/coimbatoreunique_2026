import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { firebaseService } from '../../services/firebaseService'
import { generateTreasuryPDF } from '../../utils/pdfGenerator'
import { useAuth } from '../../context/AuthContext'
import { DollarSign, Download, Plus, Lock, Unlock, Trash2, Save, RefreshCcw, Eye, X, Edit, Calendar } from 'lucide-react'
import './TreasuryReportManager.css'

const DEFAULT_TREASURY = {
  id: 'global',
  dues: [],
  events: [],
  createdAt: null,
  updatedAt: null,
}

const createMemberDue = (member) => ({
  id: member.id,
  memberId: member.id,
  memberName: member.profile?.fullName || member.username || member.email || 'Unknown Member',
  email: member.profile?.personalEmail || member.profile?.email || member.email || '',
  dueAmount: 2000, // Default due amount, can be changed
  payments: [],
})

const createEmptyEvent = () => ({
  id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  date: '',
  incomes: [], // Changed from sponsors to incomes
  expenses: [],
  locked: false,
})

const formatCurrency = (value) => `₹ ${Number(value || 0).toLocaleString('en-IN')}`

const parseAmount = (value) => {
  const number = Number(String(value).replace(/[^0-9.]/g, ''))
  return Number.isNaN(number) ? 0 : number
}

const isDateInRange = (dateStr, startMonth, endMonth) => {
  if (!dateStr) return false
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return false
  const start = new Date(startMonth + '-01')
  const end = new Date(endMonth + '-01')
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false
  end.setMonth(end.getMonth() + 1)
  end.setDate(0)
  return date >= start && date <= end
}

// Sanitize treasury data for Firebase (remove undefined values)
const sanitizeTreasuryData = (treasury) => {
  const sanitizeDue = (due) => ({
    id: due.id || '',
    memberId: due.memberId || '',
    memberName: due.memberName || 'Unknown',
    email: due.email || '',
    dueAmount: due.dueAmount ?? 0,
    installmentsCount: due.installmentsCount ?? 0,
    installmentAmounts: Array.isArray(due.installmentAmounts) 
      ? due.installmentAmounts.map(a => a ?? 0) 
      : [],
    installments: Array.isArray(due.installments)
      ? due.installments.map(inst => ({
          amount: inst?.amount ?? 0,
          paid: Boolean(inst?.paid),
          date: inst?.date ?? '',
        }))
      : [],
    payments: Array.isArray(due.payments)
      ? due.payments.map(pay => ({
          amount: pay?.amount ?? 0,
          date: pay?.date ?? '',
          installment: pay?.installment ?? 0,
        }))
      : [],
  })

  const sanitizeEvent = (evt) => ({
    id: evt.id || '',
    name: evt.name || 'Untitled Event',
    date: evt.date || '',
    locked: Boolean(evt.locked),
    incomes: Array.isArray(evt.incomes)
      ? evt.incomes.map(inc => ({
          id: inc?.id || '',
          name: inc?.name || '',
          amount: inc?.amount ?? 0,
        }))
      : [],
    expenses: Array.isArray(evt.expenses)
      ? evt.expenses.map(exp => ({
          id: exp?.id || '',
          name: exp?.name || '',
          amount: exp?.amount ?? 0,
        }))
      : [],
  })

  return {
    dues: Array.isArray(treasury.dues) ? treasury.dues.map(sanitizeDue) : [],
    events: Array.isArray(treasury.events) ? treasury.events.map(sanitizeEvent) : [],
  }
}

const TreasuryReportManager = ({ hideBrand = false }) => {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()
  const { data: users = [], isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const allUsers = await firebaseService.getUsers()
      return allUsers.filter(u => u?.role === 'member' || (!u?.role && !String(u?.email).toLowerCase().includes('admin')))
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const { data: treasuryData, isLoading: treasuryLoading, error: treasuryError, refetch } = useQuery({
    queryKey: ['treasury'],
    queryFn: () => firebaseService.getTreasury(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const { data: config = {} } = useQuery({
    queryKey: ['config'],
    queryFn: firebaseService.getClubConfig,
    staleTime: 5 * 60 * 1000
  })

  const [treasury, setTreasury] = useState(DEFAULT_TREASURY)
  const [paymentInputs, setPaymentInputs] = useState({})
  const [editingEventId, setEditingEventId] = useState(null)
  const [newEvent, setNewEvent] = useState(createEmptyEvent())
  const [range, setRange] = useState(() => {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()
    return { start: `${year}-${month}`, end: `${year}-${month}` }
  })
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [currentTab, setCurrentTab] = useState('events') // 'dues' or 'events'
  const [showEventModal, setShowEventModal] = useState(false)
  const [dueInputs, setDueInputs] = useState({})
  const [showClubDueModal, setShowClubDueModal] = useState(false)
  const [clubDueSettings, setClubDueSettings] = useState({
    totalDue: null,
    installments: null,
    installmentAmounts: [],
  })
  const [showEventDetailModal, setShowEventDetailModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showInstallmentDatePicker, setShowInstallmentDatePicker] = useState(false)
  const [datePickerData, setDatePickerData] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const isDirtyRef = useRef(false)

  const updateTreasury = (updater) => {
    isDirtyRef.current = true
    setTreasury(updater)
  }

  useEffect(() => {
    if (!treasuryData) return
    const base = treasuryData || DEFAULT_TREASURY
    
    console.log('Treasury data loaded from Firebase:', {
      dues: (base.dues || []).length,
      events: (base.events || []).length,
      duesSample: (base.dues || [])[0],
    })
    
    // Preserve existing dues from Firebase - don't recreate them
    const persistedDues = (base.dues || []).map(due => ({
      ...due,
      payments: Array.isArray(due.payments) ? due.payments : [],
    }))

    // Only create new dues for members that don't exist in persisted list
    const allMemberIds = new Set([...persistedDues.map(d => d.memberId), ...persistedDues.map(d => d.id)])
    const newMemberDues = users
      .filter(member => !allMemberIds.has(member.id))
      .map(member => createMemberDue(member))

    const newTreasury = {
      id: base.id || 'global',
      dues: [...persistedDues, ...newMemberDues],
      events: Array.isArray(base.events) ? base.events : [],
      createdAt: base.createdAt,
      updatedAt: base.updatedAt,
    }
    
    console.log('Setting treasury with', {
      totalDues: newTreasury.dues.length,
      totalEvents: newTreasury.events.length,
    })
    
    setTreasury(newTreasury)
    
    // Mark as initialized so auto-save can work
    setIsInitialized(true)
  }, [treasuryData, users])

  const filteredDues = useMemo(() => {
    return treasury.dues.map(due => {
      const installments = Array.isArray(due.installments) ? due.installments : []
      const totalPaid = installments.reduce((sum, inst) => sum + (inst.paid ? parseAmount(inst.amount) : 0), 0)
      return {
        ...due,
        totalPaid,
        remaining: (due.dueAmount || 2000) - totalPaid,
        installmentDetails: installments,
      }
    })
  }, [treasury.dues])

  const totalDueCollected = useMemo(() => {
    return treasury.dues.flatMap(due => Array.isArray(due.installments) ? due.installments : [])
      .filter(inst => inst.paid)
      .reduce((sum, inst) => sum + parseAmount(inst.amount), 0)
  }, [treasury.dues])

  const filteredEvents = useMemo(() => {
    return treasury.events
      .map(evt => ({
        ...evt,
        totalIncome: (evt.incomes || []).reduce((sum, income) => sum + parseAmount(income.amount), 0),
        totalExpenses: (evt.expenses || []).reduce((sum, expense) => sum + parseAmount(expense.amount), 0),
        net: (evt.incomes || []).reduce((sum, income) => sum + parseAmount(income.amount), 0) - (evt.expenses || []).reduce((sum, expense) => sum + parseAmount(expense.amount), 0),
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
  }, [treasury.events])

  const reportPeriodLabel = useMemo(() => {
    if (!range.start || !range.end) return 'All Time'
    
    const formatMonthYear = (dateString) => {
      const [year, month] = dateString.split('-');
      const date = new Date(year, month - 1);
      return { monthStr: date.toLocaleString('default', { month: 'long' }), year };
    };

    if (range.start === range.end) {
      const { monthStr, year } = formatMonthYear(range.start);
      return `${monthStr} ${year}`;
    }

    const startData = formatMonthYear(range.start);
    const endData = formatMonthYear(range.end);

    if (startData.year === endData.year) {
      return `${startData.monthStr} - ${endData.monthStr} ${startData.year}`;
    } else {
      return `${startData.monthStr} ${startData.year} - ${endData.monthStr} ${endData.year}`;
    }
  }, [range])

  const matchingDuesPayments = useMemo(() => {
    return treasury.dues.flatMap(due => (due.payments || []).filter(payment => isDateInRange(payment.date, range.start, range.end)).map(payment => ({ ...payment, memberName: due.memberName })))
  }, [treasury.dues, range])

  const matchingEvents = useMemo(() => {
    return filteredEvents.filter(evt => evt.date && isDateInRange(evt.date, range.start, range.end))
  }, [filteredEvents, range])

  const totalDuesIncome = useMemo(
    () => matchingDuesPayments.reduce((sum, payment) => sum + parseAmount(payment.amount), 0),
    [matchingDuesPayments]
  )

  const totalEventIncome = useMemo(
    () => matchingEvents.reduce((sum, evt) => sum + evt.totalIncome, 0),
    [matchingEvents]
  )

  const totalEventExpense = useMemo(
    () => matchingEvents.reduce((sum, evt) => sum + evt.totalExpenses, 0),
    [matchingEvents]
  )

  const totalIncome = totalDuesIncome + totalEventIncome
  const totalExpense = totalEventExpense
  const totalBalance = totalIncome - totalExpense

  // Auto-save treasury to Firebase on changes (but not during initialization)
  useEffect(() => {
    if (!isInitialized || !isDirtyRef.current) {
      console.log('Skipping auto-save: not initialized or not dirty')
      return
    }
    if (treasury.dues.length === 0 && treasury.events.length === 0) {
      console.log('Skipping auto-save: no dues or events')
      return
    }
    
    const runAutoSave = async () => {
      try {
        // Sanitize data to remove undefined values
        const sanitized = sanitizeTreasuryData(treasury)
        
        console.log('Auto-saving treasury:', {
          dues: sanitized.dues.length,
          duesSample: sanitized.dues[0],
          events: sanitized.events.length,
          eventsSample: sanitized.events[0],
        })
        
        await firebaseService.updateTreasury(sanitized)
        queryClient.setQueryData(['treasury'], sanitized) // Fix cache bug
        console.log('Auto-save successful!')
      } catch (error) {
        console.error('Auto-save failed:', error)
        setErrorMessage('Failed to save changes to database: ' + error.message)
      }
    }
    
    runAutoSave()
  }, [treasury, isInitialized, queryClient])

  const handleDueInput = (memberId, field, value) => {
    setDueInputs(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value,
      },
    }))
  }

  const handleUpdateDueAmount = (memberId) => {
    const dueAmount = parseAmount(dueInputs[memberId]?.dueAmount)
    if (dueAmount <= 0) {
      setErrorMessage('Please enter a valid due amount.')
      return
    }

    updateTreasury(prev => {
      const updatedDues = prev.dues.map(due => {
        if (due.memberId !== memberId) return due
        return {
          ...due,
          dueAmount,
        }
      })
      return { ...prev, dues: updatedDues }
    })

    setDueInputs(prev => ({
      ...prev,
      [memberId]: { dueAmount: '' },
    }))
    setErrorMessage('')
  }

  const handleAddPayment = (memberId) => {
    const payment = paymentInputs[memberId] || {}
    const amount = parseAmount(payment.amount)
    const date = payment.date || new Date().toISOString().slice(0, 10)

    if (amount <= 0) {
      setErrorMessage('Please enter a valid installment amount.')
      return
    }

    updateTreasury(prev => {
      const updatedDues = prev.dues.map(due => {
        if (due.memberId !== memberId) return due
        return {
          ...due,
          payments: [...(due.payments || []), { amount, date }],
        }
      })
      return { ...prev, dues: updatedDues }
    })

    setPaymentInputs(prev => ({
      ...prev,
      [memberId]: { amount: '', date },
    }))
    setErrorMessage('')
  }

  const handleNewEventChange = (field, value) => {
    setNewEvent(prev => ({ ...prev, [field]: value }))
  }

  const handleAddNewEvent = () => {
    if (!newEvent.name.trim() || !newEvent.date) {
      setErrorMessage('Event name and date are required.')
      return
    }

    const isExistingEvent = treasury.events.some(evt => evt.id === newEvent.id)

    if (isExistingEvent) {
      // Editing existing event
      updateTreasury(prev => ({
        ...prev,
        events: prev.events.map(evt => evt.id === newEvent.id ? { ...newEvent, incomes: newEvent.incomes || [], expenses: newEvent.expenses || [] } : evt),
      }))
    } else {
      // Adding new event
      updateTreasury(prev => ({
        ...prev,
        events: [...prev.events, { ...newEvent, incomes: newEvent.incomes || [], expenses: newEvent.expenses || [], locked: false }],
      }))
    }
    setNewEvent(createEmptyEvent())
    setShowEventModal(false)
    setErrorMessage('')
  }

  const handleEventUpdate = (eventId, field, value) => {
    updateTreasury(prev => ({
      ...prev,
      events: prev.events.map(evt => evt.id === eventId ? { ...evt, [field]: value } : evt),
    }))
  }

  const updateEventArrayItem = (eventId, collectionField, itemIndex, field, value) => {
    updateTreasury(prev => ({
      ...prev,
      events: prev.events.map(evt => {
        if (evt.id !== eventId) return evt
        const updatedItems = [...(evt[collectionField] || [])]
        updatedItems[itemIndex] = { ...updatedItems[itemIndex], [field]: value }
        return { ...evt, [collectionField]: updatedItems }
      }),
    }))
  }

  const addEventCollectionItem = (eventId, collectionField, factory) => {
    updateTreasury(prev => ({
      ...prev,
      events: prev.events.map(evt => {
        if (evt.id !== eventId) return evt
        return {
          ...evt,
          [collectionField]: [...(evt[collectionField] || []), factory()],
        }
      }),
    }))
  }

  const removeEventCollectionItem = (eventId, collectionField, itemIndex) => {
    updateTreasury(prev => ({
      ...prev,
      events: prev.events.map(evt => {
        if (evt.id !== eventId) return evt
        const updatedItems = [...(evt[collectionField] || [])]
        updatedItems.splice(itemIndex, 1)
        return { ...evt, [collectionField]: updatedItems }
      }),
    }))
  }

  const handleOpenClubDueModal = () => {
    // Load existing club due settings from first member (all members share same due)
    const firstMember = treasury.dues[0]
    if (firstMember && firstMember.dueAmount && firstMember.installmentAmounts) {
      setClubDueSettings({
        totalDue: firstMember.dueAmount,
        installments: firstMember.installmentsCount || firstMember.installmentAmounts.length,
        installmentAmounts: [...firstMember.installmentAmounts],
      })
    } else {
      setClubDueSettings({
        totalDue: null,
        installments: null,
        installmentAmounts: [],
      })
    }
    setShowClubDueModal(true)
  }

  const handleCloseClubDueModal = () => {
    setShowClubDueModal(false)
  }

  const handleOpenEventModal = () => {
    setNewEvent(createEmptyEvent())
    setShowEventModal(true)
  }

  const handleCloseEventModal = () => {
    setShowEventModal(false)
    setNewEvent(createEmptyEvent())
  }

  const handleClubDueChange = (field, value) => {
    setClubDueSettings(prev => {
      const updated = { ...prev, [field]: value }
      if (field === 'installments') {
        const count = Number(value) || 1
        const amounts = [...prev.installmentAmounts]
        while (amounts.length < count) amounts.push(0)
        while (amounts.length > count) amounts.pop()
        updated.installmentAmounts = amounts
      }
      return updated
    })
  }

  const handleInstallmentAmountChange = (index, value) => {
    setClubDueSettings(prev => {
      const installmentAmounts = [...prev.installmentAmounts]
      installmentAmounts[index] = parseAmount(value)
      return { ...prev, installmentAmounts }
    })
  }

  const handleMarkInstallmentPaid = (memberId, index) => {
    // Show date picker modal for marking paid
    setDatePickerData({ memberId, index, date: new Date().toISOString().slice(0, 10) })
    setShowInstallmentDatePicker(true)
  }

  const handleConfirmInstallmentDatePicker = () => {
    if (!datePickerData) return
    const { memberId, index, date } = datePickerData
    updateTreasury(prev => {
      const updatedDues = prev.dues.map(due => {
        if (due.memberId !== memberId) return due
        const installments = Array.isArray(due.installments)
          ? [...due.installments]
          : (due.installmentAmounts || []).map(amount => ({ amount, paid: false, date: '' }))
        const installment = installments[index] || { amount: due.installmentAmounts?.[index] || 0, paid: false, date: '' }
        if (installment.paid) return due
        installments[index] = { ...installment, paid: true, date }
        const payments = installments.filter(inst => inst.paid).map((inst, idx) => ({ amount: inst.amount, date: inst.date, installment: idx + 1 }))
        return { ...due, installments, payments }
      })
      return { ...prev, dues: updatedDues }
    })
    setShowInstallmentDatePicker(false)
    setDatePickerData(null)
  }

  const handleUnmarkInstallmentPaid = (memberId, index) => {
    // Only admin can uncheck
    if (currentUser?.role !== 'admin') {
      setErrorMessage('Only admins can mark installments as unpaid.')
      return
    }
    if (!window.confirm('Are you sure you want to unmark this due as paid?')) return

    updateTreasury(prev => {
      const updatedDues = prev.dues.map(due => {
        if (due.memberId !== memberId) return due
        const installments = Array.isArray(due.installments) ? [...due.installments] : []
        if (installments[index]) {
          installments[index] = { ...installments[index], paid: false, date: '' }
          const payments = installments.filter(inst => inst.paid).map((inst, idx) => ({ amount: inst.amount, date: inst.date, installment: idx + 1 }))
          return { ...due, installments, payments }
        }
        return due
      })
      return { ...prev, dues: updatedDues }
    })
  }

  const handleInstallmentDateChange = (memberId, index, date) => {
    updateTreasury(prev => {
      const updatedDues = prev.dues.map(due => {
        if (due.memberId !== memberId) return due
        const installments = [...(due.installments || [])]
        if (!installments[index]) {
          installments[index] = { amount: due.installmentAmounts?.[index] || 0, paid: false, date: '' }
        }
        installments[index] = { ...installments[index], date }
        const payments = installments.filter(inst => inst.paid).map((inst, idx) => ({ amount: inst.amount, date: inst.date, installment: idx + 1 }))
        return { ...due, installments, payments }
      })
      return { ...prev, dues: updatedDues }
    })
  }

  const handleSaveClubDue = () => {
    updateTreasury(prev => {
      const updatedDues = prev.dues.map(due => {
        const previousInstallments = Array.isArray(due.installments) ? due.installments : []
        const installments = clubDueSettings.installmentAmounts.map((amount, idx) => {
          const previous = previousInstallments[idx] || { paid: false, date: '' }
          return {
            amount,
            paid: Boolean(previous.paid),
            date: previous.paid ? previous.date : '',
          }
        })
        const payments = installments.filter(inst => inst.paid).map((inst, idx) => ({ amount: inst.amount, date: inst.date, installment: idx + 1 }))
        return {
          ...due,
          dueAmount: clubDueSettings.totalDue,
          installmentsCount: clubDueSettings.installments,
          installmentAmounts: [...clubDueSettings.installmentAmounts],
          installments,
          payments,
        }
      })
      return { ...prev, dues: updatedDues }
    })
    setShowClubDueModal(false)
  }

  const handleViewEventDetail = (event) => {
    setSelectedEvent(event)
    setShowEventDetailModal(true)
  }

  const handleEditEvent = (event) => {
    setNewEvent(event)
    setShowEventModal(true)
  }

  const handleCloseEventDetailModal = () => {
    setShowEventDetailModal(false)
    setSelectedEvent(null)
  }

  const handleToggleLock = (eventId) => {
    updateTreasury(prev => ({
      ...prev,
      events: prev.events.map(evt => evt.id === eventId ? { ...evt, locked: !evt.locked } : evt),
    }))
  }

  const handleDeleteEvent = (eventId) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return
    updateTreasury(prev => ({
      ...prev,
      events: prev.events.filter(evt => evt.id !== eventId),
    }))
  }

  const handleSaveTreasury = async () => {
    setIsSaving(true)
    try {
      await firebaseService.updateTreasury(sanitizeTreasuryData(treasury))
      await refetch()
      setErrorMessage('')
    } catch (error) {
      console.error(error)
      setErrorMessage('Save failed. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getReportData = () => ({
    period: reportPeriodLabel,
    dues: filteredDues,
    matchingDuesPayments,
    matchingEvents,
    totalDuesIncome,
    totalEventIncome,
    totalEventExpense,
    totalIncome,
    totalExpense,
    totalBalance,
    clubName: config.clubName || 'ROTARACT CLUB OF COIMBATORE UNIQUE',
    parentClub: config.sponsorClub
      ? `SPONSORED BY : ${config.sponsorClub.toUpperCase()}`
      : 'SPONSORED BY : ROTARY CLUB OF THONDAMUTHUR',
    clubId: config.clubId ? `CLUB ID : ${config.clubId}` : 'CLUB ID : 50295',
    group: config.group ? `GROUP ${config.group}` : 'GROUP 1',
    rid: config.district ? `RI DISTRICT ${config.district}` : 'RI DISTRICT 3206',
    presidentName: config.presidentName || '',
    secretaryName: config.secretaryName || '',
    logos: [
      config.rotaryLogo || null,
      config.districtLogo || null,
      config.clubLogo || null,
    ],
  })

  const handleDownloadPDF = () => {
    generateTreasuryPDF(getReportData())
  }

  const handlePreviewPDF = async () => {
    const blobUrl = await generateTreasuryPDF(getReportData(), 'bloburl')
    setPreviewUrl(blobUrl)
    setShowPreviewModal(true)
  }

  if (usersLoading || treasuryLoading) {
    return <div className="treasury-loading">Loading treasury data...</div>
  }

  if (usersError || treasuryError) {
    return (
      <div className="treasury-loading">
        <p>Failed to load treasury data.</p>
        <p style={{ color: 'red' }}>{String(usersError?.message || treasuryError?.message || 'Unknown error')}</p>
        <button className="btn-secondary" onClick={() => refetch()}>Retry</button>
      </div>
    )
  }

  return (
    <div className="treasury-shell">
      <div className="treasury-header">
        {/* Brand section: logos + club info - hidden in admin context */}
        {!hideBrand && (
          <div className="treasury-brand">
            <div className="treasury-logos">
              {config.rotaryLogo && (
                <img src={config.rotaryLogo} alt="Rotary Logo" className="treasury-logo" />
              )}
              {config.districtLogo && (
                <img src={config.districtLogo} alt="District Logo" className="treasury-logo" />
              )}
              {config.clubLogo && (
                <img src={config.clubLogo} alt="Club Logo" className="treasury-logo" />
              )}
            </div>
            <div className="treasury-title">
              <h3>{config.clubName || 'Rotaract Club of Coimbatore Unique'}</h3>
              <p className="treasury-tagline">
                {config.sponsorClub
                  ? `Parented by ${config.sponsorClub}`
                  : 'Parented by Rotary Club of Thondamuthur'}
                {config.clubId && ` · Club ID: ${config.clubId}`}
                {config.group && ` · Group ${config.group}`}
                {config.district && ` · RI District ${config.district}`}
              </p>
            </div>
          </div>
        )}
        <div className="treasury-actions">
          <button className="btn-secondary" onClick={() => refetch()}><RefreshCcw size={16} /> Refresh</button>
          <button className="btn-primary" onClick={handlePreviewPDF}><Eye size={16} /> Preview PDF</button>
          <button className="btn-primary outline" onClick={handleDownloadPDF}><Download size={16} /> Download as PDF</button>
        </div>
      </div>

      {errorMessage && <div className="treasury-error">{errorMessage}</div>}

      <section className="treasury-section treasury-summary-panel">
        <div className="section-head">
          <h4>Report Period</h4>
          <div className="period-inputs">
            <label>
              From
              <input type="month" value={range.start} onChange={e => setRange(prev => ({ ...prev, start: e.target.value }))} />
            </label>
            <label>
              To
              <input type="month" value={range.end} onChange={e => setRange(prev => ({ ...prev, end: e.target.value }))} />
            </label>
          </div>
        </div>

        <div className="summary-grid">
          <div className="summary-card">
            <span>Total Income</span>
            <strong>{formatCurrency(totalIncome)}</strong>
          </div>
          <div className="summary-card">
            <span>Total Expenses</span>
            <strong>{formatCurrency(totalExpense)}</strong>
          </div>
          <div className="summary-card">
            <span>Net Balance</span>
            <strong>{formatCurrency(totalBalance)}</strong>
          </div>
          <div className="summary-card">
            <span>Period</span>
            <strong>{reportPeriodLabel}</strong>
          </div>
        </div>
      </section>

      <div className="treasury-tabs">
        {treasury.dues[0]?.dueAmount && (
          <button 
            className={`tab-button ${currentTab === 'dues' ? 'active' : ''}`}
            onClick={() => setCurrentTab('dues')}
          >
            Club Dues
          </button>
        )}
        <button 
          className={`tab-button ${currentTab === 'events' ? 'active' : ''}`} 
          onClick={() => setCurrentTab('events')}
        >
          Events
        </button>
      </div>

      {currentTab === 'dues' && (
        <section className="treasury-section treasury-due-panel">
          <div className="section-head">
            <h4>Club Dues</h4>
            <p>Club dues are common for all members. Use Set Due to define installments and track who has paid.</p>
            {currentUser?.role === 'admin' && (
              <button className="btn-primary" onClick={handleOpenClubDueModal}>Set Due</button>
            )}
          </div>

          <div className="club-due-summary">
            <div className="summary-card">
              <span>Total Club Due</span>
              <strong>{formatCurrency(treasury.dues[0]?.dueAmount || 0)}</strong>
            </div>
            <div className="summary-card">
              <span>Installments</span>
              <strong>{treasury.dues[0]?.installmentsCount || 0}</strong>
            </div>
            <div className="summary-card">
              <span>Total Due Collected</span>
              <strong>{formatCurrency(totalDueCollected)}</strong>
            </div>
          </div>

          <div className="dues-table">
            <div className="dues-table-header">
              <span>Member</span>
              <span>Total Due</span>
              <span>Paid</span>
              <span>Balance</span>
              <span>Installments</span>
            </div>
            {filteredDues.map(due => {
              const totalDue = due.dueAmount || 2000
              const installments = due.installmentDetails || []
              const paidInstallments = installments.filter(inst => inst.paid).length

              return (
                <div key={due.memberId} className="dues-row">
                  <div>
                    <strong>{due.memberName}</strong>
                    <small>{due.email || 'No email provided'}</small>
                  </div>
                  <div>{formatCurrency(totalDue)}</div>
                  <div>{formatCurrency(due.totalPaid)}</div>
                  <div>{formatCurrency(due.remaining)}</div>
                  <div>
                    <div className="installment-checkbox-group">
                      {installments.map((inst, index) => (
                        <div key={index} className="installment-checkbox-container">
                          <label 
                            className={`simple-checkbox-label ${inst.paid && currentUser?.role !== 'admin' ? 'disabled' : ''}`}
                            title={inst.paid ? (currentUser?.role === 'admin' ? "Click to unmark as paid" : "Paid") : "Click to mark as paid"}
                          >
                            <input
                              type="checkbox"
                              checked={inst.paid}
                              onChange={() => {}}
                              onClick={(e) => {
                                e.preventDefault()
                                if (inst.paid) {
                                  handleUnmarkInstallmentPaid(due.memberId, index)
                                } else {
                                  handleMarkInstallmentPaid(due.memberId, index)
                                }
                              }}
                              disabled={inst.paid && currentUser?.role !== 'admin'}
                            />
                            <span>{index + 1}</span>
                          </label>
                          {inst.paid && inst.date && (
                            <span className="payment-date-tooltip">Paid on: {inst.date}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {currentTab === 'events' && (
        <section className="treasury-section treasury-event-panel">
          <div className="section-head">
            <h4>Event Finance</h4>
            <p>Create events, track income and expense items, and lock finalized event finances.</p>
            <button className="btn-primary" onClick={handleOpenEventModal}><Plus size={16} /> Add Event</button>
          </div>

          <div className="event-list">
            {filteredEvents.length === 0 ? (
              <div className="empty-state">No events created yet. Click "Add Event" to get started.</div>
            ) : (
              <div className="event-table">
                <div className="event-table-header">
                  <span>Event Name</span>
                  <span>Date</span>
                  <span>Income</span>
                  <span>Expense</span>
                  <span>Actions</span>
                </div>
                {filteredEvents.map(evt => (
                  <div key={evt.id} className="event-row">
                    <span>{evt.name || 'Untitled Event'}</span>
                    <span>{evt.date || 'Date not set'}</span>
                    <span>{formatCurrency(evt.totalIncome)}</span>
                    <span>{formatCurrency(evt.totalExpenses)}</span>
                    <div className="event-actions">
                      <button className="btn-icon" onClick={() => handleViewEventDetail(evt)} title="View Details"><Eye size={16} /></button>
                      {!evt.locked && (
                        <button className="btn-icon" onClick={() => handleEditEvent(evt)} title="Edit Event"><Edit size={16} /></button>
                      )}
                      <button className="btn-icon" onClick={() => handleToggleLock(evt.id)} title={evt.locked ? 'Unlock' : 'Lock'}>
                        {evt.locked ? <Unlock size={14} /> : <Lock size={14} />}
                      </button>
                      <button className="btn-icon danger" onClick={() => handleDeleteEvent(evt.id)} title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {showEventModal && (
        <div className="modal-overlay" onClick={handleCloseEventModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4>{newEvent.id ? 'Edit Event' : 'Add New Event'}</h4>
              <button className="btn-icon" onClick={handleCloseEventModal}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="event-form-row">
                <label>
                  Event Name
                  <input
                    type="text"
                    value={newEvent.name}
                    onChange={e => handleNewEventChange('name', e.target.value)}
                    placeholder="Example: Annual Charity Run"
                  />
                </label>
                <label>
                  Event Date
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={e => handleNewEventChange('date', e.target.value)}
                  />
                </label>
              </div>

              <div className="event-subsection">
                <div className="subsection-head">
                  <h5>Income</h5>
                  <button type="button" className="btn-small" onClick={() => setNewEvent(prev => ({
                    ...prev,
                    incomes: [...(prev.incomes || []), { id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name: '', amount: '' }]
                  }))}>+ Add Income</button>
                </div>
                {(newEvent.incomes || []).map((income, index) => (
                  <div key={income.id || index} className="collection-row">
                    <input
                      type="text"
                      placeholder="Income source"
                      value={income.name}
                      onChange={e => {
                        setNewEvent(prev => {
                          const incomes = [...(prev.incomes || [])]
                          incomes[index] = { ...income, name: e.target.value }
                          return { ...prev, incomes }
                        })
                      }}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Amount"
                      value={income.amount}
                      onChange={e => {
                        setNewEvent(prev => {
                          const incomes = [...(prev.incomes || [])]
                          incomes[index] = { ...income, amount: e.target.value }
                          return { ...prev, incomes }
                        })
                      }}
                    />
                    <button className="btn-icon" type="button" onClick={() => setNewEvent(prev => {
                      const incomes = [...(prev.incomes || [])]
                      incomes.splice(index, 1)
                      return { ...prev, incomes }
                    })}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>

              <div className="event-subsection">
                <div className="subsection-head">
                  <h5>Expenses</h5>
                  <button type="button" className="btn-small" onClick={() => setNewEvent(prev => ({
                    ...prev,
                    expenses: [...(prev.expenses || []), { id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name: '', amount: '' }],
                  }))}>+ Add Expense</button>
                </div>
                {(newEvent.expenses || []).map((expense, index) => (
                  <div key={expense.id || index} className="collection-row">
                    <input
                      type="text"
                      placeholder="Expense item"
                      value={expense.name}
                      onChange={e => {
                        setNewEvent(prev => {
                          const expenses = [...(prev.expenses || [])]
                          expenses[index] = { ...expense, name: e.target.value }
                          return { ...prev, expenses }
                        })
                      }}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Amount"
                      value={expense.amount}
                      onChange={e => {
                        setNewEvent(prev => {
                          const expenses = [...(prev.expenses || [])]
                          expenses[index] = { ...expense, amount: e.target.value }
                          return { ...prev, expenses }
                        })
                      }}
                    />
                    <button className="btn-icon" type="button" onClick={() => setNewEvent(prev => {
                      const expenses = [...(prev.expenses || [])]
                      expenses.splice(index, 1)
                      return { ...prev, expenses }
                    })}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseEventModal}>Cancel</button>
              <button className="btn-primary" onClick={handleAddNewEvent}>Save Event</button>
            </div>
          </div>
        </div>
      )}

      {showClubDueModal && (
        <div className="modal-overlay" onClick={handleCloseClubDueModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Set Club Due</h4>
              <button className="btn-icon" onClick={handleCloseClubDueModal}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="club-due-form">
                <div className="form-row">
                  <div className="form-input-group">
                    <label htmlFor="totalDue">Total Club Due Amount</label>
                    <input
                      id="totalDue"
                      type="number"
                      value={clubDueSettings.totalDue ?? ''}
                      onChange={e => handleClubDueChange('totalDue', e.target.value ? parseFloat(e.target.value) : null)}
                      min="0"
                      step="100"
                      placeholder="e.g., 2000"
                    />
                  </div>
                  <div className="form-input-group">
                    <label htmlFor="installments">Number of Installments</label>
                    <input
                      id="installments"
                      type="number"
                      value={clubDueSettings.installments ?? ''}
                      onChange={e => handleClubDueChange('installments', e.target.value ? parseInt(e.target.value) : null)}
                      min="1"
                      max="12"
                      placeholder="e.g., 3"
                    />
                  </div>
                </div>
                {clubDueSettings.installmentAmounts.length > 0 && (
                  <div className="installments-list">
                    <h5>Installment amounts</h5>
                    <p className="instructional-text">Update individual amounts if needed (they currently sum to your total):</p>
                    {clubDueSettings.installmentAmounts.map((amount, index) => (
                      <div key={index} className="installment-item">
                        <label htmlFor={`installment-${index}`}>
                          Installment {index + 1}
                          <input
                            id={`installment-${index}`}
                            type="number"
                            value={amount}
                            onChange={e => handleInstallmentAmountChange(index, e.target.value)}
                            min="0"
                            step="50"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseClubDueModal}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveClubDue}>Save Club Due</button>
            </div>
          </div>
        </div>
      )}

      {showEventDetailModal && selectedEvent && (
        <div className="modal-overlay" onClick={handleCloseEventDetailModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Event Details: {selectedEvent.name}</h4>
              <button className="btn-icon" onClick={handleCloseEventDetailModal}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="event-detail-summary">
                <div className="detail-row">
                  <span>Event Name:</span>
                  <strong>{selectedEvent.name}</strong>
                </div>
                <div className="detail-row">
                  <span>Date:</span>
                  <strong>{selectedEvent.date}</strong>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <strong>{selectedEvent.locked ? 'Locked' : 'Unlocked'}</strong>
                </div>
              </div>

              <div className="event-detail-section">
                <h5>Income Sources</h5>
                {selectedEvent.incomes && selectedEvent.incomes.length > 0 ? (
                  <div className="detail-list">
                    {selectedEvent.incomes.map((income, index) => (
                      <div key={index} className="detail-item">
                        <span>{income.name}</span>
                        <strong>{formatCurrency(income.amount)}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">No income sources recorded.</p>
                )}
                <div className="detail-total">
                  <span>Total Income:</span>
                  <strong>{formatCurrency(selectedEvent.totalIncome)}</strong>
                </div>
              </div>

              <div className="event-detail-section">
                <h5>Expenses</h5>
                {selectedEvent.expenses && selectedEvent.expenses.length > 0 ? (
                  <div className="detail-list">
                    {selectedEvent.expenses.map((expense, index) => (
                      <div key={index} className="detail-item">
                        <span>{expense.name}</span>
                        <strong>{formatCurrency(expense.amount)}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">No expenses recorded.</p>
                )}
                <div className="detail-total">
                  <span>Total Expenses:</span>
                  <strong>{formatCurrency(selectedEvent.totalExpenses)}</strong>
                </div>
              </div>

              <div className="event-detail-summary">
                <div className="detail-row">
                  <span>Net Result:</span>
                  <strong className={selectedEvent.net >= 0 ? 'positive' : 'negative'}>
                    {formatCurrency(selectedEvent.net)}
                  </strong>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseEventDetailModal}>Close</button>
      {!selectedEvent.locked && (
                <button className="btn-primary" onClick={() => { handleCloseEventDetailModal(); handleEditEvent(selectedEvent); }}>
                  <Edit size={16} /> Edit Event
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showInstallmentDatePicker && datePickerData && (
        <div className="modal-overlay" onClick={() => setShowInstallmentDatePicker(false)}>
          <div className="modal-content date-picker-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Mark Payment Date</h4>
              <button className="btn-icon" onClick={() => setShowInstallmentDatePicker(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <p className="date-picker-label">Select the date when this installment was paid:</p>
              <input
                type="date"
                className="date-picker-input"
                value={datePickerData.date}
                onChange={e => setDatePickerData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowInstallmentDatePicker(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleConfirmInstallmentDatePicker}>Confirm Payment</button>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && previewUrl && (
        <div className="modal-overlay" onClick={() => setShowPreviewModal(false)} style={{ zIndex: 1000 }}>
          <div className="modal-content preview-modal" style={{ width: '90%', height: '90vh', maxWidth: '1000px', display: 'flex', flexDirection: 'column', padding: 0 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #eee' }}>
              <h4>Treasury Report Preview</h4>
              <button className="btn-icon" onClick={() => setShowPreviewModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
              <iframe src={previewUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="PDF Preview" />
            </div>
            <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn-secondary" onClick={() => setShowPreviewModal(false)}>Close Preview</button>
              <button className="btn-primary outline" onClick={() => { handleDownloadPDF(); setShowPreviewModal(false); }}><Download size={16} /> Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TreasuryReportManager
