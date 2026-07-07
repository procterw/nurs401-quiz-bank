const state = {
  questions: [],
  questionById: new Map(),
  filtered: [],
  currentId: null,
  previousIds: [],
  renderedQuestionId: null,
  studySupportVisible: false,
  answers: new Map(),
  answered: {},
  flagged: {},
  optionOrders: new Map(),
};

const ANSWERED_STORAGE_KEY = "nurs401-answered-results-v1";
const FLAGGED_STORAGE_KEY = "nurs401-flagged-questions-v1";
const QUESTION_FEEDBACK_ENDPOINT = "";

const medicalTerms = {
  "ace inhibitor": "A drug class that blocks conversion of angiotensin I to angiotensin II, lowering vasoconstriction and aldosterone effects.",
  acetaminophen: "A non-opioid analgesic and antipyretic used for pain and fever; it has limited anti-inflammatory activity.",
  acidosis: "A blood pH disturbance where acid is increased or base is decreased, lowering pH below the normal range.",
  adrenergic: "Related to sympathetic nervous system signaling through norepinephrine or epinephrine receptors.",
  "adrenergic agonist": "A medication that stimulates adrenergic receptors, often affecting heart rate, blood vessels, bronchi, or blood pressure depending on the receptor targeted.",
  afterload: "The pressure or resistance the ventricle must overcome to eject blood.",
  "aldosterone antagonist": "A medication class that blocks aldosterone effects, promoting sodium/water loss while tending to retain potassium.",
  albumin: "The major plasma protein that helps maintain oncotic pressure and binds many medications in the bloodstream.",
  albuterol: "A short-acting beta-2 agonist used as a rescue bronchodilator for acute bronchospasm.",
  alkalosis: "A blood pH disturbance where base is increased or acid is decreased, raising pH above the normal range.",
  alveoli: "Small air sacs in the lungs where oxygen and carbon dioxide exchange occurs.",
  amiodarone: "A potassium channel blocker antiarrhythmic used for serious rhythm disturbances; course materials flag special considerations such as thyroid concerns.",
  anemia: "A reduced red blood cell mass or hemoglobin level that lowers oxygen-carrying capacity.",
  angioedema: "Rapid swelling of deeper skin or mucosal tissues; ACE inhibitors can rarely cause airway-threatening angioedema.",
  antibiotic: "A medication used to treat bacterial infection; selection depends on likely organism, allergies, site of infection, and safety factors.",
  antihistamine: "A drug that blocks histamine receptors to reduce allergic symptoms such as itching, sneezing, and rhinorrhea.",
  antiplatelet: "A medication that reduces platelet aggregation and helps prevent arterial clot formation.",
  arrhythmia: "An abnormal heart rhythm caused by altered impulse formation or conduction.",
  aspirin: "An antiplatelet medication used in cardiovascular disease to reduce platelet aggregation.",
  asthma: "A chronic inflammatory airway disease marked by reversible bronchoconstriction, wheeze, and dyspnea.",
  atelectasis: "Collapse or incomplete expansion of alveoli, reducing ventilation in affected lung tissue.",
  atorvastatin: "A statin that inhibits HMG-CoA reductase to lower LDL cholesterol and cardiovascular risk.",
  "atrial fibrillation": "An irregular atrial rhythm that reduces atrial kick and increases thromboembolic stroke risk.",
  "atrial flutter": "A rapid atrial tachyarrhythmia often associated with a sawtooth waveform on ECG.",
  "av node": "The atrioventricular node delays electrical conduction between atria and ventricles.",
  "b cell": "A lymphocyte involved in humoral immunity that can differentiate into plasma cells and produce antibodies.",
  "b-cell": "A lymphocyte involved in humoral immunity that can differentiate into plasma cells and produce antibodies.",
  basophil: "A granulocyte involved in allergic and hypersensitivity responses through histamine release.",
  "beta 2 agonist": "A bronchodilator class that stimulates beta-2 receptors in airway smooth muscle; short-acting agents like albuterol are rescue medications.",
  "beta blocker": "A drug class that blocks beta-adrenergic receptors to reduce heart rate, contractility, and blood pressure.",
  "beta-adrenergic blocker": "A beta blocker; this class reduces sympathetic beta-receptor effects and requires attention to heart rate and blood pressure.",
  bicarbonate: "A major base in the bicarbonate-carbonic acid buffer system that helps regulate blood pH.",
  bisacodyl: "A stimulant laxative/cathartic used to promote bowel movement.",
  bradycardia: "A slower-than-normal heart rate, commonly defined in adults as below 60 beats per minute.",
  bronchiectasis: "Permanent bronchial dilation usually caused by chronic infection and inflammation.",
  bronchodilation: "Widening of the airways, usually by relaxation of bronchial smooth muscle.",
  bronchospasm: "Constriction of bronchial smooth muscle that narrows airways and increases work of breathing.",
  "bun": "Blood urea nitrogen, a kidney function marker that rises when renal clearance falls or protein breakdown increases.",
  calcium: "An electrolyte important for bone structure, neuromuscular signaling, clotting, and cardiac function.",
  "calcium channel blocker": "A cardiovascular medication class that blocks calcium entry into cells; some agents primarily affect vessels and others affect heart rate/contractility.",
  carvedilol: "A nonselective beta blocker with alpha-1 blocking effects used in heart failure and hypertension.",
  chemotaxis: "Directed movement of immune cells toward chemical signals at an injury or infection site.",
  "chronic bronchitis": "A COPD phenotype with chronic productive cough from mucus hypersecretion and airway inflammation.",
  "chronic kidney disease": "Progressive, long-term reduction in kidney function, often related to diabetes or hypertension.",
  copd: "Chronic obstructive pulmonary disease, commonly emphysema or chronic bronchitis, with persistent airflow limitation.",
  creatinine: "A muscle metabolism waste product used as a marker of kidney filtration.",
  cyanosis: "Bluish discoloration of skin or mucous membranes caused by reduced oxygenation.",
  diabetes: "A metabolic disease involving impaired insulin secretion, insulin action, or both, causing hyperglycemia.",
  "diabetes mellitus": "A disorder of glucose regulation caused by impaired insulin secretion, insulin action, or both.",
  diffusion: "Passive movement of molecules from higher to lower concentration; alveolar gas exchange occurs by diffusion.",
  diltiazem: "A nondihydropyridine calcium channel blocker that can affect heart rate and contractility.",
  digoxin: "A cardiac glycoside that increases contractility and slows AV nodal conduction; toxicity risk rises with bradycardia and electrolyte imbalance.",
  diphenhydramine: "A first-generation antihistamine with sedating and anticholinergic effects such as dry mouth, urinary retention, and blurred vision.",
  diuretic: "A medication that increases urine output by altering kidney sodium and water handling.",
  dobutamine: "A beta-adrenergic agonist/inotrope used in selected shock or low cardiac output states to support contractility.",
  dopamine: "A vasoactive medication that can support blood pressure and cardiac output depending on dose and clinical context.",
  dyspnea: "Subjective shortness of breath or difficulty breathing.",
  ecg: "Electrocardiogram, a surface recording of the heart's electrical activity.",
  edema: "Excess fluid accumulation in interstitial tissues.",
  emphysema: "A COPD phenotype involving alveolar wall destruction, air trapping, and reduced elastic recoil.",
  epinephrine: "A catecholamine that stimulates alpha and beta receptors; used for anaphylaxis and severe shock states.",
  erythrocyte: "A red blood cell that carries oxygen through hemoglobin.",
  erythropoietin: "A kidney-produced hormone that stimulates red blood cell production in bone marrow.",
  excretion: "Removal of drugs or waste products from the body, commonly through the kidneys.",
  "first-generation antihistamine": "An older antihistamine class that crosses the blood-brain barrier more readily, causing more sedation and anticholinergic effects such as dry mouth, urinary retention, constipation, and blurred vision.",
  "first-pass metabolism": "Presystemic drug metabolism in the gut wall or liver before a drug reaches systemic circulation.",
  fluticasone: "An inhaled corticosteroid used for long-term control of airway inflammation.",
  formoterol: "A long-acting beta-2 agonist used for maintenance bronchodilation, not as sole rescue therapy for asthma.",
  "fourth-generation antihistamine": "A nonstandard or less commonly emphasized antihistamine generation label in this course context. Course questions usually contrast sedating first-generation agents with less-sedating second- and third-generation antihistamines.",
  furosemide: "A loop diuretic used for rapid fluid removal in edema, heart failure, and pulmonary edema.",
  granulocyte: "A white blood cell with cytoplasmic granules, including neutrophils, eosinophils, and basophils.",
  hematocrit: "The percentage of blood volume occupied by red blood cells.",
  hematopoiesis: "The production and development of blood cells, primarily in bone marrow.",
  hemoglobin: "The oxygen-carrying protein inside red blood cells.",
  "heparin": "An anticoagulant that increases antithrombin activity to reduce clot formation.",
  histamine: "An inflammatory mediator released by mast cells and basophils that causes vasodilation, permeability, itching, and bronchoconstriction.",
  hydrochlorothiazide: "A thiazide diuretic used for hypertension and mild edema; it can lower potassium.",
  hypercalcemia: "An elevated serum calcium level that can cause weakness, lethargy, constipation, and cardiac rhythm changes.",
  hyperkalemia: "An elevated serum potassium level that can cause dangerous cardiac conduction changes.",
  hypertension: "Persistently elevated blood pressure that increases risk for heart, kidney, brain, and vascular damage.",
  hypokalemia: "A low serum potassium level that can cause muscle weakness and cardiac rhythm changes.",
  hypomagnesemia: "A low serum magnesium level, often associated with alcohol use disorder, GI loss, or renal wasting.",
  hypoxemia: "Low oxygen level in arterial blood.",
  inflammation: "A protective response to injury or infection involving vascular changes and immune-cell recruitment.",
  insulin: "A hormone and medication that lowers blood glucose by promoting cellular glucose uptake and storage.",
  ipratropium: "A short-acting muscarinic antagonist that reduces bronchoconstriction by blocking airway muscarinic receptors.",
  ischemia: "Reduced blood flow and oxygen delivery to tissue.",
  leukocyte: "A white blood cell involved in immune defense.",
  leukotriene: "An inflammatory mediator that contributes to bronchoconstriction, mucus production, and airway edema.",
  lisinopril: "An ACE inhibitor used for hypertension, heart failure, and kidney protection in selected patients.",
  loperamide: "An antidiarrheal medication that slows intestinal motility and is used only when appropriate for the cause of diarrhea.",
  lymphocyte: "A white blood cell involved in adaptive immunity, including B cells, T cells, and natural killer cells.",
  lymphocytes: "White blood cells involved in adaptive immunity, including B cells, T cells, and natural killer cells.",
  magnesium: "An electrolyte important for neuromuscular function, enzyme activity, and cardiac rhythm stability.",
  mannitol: "An osmotic diuretic given intravenously to pull fluid into the vascular space and promote diuresis.",
  metformin: "A biguanide antihyperglycemic drug that lowers hepatic glucose production and improves insulin sensitivity.",
  methotrexate: "An antimetabolite immunosuppressant used in rheumatoid arthritis and some cancers.",
  metoprolol: "A beta-1 selective blocker used for hypertension, angina, rate control, and heart failure indications.",
  monoclonal: "Related to an antibody product designed to bind a specific target antigen.",
  "monoclonal antibody": "A targeted biologic medication that binds a specific immune or disease-related target; course materials emphasize infection risk with immune suppression.",
  montelukast: "A leukotriene receptor antagonist used for asthma maintenance and allergic rhinitis; it carries neuropsychiatric warning concerns.",
  mucosal: "Related to a mucus-secreting membrane lining body passages such as the GI or respiratory tract.",
  "mycophenolate mofetil": "An immunosuppressant that inhibits lymphocyte proliferation by interfering with purine synthesis; used in transplant rejection prevention and some autoimmune conditions.",
  nephron: "The kidney's functional filtration unit.",
  nephrotoxic: "Capable of causing kidney injury.",
  neutrophil: "The most numerous granulocyte and a key phagocyte in acute bacterial infection.",
  nitroglycerin: "A nitrate vasodilator that reduces preload and myocardial oxygen demand, often used for angina.",
  norepinephrine: "A catecholamine vasopressor that strongly stimulates alpha receptors and raises blood pressure.",
  nsaid: "A nonsteroidal anti-inflammatory drug; this class can contribute to GI mucosal injury and peptic ulcer disease.",
  "nsaid use": "Use of nonsteroidal anti-inflammatory drugs, which can increase peptic ulcer risk by impairing protective gastric mucosal mechanisms.",
  omeprazole: "A proton pump inhibitor that reduces gastric acid production and is used for GERD and peptic ulcer-related therapy.",
  ondansetron: "A serotonin 5-HT3 receptor antagonist antiemetic used for nausea and vomiting.",
  opioid: "A pain medication class that can slow GI motility and increase constipation risk.",
  perfusion: "Blood flow through tissue or an organ.",
  penicillin: "A beta-lactam antibiotic class; allergy history should be assessed before giving related antibiotics.",
  phagocytosis: "Cellular engulfment and digestion of particles, microbes, or debris.",
  platelet: "A blood cell fragment involved in clot formation; also called a thrombocyte.",
  potassium: "A major intracellular electrolyte essential for nerve, muscle, and cardiac electrical function.",
  "potassium chloride": "An electrolyte replacement used to treat or prevent hypokalemia; IV administration requires careful safety precautions.",
  preload: "Ventricular stretch at the end of diastole, related to venous return and filling volume.",
  "pulmonary edema": "Fluid accumulation in lung interstitium or alveoli, often from left-sided heart failure.",
  prednisone: "A systemic corticosteroid that suppresses inflammation and immune responses; long-term use can increase infection risk, hyperglycemia, hypertension, adrenal suppression, and bone loss.",
  respiration: "Gas exchange involving oxygen uptake and carbon dioxide removal at the lungs or tissues.",
  salmeterol: "A long-acting beta-2 agonist used for maintenance bronchodilation, not rescue therapy.",
  "sa node": "The sinoatrial node, the normal pacemaker of the heart.",
  "second-generation antihistamine": "A newer antihistamine class with less central nervous system penetration than first-generation agents, so it usually causes less sedation while treating allergy symptoms.",
  sodium: "A major extracellular electrolyte central to fluid balance, nerve conduction, and blood pressure regulation.",
  spironolactone: "A potassium-sparing aldosterone antagonist used in heart failure and selected resistant hypertension or edema states.",
  statin: "A cholesterol-lowering drug class that inhibits HMG-CoA reductase.",
  surfactant: "A substance that lowers alveolar surface tension and helps keep alveoli open.",
  tacrolimus: "A calcineurin inhibitor immunosuppressant that suppresses T-cell activation; used in transplant rejection prevention and some immune-mediated conditions.",
  tachycardia: "A faster-than-normal heart rate, commonly above 100 beats per minute in adults.",
  "t cell": "A lymphocyte involved in cell-mediated immunity, including helper, cytotoxic, and regulatory immune functions.",
  "t-cell": "A lymphocyte involved in cell-mediated immunity, including helper, cytotoxic, and regulatory immune functions.",
  "third-generation antihistamine": "A later antihistamine class or active-metabolite group with low sedation risk compared with first-generation antihistamines; course questions use it as a less-sedating allergy option.",
  thrombocyte: "Another name for a platelet, a cell fragment involved in clotting.",
  thrombolytic: "A medication class that breaks down clots, used only in specific high-risk situations because bleeding risk is significant.",
  tiotropium: "A long-acting muscarinic antagonist used for maintenance bronchodilation, especially in COPD.",
  tidal: "Related to tidal volume, the amount of air inhaled or exhaled in a normal breath.",
  "type i hypersensitivity": "An immediate IgE-mediated allergic reaction, such as anaphylaxis, allergic asthma, or hay fever.",
  "type ii hypersensitivity": "An antibody-mediated cytotoxic reaction where antibodies target antigens on cell surfaces.",
  "type iii hypersensitivity": "An immune-complex reaction where antigen-antibody complexes deposit in tissues and trigger inflammation.",
  "type iv hypersensitivity": "A delayed, T-cell mediated hypersensitivity reaction that usually develops over 24 to 72 hours.",
  ventilation: "Movement of air into and out of the respiratory tract.",
  vasoconstriction: "Narrowing of blood vessels due to smooth muscle contraction.",
  vasopressor: "A medication used to raise blood pressure in shock states, usually by increasing vascular tone and sometimes cardiac output.",
  warfarin: "An oral anticoagulant that interferes with vitamin K-dependent clotting factors and requires careful monitoring.",
  wheezing: "A high-pitched breath sound caused by narrowed airways.",
};

