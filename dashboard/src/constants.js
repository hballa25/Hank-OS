export const DOMAIN_COLORS = {
  '00 Inbox': '#9ca3af',
  '10 Teaching': '#4f9cf9',
  '20 Hustles': '#f59e0b',
  '30 Apps': '#10b981',
  '40 Life': '#ec4899',
  '50 Finance': '#22d3ee',
  '60 Health': '#a3e635',
  '70 Imports': '#c084fc',
  '90 System': '#6b7280',
}

export const DOMAIN_LABELS = {
  '00 Inbox': 'Inbox',
  '10 Teaching': 'Teaching',
  '20 Hustles': 'Hustles',
  '30 Apps': 'Apps',
  '40 Life': 'Life',
  '50 Finance': 'Finance',
  '60 Health': 'Health',
  '90 System': 'System',
}

export const HIGHLIGHT = '#fde047'

// external sources get a stable auto-color from their name
export function colorFor(domain) {
  if (DOMAIN_COLORS[domain]) return DOMAIN_COLORS[domain]
  let h = 0
  for (const c of domain) h = (h * 31 + c.charCodeAt(0)) % 360
  return `hsl(${h}, 75%, 62%)`
}
