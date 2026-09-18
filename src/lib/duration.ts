// offblock/onblock are "HH:MM" clock times. If onblock is earlier than
// offblock, the flight crossed midnight, so it wraps to the next day.
export function getDurationMins(offblock: string, onblock: string): number {
  const [offH, offM] = offblock.split(":").map(Number);
  const [onH, onM] = onblock.split(":").map(Number);

  const offTotal = offH * 60 + offM;
  let onTotal = onH * 60 + onM;
  if (onTotal < offTotal) onTotal += 24 * 60;

  return onTotal - offTotal;
}