Object.assign(medicalTerms, {
  acyclovir: "An antiviral used for herpes simplex and varicella-zoster infections. It inhibits viral DNA polymerase and requires hydration and renal-function attention, especially with IV therapy or other nephrotoxic drugs.",
  alprazolam: "A benzodiazepine used short-term for panic or severe anxiety symptoms. It enhances GABA activity and can cause sedation, dependence, and dangerous CNS depression with alcohol, opioids, sleep aids, or other depressants.",
  amoxicillin: "A penicillin antibiotic that inhibits bacterial cell-wall synthesis. Course teaching emphasizes allergy screening, GI effects, superinfection risk, renal monitoring when relevant, and finishing the full prescribed course.",
  "amphotericin b": "A systemic antifungal associated with significant toxicity concerns, especially infusion reactions and kidney effects. Course materials emphasize that systemic antifungals can be highly toxic.",
  "beta-lactam": "An antibiotic group with a beta-lactam ring, including penicillins, cephalosporins, and carbapenems. These drugs generally inhibit bacterial cell-wall synthesis.",
  cefazolin: "A first-generation cephalosporin prototype in the course. It inhibits bacterial cell-wall synthesis and requires allergy screening and renal-function awareness.",
  cephalexin: "An oral cephalosporin antibiotic used for selected skin and other bacterial infections. Teaching includes finishing the course, watching for allergy or severe diarrhea, and taking as directed.",
  chloroquine: "An antimalarial used for strain-sensitive malaria treatment or prophylaxis. Course cautions include retinal or visual-field changes and resistance patterns by travel region.",
  "culture and sensitivity": "A lab process that identifies the pathogen and which anti-infectives are likely to kill it. When cultures are ordered, they are typically collected before antibiotics so results are not distorted by early treatment.",
  "c. difficile": "Clostridioides difficile, a bacterium that can overgrow after antibiotics disrupt normal flora and cause watery diarrhea and colitis. Course materials link treatment to enteric precautions, fluids/electrolytes, and vancomycin or metronidazole.",
  diazepam: "A benzodiazepine used for anxiety, seizures, muscle spasm, and sedation contexts. It enhances GABA activity and can cause CNS and respiratory depression, especially with other depressants.",
  donepezil: "A cholinesterase inhibitor used for Alzheimer disease symptoms. It increases acetylcholine signaling and can cause GI effects, bradycardia, syncope, and sleep disturbance.",
  ertapenem: "A carbapenem antibiotic used for selected severe or resistant bacterial infections. Course safety themes include renal function, hypersensitivity, GI effects, superinfection, and seizure risk.",
  fluoxetine: "An SSRI that blocks serotonin reuptake. Course teaching emphasizes delayed onset, not stopping abruptly, serotonin syndrome risk, suicidality monitoring in young adults, bleeding/QT concerns, and avoiding St. John's wort or MAOI combinations.",
  gabapentin: "A GABA structural analog used for neurogenic pain and seizure-related therapy. Key safety concerns include dizziness, drowsiness, falls, additive CNS depression, and renal dosing.",
  gad: "Generalized anxiety disorder, involving persistent excessive worry with symptoms such as restlessness, tension, fatigue, irritability, sleep difficulty, and concentration problems.",
  "generalized anxiety disorder": "A mental health condition marked by persistent excessive worry and physical/cognitive symptoms. Course materials connect it with norepinephrine, serotonin, GABA, stress, trauma, and autonomic activation.",
  inh: "Isoniazid, an antitubercular used for latent TB and in combination regimens for active TB. Monitor liver injury symptoms and peripheral neuropathy.",
  isoniazid: "An antitubercular medication that inhibits mycobacterial cell-wall formation. Course teaching emphasizes liver enzymes, avoiding alcohol, peripheral neuropathy, interactions with phenytoin and benzodiazepines, and empty-stomach administration.",
  ibuprofen: "An NSAID used for pain, fever, and inflammation. Safety concerns include GI bleeding, kidney effects, fluid retention, blood pressure effects, and bleeding risk.",
  "levodopa-carbidopa": "A dopaminergic Parkinson disease medication. Levodopa supports dopamine signaling, while carbidopa limits peripheral conversion; monitor orthostatic hypotension, dyskinesias, hallucinations, and wearing-off effects.",
  malaria: "A protozoal infection transmitted by Anopheles mosquitoes. Course manifestations include cyclic fever, chills, diaphoresis, headache, vomiting, anemia risk, and severe illness if untreated.",
  metronidazole: "An anti-infective used for selected anaerobic or protozoal infections and discussed with C. difficile treatment options. Teaching commonly includes GI effects and avoiding alcohol when prescribed.",
  mrsa: "Methicillin-resistant Staphylococcus aureus, resistant to most beta-lactam antibiotics. Serious hospital-acquired MRSA infections are commonly treated with IV vancomycin when susceptible and clinically appropriate.",
  naloxone: "An opioid antagonist that reverses opioid-induced respiratory and CNS depression. Airway and breathing remain the priority, and repeated monitoring is needed because opioid effects can return.",
  nystatin: "An antifungal used for candidiasis, including oral thrush. Oral suspension teaching usually includes swishing around the mouth before swallowing or as prescribed.",
  parkinson: "Parkinson disease involves impaired dopaminergic motor signaling, causing symptoms such as tremor, rigidity, bradykinesia, and postural instability.",
  phenytoin: "A hydantoin antiseizure medication with important toxicity, oral-health, rash, liver, pregnancy, and drug-interaction considerations.",
  "panic attack": "A sudden episode of intense fear with autonomic symptoms such as chest pressure, sweating, shaking, tachypnea, palpitations, dizziness, or nausea.",
  ssri: "Selective serotonin reuptake inhibitor, an antidepressant class that increases serotonin signaling by blocking reuptake. Fluoxetine is the course example.",
  "serotonin syndrome": "A potentially serious serotonergic toxicity pattern with mental status changes, autonomic instability, tremor or hyperreflexia, sweating, diarrhea, and fever in severe cases.",
  "trimethoprim-sulfamethoxazole": "A sulfonamide combination also called Bactrim. Course safety themes include renal/liver function, hydration, hyperkalemia, photosensitivity, rash/SJS, blood dyscrasias, and superinfection.",
  vancomycin: "A glycopeptide antibiotic active against gram-positive organisms and used for serious MRSA infections and C. difficile by oral route. Monitor renal function, hearing/vestibular symptoms, levels when ordered, and infusion reaction risk.",
  "vancomycin flushing syndrome": "A vancomycin infusion reaction associated with flushing, itching, rash, and sometimes hypotension. Slow IV infusion, commonly over at least 1 hour depending on dose and policy, reduces risk.",
});

