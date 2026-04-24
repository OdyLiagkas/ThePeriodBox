import { Badge } from "@/components/ui/badge";

/* ─── Types ─────────────────────────────────────────────── */
interface SurveyAnswersProps {
  answers: Record<string, any>;
  className?: string;
}

/* ─── Keys to hide ───────────────────────────────────────── */
// Hides all *-interest keys and sentinel no-* values
const HIDDEN_KEY_PATTERNS = [
  /product-interests/,
  /tampon-interest/,
  /pad-interest/,
  /liner-interest/,
];

const HIDDEN_VALUE_PATTERNS = [
  /^no-tampons$/,
  /^no-pads$/,
  /^no-liners$/,
  /^no-pads-or-liners$/,
  /^no-period$/,
];

/* ─── Human-readable labels ──────────────────────────────── */
const QUESTION_LABELS: Record<string, string> = {
  "hormonal-stage":                 "Hormonal stage",
  "goals":                          "Goals",
  "flow":                           "Flow",
  "organic-preference":             "Material preferences",
  "tampon-applicator":              "Tampon applicator",
  "pad-use":                        "Pad / liner use",
  "pad-type":                       "Pad type",
  "liner-type":                     "Liner type",
  "excluded-brands":                "Excluded brands",
  "trimester":                      "Trimester",
  "pregnancy-goals":                "Pregnancy goals",
  "pregnant-liner-type":            "Product preferences",
  "pregnant-liner-type-discharge":  "Product preferences",
  "pregnant-organic-preference":    "Material preferences",
  "additional-notes-pregnant":      "Additional notes",
  "postpartum-timeline":            "Time postpartum",
  "postpartum-flow":                "Current flow",
  "postpartum-organic-preference":  "Material preferences",
  "postpartum-experience":          "Current experiences",
  "additional-notes-postpartum":    "Additional notes",
  "peri-status":                    "Perimenopause status",
  "age-range":                      "Age range",
  "predictability":                 "Cycle predictability",
  "perimeno-flow":                  "Current flow",
  "spotting-frequency":             "Spotting / unexpected bleeding",
  "perimeno-organic-preference":    "Material preferences",
  "additional-notes-peri":          "Additional notes",
  "meno-status":                    "Menopause status",
  "time-since":                     "Time since last period",
  "meno-organic-preference":        "Material preferences",
  "bladder-protection":             "Bladder protection level",
  "additional-notes-meno":          "Additional notes",
};

/* ─── Human-readable option values ──────────────────────── */
const OPTION_VALUE_LABELS: Record<string, string> = {
  // hormonal stage
  "no-change":          "Not in a hormonal change period",
  "on-bc":              "On hormonal birth control > 2 years",
  "stopped-bc":         "Recently stopped hormonal birth control",
  "started-bc":         "Recently started hormonal birth control",
  "pregnant":           "Currently pregnant",
  "postpartum":         "Postpartum / recently gave birth",
  "perimenopausal":     "Perimenopausal",
  "menopausal":         "Menopausal",
  // goals
  "better-product":     "Finding a product that works better for my body",
  "new-type":           "Introducing an additional product",
  "switching":          "Switching products",
  "organic":            "Switching to fully organic products",
  // flow
  "heavy-then-moderate":"Heavy first ~2 days, moderate 3–4, light end",
  "light":              "Light – minimal flow 1–2 days",
  "moderate":           "Moderate – regular flow 3–5 days",
  "heavy":              "Heavy – significant flow 4–5+ days",
  "very-heavy":         "Very heavy – 5+ days",
  "varies":             "Varies – changes month to month",
  // materials
  "cotton-only":        "100% Organic Cotton",
  "cotton-blend":       "Cotton blends",
  "alternative":        "Cotton with alternative fibers (bamboo, hemp)",
  "hypoallergenic":     "Hypoallergenic materials",
  "material-unimportant":"All types of materials – not important to me",
  // tampon applicator
  "plastic-extended":   "Plastic fully extended applicator",
  "plastic-compact":    "Plastic compact / extendable applicator",
  "cardboard":          "Cardboard applicator",
  "no-applicator":      "No applicator (digital)",
  // pad use
  "sleeping-protection":"While sleeping",
  "day-protection":     "During the day on my period",
  "extra-protection":   "Extra protection with tampons",
  "extra-safety":       "Just in case / off period",
  "heavy-days":         "Heavy days",
  "end-of-cycle":       "End of cycle",
  "lochia":             "For lochia (haven't restarted period yet)",
  "bladder-leakage":    "In case of bladder leakage",
  "during-sleep":       "While sleeping",
  "day-on-period":      "During the day on my period",
  // pad type
  "wingless":           "Wingless pads",
  "single-wings":       "Pads with single wings",
  "double-wings":       "Pads with double wings",
  "rear-coverage":      "Pads with extra rear coverage",
  // liner type
  "standard-liner":     "Standard liners",
  "thong-liner":        "Thong liners",
  "extra-protection-liner":"Extra protection liners",
  "disposable-underwear":"Disposable underwear",
  "pads":               "Pads",
  // pregnancy goals
  "discharge":          "Staying comfortable with discharge",
  "postpartum-prep":    "Preparing for postpartum bleeding",
  "period-return":      "Preparing for when my period returns",
  // postpartum timeline
  "0-2":                "0–2 months",
  "3-6":                "3–6 months",
  "6+":                 "More than 6 months",
  // postpartum flow
  "heavy-then-moderate-pp":"Heavy at first, then moderate, ending light",
  // postpartum experience
  "increased-discharge":"Increased discharge",
  "incontinence-leakage":"Incontinence or bladder leakage",
  "perineal-sensitivity":"Perineal sensitivity or stitches",
  "vaginal-dryness":    "Vaginal dryness (breastfeeding)",
  "none":               "None",
  // peri status
  "diagnosed":          "Told I'm in perimenopause",
  "suspect":            "I think I may be in perimenopause",
  "unsure":             "I'm not sure, but my cycle has changed",
  "none-of-the-above":  "None of the above",
  // age range
  "under-40":           "Under 40",
  "40-44":              "40–44",
  "45-49":              "45–49",
  "50-54":              "50–54",
  "54+":                "Over 54",
  // predictability
  "very":               "Very predictable",
  "somewhat":           "Somewhat unpredictable",
  "highly":             "Highly unpredictable",
  "skip":               "I skip periods sometimes",
  // spotting
  "perimeno-spotting":  "Yes",
  "perimeno-no-spotting":"No",
  // meno status
  "12-months":          "No period in 12+ months",
  "hormone-therapy":    "Using hormone therapy",
  // time since
  "12-18":              "12–18 months",
  "18-24":              "18–24 months",
  "2-5":                "2–5 years",
  "5+":                 "More than 5 years",
  // bladder protection
  "light-protection":   "Light protection, mostly daily use",
  "medium-protection":  "Medium protection",
  "significant-protection":"Significant protection",
};

