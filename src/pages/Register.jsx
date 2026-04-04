import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchEvents, submitRegistration } from '../services/firebase'
import styles from './Register.module.css'

const SEMESTERS = ['2', '4', '6', '8', 'MBA']
const BRANCHES = ['CSE', 'ISE', 'AIML', 'ECE', 'MECH', 'CIVIL', 'MBA']

function SoloInfo() {
  return (
    <motion.div
      className={styles.infoBox}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      ✦ Solo event — only your details are needed.
    </motion.div>
  )
}

function DoublesSection({ name, onNameChange, sem, onSemChange, branch, onBranchChange, errors }) {
  return (
    <motion.div
      className={styles.dynamicSection}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.sectionTag}>PARTNER DETAILS</div>

      <div className="form-group">
        <label className="form-label">Partner Name</label>
        <input
          className="form-input"
          type="text"
          placeholder="Your partner's full name"
          value={name}
          onChange={e => onNameChange(e.target.value)}
        />
        {errors.partnerName && <div className="error-text">{errors.partnerName}</div>}
      </div>

      <div className={styles.twoCol}>
        <div className="form-group">
          <label className="form-label">Partner Semester</label>
          <select
            className="form-select"
            value={sem}
            onChange={e => onSemChange(e.target.value)}
          >
            <option value="">Select</option>
            {SEMESTERS.map(s => <option key={s}>{s}</option>)}
          </select>
          {errors.partnerSem && <div className="error-text">{errors.partnerSem}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Partner Branch</label>
          <select
            className="form-select"
            value={branch}
            onChange={e => onBranchChange(e.target.value)}
          >
            <option value="">Select</option>
            {BRANCHES.map(b => <option key={b}>{b}</option>)}
          </select>
          {errors.partnerBranch && <div className="error-text">{errors.partnerBranch}</div>}
        </div>
      </div>
    </motion.div>
  )
}

