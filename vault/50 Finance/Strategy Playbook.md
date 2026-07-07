---
type: strategy
instrument: MES (Micro E-mini S&P 500), 1 contract
phase: paper
status: active
---

# Strategy Playbook — 5-Minute Opening Range Breakout (ORB)

*Selected 2026-07-07 from research into popular mechanical strategies. The Trader follows this verbatim in every daily plan. Linked: [[Trading Goals]].*

## Why this strategy
- **The most popular, most-documented mechanical morning strategy** — and the rare day-trading approach with published academic evidence: Zarattini, Barbon & Aziz studied 5-min ORB across 7,000+ US stocks (2016–2023) and found sustained profitability *on "stocks in play" with proper risk sizing* ([SSRN paper](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4729284), [summary](https://concretumgroup.com/a-profitable-day-trading-strategy-for-the-u-s-equity-market/)). Honest caveat: that evidence is on news-active stocks, not index futures — it validates the *mechanics*, not a guarantee on MES.
- **Perfectly mechanical**: the range is a fact, the break is a fact, the filters are facts. No reading, no feel — exactly what [[Trading Goals]] requires.
- **Fits the window**: signal forms 9:35 AM ET, done by 11:30. Runner-up (VWAP pullback, ~64% win rate when trend conditions align per [TradingSim](https://www.tradingsim.com/blog/vwap-indicator-guide)) needs more judgment about "orderly trend" — it's the phase-2 strategy, not the starter.

## The numbers (MES)
1 point = $5.00 · 1 tick (0.25) = $1.25 · Risk budget $10–25 → **max stop distance 5 points** with 1 contract.

## Daily checklist

### Pre-market (before 9:30 ET — The Trader's briefing covers this)
1. Economic calendar check: **FOMC day, CPI/PPI/NFP morning, or half-day session → NO-TRADE DAY.** Skip entirely.
2. Note overnight high/low, yesterday's high/low/close on the chart.
3. Confirm chart setup: MES current contract, 5-min candles, session VWAP, 20-EMA, volume.

### The range (9:30–9:35 ET)
4. First 5-min candle closes → mark its **high and low**. That's the opening range. Do nothing during this candle.

### Entry rules (9:35–11:00 ET only)
5. **Long**: 5-min candle **closes** above the range high AND price is above VWAP AND 20-EMA is sloping up. Enter at that close.
6. **Short**: mirror — close below range low, below VWAP, 20-EMA sloping down.
7. **Chop filter**: half the range (range midpoint to edge) > 5 points → risk too big for 1 MES → **no trade today** on this setup. Range half < 2 points → too tight to be meaningful → skip the first signal, allow one re-break.
8. Contradiction filter: breaks range high but below VWAP (or vice versa) → not a valid signal. Wait or skip.

### Trade management
9. **Stop: range midpoint** (risk = half range = ≤5 pts = ≤$25). Entered on the hard bracket the moment the order fills — never mental.
10. **Target: 2R** (twice the stop distance). At **+1R**, move stop to breakeven.
11. Still open at 11:30 ET → close at market. No lunch-hour babysitting, no overnight ever.

### Discipline rails (the gate audits these)
12. **Max 2 trades/day** — the first two valid signals, then done regardless of outcome.
13. **–$50 on the day → flat, platform closed, done.** No exceptions; one violation restarts the gate month.
14. Every trade gets a journal line the same day: setup screenshot, entry/stop/target, followed-checklist yes/no, P&L.

## TradingView setup (one-time)
1. Right-click price scale → enable **Paper Trading** connection (built-in, free).
2. **Buy the CME real-time bundle (~$7/mo)** — default futures data is delayed ~10 minutes, which makes paper trading the open meaningless ([TradingView data](https://www.tradingview.com/support/solutions/43000471705-how-to-purchase-additional-market-data/), [guide](https://optimusfutures.com/blog/tradingview-real-time-data/)). This is the one real cost of the paper phase.
3. Chart: `MES1!` (continuous front contract), 5-minute, regular session hours. Indicators: VWAP (session-anchored), EMA 20, volume.
4. Paper account size: set to $1,000 to mirror the planned live account.

## Honest expectations
Most brand-new day traders lose money; that's the base rate and the reason the [[Trading Goals]] gate exists. Paper months cost $7, live mistakes cost real dollars — let the cheap version prove it first. If the paper record can't pass one profitable, zero-violation month, that's the system working, not failing.

## Phase 2 (only after the gate is passed)
- Add VWAP-pullback as a second setup; evaluate MNQ; revisit the school-year window per [[Trading Goals]].
