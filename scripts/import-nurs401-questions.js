const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_PATH = path.join(
  ROOT,
  "school-assistant",
  "captures",
  "NURS401",
  "2026-07-07-uworld-practice-quiz-1-answers.md"
);
const OUTPUT_PATH = path.join(__dirname, "..", "data", "questions.json");

const MULTI_ANSWER_OVERRIDES = {
  3: [1, 2, 4],
  5: [1, 4],
  7: [2, 4, 5],
  8: [1, 2, 4],
  11: [1, 3, 4, 6],
  12: [2, 4, 5],
  13: [1, 2, 5],
  19: [1, 2, 3, 5],
  20: [2, 4, 5],
  25: [2, 3, 4, 5],
  32: [1, 4, 5],
  33: [1, 2, 4, 5],
  35: [1, 2, 4],
  36: [1, 2, 5],
  37: [1, 2, 3],
  39: [1, 3, 5],
};

const STEM_OVERRIDES = {
  8: "The nurse is caring for a newly admitted 54-year-old client with headache, facial flushing, warm skin, absent deep tendon reflexes, increased somnolence, milk of magnesia use, and end-stage kidney disease. Which potential interventions are appropriate? Select all that apply.",
  22: "The emergency department nurse is caring for a 10-month-old with lethargy, 3 days of diarrhea, reduced breast milk intake, skin tenting, capillary refill greater than 4 seconds, and sunken fontanels. The nurse recognizes that isotonic dehydration is caused by which fluid shift?",
};

const SYSTEM_OVERRIDES = {
  1: "Fluid and electrolytes",
  2: "Respiratory",
  3: "Fluid and electrolytes",
  4: "Fluid and electrolytes",
  5: "Respiratory",
  6: "Acid-base",
  7: "Respiratory",
  8: "Fluid and electrolytes",
  9: "Acid-base",
  10: "Respiratory",
  11: "Respiratory",
  12: "Fluid and electrolytes",
  13: "Fluid and electrolytes",
  14: "Fluid and electrolytes",
  15: "Fluid and electrolytes",
  16: "Fluid and electrolytes",
  17: "Fluid and electrolytes",
  18: "Fluid and electrolytes",
  19: "Fluid and electrolytes",
  20: "Fluid and electrolytes",
  21: "Fluid and electrolytes",
  22: "Fluid and electrolytes",
  23: "Respiratory",
  24: "Respiratory",
  25: "Respiratory",
  26: "Acid-base",
  27: "Fluid and electrolytes",
  28: "Acid-base",
  29: "Fluid and electrolytes",
  30: "Fluid and electrolytes",
  31: "Fluid and electrolytes",
  32: "Acid-base",
  33: "Respiratory",
  34: "Respiratory",
  35: "Fluid and electrolytes",
  36: "Respiratory",
  37: "Immune / emergency",
  38: "Fluid and electrolytes",
  39: "Fluid and electrolytes",
  40: "Acid-base",
  41: "Fluid and electrolytes",
  42: "Fluid and electrolytes",
};

const SUBTOPIC_OVERRIDES = {
  1: "Hypermagnesemia",
  2: "COPD hypoxemia",
  3: "Hypercalcemia",
  4: "Hypocalcemia",
  5: "Croup complications",
  6: "Metabolic alkalosis",
  7: "Incentive spirometry",
  8: "Hypermagnesemia",
  9: "Respiratory alkalosis",
  10: "Pulmonary embolism",
  11: "Epiglottitis",
  12: "Hyperkalemia",
  13: "Hypomagnesemia",
  14: "Hypophosphatemia",
  15: "Hyponatremia",
  16: "Hyperphosphatemia",
  17: "Magnesium toxicity",
  18: "Dehydration and hypovolemic shock",
  19: "Hypophosphatemia",
  20: "Hypernatremia",
  21: "Hypokalemia",
  22: "Isotonic dehydration",
  23: "Epiglottitis",
  24: "Pulse oximetry",
  25: "Croup",
  26: "Metabolic acidosis",
  27: "Hyponatremia",
  28: "Compensated metabolic acidosis",
  29: "Hypophosphatemia",
  30: "IV fluid solutions",
  31: "Hyperphosphatemia",
  32: "Metabolic alkalosis",
  33: "Pleural effusion",
  34: "Pleural effusion",
  35: "Magnesium toxicity",
  36: "Acute respiratory distress syndrome",
  37: "Anaphylaxis",
  38: "Hyperphosphatemia",
  39: "Hypernatremia",
  40: "Respiratory acidosis",
  41: "Hypokalemia",
  42: "Hypercalcemia",
};

