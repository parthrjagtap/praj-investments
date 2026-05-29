const CONFIG = {
            sip:     { amountLabel: "Monthly investment", amountMin: 100,    amountMax: 100000,  amountStep: 500,  prefix: "₹", suffix: "",   isAmount: true  },
            lumpsum: { amountLabel: "Total investment",   amountMin: 500,    amountMax: 1000000, amountStep: 500,  prefix: "₹", suffix: "",   isAmount: true  },
            stepup:  { amountLabel: "Monthly investment", amountMin: 100,    amountMax: 100000,  amountStep: 500,  prefix: "₹", suffix: "",   isAmount: true  },
        };

        let mode = "sip";

        function fmt(n) {
            return "₹" + Math.round(n).toLocaleString("en-IN");
        }

        function parseRaw(str) {
            // Strip ₹, commas, %, "yr", spaces — return numeric
            return parseFloat(str.replace(/[₹,%]/g, "").replace(/yr/i, "").replace(/,/g, "").trim()) || 0;
        }

        function clamp(val, min, max) {
            return Math.min(Math.max(val, min), max);
        }

        function calcSIP(monthly, rate, years) {
            const r = rate / 100 / 12;
            const n = years * 12;
            const invested = monthly * n;
            const total = r === 0 ? invested : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
            return { invested, total, profit: total - invested };
        }

        function calcLumpsum(amount, rate, years) {
            const total = amount * Math.pow(1 + rate / 100, years);
            return { invested: amount, total, profit: total - amount };
        }

        function calcStepup(monthly, rate, years, stepup) {
            const r = rate / 100 / 12;
            const sr = stepup / 100;
            let total = 0, invested = 0;
            for (let y = 0; y < years; y++) {
                const m = monthly * Math.pow(1 + sr, y);
                for (let mo = 0; mo < 12; mo++) {
                    const monthsLeft = (years - y) * 12 - mo;
                    total += m * Math.pow(1 + r, monthsLeft);
                    invested += m;
                }
            }
            return { invested, total, profit: total - invested };
        }

        function calc() {
            const amount = +document.getElementById("amount").value;
            const rate   = +document.getElementById("rate").value;
            const period = +document.getElementById("period").value;
            const su     = +document.getElementById("stepup").value;

            let res;
            if (mode === "sip")     res = calcSIP(amount, rate, period);
            if (mode === "lumpsum") res = calcLumpsum(amount, rate, period);
            if (mode === "stepup")  res = calcStepup(amount, rate, period, su);

            document.getElementById("r-invested").textContent = fmt(res.invested);
            document.getElementById("r-returns").textContent  = fmt(res.profit);
            document.getElementById("r-total").textContent    = fmt(res.total);

            const investedPct = Math.round((res.invested / res.total) * 100);
            const returnsPct  = 100 - investedPct;
            const circle      = document.getElementById("ring");
            const circumference = 2 * Math.PI * 70;
            circle.style.strokeDasharray  = circumference;
            circle.style.strokeDashoffset = circumference - (investedPct / 100) * circumference;

            document.getElementById("bar-invested-label").textContent = investedPct + "% invested";
            document.getElementById("bar-returns-pct").textContent    = returnsPct  + "% returns";
        }

        // Update displayed label text from slider value
        function syncLabelsFromSliders() {
            const a  = +document.getElementById("amount").value;
            const su = +document.getElementById("stepup").value;
            const r  = +document.getElementById("rate").value;
            const p  = +document.getElementById("period").value;
            document.getElementById("lbl-amount").value = "₹" + a.toLocaleString("en-IN");
            document.getElementById("lbl-stepup").value = su + "%";
            document.getElementById("lbl-rate").value   = r + "%";
            document.getElementById("lbl-period").value = p + " yr";
        }

        // When user types into a label input, update the slider and recalc
        function bindLabelInput(inputId, sliderId, min, max, step, formatFn) {
            const inp = document.getElementById(inputId);
            const sld = document.getElementById(sliderId);

            inp.addEventListener("change", () => {
                let val = parseRaw(inp.value);
                val = clamp(val, min, max);
                // Snap to step
                val = Math.round(val / step) * step;
                sld.value = val;
                inp.value = formatFn(val);
                calc();
            });

            inp.addEventListener("keydown", e => {
                if (e.key === "Enter") inp.blur();
            });

            // While typing, don't format — just let them type
            inp.addEventListener("focus", () => {
                inp.value = parseRaw(inp.value) || "";
            });

            inp.addEventListener("blur", () => {
                let val = parseRaw(inp.value);
                val = clamp(val, min, max);
                val = Math.round(val / step) * step;
                sld.value = val;
                inp.value = formatFn(val);
                calc();
            });
        }

        function initBindings() {
            const cfg = CONFIG[mode];
            // amount binding depends on mode (min/max/step changes)
            bindLabelInput("lbl-amount", "amount",  cfg.amountMin, cfg.amountMax, cfg.amountStep, v => "₹" + v.toLocaleString("en-IN"));
            bindLabelInput("lbl-stepup", "stepup",  1,  50,  1,   v => v + "%");
            bindLabelInput("lbl-rate",   "rate",    1,  30,  0.5, v => v + "%");
            bindLabelInput("lbl-period", "period",  1,  40,  1,   v => v + " yr");
        }

        function setMode(m) {
            mode = m;
            const cfg = CONFIG[m];
            const a = document.getElementById("amount");
            a.min  = cfg.amountMin;
            a.max  = cfg.amountMax;
            a.step = cfg.amountStep;
            if (+a.value < cfg.amountMin) a.value = cfg.amountMin;
            if (+a.value > cfg.amountMax) a.value = cfg.amountMax;

            document.getElementById("lbl-amount-text").textContent = cfg.amountLabel;
            document.getElementById("field-stepup").style.display = m === "stepup" ? "block" : "none";

            // Re-bind amount input with new min/max/step for this mode
            const inp = document.getElementById("lbl-amount");
            // Remove old listeners by replacing node
            const newInp = inp.cloneNode(true);
            inp.parentNode.replaceChild(newInp, inp);
            bindLabelInput("lbl-amount", "amount", cfg.amountMin, cfg.amountMax, cfg.amountStep, v => "₹" + v.toLocaleString("en-IN"));

            syncLabelsFromSliders();
            calc();
        }

        // Slider → label sync
        ["amount","rate","period","stepup"].forEach(id => {
            document.getElementById(id).addEventListener("input", () => {
                syncLabelsFromSliders();
                calc();
            });
        });

        // Tab switching
        document.getElementById("tabs").addEventListener("click", e => {
            const btn = e.target.closest(".tab");
            if (!btn) return;
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
            setMode(btn.dataset.mode);
        });

        // Init
        setTimeout(() => {
            initBindings();
            syncLabelsFromSliders();
            calc();
        }, 50);