Object.assign(medicalTerms, {
  "absolute insulin deficiency": "A state where the body produces little to no insulin, classically from pancreatic beta-cell destruction in type 1 diabetes. Without insulin, glucose cannot enter many cells effectively, blood glucose rises, and the client is at risk for ketosis and diabetic ketoacidosis.",
  "acute kidney injury": "A sudden decline in kidney filtration that can raise creatinine and BUN, reduce urine output, and disturb fluid, electrolyte, and acid-base balance. Normal adult serum creatinine is roughly 0.6-1.3 mg/dL, but the trend and baseline matter clinically.",
  "acute renal failure": "Older wording for acute kidney injury: a sudden decline in kidney filtration that can raise BUN and creatinine, reduce urine output, and disturb fluid, electrolyte, and acid-base balance.",
  "adrenergic antagonist": "A medication that blocks adrenergic receptors and reduces sympathetic nervous system effects. In cardiovascular questions, this often refers to drugs that lower heart rate, contractility, vascular tone, or blood pressure depending on receptor selectivity.",
  albumin: "The major plasma protein that maintains oncotic pressure and binds many medications in the bloodstream. Normal serum albumin is roughly 3.5-5.0 g/dL; low albumin can increase free levels of highly protein-bound drugs and contribute to edema.",
  alteplase: "A thrombolytic medication, also called tPA, that dissolves fibrin clots in carefully selected patients such as some ischemic stroke cases. It carries major bleeding risk and has strict contraindications, including low platelets or other bleeding risks.",
  alkalosis: "A blood pH disturbance where base is increased or acid is decreased, raising pH above the normal arterial range of about 7.35-7.45. Respiratory alkalosis usually reflects low PaCO2 from hyperventilation.",
  anemia: "A reduced red blood cell mass or hemoglobin level that lowers oxygen-carrying capacity. It commonly causes fatigue, pallor, tachycardia, and dyspnea on exertion; normal adult hemoglobin is roughly 12-16 g/dL in females and 13.5-17.5 g/dL in males.",
  antacid: "A medication class that neutralizes existing gastric acid rather than preventing acid production. Calcium carbonate is an example; antacids can provide quick symptom relief but may cause acid rebound or electrolyte-related concerns depending on the agent.",
  "arterial blood gas": "A blood test used to evaluate oxygenation, ventilation, and acid-base balance. Common reference points are pH 7.35-7.45, PaCO2 35-45 mm Hg, HCO3 22-26 mEq/L, and PaO2 about 80-100 mm Hg on room air.",
  absorption: "Movement of a drug or nutrient from the site of entry into the bloodstream or body tissues. It is one of the ADME pharmacokinetic processes: absorption, distribution, metabolism, and excretion.",
  beclomethasone: "An inhaled corticosteroid used for long-term asthma control by reducing airway inflammation. Clients should rinse the mouth after use to reduce local candidiasis/thrush risk.",
  "beta cell": "An endocrine pancreatic cell in the islets of Langerhans that produces insulin. Beta-cell destruction causes absolute insulin deficiency, which is the core problem in type 1 diabetes.",
  "beta-cell": "An endocrine pancreatic cell in the islets of Langerhans that produces insulin. Beta-cell destruction causes absolute insulin deficiency, which is the core problem in type 1 diabetes.",
  "beta-cell destruction": "Loss of insulin-producing pancreatic beta cells, most often from autoimmune destruction in type 1 diabetes. The result is absolute insulin deficiency, hyperglycemia, and risk for ketoacidosis.",
  bisoprolol: "A beta-1 selective beta blocker used in cardiovascular disease, including selected heart failure patients. Like other beta blockers, it can lower heart rate and blood pressure and requires assessment before administration.",
  bicarbonate: "A major base in the bicarbonate-carbonic acid buffer system that helps regulate blood pH. Normal serum bicarbonate or arterial HCO3 is about 22-26 mEq/L; low values suggest metabolic acidosis and high values suggest metabolic alkalosis or compensation.",
  "blood urea nitrogen": "A nitrogenous waste marker of kidney function and protein metabolism, commonly abbreviated BUN. A typical adult range is about 7-20 mg/dL; it can rise with reduced renal perfusion, kidney injury, dehydration, or increased protein breakdown.",
  bun: "Blood urea nitrogen, a kidney function marker that rises when renal clearance falls or protein breakdown increases. A typical adult range is about 7-20 mg/dL, but interpretation depends on hydration, renal perfusion, and clinical context.",
  calcium: "An electrolyte important for bones, neuromuscular signaling, clotting, and cardiac function. Normal total serum calcium is roughly 8.5-10.5 mg/dL; low calcium can cause tetany, while high calcium can cause weakness, lethargy, constipation, and dysrhythmias.",
  "calcium acetate": "A phosphate binder used in chronic kidney disease to bind dietary phosphate in the GI tract and reduce serum phosphate absorption. It is taken with meals as prescribed rather than only when feeling ill.",
  "calcium carbonate": "An antacid and calcium supplement that neutralizes gastric acid. In GI pharmacology questions, it can be associated with acid rebound and constipation, and it may affect calcium balance.",
  "cardiac output": "The amount of blood the heart pumps per minute, calculated as heart rate multiplied by stroke volume. Normal resting adult cardiac output is roughly 4-8 L/min, and it falls when filling, contractility, rhythm, or afterload are impaired.",
  "chronic kidney disease": "Progressive, long-term reduction in kidney function, often related to diabetes or hypertension. CKD can impair waste excretion, fluid and electrolyte balance, acid-base control, blood pressure regulation, vitamin D activation, and erythropoietin production.",
  "cortisol": "A glucocorticoid hormone from the adrenal cortex that helps regulate stress response, glucose metabolism, inflammation, vascular tone, and fluid balance. Excess cortisol is associated with Cushing syndrome and can cause hyperglycemia, weight/fat redistribution, hypertension, and fluid changes.",
  "creatinine": "A muscle metabolism waste product used as a marker of kidney filtration. Normal adult serum creatinine is roughly 0.6-1.3 mg/dL, but baseline muscle mass matters; rising creatinine usually signals reduced kidney filtration.",
  "cushing syndrome": "A disorder caused by prolonged excess cortisol exposure. Common findings include hyperglycemia, hypertension, fluid retention, muscle weakness, thin skin, infection risk, and characteristic fat redistribution such as truncal obesity or moon face.",
  diabetes: "A metabolic disease involving impaired insulin secretion, insulin action, or both, causing hyperglycemia. Fasting blood glucose is normally about 70-99 mg/dL; diabetes is diagnosed using criteria such as fasting glucose at or above 126 mg/dL or A1c at or above 6.5%.",
  "diabetes mellitus": "A disorder of glucose regulation caused by impaired insulin secretion, insulin action, or both. Persistent hyperglycemia damages blood vessels and nerves and increases risk for kidney disease, cardiovascular disease, infection, and ketoacidosis in type 1 diabetes.",
  "diabetic ketoacidosis": "A serious complication caused by insulin deficiency, lipolysis, ketone production, dehydration, and metabolic acidosis. It is most associated with type 1 diabetes and commonly presents with hyperglycemia, ketones, low pH, and low bicarbonate.",
  epoetin: "A synthetic erythropoietin-stimulating medication that increases red blood cell production. It is used for selected anemias such as chronic kidney disease-related anemia and can worsen hypertension, so blood pressure monitoring is important.",
  "erythrocyte": "A red blood cell that carries oxygen through hemoglobin. Normal RBC count varies by lab and sex, but the nursing significance is oxygen delivery; low erythrocytes, hemoglobin, or hematocrit can cause anemia symptoms.",
  "erythrocyte count": "A count of red blood cells, which carry oxygen through hemoglobin. A typical adult range is roughly 4.2-5.9 million cells/mcL depending on sex and lab; low values can reduce oxygen-carrying capacity.",
  erythropoietin: "A kidney-produced hormone that stimulates red blood cell production in bone marrow. Kidney disease can reduce erythropoietin, lowering hemoglobin and hematocrit and contributing to anemia.",
  "fluid changes": "Alterations in body water distribution or retention, often seen as edema, weight change, blood pressure change, or altered urine output. In endocrine disorders such as Cushing syndrome, cortisol effects can promote sodium and water retention.",
  famotidine: "An H2 receptor antagonist that reduces gastric acid secretion by blocking histamine H2 receptors on gastric parietal cells. It is used for GERD, ulcers, and acid-related symptoms but works by a different mechanism than PPIs.",
  fexofenadine: "A later-generation antihistamine used for allergic rhinitis and urticaria. It has low blood-brain barrier penetration compared with first-generation antihistamines, so it is less sedating.",
  glucose: "The main blood sugar used by cells for energy. Normal fasting blood glucose is about 70-99 mg/dL; persistent elevation suggests impaired glucose regulation, and very low glucose can cause neuroglycopenic and adrenergic symptoms.",
  hematocrit: "The percentage of blood volume occupied by red blood cells. Normal adult hematocrit is roughly 36-46% in females and 41-53% in males; low hematocrit supports anemia and reduced oxygen-carrying capacity.",
  hemoglobin: "The oxygen-carrying protein inside red blood cells. Normal adult hemoglobin is roughly 12-16 g/dL in females and 13.5-17.5 g/dL in males; low hemoglobin is a key marker of anemia.",
  hypercalcemia: "An elevated serum calcium level, usually above about 10.5 mg/dL. It can cause weakness, lethargy, constipation, kidney stones, dehydration, and cardiac rhythm changes.",
  hyperglycemia: "An elevated blood glucose level. Fasting glucose is normally about 70-99 mg/dL; persistent fasting glucose at or above 126 mg/dL meets a diabetes diagnostic threshold, and acute marked hyperglycemia can cause dehydration and altered mental status.",
  hyperkalemia: "An elevated serum potassium level, commonly above about 5.0 mEq/L. It is dangerous because it can cause cardiac conduction changes such as peaked T waves and life-threatening dysrhythmias.",
  hydrocodone: "A Schedule II opioid analgesic used for moderate to severe pain. It has misuse and dependence risk and can cause respiratory depression, sedation, constipation, nausea, and other opioid adverse effects.",
  hypocalcemia: "A low serum calcium level, usually below about 8.5 mg/dL. It increases neuromuscular excitability and can cause paresthesias, muscle cramps, tetany, seizures, or prolonged QT interval.",
  hypoglycemia: "A low blood glucose level, commonly below 70 mg/dL. Symptoms may include sweating, tremor, palpitations, hunger, confusion, or seizures; beta blockers can mask some adrenergic warning signs.",
  hypokalemia: "A low serum potassium level, commonly below about 3.5 mEq/L. It can cause muscle weakness, cramps, ileus, and cardiac rhythm changes such as U waves.",
  hypomagnesemia: "A low serum magnesium level, often below about 1.7 mg/dL depending on the lab. It can cause neuromuscular irritability and dysrhythmias and is commonly associated with alcohol use disorder, GI loss, or renal wasting.",
  hyponatremia: "A low serum sodium level, commonly below 135 mEq/L. It can cause headache, confusion, seizures, and other neurologic symptoms because sodium strongly affects serum osmolality and brain water balance.",
  insulin: "A pancreatic beta-cell hormone and medication that lowers blood glucose by promoting cellular glucose uptake and storage. Normal fasting glucose is about 70-99 mg/dL; inadequate insulin effect causes hyperglycemia and, in type 1 diabetes, risk for ketoacidosis.",
  "insulin deficiency": "Too little insulin effect to move glucose into cells and suppress ketone production. Absolute insulin deficiency is typical of type 1 diabetes and can lead to hyperglycemia, dehydration, and diabetic ketoacidosis.",
  "inhaled corticosteroid": "A controller medication class for asthma that reduces airway inflammation over time. It is not a rescue bronchodilator, and clients should rinse the mouth after use to reduce thrush risk.",
  "h2 receptor antagonist": "A gastric acid-reducing medication class that blocks histamine H2 receptors on parietal cells. Famotidine is an example; it reduces acid secretion but does not block the proton pump directly.",
  iron: "A mineral used therapeutically to treat iron-deficiency anemia by supporting hemoglobin and red blood cell production. Oral iron can cause GI upset, constipation, and dark green or black stools.",
  laba: "Long-acting beta-2 agonist, a maintenance bronchodilator class used for long-term control, not as sole rescue treatment for acute bronchospasm. Examples include salmeterol and formoterol.",
  lama: "Long-acting muscarinic antagonist, a maintenance bronchodilator class that blocks airway muscarinic receptors to reduce bronchoconstriction. Tiotropium is a common example, especially in COPD.",
  "leukotriene receptor antagonist": "A controller medication class that blocks leukotriene effects involved in bronchoconstriction, mucus, and airway inflammation. Montelukast and zafirlukast are examples; montelukast has neuropsychiatric warning concerns.",
  lmwh: "Low-molecular-weight heparin, an anticoagulant class related to heparin with more predictable dosing and lower risk of thrombocytopenia than unfractionated heparin.",
  loratadine: "A second-generation antihistamine used for allergic rhinitis and urticaria. It usually causes less sedation than first-generation antihistamines because it has lower central nervous system penetration.",
  "loop diuretic": "A diuretic class, such as furosemide, that acts in the loop of Henle and can remove fluid rapidly. Nursing priorities include monitoring blood pressure, volume status, urine output, and electrolytes such as potassium.",
  "low-molecular-weight heparin": "An anticoagulant class related to heparin with more predictable dosing and lower risk of thrombocytopenia than unfractionated heparin. Enoxaparin is a common example, though the course question focuses on the class comparison.",
  magnesium: "An electrolyte important for neuromuscular function, enzyme activity, and cardiac rhythm stability. A typical serum magnesium range is about 1.7-2.2 mg/dL; low levels can cause tremor, weakness, tetany, or dysrhythmias.",
  nephron: "The kidney's functional filtration unit, made of a glomerulus and tubules. Nephrons filter blood, reabsorb needed substances, secrete wastes, and help regulate fluid, electrolytes, and acid-base balance.",
  "paCO2": "Partial pressure of carbon dioxide in arterial blood, reflecting ventilation. Normal PaCO2 is about 35-45 mm Hg; high PaCO2 points toward respiratory acidosis, while low PaCO2 points toward respiratory alkalosis.",
  "paO2": "Partial pressure of oxygen in arterial blood, reflecting oxygenation. Normal PaO2 on room air is about 80-100 mm Hg, though expected values decline with age and clinical context.",
  "ph": "A measure of acidity or alkalinity. Normal arterial blood pH is about 7.35-7.45; below this range is acidemia and above it is alkalemia.",
  platelet: "A blood cell fragment involved in clot formation; also called a thrombocyte. Normal platelet count is roughly 150,000-400,000 per microliter, and low levels increase bleeding risk.",
  potassium: "A major intracellular electrolyte essential for nerve, muscle, and cardiac electrical function. Normal serum potassium is about 3.5-5.0 mEq/L; both high and low levels can cause dangerous dysrhythmias.",
  sodium: "A major extracellular electrolyte central to fluid balance, nerve conduction, and blood pressure regulation. Normal serum sodium is about 135-145 mEq/L; abnormal levels can cause neurologic symptoms.",
  "osmotic diuretic": "A diuretic class that increases osmotic pressure in renal tubules to promote water excretion. Mannitol is an example and is given intravenously in course questions.",
  phentolamine: "An alpha-adrenergic blocker used as an antidote for some vasopressor extravasations, including norepinephrine, because it counteracts local vasoconstriction.",
  phytonadione: "Vitamin K1, used to reverse excessive warfarin anticoagulation by supporting synthesis of vitamin K-dependent clotting factors.",
  "potassium-sparing diuretic": "A diuretic class that promotes sodium and water excretion while retaining potassium. Spironolactone is an example, so hyperkalemia and potassium-containing salt substitutes are key safety concerns.",
  "proton pump inhibitor": "A gastric acid-suppressing medication class that blocks the H+/K+ ATPase proton pump in parietal cells. Omeprazole is an example and is typically taken before meals for best effect.",
  protamine: "A medication used to reverse heparin anticoagulation. In bleeding scenarios, it may be ordered after stopping heparin and notifying the provider.",
  "protamine sulfate": "A medication used to reverse heparin anticoagulation. It binds heparin and is distinct from vitamin K, which reverses warfarin.",
  saba: "Short-acting beta-2 agonist, a rescue bronchodilator class used for rapid relief of acute bronchospasm. Albuterol is the key course example.",
  sama: "Short-acting muscarinic antagonist, a bronchodilator class that blocks airway muscarinic receptors. Ipratropium is an example and may be used with other bronchodilators, but it is not the sole rescue drug for severe acute asthma.",
  "thiazide diuretic": "A diuretic class used for hypertension and mild edema that can lower potassium and sodium. Hydrochlorothiazide is the key course example.",
  "acid rebound": "A rebound increase in gastric acid secretion after acid has been neutralized or suppressed. In course GI questions, it is often linked to antacid effects that make the stomach respond by releasing more acid.",
  "acid-base": "Related to the body's regulation of acidity and alkalinity. Normal arterial pH is about 7.35-7.45; the lungs regulate carbon dioxide and the kidneys regulate bicarbonate and hydrogen ion handling.",
  "activated partial thromboplastin time": "A coagulation lab test, abbreviated aPTT, used to monitor IV unfractionated heparin therapy. Typical reference ranges vary by lab, but therapeutic heparin targets are intentionally higher than normal.",
  anticoagulant: "A medication that reduces formation or extension of blood clots. Heparin, LMWH, and warfarin are course examples, and bleeding is the major safety concern.",
  anticoagulation: "The therapeutic reduction of blood clotting. Nursing priorities include monitoring ordered labs, bleeding signs, contraindications, and reversal agents such as protamine for heparin or vitamin K for warfarin.",
  apoptosis: "Programmed cell death, a controlled process for removing cells. CLL is often described as involving mature B lymphocytes that resist apoptosis, so abnormal cells accumulate.",
  aptt: "Activated partial thromboplastin time, the lab commonly used to monitor IV unfractionated heparin. A markedly elevated aPTT with bleeding signs suggests excessive anticoagulation.",
  atrium: "An upper heart chamber that receives blood returning to the heart. The left atrium receives oxygenated blood from the lungs and sends it through the mitral valve to the left ventricle.",
  "atpase": "An enzyme that uses ATP energy to move substances across membranes. Gastric proton pump inhibitors such as omeprazole block the H+/K+ ATPase pump in parietal cells to reduce acid secretion.",
  "blood dyscrasia": "A broad term for an abnormal blood condition involving blood cells or clotting components. It can include problems such as anemia, leukopenia, thrombocytopenia, or abnormal clotting.",
  "bone marrow": "The soft tissue inside bones that produces blood cells through hematopoiesis. Leukemia can crowd the marrow and suppress normal red blood cell, white blood cell, and platelet production.",
  "bone mineral density": "A measure of bone strength and mineral content, often checked with a DEXA scan. Long-term corticosteroid therapy such as prednisone can reduce bone density and increase osteoporosis risk.",
  bronchodilator: "A medication that widens narrowed airways, usually by relaxing bronchial smooth muscle or blocking bronchoconstricting signals. Albuterol is the key rescue bronchodilator in course questions.",
  cardiotonic: "A drug that increases the force of cardiac contraction. Digoxin is the classic course example, but adrenergic receptor blockers used for hypertension are not cardiotonics.",
  catecholamine: "A sympathetic nervous system chemical such as epinephrine, norepinephrine, or dopamine. These substances can affect heart rate, contractility, vascular tone, and bronchodilation depending on receptor activity.",
  "chronic lymphocytic leukemia": "A chronic leukemia usually involving malignant mature B lymphocytes that resist apoptosis and accumulate over time. It generally progresses more slowly than acute leukemias.",
  "chronic respiratory failure": "A progressive inability of the respiratory system to maintain adequate oxygenation or ventilation in the setting of chronic lung disease. It differs from sudden acute respiratory failure because decline develops over time.",
  "clotting factor": "A plasma protein involved in the coagulation cascade. Warfarin reduces vitamin K-dependent clotting factors II, VII, IX, and X, which is why INR monitoring matters.",
  coagulation: "The blood-clotting process involving platelets and clotting factors. Coagulation tests such as PT, INR, and aPTT help monitor bleeding or anticoagulant therapy.",
  constipation: "Infrequent or difficult stool passage, often with hard stools or straining. Risk factors include low fiber intake, reduced mobility, bowel obstruction, and opioids.",
  "coronary artery disease": "Narrowing or blockage of coronary arteries that supply the myocardium. Risk factors include smoking, hypertension, diabetes, dyslipidemia, age, family history, and inflammatory disease.",
  "d-dimer": "A fibrin breakdown product that rises when clots are being formed and broken down. It can support suspicion for thromboembolism such as DVT or PE, but it is not specific by itself.",
  "deep vein thrombosis": "A blood clot in a deep vein, often in the leg. Typical findings include unilateral calf swelling, warmth, redness, and pain, and the clot can embolize to the lungs.",
  dvt: "Deep vein thrombosis, a clot in a deep vein that can lead to pulmonary embolism. Nursing assessment often focuses on unilateral swelling, warmth, redness, pain, and anticoagulation safety.",
  diarrhea: "Frequent loose or watery stools. It can result from infection, medications, inflammation, malabsorption, or altered motility, so it is not always caused by bacteria or viruses.",
  distribution: "Movement of a drug through the bloodstream into tissues after absorption. Distribution is affected by blood flow, body fat/water, albumin, and protein binding.",
  "duodenal ulcer": "A peptic ulcer located in the duodenum, the first part of the small intestine. Major risk factors include H. pylori infection and NSAID use.",
  "end stage kidney disease": "Stage 5 chronic kidney disease, typically defined by GFR below 15 mL/min/1.73 m2 or the need for dialysis or transplant.",
  endoscopy: "A procedure using a flexible camera to inspect internal body structures such as the esophagus, stomach, or duodenum. It can identify ulcers, inflammation, bleeding, or structural problems.",
  "enzyme inducer": "A substance that increases activity of drug-metabolizing enzymes, often lowering serum levels of other drugs metabolized by those pathways and risking subtherapeutic effects.",
  "gastric": "Related to the stomach. Gastric acid, parietal cells, antacids, H2 receptor antagonists, and proton pump inhibitors are central GI pharmacology terms in this course.",
  "gastric acid": "Hydrochloric acid secreted by stomach parietal cells. Excess acid or impaired mucosal protection contributes to GERD and peptic ulcer symptoms.",
  gastrointestinal: "Related to the digestive tract, including the mouth, esophagus, stomach, intestines, and accessory digestive organs. GI questions often focus on digestion, absorption, motility, ulcers, and acid suppression.",
  "glomerular filtration rate": "The estimated rate at which the kidneys filter blood, abbreviated GFR. Normal adult GFR is often around 90 mL/min/1.73 m2 or higher; values below 15 indicate stage 5 kidney disease.",
  glomerulus: "A tiny capillary filtering structure inside the nephron. Immune-complex deposition in glomerular basement membranes can damage kidney filtration in diseases such as lupus nephritis.",
  gfr: "Glomerular filtration rate, an estimate of kidney filtration. Normal adult GFR is often around 90 mL/min/1.73 m2 or higher; values below 15 indicate stage 5 kidney disease.",
  "half-life": "The time required for the amount of drug in the body to decrease by 50%. After two half-lives, about 75% of the drug has been eliminated.",
  "heparin-induced thrombocytopenia": "An immune-mediated complication of heparin exposure that lowers platelets and paradoxically increases clot risk. LMWH has a lower risk of this problem than unfractionated heparin.",
  hematuria: "Blood in the urine. In anticoagulation questions, hematuria can be an important bleeding sign, especially with a high INR or excessive anticoagulant effect.",
  "hodgkin lymphoma": "A lymphoma classically associated with Reed-Sternberg cells. Course questions often contrast Hodgkin lymphoma with non-Hodgkin lymphoma using this hallmark finding.",
  "h pylori": "Helicobacter pylori, a bacterium that can damage gastric mucosa and is a major cause of peptic ulcer disease. Treatment usually requires combination antibiotic and acid-suppression therapy.",
  "hydrogen-potassium adenosine triphosphate": "The H+/K+ ATPase proton pump in gastric parietal cells. Proton pump inhibitors such as omeprazole reduce gastric acid by inhibiting this enzyme system.",
  "hepatic engorgement": "Enlargement or congestion of the liver from backed-up venous blood. It is more associated with right-sided heart failure than isolated left-sided heart failure.",
  "hemolytic transfusion reaction": "A serious reaction in which transfused red blood cells are destroyed, usually from blood type incompatibility. It is a type II hypersensitivity mechanism involving antibodies against cell-surface antigens.",
  "immune complex": "A bound antigen-antibody pair. Type III hypersensitivity occurs when immune complexes deposit in tissues such as glomerular basement membranes and trigger inflammation.",
  "antigen-antibody": "A binding relationship between an antigen and a specific antibody. Immune-complex diseases involve antigen-antibody complexes depositing in tissues.",
  immunoglobulin: "An antibody protein made by B cells and plasma cells. IgE is associated with allergic reactions, IgG and IgM can mediate cytotoxic reactions, and immune complexes often involve antigen-antibody deposition.",
  "international normalized ratio": "A standardized version of prothrombin time used to monitor warfarin effect. A high INR means increased bleeding risk; many warfarin indications target an INR around 2-3, depending on the condition.",
  inr: "International normalized ratio, the lab used to monitor warfarin anticoagulation. An INR that is too high increases bleeding risk and may require holding warfarin and giving vitamin K depending on severity.",
  "intramuscular injection": "An injection into muscle tissue. IM injections are usually avoided when possible during heparin therapy because anticoagulation increases bleeding and hematoma risk.",
  "irreversible cell injury": "Cell damage severe enough that the cell cannot recover. Hallmarks include major membrane damage, lysosomal enzyme leakage, and cell death rather than reversible swelling alone.",
  "long-acting muscarinic antagonist": "A maintenance bronchodilator class, abbreviated LAMA, that blocks muscarinic receptors for prolonged reduction of bronchoconstriction. Tiotropium is a common example.",
  laryngospasm: "Sudden spasm of the vocal cords that can obstruct airflow. It is a serious neuromuscular sign associated with hypocalcemia.",
  "left atrium": "The upper left heart chamber that receives oxygenated blood from the lungs. Backflow from the left ventricle into the left atrium points to mitral valve regurgitation.",
  "left ventricle": "The high-pressure lower left heart chamber that pumps oxygenated blood to the systemic circulation. It is the thickest chamber because it pumps against systemic vascular resistance.",
  leukemia: "A malignancy of blood-forming tissue that causes abnormal white blood cell proliferation. Acute leukemias often involve immature cells that crowd bone marrow and suppress normal hematopoiesis.",
  "acute leukemia": "A rapidly developing leukemia involving immature blood cells, or blasts. Bone marrow crowding can lead to anemia, thrombocytopenia, infection risk, and bleeding risk.",
  "acute lymphoblastic leukemia": "An acute leukemia involving uncontrolled overproduction of immature lymphoid cells. These lymphoblasts crowd bone marrow and suppress normal hematopoiesis.",
  lymphoblast: "An immature lymphoid white blood cell precursor. In acute lymphoblastic leukemia, lymphoblasts proliferate abnormally and crowd bone marrow.",
  lymphoid: "Related to lymphocytes or lymph-forming tissues. B cells, T cells, natural killer cells, ALL, and CLL are lymphoid concepts.",
  lymphoma: "A cancer of lymphocytes or lymphatic tissue. Hodgkin lymphoma is associated with Reed-Sternberg cells; non-Hodgkin lymphoma is a broad group without that defining hallmark.",
  lupus: "An autoimmune disease in which the immune system can form autoantibodies and immune complexes that affect skin, joints, kidneys, blood cells, and other organs.",
  "lysosomal enzyme": "A digestive enzyme inside lysosomes that breaks down cellular material. Release of lysosomal enzymes after membrane rupture is a sign of irreversible cell injury.",
  malignancy: "Cancerous growth with abnormal cell proliferation and potential invasion or spread. Leukemia and lymphoma are hematologic malignancies.",
  "mitral valve": "The valve between the left atrium and left ventricle. Backflow from the left ventricle into the left atrium is mitral regurgitation.",
  medulla: "The brainstem region that helps regulate vital autonomic functions. In GI questions, the medulla can trigger vomiting in response to potentially toxic stimuli.",
  metabolism: "Chemical alteration of a drug or substance in the body, often by liver enzymes. Metabolism can activate prodrugs or inactivate drugs before excretion.",
  "modifiable risk factor": "A risk factor that can be changed through behavior, treatment, or environmental modification. Smoking is a modifiable risk factor for coronary artery disease.",
  "muscarinic antagonist": "A medication that blocks muscarinic cholinergic receptors. In the airways, this decreases bronchoconstriction and secretions; ipratropium and tiotropium are course examples.",
  "muscularis externa": "The smooth muscle layer of the GI tract that produces mixing and peristaltic movement. It is not the main layer responsible for nutrient absorption.",
  myeloid: "Related to bone marrow-derived blood cell lines such as granulocytes, monocytes, erythrocytes, and platelets. Myeloid malignancies differ from lymphoid leukemias such as ALL and CLL.",
  "myocardial infarction": "Heart muscle injury or death from insufficient coronary blood flow. Troponin elevation supports myocardial injury; STEMI and NSTEMI are major acute coronary syndrome categories.",
  neurotransmitter: "A chemical messenger released by nerves to signal other cells. Norepinephrine is an adrenergic neurotransmitter involved in sympathetic nervous system effects.",
  nocturia: "Waking at night to urinate. In right-sided heart failure, fluid from dependent edema can return to circulation when lying down, increasing nighttime urination.",
  "non-hodgkin lymphoma": "A broad group of lymphomas that do not have the Reed-Sternberg cell hallmark of Hodgkin lymphoma. Course questions may use this distinction diagnostically.",
  nstemi: "Non-ST-elevation myocardial infarction. It involves myocardial injury with elevated troponin but without the classic ST-elevation pattern of STEMI.",
  "new york heart association": "The New York Heart Association functional classification system grades heart failure symptoms from I to IV. Class IV means symptoms of cardiac insufficiency are present at rest.",
  "nyha classification": "New York Heart Association functional classification for heart failure. Class IV includes symptoms at rest and is associated with poor prognosis.",
  orthopnea: "Shortness of breath when lying flat, often relieved by sitting upright. It is classically associated with left-sided heart failure and pulmonary congestion.",
  "parietal cell": "A stomach cell that secretes gastric acid through the H+/K+ ATPase proton pump. PPIs act directly on this pump, while H2 blockers reduce histamine-driven acid secretion.",
  paresthesia: "An abnormal sensation such as tingling, prickling, or numbness. In calcium questions, paresthesias can point toward hypocalcemia.",
  peristalsis: "Coordinated wave-like smooth muscle contractions that move contents through the GI tract.",
  "peripheral edema": "Swelling in dependent tissues such as the feet, ankles, or legs from excess interstitial fluid. It is a common finding in right-sided heart failure and fluid overload.",
  petechiae: "Tiny red or purple pinpoint spots caused by small bleeding under the skin. They can occur with thrombocytopenia or excessive anticoagulation.",
  "peptic ulcer": "An erosion in the stomach or duodenal mucosa related to acid and pepsin exposure. Major causes include H. pylori infection, NSAID use, and Zollinger-Ellison syndrome.",
  polyuria: "Excessive urination. In electrolyte questions, thirst and polyuria commonly point toward hypercalcemia.",
  "prescription medication": "A medication that legally requires an order from a licensed prescriber. Safe disposal teaching includes protecting personal information and avoiding sharing prescribed drugs with others.",
  "prothrombin time": "A coagulation lab test, abbreviated PT, that helps evaluate the extrinsic clotting pathway. INR standardizes PT and is used to monitor warfarin therapy.",
  pt: "Prothrombin time, a coagulation test used with INR to monitor warfarin effect. It is not the main therapeutic monitoring test for IV unfractionated heparin.",
  "reed-sternberg cell": "A large abnormal cell that is the classic hallmark of Hodgkin lymphoma. Seeing this term in a question should cue Hodgkin lymphoma.",
  "renal failure": "Reduced kidney function severe enough to impair waste removal, fluid balance, electrolyte balance, or acid-base regulation. Acute renal failure is now commonly called acute kidney injury.",
  "right-ventricular heart failure": "Failure of the right ventricle to move blood effectively into the pulmonary circulation. Findings often include peripheral edema, neck vein distention, hepatic congestion, and nocturia.",
  "right-sided heart failure": "Heart failure where systemic venous blood backs up because the right ventricle is not pumping effectively. Expected findings include peripheral edema, JVD, hepatic engorgement, and nocturia.",
  route: "The path by which a medication is administered, such as oral, IV, IM, sublingual, inhaled, or topical. Choosing the right route is one of the medication administration rights.",
  serosal: "The outer protective layer of much of the GI tract. It reduces friction but is not the main layer responsible for nutrient absorption.",
  "short-acting muscarinic antagonist": "A bronchodilator class, abbreviated SAMA, that blocks muscarinic receptors for short-term reduction of bronchoconstriction. Ipratropium is the key course example.",
  sle: "Systemic lupus erythematosus, an autoimmune disease that can form immune complexes affecting joints, skin, kidneys, blood cells, and other organs.",
  submucosal: "A supportive GI tract layer containing blood vessels, nerves, and connective tissue beneath the mucosa. It supports function but is not the main absorptive surface.",
  "sympathetic nervous system": "The fight-or-flight branch of the autonomic nervous system. It uses adrenergic signaling to affect heart rate, contractility, blood vessels, bronchi, and blood pressure.",
  "sympathetic receptor": "A receptor that responds to sympathetic neurotransmitters such as norepinephrine or epinephrine. Adrenergic antagonists block these receptors, while agonists stimulate them.",
  "steady-state": "The point during repeated dosing when drug intake and elimination are balanced, producing a relatively stable serum concentration. Enzyme induction can lower steady-state levels of affected medications.",
  stemi: "ST-elevation myocardial infarction, a myocardial infarction pattern associated with acute coronary artery occlusion and ST-segment elevation on ECG.",
  "st-segment depression": "An ECG finding that can indicate myocardial ischemia. With elevated troponin, it supports NSTEMI rather than stable angina.",
  thrombocytopenia: "A low platelet count, usually below about 150,000 per microliter. It increases bleeding risk and is a key safety concern with heparin-induced thrombocytopenia, leukemia, and some drug effects.",
  thromboembolic: "Related to a blood clot that forms and may travel through the bloodstream to block another vessel. DVT, pulmonary embolism, and embolic stroke are thromboembolic problems.",
  thromboembolism: "A blood clot that forms in one location and travels to obstruct blood flow elsewhere. Anticoagulants are used to prevent clot extension and embolic complications.",
  transplantation: "Transfer of an organ, tissue, or cells from a donor to a recipient. Immunosuppressant therapy lowers rejection risk but increases infection risk.",
  troponin: "A cardiac muscle protein released into blood with myocardial injury. Elevated troponin supports myocardial infarction in the right clinical and ECG context.",
  ventricle: "A lower heart chamber that pumps blood out of the heart. The right ventricle pumps to the lungs and the left ventricle pumps to the body.",
  "zollinger-ellison syndrome": "A disorder involving gastrin-secreting tumors that cause excessive gastric acid production and recurrent peptic ulcers.",
  tetany: "Involuntary muscle spasms or cramps caused by increased neuromuscular excitability. It is classically associated with hypocalcemia and may appear with tingling, carpopedal spasm, or a positive Chvostek or Trousseau sign.",
  "thyroid hormone": "Hormones T3 and T4 produced by the thyroid gland that regulate metabolic rate, temperature, energy use, and cardiovascular responsiveness. Low thyroid hormone slows metabolism, while excess thyroid hormone increases metabolic activity.",
  tpa: "Tissue plasminogen activator; alteplase is the medication example used to dissolve selected clots. It has strict eligibility rules because it can cause serious bleeding.",
  "vitamin k": "A fat-soluble vitamin needed to synthesize clotting factors II, VII, IX, and X. As phytonadione, it is used to reverse excessive warfarin effect.",
  zafirlukast: "A leukotriene receptor antagonist used for asthma maintenance, not acute rescue. It should be taken apart from meals because food can reduce absorption.",
  "5-ht3 receptor antagonist": "An antiemetic medication class that blocks serotonin 5-HT3 receptors involved in nausea and vomiting signaling. Ondansetron is the key course example and may require attention to QT prolongation risk in susceptible clients.",
  acth: "Adrenocorticotropic hormone from the anterior pituitary. In the HPA axis, ACTH stimulates the adrenal cortex to release cortisol, and cortisol provides negative feedback.",
  "addison disease": "Primary or secondary adrenal insufficiency with cortisol deficiency and sometimes aldosterone deficiency. Findings can include fatigue, weakness, weight loss, hypotension, hyponatremia, and hyperkalemia.",
  aminoglycoside: "An antibiotic class that includes gentamicin and is associated with nephrotoxicity and ototoxicity. Renal function, drug levels when ordered, and hearing or vestibular symptoms are important safety concerns.",
  "barrett esophagus": "A metaplastic change in the lower esophageal lining caused by chronic GERD exposure. It matters because it increases risk for esophageal adenocarcinoma and signals chronic mucosal injury.",
  "bulk-forming laxative": "A laxative class that absorbs water and increases stool bulk to stimulate bowel movement. Psyllium is the course example, and adequate fluid intake is important.",
  cimetidine: "An H2 receptor antagonist that lowers gastric acid secretion by blocking histamine H2 receptors on gastric parietal cells. It is used for acid-related disorders and has more drug-interaction concerns than some newer H2 blockers.",
  "clostridioides difficile": "A bacterium that can overgrow after antibiotics disrupt normal intestinal flora. It can cause severe watery diarrhea, abdominal pain, fever, dehydration, and colitis.",
  cll: "Chronic lymphocytic leukemia, usually a malignancy of mature B lymphocytes that resist apoptosis and accumulate. It often progresses more slowly than acute leukemias.",
  crh: "Corticotropin-releasing hormone from the hypothalamus. In the HPA axis, CRH stimulates pituitary ACTH release, which then stimulates adrenal cortisol release.",
  "diabetic ketoacidosis": "A serious complication of insulin deficiency with hyperglycemia, ketone production, dehydration, and metabolic acidosis. It is most associated with type 1 diabetes.",
  dic: "Disseminated intravascular coagulation, a systemic coagulopathy with widespread clotting, consumption of platelets and clotting factors, and subsequent bleeding risk. Sepsis, trauma, malignancy, and obstetric complications are common triggers.",
  duodenum: "The first part of the small intestine, immediately after the stomach. It is a common site of peptic ulcers and receives bile and pancreatic secretions for digestion.",
  "endothelial injury": "Damage to the inner blood vessel lining. It is one part of Virchow triad and promotes clot formation by exposing procoagulant surfaces and activating platelets.",
  "enteric nervous system": "The intrinsic nervous system of the GI tract. It coordinates local reflexes, motility, secretion, and blood flow in response to stretch and chemical contents.",
  epigastric: "Related to the upper central abdomen over the stomach area. Epigastric burning or gnawing pain is a common description in peptic ulcer disease and GERD questions.",
  erythromycin: "A macrolide antibiotic used for selected bacterial infections, including some situations where penicillin is contraindicated. It can cause GI effects, QT prolongation concerns, and drug interactions such as increased digoxin or warfarin effects.",
  enoxaparin: "A low-molecular-weight heparin anticoagulant used to prevent or treat thromboembolic disorders. It is commonly given subcutaneously and has more predictable effects than unfractionated heparin, but bleeding and thrombocytopenia remain safety concerns.",
  esophagitis: "Inflammation of the esophageal lining, often from chronic acid exposure in GERD. Symptoms can include heartburn, pain, dysphagia, or bleeding.",
  "factor xa": "A clotting factor in the common pathway that helps generate thrombin. Direct factor Xa inhibitors such as rivaroxaban reduce clot formation by blocking this step.",
  "factor xa inhibitor": "An anticoagulant class that blocks factor Xa and reduces thrombin generation. Rivaroxaban is the course example and carries bleeding risk without routine INR monitoring.",
  ferrous: "Related to iron in a form used in supplements such as ferrous sulfate. Oral ferrous products support hemoglobin production but commonly cause GI upset, constipation, and dark stools.",
  "ferrous sulfate": "An oral iron supplement used to treat iron-deficiency anemia. It can cause constipation, GI upset, and dark green or black stools; absorption may improve when taken apart from calcium-containing products.",
  fibrin: "An insoluble protein that stabilizes blood clots after the coagulation cascade converts fibrinogen to fibrin. Thrombolytics such as alteplase break down fibrin clots.",
  fluoroquinolone: "An antibiotic class associated with tendon injury, QT prolongation, CNS effects, dysglycemia, and chelation interactions with calcium, magnesium, aluminum, and iron. Course examples focus on safety teaching and absorption interactions.",
  folate: "A B vitamin needed for DNA synthesis and red blood cell development. Folate deficiency can cause macrocytic anemia.",
  gentamicin: "An aminoglycoside antibiotic. Key nursing concerns are nephrotoxicity and ototoxicity, so creatinine, ordered drug levels, hearing changes, tinnitus, and vertigo matter.",
  "graves disease": "An autoimmune cause of hyperthyroidism in which antibodies stimulate TSH receptors. Findings may include heat intolerance, weight loss, tachycardia, tremor, and goiter.",
  hematemesis: "Vomiting blood, which may look bright red or like coffee grounds. It usually indicates upper GI bleeding and requires clinical evaluation.",
  hematochezia: "Passage of bright red blood from the rectum. It often suggests lower GI bleeding, though brisk upper GI bleeding can sometimes also appear this way.",
  hhns: "Hyperglycemic hyperosmolar nonketotic syndrome, a severe hyperglycemic crisis most associated with type 2 diabetes. It causes profound dehydration and hyperosmolarity with little or no ketoacidosis compared with DKA.",
  "hpa axis": "The hypothalamic-pituitary-adrenal axis: hypothalamic CRH stimulates pituitary ACTH, which stimulates adrenal cortisol release. Cortisol provides negative feedback.",
  "hpt axis": "The hypothalamic-pituitary-thyroid axis: hypothalamic TRH stimulates pituitary TSH, which stimulates thyroid T3 and T4 release. Thyroid hormones provide negative feedback.",
  "hypercoagulability": "An increased tendency for blood to clot. It is one part of Virchow triad and can be caused by inherited disorders, malignancy, pregnancy, estrogen therapy, inflammation, or immobility-related states.",
  "hyperglycemic hyperosmolar nonketotic syndrome": "A severe type 2 diabetes complication with extreme hyperglycemia, dehydration, and high serum osmolality but minimal ketone production. It differs from DKA by having little or no ketoacidosis.",
  hyperthyroidism: "Excess thyroid hormone activity, often from Graves disease. Common findings include heat intolerance, weight loss, tachycardia, tremor, anxiety, and increased metabolic activity.",
  hypothyroidism: "Low thyroid hormone activity, commonly from Hashimoto syndrome. Findings often include fatigue, cold intolerance, weight gain, bradycardia, constipation, and slowed metabolism.",
  "hashimoto syndrome": "Autoimmune hypothyroidism caused by immune-mediated thyroid destruction. It is the most common cause of thyroid hormone deficiency in many settings.",
  amlodipine: "A dihydropyridine calcium channel blocker used for hypertension and angina. It primarily relaxes vascular smooth muscle, so it has less direct slowing effect on heart rate than nondihydropyridines such as diltiazem.",
  azithromycin: "A macrolide antibiotic used for selected respiratory and other bacterial infections. Course-relevant safety themes for macrolides include GI effects, hypersensitivity, and QT prolongation concerns.",
  ciprofloxacin: "A fluoroquinolone antibiotic. It can chelate with calcium, magnesium, aluminum, and iron, reducing absorption, and the class carries safety concerns such as tendon injury, CNS effects, dysglycemia, and QT prolongation.",
  doxycycline: "A tetracycline antibiotic. It can cause photosensitivity and reduced absorption when taken with calcium, iron, magnesium, aluminum, dairy products, or antacids.",
  empagliflozin: "An SGLT2 inhibitor used in diabetes management that lowers blood glucose by increasing urinary glucose excretion. Course-relevant safety themes include hydration, kidney considerations, and recognizing infection or ketoacidosis warning signs when taught by the prescriber.",
  "glp-1 receptor agonist": "A diabetes medication class that mimics incretin signaling to increase glucose-dependent insulin release, slow gastric emptying, and promote satiety. Semaglutide is a course prototype.",
  "hmg-coa reductase": "The liver enzyme inhibited by statins to reduce cholesterol synthesis. Blocking this enzyme lowers LDL cholesterol and helps reduce cardiovascular risk.",
  "insulin glargine": "A long-acting basal insulin used to provide steady background insulin coverage. It is not used for rapid mealtime correction in the way rapid-acting insulin is.",
  "insulin aspart": "A rapid-acting insulin used for mealtime glucose control. It begins working quickly and is not the same as long-acting basal insulin.",
  "insulin detemir": "A long-acting basal insulin used to provide background insulin coverage. It is not used for IV insulin infusion in acute DKA protocols.",
  "insulin lispro": "A rapid-acting insulin used around meals to manage postprandial glucose rises. It has a faster onset than regular insulin.",
  levothyroxine: "Synthetic T4 thyroid hormone used to treat hypothyroidism. Therapy is commonly monitored with TSH and clinical response, and excess dosing can cause hyperthyroid-like symptoms.",
  macrolide: "An antibiotic class that includes erythromycin, azithromycin, and clarithromycin. Course safety issues include hypersensitivity, QT prolongation, GI effects, and interactions that can increase digoxin or warfarin effects.",
  macrocytic: "Describes red blood cells that are larger than normal, often reflected by elevated MCV. Vitamin B12 and folate deficiencies are common causes of macrocytic anemia.",
  "macrocytic anemia": "An anemia with larger-than-normal red blood cells, often caused by vitamin B12 or folate deficiency. Neurologic symptoms can occur with vitamin B12 deficiency.",
  melena: "Black, tarry stool caused by digested blood, usually from an upper GI bleeding source. It is different from hematochezia, which is bright red rectal bleeding.",
  methimazole: "A thioamide medication used to treat hyperthyroidism by inhibiting thyroid hormone synthesis. It is generally preferred outside early pregnancy, while PTU is often preferred in the first trimester.",
  microcytic: "Describes red blood cells that are smaller than normal, often reflected by low MCV. Iron-deficiency anemia is a common microcytic anemia.",
  "microcytic anemia": "An anemia with smaller-than-normal red blood cells, commonly caused by iron deficiency. Findings can include fatigue, pallor, dyspnea on exertion, and low hemoglobin or hematocrit.",
  mucosa: "The innermost lining layer of the GI tract. It contains absorptive and secretory epithelium, so mucosal injury or malfunction can impair nutrient absorption or contribute to ulcer symptoms.",
  mylanta: "An antacid product containing aluminum hydroxide, magnesium hydroxide, and simethicone. It neutralizes existing gastric acid and can interact with absorption of some medications.",
  "normal flora": "The expected microorganisms that live on or in the body, especially in the GI tract. Antibiotics can disrupt normal flora and allow superinfection such as C. difficile or candidiasis.",
  "nph insulin": "An intermediate-acting insulin used for basal coverage over part of the day. It has a peak effect and is distinct from rapid-acting mealtime insulin and long-acting basal analogs.",
  normocytic: "Describes red blood cells of normal size. Normocytic anemia can occur with acute blood loss, chronic disease, kidney disease, or mixed causes.",
  "normocytic anemia": "Anemia with red blood cells that are normal in size but reduced in number or hemoglobin content. Chronic kidney disease and acute blood loss are common course-relevant contexts.",
  phenothiazine: "A medication class that includes promethazine for nausea and vomiting. Sedation and anticholinergic effects are important safety considerations.",
  photosensitivity: "Increased sensitivity to sunlight that can lead to exaggerated sunburn or rash. Tetracyclines are a course-relevant medication class associated with photosensitivity teaching.",
  "phosphodiesterase-5 inhibitor": "A medication class used for erectile dysfunction and some pulmonary hypertension indications. Combining these drugs with nitrates such as nitroglycerin can cause dangerous hypotension.",
  promethazine: "A phenothiazine antiemetic used for nausea and vomiting. It can cause sedation, dizziness, and anticholinergic effects, so fall risk and driving safety matter.",
  prostaglandin: "A lipid mediator involved in inflammation, pain, fever, and uterine contractions. Primary dysmenorrhea is strongly linked to prostaglandin-mediated uterine cramping.",
  "oral contraceptive": "A medication used to prevent pregnancy, often containing estrogen plus progestin or progestin alone. Consistent dosing matters, and estrogen-containing products increase thrombotic risk, especially with smoking and older age.",
  "oral contraceptives": "Medications used to prevent pregnancy, often containing estrogen plus progestin or progestin alone. Consistent dosing matters, and estrogen-containing products increase thrombotic risk, especially with smoking and older age.",
  ptu: "Propylthiouracil, a thioamide used for hyperthyroidism. It is often preferred in the first trimester of pregnancy and can also reduce peripheral conversion of T4 to T3.",
  propylthiouracil: "A thioamide medication, abbreviated PTU, used for hyperthyroidism. It is often preferred in the first trimester of pregnancy and can also reduce peripheral conversion of T4 to T3.",
  psyllium: "A bulk-forming laxative that absorbs water and increases stool bulk. It should be taken with adequate fluid to reduce choking or obstruction risk.",
  "reed-sternberg cells": "Large abnormal cells classically associated with Hodgkin lymphoma. Their presence helps distinguish Hodgkin lymphoma from non-Hodgkin lymphoma.",
  "regular insulin": "A short-acting insulin that can be given intravenously in selected acute care protocols, including DKA treatment. It has a slower onset than rapid-acting analogs such as lispro or aspart.",
  rivaroxaban: "A direct factor Xa inhibitor anticoagulant used to prevent or treat thromboembolic disorders. Bleeding is the major safety concern, but INR is not used for routine monitoring.",
  "sacubitril/valsartan": "An angiotensin receptor-neprilysin inhibitor combination used in selected heart failure patients. It must not overlap with ACE inhibitors; a 36-hour washout reduces angioedema risk.",
  rhabdomyolysis: "Severe skeletal muscle breakdown that can release myoglobin into the blood and injure the kidneys. Unexplained muscle pain with dark urine is a warning pattern, including in statin safety questions.",
  semaglutide: "A GLP-1 receptor agonist used in diabetes management. It supports glucose control through incretin effects and is commonly associated with GI adverse effects such as nausea.",
  sildenafil: "A phosphodiesterase-5 inhibitor used for erectile dysfunction and some pulmonary hypertension indications. It should not be combined with nitrates such as nitroglycerin because severe hypotension can occur.",
  "sickle cell anemia": "An inherited anemia involving abnormal hemoglobin S. Red cells can sickle during stress or low oxygen states, causing hemolysis, vaso-occlusion, pain, and organ ischemia.",
  "sglt2 inhibitor": "A diabetes medication class that lowers blood glucose by blocking renal glucose reabsorption and increasing urinary glucose excretion. Empagliflozin is a course prototype.",
  simethicone: "An antiflatulent agent included in some antacid mixtures such as Mylanta. It helps reduce gas bubbles but does not suppress acid production.",
  stricture: "An abnormal narrowing of a body passage. Chronic GERD can cause esophageal inflammation and scarring that leads to esophageal stricture and dysphagia.",
  superinfection: "Overgrowth of non-susceptible organisms after normal flora are disrupted, often by antibiotics. Examples include C. difficile diarrhea and candidiasis.",
  "t3": "Triiodothyronine, the more active thyroid hormone. It increases metabolic activity and contributes to heat production, heart rate, and energy use.",
  "t4": "Thyroxine, the main thyroid hormone secreted by the thyroid gland and converted in tissues to T3. Levothyroxine is synthetic T4.",
  tetracycline: "An antibiotic class whose absorption is reduced by calcium, iron, magnesium, aluminum, dairy products, and antacids. It can cause photosensitivity and is generally avoided in pregnancy and young children because of teeth and bone effects.",
  thioamide: "A medication class that inhibits thyroid hormone synthesis. Methimazole and propylthiouracil are course examples used for hyperthyroidism.",
  thrombin: "An enzyme in the coagulation cascade that converts fibrinogen to fibrin. Thrombin/fibrin products can be used locally to support hemostasis.",
  thrombus: "A blood clot that forms and remains attached at its site of origin. If part of it breaks loose and travels, it becomes an embolus.",
  tsh: "Thyroid-stimulating hormone from the anterior pituitary. It stimulates thyroid hormone release and is commonly used to monitor thyroid disorders and levothyroxine therapy.",
  "thyroid-stimulating hormone": "Pituitary hormone that stimulates the thyroid gland to produce T3 and T4. In primary hypothyroidism, TSH is often elevated; in primary hyperthyroidism, it is often suppressed.",
  "venous stasis": "Slowed or stagnant venous blood flow. It is one part of Virchow triad and is why immobility increases DVT risk.",
  "virchow triad": "The three major categories of thrombosis risk: venous stasis, endothelial injury, and hypercoagulability. Many DVT risk factors fit into one or more of these categories.",
  "vitamin b12": "A vitamin needed for DNA synthesis and neurologic function. Deficiency can cause macrocytic anemia and neurologic findings such as numbness, tingling, and impaired position or vibration sense.",
});

