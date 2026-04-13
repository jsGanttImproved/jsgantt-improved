# Tech Spec: Configurable First Day of Week

**Issue:** [#379](https://github.com/jsGanttImproved/jsgantt-improved/issues/379)  
**Status:** Proposed

---

## Problem

jsgantt-improved hardcodes **Monday as the first day of the week** throughout its date boundary and rendering logic. Users in locales where Sunday (or another day) opens the week see misaligned week columns and unexpected chart extents in the Day and Week views.

---

## Proposed API

```js
gantt.setOptions({
  vFirstDayOfWeek: 0  // 0–6: Sunday (0) through Saturday (6). Default: 1 (Monday).
})
```

The value mirrors `Date.prototype.getDay()` return values. String aliases (`"Sunday"`, `"Monday"`, etc.) are out of scope for MVP.

---

## Does This Already Exist?

No. There is no first-day-of-week parameter anywhere in the codebase. The requester's patch in the issue corrects two call sites in `date_utils.ts` but the hardcoded assumption propagates to weekend-detection and offset logic as well.

---

## Affected Files

| File | What changes |
|------|-------------|
| `src/draw.ts` | Add `this.vFirstDayOfWeek = 1` initialisation; pass it to `getMinDate`, `getMaxDate`, `getOffset`; fix weekend-column highlight detection |
| `src/options.ts` | Add `setFirstDayOfWeek()` setter and `getFirstDayOfWeek()` getter |
| `src/utils/date_utils.ts` | Parameterise `getMinDate` and `getMaxDate`; replace hardcoded `!= 1` / `!= 0` with computed values |
| `src/utils/general_utils.ts` | Parameterise `getOffset`; replace hardcoded `day === 6 \|\| day == 0` weekend check |
| `test/unit/date-utils.spec.ts` | Add boundary tests for `vFirstDayOfWeek = 0` and `vFirstDayOfWeek = 6` |

---

## Implementation Details

### Helper (date_utils.ts)

Add a small utility near the top of the file:

```typescript
// Returns the last day of the week given a first day (0=Sun … 6=Sat)
function lastDayOfWeek(firstDay: number): number {
  return (firstDay + 6) % 7;
}
```

### `getMinDate` (date_utils.ts, lines ~20–26)

**Current** — hardcodes Monday (`!= 1`):
```typescript
while (vDate.getDay() % 7 != 1)
  vDate.setDate(vDate.getDate() - 1);
```

**New signature:** `getMinDate(pList, pFormat, pMinDate, pFirstDayOfWeek = 1)`

**Replacement:**
```typescript
while (vDate.getDay() != pFirstDayOfWeek)
  vDate.setDate(vDate.getDate() - 1);
```

### `getMaxDate` (date_utils.ts, lines ~69–77)

**Current** — hardcodes Sunday (`!= 0`):
```typescript
while (vDate.getDay() % 7 != 0)
  vDate.setDate(vDate.getDate() + 1);
```

**Replacement:**
```typescript
const vLastDay = lastDayOfWeek(pFirstDayOfWeek);
while (vDate.getDay() != vLastDay)
  vDate.setDate(vDate.getDate() + 1);
```

### Weekend column highlight (draw.ts, line ~420)

**Current** — broken for non-Mon-start weeks:
```typescript
if (vDate.getDay() % 6 == 0)   // catches Saturday(6) and Sunday(0)
```

**Replacement:**
```typescript
const vLastDay = lastDayOfWeek(this.vFirstDayOfWeek);
const vPenultDay = (this.vFirstDayOfWeek + 5) % 7;
if (vDate.getDay() === vLastDay || vDate.getDay() === vPenultDay)
```

### `getOffset` weekend skip (general_utils.ts, lines ~144–145)

**Current:**
```typescript
if (day === 6 || day == 0) countWeekends++;
```

**New signature:** `getOffset(..., pFirstDayOfWeek = 1)`

**Replacement** — "weekend" = the last two days of the configured week:
```typescript
const vLastDay    = (pFirstDayOfWeek + 6) % 7;
const vPenultDay  = (pFirstDayOfWeek + 5) % 7;
if (day === vLastDay || day === vPenultDay) countWeekends++;
```

> This preserves the semantics of `vShowWeekends = false`: it collapses the last two days of whichever week the user has configured.

### options.ts additions

```typescript
setFirstDayOfWeek(pVal: number) {
  this.vFirstDayOfWeek = parseInt(String(pVal), 10);
}

getFirstDayOfWeek(): number {
  return this.vFirstDayOfWeek;
}
```

---

## Out of Scope

- **String aliases** (`"Sunday"` / `"Monday"`) — can be added post-MVP.
- **ISO week number display** — `getIsoWeek()` implements ISO 8601, which mandates Monday-start. The label is a display format, not a layout driver; leave it unchanged.
- **`vWorkingDays` integration** — that option is currently defined and settable but never consumed by any calculation. A separate issue.

---

## Verification

1. **Unit tests** (`test/unit/date-utils.spec.ts`): add cases for `vFirstDayOfWeek = 0` (Sunday-start) and `vFirstDayOfWeek = 6` (Saturday-start); assert `getMinDate` / `getMaxDate` return correct week boundaries.
2. **Default regression**: all existing tests must pass unchanged — the default `vFirstDayOfWeek = 1` preserves current Monday-start behaviour.
3. **Visual**: set `vFirstDayOfWeek: 0` in the demo; confirm the Day view opens on Sunday, week columns align correctly, and the weekend highlight shifts to Friday–Saturday.
4. **Run tests:** `npm run test-file test/unit/date-utils.spec.ts`