function main() {
  const markdown = fs.readFileSync(SOURCE_PATH, "utf8");
  const sections = markdown.split(/\n---\n/g).filter((section) => section.includes("## Question "));
  const questions = sections.map(parseSection);
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(questions, null, 2)}\n`, "utf8");
  console.log(`Wrote ${questions.length} questions to ${path.relative(ROOT, OUTPUT_PATH)}`);
}

function parseSection(section) {
  const heading = section.match(/## Question (\d+) of \d+ \(QID (\d+)\)/);
  if (!heading) throw new Error(`Could not parse heading:\n${section.slice(0, 120)}`);

  const id = Number(heading[1]);
  const qid = heading[2];
  const stem = STEM_OVERRIDES[id] ?? cleanStem(readLabeledBlock(section, "Question"));
  const options = readChoices(section);
  const capturedCorrect = readLabeledLine(section, "Correct answer");
  const explanation = readBlockBetween(section, "**Explanation:**", "**Educational objective:**").trim();
  const objective = readLabeledBlock(section, "Educational objective").trim();
  const correctAnswers = getCorrectAnswers(id, options, capturedCorrect);
  const type = correctAnswers.length > 1 || isSelectAll(section) ? "Multiple Answer" : "Multiple Choice";

  return {
    id,
    qid,
    week: 2,
    weekLabel: "Week 2",
    topic: "Fluid, Electrolyte, Acid-Base / Pulmonary",
    system: SYSTEM_OVERRIDES[id] ?? inferSystem(stem, options, explanation),
    category: "UWorld practice",
    type,
    difficulty: "NCLEX-style",
    source: "Saved NURS401 UWorld capture: 2026-07-07-uworld-practice-quiz-1-answers.md",
    sourceType: "Saved UWorld",
    sourceConfidence: MULTI_ANSWER_OVERRIDES[id] ? "reviewed-explanation-key" : "captured-answer-key",
    sourceDetail: `UWorld QID ${qid}`,
    stem,
    options,
    correctAnswers,
    rationale: [explanation, objective ? `Educational objective: ${objective}` : ""].filter(Boolean).join("\n\n"),
    subtopic: SUBTOPIC_OVERRIDES[id] ?? inferSubtopic(stem, options, explanation),
  };
}

function readLabeledBlock(section, label) {
  const pattern = new RegExp(`\\*\\*${escapeRegExp(label)}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n---\\n|$)`);
  return section.match(pattern)?.[1]?.trim() ?? "";
}

function readLabeledLine(section, label) {
  const pattern = new RegExp(`\\*\\*${escapeRegExp(label)}:\\*\\*\\s*(.+)`);
  return section.match(pattern)?.[1]?.trim() ?? "";
}

function readBlockBetween(section, startMarker, endMarker) {
  const start = section.indexOf(startMarker);
  if (start === -1) return "";
  const afterStart = start + startMarker.length;
  const end = section.indexOf(endMarker, afterStart);
  return section.slice(afterStart, end === -1 ? undefined : end);
}

function readChoices(section) {
  const choicesBlock = readBlockBetween(section, "**Choices / response options:**", "**Correct answer:**");
  const options = choicesBlock
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => stripChoiceNumber(line.slice(2).trim()))
    .filter(Boolean);

  if (!options.length) throw new Error(`No choices found:\n${section.slice(0, 200)}`);
  return options;
}

function getCorrectAnswers(id, options, capturedCorrect) {
  const override = MULTI_ANSWER_OVERRIDES[id];
  if (override) return override.map((choiceNumber) => options[choiceNumber - 1]);

  const parsed = capturedCorrect
    .split(/\s*;\s*/)
    .map((answer) => stripChoiceNumber(answer.trim()))
    .filter(Boolean);

  return parsed.map((answer) => {
    const exact = options.find((option) => option === answer);
    if (exact) return exact;

    const normalizedAnswer = normalize(answer);
    const matched = options.find((option) => normalize(option) === normalizedAnswer);
    if (matched) return matched;

    throw new Error(`Correct answer "${answer}" did not match choices for question ${id}`);
  });
}

function cleanStem(value) {
  return value
    .replace(/^Notes Calculator Feedback\s*/i, "")
    .replace(/^Exhibit\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripChoiceNumber(value) {
  return value.replace(/^\d+\.\s*/, "").trim();
}

function isSelectAll(section) {
  return /select all that apply/i.test(section);
}

function inferSystem(stem, options, explanation) {
  const text = normalize([stem, ...options, explanation].join(" "));
  if (hasAny(text, ["croup", "epiglottitis", "pulmonary", "copd", "ards", "pleural", "incentive spirometry", "pulse oximeter", "pneumonia", "respiratory"])) {
    return "Respiratory";
  }
  if (hasAny(text, ["acidosis", "alkalosis", "paco2", "hco3", "arterial blood gas"])) {
    return "Acid-base";
  }
  if (hasAny(text, ["calcium", "magnesium", "potassium", "sodium", "phosphate", "dehydration", "fluid", "hypernatremia", "hyponatremia"])) {
    return "Fluid and electrolytes";
  }
  if (hasAny(text, ["anaphylaxis", "urticaria", "angioedema"])) {
    return "Immune / emergency";
  }
  return "NURS401";
}

function inferSubtopic(stem, options, explanation) {
  const text = normalize([stem, ...options, explanation].join(" "));
  const checks = [
    ["hypermagnesemia", "Hypermagnesemia"],
    ["hypomagnesemia", "Hypomagnesemia"],
    ["magnesium toxicity", "Magnesium toxicity"],
    ["hypercalcemia", "Hypercalcemia"],
    ["hypocalcemia", "Hypocalcemia"],
    ["hyperkalemia", "Hyperkalemia"],
    ["hypokalemia", "Hypokalemia"],
    ["hyponatremia", "Hyponatremia"],
    ["hypernatremia", "Hypernatremia"],
    ["hypophosphatemia", "Hypophosphatemia"],
    ["hyperphosphatemia", "Hyperphosphatemia"],
    ["metabolic alkalosis", "Metabolic alkalosis"],
    ["metabolic acidosis", "Metabolic acidosis"],
    ["respiratory alkalosis", "Respiratory alkalosis"],
    ["respiratory acidosis", "Respiratory acidosis"],
    ["dehydration", "Dehydration"],
    ["croup", "Croup"],
    ["epiglottitis", "Epiglottitis"],
    ["pulmonary embolism", "Pulmonary embolism"],
    ["pulse oximeter", "Pulse oximetry"],
    ["pleural effusion", "Pleural effusion"],
    ["ards", "Acute respiratory distress syndrome"],
    ["anaphylaxis", "Anaphylaxis"],
    ["incentive spirometry", "Incentive spirometry"],
  ];
  return checks.find(([needle]) => text.includes(needle))?.[1] ?? "NURS401 practice";
}

function hasAny(text, needles) {
  return needles.some((needle) => text.includes(needle));
}

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

main();