Object.assign(medicalTerms, {
  adalimumab: "A monoclonal antibody that blocks tumor necrosis factor alpha to reduce inflammatory immune signaling. It can increase infection risk, so screening and infection teaching matter.",
  aclidinium: "A long-acting muscarinic antagonist inhaler used for COPD maintenance bronchodilation. It can cause anticholinergic effects such as dry mouth and can worsen narrow-angle glaucoma or urinary retention.",
  "aluminum hydroxide": "An antacid that neutralizes gastric acid. It can cause constipation and can reduce absorption of some medications if taken too close together.",
  ampicillin: "A penicillin antibiotic that inhibits bacterial cell-wall synthesis. Allergy screening, renal-function awareness, GI effects, and superinfection monitoring are important.",
  "angiotensin ii receptor blockers": "A cardiovascular drug class, often called ARBs, that blocks angiotensin II receptor effects to lower vasoconstriction and aldosterone activity. Monitor blood pressure, potassium, and renal function.",
  "atovaquone-proguanil": "An antimalarial combination used for malaria prevention or treatment depending on the regimen. Travel region, adherence timing, GI effects, and pregnancy considerations guide safe use.",
  "cefepime": "A fourth-generation cephalosporin antibiotic that inhibits bacterial cell-wall synthesis. Monitor allergy history, renal function, neurotoxicity risk in renal impairment, and superinfection.",
  "ceftriaxone": "A third-generation cephalosporin antibiotic that inhibits bacterial cell-wall synthesis. Nursing priorities include allergy screening, infection response, GI effects, and superinfection monitoring.",
  cetirizine: "A second-generation H1 antihistamine used for allergic rhinitis and urticaria. It usually causes less sedation than first-generation antihistamines but can still cause drowsiness in some clients.",
  "chloroquine phosphate": "An antimalarial used for chloroquine-sensitive malaria treatment or prophylaxis. Retinal or visual changes, resistance patterns, and adherence timing are key safety concerns.",
  epo: "Epoetin, an erythropoietin-stimulating medication that increases red blood cell production. Blood pressure, hemoglobin response, and thrombotic risk are important monitoring points.",
  estradiol: "An estrogen hormone used in contraception or hormone therapy contexts. It can increase thrombotic risk and requires screening for pregnancy, clot history, migraine with aura, smoking risk, and liver disease when relevant.",
  ezetimibe: "A cholesterol-lowering medication that reduces intestinal cholesterol absorption. It lowers LDL and may be combined with statins; monitor for GI effects and liver concerns when combined therapy is used.",
  fluconazole: "A systemic azole antifungal used for selected Candida and other fungal infections. Monitor liver function concerns, drug interactions, rash, and infection response.",
  hctz: "Hydrochlorothiazide, a thiazide diuretic used for hypertension and mild edema. Monitor blood pressure, potassium, sodium, glucose, uric acid, renal function, and fall risk.",
  imipenem: "A carbapenem antibiotic used for severe or resistant bacterial infections. It inhibits cell-wall synthesis and requires allergy screening, renal dosing awareness, and seizure-risk monitoring.",
  "intermediate acting": "An insulin duration category, commonly represented by NPH insulin. It has a defined peak, so hypoglycemia timing and meal consistency matter.",
  "long acting": "An insulin duration category used for basal background coverage. Long-acting insulins such as glargine or detemir are not used for rapid meal correction.",
  mefloquine: "An antimalarial used for malaria prophylaxis in selected travel settings. Neuropsychiatric history, seizure history, resistance region, and adherence timing are important safety checks.",
  "magnesium hydroxide": "An antacid and osmotic laxative component that neutralizes acid and can promote bowel movement. It can cause diarrhea and should be used carefully in renal impairment.",
  "magnesium sulfate": "An IV magnesium replacement and high-risk medication used in selected obstetric, cardiac, or electrolyte contexts. Monitor reflexes, respiratory status, blood pressure, urine output, and serum magnesium when ordered.",
  meropenem: "A carbapenem antibiotic used for severe or resistant bacterial infections. Monitor allergy history, renal function, seizure risk, GI effects, and superinfection.",
  "morphine sulfate": "An opioid analgesic used for moderate to severe pain. Monitor respiratory rate, sedation, blood pressure, constipation, nausea, fall risk, and response to naloxone if overdose occurs.",
  penicillin: "A beta-lactam antibiotic class that inhibits bacterial cell-wall synthesis. Allergy history, cross-reactivity, renal function, GI effects, and superinfection are key nursing concerns.",
  "penicillin g": "A penicillin antibiotic used for susceptible bacterial infections. It inhibits cell-wall synthesis and requires allergy screening and monitoring for GI effects or hypersensitivity.",
  "penicillin vk": "An oral penicillin antibiotic used for susceptible infections. Teaching includes taking it as prescribed, finishing therapy, and reporting rash, breathing difficulty, or severe diarrhea.",
  "piperacillin-tazobactam": "A broad-spectrum penicillin plus beta-lactamase inhibitor combination used for serious infections. Monitor allergy history, renal function, sodium load when relevant, GI effects, and superinfection.",
  premixed: "An insulin mixture that combines different insulin durations in one product. It requires consistent meal timing because it contains both basal and prandial insulin activity.",
  progestin: "A progesterone-like hormone used in contraception and other reproductive therapy. It changes cervical mucus and endometrial effects and may cause bleeding-pattern changes.",
  "rapid acting": "An insulin duration category used for mealtime glucose control. Rapid-acting insulins such as lispro or aspart start quickly, so timing with meals is important.",
  rifampin: "An antitubercular antibiotic used as part of combination TB therapy. It can cause orange body fluids, hepatotoxicity, and many drug interactions due to enzyme induction.",
  "short acting": "An insulin duration category represented by regular insulin. Regular insulin has a slower onset than rapid-acting analogs and can be given IV in selected acute protocols.",
  terbinafine: "An antifungal used for dermatophyte infections such as tinea or onychomycosis. Liver considerations, rash, taste changes, and treatment duration are important teaching points.",
  testosterone: "An androgen hormone used for selected endocrine or sexual-health indications. Monitor hematocrit, lipid/cardiovascular risk, liver concerns depending on formulation, acne, mood changes, and pregnancy exposure risk.",
  "thrombin/fibrin": "Topical or local hemostatic products that support clot formation at a bleeding site. They are used differently from systemic anticoagulants or thrombolytics.",
  "ultra-long acting": "An insulin duration category that provides very prolonged basal insulin coverage. It is not used for rapid correction of high blood glucose.",
  umeclidinium: "A long-acting muscarinic antagonist inhaler used for COPD maintenance bronchodilation. Watch for dry mouth, urinary retention, and narrow-angle glaucoma precautions.",

  "acute coronary syndrome": "A sudden reduction in coronary blood flow, including unstable angina and myocardial infarction. It can cause chest pressure, dyspnea, diaphoresis, nausea, and requires rapid evaluation.",
  "acute ischemic stroke": "A stroke caused by blocked cerebral blood flow. Time of symptom onset, bleeding risk, glucose, blood pressure, and thrombolytic eligibility are key assessment points.",
  "alzheimer disease": "A progressive neurocognitive disorder with memory loss and functional decline. Cholinesterase inhibitors such as donepezil may support symptoms but do not cure the disease.",
  "anaerobic infection": "An infection caused by bacteria that grow without oxygen. Nitroimidazoles such as metronidazole are commonly associated with anaerobic coverage.",
  angina: "Chest discomfort caused by myocardial oxygen demand exceeding oxygen supply. Nitrates, beta blockers, calcium channel blockers, and antiplatelet therapy may be relevant depending on the scenario.",
  "arterial thrombosis": "A clot that blocks arterial blood flow and can cause tissue ischemia. Antiplatelet, anticoagulant, or thrombolytic therapy depends on the specific condition and bleeding risk.",
  atherosclerosis: "Plaque buildup in arteries that narrows blood flow and can rupture, causing thrombosis. It is a major mechanism behind coronary artery disease and ischemic stroke.",
  "atrial fibrillation / flutter": "Atrial rhythm disturbances that reduce organized atrial contraction and increase embolic stroke risk. Rate control and anticoagulation decisions depend on patient risk.",
  "autoimmune disease": "A condition where the immune system attacks self tissue. Immunosuppressive medications can reduce inflammation but increase infection risk.",
  "bacterial infection": "Illness caused by pathogenic bacteria invading tissue or body fluids. Antibiotic choice depends on likely organism, infection site, cultures, allergies, pregnancy status, and renal function.",
  "beta-lactam allergy alternative": "A non-beta-lactam antibiotic option considered when beta-lactam allergy risk makes penicillins, cephalosporins, or carbapenems inappropriate.",
  "beta-lactam allergy risk": "The risk of hypersensitivity to beta-lactam antibiotics such as penicillins, cephalosporins, and carbapenems. Reaction type and severity guide medication selection.",
  bleeding: "Loss of blood externally or internally. It is a major safety concern with anticoagulants, antiplatelets, thrombolytics, and some analgesics.",
  "bleeding risk": "The likelihood that a medication or condition could cause clinically important bleeding. Monitor bruising, bleeding gums, melena, hematuria, low platelets, INR/aPTT when relevant, and hemodynamic changes.",
  "bone and tooth development risk": "The risk that a medication interferes with developing teeth or bones. Tetracyclines are generally avoided in pregnancy and young children for this reason.",
  "bradycardia risk": "The risk of an abnormally slow heart rate. Beta blockers, digoxin, diltiazem, and donepezil are course-relevant medications where pulse and symptoms matter.",
  bronchitis: "Inflammation of the bronchi that can cause cough and sputum production. Antibiotic use depends on whether bacterial infection is likely and on patient-specific risks.",
  budesonide: "An inhaled corticosteroid used for long-term asthma control by reducing airway inflammation. It is not a rescue medication, and clients should rinse the mouth after use to reduce thrush risk.",
  candidiasis: "A Candida fungal infection that can affect the mouth, skin folds, vagina, or bloodstream in severe cases. Antibiotics and immunosuppression increase risk.",
  "c. difficile superinfection risk": "The risk that antibiotics disrupt normal gut flora and allow Clostridioides difficile overgrowth, causing watery diarrhea and colitis.",
  "cancer pain": "Pain caused by tumor effects, treatment, or related complications. Opioids may be used when appropriate, with close monitoring for sedation, respiratory depression, and constipation.",
  "cns depression and fall risk": "Reduced alertness, slowed reaction time, and impaired coordination that increase fall or injury risk. Opioids, benzodiazepines, antihistamines, and gabapentin can contribute.",
  "copd / emphysema": "Chronic obstructive pulmonary disease with persistent airflow limitation; emphysema involves alveolar wall damage and air trapping. Bronchodilator maintenance therapy is common.",
  contraception: "Prevention of pregnancy through hormonal, barrier, device, or procedural methods. Hormonal methods require attention to adherence, pregnancy status, and thrombotic risk.",
  "cushing disease / syndrome": "Cortisol excess from pituitary ACTH overproduction, adrenal causes, or exogenous steroids. Findings include hyperglycemia, hypertension, thin skin, infection risk, and fat redistribution.",
  dementia: "A decline in cognition that interferes with daily function. Alzheimer disease is a common cause, and medications such as donepezil may target symptoms.",
  "digoxin toxicity risk": "The risk of toxic digoxin effects such as nausea, visual changes, confusion, bradycardia, or dysrhythmias. Hypokalemia and renal impairment increase risk.",
  "dopamine deficiency": "Too little dopamine signaling in key brain pathways. In Parkinson disease, dopamine deficiency contributes to tremor, rigidity, bradykinesia, and postural instability.",
  "drug interaction risk": "The chance that one medication, food, supplement, or disease state changes another drug's effect or toxicity. Medication reconciliation and teaching are key prevention steps.",
  dka: "Diabetic ketoacidosis, a dangerous insulin-deficient state with hyperglycemia, ketones, metabolic acidosis, dehydration, and electrolyte shifts.",
  dysmenorrhea: "Painful menstruation, often caused by prostaglandin-mediated uterine contractions. NSAIDs can help by reducing prostaglandin synthesis when appropriate.",
  dysrhythmia: "An abnormal heart rhythm that can reduce cardiac output, cause symptoms, or increase clot risk depending on rhythm and severity.",
  "electrolyte imbalance": "An abnormal sodium, potassium, calcium, magnesium, or related electrolyte level. Imbalances can affect fluid status, neuromuscular function, and cardiac rhythm.",
  epilepsy: "A disorder of recurrent unprovoked seizures. Antiseizure medications require adherence, toxicity monitoring, interaction checks, and safety teaching.",
  "excess anticoagulation": "Too much anticoagulant effect, increasing bleeding risk. Management may involve holding the medication, checking labs, notifying the provider, and using a reversal agent when ordered.",
  fever: "An elevated body temperature, often from infection or inflammation. Antipyretics such as acetaminophen lower fever but do not treat the underlying cause.",
  "fluid overload risk": "The risk of excess circulating or interstitial fluid causing edema, hypertension, pulmonary congestion, or heart strain. Daily weight, lung sounds, edema, and urine output are useful cues.",
  "fungal infection": "Infection caused by fungi rather than bacteria. Treatment targets fungal cell structures and can be topical or systemic depending on infection depth.",
  gerd: "Gastroesophageal reflux disease, where gastric contents reflux into the esophagus and cause heartburn, regurgitation, esophagitis, or chronic irritation.",
  "graft-versus-host disease": "A transplant complication where donor immune cells attack host tissues. It often involves skin, GI tract, or liver and is treated with immunosuppression.",
  "heart failure": "A condition where the heart cannot fill or pump effectively enough to meet body needs. It can cause dyspnea, edema, fatigue, pulmonary congestion, and fluid overload.",
  "gram-negative infection": "Infection caused by gram-negative bacteria, which have an outer membrane that affects antibiotic coverage. Aminoglycosides, fluoroquinolones, cephalosporins, and carbapenems may be considered depending on organism and site.",
  "gram-positive infection": "Infection caused by gram-positive bacteria. Vancomycin is a key option for serious susceptible gram-positive infections such as MRSA.",
  "hepatotoxicity risk": "The risk of liver injury from a medication or disease process. Monitor liver enzymes when ordered and teach clients to report jaundice, dark urine, severe fatigue, or right-upper-quadrant pain.",
  "herpes simplex virus infection": "A viral infection causing oral, genital, mucosal, or skin lesions. Acyclovir and related antivirals inhibit viral DNA replication.",
  "hospital-acquired pneumonia": "Pneumonia that develops in a healthcare setting and may involve more resistant organisms. Therapy depends on severity, risk factors, cultures, and local susceptibility patterns.",
  "hyperkalemia risk": "The risk of elevated potassium, which can cause dangerous cardiac conduction changes. ACE inhibitors, ARBs, potassium-sparing diuretics, trimethoprim-sulfamethoxazole, and kidney disease can contribute.",
  "hyperthyroidism / graves disease": "Excess thyroid hormone activity, often from Graves disease. Findings include heat intolerance, weight loss, tremor, anxiety, tachycardia, and goiter.",
  hypervolemia: "Excess fluid volume in the vascular or interstitial space. Findings can include edema, weight gain, hypertension, crackles, dyspnea, and jugular venous distention.",
  "hypersensitivity reactions": "Immune-mediated reactions ranging from rash and itching to anaphylaxis. Medication allergy history and reaction severity are essential before giving high-risk drugs.",
  "hypotension / poor perfusion": "Low blood pressure or inadequate tissue blood flow. It can cause dizziness, cool skin, altered mental status, weak pulses, low urine output, or shock.",
  "immunocompromised infection risk": "Increased infection risk caused by immune suppression, malignancy, transplant therapy, corticosteroids, or biologic medications. Early fever or subtle symptoms can be clinically important.",
  "intra-abdominal infection": "Infection within the abdominal cavity, often involving mixed organisms. Broad antibiotic coverage may be needed depending on source, severity, and cultures.",
  "leukemia and lymphoma": "Blood and lymphatic cancers that disrupt normal immune and marrow function. They can cause infection risk, anemia, bleeding, lymph node changes, or systemic symptoms.",
  "major depressive disorder": "A mood disorder with persistent depressed mood or loss of interest plus symptoms such as sleep, appetite, energy, concentration, guilt, or suicidal thoughts. SSRIs such as fluoxetine may be used.",
  "mrsa infection": "Infection caused by methicillin-resistant Staphylococcus aureus. Serious MRSA infections often require agents active against resistant gram-positive organisms, such as vancomycin when appropriate.",
  "nausea and vomiting": "GI or neurologic symptoms that can cause dehydration, aspiration risk, electrolyte imbalance, and medication nonadherence. Antiemetics are selected by likely mechanism and safety risks.",
  nephrotoxicity: "Kidney injury caused by a medication or toxin. Aminoglycosides, vancomycin, NSAIDs, and some antivirals require renal-function attention.",
  "nephrotoxicity risk": "The chance that a medication may injure the kidneys. Monitor creatinine, BUN, urine output, hydration status, and concurrent nephrotoxic drugs.",
  "neurogenic pain": "Pain caused by nerve injury or abnormal nerve signaling. Gabapentin is a course-relevant medication used for neuropathic or neurogenic pain.",
  "oral thrush": "Oral candidiasis, often appearing as white patches, soreness, or altered taste. Inhaled corticosteroids increase risk if the mouth is not rinsed after use.",
  "opioid overdose": "Excess opioid effect causing dangerous CNS and respiratory depression. Airway support, breathing assessment, naloxone, and ongoing monitoring are priorities.",
  "otitis media": "Middle-ear infection or inflammation. Antibiotic selection depends on age, severity, likely organism, allergy history, and local guidance.",
  ototoxicity: "Medication-related injury to hearing or balance structures. Tinnitus, hearing loss, dizziness, or vertigo are warning signs with drugs such as aminoglycosides and vancomycin.",
  "pain": "An unpleasant sensory and emotional experience associated with actual or potential tissue injury. Analgesic choice depends on cause, severity, contraindications, and safety risks.",
  "parkinson disease": "A movement disorder caused largely by dopamine deficiency in basal ganglia pathways. Findings include tremor, rigidity, bradykinesia, and postural instability.",
  "pathologic clotting": "Clot formation that is excessive or in the wrong location. It can lead to DVT, PE, stroke, myocardial infarction, or organ ischemia.",
  "penicillin allergy alternative": "An antibiotic chosen when penicillin allergy history makes penicillin therapy unsafe or undesirable. The best alternative depends on reaction severity, infection site, and organism.",
  "peripheral neuropathy risk": "The chance of nerve injury causing numbness, tingling, burning, or weakness. Isoniazid is a course-relevant medication associated with this risk.",
  "peptic ulcer disease": "Erosion in the stomach or duodenal lining, commonly linked to H. pylori or NSAID use. Acid suppression and cause-specific treatment reduce irritation and bleeding risk.",
  "pneumocystis jirovecii pneumonia": "An opportunistic pneumonia seen in immunocompromised clients. Trimethoprim-sulfamethoxazole is a key treatment or prophylaxis option when appropriate.",
  "pulmonary embolism risk": "The risk that a venous clot travels to the lungs and blocks pulmonary blood flow. Sudden dyspnea, chest pain, tachycardia, hypoxemia, or syncope are concerning cues.",
  "qt prolongation risk": "The risk that a medication lengthens ventricular repolarization and increases dysrhythmia risk. Macrolides, fluoroquinolones, some antiemetics, and some psych medications can contribute.",
  "renal injury risk": "The risk of impaired kidney function from disease, dehydration, poor perfusion, or medication toxicity. Monitor creatinine, BUN, urine output, and fluid status.",
  "respiratory depression risk": "The risk of slowed or inadequate breathing, especially with opioids, benzodiazepines, alcohol, sleep aids, or other CNS depressants.",
  "respiratory infection": "An infection involving the airways or lungs, such as bronchitis or pneumonia. Treatment depends on severity, likely organism, oxygenation, and comorbid risk.",
  "retinal toxicity risk": "The risk of medication-related retinal injury or visual-field changes. Chloroquine is a course-relevant drug where visual symptoms need prompt reporting.",
  "seizure disorder": "A condition involving recurrent seizures. Medication adherence, serum levels when ordered, safety precautions, and interaction checks are key nursing concerns.",
  "seizure risk": "The chance that a medication or condition may lower the seizure threshold. Carbapenems, drug interactions, electrolyte disturbances, and CNS disease can contribute.",
  sepsis: "Life-threatening organ dysfunction from a dysregulated response to infection. Early recognition, cultures when ordered, antibiotics, fluids, and perfusion monitoring are priorities.",
  "serotonin syndrome risk": "The chance of excess serotonin activity, especially with serotonergic combinations. Watch for agitation, confusion, sweating, diarrhea, fever, tremor, hyperreflexia, or autonomic instability.",
  "sexual health / hormone therapy": "Therapy that changes androgen, estrogen, or progestin signaling for reproductive or endocrine indications. Pregnancy status, thrombotic risk, liver disease, and labs may matter.",
  shock: "A state of inadequate tissue perfusion that can lead to cellular injury and organ failure. Blood pressure, mental status, urine output, lactate, pulses, and skin signs help assess severity.",
  "skin/bone infection": "An infection involving skin, soft tissue, or bone. Antibiotic selection depends on likely organism, severity, culture results, and penetration into affected tissue.",
  "status asthmaticus": "A severe asthma exacerbation that does not respond adequately to usual rescue therapy. It can progress to respiratory failure and requires urgent management.",
  "tendon injury risk": "The risk of tendonitis or tendon rupture, especially with fluoroquinolones. New tendon pain or swelling should be reported and strenuous activity may need to stop.",
  "tinea infection": "A dermatophyte fungal infection of skin, feet, groin, scalp, or nails. Topical or systemic antifungals are selected by site and severity.",
  thrombosis: "Formation of a clot inside a blood vessel. It can obstruct blood flow locally or embolize to another organ.",
  "travel prophylaxis": "Preventive treatment before or during travel to reduce infection risk, such as malaria prophylaxis for endemic regions. Destination, timing, pregnancy status, and contraindications guide selection.",
  "tuberculosis": "A Mycobacterium tuberculosis infection that can be latent or active. Active TB requires combination therapy and airborne precautions in infectious pulmonary disease.",
  "type 1 diabetes mellitus": "An autoimmune diabetes form with beta-cell destruction and absolute insulin deficiency. Insulin therapy is required and DKA risk is high if insulin is missed.",
  "type 2 diabetes mellitus": "A diabetes form involving insulin resistance and progressive beta-cell dysfunction. Treatment may include lifestyle changes and medications such as metformin, SGLT2 inhibitors, GLP-1 agonists, or insulin.",
  "urinary tract infection": "An infection in the urinary system that can cause dysuria, frequency, urgency, suprapubic pain, fever, or flank pain if upper tract involvement occurs.",
  "vancomycin flushing syndrome risk": "The risk of flushing, itching, rash, and hypotension from rapid vancomycin infusion. Slower infusion and monitoring reduce risk.",
  "varicella-zoster infection": "A viral infection causing chickenpox or shingles. Acyclovir and related antivirals inhibit viral DNA replication.",
  "warfarin interaction bleeding risk": "The risk that interacting drugs or foods increase warfarin effect and bleeding. INR monitoring, medication reconciliation, and bleeding assessment are key.",
});