function TeamSection({ members, onAdd, onRemove, onMemberChange, teamName, onTeamNameChange }) {
  return (
    <motion.div
      className={styles.dynamicSection}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.sectionTag}> </div>

      <div className="form-group">
        <label className="form-label">Team Name</label>
        <input
          className="form-input"
          type="text"
          placeholder="Your team name"
          value={teamName}
          onChange={e => onTeamNameChange(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Team Members</label>

        <AnimatePresence>
          {members.map((m, i) => (
            <motion.div
              key={m.id}
              className={styles.memberRow}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <input
                className={`form-input ${styles.memberInput}`}
                type="text"
                placeholder={`Member ${i + 1} name`}
                value={m.name}
                onChange={e => onMemberChange(m.id, e.target.value)}
              />
              <button
                className={styles.removeBtn}
                onClick={() => onRemove(m.id)}
                disabled={members.length === 1}
                title="Remove member"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <button className={styles.addMemberBtn} onClick={onAdd}>
          + Add Member
        </button>
      </div>
    </motion.div>
  )
}

let memberIdCounter = 1

export default function Register() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [selectedId, setSelectedId] = useState(searchParams.get('event') || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  // Main participant fields
  const [name, setName] = useState('')
  const [sem, setSem] = useState('')
  const [branch, setBranch] = useState('')
  const [contact, setContact] = useState('')

  // Team/Doubles state
  const [teamName, setTeamName] = useState('')
  const [members, setMembers] = useState([{ id: memberIdCounter++, name: '' }])
  const [partnerName, setPartnerName] = useState('')
  const [partnerSem, setPartnerSem] = useState('')
  const [partnerBranch, setPartnerBranch] = useState('')

  useEffect(() => {
    fetchEvents()
      .then(data => setEvents(data ?? []))
      .catch(console.error)
  }, [])

  const selectedEvent = events.find(e => e.id === selectedId)
  const category = selectedEvent?.category ?? null

  function addMember() {
    setMembers(prev => [...prev, { id: memberIdCounter++, name: '' }])
  }

  function removeMember(id) {
    setMembers(prev => prev.length > 1 ? prev.filter(m => m.id !== id) : prev)
  }

  function updateMember(id, name) {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, name } : m))
  }

  function validate() {
    const errs = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!sem) errs.sem = 'Semester is required'
    if (!branch) errs.branch = 'Branch is required'
    if (!contact.trim()) errs.contact = 'Contact is required'
    if (!selectedId) errs.event = 'Please select an event'
    if (category === 'team' && !teamName.trim()) errs.teamName = 'Team name is required'
    if (category === 'doubles') {
      if (!partnerName.trim()) errs.partnerName = 'Partner name is required'
      if (!partnerSem) errs.partnerSem = 'Partner semester is required'
      if (!partnerBranch) errs.partnerBranch = 'Partner branch is required'
    }
    return errs
  }

  async function handleSubmit() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    const payload = {
      name: name.trim(),
      semester: sem,
      branch,
      contact: contact.trim(),
      event_id: selectedId,
      team_name: category === 'team' ? teamName.trim() : null,
      team_members: category === 'solo'
        ? null
        : category === 'doubles'
          ? [{ name: partnerName.trim(), semester: partnerSem, branch: partnerBranch }]
          : members.map(m => ({ name: m.name })),
    }

    try {
      await submitRegistration(payload)
      setSuccess(true)
      // Reset form
      setName(''); setSem(''); setBranch(''); setContact('')
      setSelectedId(''); setTeamName('')
      setPartnerName(''); setPartnerSem(''); setPartnerBranch('')
      setMembers([{ id: memberIdCounter++, name: '' }])
    } catch (err) {
      console.error(err)
      alert('Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className="section-tag"></div>
          <div className={styles.title}>SIGN UP</div>
          <p className={styles.sub}>
            Fill in your details to register. The form adapts based on the event type.
          </p>
        </div>

        <motion.div
          className={styles.formCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          {/* Semester + Branch */}
          <div className={styles.twoCol}>
            <div className="form-group">
              <label className="form-label">Semester</label>
              <select className="form-select" value={sem} onChange={e => setSem(e.target.value)}>
                <option value="">Select</option>
                {SEMESTERS.map(s => <option key={s}>{s}</option>)}
              </select>
              {errors.sem && <div className="error-text">{errors.sem}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Branch</label>
              <select className="form-select" value={branch} onChange={e => setBranch(e.target.value)}>
                <option value="">Select</option>
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
              {errors.branch && <div className="error-text">{errors.branch}</div>}
            </div>
          </div>

          {/* Contact */}
          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <input
              className="form-input"
              type="tel"
              placeholder="+91 XXXXXXXXXX"
              value={contact}
              onChange={e => setContact(e.target.value)}
            />
            {errors.contact && <div className="error-text">{errors.contact}</div>}
          </div>

          {/* Event selector */}
          <div className="form-group">
            <label className="form-label">Select Event</label>
            <select
              className="form-select"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
            >
              <option value="">Choose an event</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} ({ev.category})
                </option>
              ))}
            </select>
            {errors.event && <div className="error-text">{errors.event}</div>}
          </div>

          <hr className={styles.divider} />

          {/* Dynamic section */}
          <AnimatePresence mode="wait">
            {category === 'solo' && <SoloInfo key="solo" />}
            {category === 'doubles' && (
              <DoublesSection
                key="doubles"
                name={partnerName}
                onNameChange={setPartnerName}
                sem={partnerSem}
                onSemChange={setPartnerSem}
                branch={partnerBranch}
                onBranchChange={setPartnerBranch}
                errors={errors}
              />
            )}
            {category === 'team' && (
              <TeamSection
                key="team"
                members={members}
                onAdd={addMember}
                onRemove={removeMember}
                onMemberChange={updateMember}
                teamName={teamName}
                onTeamNameChange={setTeamName}
              />
            )}
          </AnimatePresence>

          {errors.teamName && <div className="error-text" style={{ marginTop: '-1rem', marginBottom: '1rem' }}>{errors.teamName}</div>}

          {/* Submit */}
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting…' : 'Submit Registration'}
          </button>

          {/* Success banner */}
          <AnimatePresence>
            {success && (
              <motion.div
                className={styles.successBanner}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ✓ Registration submitted! We'll reach out via your contact number.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
