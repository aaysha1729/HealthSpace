/**
 * Calculate predicted period window and days
 * @param {Date} lastPeriodStartDate - Last recorded period start date
 * @param {number} averageCycleLength - Average cycle length in days
 * @param {number} averagePeriodLength - Average period duration in days
 * @returns {Object} { predictedDays: Date[], windowDays: Date[] }
 */
export const getPredictedPeriodWindow = (lastPeriodStartDate, averageCycleLength, averagePeriodLength) => {
  if (!lastPeriodStartDate) {
    return { predictedDays: [], windowDays: [] };
  }

  const predictedDays = [];
  const windowDays = [];

  // Calculate predicted period start: lastPeriodStart + averageCycleLength
  const predictedPeriodStart = new Date(lastPeriodStartDate);
  predictedPeriodStart.setDate(predictedPeriodStart.getDate() + averageCycleLength);

  // Add predicted period days (exact period dates)
  for (let i = 0; i < averagePeriodLength; i++) {
    const day = new Date(predictedPeriodStart);
    day.setDate(day.getDate() + i);
    predictedDays.push(day);
  }

  // Calculate window: predictedStart - 2 to predictedStart + 2 days
  const windowStart = new Date(predictedPeriodStart);
  windowStart.setDate(windowStart.getDate() - 2);

  const windowEnd = new Date(predictedPeriodStart);
  windowEnd.setDate(windowEnd.getDate() + 2);

  for (let i = -2; i <= 2; i++) {
    const day = new Date(predictedPeriodStart);
    day.setDate(day.getDate() + i);
    windowDays.push(day);
  }

  return { predictedDays, windowDays };
};

/**
 * Calculate fertile window days
 * @param {Date} cycleStart - Start of cycle (period start)
 * @param {number} cycleLength - Total cycle length in days
 * @returns {Date[]} Array of fertile window dates
 */
export const getFertileWindowDays = (cycleStart, cycleLength) => {
  if (!cycleStart) {
    return [];
  }

  const fertileDays = [];
  // Ovulation typically occurs at day (cycleLength - 14)
  // Fertile window is typically 5 days before to 1 day after ovulation
  const ovulationDay = cycleLength - 14;
  const fertileStart = ovulationDay - 5;
  const fertileEnd = ovulationDay + 1;

  for (let day = fertileStart; day <= fertileEnd; day++) {
    const fertileDate = new Date(cycleStart);
    fertileDate.setDate(fertileDate.getDate() + day);
    fertileDays.push(fertileDate);
  }

  return fertileDays;
};