Object.assign(medicalTerms, {
  abg: "Arterial blood gas, a blood test used to evaluate oxygenation, ventilation, and acid-base status. Key values include pH, PaCO2, HCO3, and PaO2.",
  "0.45% saline": "Half-normal saline, a hypotonic crystalloid solution. It can move water into cells and requires careful monitoring in clients at risk for cerebral edema or worsening hyponatremia.",
  "0.9% sodium chloride": "Normal saline, an isotonic crystalloid that expands extracellular and intravascular volume. It is commonly used for volume replacement and is compatible with blood products.",
  "active transport": "Movement of substances across a cell membrane using energy, often against a concentration gradient. The sodium-potassium pump is a major example in fluid and electrolyte balance.",
  anaphylaxis: "A rapid, systemic allergic reaction that can cause airway swelling, bronchospasm, hypotension, and shock. Epinephrine is the priority medication when anaphylaxis threatens airway or circulation.",
  "anaphylactic shock": "A distributive shock state caused by severe allergic mediator release, leading to vasodilation, capillary leak, airway edema, bronchospasm, and hypotension.",
  "airway clearance": "The ability to move secretions out of the airway through effective cough, adequate hydration, positioning, mobility, and airway support when needed.",
  "airway edema": "Swelling of airway tissue that can narrow airflow and progress quickly. Voice change, stridor, drooling, or worsening work of breathing require urgent follow-up.",
  "airway obstruction": "Partial or complete blockage of airflow. Stridor, inability to speak or cough, cyanosis, and severe work of breathing are high-priority cues.",
  ards: "Acute respiratory distress syndrome, a severe inflammatory lung injury with noncardiogenic pulmonary edema, refractory hypoxemia, and reduced lung compliance.",
  "antidiuretic hormone": "A pituitary hormone, also called ADH or vasopressin, that promotes water reabsorption in the kidneys. Excess ADH can cause water retention and hyponatremia.",
  "aspiration pneumonia": "Pneumonia caused by inhalation of oral, gastric, or other non-air material into the lower airway. Dysphagia, choking during meals, altered mental status, and poor airway protection increase risk.",
  "aspiration risk": "The chance that food, fluid, medication, or secretions may enter the airway. Dysphagia, altered mental status, weak cough, and poor positioning increase risk.",
  "accessory muscle use": "Use of neck, shoulder, or chest wall muscles to assist breathing. It is a cue for increased work of breathing or respiratory distress.",
  "acute respiratory distress syndrome": "A severe inflammatory lung injury with noncardiogenic pulmonary edema, refractory hypoxemia, and reduced lung compliance.",
  "altered mental status": "A change from baseline alertness, orientation, or behavior. In respiratory and shock questions, it can signal hypoxemia, poor perfusion, sepsis, or metabolic disturbance.",
  bipap: "Bilevel positive airway pressure. It provides a higher inspiratory pressure and lower expiratory pressure to support ventilation in selected clients.",
  bronchopneumonia: "Patchy infection and inflammation involving bronchioles and nearby alveoli, often affecting multiple lung areas rather than one whole lobe.",
  "calcium gluconate": "An IV calcium salt used to stabilize the cardiac membrane in severe hyperkalemia and to antagonize severe magnesium toxicity when prescribed.",
  "capillary refill": "A bedside perfusion check based on how quickly color returns after blanching a nail bed or skin area. Delayed refill can suggest poor peripheral perfusion in context.",
  "cardiogenic shock": "Shock caused by pump failure, often after myocardial infarction or severe heart failure. Cues can include hypotension, cool clammy skin, crackles, jugular venous distention, and low urine output.",
  "chain of command": "The formal escalation pathway used when a patient safety concern is not being resolved at the current level. It supports continued advocacy using objective data.",
  "compensated shock": "Early shock where compensatory mechanisms maintain blood pressure despite impaired perfusion. Tachycardia, delayed capillary refill, cool skin, altered mental status, and low urine output may appear before hypotension.",
  compensation: "A physiologic adjustment that attempts to offset a problem, such as respiratory or renal compensation in acid-base disorders or cardiovascular compensation in early shock.",
  "community-acquired pneumonia": "Pneumonia that develops outside a hospital or within a short time after admission, often treated based on likely organisms, severity, and client risk factors.",
  consolidation: "Replacement of normally air-filled lung tissue with fluid, pus, blood, or cellular debris. In pneumonia it can cause crackles, dullness to percussion, and increased tactile fremitus.",
  cpap: "Continuous positive airway pressure. It provides one constant pressure to help keep airways open, commonly used for obstructive sleep apnea.",
  crackles: "Discontinuous popping or bubbling breath sounds often associated with fluid, secretions, or alveolar reopening. They can occur with pneumonia, pulmonary edema, and atelectasis.",
  croup: "An upper-airway illness in young children that commonly causes a barking cough, hoarseness, and inspiratory stridor from subglottic swelling.",
  "deep tendon reflexes": "Reflex responses such as patellar or biceps reflexes. They are important in magnesium and calcium disorders because toxicity or deficiency can change neuromuscular excitability.",
  "delayed capillary refill": "Slow return of skin color after blanching, often more than 2 to 3 seconds depending on age and context. It can be a cue for poor peripheral perfusion.",
  "distributive shock": "Shock caused by loss of vascular tone or severe vasodilation with maldistribution of blood flow. Septic, anaphylactic, and neurogenic shock are examples.",
  "dullness to percussion": "A low, thud-like percussion sound over an area with less air than expected, such as consolidation, pleural effusion, or atelectasis.",
  dysphagia: "Difficulty swallowing. It increases risk for aspiration, malnutrition, dehydration, and medication-administration problems.",
  egophony: "A voice sound change heard through the stethoscope, classically an 'E' sounding like 'A' over consolidated lung tissue.",
  "end-stage kidney disease": "Advanced kidney failure requiring dialysis or transplant for survival. Medication clearance, fluid balance, and electrolyte control are major safety issues.",
  epiglottitis: "Potentially life-threatening upper-airway inflammation that can cause fever, drooling, muffled voice, tripod positioning, and stridor. Avoid unnecessary throat stimulation.",
  ews: "Early warning score, a structured tool that combines vital signs and assessment cues to identify clinical deterioration early.",
  "extracellular fluid": "Body fluid outside cells, including interstitial and intravascular fluid. Isotonic IV fluids primarily expand this compartment.",
  filtration: "Movement of fluid across a membrane driven by pressure differences, such as hydrostatic pressure pushing fluid out of capillaries.",
  "fluid volume deficit": "Too little circulating or extracellular fluid. Cues can include tachycardia, orthostatic hypotension, dry mucous membranes, concentrated urine, poor skin turgor, and low urine output.",
  "fluid volume excess": "Too much circulating or interstitial fluid. Cues can include edema, crackles, dyspnea, jugular venous distention, bounding pulses, hypertension, and rapid weight gain.",
  "frothy sputum": "Foamy sputum that may occur with pulmonary edema when fluid enters the alveoli; pink frothy sputum is especially concerning.",
  hco3: "Bicarbonate, the metabolic component of arterial blood gas interpretation. Low HCO3 suggests metabolic acidosis; high HCO3 suggests metabolic alkalosis or compensation.",
  handoff: "A transfer of patient responsibility and critical information between clinicians or settings. Effective handoff includes current status, risks, pending tasks, and escalation criteria.",
  hemothorax: "Blood in the pleural space, often after trauma or procedures. It can cause decreased breath sounds, dyspnea, dullness to percussion, hypovolemia, and shock.",
  "high-fowler position": "An upright position, commonly 60 to 90 degrees, used to improve chest expansion, reduce aspiration risk, and ease breathing in selected clients.",
  hypermagnesemia: "An elevated magnesium level. Severe toxicity can cause loss of deep tendon reflexes, hypotension, bradycardia, somnolence, and respiratory depression.",
  hypernatremia: "An elevated sodium level, usually reflecting water deficit relative to sodium. Neurologic changes can occur as water shifts out of brain cells.",
  hyperphosphatemia: "An elevated phosphate level. It can occur with kidney failure or tumor lysis syndrome and can lower calcium by binding it.",
  hyperresonance: "A louder, lower-pitched percussion sound suggesting excess air, such as with pneumothorax or severe air trapping.",
  "hypertonic fluid": "A fluid with higher effective osmolality than plasma that pulls water from cells into extracellular fluid. It requires careful monitoring for fluid overload and sodium shifts.",
  "hypertonic saline": "A sodium chloride solution with higher osmolality than plasma, such as 3% sodium chloride. It pulls water into extracellular fluid and requires close sodium and neurologic monitoring.",
  hypophosphatemia: "A low phosphate level. Severe hypophosphatemia can impair ATP production and weaken respiratory, cardiac, and skeletal muscle function.",
  hypoxia: "Inadequate oxygen available to body tissues. It may be caused by low oxygenation, impaired delivery, or poor tissue use of oxygen.",
  hypoxemia: "Low oxygen level in arterial blood. SpO2 and PaO2 are common oxygenation measures, but clinical assessment still matters.",
  "hypovolemic shock": "Shock caused by low circulating volume from blood or fluid loss. Tachycardia, cool skin, orthostasis, narrowing pulse pressure, thirst, and low urine output are common cues.",
  "hypotonic fluid": "A fluid with lower effective osmolality than plasma that moves water into cells. It can worsen cerebral edema or hyponatremia in unsafe contexts.",
  "hypotonic saline": "A sodium chloride solution with lower osmolality than plasma, such as 0.45% saline. It can shift water into cells and lower serum sodium.",
  "impaired gas exchange": "A nursing problem involving reduced oxygen and carbon dioxide exchange at the alveolar-capillary level. SpO2, PaO2, mental status, work of breathing, and lung findings help evaluate it.",
  "incentive spirometry": "A lung-expansion breathing exercise tool used after surgery or immobility to reduce atelectasis risk and promote deeper ventilation.",
  "ineffective airway clearance": "A nursing diagnosis for inability to clear secretions or obstructions from the airway. Outcomes should measure cough effectiveness, secretion movement, breath sounds, work of breathing, and oxygenation.",
  inotrope: "A medication or physiologic effect that changes the force of heart muscle contraction. Positive inotropes can support cardiac output in selected shock states.",
  "intracellular fluid": "Fluid inside cells. Potassium is the major intracellular electrolyte, and insulin or acid-base shifts can move potassium into or out of this compartment.",
  "intravascular volume": "Fluid volume inside the blood vessels. Loss of intravascular volume reduces preload and can impair tissue perfusion.",
  isbar: "Identify, Situation, Background, Assessment, Recommendation. It is a structured communication framework for handoff and escalation.",
  "isotonic dehydration": "Fluid loss where water and sodium are lost in relatively balanced proportions, so serum sodium may stay near normal while circulating volume falls.",
  "isotonic fluid": "An IV fluid with tonicity similar to plasma that expands extracellular and intravascular volume. Examples include 0.9% normal saline and lactated Ringer's solution.",
  "kussmaul respirations": "Deep, rapid respirations used to compensate for metabolic acidosis by blowing off carbon dioxide, classically seen in diabetic ketoacidosis.",
  "lactated ringers": "An isotonic crystalloid IV solution containing sodium, chloride, lactate, potassium, and calcium. It is used for selected fluid resuscitation and replacement needs.",
  "lobar pneumonia": "Pneumonia involving a large portion of one lung lobe, often associated with more localized consolidation findings than bronchopneumonia.",
  "lower respiratory tract": "The trachea, bronchi, bronchioles, and alveoli. Infections here include bronchitis and pneumonia and can directly impair ventilation or gas exchange.",
  "loop diuretic": "A diuretic class, such as furosemide, that increases sodium and water excretion in the loop of Henle. It can contribute to fluid loss, hypokalemia, and metabolic alkalosis.",
  map: "Mean arterial pressure, an estimate of average arterial pressure during one cardiac cycle. MAP helps evaluate organ perfusion; a MAP below about 65 mm Hg is often concerning in shock contexts.",
  "magnesium hydroxide": "An antacid and osmotic laxative commonly known as milk of magnesia. It can contribute to hypermagnesemia when kidney function is impaired.",
  "mean arterial pressure": "Average arterial pressure during one cardiac cycle. It is used as a perfusion marker, especially in shock and critical illness.",
  "metabolic acidosis": "An acid-base disorder with low pH and low bicarbonate, caused by acid gain or bicarbonate loss. DKA, severe diarrhea, renal failure, and shock-related lactic acidosis are common causes.",
  "metabolic alkalosis": "An acid-base disorder with high pH and high bicarbonate, often associated with vomiting, gastric suction, diuretics, or chloride depletion.",
  mews: "Modified Early Warning Score, a structured scoring tool that helps identify clients at risk for clinical deterioration using vital signs and assessment cues.",
  "milk of magnesia": "A common name for magnesium hydroxide, an antacid/osmotic laxative that can cause hypermagnesemia when used excessively in clients with impaired kidney function.",
  "narrow pulse pressure": "A smaller-than-expected difference between systolic and diastolic pressure. In shock, narrowing pulse pressure can reflect compensatory vasoconstriction and falling stroke volume.",
  news: "National Early Warning Score, a structured tool used in some settings to detect clinical deterioration from vital signs and oxygen support needs.",
  "neurogenic shock": "A distributive shock state from loss of sympathetic vascular tone, often after spinal cord injury. Hypotension with bradycardia and warm dry skin may occur.",
  "normal saline": "0.9% sodium chloride, an isotonic crystalloid that expands extracellular and intravascular volume. It is commonly used for volume replacement but requires monitoring for overload.",
  "nursing diagnosis": "A clinical judgment about a person's response to a health condition or life process. It guides nursing interventions and measurable outcomes.",
  "obstructive shock": "Shock caused by a physical obstruction to cardiac filling or forward blood flow, such as tension pneumothorax, cardiac tamponade, or pulmonary embolism.",
  "obstructive sleep apnea": "Repeated upper-airway obstruction during sleep, causing intermittent hypoxemia and sleep disruption. Home CPAP or BiPAP use should be communicated during perioperative care.",
  oliguria: "Low urine output. In adults, urine output below about 30 mL/hr is a concerning cue for reduced renal perfusion or kidney dysfunction.",
  "oropharyngeal airway": "An airway adjunct placed through the mouth to keep the tongue from obstructing the airway in an unconscious client without a gag reflex.",
  "orthostatic hypotension": "A drop in blood pressure with position change, often causing dizziness or lightheadedness. It can signal volume deficit, medication effects, or autonomic dysfunction.",
  osmosis: "Movement of water across a semipermeable membrane toward the area with higher solute concentration.",
  "osmotic diuresis": "Increased urination caused by solutes pulling water into the urine, such as glucose in hyperglycemia. It can worsen dehydration and electrolyte losses.",
  "oxygen saturation": "The percentage of hemoglobin binding sites occupied by oxygen. SpO2 estimates this noninvasively, while SaO2 is measured from arterial blood.",
  "pass the baton": "A structured handoff framework that organizes patient, assessment, situation, safety, background, actions, timing, ownership, and next steps.",
  "pediatric shock compensation": "Children can maintain blood pressure until late in shock by increasing heart rate and vascular tone, so mental status, capillary refill, pulses, skin, and urine output are key cues.",
  "peripheral perfusion": "Blood flow to extremities and peripheral tissues. Skin temperature, color, capillary refill, pulses, sensation, and urine output help estimate perfusion.",
  "pleural effusion": "Excess fluid in the pleural space that can compress lung tissue and cause dyspnea, decreased breath sounds, and dullness to percussion.",
  "pleuritic chest pain": "Sharp chest pain that worsens with breathing, coughing, or movement. It can occur with pneumonia, pneumothorax, pulmonary embolism, and pleural inflammation.",
  pneumonia: "An infection of the lower respiratory tract that causes alveolar inflammation or consolidation, impairing gas exchange and sometimes progressing to sepsis.",
  pneumothorax: "Air in the pleural space that can collapse part or all of a lung. Sudden dyspnea, pleuritic pain, unilateral decreased breath sounds, and hyperresonance are common cues.",
  "positive inotrope": "A medication or effect that increases myocardial contractility, potentially improving cardiac output in selected low-output states.",
  "pulmonary embolism": "A blockage in the pulmonary circulation, usually from a blood clot. Sudden dyspnea, pleuritic chest pain, tachycardia, hypoxemia, or obstructive shock may occur.",
  "pulse oximetry": "Noninvasive measurement of estimated arterial oxygen saturation. It is useful for trending oxygenation but must be interpreted with clinical assessment.",
  "pulse pressure": "The difference between systolic and diastolic blood pressure. Narrowing pulse pressure can be a concerning compensatory sign in shock.",
  "rapid response": "A hospital escalation process for urgent clinical deterioration before cardiac or respiratory arrest occurs.",
  "refeeding syndrome": "Potentially dangerous electrolyte shifts after nutrition is restarted in a severely malnourished client. Insulin drives phosphate, potassium, and magnesium into cells.",
  "respiratory distress": "Increased work or difficulty breathing. Cues can include tachypnea, accessory muscle use, retractions, nasal flaring, cyanosis, altered mental status, and inability to speak normally.",
  retractions: "Visible inward pulling of chest wall or neck muscles during inspiration, indicating increased work of breathing.",
  rhonchi: "Low-pitched, coarse breath sounds often associated with airway secretions or mucus that may improve after coughing.",
  "respiratory acidosis": "An acid-base disorder caused by inadequate ventilation and carbon dioxide retention, producing low pH and high PaCO2.",
  "respiratory alkalosis": "An acid-base disorder caused by excessive ventilation and low carbon dioxide, producing high pH and low PaCO2.",
  "semi-fowler position": "A semi-upright position, commonly 30 to 45 degrees, used to support breathing, comfort, and aspiration precautions depending on the situation.",
  "septic shock": "A sepsis-related shock state with infection-driven circulatory and cellular dysfunction, often causing hypotension, altered mental status, mottling, oliguria, and high lactate risk.",
  siadh: "Syndrome of inappropriate antidiuretic hormone, a condition of excess ADH effect causing water retention, dilutional hyponatremia, low serum osmolality, and concentrated urine.",
  sirs: "Systemic inflammatory response syndrome, a pattern of abnormal temperature, heart rate, respiratory rate, or white blood cell count that may occur with infection or other inflammation.",
  sofa: "Sequential Organ Failure Assessment, a scoring approach used to describe organ dysfunction in sepsis and critical illness.",
  "sodium chloride": "A salt used in IV fluids such as 0.9% sodium chloride and hypertonic saline. The concentration determines whether the solution is isotonic, hypotonic, or hypertonic.",
  "sodium bicarbonate": "An alkalinizing medication or buffer used in selected severe acidosis or hyperkalemia contexts. It is not a substitute for treating the underlying cause.",
  "sodium polystyrene sulfonate": "A potassium-binding resin used to help remove potassium through the GI tract when prescribed. It acts more slowly than emergency cardiac membrane stabilization.",
  solute: "A dissolved particle such as sodium, glucose, or urea. Solute concentration affects osmosis, fluid shifts, and tonicity.",
  spo2: "Peripheral oxygen saturation estimated by pulse oximetry. It helps trend oxygenation but can be affected by perfusion, motion, nail products, and clinical context.",
  stridor: "A high-pitched upper-airway sound, usually inspiratory, that suggests airway narrowing and requires urgent assessment.",
  "supplemental oxygen": "Oxygen delivered above room air concentration to improve oxygenation. The device, flow rate, target saturation, and client response guide monitoring.",
  "syndrome of inappropriate antidiuretic hormone": "A condition of excess ADH effect causing water retention, dilutional hyponatremia, low serum osmolality, and concentrated urine.",
  "tactile fremitus": "Vibration felt on the chest wall while a client speaks. Increased tactile fremitus can occur over consolidated lung tissue.",
  tachypnea: "A faster-than-normal respiratory rate. It can be an early cue for pain, anxiety, fever, hypoxemia, metabolic acidosis, sepsis, or respiratory distress.",
  "teach-back": "A closed-loop teaching method in which the patient explains or demonstrates the plan back to the nurse so teaching gaps can be corrected.",
  "tension pneumothorax": "A life-threatening pneumothorax where trapped pleural air increases pressure, shifts mediastinal structures, obstructs venous return, and causes shock.",
  "therapeutic communication": "Purposeful, patient-centered communication that supports assessment, trust, coping, and safety without false reassurance or judgment.",
  "thickened liquids": "Liquids modified to a thicker consistency to reduce aspiration risk in clients with dysphagia when prescribed by the swallowing plan.",
  thoracentesis: "A procedure in which a needle or catheter removes fluid or air from the pleural space. Sudden dyspnea or decreased breath sounds afterward can indicate pneumothorax.",
  tonicity: "The effective osmotic pressure of a fluid compared with plasma. Tonicity affects whether water shifts into cells, out of cells, or stays mostly in extracellular fluid.",
  "tongue blade": "A flat tool used to depress the tongue during mouth or throat assessment. It should be avoided when epiglottitis is suspected because stimulation can worsen obstruction.",
  "trauma-informed care": "Care that assumes trauma may be present and emphasizes safety, choice, collaboration, trust, and empowerment without requiring disclosure of trauma history.",
  "tumor lysis syndrome": "A rapid release of intracellular contents after cancer-cell breakdown, causing hyperkalemia, hyperphosphatemia, hypocalcemia, hyperuricemia, and kidney injury risk.",
  urticaria: "Hives: raised, itchy wheals caused by histamine release, often seen in allergic reactions and sometimes anaphylaxis.",
  vasodilation: "Widening of blood vessels from smooth muscle relaxation, which can lower systemic vascular resistance and blood pressure.",
  vasomotor: "Related to control of blood vessel diameter by the nervous system or vasoactive mediators.",
  "ventilator-associated pneumonia": "Pneumonia that develops in a client receiving mechanical ventilation, associated with aspiration risk, impaired airway defenses, and ventilator care practices.",
  "ventilation-perfusion mismatch": "A mismatch between airflow reaching alveoli and blood flow reaching pulmonary capillaries, impairing oxygenation.",
  "whispered pectoriloquy": "Abnormally clear transmission of whispered words through the chest wall, which can occur over consolidated lung tissue.",
  "work of breathing": "The effort required to move air in and out of the lungs. Retractions, accessory muscle use, nasal flaring, tachypnea, and fatigue suggest increased work.",
});

