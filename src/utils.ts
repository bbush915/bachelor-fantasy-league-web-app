export function getOrdinal(i: number): string {
  const mod10 = i % 10;
  const mod100 = i % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${i}st`;
  } else if (mod10 === 2 && mod100 !== 12) {
    return `${i}nd`;
  } else if (mod10 === 3 && mod100 !== 13) {
    return `${i}rd`;
  }

  return `${i}th`;
}
