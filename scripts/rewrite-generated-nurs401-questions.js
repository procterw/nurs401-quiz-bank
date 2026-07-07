const fs = require("fs");
const path = require("path");

const OUTPUT_PATH = path.join(__dirname, "..", "data", "questions.json");
const EXPECTED_GENERATED_COUNT = 200;

const BASE_SOURCE =
  "Rewritten original NCLEX-style practice from NURS401 weeks 1-3 course notes and slide captures";

const TOPICS = {
  1: "Orientation, Clinical Judgment, Oxygenation/Perfusion, Shock",
  2: "Fluid, Electrolyte, Acid-Base / Pulmonary",
  3: "Communication, Teaching, Handoff, Discharge Planning",
};

const SYSTEM_BY_SUBTOPIC = {
  "Recognize cues": "Clinical judgment",
  "Nursing diagnosis": "Clinical judgment",
  "Hypovolemic shock": "Perfusion / shock",
  "Cardiogenic shock": "Perfusion / shock",
  "Obstructive shock": "Perfusion / shock",
  "Septic shock": "Perfusion / shock",
  "Anaphylactic shock": "Immune / emergency",
  "Neurogenic shock": "Perfusion / shock",
  "Shock evaluation": "Perfusion / shock",
  "Rapid response": "Safety / escalation",
  "Ventilation-perfusion mismatch": "Respiratory",
  "Pediatric shock compensation": "Perfusion / shock",
  "Positive inotropes": "Perfusion / shock",
  "Isotonic fluids": "Fluid and electrolytes",
  "Fluid volume excess": "Fluid and electrolytes",
  Hyperkalemia: "Fluid and electrolytes",
  Hypokalemia: "Fluid and electrolytes",
  Hyponatremia: "Fluid and electrolytes",
  Hypernatremia: "Fluid and electrolytes",
  Hypercalcemia: "Fluid and electrolytes",
  Hypocalcemia: "Fluid and electrolytes",
  Hypermagnesemia: "Fluid and electrolytes",
  Hypomagnesemia: "Fluid and electrolytes",
  "Tumor lysis syndrome": "Fluid and electrolytes",
  "Refeeding syndrome": "Fluid and electrolytes",
  "DKA potassium shift": "Fluid and electrolytes",
  "Respiratory acidosis": "Acid-base",
  "Respiratory alkalosis": "Acid-base",
  "Metabolic acidosis": "Acid-base",
  "Metabolic alkalosis": "Acid-base",
  "ABG compensation": "Acid-base",
  "Upper airway obstruction": "Respiratory",
  "Status asthmaticus": "Respiratory",
  "Obstructive sleep apnea": "Respiratory",
  Atelectasis: "Respiratory",
  "Aspiration pneumonia": "Respiratory",
  Pneumonia: "Respiratory",
  "Pulmonary edema": "Respiratory",
  "Pleural effusion": "Respiratory",
  Pneumothorax: "Respiratory",
  "Pulmonary embolism": "Respiratory",
  "Therapeutic communication": "Communication",
  "Trauma-informed care": "Communication",
  "ISBAR escalation": "Communication",
  "Teach-back": "Teaching / discharge",
  "Readiness to learn": "Teaching / discharge",
  "Early discharge planning": "Discharge planning",
  "Stable versus healed": "Discharge planning",
  "Handoff safety": "Communication",
  "Chain of command": "Safety / escalation",
};