const termLabels = {
  "0.45% saline": "0.45% Saline",
  "0.9% sodium chloride": "0.9% Sodium Chloride",
  "5-ht3 receptor antagonist": "5-HT3 Receptor Antagonist",
  acth: "ACTH",
  "b cell": "B Cell",
  "b-cell": "B Cell",
  aptt: "aPTT",
  abg: "ABG",
  arbs: "ARBs",
  bipap: "BiPAP",
  bun: "BUN",
  cll: "CLL",
  copd: "COPD",
  cpap: "CPAP",
  crh: "CRH",
  cns: "CNS",
  "d-dimer": "D-dimer",
  dic: "DIC",
  dka: "DKA",
  dvt: "DVT",
  ecg: "ECG",
  epo: "EPO",
  gaba: "GABA",
  gad: "GAD",
  gfr: "GFR",
  "h pylori": "H. pylori",
  "h2 receptor antagonist": "H2 Receptor Antagonist",
  hctz: "HCTZ",
  "hmg-coa reductase": "HMG-CoA Reductase",
  hhns: "HHNS",
  "hpa axis": "HPA Axis",
  "hpt axis": "HPT Axis",
  hco3: "HCO3",
  inh: "INH",
  inr: "INR",
  isbar: "ISBAR",
  laba: "LABA",
  lama: "LAMA",
  lmwh: "LMWH",
  map: "MAP",
  mews: "MEWS",
  maoi: "MAOI",
  mdd: "MDD",
  mrsa: "MRSA",
  news: "NEWS",
  nsaid: "NSAID",
  "nsaid use": "NSAID Use",
  nstemi: "NSTEMI",
  paco2: "PaCO2",
  "paCO2": "PaCO2",
  pao2: "PaO2",
  "paO2": "PaO2",
  ph: "pH",
  pns: "PNS",
  "phosphodiesterase-5 inhibitor": "Phosphodiesterase-5 Inhibitor",
  pt: "PT",
  ptu: "PTU",
  siadh: "SIADH",
  sirs: "SIRS",
  sofa: "SOFA",
  spo2: "SpO2",
  saba: "SABA",
  sama: "SAMA",
  "sglt2 inhibitor": "SGLT2 Inhibitor",
  ssri: "SSRI",
  sle: "SLE",
  stemi: "STEMI",
  "syndrome of inappropriate antidiuretic hormone": "Syndrome of Inappropriate Antidiuretic Hormone",
  "t cell": "T Cell",
  "t-cell": "T Cell",
  "t3": "T3",
  "t4": "T4",
  tpa: "tPA",
  tsh: "TSH",
  "work of breathing": "Work of Breathing",
};

