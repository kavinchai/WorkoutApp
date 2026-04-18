import { useState } from 'react';
import api from '../api';
import Modal from './Modal';
import { formatDuration } from '../utils/workout';
import './WorkoutBuilderModal.css';

function secondsToHMS(total) {
  return {
    hours:   Math.floor((total ?? 0) / 3600),
    minutes: Math.floor(((total ?? 0) % 3600) / 60),
    seconds: (total ?? 0) % 60,
  };
}

/** exerciseSets: all SetDTO rows for one exercise name in a session */
export default function EditExerciseModal({ sessionId, exerciseName, exerciseSets, onClose, onSaved }) {
  const isCardio = exerciseSets[0]?.exerciseType === 'cardio';

  const initialSets = exerciseSets.map(s => ({
    setNumber:  s.setNumber,
    reps:       String(s.reps),
    weightLbs:  String(s.weightLbs),
  }));

  const initialDuration = isCardio
    ? secondsToHMS(exerciseSets[0]?.durationSeconds)
    : { hours: '', minutes: '', seconds: '' };

  const [sets, setSets]         = useState(initialSets);
  const [duration, setDuration] = useState(initialDuration);
  const [err, setErr]           = useState('');
  const [saving, setSaving]     = useState(false);

  function addSet() {
    setSets(prev => [
      ...prev,
      { setNumber: prev.length + 1, reps: '', weightLbs: '' },
    ]);
  }

  function removeSet(setIndex) {
    setSets(prev =>
      prev
        .filter((_, i) => i !== setIndex)
        .map((s, i) => ({ ...s, setNumber: i + 1 }))
    );
  }

  function updateSet(setIndex, field, val) {
    setSets(prev => prev.map((s, i) =>
      i === setIndex ? { ...s, [field]: val } : s
    ));
  }

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setSaving(true);
    try {
      const payload = isCardio
        ? {
            exerciseName,
            exerciseType: 'cardio',
            durationSeconds:
              (parseInt(duration.hours)   || 0) * 3600 +
              (parseInt(duration.minutes) || 0) * 60  +
              (parseInt(duration.seconds) || 0),
          }
        : {
            exerciseName,
            exerciseType: 'lifting',
            sets: sets.map(s => ({
              setNumber:  s.setNumber,
              reps:       parseInt(s.reps)        || 0,
              weightLbs:  parseFloat(s.weightLbs) || 0,
            })),
          };
      await api.post('/workouts/' + sessionId + '/exercises', payload);
      onSaved();
      onClose();
    } catch (ex) {
      setErr(ex.response?.data?.message ?? 'Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteExercise() {
    setSaving(true);
    try {
      await api.delete('/workouts/' + sessionId + '/exercises', {
        params: { name: exerciseName },
      });
      onSaved();
      onClose();
    } catch (ex) {
      setErr(ex.response?.data?.message ?? 'Failed to delete.');
      setSaving(false);
    }
  }

  return (
    <Modal title={'Edit: ' + exerciseName} onClose={onClose}>
      <form className="wbm-form" onSubmit={submit}>
        {err && <div className="modal-error">{err}</div>}

        {isCardio ? (
          <div className="wbm-duration-row">
            <label className="wbm-duration-label">Duration</label>
            <div className="wbm-duration-inputs">
              <input className="modal-input wbm-duration-input" type="number"
                min="0" placeholder="0" value={duration.hours}
                onChange={e => setDuration(d => ({ ...d, hours: e.target.value }))} />
              <span className="wbm-duration-unit">h</span>
              <input className="modal-input wbm-duration-input" type="number"
                min="0" max="59" placeholder="0" value={duration.minutes}
                onChange={e => setDuration(d => ({ ...d, minutes: e.target.value }))} />
              <span className="wbm-duration-unit">m</span>
              <input className="modal-input wbm-duration-input" type="number"
                min="0" max="59" placeholder="0" value={duration.seconds}
                onChange={e => setDuration(d => ({ ...d, seconds: e.target.value }))} />
              <span className="wbm-duration-unit">s</span>
            </div>
          </div>
        ) : (
          <>
            <div className="wbm-sets">
              <div className="wbm-sets-head">
                <span>Set</span><span>Weight (lbs)</span><span>Reps</span><span></span>
              </div>
              {sets.map((s, setIndex) => (
                <div key={setIndex} className="wbm-set-row">
                  <span className="wbm-set-num">{s.setNumber}</span>
                  <input
                    className="modal-input wbm-set-input"
                    type="number" step="0.5" min="0"
                    value={s.weightLbs}
                    onChange={e => updateSet(setIndex, 'weightLbs', e.target.value)}
                  />
                  <input
                    className="modal-input wbm-set-input"
                    type="number" min="0"
                    value={s.reps}
                    onChange={e => updateSet(setIndex, 'reps', e.target.value)}
                  />
                  <button type="button" className="btn btn-sm"
                    onClick={() => removeSet(setIndex)}>[x]</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-sm wbm-add-set" onClick={addSet}>
              [+ set]
            </button>
          </>
        )}

        <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="btn btn-sm" onClick={deleteExercise}
            disabled={saving} style={{ color: 'var(--muted)' }}>
            [delete exercise]
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