const SETS = [
  set(1, "Recognize cues", [
    mc(
      "The nurse receives morning report on four adult clients. Which client should the nurse assess first?",
      [
        "Client 1 day after bowel surgery with heart rate 126/min, urine output 18 mL/hr, cool hands, and new confusion",
        "Client with COPD whose SpO2 is 90% on the prescribed 2 L/min oxygen and who is eating breakfast",
        "Client 2 hours after thoracentesis with mild puncture-site soreness and SpO2 94% on room air",
        "Client receiving IV antibiotics for pneumonia with temperature down to 100.2 F and productive cough",
      ],
      0,
      "Use ABCs plus perfusion cues. The postoperative client has tachycardia, oliguria, cool skin, and new confusion, which cluster as possible early shock or inadequate tissue perfusion. Urine output of 18 mL/hr is below the usual adult target of at least 30 mL/hr, and new confusion suggests decreased cerebral perfusion. The COPD client is at the prescribed oxygen level and eating, so this may be baseline rather than acute deterioration. Osteoarthritis pain needs care, but it is not more urgent than possible shock. The discharge scheduling question is appropriate to address after unstable clients are assessed. Test cue: when one option combines mental status change plus low urine output plus cool skin, treat it as a perfusion problem until proven otherwise."
    ),
    mc(
      "A client treated for early shock now has BP 98/58, heart rate 122/min, respiratory rate 28/min, delayed capillary refill, and urine output 22 mL/hr. Which interpretation is most accurate?",
      [
        "Perfusion may still be inadequate even though the systolic blood pressure is close to 100 mm Hg",
        "Shock is resolving because hypotension is not yet severe",
        "The findings point first to anxiety because tachypnea is present",
        "The urine output is acceptable if the client has not had oral fluids",
      ],
      0,
      "Early and progressive shock are recognized by cue clusters. Blood pressure can be a late sign, and urine output below 30 mL/hr is concerning."
    ),
    mc(
      "A client with suspected internal bleeding is restless and asks repeatedly to sit up. Which additional finding is the strongest cue that the restlessness is related to worsening perfusion?",
      [
        "Narrowing pulse pressure with new dizziness when standing",
        "Incisional pain that improves after splinting",
        "A single oral temperature of 99.1 F",
        "Anxious affect after a family phone call",
      ],
      0,
      "Narrowing pulse pressure and orthostatic symptoms fit hypovolemia and poor perfusion. Pain, mild temperature change, and anxiety can coexist but do not explain the perfusion pattern as strongly."
    ),
    ma(
      "Which assessment cues are most consistent with early or progressive shock? Select all that apply.",
      [
        "New restlessness or change in level of consciousness",
        "Urine output below 30 mL/hr",
        "Cool, pale, or mottled skin",
        "Heart rate returning from 118/min to 84/min with improved mentation",
        "Narrowing pulse pressure or orthostatic blood pressure change",
        "Client asking a relevant question about the care plan",
      ],
      [0, 1, 2, 4],
      "Mental status change, falling urine output, skin changes, and pulse pressure or orthostatic changes are course-linked shock cues. Improved mentation and heart rate are reassuring trends."
    ),
  ]),
  set(1, "Nursing diagnosis", [
    mc(
      "A client with a new stroke cannot bathe or transfer without help because of left-sided weakness. Which nursing diagnosis is written most appropriately?",
      [
        "Impaired physical mobility related to left-sided weakness as evidenced by inability to transfer without assistance",
        "Cerebrovascular accident related to impaired mobility as evidenced by weakness",
        "Needs help with activities because the client is old and weak",
        "Risk for stroke related to hemiparesis as evidenced by impaired mobility",
      ],
      0,
      "A nursing diagnosis describes the human response and is supported by assessment cues. The medical diagnosis alone is not the nursing problem."
    ),
    mc(
      "The nurse is revising a care plan for a client with pneumonia who has SpO2 88% on room air, crackles, and dyspnea with minimal activity. Which problem should receive the highest priority?",
      [
        "Impaired gas exchange",
        "Deficient knowledge about antibiotic scheduling",
        "Risk for loneliness during hospitalization",
        "Readiness for enhanced nutrition",
      ],
      0,
      "Oxygenation is the priority physiologic problem. Teaching and psychosocial needs remain important after the immediate gas exchange threat is addressed."
    ),
    mc(
      "Which outcome best matches the nursing diagnosis ineffective airway clearance for a client with pneumonia?",
      [
        "Client will expectorate secretions and maintain SpO2 at or above the ordered goal within the shift",
        "Client will maintain SpO2 at or above the ordered goal while ambulating in the hall before discharge",
        "Client will remain afebrile for 24 hours after starting antibiotic therapy",
        "Client will report dyspnea no greater than 2/10 during morning care within 48 hours",
      ],
      0,
      "The best outcome for ineffective airway clearance must show that secretions are moving and the airway is staying open. Expectorating secretions directly measures cough effectiveness, and maintaining SpO2 at the ordered goal shows the airway problem is not impairing oxygenation during the shift. Maintaining SpO2 while ambulating is a strong pneumonia outcome, but it matches activity tolerance or gas exchange more than secretion clearance. Being afebrile after antibiotics measures infection response, not airway clearance. Lower dyspnea during morning care is measurable and relevant, but it does not prove the client can clear mucus. Test cue: match outcomes to the exact nursing diagnosis; for airway clearance, look for cough effectiveness, sputum movement, breath sounds, work of breathing, and oxygenation."
    ),
    ma(
      "Which statements reflect accurate use of nursing diagnosis in NURS401 clinical judgment? Select all that apply.",
      [
        "It focuses on the client's response to a health condition.",
        "It should be supported by subjective and objective cues.",
        "It can guide measurable nursing outcomes and interventions.",
        "It replaces the medical diagnosis when communicating with providers.",
        "It may use a problem, related factor, and evidence format when appropriate.",
        "It should be selected before assessment so the nurse can collect matching cues.",
      ],
      [0, 1, 2, 4],
      "Nursing diagnoses organize the nursing response to assessment data. They do not replace medical diagnoses, and they should not be based only on a label."
    ),
  ]),
  set(1, "Hypovolemic shock", [
    mc(
      "A client vomits a large amount of bright red blood. The client is pale and anxious, heart rate is 132/min, BP is 104/66, and urine output for the last hour is 20 mL. Which conclusion should the nurse draw?",
      [
        "The client may be in early hypovolemic shock despite the blood pressure not being profoundly low",
        "The client is compensating adequately because the systolic blood pressure remains above 100 mm Hg",
        "The findings most strongly suggest pain-related tachycardia after gastrointestinal irritation",
        "The priority concern is third spacing from inflammation rather than intravascular volume loss",
      ],
      0,
      "Tachycardia, anxiety, pallor, active blood loss, and low urine output point to volume loss. Hypotension may occur late."
    ),
    mc(
      "The nurse suspects hypovolemic shock in a client with severe diarrhea. Which prescription should the nurse anticipate as the most direct initial treatment for the underlying problem?",
      [
        "Rapid infusion of an isotonic crystalloid solution through a patent IV access",
        "Fluid restriction until serum sodium returns to normal",
        "High-dose diuretic therapy to protect the lungs",
        "A beta blocker to slow the compensatory tachycardia",
      ],
      0,
      "Hypovolemic shock is caused by low circulating volume, so isotonic volume replacement addresses the cause. Slowing compensation or restricting fluid would worsen perfusion."
    ),
    mc(
      "Which assessment finding best helps differentiate hypovolemic shock from cardiogenic shock?",
      [
        "Flat neck veins and dry mucous membranes after several days of vomiting",
        "Crackles, jugular venous distention, and new S3 after myocardial infarction",
        "Warm dry extremities with bradycardia after cervical spinal cord injury",
        "Wheezing and urticaria after IV antibiotic administration",
      ],
      0,
      "Flat neck veins and dry mucous membranes fit volume depletion. The other choices point to cardiogenic, neurogenic, or anaphylactic shock."
    ),
    ma(
      "Which findings support hypovolemic shock from fluid or blood loss? Select all that apply.",
      [
        "Orthostatic dizziness after several days of vomiting",
        "Tachycardia with cool, clammy skin",
        "Urine output 15 mL/hr",
        "Bounding pulses with jugular venous distention",
        "Narrowing pulse pressure",
        "Warm dry skin with bradycardia after a spinal cord injury",
      ],
      [0, 1, 2, 4],
      "Volume loss commonly produces orthostasis, tachycardia, cool skin, low urine output, and narrowing pulse pressure. JVD and bounding pulses suggest excess volume, and bradycardia with warm dry skin suggests neurogenic shock."
    ),
  ]),
  set(1, "Cardiogenic shock", [
    mc(
      "A client with an acute myocardial infarction develops BP 84/50, heart rate 118/min, cool clammy skin, crackles, and jugular venous distention. Which type of shock is most likely?",
      [
        "Cardiogenic shock",
        "Hypovolemic shock",
        "Neurogenic shock",
        "Anaphylactic shock",
      ],
      0,
      "The cue cluster after MI suggests pump failure with backward fluid effects. Crackles and JVD make simple volume loss less likely."
    ),
    mc(
      "A client with suspected cardiogenic shock has increasing crackles and oxygen needs. Which provider prescription would the nurse question if no additional assessment data support it?",
      [
        "Infuse 1 L normal saline as fast as possible",
        "Obtain a 12-lead ECG and serum cardiac markers",
        "Administer oxygen to maintain the ordered saturation goal",
        "Start a vasoactive medication using an infusion pump",
      ],
      0,
      "Large rapid fluid boluses can worsen pulmonary congestion in cardiogenic shock. The other prescriptions fit assessment and support of oxygenation and perfusion."
    ),
    mc(
      "The provider prescribes dobutamine for a client in cardiogenic shock. Which response best reflects the intended effect?",
      [
        "Improved cardiac contractility with increased urine output",
        "Reduced platelet aggregation in the coronary arteries",
        "Decreased bronchospasm from beta-2 stimulation",
        "Increased sedation to reduce oxygen demand",
      ],
      0,
      "Positive inotropes are used to improve contractility and cardiac output. Improved urine output is a meaningful perfusion response."
    ),
    ma(
      "Which findings are most concerning for cardiogenic shock after myocardial infarction? Select all that apply.",
      [
        "New crackles and worsening dyspnea",
        "Jugular venous distention",
        "Cool, clammy skin and altered mental status",
        "Urine output below 30 mL/hr",
        "Warm dry skin with heart rate 48/min after spinal trauma",
        "Diffuse hives and throat tightness after eating shellfish",
      ],
      [0, 1, 2, 3],
      "Cardiogenic shock causes poor forward flow and may cause pulmonary congestion. Neurogenic and anaphylactic patterns are different shock states."
    ),
  ]),
  set(1, "Obstructive shock", [
    mc(
      "A client with chest trauma suddenly becomes severely dyspneic. The nurse notes absent breath sounds on the left, tracheal deviation to the right, heart rate 138/min, and BP 76/44. Which mechanism best explains the shock state?",
      [
        "Pressure in the chest is obstructing venous return and cardiac filling",
        "Loss of intravascular volume is reducing preload",
        "The myocardium is unable to contract after infarction",
        "Systemic vasodilation from loss of sympathetic tone is lowering afterload",
      ],
      0,
      "Tension pneumothorax is obstructive shock because pressure blocks venous return and cardiac output."
    ),
    mc(
      "Which action is the nurse's priority for the client with suspected tension pneumothorax and signs of shock?",
      [
        "Call rapid response, apply oxygen, and prepare for emergency decompression",
        "Place the client flat and encourage slow breathing until the anxiety passes",
        "Delay notification until a chest x-ray confirms the diagnosis",
        "Administer oral fluids to increase preload",
      ],
      0,
      "A tension pneumothorax with shock is an emergency. Treatment should not wait for routine confirmation when the client is unstable."
    ),
    mc(
      "Which client is at greatest risk for obstructive shock?",
      [
        "Client with sudden dyspnea, pleuritic chest pain, syncope, and suspected pulmonary embolism",
        "Client with vomiting and diarrhea for 3 days",
        "Client with sepsis and warm flushed skin",
        "Client with spinal cord injury and bradycardia",
      ],
      0,
      "A pulmonary embolism can obstruct pulmonary blood flow and impair cardiac output. The other options suggest hypovolemic, septic, or neurogenic shock."
    ),
    ma(
      "Which conditions or findings are associated with obstructive shock? Select all that apply.",
      [
        "Tension pneumothorax with tracheal deviation",
        "Cardiac tamponade with muffled heart sounds and jugular venous distention",
        "Pulmonary embolism with sudden dyspnea and hypotension",
        "Hemorrhage from a gastrointestinal bleed",
        "Severe myocardial infarction with pulmonary edema",
        "High cervical spinal cord injury with warm dry skin",
      ],
      [0, 1, 2],
      "Obstructive shock results from blocked forward flow or filling. Bleeding, pump failure, and sympathetic loss describe different shock mechanisms."
    ),
  ]),
  set(1, "Septic shock", [
    mc(
      "An older adult admitted from a long-term care facility for a urinary tract infection becomes newly confused. Temperature is 96.2 F, heart rate 116/min, respiratory rate 26/min, BP 88/52, and skin is mottled. Which concern is most urgent?",
      [
        "Sepsis with progression toward septic shock",
        "Delirium from sleep disruption that should be reassessed after reorientation",
        "Uncomplicated urinary tract infection with expected fever response",
        "Hypovolemia from poor intake without evidence of systemic infection",
      ],
      0,
      "Sepsis can present with low temperature, altered mental status, tachycardia, tachypnea, hypotension, and mottled skin, especially in older adults."
    ),
    mc(
      "Blood cultures and IV antibiotics are prescribed for a client with suspected sepsis. What should the nurse do?",
      [
        "Obtain the ordered cultures promptly, then start antibiotics without avoidable delay",
        "Start antibiotics after the fever reaches 101 F",
        "Wait for the final culture report before giving antibiotics",
        "Give antipyretics first because fever control is the priority",
      ],
      0,
      "Cultures are obtained before antibiotics when ordered and feasible, but antibiotics should not be delayed unnecessarily in suspected sepsis."
    ),
    mc(
      "A client with septic shock has received fluids and antibiotics. Which finding indicates the need for immediate follow-up?",
      [
        "MAP remains 58 mm Hg and urine output is 12 mL/hr",
        "Temperature decreases from 102.4 F to 100.8 F",
        "The client asks why blood cultures were collected",
        "White blood cell count is pending from the laboratory",
      ],
      0,
      "Persistent MAP below 65 and low urine output indicate inadequate perfusion despite treatment."
    ),
    ma(
      "Which findings or histories increase concern for sepsis or septic shock? Select all that apply.",
      [
        "Altered mental status in a client with suspected infection",
        "Respiratory rate greater than 20/min with hypotension",
        "Immunosuppression after transplant",
        "Mottled skin and urine output below 30 mL/hr",
        "Stable vital signs with improving appetite after antibiotics",
        "Localized IV-site redness with normal vital signs and normal mentation",
      ],
      [0, 1, 2, 3],
      "Mental status change, tachypnea, hypotension, immunosuppression, mottling, and oliguria are relevant sepsis risk and perfusion cues."
    ),
  ]),
  set(1, "Anaphylactic shock", [
    mc(
      "Ten minutes after receiving IV cefazolin, a client reports throat tightness and chest tightness. The nurse notes wheezing, hives, and BP 82/48. Which action is the priority?",
      [
        "Administer epinephrine as prescribed and call for emergency assistance",
        "Stop the cefazolin infusion and wait for hives to improve before escalating",
        "Administer diphenhydramine first because the hives started before the hypotension",
        "Place the client supine and prepare allergy teaching after the blood pressure improves",
      ],
      0,
      "Airway and circulatory symptoms after allergen exposure indicate anaphylaxis. Epinephrine is the priority medication."
    ),
    mc(
      "Which finding most strongly suggests anaphylaxis rather than a mild allergic reaction?",
      [
        "Hoarseness and stridor after eating peanuts",
        "Localized itching under an adhesive dressing",
        "Small rash on the forearm without respiratory symptoms",
        "Sneezing after dust exposure with normal breath sounds",
      ],
      0,
      "Hoarseness and stridor suggest airway edema. Localized skin findings alone are less immediately threatening."
    ),
    mc(
      "A client treated for anaphylaxis says, 'I feel better now.' Which finding would still require urgent follow-up?",
      [
        "Recurrent wheezing and BP 88/50",
        "Mild fatigue after the emergency response",
        "Asking whether the allergen will be listed in the chart",
        "Heart rate decreasing from 122/min to 96/min",
      ],
      0,
      "Recurrent airway and hypotension signs suggest ongoing or biphasic anaphylaxis and require immediate action."
    ),
    ma(
      "Which cues are concerning for anaphylactic shock? Select all that apply.",
      [
        "Urticaria with throat fullness",
        "Wheezing or stridor after medication exposure",
        "Hypotension with flushing",
        "Anxiety and lightheadedness after a known allergen exposure",
        "Isolated nausea that resolves after eating crackers",
        "Warm dry skin with bradycardia after spinal cord injury",
      ],
      [0, 1, 2, 3],
      "Anaphylaxis combines allergic skin or mucosal findings with airway, breathing, and circulation threats. Neurogenic shock has a different pattern."
    ),
  ]),
  set(1, "Neurogenic shock", [
    mc(
      "A client with a C5 spinal cord injury has BP 78/46, heart rate 48/min, and warm dry extremities. Which shock pattern is most consistent with these findings?",
      [
        "Neurogenic shock",
        "Hypovolemic shock",
        "Cardiogenic shock",
        "Anaphylactic shock",
      ],
      0,
      "Loss of sympathetic tone after high spinal cord injury can cause vasodilation, hypotension, bradycardia, and warm dry skin."
    ),
    mc(
      "The nurse is caring for a client with suspected neurogenic shock after a high thoracic spinal cord injury. Which action is most appropriate?",
      [
        "Maintain spinal precautions, support oxygenation, and notify the rapid response or provider team",
        "Remove spinal precautions to improve chest expansion before reassessing vital signs",
        "Give oral fluids and delay notification until the bradycardia resolves",
        "Trend blood pressure only after CT confirms the level of spinal injury",
      ],
      0,
      "The unstable client needs spinal protection, airway and perfusion support, and urgent team response."
    ),
    mc(
      "Which finding helps distinguish neurogenic shock from hypovolemic shock?",
      [
        "Bradycardia with warm dry skin",
        "Tachycardia with cool clammy skin",
        "Narrowing pulse pressure after vomiting",
        "Low urine output after hemorrhage",
      ],
      0,
      "Neurogenic shock may cause bradycardia and warm dry skin from loss of sympathetic tone. Hypovolemia usually triggers tachycardia and vasoconstriction."
    ),
    ma(
      "Which statements about neurogenic shock are accurate? Select all that apply.",
      [
        "It can follow high cervical or thoracic spinal cord injury.",
        "It involves loss of sympathetic vascular tone.",
        "Bradycardia can occur instead of compensatory tachycardia.",
        "Warm dry extremities may be present.",
        "It is the same condition as autonomic dysreflexia.",
        "It is caused by antigen-antibody mediated capillary leak.",
      ],
      [0, 1, 2, 3],
      "Neurogenic shock is a distributive shock state caused by sympathetic interruption. It is not the same as autonomic dysreflexia and is not anaphylaxis."
    ),
  ]),
  set(1, "Shock evaluation", [
    mc(
      "A client is receiving treatment for early hypovolemic shock. Which finding best indicates that treatment is improving tissue perfusion?",
      [
        "Urine output increases from 18 mL/hr to 42 mL/hr and the client is more alert",
        "The client reports thirst after IV fluids begin",
        "Heart rate remains 128/min with cool extremities",
        "Respiratory rate increases from 24/min to 32/min",
      ],
      0,
      "Improved urine output and mental status indicate better renal and cerebral perfusion."
    ),
    mc(
      "Which trend is most concerning in a client being treated for shock?",
      [
        "Lactate rising and urine output falling despite fluid resuscitation",
        "Capillary refill improving from 5 seconds to 2 seconds",
        "Heart rate decreasing from 124/min to 92/min",
        "Skin becoming warmer with stronger peripheral pulses",
      ],
      0,
      "Rising lactate and declining urine output suggest persistent tissue hypoxia. The other trends suggest improving perfusion."
    ),
    mc(
      "The nurse is evaluating a client after an intervention for shock. Which assessment is most useful for determining end-organ perfusion at the bedside?",
      [
        "Hourly urine output and mental status",
        "Pain score before and after repositioning",
        "Date of the last influenza vaccine",
        "Number of visitors at the bedside",
      ],
      0,
      "Urine output and mental status are practical bedside indicators of renal and cerebral perfusion."
    ),
    ma(
      "Which findings suggest improved response to treatment for early shock? Select all that apply.",
      [
        "Urine output rises above 30 mL/hr",
        "Client becomes oriented after being restless",
        "MAP improves to at least 65 mm Hg when that is the ordered goal",
        "Peripheral pulses become stronger",
        "Skin becomes increasingly mottled and cool",
        "Respiratory rate rises with worsening lethargy",
      ],
      [0, 1, 2, 3],
      "Improving urine output, mentation, MAP, and pulses support improved perfusion. Mottling and worsening respiratory or mental status suggest deterioration."
    ),
  ]),
  set(1, "Rapid response", [
    mc(
      "A client being monitored for possible sepsis becomes difficult to arouse. BP is 82/48, heart rate 132/min, respiratory rate 30/min, and SpO2 is 88% on 4 L/min nasal cannula. What should the nurse do first?",
      [
        "Activate rapid response while staying with the client and supporting airway and breathing",
        "Wait for the provider to round because the client is already being monitored",
        "Document the vital signs and reassess in 1 hour",
        "Ask the family whether the client usually sleeps deeply",
      ],
      0,
      "This client is unstable with airway, breathing, and perfusion threats. Escalation should be immediate."
    ),
    mc(
      "Which statement is the clearest rapid response communication?",
      [
        "This is William, RN on 4 East. My client in 412 is newly confused, BP 82/48, RR 30, SpO2 88% on 4 L, and I need the team at bedside now.",
        "I am worried about my client and need someone to check on them when available.",
        "The client has several abnormal things, but I am not sure what is happening.",
        "Can you look at the chart and tell me whether this is normal?",
      ],
      0,
      "Emergency communication should identify the caller and client, state the situation, give key assessment data, and make a clear request."
    ),
    mc(
      "A nurse is unsure whether a client's new tachycardia and confusion represent deterioration. Which action fits the course guidance?",
      [
        "Ask another nurse for an immediate second assessment and escalate if concern persists",
        "Ignore the change until blood pressure is severely low",
        "Assume the client is anxious unless the provider says otherwise",
        "Wait until the end of shift so the next nurse can compare trends",
      ],
      0,
      "The course emphasizes trusting assessment concerns, getting a second opinion, and escalating early."
    ),
    ma(
      "Which situations justify urgent escalation or rapid response activation? Select all that apply.",
      [
        "New decreased level of consciousness with hypotension",
        "Stridor with inability to speak full sentences",
        "SpO2 falling despite increasing oxygen support",
        "Urine output below 30 mL/hr with tachycardia and cool skin",
        "Postoperative pain rated 7/10 with stable vital signs and intact distal circulation",
        "SpO2 91% on baseline oxygen in a client with COPD who is speaking comfortably",
      ],
      [0, 1, 2, 3],
      "Airway, breathing, circulation, mental status, and perfusion deterioration should be escalated promptly."
    ),
  ]),
  set(1, "Ventilation-perfusion mismatch", [
    mc(
      "A client with pneumonia has alveoli filled with inflammatory fluid and cellular debris. Which problem is the nurse primarily monitoring?",
      [
        "Impaired oxygen movement into pulmonary capillary blood",
        "Air trapping from narrowed bronchi during exhalation",
        "Excess ventilation compared with perfusion from a pulmonary embolus",
        "Pleural fluid compressing the lower lobe from outside the lung",
      ],
      0,
      "Pneumonia causes consolidation that impairs gas exchange across affected alveoli."
    ),
    mc(
      "A client with a pulmonary embolism suddenly becomes dyspneic and hypoxemic. Which explanation best fits the V/Q problem?",
      [
        "Ventilation may reach alveoli, but perfusion is blocked by a clot",
        "Perfusion is normal, but the airway is completely obstructed by mucus",
        "Fluid in the pleural space is preventing lung expansion",
        "The problem is increased hemoglobin binding from carbon monoxide",
      ],
      0,
      "A pulmonary embolism blocks blood flow to ventilated lung regions, creating a major V/Q mismatch."
    ),
    mc(
      "Which client finding best reflects worsening oxygenation rather than only ventilation effort?",
      [
        "SpO2 decreases from 94% to 86% with increasing confusion",
        "Respiratory rate rises after walking but SpO2 remains 96%",
        "Client reports mild chest soreness after coughing",
        "Client asks for help repositioning in bed",
      ],
      0,
      "Falling SpO2 with mental status change suggests inadequate oxygen delivery. Increased work after activity may be expected if oxygenation remains stable."
    ),
    ma(
      "Which conditions from the course can create clinically important V/Q mismatch or impaired gas exchange? Select all that apply.",
      [
        "Pneumonia with alveolar consolidation",
        "Pulmonary embolism",
        "Atelectasis after shallow postoperative breathing",
        "Pulmonary edema",
        "Uncomplicated rib pain with symmetric chest expansion and clear lung sounds",
        "Anemia with fatigue but normal breath sounds and oxygen saturation",
      ],
      [0, 1, 2, 3],
      "Pneumonia, PE, atelectasis, and pulmonary edema all threaten ventilation, perfusion, or diffusion."
    ),
  ]),
  set(1, "Pediatric shock compensation", [
    mc(
      "A 4-year-old with vomiting and diarrhea is lethargic. Heart rate is 156/min, capillary refill is 5 seconds, extremities are cool, and BP is 92/60. Which interpretation is best?",
      [
        "The child may be in compensated shock even though blood pressure is not yet low",
        "The child has moderate dehydration but no shock risk until systolic blood pressure falls",
        "The findings are most consistent with fever-related tachycardia if the child has been crying",
        "The priority is oral rehydration teaching because children compensate with tachycardia",
      ],
      0,
      "Children can maintain blood pressure until late decompensation. Tachycardia, lethargy, delayed refill, and cool extremities are serious perfusion cues."
    ),
    mc(
      "Which pediatric finding is most concerning for decompensated shock?",
      [
        "Hypotension with weak pulses and altered mental status",
        "Tachycardia with fever that improves after antipyretic therapy and oral fluids",
        "Dry mucous membranes with normal mentation, brisk capillary refill, and urine output",
        "Crying during an IV start with warm extremities and strong peripheral pulses",
      ],
      0,
      "Hypotension in children is a late and dangerous shock sign, especially with weak pulses and altered mental status."
    ),
    mc(
      "The nurse is assessing a child at risk for shock. Which assessment trend should be reported immediately?",
      [
        "Heart rate rising, capillary refill lengthening, and urine output falling",
        "Temperature returning to normal after antipyretic therapy",
        "Child becoming more interactive after oral rehydration",
        "Respiratory rate decreasing to the expected range",
      ],
      0,
      "Worsening heart rate, capillary refill, and urine output suggest declining perfusion."
    ),
    ma(
      "Which statements about pediatric shock are accurate? Select all that apply.",
      [
        "Tachycardia can be an early compensatory finding.",
        "Hypotension is often a late sign.",
        "Mental status and urine output are important perfusion cues.",
        "Normal blood pressure rules out shock in a child.",
        "Delayed capillary refill is concerning in context.",
        "Children always become bradycardic before decompensation.",
      ],
      [0, 1, 2, 4],
      "Pediatric compensation can hide severe perfusion problems until late. Blood pressure alone is not enough."
    ),
  ]),
  set(1, "Positive inotropes", [
    mc(
      "A client in cardiogenic shock is prescribed a positive inotrope. Which effect is the nurse expecting?",
      [
        "Increased strength of myocardial contraction",
        "Decreased intravascular volume",
        "Inhibition of histamine release",
        "Neutralization of serum potassium",
      ],
      0,
      "Positive inotropes improve contractility, which can improve cardiac output when pump failure is the issue."
    ),
    mc(
      "Which assessment is most important while a client receives a dobutamine infusion?",
      [
        "Heart rhythm, blood pressure, urine output, and IV site patency",
        "Daily weight, lung sounds, and peripheral edema every morning",
        "Pain score, anxiety level, and oxygen saturation every shift",
        "Blood pressure before the infusion and urine output at the end of the shift",
      ],
      0,
      "Inotropes can affect rhythm and blood pressure and require close perfusion and IV monitoring."
    ),
    mc(
      "Which finding would best suggest that a positive inotrope is helping a client in low-output shock?",
      [
        "MAP improves and urine output rises to 38 mL/hr",
        "Client becomes more tachycardic with new chest pain",
        "Crackles worsen and SpO2 drops",
        "Urine output falls from 30 mL/hr to 12 mL/hr",
      ],
      0,
      "Improved MAP and urine output suggest better perfusion. New chest pain, worsening oxygenation, or falling urine output require follow-up."
    ),
    ma(
      "Which nursing considerations are appropriate for a client receiving a vasoactive or inotropic infusion for shock? Select all that apply.",
      [
        "Use an infusion pump and follow high-alert medication policy.",
        "Trend blood pressure, rhythm, mental status, and urine output.",
        "Assess IV access and the site for complications.",
        "Evaluate whether perfusion goals are improving.",
        "Stop monitoring once the first blood pressure improves.",
        "Give the medication by rapid IV push to speed the effect.",
      ],
      [0, 1, 2, 3],
      "Vasoactive and inotropic infusions require careful pump use, monitoring, access assessment, and outcome evaluation."
    ),
  ]),
  set(2, "Isotonic fluids", [
    mc(
      "A client has vomiting, diarrhea, dry mucous membranes, heart rate 118/min, and orthostatic dizziness. Which IV fluid type should the nurse expect for initial intravascular volume support?",
      [
        "Isotonic crystalloid",
        "Hypotonic solution as a rapid bolus",
        "Hypertonic saline to pull water into the vascular space",
        "Dextrose 5% in water to replace free water losses rapidly",
      ],
      0,
      "Isotonic fluids expand extracellular and intravascular volume and are commonly used for volume deficit."
    ),
    mc(
      "A client is receiving isotonic fluids for hypovolemia. Which assessment finding most directly indicates the fluid is achieving the intended effect?",
      [
        "Heart rate decreases and urine output increases",
        "Serum sodium falls rapidly below 120 mEq/L",
        "New crackles and jugular venous distention develop",
        "Peripheral edema increases from 1+ to 3+",
      ],
      0,
      "Improved heart rate and urine output suggest improved volume and perfusion. Crackles, JVD, and edema suggest excess."
    ),
    mc(
      "Which client requires the closest monitoring for fluid overload while receiving isotonic IV fluids?",
      [
        "Client with heart failure and chronic kidney disease",
        "Older adult receiving maintenance fluids after pneumonia with stable creatinine",
        "Client with cirrhosis and mild ascites receiving a small medication flush",
        "Young adult with vomiting for 12 hours, dry mucous membranes, and normal renal function",
      ],
      0,
      "Heart failure and kidney disease reduce the ability to tolerate or excrete extra fluid."
    ),
    ma(
      "Which nursing assessments are important during isotonic fluid therapy? Select all that apply.",
      [
        "Lung sounds and work of breathing",
        "Intake and output",
        "Daily weight when trending fluid status",
        "IV site patency and signs of infiltration",
        "Ignoring urine output if blood pressure is normal",
        "Replacing potassium by IV push if the level is low",
      ],
      [0, 1, 2, 3],
      "Fluid therapy requires monitoring for response, overload, and IV complications. Normal blood pressure alone does not rule out poor perfusion."
    ),
  ]),
  set(2, "Fluid volume excess", [
    mc(
      "A client with heart failure receiving IV fluids develops dyspnea, crackles, jugular venous distention, and a 2.2-lb weight gain in 24 hours. Which problem is most likely?",
      [
        "Fluid volume excess",
        "Hypovolemic shock",
        "Pneumonia-related impaired gas exchange",
        "Pleural effusion from inflammatory fluid in the pleural space",
      ],
      0,
      "Crackles, JVD, dyspnea, and rapid weight gain indicate excess volume."
    ),
    mc(
      "Which assessment is the most sensitive bedside measure for trending fluid status from day to day?",
      [
        "Daily weight measured consistently",
        "Single blood pressure reading",
        "Intake and output total from the previous shift",
        "Presence or absence of dependent edema",
      ],
      0,
      "The course highlights daily weight as a sensitive measure of fluid change when measured consistently."
    ),
    mc(
      "The nurse is concerned that a client is developing fluid overload. Which action is most appropriate?",
      [
        "Raise the head of the bed, assess oxygenation and lung sounds, and notify the provider about the change",
        "Encourage rapid oral fluids to dilute secretions",
        "Clamp the urinary catheter to measure output later",
        "Place the client flat to increase venous return",
      ],
      0,
      "Dyspnea and crackles require immediate respiratory assessment, positioning, and communication. More fluid or lying flat may worsen symptoms."
    ),
    ma(
      "Which findings are consistent with fluid volume excess? Select all that apply.",
      [
        "Jugular venous distention",
        "Pulmonary crackles",
        "Dependent edema",
        "Bounding pulses or elevated blood pressure",
        "Dry mucous membranes and orthostatic hypotension",
        "Scant concentrated urine after diarrhea",
      ],
      [0, 1, 2, 3],
      "JVD, crackles, edema, bounding pulses, and hypertension fit excess volume. Dry mucosa, orthostasis, and concentrated urine suggest deficit."
    ),
  ]),
  set(2, "Hyperkalemia", [
    mc(
      "A client with end-stage kidney disease has potassium 6.7 mEq/L and peaked T waves. Which prescription should the nurse implement first if all are available?",
      [
        "Administer IV calcium gluconate as prescribed",
        "Administer sodium polystyrene sulfonate after lunch",
        "Teach the client to avoid bananas before discharge",
        "Recheck the potassium level tomorrow morning",
      ],
      0,
      "This is severe hyperkalemia with cardiac involvement. Peaked T waves mean the myocardium is electrically unstable, so IV calcium gluconate is the first priority because it stabilizes the cardiac cell membrane. It does not remove potassium, but it buys time while other therapies work. Sodium polystyrene sulfonate removes potassium more slowly, so it is not first when ECG changes are present. Diet teaching matters for prevention, not emergency treatment. Rechecking tomorrow delays care for a potentially fatal dysrhythmia. Test cue: hyperkalemia management order is stabilize the heart, shift potassium into cells, then remove potassium."
    ),
    mc(
      "Which statement by a new nurse requires correction?",
      [
        "Potassium chloride can be given by rapid IV push in severe hypokalemia.",
        "Hyperkalemia can cause life-threatening dysrhythmias.",
        "Insulin with glucose can shift potassium into cells.",
        "A hemolyzed specimen can falsely elevate potassium.",
      ],
      0,
      "Potassium is never given by IV push. Rapid bolus potassium can stop the heart."
    ),
    mc(
      "Which client has the greatest risk for hyperkalemia?",
      [
        "Client with acute kidney injury taking an ACE inhibitor",
        "Client with vomiting and nasogastric suction",
        "Client using a loop diuretic with poor intake",
        "Client hyperventilating during a panic attack",
      ],
      0,
      "Kidney injury and medications that reduce potassium excretion increase hyperkalemia risk. GI losses and many diuretics tend to lower potassium."
    ),
    ma(
      "Which findings or interventions are related to hyperkalemia management? Select all that apply.",
      [
        "Peaked T waves or widening QRS",
        "IV calcium to stabilize the myocardium when indicated",
        "Insulin with glucose to shift potassium into cells",
        "Dialysis or other measures to remove potassium",
        "Rapid IV push potassium replacement",
        "Oral dietary potassium replacement during ECG changes",
      ],
      [0, 1, 2, 3],
      "Hyperkalemia is managed by stabilizing the heart, shifting potassium into cells, and removing potassium. IV push potassium is unsafe."
    ),
  ]),
  set(2, "Hypokalemia", [
    mc(
      "A client taking furosemide reports muscle weakness. Potassium is 2.8 mEq/L and the ECG shows U waves. What is the nurse's priority concern?",
      [
        "Risk for dysrhythmia from hypokalemia",
        "Expected loop diuretic effect that should be trended with the next morning labs",
        "Volume depletion causing tachycardia as the only priority",
        "Hypomagnesemia as the sole explanation for the ECG changes",
      ],
      0,
      "Low potassium can cause muscle weakness and dangerous rhythm changes."
    ),
    mc(
      "A client has hypokalemia that barely improves after two potassium replacement doses. Magnesium is also low. Which interpretation is best?",
      [
        "Low magnesium can make hypokalemia difficult to correct",
        "The potassium result is likely a lab error if magnesium is low",
        "Magnesium replacement should wait until potassium is normal",
        "The potassium level is safe if the client has no palpitations",
      ],
      0,
      "The course emphasizes that magnesium depletion can drive renal potassium wasting and refractory hypokalemia."
    ),
    mc(
      "Which history most strongly explains hypokalemia?",
      [
        "Several days of vomiting plus a loop diuretic",
        "End-stage kidney disease with missed dialysis",
        "Tumor lysis after chemotherapy",
        "ACE inhibitor use with potassium-sparing diuretic",
      ],
      0,
      "Vomiting and loop diuretics are common potassium loss mechanisms. The other histories fit hyperkalemia risk."
    ),
    ma(
      "Which findings or risks are associated with hypokalemia? Select all that apply.",
      [
        "Muscle weakness or cramps",
        "U waves or dysrhythmias",
        "GI losses such as vomiting or diarrhea",
        "Loop or thiazide diuretic therapy",
        "Peaked T waves from excess potassium",
        "Kidney failure with inability to excrete potassium",
      ],
      [0, 1, 2, 3],
      "Hypokalemia commonly causes weakness and rhythm changes and can result from GI or renal losses. Peaked T waves and kidney failure point toward hyperkalemia."
    ),
  ]),
  set(2, "Hyponatremia", [
    mc(
      "A client with serum sodium 118 mEq/L has headache, confusion, and a new seizure. Which explanation best fits the neurologic findings?",
      [
        "Water is moving into brain cells, causing cerebral edema",
        "Brain cells are shrinking from water loss",
        "Serum potassium is moving into cells too quickly",
        "Bicarbonate retention is suppressing respirations",
      ],
      0,
      "Severe hyponatremia is primarily a water problem; low serum osmolality pulls water into brain cells."
    ),
    mc(
      "A symptomatic client with severe hyponatremia is prescribed hypertonic saline. Which nursing concern is most important?",
      [
        "Correcting sodium at a controlled rate to avoid neurologic injury",
        "Infusing the solution rapidly until thirst resolves",
        "Encouraging unlimited free water intake",
        "Holding seizure precautions until sodium is normal",
      ],
      0,
      "Severe sodium disorders require careful correction. Rapid overcorrection of hyponatremia can cause serious neurologic injury."
    ),
    mc(
      "Which situation most strongly increases risk for dilutional hyponatremia?",
      [
        "SIADH with excess water retention",
        "Poor water access during a heat wave",
        "Diabetes insipidus with large free-water losses",
        "Hypertonic saline infusion for traumatic brain injury",
      ],
      0,
      "SIADH causes water retention relative to sodium. Water loss patterns are more consistent with hypernatremia."
    ),
    ma(
      "Which findings or principles are associated with hyponatremia? Select all that apply.",
      [
        "Confusion, headache, or seizures",
        "Water excess relative to sodium",
        "Need for careful correction rate",
        "Risk of cerebral edema when severe",
        "Brain cell shrinkage from water deficit",
        "Correction as rapidly as possible once neurologic symptoms appear",
      ],
      [0, 1, 2, 3],
      "Hyponatremia is usually a water-balance problem and threatens the brain. Brain cell shrinkage is more consistent with hypernatremia."
    ),
  ]),
  set(2, "Hypernatremia", [
    mc(
      "An older adult with impaired thirst has serum sodium 158 mEq/L, dry mucous membranes, restlessness, and poor skin turgor. Which problem is most likely?",
      [
        "Water deficit relative to sodium",
        "Water excess causing cerebral edema",
        "Potassium excess from renal failure",
        "Calcium deficit after thyroidectomy",
      ],
      0,
      "Hypernatremia usually reflects water deficit relative to sodium, especially with poor access to water or impaired thirst."
    ),
    mc(
      "Which explanation best describes why severe hypernatremia can cause neurologic symptoms?",
      [
        "Water leaves brain cells, causing cellular shrinkage",
        "Water rushes into brain cells, causing swelling",
        "Carbon dioxide crosses into cerebrospinal fluid",
        "Potassium leaves cells and causes peaked T waves",
      ],
      0,
      "High serum sodium pulls water out of cells, including brain cells."
    ),
    mc(
      "A client with hypernatremia is receiving replacement fluid. Which finding requires immediate follow-up?",
      [
        "New headache and confusion during rapid sodium correction",
        "Urine becoming less concentrated over time",
        "Heart rate decreasing toward baseline",
        "Mucous membranes becoming less dry",
      ],
      0,
      "Rapid shifts in sodium and water can injure the brain. New neurologic findings during correction are urgent."
    ),
    ma(
      "Which situations place a client at risk for hypernatremia? Select all that apply.",
      [
        "Inadequate water intake in an older adult with impaired thirst",
        "Diabetes insipidus",
        "Osmotic diuresis with excessive water loss",
        "Prolonged fever with poor intake",
        "SIADH with water retention",
        "Excess hypotonic fluid intake",
      ],
      [0, 1, 2, 3],
      "Hypernatremia commonly follows water loss or inadequate water intake. SIADH and excess hypotonic intake point toward hyponatremia."
    ),
  ]),
  set(2, "Hypercalcemia", [
    mc(
      "A client with metastatic cancer has calcium 12.8 mg/dL, constipation, weakness, lethargy, and shortened QT interval. Which problem should the nurse suspect?",
      [
        "Hypercalcemia",
        "Hypocalcemia",
        "Hypomagnesemia with neuromuscular irritability",
        "Metabolic alkalosis from prolonged vomiting",
      ],
      0,
      "Malignancy and bone breakdown can cause hypercalcemia, which produces GI slowing, weakness, lethargy, and cardiac effects."
    ),
    mc(
      "Which assessment finding is most consistent with worsening hypercalcemia?",
      [
        "Increasing lethargy and new dysrhythmia",
        "Positive Trousseau sign with laryngospasm",
        "Seizure after serum sodium falls to 118 mEq/L",
        "Wheezing after an antibiotic infusion",
      ],
      0,
      "Hypercalcemia can depress neuromuscular function and affect cardiac rhythm. Tetany and laryngospasm suggest hypocalcemia."
    ),
    mc(
      "Which prescription would the nurse anticipate for a client with symptomatic hypercalcemia if not contraindicated?",
      [
        "IV isotonic fluids with close monitoring",
        "Large doses of calcium carbonate",
        "Fluid restriction as the first intervention",
        "IV magnesium sulfate by rapid bolus",
      ],
      0,
      "Hydration supports renal calcium excretion when appropriate. More calcium or fluid restriction can worsen the problem."
    ),
    ma(
      "Which findings or risks are associated with hypercalcemia? Select all that apply.",
      [
        "Malignancy or bone breakdown",
        "Weakness and lethargy",
        "Constipation",
        "Cardiac rhythm changes",
        "Tetany and laryngospasm",
        "Numbness around the mouth after thyroid surgery",
      ],
      [0, 1, 2, 3],
      "Hypercalcemia often causes decreased neuromuscular excitability and GI slowing. Tetany and perioral numbness are more consistent with hypocalcemia."
    ),
  ]),
  set(2, "Hypocalcemia", [
    mc(
      "A client 8 hours after thyroidectomy reports tingling around the mouth and fingertip numbness. The nurse notes a positive Trousseau sign. Which complication is most concerning?",
      [
        "Hypocalcemia from parathyroid disruption",
        "Hypercalcemia from bone resorption",
        "Respiratory acidosis from hypoventilation",
        "Fluid volume excess from IV therapy",
      ],
      0,
      "Post-thyroid or parathyroid surgery can lead to hypocalcemia, causing neuromuscular irritability."
    ),
    mc(
      "Which finding in a client with hypocalcemia requires the most immediate action?",
      [
        "Stridor and laryngospasm",
        "Mild constipation",
        "Increased appetite",
        "Warm flushed skin",
      ],
      0,
      "Laryngospasm is an airway emergency associated with severe hypocalcemia."
    ),
    mc(
      "Which ECG change is most consistent with hypocalcemia?",
      [
        "Prolonged QT interval",
        "Peaked T waves",
        "ST elevation from myocardial injury",
        "Sawtooth atrial flutter waves",
      ],
      0,
      "Hypocalcemia can prolong the QT interval. Peaked T waves are associated with hyperkalemia."
    ),
    ma(
      "Which findings or causes are associated with hypocalcemia? Select all that apply.",
      [
        "Perioral tingling",
        "Muscle cramps or tetany",
        "Positive Chvostek or Trousseau sign",
        "Post-thyroidectomy state",
        "Constipation and lethargy from high calcium",
        "Shortened QT interval",
      ],
      [0, 1, 2, 3],
      "Hypocalcemia increases neuromuscular excitability and can occur after thyroid/parathyroid surgery. Constipation, lethargy, and shortened QT fit hypercalcemia."
    ),
  ]),
  set(2, "Hypermagnesemia", [
    mc(
      "A client with end-stage kidney disease has been taking milk of magnesia daily. The client is somnolent with absent deep tendon reflexes, respiratory rate 8/min, and BP 86/50. Which imbalance is most likely?",
      [
        "Hypermagnesemia",
        "Hypomagnesemia",
        "Hyponatremia",
        "Opioid-related respiratory depression",
      ],
      0,
      "Magnesium intake with impaired renal clearance can cause toxicity with depressed reflexes, hypotension, somnolence, and respiratory depression."
    ),
    mc(
      "Which provider prescription should the nurse anticipate for severe magnesium toxicity?",
      [
        "IV calcium gluconate as an antagonist",
        "Rapid IV magnesium sulfate",
        "High-dose oral magnesium hydroxide",
        "Loop diuretic therapy without respiratory support or ECG monitoring",
      ],
      0,
      "IV calcium is used to antagonize severe magnesium toxicity while the team supports ventilation and removes excess magnesium."
    ),
    mc(
      "Which assessment is most important for a client receiving magnesium-containing therapy who has declining kidney function?",
      [
        "Respiratory rate and deep tendon reflexes",
        "Serum magnesium level and bowel pattern without respiratory assessment",
        "Blood glucose and meal intake before checking reflexes",
        "Blood pressure and edema assessment without neuromuscular checks",
      ],
      0,
      "Respiratory depression and loss of reflexes are key toxicity cues."
    ),
    ma(
      "Which findings are consistent with hypermagnesemia? Select all that apply.",
      [
        "Diminished or absent deep tendon reflexes",
        "Respiratory depression",
        "Hypotension and bradycardia",
        "Somnolence",
        "Hyperactive reflexes and tremor",
        "Torsades risk from low magnesium",
      ],
      [0, 1, 2, 3],
      "High magnesium depresses neuromuscular, respiratory, and cardiovascular function. Tremor and torsades risk are more consistent with hypomagnesemia."
    ),
  ]),
  set(2, "Hypomagnesemia", [
    mc(
      "A client with alcohol use disorder and poor intake has tremors, muscle cramps, potassium 3.0 mEq/L that is not correcting, and magnesium 1.1 mg/dL. What is the priority interpretation?",
      [
        "Low magnesium is contributing to refractory hypokalemia and dysrhythmia risk",
        "The low potassium is most likely from lab dilution and should be redrawn before assessment",
        "Potassium replacement should be increased before checking magnesium again",
        "The tremors are most consistent with alcohol withdrawal rather than an electrolyte problem",
      ],
      0,
      "Hypomagnesemia can cause neuromuscular irritability, rhythm risk, and persistent potassium wasting."
    ),
    mc(
      "Which rhythm complication is classically associated with significant hypomagnesemia?",
      [
        "Torsades de pointes",
        "Atrial fibrillation from fluid volume excess",
        "First-degree AV block from beta-blocker therapy",
        "Peaked T waves from impaired potassium excretion",
      ],
      0,
      "Low magnesium increases risk for ventricular dysrhythmias, including torsades de pointes."
    ),
    mc(
      "Which history best explains hypomagnesemia?",
      [
        "Chronic diarrhea and poor nutritional intake",
        "End-stage kidney disease with magnesium antacid use",
        "Excess magnesium sulfate infusion",
        "Milk of magnesia use with anuria",
      ],
      0,
      "GI losses and poor intake are common causes of low magnesium. The other histories suggest high magnesium risk."
    ),
    ma(
      "Which findings or associations fit hypomagnesemia? Select all that apply.",
      [
        "Tremor or neuromuscular irritability",
        "Refractory hypokalemia",
        "Hypocalcemia association",
        "Alcohol use disorder or poor intake",
        "Absent reflexes with respiratory depression",
        "Excess magnesium antacid use in renal failure",
      ],
      [0, 1, 2, 3],
      "Low magnesium can cause neuromuscular irritability and make low potassium and calcium harder to correct. Absent reflexes and respiratory depression suggest high magnesium."
    ),
  ]),
  set(2, "Tumor lysis syndrome", [
    mc(
      "A client with leukemia starts chemotherapy. The next day the client has potassium 6.3 mEq/L, phosphate 6.1 mg/dL, calcium 7.4 mg/dL, rising creatinine, and muscle cramps. Which complication should the nurse suspect?",
      [
        "Tumor lysis syndrome",
        "Refeeding syndrome",
        "Syndrome of inappropriate antidiuretic hormone",
        "Respiratory alkalosis from anxiety",
      ],
      0,
      "Tumor lysis releases intracellular potassium and phosphate, raises uric acid, lowers calcium, and can injure the kidneys."
    ),
    mc(
      "Which finding in a client with tumor lysis syndrome is most immediately concerning?",
      [
        "Peaked T waves with potassium 6.5 mEq/L",
        "Phosphate 5.8 mg/dL without ECG changes",
        "Calcium 7.8 mg/dL with mild perioral tingling",
        "Creatinine increased from baseline with urine output 35 mL/hr",
      ],
      0,
      "Hyperkalemia with ECG changes can rapidly become fatal."
    ),
    mc(
      "Which nursing action is most appropriate for a client at high risk for tumor lysis syndrome?",
      [
        "Monitor electrolytes, renal function, urine output, and cardiac rhythm closely",
        "Encourage high-potassium foods after chemotherapy",
        "Restrict all fluids to protect the kidneys",
        "Monitor calcium only because phosphate abnormalities are expected after chemotherapy",
      ],
      0,
      "Tumor lysis requires close monitoring for electrolyte shifts, renal injury, urine output changes, and dysrhythmias."
    ),
    ma(
      "Which abnormalities are expected in tumor lysis syndrome? Select all that apply.",
      [
        "Hyperkalemia",
        "Hyperphosphatemia",
        "Hypocalcemia",
        "Rising creatinine or acute kidney injury risk",
        "Severe hypophosphatemia after feeding starts",
        "Low potassium from insulin surge after starvation",
      ],
      [0, 1, 2, 3],
      "Tumor lysis dumps intracellular contents and can impair renal function. Severe hypophosphatemia after nutrition starts fits refeeding syndrome."
    ),
  ]),
  set(2, "Refeeding syndrome", [
    mc(
      "A severely malnourished client starts tube feeding. Within 48 hours the client develops weakness, paresthesias, respiratory muscle fatigue, phosphate 1.0 mg/dL, potassium 3.1 mEq/L, and magnesium 1.3 mg/dL. Which complication is most likely?",
      [
        "Refeeding syndrome",
        "Tumor lysis syndrome",
        "Hypernatremic dehydration",
        "Anaphylactic shock",
      ],
      0,
      "Carbohydrate refeeding triggers insulin, shifting phosphate, potassium, and magnesium into cells. Severe hypophosphatemia can weaken respiratory muscles."
    ),
    mc(
      "Which action is most appropriate for a client at high risk for refeeding syndrome?",
      [
        "Start nutrition cautiously and monitor phosphate, potassium, magnesium, and respiratory status",
        "Begin full-calorie feeding immediately to correct malnutrition quickly",
        "Hold electrolyte monitoring unless the client has kidney failure",
        "Monitor glucose only because carbohydrate intake is the main trigger",
      ],
      0,
      "High-risk clients need careful caloric advancement and close electrolyte and clinical monitoring."
    ),
    mc(
      "Which finding best explains respiratory weakness in refeeding syndrome?",
      [
        "Severe hypophosphatemia limiting ATP-dependent muscle function",
        "Hypercalcemia suppressing deep tendon reflexes",
        "Water leaving brain cells because sodium is high",
        "Histamine release causing bronchospasm",
      ],
      0,
      "Phosphate is essential for ATP. Severe low phosphate can impair respiratory and cardiac muscle function."
    ),
    ma(
      "Which clients or findings raise concern for refeeding syndrome? Select all that apply.",
      [
        "Severe malnutrition before nutrition is restarted",
        "Low phosphate after carbohydrate feeding begins",
        "Low potassium and magnesium after feeding begins",
        "New weakness or respiratory muscle fatigue",
        "High uric acid and hyperkalemia after chemotherapy",
        "ESKD with magnesium antacid use and absent reflexes",
      ],
      [0, 1, 2, 3],
      "Refeeding syndrome occurs after nutrition restarts in malnourished clients and drives phosphate, potassium, and magnesium into cells."
    ),
  ]),
  set(2, "DKA potassium shift", [
    mc(
      "A client with diabetic ketoacidosis has pH 7.18, HCO3 12 mEq/L, glucose 520 mg/dL, and potassium 5.4 mEq/L before insulin therapy. Which interpretation is most important?",
      [
        "Serum potassium may be high while total-body potassium is depleted",
        "The high potassium means insulin should be delayed until potassium is normal",
        "The potassium value reflects total-body stores accurately before fluids are started",
        "Potassium replacement is unnecessary unless the ECG already shows U waves",
      ],
      0,
      "Acidosis and insulin deficiency shift potassium out of cells, but osmotic diuresis causes total-body potassium depletion. Insulin can drop serum potassium quickly."
    ),
    mc(
      "After insulin therapy begins for DKA, which laboratory trend requires prompt follow-up?",
      [
        "Potassium falls from 5.1 to 3.1 mEq/L",
        "Glucose decreases from 520 to 360 mg/dL",
        "pH rises from 7.18 to 7.26",
        "Respiratory rate decreases as acidosis improves",
      ],
      0,
      "Insulin shifts potassium into cells. A rapid fall to hypokalemia creates dysrhythmia risk."
    ),
    mc(
      "Which respiratory pattern is expected as compensation for metabolic acidosis in DKA?",
      [
        "Deep, rapid respirations to blow off CO2",
        "Bradypnea with CO2 retention",
        "Rapid shallow respirations with wheezing from bronchospasm",
        "Cheyne-Stokes respirations with alternating apnea and hyperpnea",
      ],
      0,
      "Kussmaul-type respirations compensate for metabolic acidosis by lowering PaCO2."
    ),
    ma(
      "Which statements about potassium in DKA are accurate? Select all that apply.",
      [
        "Initial serum potassium can be normal or high because acidosis shifts potassium out of cells.",
        "Total-body potassium is often depleted from osmotic diuresis.",
        "Insulin therapy can drive potassium into cells and cause hypokalemia.",
        "Cardiac monitoring and repeat potassium checks are important.",
        "A high initial potassium means there is no risk during treatment.",
        "Potassium chloride should be given by IV push if the potassium falls.",
      ],
      [0, 1, 2, 3],
      "The serum potassium number in DKA does not tell the whole story. Treatment can uncover dangerous hypokalemia, and IV push potassium is unsafe."
    ),
  ]),
  set(2, "Respiratory acidosis", [
    mc(
      "A client with COPD becomes somnolent. ABG results are pH 7.28, PaCO2 62 mm Hg, and HCO3 28 mEq/L. Which acid-base disorder is primary?",
      [
        "Respiratory acidosis",
        "Respiratory alkalosis",
        "Metabolic acidosis",
        "Metabolic alkalosis",
      ],
      0,
      "The pH is acidotic and PaCO2 is elevated, so the primary disorder is respiratory acidosis from inadequate ventilation."
    ),
    mc(
      "Which nursing priority best addresses respiratory acidosis from opioid oversedation?",
      [
        "Improve ventilation and prepare to administer naloxone as prescribed",
        "Encourage the client to breathe into a paper bag",
        "Administer sodium bicarbonate while continuing the opioid infusion",
        "Increase oxygen flow but postpone airway support until PaCO2 normalizes",
      ],
      0,
      "Respiratory acidosis from oversedation is a ventilation problem. Airway, breathing support, and reversal when prescribed are priorities."
    ),
    mc(
      "Which assessment finding is most consistent with worsening CO2 retention?",
      [
        "Increasing somnolence and slowed respirations",
        "Carpopedal spasm after hyperventilation",
        "Severe watery diarrhea",
        "Vomiting with nasogastric suction",
      ],
      0,
      "CO2 retention can depress neurologic status and occur with hypoventilation."
    ),
    ma(
      "Which situations can contribute to respiratory acidosis? Select all that apply.",
      [
        "COPD exacerbation with hypoventilation",
        "Opioid-induced respiratory depression",
        "Severe airway obstruction causing CO2 retention",
        "Neuromuscular weakness impairing ventilation",
        "Panic attack with rapid hyperventilation",
        "Vomiting with loss of gastric acid",
      ],
      [0, 1, 2, 3],
      "Respiratory acidosis comes from impaired ventilation and CO2 retention. Panic hyperventilation causes respiratory alkalosis; vomiting causes metabolic alkalosis."
    ),
  ]),
  set(2, "Respiratory alkalosis", [
    mc(
      "A client with sudden pleuritic chest pain and dyspnea has ABG pH 7.50, PaCO2 29 mm Hg, and HCO3 24 mEq/L. Which acid-base disorder is primary?",
      [
        "Respiratory alkalosis",
        "Respiratory acidosis",
        "Metabolic acidosis",
        "Metabolic alkalosis",
      ],
      0,
      "The pH is alkalotic and PaCO2 is low, showing primary respiratory alkalosis from hyperventilation."
    ),
    mc(
      "A client is hyperventilating and has SpO2 86% with sudden chest pain. Which action is safest?",
      [
        "Assess for hypoxemia or pulmonary embolism and provide oxygen as prescribed",
        "Have the client breathe into a paper bag until the tingling stops",
        "Coach slow breathing first because low PaCO2 is the primary abnormality",
        "Request an anxiolytic before reassessing oxygen saturation",
      ],
      0,
      "Hyperventilation with hypoxemia and chest pain may reflect a serious cause such as PE. Paper bag breathing is unsafe when hypoxemia is possible."
    ),
    mc(
      "Which finding is commonly associated with acute respiratory alkalosis?",
      [
        "Lightheadedness and tingling during hyperventilation",
        "Absent deep tendon reflexes from magnesium toxicity",
        "Kussmaul respirations from DKA",
        "Projectile vomiting with high bicarbonate",
      ],
      0,
      "Low PaCO2 from hyperventilation can cause neurologic and neuromuscular symptoms such as dizziness and tingling."
    ),
    ma(
      "Which causes or cues fit respiratory alkalosis? Select all that apply.",
      [
        "Anxiety or pain causing hyperventilation",
        "Hypoxemia from pulmonary embolism causing tachypnea",
        "Early sepsis with increased respiratory rate",
        "Low PaCO2 on ABG",
        "Opioid overdose with bradypnea",
        "COPD with CO2 retention",
      ],
      [0, 1, 2, 3],
      "Respiratory alkalosis results from excessive ventilation and low PaCO2. Bradypnea and CO2 retention cause respiratory acidosis."
    ),
  ]),
  set(2, "Metabolic acidosis", [
    mc(
      "A client with DKA has pH 7.20, PaCO2 27 mm Hg, and HCO3 11 mEq/L. Which acid-base disorder is primary?",
      [
        "Metabolic acidosis",
        "Respiratory acidosis",
        "Metabolic alkalosis",
        "Respiratory alkalosis",
      ],
      0,
      "Low pH and low bicarbonate indicate primary metabolic acidosis; low PaCO2 reflects respiratory compensation."
    ),
    mc(
      "Which condition is a likely cause of metabolic acidosis?",
      [
        "Severe diarrhea with bicarbonate loss",
        "Vomiting with gastric acid loss",
        "Anxiety-related hyperventilation",
        "Nasogastric suction removing stomach acid",
      ],
      0,
      "Diarrhea can cause bicarbonate loss and metabolic acidosis. Vomiting and NG suction commonly cause metabolic alkalosis."
    ),
    mc(
      "Which breathing pattern is the nurse most likely to see as compensation for metabolic acidosis?",
      [
        "Deep, rapid respirations",
        "Slow shallow respirations",
        "Stridor with suprasternal retractions",
        "Rapid shallow breathing with wheezing after allergen exposure",
      ],
      0,
      "The lungs compensate for metabolic acidosis by blowing off CO2."
    ),
    ma(
      "Which findings or causes are associated with metabolic acidosis? Select all that apply.",
      [
        "Low bicarbonate",
        "DKA",
        "Lactic acidosis from shock",
        "Renal failure",
        "Loss of gastric acid from vomiting",
        "High bicarbonate after prolonged NG suction",
      ],
      [0, 1, 2, 3],
      "Metabolic acidosis reflects acid gain or bicarbonate loss. Gastric acid loss and high bicarbonate fit metabolic alkalosis."
    ),
  ]),
  set(2, "Metabolic alkalosis", [
    mc(
      "A postoperative client with prolonged nasogastric suction has pH 7.51, PaCO2 48 mm Hg, and HCO3 36 mEq/L. Which disorder is primary?",
      [
        "Metabolic alkalosis",
        "Respiratory acidosis",
        "Metabolic acidosis",
        "Respiratory alkalosis",
      ],
      0,
      "The pH is alkalotic and bicarbonate is elevated. CO2 is elevated as respiratory compensation."
    ),
    mc(
      "Which history most strongly supports metabolic alkalosis?",
      [
        "Repeated vomiting and loop diuretic use",
        "DKA with Kussmaul respirations",
        "Renal failure with acid retention",
        "COPD with CO2 retention",
      ],
      0,
      "Vomiting removes gastric acid, and diuretics can cause contraction alkalosis with potassium and chloride loss."
    ),
    mc(
      "A client with metabolic alkalosis from vomiting has potassium 3.0 mEq/L and chloride 88 mEq/L. Which prescription should the nurse anticipate?",
      [
        "Replacement of chloride-containing fluid and potassium as ordered",
        "Fluid restriction and sodium bicarbonate",
        "Rapid IV push potassium",
        "Increased nasogastric suction to remove more acid",
      ],
      0,
      "Correcting volume, chloride, and potassium deficits addresses common vomiting-related alkalosis. IV push potassium is unsafe."
    ),
    ma(
      "Which findings or causes fit metabolic alkalosis? Select all that apply.",
      [
        "High bicarbonate",
        "Prolonged vomiting",
        "Nasogastric suction",
        "Loop diuretic-associated contraction alkalosis",
        "Low bicarbonate from diarrhea",
        "DKA with ketone production",
      ],
      [0, 1, 2, 3],
      "Metabolic alkalosis commonly follows gastric acid loss or contraction alkalosis. Diarrhea and DKA cause metabolic acidosis."
    ),
  ]),
  set(2, "ABG compensation", [
    mc(
      "ABG results are pH 7.31, PaCO2 30 mm Hg, and HCO3 15 mEq/L. How should the nurse interpret the results?",
      [
        "Partially compensated metabolic acidosis",
        "Fully compensated respiratory alkalosis",
        "Uncompensated metabolic alkalosis",
        "Partially compensated respiratory acidosis",
      ],
      0,
      "The pH is acidotic and bicarbonate is low, so metabolic acidosis is primary. PaCO2 is low in the alkalotic direction, showing respiratory compensation; pH remains abnormal."
    ),
    mc(
      "ABG results are pH 7.38, PaCO2 52 mm Hg, and HCO3 30 mEq/L. Which interpretation is best?",
      [
        "Fully compensated respiratory acidosis",
        "Uncompensated metabolic alkalosis",
        "Partially compensated respiratory alkalosis",
        "Uncompensated respiratory acidosis",
      ],
      0,
      "The pH is normal but on the acidic side, PaCO2 is high, and HCO3 is high in compensation. This fits compensated respiratory acidosis."
    ),
    mc(
      "When using the tic-tac-toe ABG method, which value identifies the respiratory component?",
      [
        "PaCO2",
        "HCO3",
        "Serum sodium",
        "Hemoglobin",
      ],
      0,
      "PaCO2 reflects ventilation and the respiratory component. HCO3 reflects the metabolic component."
    ),
    ma(
      "Which statements about ABG compensation are accurate? Select all that apply.",
      [
        "A normal pH with abnormal PaCO2 and HCO3 can indicate full compensation.",
        "If pH is still abnormal and the opposite system has moved, compensation is partial.",
        "PaCO2 is the respiratory value.",
        "HCO3 is the metabolic value.",
        "Compensation means the original disorder no longer matters.",
        "The kidneys compensate for respiratory problems within seconds.",
      ],
      [0, 1, 2, 3],
      "Compensation describes the body's response; it does not erase the underlying disorder. Respiratory compensation is faster than renal compensation."
    ),
  ]),
  set(2, "Upper airway obstruction", [
    mc(
      "A client suddenly develops stridor, cyanosis, accessory muscle use, and cannot speak in full sentences. What is the nurse's priority?",
      [
        "Call for emergency help and prepare to support the airway",
        "Auscultate lung bases after obtaining a full respiratory history",
        "Offer humidified oral fluids while preparing routine provider notification",
        "Teach pursed-lip breathing before applying oxygen or calling for help",
      ],
      0,
      "Stridor, cyanosis, and inability to speak indicate upper airway obstruction and require immediate airway response."
    ),
    mc(
      "A child with suspected epiglottitis is drooling, sitting upright, and has stridor. Which action is safest?",
      [
        "Keep the child calm and prepare for expert airway management",
        "Use a tongue blade to inspect the throat",
        "Place the child flat for a detailed oral exam",
        "Send the child to x-ray without monitoring",
      ],
      0,
      "Agitating the airway can worsen obstruction. The priority is calm positioning and preparation for advanced airway support."
    ),
    mc(
      "Which assessment finding most strongly suggests an upper rather than lower airway emergency?",
      [
        "Inspiratory stridor",
        "Dullness to percussion over a lung base",
        "Dependent edema",
        "Productive cough for 3 weeks",
      ],
      0,
      "Stridor is a high-pitched sound from upper airway narrowing and is an emergency cue."
    ),
    ma(
      "Which findings are concerning for upper airway obstruction? Select all that apply.",
      [
        "Stridor",
        "Inability to speak or cough effectively",
        "Cyanosis",
        "Accessory muscle use with agitation",
        "Mild nasal stuffiness with normal oxygen saturation",
        "Improved breath sounds after coughing",
      ],
      [0, 1, 2, 3],
      "Stridor, inability to move air effectively, cyanosis, accessory muscle use, and agitation are airway danger cues."
    ),
  ]),
  set(2, "Status asthmaticus", [
    mc(
      "A client with asthma has severe dyspnea and wheezing that does not improve after repeated rescue bronchodilator treatments. The client is becoming fatigued. Which concern is most urgent?",
      [
        "Status asthmaticus with risk for respiratory failure",
        "Medication-related tachycardia from repeated beta-agonist use",
        "Pneumonia with bronchospasm requiring antibiotics before airway treatment",
        "Anxiety-induced hyperventilation after multiple rescue treatments",
      ],
      0,
      "Severe asthma not responding to initial therapy can progress to respiratory failure."
    ),
    mc(
      "Which assessment finding in a client with severe asthma is the most ominous?",
      [
        "Diminished or absent breath sounds after previously loud wheezing",
        "Wheezing that improves after bronchodilator therapy",
        "Client speaking in full sentences after treatment",
        "SpO2 rising from 88% to 94%",
      ],
      0,
      "A silent or very quiet chest can mean minimal air movement and impending respiratory failure."
    ),
    mc(
      "Which action should the nurse take for a client with status asthmaticus who is tiring and hypoxemic?",
      [
        "Activate urgent support, administer oxygen, and prepare for aggressive bronchodilator/airway therapy as prescribed",
        "Encourage the client to walk to loosen secretions",
        "Withhold oxygen because it will stop respiratory drive",
        "Repeat peak flow measurements before escalating respiratory support",
      ],
      0,
      "The unstable client needs oxygenation, urgent escalation, and prescribed respiratory therapy."
    ),
    ma(
      "Which cues suggest severe asthma or status asthmaticus? Select all that apply.",
      [
        "Failure to respond to rescue bronchodilator therapy",
        "Inability to speak full sentences",
        "Use of accessory muscles and fatigue",
        "Diminished breath sounds with worsening distress",
        "Mild seasonal sneezing with normal respirations",
        "Clear lungs and SpO2 98% after treatment",
      ],
      [0, 1, 2, 3],
      "Poor response to bronchodilator therapy, inability to speak, fatigue, accessory muscle use, and diminished air movement are danger cues."
    ),
  ]),
  set(2, "Obstructive sleep apnea", [
    mc(
      "A client with obstructive sleep apnea uses CPAP at home and is scheduled for surgery. Which preoperative instruction is most important?",
      [
        "Bring the CPAP equipment to the hospital as instructed",
        "Stop CPAP use for a week before surgery",
        "Use the CPAP only if oxygen saturation is low on the morning of surgery",
        "Tell anesthesia only if the client has used CPAP within the last 24 hours",
      ],
      0,
      "The course flags home CPAP/BiPAP use for perioperative planning. The team needs to know and the equipment may be needed."
    ),
    mc(
      "Which postoperative order should the nurse question for a client with obstructive sleep apnea?",
      [
        "High-dose opioid every hour as needed without sedation or respiratory monitoring parameters",
        "Continuous pulse oximetry per protocol",
        "Head-of-bed elevation when appropriate",
        "Use of the client's CPAP during sleep as prescribed",
      ],
      0,
      "OSA increases risk from sedating medications. Analgesia may be needed, but respiratory and sedation monitoring should be clear."
    ),
    mc(
      "Which statement shows correct understanding of CPAP versus BiPAP?",
      [
        "CPAP provides one continuous pressure; BiPAP provides different inspiratory and expiratory pressures",
        "CPAP gives higher pressure during inhalation and lower pressure during exhalation",
        "Both devices replace the need to assess respiratory status",
        "BiPAP provides one continuous pressure to splint open the upper airway",
      ],
      0,
      "The course distinguishes constant pressure CPAP from two-pressure BiPAP support."
    ),
    ma(
      "Which nursing actions are appropriate for a hospitalized client with obstructive sleep apnea? Select all that apply.",
      [
        "Ask about home CPAP or BiPAP use.",
        "Communicate OSA history during handoff and perioperative planning.",
        "Monitor sedation and respiratory status after opioids or sedatives.",
        "Use prescribed positive airway pressure during sleep when ordered.",
        "Assume normal daytime SpO2 removes all postoperative risk.",
        "Tell the client not to mention CPAP to anesthesia.",
      ],
      [0, 1, 2, 3],
      "OSA history affects monitoring, sedating medications, handoff, and perioperative planning."
    ),
  ]),
  set(2, "Atelectasis", [
    mc(
      "A client 1 day after abdominal surgery has shallow respirations, low-grade fever, decreased breath sounds at the bases, and SpO2 91%. Which complication is most likely?",
      [
        "Atelectasis",
        "Pulmonary embolism with obstructive shock",
        "Aspiration pneumonia after swallowing dysfunction",
        "Pleural effusion after inflammatory fluid collects outside the lung",
      ],
      0,
      "Postoperative shallow breathing can cause alveolar collapse, decreased breath sounds, low-grade fever, and reduced oxygenation."
    ),
    mc(
      "Which intervention best helps prevent atelectasis in a postoperative client?",
      [
        "Incentive spirometry, coughing/deep breathing, pain control, and early mobility as appropriate",
        "Turning every 2 hours while delaying coughing until pain is completely absent",
        "Using oxygen during sleep while avoiding ambulation until discharge",
        "Teaching splinting but withholding analgesia to avoid respiratory depression",
      ],
      0,
      "Lung expansion, secretion clearance, pain control, and mobility reduce atelectasis risk."
    ),
    mc(
      "Which finding best indicates interventions for atelectasis are effective?",
      [
        "Improved breath sounds and SpO2 after ambulation and incentive spirometry",
        "Increasing oxygen need with worsening crackles",
        "New unilateral calf swelling",
        "Persistent shallow breathing because coughing hurts",
      ],
      0,
      "Improved breath sounds and oxygenation show better alveolar ventilation."
    ),
    ma(
      "Which factors increase risk for atelectasis? Select all that apply.",
      [
        "Shallow breathing after abdominal surgery",
        "Poor pain control limiting cough",
        "Immobility",
        "Retained secretions",
        "Frequent deep breathing and ambulation",
        "Consistent incentive spirometry use",
      ],
      [0, 1, 2, 3],
      "Atelectasis risk rises when alveoli do not expand or secretions are retained. Deep breathing and mobility are preventive."
    ),
  ]),
  set(2, "Aspiration pneumonia", [
    mc(
      "An older adult with dysphagia coughs while eating and later develops fever, crackles in the right lower lung, increased sputum, and SpO2 89%. Which complication is most likely?",
      [
        "Aspiration pneumonia",
        "Pulmonary embolism from a leg clot",
        "Atelectasis from shallow breathing after meals",
        "Bronchospasm triggered by swallowing cold liquids",
      ],
      0,
      "Aspiration of oral or gastric contents can cause lower respiratory infection and impaired gas exchange."
    ),
    mc(
      "Which nursing action best reduces aspiration risk for a client with dysphagia?",
      [
        "Keep the client upright for meals and follow the prescribed swallowing plan",
        "Give thin liquids quickly through a straw to save energy",
        "Recline the client after meals to reduce fatigue from sitting upright",
        "Provide oral care only after meals so swallowing is not interrupted",
      ],
      0,
      "Upright positioning and adherence to swallowing precautions reduce aspiration risk."
    ),
    mc(
      "A client with aspiration pneumonia is increasingly dyspneic with SpO2 86% on 2 L/min oxygen. What should the nurse do first?",
      [
        "Assess airway and breathing, raise the head of bed, and apply/adjust oxygen per protocol while notifying the provider",
        "Begin a lengthy teaching session about thickened liquids",
        "Review swallowing precautions before checking the current respiratory status",
        "Collect a sputum specimen before addressing the low oxygen saturation",
      ],
      0,
      "Worsening oxygenation is the immediate priority before teaching."
    ),
    ma(
      "Which findings or histories raise concern for aspiration pneumonia? Select all that apply.",
      [
        "Coughing or choking during meals",
        "Dysphagia requiring thickened liquids",
        "New fever and crackles after a choking episode",
        "Decreased oxygen saturation with increased sputum",
        "Clear breath sounds and SpO2 at baseline after supervised thickened liquids",
        "Productive cough that is improving after treatment for community-acquired pneumonia",
      ],
      [0, 1, 2, 3],
      "Swallowing problems, choking, fever, crackles, sputum, and hypoxemia fit aspiration pneumonia risk and presentation."
    ),
  ]),
  set(2, "Pneumonia", [
    mc(
      "A 72-year-old admitted with community-acquired pneumonia has temperature 102.4 F, heart rate 118/min, respiratory rate 30/min, crackles, and needs 4 L/min oxygen to keep SpO2 91%. Which problem is highest priority?",
      [
        "Impaired gas exchange with risk for sepsis",
        "Ineffective airway clearance from thick secretions",
        "Readiness for enhanced coping",
        "Deficient knowledge about the antibiotic regimen",
      ],
      0,
      "Fever, tachycardia, tachypnea, crackles, and oxygen need indicate active respiratory compromise and possible systemic infection."
    ),
    mc(
      "Which assessment finding is most consistent with pulmonary consolidation in pneumonia?",
      [
        "Crackles with dullness to percussion and increased tactile fremitus",
        "Diffuse expiratory wheezes with prolonged exhalation",
        "Absent unilateral breath sounds with hyperresonance to percussion",
        "Fine bibasilar crackles with jugular venous distention and frothy sputum",
      ],
      0,
      "Consolidated lung transmits sound differently and may cause crackles, dullness, and increased tactile fremitus."
    ),
    mc(
      "Which discharge teaching point is most important for a client recovering from pneumonia who is prescribed oral antibiotics?",
      [
        "Take the antibiotic exactly as prescribed and report worsening breathing, fever, or inability to maintain intake",
        "Stop the antibiotic when the cough improves",
        "Avoid all fluids until the sputum clears",
        "Expect shortness of breath at rest to worsen for several days",
      ],
      0,
      "Antibiotic adherence, hydration as appropriate, and warning signs are central to pneumonia discharge safety."
    ),
    ma(
      "Which findings suggest worsening pneumonia or complications? Select all that apply.",
      [
        "Increasing oxygen requirement",
        "Respiratory rate 32/min with fatigue",
        "New confusion in an older adult",
        "Hypotension or decreasing urine output",
        "Improved appetite and decreasing fever",
        "SpO2 stable at goal with easier breathing",
      ],
      [0, 1, 2, 3],
      "Increasing oxygen needs, tachypnea, fatigue, confusion, hypotension, and falling urine output suggest deterioration or sepsis risk."
    ),
  ]),
  set(2, "Pulmonary edema", [
    mc(
      "A client with heart failure suddenly has severe dyspnea, pink frothy sputum, diffuse crackles, and SpO2 84%. Which problem is most likely?",
      [
        "Pulmonary edema",
        "Atelectasis from shallow breathing",
        "Pneumonia with lobar consolidation",
        "Pleural effusion compressing the lower lung",
      ],
      0,
      "Pulmonary edema occurs when fluid accumulates in lung tissue/alveoli, often from heart failure, causing severe gas exchange impairment."
    ),
    mc(
      "Which action should the nurse take first for a client with suspected acute pulmonary edema?",
      [
        "Place in high Fowler position, apply oxygen per protocol, and call for urgent help",
        "Encourage the client to drink water to thin secretions",
        "Lay the client flat to improve preload",
        "Auscultate lung sounds after the client completes the current fluid bolus",
      ],
      0,
      "Positioning and oxygenation support are immediate priorities while urgent assistance is obtained."
    ),
    mc(
      "Which finding best differentiates pulmonary edema from uncomplicated fluid volume deficit?",
      [
        "Crackles, JVD, and acute dyspnea",
        "Dry mucous membranes and orthostatic dizziness",
        "Flat neck veins and scant concentrated urine after diarrhea",
        "Thirst after working outside in heat",
      ],
      0,
      "Crackles, JVD, and dyspnea suggest excess intravascular/pulmonary fluid. The other findings suggest deficit."
    ),
    ma(
      "Which findings are consistent with pulmonary edema? Select all that apply.",
      [
        "Severe dyspnea",
        "Crackles",
        "Pink frothy sputum",
        "Hypoxemia",
        "Flat neck veins and dry mucous membranes",
        "Clear lung sounds with normal oxygen saturation",
      ],
      [0, 1, 2, 3],
      "Pulmonary edema causes fluid-impaired gas exchange. Flat neck veins and dry mucous membranes fit volume deficit."
    ),
  ]),
  set(2, "Pleural effusion", [
    mc(
      "A client has dyspnea, decreased breath sounds at the right base, dullness to percussion, and chest x-ray showing fluid in the pleural space. Which condition is most likely?",
      [
        "Pleural effusion",
        "Pneumothorax",
        "Status asthmaticus",
        "Atelectasis",
      ],
      0,
      "Pleural effusion is fluid in the pleural space and can compress lung tissue."
    ),
    mc(
      "A client returns from thoracentesis. Which finding requires immediate follow-up?",
      [
        "Sudden dyspnea and decreased breath sounds on the affected side",
        "Small amount of serosanguineous drainage on the dressing",
        "Dry cough for several minutes after the procedure",
        "Respiratory rate 22/min with SpO2 94% after sitting upright",
      ],
      0,
      "Sudden dyspnea and decreased breath sounds after thoracentesis may indicate pneumothorax."
    ),
    mc(
      "Which assessment finding best reflects improvement after therapeutic thoracentesis for pleural effusion?",
      [
        "Decreased dyspnea and improved breath sounds",
        "New tracheal deviation away from the procedure side",
        "SpO2 falling from 94% to 86%",
        "Increasing dullness to percussion",
      ],
      0,
      "Removing pleural fluid should improve lung expansion and breathing."
    ),
    ma(
      "Which findings are consistent with pleural effusion? Select all that apply.",
      [
        "Dullness to percussion over the affected area",
        "Decreased breath sounds",
        "Dyspnea from lung compression",
        "Fluid visible in the pleural space on imaging",
        "Hyperresonance and tracheal shift from trapped air",
        "Diffuse wheezing that improves after bronchodilator therapy",
      ],
      [0, 1, 2, 3],
      "Pleural effusion produces fluid-related compression signs. Hyperresonance and tracheal shift suggest pneumothorax."
    ),
  ]),
  set(2, "Pneumothorax", [
    mc(
      "A client with COPD suddenly develops sharp chest pain and dyspnea. Breath sounds are absent on the right and percussion is hyperresonant. Which complication is most likely?",
      [
        "Pneumothorax",
        "Pleural effusion",
        "Pulmonary edema",
        "Atelectasis",
      ],
      0,
      "Air in the pleural space can collapse the lung, causing absent breath sounds and hyperresonance."
    ),
    mc(
      "A client with pneumothorax becomes hypotensive with tracheal deviation and severe respiratory distress. What is the priority?",
      [
        "Call rapid response and prepare for emergency decompression",
        "Prepare for a stat chest x-ray before notifying the provider",
        "Increase IV fluids to treat hypotension while continuing to observe respirations",
        "Place the client supine to improve venous return before reassessing breath sounds",
      ],
      0,
      "Tension pneumothorax is an obstructive shock emergency requiring immediate treatment."
    ),
    mc(
      "A chest tube drainage system is accidentally knocked over. Which action is most appropriate first?",
      [
        "Keep the system below chest level, assess the client, and follow facility procedure for restoring the drainage system",
        "Clamp the chest tube while deciding whether the drainage system is still sterile",
        "Raise the drainage system onto the bed to inspect the fluid level closely",
        "Focus on documenting the incident before checking respiratory status",
      ],
      0,
      "The priority is client assessment and maintaining a functioning closed drainage system according to policy. Routine clamping or removal is unsafe."
    ),
    ma(
      "Which cues suggest pneumothorax or tension pneumothorax? Select all that apply.",
      [
        "Sudden dyspnea and pleuritic chest pain",
        "Absent or decreased breath sounds on one side",
        "Hyperresonance to percussion",
        "Tracheal deviation with hypotension in tension pneumothorax",
        "Dullness to percussion from pleural fluid",
        "Dependent edema and frothy sputum",
      ],
      [0, 1, 2, 3],
      "Pneumothorax is an air problem; tension physiology adds obstructive shock. Dullness suggests fluid, and frothy sputum suggests pulmonary edema."
    ),
  ]),
  set(2, "Pulmonary embolism", [
    mc(
      "A postoperative client suddenly reports dyspnea and pleuritic chest pain. Heart rate is 126/min, SpO2 is 86%, and the client is anxious. Which complication is most concerning?",
      [
        "Pulmonary embolism",
        "Atelectasis from shallow postoperative breathing",
        "Pneumonia with pleuritic pain and increased sputum",
        "Pneumothorax related to postoperative lung collapse",
      ],
      0,
      "Sudden dyspnea, pleuritic chest pain, tachycardia, and hypoxemia are classic concerning cues for PE."
    ),
    mc(
      "Which action should the nurse take first for a client with suspected pulmonary embolism and SpO2 84%?",
      [
        "Apply oxygen per protocol, assess respiratory/circulatory status, and notify the provider or rapid response team",
        "Ambulate the client to break up the clot",
        "Massage the calf that is swollen and painful",
        "Delay notification until discharge instructions are complete",
      ],
      0,
      "PE threatens oxygenation and perfusion. Oxygen support, assessment, and urgent communication are priorities. Calf massage and ambulation are unsafe."
    ),
    mc(
      "Which history increases risk for pulmonary embolism?",
      [
        "Unilateral calf swelling after hip surgery",
        "Recent pneumonia treated with oral antibiotics",
        "Obstructive sleep apnea treated with CPAP at home",
        "Asthma requiring rescue inhaler use twice this week",
      ],
      0,
      "DVT signs after surgery increase concern for clot embolization to the lungs."
    ),
    ma(
      "Which findings are concerning for pulmonary embolism? Select all that apply.",
      [
        "Sudden unexplained dyspnea",
        "Pleuritic chest pain",
        "Tachycardia",
        "Hypoxemia or syncope",
        "Unilateral leg swelling or pain",
        "Bilateral ankle edema that improves with leg elevation",
      ],
      [0, 1, 2, 3, 4],
      "PE commonly presents with sudden respiratory and perfusion changes and may follow DVT signs. Chronic edema alone is less specific."
    ),
  ]),
  set(3, "Therapeutic communication", [
    mc(
      "A client with severe nausea says, 'Nobody is listening to me.' Which response is most therapeutic?",
      [
        "It sounds like you feel dismissed. Tell me what has been happening and what you need right now.",
        "Do not worry; your providers know what they are doing.",
        "You should try to be more positive because stress makes nausea worse.",
        "I am sure the next nurse will have more time to talk.",
      ],
      0,
      "Therapeutic communication acknowledges the emotion and invites assessment. False reassurance and advice-giving close the conversation."
    ),
    mc(
      "A client is angry that pain medication was delayed. What should the nurse do first?",
      [
        "Acknowledge the concern, assess pain and safety, and clarify what happened",
        "Explain the medication schedule first so the client understands the delay",
        "Ask the client to lower their voice before discussing the pain",
        "Review the medication administration record before assessing current pain",
      ],
      0,
      "The nurse should respond honestly, assess, and address safety. Defensiveness and avoidance damage trust."
    ),
    mc(
      "Which statement is an example of false reassurance?",
      [
        "Everything will be fine; there is nothing to worry about.",
        "I can stay for a few minutes and hear what concerns you most.",
        "What have you been told so far about the plan?",
        "I do not know the answer yet, but I will find out.",
      ],
      0,
      "False reassurance minimizes concern without evidence. Honest presence and follow-through are therapeutic."
    ),
    ma(
      "Which communication behaviors are therapeutic? Select all that apply.",
      [
        "Use open-ended questions when assessment is needed.",
        "Acknowledge emotion without arguing about it.",
        "Be honest when information is not yet known.",
        "Match tone, pace, and body language to the clinical situation.",
        "Redirect fear to a teaching topic so the client focuses on recovery.",
        "Promise outcomes to reduce anxiety.",
      ],
      [0, 1, 2, 3],
      "Therapeutic communication is purposeful, honest, and patient-centered. Avoidance and false promises are not therapeutic."
    ),
  ]),
  set(3, "Trauma-informed care", [
    mc(
      "A 12-year-old recovering from traumatic amputation becomes quiet and turns away when staff discuss the accident in the room. Which response is most trauma-informed?",
      [
        "Ask permission before discussing details and offer choices about who is present when care is explained",
        "Have the child retell the event to each new staff member so everyone understands",
        "Tell the child not to think about the accident because it is over",
        "Discuss the details in the hallway within earshot to save time",
      ],
      0,
      "Trauma-informed care emphasizes safety, choice, trust, collaboration, and avoiding unnecessary retelling."
    ),
    mc(
      "Which statement best reflects trauma-informed care?",
      [
        "We do not need to know a person's trauma history to avoid re-traumatizing care.",
        "Trauma-informed care is used after a client confirms a trauma history.",
        "The priority is getting the story even if the patient does not want to tell it.",
        "Offering choices gives up nursing responsibility.",
      ],
      0,
      "The course emphasizes universal trauma-informed practices across populations."
    ),
    mc(
      "A client startles when the nurse approaches from behind to change a dressing. Which action is best?",
      [
        "Pause, explain what needs to happen, ask permission to continue, and offer a choice when possible",
        "Continue quickly so the dressing is finished",
        "Tell the client the reaction is inappropriate",
        "Ask the client to describe any past trauma before providing care",
      ],
      0,
      "Safety, choice, explanation, and consent reduce threat. Trauma history is not required to practice respectfully."
    ),
    ma(
      "Which actions support trauma-informed care? Select all that apply.",
      [
        "Explain before touching the patient.",
        "Offer realistic choices when possible.",
        "Avoid making the patient repeat traumatic details unnecessarily.",
        "Use privacy and predictable communication.",
        "Ask for a full trauma history before routine care can proceed.",
        "Dismiss strong reactions as attention-seeking.",
      ],
      [0, 1, 2, 3],
      "Trauma-informed care uses safety, choice, collaboration, trust, and empowerment even when trauma history is unknown."
    ),
  ]),
  set(3, "ISBAR escalation", [
    mc(
      "A client with pneumonia now has RR 32/min, SpO2 88% on 4 L/min, BP 86/50, and new confusion. Which ISBAR recommendation is strongest?",
      [
        "I need you at the bedside now and recommend sepsis evaluation, fluid orders, and oxygen/respiratory support orders.",
        "The client has pneumonia and does not look good, so please check the chart later.",
        "The family is worried, but I do not have vital signs yet.",
        "I will call again if the next set of vitals is worse.",
      ],
      0,
      "The R in ISBAR should make a clear request or recommendation tied to patient safety."
    ),
    mc(
      "Which part of ISBAR is most often skipped but tells the listener what the nurse thinks and needs?",
      [
        "Assessment and recommendation",
        "Identify and situation",
        "Situation and background",
        "Vital signs and medication list",
      ],
      0,
      "The course notes that handoffs often include identify, situation, and background but miss assessment and recommendation."
    ),
    mc(
      "Which statement belongs in the Assessment portion of ISBAR?",
      [
        "I am concerned this client is developing septic shock.",
        "This is William, RN on 4 East.",
        "The client was admitted yesterday for pneumonia.",
        "Please come to the bedside now.",
      ],
      0,
      "Assessment communicates the nurse's interpretation. Identify, background, and recommendation are separate ISBAR elements."
    ),
    ma(
      "Which elements belong in a strong ISBAR escalation call? Select all that apply.",
      [
        "Caller, unit, patient identity, and location",
        "Current situation and key abnormal cues",
        "Relevant background such as diagnosis or recent treatment",
        "Nurse assessment of the likely problem",
        "Clear request or recommendation",
        "A vague request to review the chart sometime",
      ],
      [0, 1, 2, 3, 4],
      "ISBAR should identify, state situation, give background, provide assessment, and make a specific recommendation."
    ),
  ]),
  set(3, "Teach-back", [
    mc(
      "Which teach-back statement is most appropriate after discharge teaching?",
      [
        "I want to make sure I explained this clearly. Can you show me how you will take these medicines tonight?",
        "Do you understand everything I said?",
        "Repeat this back so I know you were listening.",
        "You seem smart, so I am sure you will figure it out.",
      ],
      0,
      "Teach-back checks the quality of the nurse's teaching, not the patient's intelligence. The best response uses plain language, takes responsibility for clarity, and asks the client to show the specific home plan: how the medicines will be taken tonight. 'Do you understand?' is weak because many clients say yes even when instructions are unclear. 'Repeat this back' sounds like a test and can feel shaming. 'You seem smart' is false reassurance and does not verify the plan. Test cue: good teach-back asks the patient to explain or demonstrate a real task, and it frames any gap as something the nurse needs to teach more clearly."
    ),
    mc(
      "A client incorrectly explains when to seek help after pneumonia discharge. What should the nurse do?",
      [
        "Re-teach the missed warning signs in plainer language and ask for teach-back again",
        "Document noncompliance and continue discharge",
        "Give all remaining instructions faster to save time",
        "Ask a family member to handle it without the client's involvement",
      ],
      0,
      "A teach-back gap means the teaching needs to be adjusted and checked again."
    ),
    mc(
      "Which discharge topic is best suited for teach-back?",
      [
        "When to call the provider for worsening shortness of breath or fever",
        "The difference between lobar pneumonia and bronchopneumonia",
        "The full pathophysiology of alveolar consolidation",
        "A list of organisms that can cause pneumonia",
      ],
      0,
      "Teach-back should focus on what the client must do at home to stay safe."
    ),
    ma(
      "Which actions improve teach-back effectiveness? Select all that apply.",
      [
        "Teach one key idea at a time.",
        "Use plain language.",
        "Ask the client to explain or demonstrate the plan.",
        "Re-teach gaps and check again.",
        "Ask several yes/no questions before ending the session.",
        "Document misunderstanding as nonadherence after one failed teach-back.",
      ],
      [0, 1, 2, 3],
      "Teach-back is a closed loop: plain teaching, patient explanation, nurse correction, and repeat verification."
    ),
  ]),
  set(3, "Readiness to learn", [
    mc(
      "A client is scheduled for discharge teaching but is nauseated, in pain rated 8/10, and says, 'I cannot think right now.' What should the nurse do first?",
      [
        "Address symptoms and readiness barriers before teaching complex instructions",
        "Give written instructions first and reassess understanding at the follow-up visit",
        "Ask the family to receive the teaching while the client rests",
        "Teach only the medication list and postpone warning signs until the client feels better",
      ],
      0,
      "Teaching can fail when pain, stress, illness, or readiness barriers are ignored."
    ),
    mc(
      "A client with limited English proficiency nods during medication teaching. Which action best evaluates understanding?",
      [
        "Use a qualified interpreter and ask the client to teach back the medication plan",
        "Assume nodding means understanding",
        "Ask the adult daughter to interpret all clinical information",
        "Speak louder and repeat the same words",
      ],
      0,
      "Language access and teach-back are needed. Nodding does not prove understanding, and family interpretation can be unsafe."
    ),
    mc(
      "Which barrier is most likely to make technically correct discharge teaching fail?",
      [
        "The client has no transportation to the follow-up appointment",
        "The nurse uses plain language",
        "The client demonstrates correct inhaler use",
        "The medication schedule is matched to the client's routine",
      ],
      0,
      "Practical barriers such as transportation can make a plan unsafe even when teaching is accurate."
    ),
    ma(
      "Which factors should the nurse assess before or during patient teaching? Select all that apply.",
      [
        "Pain, fatigue, anxiety, or stress level",
        "Language preference and need for interpreter",
        "Health literacy and preferred learning method",
        "Culture, beliefs, and practical barriers",
        "Whether the nurse has already said the information once",
        "Whether the patient seems agreeable without teach-back",
      ],
      [0, 1, 2, 3],
      "Readiness, literacy, language, culture, and practical barriers affect whether teaching can be used safely."
    ),
  ]),
  set(3, "Early discharge planning", [
    mc(
      "When should discharge planning begin for a hospitalized adult client?",
      [
        "At admission, with updates as the client's condition and needs change",
        "After the client is medically stable enough to leave within 24 hours",
        "When the family arrives to review transportation plans",
        "After teaching is complete and barriers are identified",
      ],
      0,
      "The course emphasizes that safe discharge planning starts at admission."
    ),
    mc(
      "An older adult recovering from pneumonia lives alone, has lost weight, uses a walker, and becomes exhausted getting dressed. What should the nurse prioritize before discharge?",
      [
        "Assess home support, mobility, nutrition, follow-up, equipment, and services needed for safe recovery",
        "Confirm the antibiotic prescription first because medication access is the main discharge barrier",
        "Teach warning signs and tell the client to call for help if home mobility is difficult",
        "Arrange follow-up after discharge because fatigue often improves at home",
      ],
      0,
      "Safe discharge includes destination, support, equipment, medications, follow-up, and barriers, not only medical stability."
    ),
    mc(
      "Which finding most threatens a planned discharge after hip fracture repair?",
      [
        "Client lives alone up a flight of stairs with no caregiver and no follow-up arranged",
        "Client can state the medication schedule and has a ride home",
        "Home health visit is scheduled for the next day",
        "Walker has been delivered and adjusted",
      ],
      0,
      "Lack of support, unsafe environment, and no follow-up make discharge unsafe even if medically ready."
    ),
    ma(
      "Which items belong in early discharge planning? Select all that apply.",
      [
        "Destination and home environment",
        "Support system and caregiver availability",
        "Medication access and understanding",
        "Equipment, services, transportation, and follow-up",
        "Warning signs and who to call",
        "Confirming barriers only after the discharge order is signed",
      ],
      [0, 1, 2, 3, 4],
      "Discharge planning should identify practical needs and close the loop before the client leaves."
    ),
  ]),
  set(3, "Stable versus healed", [
    mc(
      "A client recovering from pneumonia says, 'Why am I going home if I am not completely better?' Which response is best?",
      [
        "You are stable enough to continue recovery at home, and we will make sure you know the medicines, warning signs, and follow-up plan.",
        "You are healed, so there is no reason to worry.",
        "The hospital needs the bed, so discharge is required.",
        "Most people feel bad at discharge, so you do not need instructions.",
      ],
      0,
      "The course distinguishes stable from fully healed and frames discharge as a safe handoff to the next setting."
    ),
    mc(
      "Which finding suggests a client is stable for discharge after pneumonia?",
      [
        "Oxygenation is at the ordered goal, oral antibiotics are tolerated, follow-up is arranged, and the client can teach back warning signs",
        "The client still needs increasing oxygen every hour",
        "The client has no way to obtain prescribed antibiotics",
        "The client is newly confused and hypotensive",
      ],
      0,
      "Safe discharge requires physiologic stability plus a workable plan. Worsening oxygenation, access barriers, and instability prevent safe discharge."
    ),
    mc(
      "Which statement by a client after pneumonia discharge teaching requires more teaching?",
      [
        "I will stop the antibiotic as soon as my cough improves.",
        "I will call if my breathing gets worse or fever returns.",
        "I know when my follow-up appointment is scheduled.",
        "I can explain how I will take the oral antibiotic.",
      ],
      0,
      "Stopping antibiotics early is unsafe. The other statements reflect discharge readiness."
    ),
    ma(
      "Which elements help distinguish a safe discharge from simply being medically stable? Select all that apply.",
      [
        "Medication plan is understood and obtainable.",
        "Warning signs and who to call are clear.",
        "Follow-up appointments or services are arranged.",
        "Home support and equipment needs are addressed.",
        "The patient is told they are cured.",
        "Barriers are assumed to be solved because family is present.",
      ],
      [0, 1, 2, 3],
      "A safe discharge is a transition plan. Stability is necessary but not enough if the client cannot carry out the plan."
    ),
  ]),
  set(3, "Handoff safety", [
    mc(
      "Which handoff statement is safest?",
      [
        "Room 418 has pneumonia, needs 4 L oxygen to keep SpO2 92%, cultures were drawn, first antibiotic is due at 1500, and call the provider if SpO2 drops below 90% or RR rises above 30.",
        "Room 418 is fine but has pneumonia; details are in the chart.",
        "Room 418 is needy and anxious, but nothing important happened.",
        "Room 418 has meds later; I do not remember which ones.",
      ],
      0,
      "Safe handoff transfers responsibility with current status, pending tasks, and clear contingency cues."
    ),
    mc(
      "Which omission creates the highest handoff risk?",
      [
        "Not reporting a pending potassium recheck after treatment for hyperkalemia",
        "Not reporting a noncritical lab result that was unchanged from baseline",
        "Not reporting that a scheduled oral antibiotic was already given",
        "Not reporting resolved nausea after a PRN antiemetic",
      ],
      0,
      "Pending labs after a dangerous electrolyte problem directly affect safety and follow-up."
    ),
    mc(
      "Which statement best describes the purpose of structured handoff?",
      [
        "It transfers responsibility and the information needed to continue safe care",
        "It lets the outgoing nurse prove they were busy",
        "It replaces bedside assessment by the receiving nurse",
        "It should include every detail from the entire hospitalization",
      ],
      0,
      "Handoff is a safety procedure that supports continuity; it does not replace assessment or require irrelevant detail."
    ),
    ma(
      "Which details should be included in a high-risk handoff when relevant? Select all that apply.",
      [
        "Current assessment and vital-sign trends",
        "Recent changes in condition",
        "Pending labs, tests, or medications",
        "Specific thresholds or concerns requiring escalation",
        "Tasks that must be completed next",
        "General impressions without objective cues",
      ],
      [0, 1, 2, 3, 4],
      "Effective handoff focuses on actionable clinical information, trends, pending work, and escalation needs."
    ),
  ]),
  set(3, "Chain of command", [
    mc(
      "A nurse reports that a client with suspected sepsis has BP 82/48, new confusion, and urine output 10 mL/hr. The provider says, 'Just keep watching,' and ends the call. What should the nurse do next?",
      [
        "Escalate through the chain of command or rapid response process according to policy",
        "Call again with the same data but avoid notifying the charge nurse",
        "Wait for routine morning labs before taking further action",
        "Document the provider response and reassess after the next scheduled vital signs",
      ],
      0,
      "When patient safety remains at risk, the nurse continues assessment and escalates through the chain of command."
    ),
    mc(
      "Which documentation best supports escalation after an unresolved safety concern?",
      [
        "Objective assessment data, time of notification, provider response, actions taken, and client response",
        "Provider notified; no new orders, with no assessment data or time recorded",
        "Client appeared worse than earlier but vital signs not documented",
        "Family was concerned and staff were busy during the shift",
      ],
      0,
      "Documentation should be objective, time-linked, and focused on assessment, communication, actions, and response."
    ),
    mc(
      "Which situation most clearly requires chain-of-command escalation?",
      [
        "A client remains unstable after the nurse reports critical cues and no timely plan is made",
        "A provider schedules reassessment in 2 hours for a client whose vital signs returned to baseline",
        "A family member asks why a repeat potassium level is scheduled tomorrow",
        "A stable client reports incisional pain covered by an active PRN prescription",
      ],
      0,
      "Chain-of-command escalation is for unresolved safety risks, not routine preferences."
    ),
    ma(
      "Which actions are appropriate when using chain of command for a safety concern? Select all that apply.",
      [
        "Continue to assess and support the client.",
        "Communicate objective cues and the specific concern.",
        "Escalate to the next appropriate person or rapid response pathway if risk persists.",
        "Document notifications, responses, actions, and client outcomes.",
        "Stop advocating once one call has been made.",
        "Document only the name of the person notified and leave the outcome for the next shift.",
      ],
      [0, 1, 2, 3],
      "The nurse's responsibility continues until the safety concern is addressed or appropriately escalated."
    ),
  ]),
];