const glossaryEntries = Object.entries(medicalTerms)
  .map(([term, definition]) => ({
    term,
    definition,
    regex: buildTermRegex(term),
    dedupeKey: `${term.replaceAll("-", " ")}|${definition}`,
  }))
  .sort((a, b) => a.term.localeCompare(b.term));

const el = {
  week: document.getElementById("weekFilter"),
  source: document.getElementById("sourceFilter"),
  review: document.getElementById("reviewFilter"),
  emptyState: document.getElementById("emptyState"),
  emptyTitle: document.getElementById("emptyTitle"),
  emptyMessage: document.getElementById("emptyMessage"),
  questionCard: document.getElementById("questionCard"),
  questionStem: document.getElementById("questionStem"),
  flagQuestion: document.getElementById("flagQuestionButton"),
  reportQuestion: document.getElementById("reportQuestionButton"),
  reportQuestionStatus: document.getElementById("reportQuestionStatus"),
  answerForm: document.getElementById("answerForm"),
  feedback: document.getElementById("feedback"),
  studySupportStatus: document.getElementById("studySupportStatus"),
  definitionList: document.getElementById("definitionList"),
  define: document.getElementById("defineButton"),
  filtersContent: document.getElementById("filtersContent"),
  previous: document.getElementById("previousButton"),
  next: document.getElementById("nextButton"),
  submit: document.getElementById("submitButton"),
  resetAnswered: document.getElementById("resetAnsweredButton"),
  questionsLeftCount: document.getElementById("questionsLeftCount"),
};

const filters = [el.week, el.source, el.review];