/* ─── Section groupings ───────────────────────────────────── */
type Section = {
  label: string;
  color: "purple" | "teal" | "coral" | "pink" | "blue" | "amber";
  keys: string[];
};

const SECTIONS: Section[] = [
  {
    label: "About you",
    color: "purple",
    keys: [
      "hormonal-stage", "trimester", "pregnancy-goals",
      "postpartum-timeline", "peri-status", "age-range",
      "meno-status", "time-since",
    ],
  },
  {
    label: "Flow & cycle",
    color: "coral",
    keys: [
      "flow", "postpartum-flow", "perimeno-flow",
      "predictability", "spotting-frequency", "postpartum-experience",
    ],
  },
  {
    label: "Goals & products",
    color: "teal",
    keys: [
      "goals", "tampon-applicator",
      "pad-use", "pad-type", "liner-type",
      "pregnant-liner-type", "pregnant-liner-type-discharge",
      "bladder-protection",
    ],
  },
  {
    label: "Materials",
    color: "blue",
    keys: [
      "organic-preference", "pregnant-organic-preference",
      "postpartum-organic-preference", "perimeno-organic-preference",
      "meno-organic-preference",
    ],
  },
  {
    label: "Excluded brands",
    color: "amber",
    keys: ["excluded-brands"],
  },
  {
    label: "Notes",
    color: "pink",
    keys: [
      "additional-notes-pregnant", "additional-notes-postpartum",
      "additional-notes-peri", "additional-notes-meno",
    ],
  },
];

/* ─── Color maps ─────────────────────────────────────────── */
const SECTION_COLORS: Record<Section["color"], { bg: string; border: string; dot: string; badge: string; badgeText: string }> = {
  purple: {
    bg: "#EEEDFE",
    border: "#AFA9EC",
    dot: "#7F77DD",
    badge: "#EEEDFE",
    badgeText: "#3C3489",
  },
  teal: {
    bg: "#E1F5EE",
    border: "#5DCAA5",
    dot: "#1D9E75",
    badge: "#E1F5EE",
    badgeText: "#085041",
  },
  coral: {
    bg: "#FAECE7",
    border: "#F0997B",
    dot: "#D85A30",
    badge: "#FAECE7",
    badgeText: "#712B13",
  },
  pink: {
    bg: "#FBEAF0",
    border: "#ED93B1",
    dot: "#D4537E",
    badge: "#FBEAF0",
    badgeText: "#72243E",
  },
  blue: {
    bg: "#E6F1FB",
    border: "#85B7EB",
    dot: "#378ADD",
    badge: "#E6F1FB",
    badgeText: "#0C447C",
  },
  amber: {
    bg: "#FAEEDA",
    border: "#EF9F27",
    dot: "#BA7517",
    badge: "#FAEEDA",
    badgeText: "#633806",
  },
};