function set(week, subtopic, items) {
  return {
    week,
    weekLabel: `Week ${week}`,
    topic: TOPICS[week],
    system: SYSTEM_BY_SUBTOPIC[subtopic],
    subtopic,
    items,
  };
}

function mc(stem, options, answer, rationale) {
  return { stem, options, answers: [answer], rationale };
}

function ma(stem, options, answers, rationale) {
  return { stem, options, answers, rationale };
}

function main() {
  const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"));
  const preserved = existing.filter((question) => question.category !== "Original course-based practice");
  const generated = buildGeneratedQuestions();
  const questions = [...generated, ...preserved].map((question, index) => ({
    ...question,
    id: index + 1,
  }));

  validateGeneratedQuestions(generated);
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(questions, null, 2)}\n`, "utf8");
  console.log(`Rewrote ${generated.length} generated questions and preserved ${preserved.length} non-generated questions.`);
}

function buildGeneratedQuestions() {
  let nextId = 1;
  const questions = [];

  for (const group of SETS) {
    for (const item of group.items) {
      const correctAnswers = item.answers.map((answerIndex) => item.options[answerIndex]);
      const rationale = item.rationale.includes("Test cue:")
        ? item.rationale
        : buildDetailedRationale(group, item, correctAnswers);
      questions.push({
        id: nextId,
        qid: `N401-${String(1000 + nextId).padStart(4, "0")}`,
        week: group.week,
        weekLabel: group.weekLabel,
        topic: group.topic,
        system: group.system,
        category: "Original course-based practice",
        type: correctAnswers.length > 1 ? "Multiple Answer" : "Multiple Choice",
        difficulty: "NCLEX-style",
        source: BASE_SOURCE,
        sourceType: "Original generated practice",
        sourceConfidence: "course-notes-derived",
        sourceDetail: `NURS401 ${group.weekLabel} course materials: ${group.subtopic}`,
        stem: item.stem,
        options: item.options,
        correctAnswers,
        rationale,
        subtopic: group.subtopic,
      });
      nextId += 1;
    }
  }

  return questions;
}

function buildDetailedRationale(group, item, correctAnswers) {
  const correctSet = new Set(correctAnswers);
  const incorrectAnswers = item.options.filter((option) => !correctSet.has(option));
  const opener = item.answers.length > 1
    ? `Correct selections: ${joinList(correctAnswers)}.`
    : `The best answer is: ${correctAnswers[0]}.`;
  const distractorIntro = item.answers.length > 1
    ? "The other options are not selected because"
    : "The other options are less correct because";
  const distractorText = incorrectAnswers
    .map((option) => `${option} ${explainDistractor(option, group.subtopic, item.stem)}.`)
    .join(" ");

  return `${opener} ${item.rationale} ${distractorIntro}: ${distractorText} Test cue: ${testCueFor(group.subtopic, item.stem)}`;
}

function explainDistractor(option, subtopic, stem) {
  const text = normalizeText(`${option} ${stem}`);
  const topic = subtopic.toLowerCase();

  if (hasAny(text, ["wait", "delay", "tomorrow", "morning rounds", "reassess in 1 hour", "after the next scheduled"])) {
    return "delays assessment or treatment when the stem contains cues that need earlier follow-up";
  }
  if (hasAny(text, ["teaching", "teach", "discharge", "understand", "schedule", "education"])) {
    return "may be appropriate later, but it does not address the priority assessment or physiologic risk in the stem";
  }
  if (hasAny(text, ["oral fluids", "drink water", "thin liquids", "straw"])) {
    return "can worsen risk or is too limited when airway, perfusion, swallowing safety, or IV volume support is the issue";
  }
  if (hasAny(text, ["flat", "supine", "ambulate", "walking", "walk"])) {
    return "uses a position or activity that does not match the client's current respiratory or perfusion threat";
  }
  if (hasAny(text, ["normal", "baseline", "stable", "improving", "brisk", "warm extremities", "strong peripheral pulses"])) {
    return "describes a more reassuring or lower-priority pattern than the cue cluster being tested";
  }
  if (hasAny(text, ["hypokalemia", "low potassium"]) && topic.includes("hyperkalemia")) {
    return "points toward the opposite potassium problem rather than excess potassium and ECG instability";
  }
  if (hasAny(text, ["hyperkalemia", "peaked t", "impaired potassium excretion"]) && topic.includes("hypokalemia")) {
    return "points toward excess potassium rather than the low-potassium pattern in the stem";
  }
  if (hasAny(text, ["hypocalcemia", "tetany", "trousseau", "perioral"]) && topic.includes("hypercalcemia")) {
    return "fits low calcium and neuromuscular irritability rather than high calcium";
  }
  if (hasAny(text, ["hypercalcemia", "constipation", "lethargy"]) && topic.includes("hypocalcemia")) {
    return "fits high calcium rather than low calcium with tetany or laryngospasm risk";
  }
  if (hasAny(text, ["hypermagnesemia", "absent reflexes", "magnesium antacid", "magnesium sulfate"]) && topic.includes("hypomagnesemia")) {
    return "fits magnesium excess rather than magnesium depletion";
  }
  if (hasAny(text, ["hypomagnesemia", "tremor", "torsades"]) && topic.includes("hypermagnesemia")) {
    return "fits low magnesium rather than magnesium toxicity";
  }
  if (hasAny(text, ["respiratory acidosis", "co2 retention", "bradypnea"]) && topic.includes("respiratory alkalosis")) {
    return "fits hypoventilation and CO2 retention rather than hyperventilation with low PaCO2";
  }
  if (hasAny(text, ["respiratory alkalosis", "hyperventilation"]) && topic.includes("respiratory acidosis")) {
    return "fits excessive ventilation rather than CO2 retention";
  }
  if (hasAny(text, ["metabolic acidosis", "dka", "diarrhea"]) && topic.includes("metabolic alkalosis")) {
    return "fits bicarbonate loss or acid gain rather than gastric acid loss or contraction alkalosis";
  }
  if (hasAny(text, ["metabolic alkalosis", "vomiting", "ng suction"]) && topic.includes("metabolic acidosis")) {
    return "fits acid loss and elevated bicarbonate rather than metabolic acidosis";
  }
  if (hasAny(text, ["pneumothorax", "hyperresonance", "absent unilateral breath"])) {
    return "points toward air in the pleural space rather than the condition or action being tested";
  }
  if (hasAny(text, ["pulmonary edema", "jvd", "frothy sputum"])) {
    return "points toward fluid overload in the lungs rather than the target finding in the stem";
  }
  if (hasAny(text, ["pneumonia", "sputum", "crackles"]) && topic.includes("pulmonary embolism")) {
    return "can cause respiratory symptoms, but the sudden dyspnea, pleuritic pain, tachycardia, and hypoxemia pattern is more consistent with embolism";
  }
  if (hasAny(text, ["pain", "anxiety", "fatigue"])) {
    return "is clinically relevant, but it is not the best explanation for the full cue cluster";
  }

  return `is related to ${subtopic}, but it misses the most important cue or priority in the stem`;
}

function testCueFor(subtopic, stem) {
  const text = normalizeText(`${subtopic} ${stem}`);
  if (hasAny(text, ["shock", "perfusion", "urine output", "map", "capillary refill"])) {
    return "cluster mental status, urine output, skin, heart rate, and blood pressure trends before deciding a client is stable.";
  }
  if (hasAny(text, ["potassium", "hyperkalemia", "hypokalemia", "dka"])) {
    return "potassium questions are cardiac-safety questions; ECG changes and rapid shifts usually outrank teaching or delayed follow-up.";
  }
  if (hasAny(text, ["sodium", "hyponatremia", "hypernatremia"])) {
    return "sodium problems are water-balance and brain-risk problems, so neurologic symptoms and correction rate matter.";
  }
  if (hasAny(text, ["calcium", "magnesium", "phosphate", "refeeding", "tumor lysis"])) {
    return "connect the electrolyte to the organ at risk: rhythm, neuromuscular function, respiratory effort, and kidney function.";
  }
  if (hasAny(text, ["abg", "acidosis", "alkalosis", "paco2", "hco3"])) {
    return "match pH first, then decide whether PaCO2 or HCO3 is driving the problem and whether the other system is compensating.";
  }
  if (hasAny(text, ["airway", "stridor", "asthma", "pneumonia", "atelectasis", "pneumothorax", "embolism", "edema", "pleural", "aspiration"])) {
    return "respiratory questions usually turn on airway patency, oxygenation, work of breathing, and whether the finding is sudden or worsening.";
  }
  if (hasAny(text, ["teach", "discharge", "handoff", "isbar", "communication", "trauma"])) {
    return "communication answers should be specific, patient-centered, and closed-loop; avoid vague reassurance or yes/no understanding checks.";
  }
  return "choose the answer that addresses the most urgent cue and produces a measurable safety or physiologic outcome.";
}

function joinList(values) {
  if (values.length <= 2) return values.join(" and ");
  return `${values.slice(0, -1).join("; ")}; and ${values[values.length - 1]}`;
}

function normalizeText(value) {
  return String(value).toLowerCase();
}

function hasAny(value, needles) {
  return needles.some((needle) => value.includes(needle));
}

function validateGeneratedQuestions(generated) {
  if (generated.length !== EXPECTED_GENERATED_COUNT) {
    throw new Error(`Expected ${EXPECTED_GENERATED_COUNT} generated questions, found ${generated.length}`);
  }

  for (const question of generated) {
    if (!question.stem || !Array.isArray(question.options) || question.options.length < 4) {
      throw new Error(`Invalid question shape for ${question.qid}`);
    }

    const optionSet = new Set(question.options);
    if (optionSet.size !== question.options.length) {
      throw new Error(`Duplicate option in ${question.qid}`);
    }

    for (const answer of question.correctAnswers) {
      if (!optionSet.has(answer)) {
        throw new Error(`Correct answer missing from options in ${question.qid}: ${answer}`);
      }
    }

    if (question.type === "Multiple Choice" && question.correctAnswers.length !== 1) {
      throw new Error(`Multiple Choice question has ${question.correctAnswers.length} answers: ${question.qid}`);
    }

    if (question.type === "Multiple Answer" && question.correctAnswers.length < 2) {
      throw new Error(`Multiple Answer question has too few answers: ${question.qid}`);
    }
  }
}

main();
