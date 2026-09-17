export function dayKey(date = new Date()) { return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`; }
export function shouldWelcome(enabled, lastDay, date = new Date()) { return enabled && lastDay !== dayKey(date); }
export function smoothstep(t) { const x=Math.max(0,Math.min(1,t)); return x*x*(3-2*x); }
