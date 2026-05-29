/* swpcalc.js — Systematic Withdrawal Plan calculator */

/* ── helpers (mirrors sipcalc.js style) ── */
function swpFmt(n) {
    return "₹" + Math.round(n).toLocaleString("en-IN");
}

function swpParseRaw(str) {
    return parseFloat(String(str).replace(/[₹,%]/g, "").replace(/yr/i, "").replace(/,/g, "").trim()) || 0;
}

function swpClamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

/* ── core SWP maths ── */
/*
  Each month:
    corpus = corpus * (1 + monthlyRate) - withdrawal
  After n months we read off the remaining corpus.
  Total withdrawn = withdrawal * months  (capped at months corpus lasts)
*/
function calcSWP(corpus, withdrawal, annualRate, years) {
    const r = annualRate / 100 / 12;
    const n = years * 12;

    let balance = corpus;
    let monthsLasted = 0;
    let totalWithdrawn = 0;

    for (let m = 0; m < n; m++) {
        if (balance <= 0) break;                    // corpus already exhausted
        const actualWithdrawal = Math.min(withdrawal, balance);
        balance -= actualWithdrawal;                // withdraw first (end-of-month standard)
        totalWithdrawn += actualWithdrawal;
        monthsLasted++;
        balance = balance * (1 + r);                // remaining corpus grows
        if (balance < 1) { balance = 0; break; }    // treat near-zero as zero
    }

    const remaining = Math.max(balance, 0);
    const sustainable = remaining > 0;      // corpus survived the full period

    return {
        corpus,
        totalWithdrawn,
        remaining,
        monthsLasted,
        sustainable,
        years,
        withdrawal
    };
}

/* ── plain-English insight builder ── */
function buildInsight(res) {
    const { corpus, totalWithdrawn, remaining, monthsLasted, sustainable, years, withdrawal } = res;
    const lines = [];

    if (sustainable) {
        lines.push(
            `You withdraw <span class="hi">${swpFmt(withdrawal)}/month</span> for <span class="hi">${years} years</span> and still have <span class="hi">${swpFmt(remaining)}</span> left.`
        );
        lines.push(
            `Your money earns returns fast enough to keep your corpus alive — that's a well-structured SWP.`
        );
        const growthVsWithdrawal = (corpus * (parseFloat(document.getElementById("rate").value) / 100 / 12));
        if (growthVsWithdrawal >= withdrawal) {
            lines.push(`In fact, your corpus is growing faster than you're withdrawing — your balance may actually increase over time.`);
        }
    } else {
        const yearsLasted = Math.floor(monthsLasted / 12);
        const monthsExtra = monthsLasted % 12;
        const durationStr = yearsLasted > 0
            ? `${yearsLasted} yr${yearsLasted > 1 ? "s" : ""}${monthsExtra > 0 ? ` ${monthsExtra} mo` : ""}`
            : `${monthsLasted} months`;
        lines.push(
            `With this withdrawal, your corpus runs out in <span class="hi">${durationStr}</span> — before the ${years}-year period ends.`
        );
        lines.push(
            `Consider reducing the monthly withdrawal, increasing the corpus, or expecting a slightly higher return.`
        );
    }

    lines.push(`Total amount you'll receive: <span class="hi">${swpFmt(totalWithdrawn)}</span> over ${years} years.`);

    return lines.map(l => `<div class="insight-line">${l}</div>`).join("");
}

/* ── DOM update ── */
function swpCalc() {
    const corpus     = +document.getElementById("corpus").value;
    const withdrawal = +document.getElementById("withdrawal").value;
    const rate       = +document.getElementById("rate").value;
    const period     = +document.getElementById("period").value;

    const res = calcSWP(corpus, withdrawal, rate, period);

    /* headline cards */
    document.getElementById("r-corpus").textContent    = swpFmt(res.corpus);
    document.getElementById("r-withdrawn").textContent = swpFmt(res.totalWithdrawn);
    document.getElementById("r-remaining").textContent = swpFmt(res.remaining);

    /* sustainability badge */
    const badge = document.getElementById("sustainBadge");
    const icon  = document.getElementById("sustainIcon");
    const text  = document.getElementById("sustainText");
    badge.className = "sustainability-badge " + (res.sustainable ? "ok" : "bad");
    icon.className  = res.sustainable ? "fas fa-circle-check" : "fas fa-circle-xmark";
    text.textContent = res.sustainable
        ? "Corpus lasts the full period ✓"
        : "Corpus runs out before period ends ✗";

    /* ring chart — shows % of corpus remaining vs withdrawn */
    const remainingPct  = Math.round((res.remaining / res.corpus) * 100);
    const withdrawnPct  = 100 - remainingPct;
    const circle        = document.getElementById("ring");
    const circumference = 2 * Math.PI * 70;
    circle.style.strokeDasharray  = circumference;
    circle.style.strokeDashoffset = circumference - (withdrawnPct / 100) * circumference;

    document.getElementById("bar-withdrawn-label").textContent = withdrawnPct + "% withdrawn";
    document.getElementById("bar-remaining-pct").textContent   = remainingPct + "% remaining";

    /* plain-English insight */
    document.getElementById("swpInsight").innerHTML = buildInsight(res);
}

/* ── slider → label sync ── */
function swpSyncLabels() {
    const c = +document.getElementById("corpus").value;
    const w = +document.getElementById("withdrawal").value;
    const r = +document.getElementById("rate").value;
    const p = +document.getElementById("period").value;
    document.getElementById("lbl-corpus").value     = "₹" + c.toLocaleString("en-IN");
    document.getElementById("lbl-withdrawal").value = "₹" + w.toLocaleString("en-IN");
    document.getElementById("lbl-rate").value       = r + "%";
    document.getElementById("lbl-period").value     = p + " yr";
}

/* ── label input → slider ── */
function swpBindLabel(inputId, sliderId, min, max, step, formatFn) {
    const inp = document.getElementById(inputId);
    const sld = document.getElementById(sliderId);

    inp.addEventListener("change", () => commit());
    inp.addEventListener("keydown", e => { if (e.key === "Enter") inp.blur(); });
    inp.addEventListener("focus",   () => { inp.value = swpParseRaw(inp.value) || ""; });
    inp.addEventListener("blur",    () => commit());

    function commit() {
        let val = swpParseRaw(inp.value);
        val = swpClamp(val, min, max);
        val = Math.round(val / step) * step;
        sld.value  = val;
        inp.value  = formatFn(val);
        swpCalc();
    }
}

/* ── wire up sliders ── */
["corpus", "withdrawal", "rate", "period"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
        swpSyncLabels();
        swpCalc();
    });
});

/* ── init ── */
setTimeout(() => {
    swpBindLabel("lbl-corpus",     "corpus",     10000, 10000000, 10000, v => "₹" + v.toLocaleString("en-IN"));
    swpBindLabel("lbl-withdrawal", "withdrawal", 500,   200000,   500,   v => "₹" + v.toLocaleString("en-IN"));
    swpBindLabel("lbl-rate",       "rate",       1,     30,       0.5,   v => v + "%");
    swpBindLabel("lbl-period",     "period",     1,     40,       1,     v => v + " yr");
    swpSyncLabels();
    swpCalc();
}, 50);
