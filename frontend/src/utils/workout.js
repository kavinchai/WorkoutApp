export function groupByExercise(exerciseSets) {
  const map = {};
  for (const s of (exerciseSets ?? [])) {
    const isCardio = s.exerciseType === 'cardio';
    const key = isCardio ? `${s.exerciseName}__cardio` : `${s.exerciseName}__${s.weightLbs}`;
    if (!map[key]) {
      map[key] = {
        name: s.exerciseName,
        exerciseType: s.exerciseType ?? 'lifting',
        weight: isCardio ? null : parseFloat(s.weightLbs),
        durationSeconds: isCardio ? s.durationSeconds : null,
        sets: [],
      };
    }
    map[key].sets.push(s);
  }
  return Object.values(map)
    .sort((a, b) => a.name.localeCompare(b.name) || (b.weight ?? 0) - (a.weight ?? 0))
    .map(g => ({ ...g, sets: g.sets.sort((a, b) => a.setNumber - b.setNumber) }));
}

export function formatDuration(totalSeconds) {
  if (!totalSeconds && totalSeconds !== 0) return '--';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m${s > 0 ? ` ${s}s` : ''}`;
  if (m > 0) return `${m}m${s > 0 ? ` ${s}s` : ''}`;
  return `${s}s`;
}