async function init() {
  try {
    const questions = await fetchJson("data/questions.json");
    state.questions = prepareQuestions(getVisibleQuestions(questions));
    state.questionById = new Map(state.questions.map((question) => [question.id, question]));
    shuffleInPlace(state.questions);
    state.answered = loadAnsweredResults();
    state.flagged = loadFlaggedQuestions();
    buildFilters();
    bindEvents();
    applyFilters();
  } catch (error) {
    el.emptyState.innerHTML = `
      <h2>Question data did not load</h2>
      <p>Run this folder from a local server or GitHub Pages so the app can fetch data/questions.json.</p>
    `;
    console.error(error);
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

function prepareQuestions(questions) {
  return questions.map((question) => ({
    ...question,
    _filterWeek: String(question.week ?? ""),
    _filterSource: getQuestionSourceFilter(question),
    _definitions: findMedicalTerms(question),
  }));
}

function getQuestionSourceFilter(question) {
  if (question.sourceType === "Saved UWorld") return "UWorld";
  if (question.sourceType === "Original generated practice") return "AI";
  if (question.category === "Canvas quiz results") return "Class";
  if (String(question.sourceType ?? "").toLowerCase().includes("canvas")) return "Class";
  return "Class";
}

function getVisibleQuestions(questions) {
  return questions;
}

function bindEvents() {
  filters.forEach((filter) => filter.addEventListener("input", applyFilters));
  el.define.addEventListener("click", showStudySupport);
  el.previous.addEventListener("click", selectPrevious);
  el.next.addEventListener("click", selectNext);
  el.flagQuestion.addEventListener("click", toggleCurrentQuestionFlag);
  el.reportQuestion?.addEventListener("click", reportCurrentQuestion);
  el.submit.addEventListener("click", submitCurrentQuestion);
  el.resetAnswered.addEventListener("click", resetAnsweredQuestions);
}

function buildFilters() {
  fillWeekSelect(el.week, "All weeks", state.questions);
  fillSelect(el.source, "All sources", state.questions.map((question) => question._filterSource));
}

function fillWeekSelect(select, label, questions) {
  select.innerHTML = "";
  select.append(new Option(label, ""));

  [...new Map(
    questions
      .filter((question) => question.week && question.topic)
      .sort((a, b) => a.week - b.week)
      .map((question) => [String(question.week), `Week ${question.week}: ${question.topic}`])
  ).entries()].forEach(([value, text]) => select.append(new Option(text, value)));
}

function fillSelect(select, label, values) {
  select.innerHTML = "";
  select.append(new Option(label, ""));

  [...new Set(values.filter(Boolean).map(String))]
    .sort((a, b) => a.localeCompare(b))
    .forEach((value) => select.append(new Option(value, value)));
}

function applyFilters() {
  const selected = getSelectedFilters();
  const currentIdBeforeFiltering = state.currentId;

  state.filtered = state.questions.filter((question) => {
    return matchesSelectedFilters(question, selected) && shouldIncludeQuestionByReviewState(question, selected.review);
  });
  shuffleInPlace(state.filtered);

  if (!state.filtered.some((question) => question.id === state.currentId)) {
    state.currentId = state.filtered[0]?.id ?? null;
  }

  if (state.currentId !== currentIdBeforeFiltering) {
    state.previousIds = [];
  }

  render();
}

function render() {
  renderProgress();
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  const question = getCurrentQuestion();
  el.feedback.className = "feedback hidden";
  el.feedback.innerHTML = "";

  if (!question) {
    const hasCompletedMatchingQuestions = getMatchingQuestions().some((item) => isQuestionCompleted(item.id));
    el.emptyState.classList.remove("hidden");
    el.questionCard.classList.add("hidden");
    el.previous.disabled = true;
    el.emptyTitle.textContent = hasCompletedMatchingQuestions ? "All matching questions answered correctly" : "No matching questions";
    el.emptyMessage.textContent = hasCompletedMatchingQuestions
      ? "Reset answered questions to practice this set again."
      : "Adjust the filters to continue practicing.";
    state.renderedQuestionId = null;
    state.studySupportVisible = false;
    renderStudySupport(null);
    return;
  }

  if (question.id !== state.renderedQuestionId) {
    state.renderedQuestionId = question.id;
    state.studySupportVisible = false;
  }

  el.emptyState.classList.add("hidden");
  el.questionCard.classList.remove("hidden");
  el.previous.disabled = state.previousIds.length === 0;
  el.questionStem.textContent = question.stem;
  renderFlagQuestionButton(question);
  renderReportQuestionStatus("");
  renderStudySupport(question);

  el.answerForm.innerHTML = "";

  if (question.type === "Matching") {
    renderMatchingQuestion(question);
    return;
  }

  if (question.type === "Fill in the Blank") {
    renderFillQuestion(question);
    return;
  }

  renderChoiceQuestion(question);
}

function renderChoiceQuestion(question) {
  const selected = state.answers.get(question.id) ?? new Set();
  const inputType = question.type === "Multiple Answer" ? "checkbox" : "radio";
  el.submit.classList.toggle("hidden", question.type !== "Multiple Answer");
  el.submit.disabled = false;

  getOptionOrder(question).forEach((option, index) => {
    const id = `${question.id}-${index}`;
    const label = document.createElement("label");
    label.className = "answer-option";
    label.innerHTML = `
      <input id="${id}" name="${question.id}" type="${inputType}" value="${escapeHtml(option)}" ${selected.has(option) ? "checked" : ""}>
      <span>${escapeHtml(option)}</span>
    `;
    label.querySelector("input").addEventListener("change", (event) => {
      storeAnswer(question, event);
      if (question.type !== "Multiple Answer") {
        showAnswer(question);
      }
    });
    el.answerForm.append(label);
  });
}

function renderMatchingQuestion(question) {
  el.submit.classList.remove("hidden");
  el.submit.disabled = false;
  const options = getOptionOrder(question);

  question.prompts.forEach((prompt, index) => {
    const row = document.createElement("label");
    row.className = "matching-row";
    row.innerHTML = `
      <span>${escapeHtml(prompt.prompt)}</span>
      <select data-prompt-index="${index}" aria-label="${escapeHtml(prompt.prompt)} match">
        <option value="">Select match</option>
        ${options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
      </select>
      <small class="matching-answer"></small>
    `;
    el.answerForm.append(row);
  });
}

function renderFillQuestion(question) {
  el.submit.classList.remove("hidden");
  el.submit.disabled = false;

  question.blanks.forEach((blank, index) => {
    const row = document.createElement("label");
    row.className = "fill-row";
    row.innerHTML = `
      <span>${escapeHtml(blank.label)}</span>
      <input data-blank-index="${index}" type="text" autocomplete="off">
      <small class="matching-answer"></small>
    `;
    el.answerForm.append(row);
  });
}

function storeAnswer(question, event) {
  const selected = question.type === "Multiple Answer"
    ? new Set(state.answers.get(question.id) ?? [])
    : new Set();

  if (event.target.checked) {
    selected.add(event.target.value);
  } else {
    selected.delete(event.target.value);
  }

  state.answers.set(question.id, selected);
}

function submitCurrentQuestion() {
  const question = getCurrentQuestion();
  if (!question || !["Multiple Answer", "Matching", "Fill in the Blank"].includes(question.type)) return;
  showAnswer(question);
}

function showAnswer(question) {
  if (question.type === "Matching") {
    showMatchingAnswer(question);
    return;
  }

  if (question.type === "Fill in the Blank") {
    showFillAnswer(question);
    return;
  }

  const selected = state.answers.get(question.id) ?? new Set();
  const correct = new Set(question.correctAnswers);
  const isCorrect = setsMatch(selected, correct);

  [...el.answerForm.querySelectorAll(".answer-option")].forEach((label) => {
    const input = label.querySelector("input");
    const value = input.value;
    input.disabled = true;
    const isSelected = selected.has(value);
    const isCorrectOption = correct.has(value);
    const isMissedCorrectOption = question.type === "Multiple Answer" && isCorrectOption && !isSelected;
    label.classList.add("revealed");
    label.classList.toggle("correct", isCorrectOption && !isMissedCorrectOption);
    label.classList.toggle("incorrect", (isSelected && !isCorrectOption) || isMissedCorrectOption);
  });
  el.submit.disabled = true;

  el.feedback.className = `feedback ${isCorrect ? "correct" : "incorrect"}`;
  el.feedback.innerHTML = renderRationale(question.rationale);
  updateQuestionResult(question.id, isCorrect);
  renderProgress();
}

function showMatchingAnswer(question) {
  let isCorrect = true;

  [...el.answerForm.querySelectorAll(".matching-row")].forEach((row) => {
    const select = row.querySelector("select");
    const prompt = question.prompts[Number(select.dataset.promptIndex)];
    const rowCorrect = select.value === prompt.answer;
    isCorrect = isCorrect && rowCorrect;
    select.disabled = true;
    row.classList.toggle("correct", rowCorrect);
    row.classList.toggle("incorrect", !rowCorrect);
    row.querySelector(".matching-answer").textContent = rowCorrect ? "" : `Correct match: ${prompt.answer}`;
  });

  el.submit.disabled = true;
  el.feedback.className = `feedback ${isCorrect ? "correct" : "incorrect"}`;
  el.feedback.innerHTML = renderRationale(question.rationale);
  updateQuestionResult(question.id, isCorrect);
  renderProgress();
}

function showFillAnswer(question) {
  let isCorrect = true;

  [...el.answerForm.querySelectorAll(".fill-row")].forEach((row) => {
    const input = row.querySelector("input");
    const blank = question.blanks[Number(input.dataset.blankIndex)];
    const accepted = new Set(blank.answers.map(normalizeFreeText));
    const rowCorrect = accepted.has(normalizeFreeText(input.value));
    isCorrect = isCorrect && rowCorrect;
    input.disabled = true;
    row.classList.toggle("correct", rowCorrect);
    row.classList.toggle("incorrect", !rowCorrect);
    row.querySelector(".matching-answer").textContent = rowCorrect ? "" : `Accepted answer: ${blank.answers[0]}`;
  });

  el.submit.disabled = true;
  el.feedback.className = `feedback ${isCorrect ? "correct" : "incorrect"}`;
  el.feedback.innerHTML = renderRationale(question.rationale);
  updateQuestionResult(question.id, isCorrect);
  renderProgress();
}

function renderRationale(rationale) {
  const paragraphs = String(rationale ?? "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return "";
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

function selectNext() {
  if (state.filtered.length === 0) {
    startNextQuestionPass();
    return;
  }

  const previousId = state.currentId;
  clearCurrentFlaggedReviewAnswer();
  removeCurrentQuestionFromPass();

  if (state.filtered.length === 0) {
    startNextQuestionPass();
  } else {
    state.currentId = state.filtered[0]?.id ?? null;
  }

  if (previousId && state.currentId && state.currentId !== previousId) {
    state.previousIds.push(previousId);
  }

  render();
}

function removeCurrentQuestionFromPass() {
  if (!state.currentId) return;
  state.filtered = state.filtered.filter((question) => question.id !== state.currentId);
}

function startNextQuestionPass() {
  const selected = getSelectedFilters();
  state.filtered = state.questions.filter((question) => (
    matchesSelectedFilters(question, selected) && shouldIncludeQuestionByReviewState(question, selected.review)
  ));
  shuffleInPlace(state.filtered);
  state.currentId = state.filtered[0]?.id ?? null;
}

function clearCurrentFlaggedReviewAnswer() {
  if (el.review.value !== "flagged" || !state.currentId) return;
  state.answers.delete(state.currentId);
}

function selectPrevious() {
  const previousId = state.previousIds.pop();
  if (!previousId) return;
  state.currentId = previousId;
  render();
}

async function reportCurrentQuestion() {
  const question = getCurrentQuestion();
  if (!question) return;

  if (!QUESTION_FEEDBACK_ENDPOINT) {
    renderReportQuestionStatus("Feedback is not connected yet.");
    return;
  }

  el.reportQuestion.disabled = true;
  renderReportQuestionStatus("Reporting...");

  try {
    await fetch(QUESTION_FEEDBACK_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(buildQuestionFeedbackPayload(question)),
    });
    renderReportQuestionStatus("Reported.");
  } catch {
    renderReportQuestionStatus("Report failed. Try again.");
  } finally {
    el.reportQuestion.disabled = false;
  }
}

function buildQuestionFeedbackPayload(question) {
  const selected = [...(state.answers.get(question.id) ?? [])];
  return {
    questionId: question.id,
    stem: question.stem,
    type: question.type,
    week: question.week ?? "",
    topic: question.topic ?? "",
    category: question.category ?? "",
    subtopic: question.subtopic ?? "",
    sourceType: question.sourceType ?? "",
    selectedAnswers: selected,
    correctAnswers: question.correctAnswers ?? [],
    options: question.options ?? [],
    rationale: question.rationale ?? "",
    pageUrl: window.location.href,
    userAgent: navigator.userAgent,
    reportedAt: new Date().toISOString(),
  };
}

function renderReportQuestionStatus(message) {
  if (!el.reportQuestionStatus) return;
  el.reportQuestionStatus.textContent = message;
}

function getCurrentQuestion() {
  return state.questionById.get(state.currentId) ?? null;
}

function getMatchingQuestions() {
  const selected = getSelectedFilters();
  return state.questions.filter((question) => matchesSelectedFilters(question, selected));
}

function getSelectedFilters() {
  return {
    week: el.week.value,
    source: el.source.value,
    review: el.review.value,
  };
}

function matchesSelectedFilters(question, selected) {
  if (selected.week && question._filterWeek !== selected.week) return false;
  if (selected.source && question._filterSource !== selected.source) return false;
  if (selected.review === "flagged" && !isQuestionFlagged(question.id)) return false;
  return true;
}

function shouldIncludeQuestionByReviewState(question, reviewFilter) {
  if (reviewFilter === "flagged") return isQuestionFlagged(question.id);
  return !isQuestionCompleted(question.id);
}

function renderProgress() {
  const matchingQuestions = getMatchingQuestions();
  const selected = getSelectedFilters();
  const questionsLeft = matchingQuestions.filter((question) => shouldIncludeQuestionByReviewState(question, selected.review)).length;

  el.questionsLeftCount.textContent = questionsLeft;
  el.resetAnswered.textContent = `Reset answered questions (${getAnsweredCount()})`;
}

function updateQuestionResult(questionId, isCorrect) {
  if (isCorrect) {
    state.answered[String(questionId)] = "correct";
    if (el.review.value !== "flagged") {
      state.filtered = state.filtered.filter((item) => item.id !== questionId);
    }
  } else {
    delete state.answered[String(questionId)];
    state.answers.delete(questionId);
  }
  localStorage.setItem(ANSWERED_STORAGE_KEY, JSON.stringify(state.answered));
}

function isQuestionCompleted(questionId) {
  return state.answered[String(questionId)] === "correct";
}

function getAnsweredCount() {
  return Object.values(state.answered).filter((result) => result === "correct").length;
}

function toggleCurrentQuestionFlag() {
  const question = getCurrentQuestion();
  if (!question) return;

  if (isQuestionFlagged(question.id)) {
    delete state.flagged[String(question.id)];
  } else {
    state.flagged[String(question.id)] = true;
  }

  saveFlaggedQuestions();
  renderFlagQuestionButton(question);

  if (el.review.value === "flagged" && !isQuestionFlagged(question.id)) {
    applyFilters();
  } else {
    renderProgress();
  }
}

function renderFlagQuestionButton(question) {
  const isFlagged = isQuestionFlagged(question.id);
  el.flagQuestion.classList.toggle("active", isFlagged);
  el.flagQuestion.setAttribute("aria-pressed", String(isFlagged));
  el.flagQuestion.textContent = isFlagged ? "Flagged for review" : "Flag for review";
}

function isQuestionFlagged(questionId) {
  return state.flagged[String(questionId)] === true;
}

function loadAnsweredResults() {
  try {
    const raw = localStorage.getItem(ANSWERED_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function loadFlaggedQuestions() {
  try {
    const raw = localStorage.getItem(FLAGGED_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function saveFlaggedQuestions() {
  localStorage.setItem(FLAGGED_STORAGE_KEY, JSON.stringify(state.flagged));
}

function resetAnsweredQuestions() {
  state.answered = {};
  state.answers.clear();
  state.previousIds = [];
  localStorage.removeItem(ANSWERED_STORAGE_KEY);
  applyFilters();
}

function shuffleInPlace(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomIndex(index + 1);
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function getOptionOrder(question) {
  if (!state.optionOrders.has(question.id)) {
    state.optionOrders.set(question.id, shuffleInPlace([...question.options]));
  }
  return state.optionOrders.get(question.id);
}

function getRandomIndex(length) {
  if (length <= 1) return 0;
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % length;
  }
  return Math.floor(Math.random() * length);
}

function showStudySupport() {
  state.studySupportVisible = true;
  renderStudySupport(getCurrentQuestion());
}

function renderStudySupport(question) {
  el.definitionList.innerHTML = "";

  if (!question) {
    el.studySupportStatus.textContent = "0 definitions";
    el.define.disabled = true;
    el.define.parentElement.classList.add("hidden");
    el.definitionList.classList.add("hidden");
    return;
  }

  const terms = question._definitions ?? findMedicalTerms(question);
  el.studySupportStatus.textContent = `${terms.length} ${terms.length === 1 ? "definition" : "definitions"}`;
  el.define.disabled = terms.length === 0;

  if (terms.length === 0) {
    el.define.parentElement.classList.add("hidden");
    el.definitionList.classList.remove("hidden");
    el.definitionList.innerHTML = `<p class="definition-empty">No glossary definitions detected in this question.</p>`;
    return;
  }

  if (!state.studySupportVisible) {
    el.define.parentElement.classList.remove("hidden");
    el.definitionList.classList.add("hidden");
    return;
  }

  el.define.parentElement.classList.add("hidden");
  el.definitionList.classList.remove("hidden");

  renderDefinitions(terms);
}

function renderDefinitions(terms) {
  const fragment = document.createDocumentFragment();
  terms.forEach(([term, definition]) => {
    const item = document.createElement("article");
    item.className = "definition-item";

    const headingRow = document.createElement("div");
    headingRow.className = "definition-heading-row";

    const heading = document.createElement("h3");
    const headingText = document.createElement("span");
    headingText.textContent = toTitleCase(term);

    const googleLink = document.createElement("a");
    googleLink.className = "google-it-link";
    googleLink.href = googleSearchUrl(term);
    googleLink.target = "_blank";
    googleLink.rel = "noopener noreferrer";
    googleLink.setAttribute("aria-label", `Google ${toTitleCase(term)}`);
    googleLink.title = `Google ${toTitleCase(term)}`;
    googleLink.innerHTML = googleIconSvg();
    heading.append(headingText, googleLink);

    const description = document.createElement("p");
    description.textContent = definition;

    headingRow.append(heading);
    item.append(headingRow, description);
    fragment.append(item);
  });
  el.definitionList.append(fragment);
}

function googleSearchUrl(topic) {
  return `https://www.google.com/search?q=${encodeURIComponent(topic)}`;
}

function googleIconSvg() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"/>
      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"/>
      <path fill="#fbbc05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"/>
      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z"/>
    </svg>
  `;
}

function findMedicalTerms(question) {
  const options = Array.isArray(question.options) ? question.options : [];
  const prompts = Array.isArray(question.prompts) ? question.prompts : [];
  const blanks = Array.isArray(question.blanks) ? question.blanks : [];

  const text = [
    question.stem,
    ...options,
    ...prompts.flatMap((prompt) => [prompt.prompt, prompt.answer]),
    ...blanks.flatMap((blank) => [blank.label, ...(blank.answers ?? [])]),
    question.drug,
    question.topic,
    question.system,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const searchableText = normalizeMedicalTermText(text);

  const seen = new Set();
  const matchedTerms = glossaryEntries
    .map((entry) => ({
      ...entry,
      matchIndex: searchableText.search(entry.regex),
    }))
    .filter(({ matchIndex }) => matchIndex !== -1)
    .filter(({ dedupeKey }) => {
      const key = dedupeKey;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.matchIndex - b.matchIndex || b.term.length - a.term.length || a.term.localeCompare(b.term));

  const matchedTermNames = new Set(matchedTerms.map(({ term }) => term));

  return matchedTerms
    .filter(({ term }) => !shouldHideGenericMatchedTerm(term, matchedTermNames))
    .map(({ term, definition }) => [term, definition]);
}

function shouldHideGenericMatchedTerm(term, matchedTermNames) {
  const hasAny = (terms) => terms.some((matchedTerm) => matchedTermNames.has(matchedTerm));

  return (
    (term === "calcium" && matchedTermNames.has("calcium acetate")) ||
    (term === "sodium" && hasAny(["sodium chloride", "0.9% sodium chloride", "normal saline", "hypertonic saline", "hypotonic saline"])) ||
    (term === "sodium chloride" && matchedTermNames.has("0.9% sodium chloride")) ||
    (term === "acidosis" && hasAny(["metabolic acidosis", "respiratory acidosis"])) ||
    (term === "alkalosis" && hasAny(["metabolic alkalosis", "respiratory alkalosis"])) ||
    (term === "antidiuretic hormone" && matchedTermNames.has("syndrome of inappropriate antidiuretic hormone"))
  );
}

function normalizeMedicalTermText(text) {
  return text
    .replace(/\bh\.\s*pylori\b/g, "h pylori")
    .replace(/\blactated\s+ringer'?s?\s+solution\b/g, "lactated ringers")
    .replace(/\bsemi-?fowler'?s?\b/g, "semi-fowler position")
    .replace(/\bhigh-?fowler'?s?\b/g, "high-fowler position")
    .replace(/\blwmh\b/g, "lmwh")
    .replace(/\b([a-z])-?\s+and\s+([a-z])-cell(s)?\b/g, "$1-cell $2-cell")
    .replace(/\b([a-z])-?\s+and\s+([a-z])\s+cell(s)?\b/g, "$1 cell $2 cell");
}

function buildTermRegex(term) {
  const variants = new Set([term]);
  const tokens = term.split(/[\s-]+/).filter(Boolean);
  const lastToken = tokens.at(-1);

  if (lastToken) {
    const pluralTokens = [...tokens];
    pluralTokens[pluralTokens.length - 1] = pluralizeTermToken(lastToken);
    variants.add(pluralTokens.join(" "));
  }

  const pattern = [...variants]
    .map((variant) => variant.split(/[\s-]+/).filter(Boolean).map(escapeRegExp).join("[\\s-]+"))
    .join("|");

  return new RegExp(`\\b(?:${pattern})\\b`, "i");
}

function pluralizeTermToken(token) {
  if (/[^aeiou]y$/i.test(token)) return token.replace(/y$/i, "ies");
  if (/(s|x|z|ch|sh)$/i.test(token)) return `${token}es`;
  return `${token}s`;
}

function setsMatch(a, b) {
  if (a.size !== b.size) return false;
  return [...a].every((value) => b.has(value));
}

function normalizeFreeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[.]+$/g, "")
    .replace(/\s+/g, " ");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toTitleCase(value) {
  if (termLabels[value]) return termLabels[value];
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