/* ─── Helpers ─────────────────────────────────────────────── */
function shouldHideKey(key: string): boolean {
  return HIDDEN_KEY_PATTERNS.some((p) => p.test(key));
}

function shouldHideValue(value: string): boolean {
  return HIDDEN_VALUE_PATTERNS.some((p) => p.test(value));
}

function formatValue(value: any): string[] {
  const raw: string[] = Array.isArray(value)
    ? value
    : typeof value === "string"
    ? [value]
    : [String(value)];

  return raw
    .filter((v) => v && v !== "NONE" && !shouldHideValue(v))
    .map((v) => OPTION_VALUE_LABELS[v] ?? v.replace(/-/g, " "));
}

function labelForKey(key: string): string {
  return QUESTION_LABELS[key] ?? key.replace(/-/g, " ");
}

/* ─── Row component ──────────────────────────────────────── */
function AnswerRow({
  label,
  values,
  dotColor,
}: {
  label: string;
  values: string[];
  dotColor: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: "12px",
        alignItems: "flex-start",
        padding: "10px 0",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          paddingTop: "2px",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: dotColor,
            flexShrink: 0,
            marginTop: 6,
          }}
        />
        <span
          style={{
            fontSize: 13,
            color: "var(--color-text-secondary)",
            lineHeight: 1.5,
            textTransform: "capitalize",
          }}
        >
          {label}
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {values.length === 1 ? (
          <span
            style={{
              fontSize: 14,
              color: "var(--color-text-primary)",
              fontWeight: 500,
              lineHeight: 1.5,
              textTransform: "capitalize",
            }}
          >
            {values[0]}
          </span>
        ) : (
          values.map((v, i) => (
            <span
              key={i}
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--color-text-primary)",
                background: "var(--color-background-secondary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: 6,
                padding: "3px 10px",
                lineHeight: 1.5,
                textTransform: "capitalize",
              }}
            >
              {v}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Section component ──────────────────────────────────── */
function SurveySection({
  section,
  rows,
}: {
  section: Section;
  rows: { key: string; values: string[] }[];
}) {
  const c = SECTION_COLORS[section.color];

  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: c.bg,
          borderBottom: `0.5px solid ${c.border}`,
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: c.dot,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: c.badgeText,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {section.label}
        </span>
      </div>

      {/* Rows */}
      <div style={{ padding: "0 20px" }}>
        {rows.map(({ key, values }, i) => (
          <AnswerRow
            key={key}
            label={labelForKey(key)}
            values={values}
            dotColor={c.dot}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────── */
export function SurveyAnswers({ answers, className }: SurveyAnswersProps) {
  // Filter out hidden keys and empty values
  const visibleAnswers: Record<string, string[]> = {};
  for (const [key, raw] of Object.entries(answers)) {
    if (shouldHideKey(key)) continue;
    const values = formatValue(raw);
    if (values.length === 0) continue;
    visibleAnswers[key] = values;
  }

  // Build sections that have at least one answer
  const builtSections = SECTIONS.flatMap((section) => {
    const rows = section.keys
      .filter((k) => visibleAnswers[k])
      .map((k) => ({ key: k, values: visibleAnswers[k] }));

    if (rows.length === 0) return [];
    return [{ section, rows }];
  });

  // Catch any keys not assigned to a section
  const assignedKeys = new Set(SECTIONS.flatMap((s) => s.keys));
  const orphanRows = Object.keys(visibleAnswers)
    .filter((k) => !assignedKeys.has(k))
    .map((k) => ({ key: k, values: visibleAnswers[k] }));

  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {builtSections.map(({ section, rows }) => (
        <SurveySection key={section.label} section={section} rows={rows} />
      ))}

      {orphanRows.length > 0 && (
        <SurveySection
          section={{ label: "Other", color: "blue", keys: [] }}
          rows={orphanRows}
        />
      )}
    </div>
  );
}
//interface SurveyAnswersProps {
//  answers: Record<string, any>;
/*  className?: string; // optional
}

export function SurveyAnswers({ answers, className }: SurveyAnswersProps) {
  return (
    <div className={className}>
      {Object.entries(answers).map(([key, value]) => (
        <div key={key} className="flex gap-2 items-baseline">
          <span className="bg-orange-100 text-orange-800 capitalize px-2 py-1 rounded">
            {key.replace(/-/g, " ")}:
          </span>
          <span className="font-semibold text-red-600">
            {Array.isArray(value) ? value.join(", ") : value}
          </span>
        </div>
      ))}
    </div>
  );
}
*/