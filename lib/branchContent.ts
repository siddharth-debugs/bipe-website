/**
 * Long-form, SEO-targeted copy per branch — used by app/courses/[branch].
 *
 * Each entry is keyed by the branch slug in DATA.branches. Keep the voice
 * factual: BTEUP curriculum is public-domain; recruiter and career claims
 * are pulled from the verified recruiters list and placement record on
 * /alumni and /placements. Don't add roles or companies that aren't
 * already supported elsewhere on the site.
 *
 * Audit context (May 2026): the site previously had no per-branch pages,
 * which left 5 high-intent keyword clusters unowned. These pages target
 * "<branch> diploma Varanasi", "<branch> polytechnic Phoolpur",
 * "BTEUP <code>", and the rare "dairy engineering UP" cluster.
 */
/**
 * Per-semester syllabus row.
 *
 * Subjects are listed as plain strings without BTE UP codes or
 * marks-distribution. Why: codes and marks change across BTE UP
 * gazette revisions (typically every 3–5 years). Showing them on
 * the public site only to drift out of date erodes credibility.
 * Subject names are stable across revisions; that's what we surface.
 *
 * For verifiable detail, the branch page UI links to bteup.org.in
 * with the BTEUP code already filled in — students can check the
 * current gazette in one click.
 *
 * Where a subject is primarily lab/practical work, the name itself
 * makes that clear ("Workshop Practice", "Mini Project", "Industrial
 * Training") — no separate type flag needed.
 */
export interface SemesterPlan {
  /** 1–6. */
  semester: number;
  /** Short header for the semester — what this term is about. */
  theme: string;
  /** Subject names per BTE UP polytechnic curriculum for this branch + semester. */
  subjects: string[];
}

export type BranchDetail = {
  /** Hero metadata. */
  intro: string;
  /**
   * Bullet list of 6 semester themes — short headers used in cards.
   * Deprecated: prefer `semesters[].theme` going forward. Left in
   * place for any consumer that still reads the flat array (none
   * known as of 2026-05-20, but kept for transition safety).
   */
  semesterThemes: string[];
  /**
   * Full structured syllabus — 6 semesters with subject lists per
   * BTE UP polytechnic curriculum. Indicative — the official source
   * of truth is the BTE UP gazette (bteup.org.in). The branch page
   * surfaces a "verify against gazette" note + deep link.
   */
  semesters: SemesterPlan[];
  /** Branch-specific lab facilities, 3–5 items. */
  labs: { name: string; body: string }[];
  /** Career paths the diploma qualifies for. */
  careers: string[];
  /** Recruiters relevant to this branch — must exist on /alumni / /placements. */
  recruiters: string[];
  /** 4–5 branch-specific FAQ Q&As — also fed into FAQPage JSON-LD. */
  faqs: { q: string; a: string }[];
};

/**
 * Common foundation subjects shared across all five branches in
 * Semesters 1 and 2 of the BTE UP polytechnic curriculum. Branches
 * differ on one or two slots (e.g. CSE swaps "Basic Electronics"
 * for an extra programming slot; Civil includes "Civil Engineering
 * Materials"). Each branch's `semesters` array overrides the slots
 * that differ rather than DRYing this out at module level —
 * readability of each branch entry wins over deduplication.
 */

export const BRANCH_DETAIL: Record<string, BranchDetail> = {
  "computer-science-engineering": {
    intro:
      "The Diploma in Computer Science & Engineering at BIPE is a 3-year, 6-semester BTEUP programme (code 355) — programming-first, AICTE-approved, JEECUP-admitted under institute code 4455. Three of the six semesters are spent in our 120-computer programming lab, so students leave the diploma already comfortable with Python, Java, web stacks and a working knowledge of data structures, networks and an introduction to AI/ML.",
    semesterThemes: [
      "Sem 1 — Applied Mathematics, English, Engineering Physics & Chemistry, Computer Fundamentals",
      "Sem 2 — C Programming, Digital Electronics, Operating System Concepts",
      "Sem 3 — Data Structures using C, Object-Oriented Programming (C++/Java), Database Management Systems",
      "Sem 4 — Computer Networks, Web Development (HTML/CSS/JavaScript), Software Engineering",
      "Sem 5 — Python Programming, Introduction to AI/ML, Mobile Application Development, Mini Project",
      "Sem 6 — Cyber Security, Cloud & DevOps fundamentals, Industrial Training, Final-year Project & Expo",
    ],
    semesters: [
      {
        semester: 1,
        theme: "Foundation",
        subjects: [
          "Communication Skills in English",
          "Engineering Mathematics – I",
          "Engineering Physics",
          "Engineering Chemistry",
          "Engineering Drawing",
          "Computer Fundamentals",
          "Workshop Practice",
        ],
      },
      {
        semester: 2,
        theme: "Foundation computing",
        subjects: [
          "Communication Skills in English – II",
          "Engineering Mathematics – II",
          "Programming in C",
          "Digital Electronics",
          "Computer Office Automation",
          "Internet & Web Page Designing (HTML)",
          "Engineering Workshop",
        ],
      },
      {
        semester: 3,
        theme: "Core programming",
        subjects: [
          "Data Structures using C",
          "Object-Oriented Programming with C++ / Java",
          "Database Management Systems",
          "Computer Architecture & Organisation",
          "Operating System Concepts",
          "Internet & Web Programming (CSS, JavaScript)",
          "Software Lab — Data Structures",
        ],
      },
      {
        semester: 4,
        theme: "Systems & networks",
        subjects: [
          "Computer Networks",
          "Web Technologies (PHP / Node.js)",
          "Software Engineering",
          "Microprocessor & Assembly Language",
          "Computer Hardware & Peripherals",
          "Java Programming",
          "Database Lab — SQL",
        ],
      },
      {
        semester: 5,
        theme: "Specialisation",
        subjects: [
          "Python Programming",
          "Introduction to AI / Machine Learning",
          "Mobile Application Development",
          "Computer Graphics",
          "Industrial Visit & Report",
          "Mini Project — Group of 3",
          "Web Development Lab",
        ],
      },
      {
        semester: 6,
        theme: "Industry & capstone",
        subjects: [
          "Cyber Security & Ethical Hacking",
          "Cloud Computing & DevOps Fundamentals",
          "Internet of Things (IoT)",
          "Final-year Project — capstone",
          "Industrial Training (6 months / 600 hours)",
          "Project Expo & Viva Voce",
        ],
      },
    ],
    labs: [
      { name: "120-computer programming lab", body: "BIPE's flagship lab — 120 networked workstations running a Linux/Windows dual-boot image with all the toolchains pre-installed. Most batches spend 12–15 contact hours a week here." },
      { name: "Networking & IoT lab", body: "Cisco-grade switches, routers, a rack-mounted server, ESP32/Raspberry-Pi kits for IoT projects, and a hands-on CCNA-style curriculum in Sem 4." },
      { name: "Project lab", body: "Dedicated space where Sem-5 and Sem-6 students build and ship final projects under faculty mentorship. Third-year project expo runs annually." },
    ],
    careers: [
      "Junior software developer (web, mobile, enterprise)",
      "Database / network administrator (SSC JE, RRB JE eligible)",
      "Lateral entry to AKTU / state universities for B.Tech CSE / IT",
      "Cybersecurity & cloud associate roles via certification pathways",
      "Government IT cadres — UPPCL, UPSRTC, banks (clerical / technical)",
    ],
    recruiters: ["Wipro Infrastructure Engineering", "Indian Railways", "UPPCL", "Asian Paints", "Mumbai Metro"],
    faqs: [
      { q: "Is BIPE's CSE diploma the same as a B.Tech CSE?", a: "No — a diploma is a 3-year programme after Class 10, while B.Tech is a 4-year programme after Class 12. The diploma is a fast, hands-on route into IT roles; many BIPE alumni use lateral entry to enter the second year of B.Tech CSE at AKTU and state universities afterwards." },
      { q: "What programming languages will I learn?", a: "C in Semester 2 and Data Structures in C in Semester 3, followed by Java/C++ (OOP), then JavaScript for web, then Python with an AI/ML introduction in Semester 5. Students leave with working fluency in at least three languages." },
      { q: "Do CSE diploma students get placed?", a: "Yes — CSE alumni from BIPE work at Wipro Infrastructure Engineering, Asian Paints, Indian Railways IT cadres and similar. SSC JE and RRB JE (Information Technology) are direct pathways. See /placements for the full recruiter list." },
      { q: "Is the BTEUP code for CSE at BIPE 355?", a: "Yes. Computer Science & Engineering at BIPE is BTEUP code 355, JEECUP institute code 4455. AICTE permanent ID 1-488233171." },
      { q: "Do I need to know programming before joining the CSE diploma?", a: "No prior programming knowledge is required. The curriculum starts from Computer Fundamentals in Semester 1 and builds up — by Semester 3 you'll be writing data-structures programs from scratch. Most BIPE CSE entrants come from Class 10 with no exposure to programming and still leave fluent in 3-4 languages." },
      { q: "Can a CSE diploma holder join Wipro / TCS / Infosys?", a: "Yes for support and infrastructure-engineering tracks, which are the entry points BIPE alumni typically take. Wipro Infrastructure Engineering recruits BIPE CSE diploma holders directly each year. For mainstream software-developer roles at the big-3 IT companies, most alumni complete a lateral-entry B.Tech first — the 3+2 pathway (3-year diploma + lateral entry to B.Tech Year 2) is well-established and produces graduates the IT companies accept on par with regular B.Tech CSE." },
      { q: "What kind of mini and final-year projects do CSE students build?", a: "Semester 5 mini projects are group-of-3 web or mobile apps — past examples include attendance trackers using QR codes, hostel-mess feedback portals, and small e-commerce frontends. Semester 6 final projects are individual capstones with broader scope: IoT systems (sensor + Raspberry Pi + cloud dashboard), Python-based ML demos, full-stack web apps. Projects are demonstrated at the annual Project Expo at Technofest in February." },
    ],
  },
  "dairy-engineering": {
    intro:
      "The Diploma in Dairy Engineering at BIPE (also called Dairy Technology at degree level — the diploma board uses 'Engineering') is one of only four BTEUP-affiliated diploma programmes of its kind across all of Uttar Pradesh — code 327, 3 years, 6 semesters, AICTE-approved. The curriculum covers milk processing, dairy machinery, refrigeration, microbiology and quality assurance, with hands-on time in the campus pilot plant. Recruiter pipelines run into Amul, Mother Dairy, Parag, Nestlé, NDDB and the State Dairy Boards — career options that simply don't exist for graduates of other branches.",
    semesterThemes: [
      "Sem 1 — Applied Mathematics, Engineering Physics & Chemistry, Dairy Industry Overview",
      "Sem 2 — Dairy Microbiology, Heat Transfer, Mechanics of Dairy Plant",
      "Sem 3 — Market Milk Processing, Dairy Engineering Drawing, Fluid Mechanics",
      "Sem 4 — Dairy Plant Operations, Refrigeration & Air Conditioning, Dairy Chemistry",
      "Sem 5 — Dairy Products Technology (curd, paneer, ghee, ice-cream), Dairy Plant Sanitation, Mini Project",
      "Sem 6 — Quality Control & Food Safety (FSSAI), Industrial Training (Amul/NDDB/Parag), Final Project",
    ],
    semesters: [
      {
        semester: 1,
        theme: "Foundation",
        subjects: [
          "Communication Skills in English",
          "Engineering Mathematics – I",
          "Engineering Physics",
          "Engineering Chemistry",
          "Engineering Drawing",
          "Dairy Industry Overview",
          "Workshop Practice",
        ],
      },
      {
        semester: 2,
        theme: "Microbiology & mechanics",
        subjects: [
          "Communication Skills in English – II",
          "Engineering Mathematics – II",
          "Applied Mechanics",
          "Dairy Microbiology",
          "Heat Transfer in Dairy",
          "Basic Electrical Engineering",
          "Dairy Workshop",
        ],
      },
      {
        semester: 3,
        theme: "Processing & drawing",
        subjects: [
          "Market Milk Processing",
          "Dairy Engineering Drawing",
          "Fluid Mechanics",
          "Dairy Chemistry",
          "Computer Applications in Dairy",
          "Refrigeration in Dairy Plant",
          "Milk Reception Lab",
        ],
      },
      {
        semester: 4,
        theme: "Plant operations",
        subjects: [
          "Dairy Plant Operations",
          "Refrigeration & Air Conditioning",
          "Dairy Plant Layout & Design",
          "Industrial Statistics & Quality Control",
          "Dairy Machinery & Maintenance",
          "Packaging Technology",
          "Processing Lab — Pasteurisation & Homogenisation",
        ],
      },
      {
        semester: 5,
        theme: "Products technology",
        subjects: [
          "Indigenous Dairy Products (Curd, Paneer, Ghee)",
          "Condensed & Dried Milk Products",
          "Ice-Cream & Frozen Desserts",
          "Fat-Rich Dairy Products",
          "Dairy Plant Sanitation & Hygiene",
          "Mini Project — Product Development",
          "Industrial Visit (NDDB / Amul plant)",
        ],
      },
      {
        semester: 6,
        theme: "Quality, industry & capstone",
        subjects: [
          "Quality Control & Food Safety (FSSAI norms)",
          "Dairy Business Management & Marketing",
          "Dairy Plant Maintenance & Utilities",
          "Final-year Project — capstone",
          "Industrial Training (6 months at Amul / Mother Dairy / NDDB / Parag)",
          "Project Expo & Viva Voce",
        ],
      },
    ],
    labs: [
      { name: "Dairy pilot plant", body: "BIPE's campus pilot plant — pasteuriser, separator, homogeniser, packaging line — gives students real machine time on every unit operation the BTEUP syllabus covers." },
      { name: "Dairy microbiology & chemistry lab", body: "Standard plate counts, antibiotic residue tests, lactometer and fat-percentage analysis — the FSSAI-aligned analytical curriculum is taught here." },
      { name: "Refrigeration & utilities lab", body: "Compressor, condenser and evaporator test rigs for the Semester 4 refrigeration module — students size and commission cold-room and chilling equipment." },
    ],
    careers: [
      "Plant operator / shift engineer at Amul, Mother Dairy, Parag, Nestlé",
      "Quality control & FSSAI compliance roles in dairy and food processing",
      "Junior Engineer at NDDB and State Dairy Federations (UP, Bihar, MP)",
      "Lateral entry to B.Tech Dairy Technology at NDRI Karnal, SHIATS Allahabad and ICAR institutes",
      "Self-employment — small-scale dairy plants, paneer / ghee / curd brands",
    ],
    recruiters: ["Amul", "Mother Dairy", "Parag", "Nestlé", "NDDB"],
    faqs: [
      { q: "Is Dairy Engineering at BIPE BTEUP 327?", a: "Yes — Dairy Engineering at BIPE is BTEUP code 327, JEECUP institute code 4455. BIPE is one of only four institutes in UP offering this programme — a genuinely rare credential." },
      { q: "What's the difference between Dairy Engineering and Dairy Technology?", a: "Dairy Engineering (BTEUP 327) is a 3-year diploma after Class 10, focused on the machinery, processing and plant operation side. Dairy Technology is typically a longer degree (B.Tech, 4 years, after Class 12) at institutes like NDRI Karnal. BIPE alumni regularly use lateral entry into B.Tech Dairy Technology after the diploma." },
      { q: "Where do Dairy Engineering graduates work?", a: "Plant-floor and quality roles at Amul, Mother Dairy, Parag, Nestlé and NDDB. Junior Engineer cadres at State Dairy Federations are diploma-eligible. Some alumni start their own small-scale dairy ventures using the pilot-plant experience." },
      { q: "Do girls take admission in Dairy Engineering at BIPE?", a: "Yes — Dairy Engineering is open to all applicants who clear JEECUP Group A and select code 4455 during counselling. There is no gender restriction on the branch." },
      { q: "What is the starting salary after Dairy Engineering diploma?", a: "Plant-operator and quality-control roles at Amul, Mother Dairy and Parag start at ₹18,000-28,000/month for fresh diploma graduates. Junior Engineer (Dairy) roles at State Dairy Federations and NDDB start ₹30,000-40,000/month in-hand plus DA. After 3-5 years of plant experience, shift-engineer roles cross ₹45,000-55,000/month routinely. The dairy sector pays close to or slightly above the equivalent grade in mechanical / electrical at the entry level because the talent pool is small." },
      { q: "Is dairy engineering a good career choice in 2026?", a: "Yes — for a specific reason. The Indian dairy market is the world's largest by volume (235 million metric tonnes/year) and is shifting from unorganised milkman supply to organised processed dairy (paneer, curd, ghee, ice-cream, condensed milk). That shift creates structural demand for trained dairy engineers that doesn't exist in the same way for mechanical or civil. Recruiter pipelines like Amul / NDDB / Parag actively visit polytechnics with dairy diplomas because there are only four such polytechnics in UP. Lower competition for jobs, sector tailwinds." },
      { q: "What does the campus pilot plant actually have?", a: "The BIPE dairy pilot plant includes a milk-reception bay with weighing platform, a pasteuriser (HTST plate heat exchanger), a centrifugal cream separator, a homogeniser, a packaging line (pouch + bottle), and an attached refrigeration / cold-room setup. Students work through every unit operation in the BTEUP syllabus — pasteurisation curves, fat-percentage testing, plate-count microbiology — on actual machinery, not just lab models. The plant runs supervised batches during Semester 4-5 product-technology modules." },
    ],
  },
  "civil-engineering": {
    intro:
      "The Diploma in Civil Engineering at BIPE is a 3-year, 6-semester BTEUP programme (code 322), AICTE-approved, JEECUP-admitted under institute code 4455 — 120 seats, AFRC tuition ₹30,150/year. The curriculum covers building construction, surveying, transportation, hydraulics and structural design, with field practice at the campus survey yard and live construction sites in and around Phoolpur. India's Smart Cities, Bharatmala and Kashi Vishwanath corridor work need civil diploma holders by the thousand — SSC JE and RRB JE are direct pathways.",
    semesterThemes: [
      "Sem 1 — Applied Mathematics, Engineering Physics & Chemistry, Engineering Drawing",
      "Sem 2 — Building Materials, Surveying I (chain & compass), Construction Practice",
      "Sem 3 — Surveying II (theodolite, levelling), Mechanics of Materials, Concrete Technology",
      "Sem 4 — Structural Design (RCC, steel), Transportation Engineering (highways, railways), Hydraulics",
      "Sem 5 — Estimating & Costing, Quantity Surveying, Construction Management, Mini Project",
      "Sem 6 — Earthquake Engineering basics, Site Internship, Final Project (design + drawings)",
    ],
    semesters: [
      {
        semester: 1,
        theme: "Foundation",
        subjects: [
          "Communication Skills in English",
          "Engineering Mathematics – I",
          "Engineering Physics",
          "Engineering Chemistry",
          "Engineering Drawing",
          "Basic Civil Engineering",
          "Workshop Practice",
        ],
      },
      {
        semester: 2,
        theme: "Building & survey basics",
        subjects: [
          "Communication Skills in English – II",
          "Engineering Mathematics – II",
          "Applied Mechanics",
          "Building Materials & Construction",
          "Surveying – I (chain & compass)",
          "Civil Engineering Drawing",
          "Construction Practice Lab",
        ],
      },
      {
        semester: 3,
        theme: "Surveying & materials",
        subjects: [
          "Surveying – II (theodolite, levelling, contouring)",
          "Mechanics of Materials (Strength of Materials)",
          "Concrete Technology",
          "Building Construction & Drawing",
          "Hydraulics",
          "Computer-Aided Drafting (AutoCAD)",
          "Survey Camp",
        ],
      },
      {
        semester: 4,
        theme: "Structures & transportation",
        subjects: [
          "Design of RCC Structures",
          "Design of Steel Structures",
          "Transportation Engineering (Highways, Railways)",
          "Public Health Engineering (Water Supply & Sanitation)",
          "Soil Mechanics & Foundation Engineering",
          "Construction Materials Testing Lab",
        ],
      },
      {
        semester: 5,
        theme: "Estimation & management",
        subjects: [
          "Estimating, Costing & Valuation",
          "Quantity Surveying",
          "Construction Management",
          "Environmental Engineering",
          "Earthquake-Resistant Construction",
          "Mini Project — Building Plan",
          "Site Visit & Report",
        ],
      },
      {
        semester: 6,
        theme: "Industry & capstone",
        subjects: [
          "Advanced Construction Techniques",
          "Disaster Management",
          "Final-year Project (design + working drawings)",
          "Industrial Training (6 months — JE / contractor / Smart City site)",
          "Project Viva Voce",
        ],
      },
    ],
    labs: [
      { name: "Survey yard & instrument lab", body: "Chains, compasses, theodolites, dumpy and auto levels — students run a full Sem-3 survey camp on the 6-acre campus and adjoining village fields." },
      { name: "Concrete & materials testing lab", body: "Compression testing machine, slump cone, sieve shaker — the BIS-aligned material-testing curriculum is taught hands-on here." },
      { name: "Drawing & CAD lab", body: "Hand-drafting boards plus AutoCAD workstations for RCC drawings, building plans and the Semester-6 final design submission." },
    ],
    careers: [
      "Junior Engineer (Civil) — SSC JE, RRB JE, UPPCL, UP PWD, Indian Railways, Mumbai Metro",
      "Site engineer / supervisor at builders and construction contractors",
      "Quantity surveyor / estimator at consulting firms",
      "Lateral entry to B.Tech Civil at AKTU and state universities",
      "Self-employed contractor for small-scale residential / commercial work",
    ],
    recruiters: ["Indian Railways", "Mumbai Metro", "UPPCL", "Tata Steel", "JCB"],
    faqs: [
      { q: "Is BIPE Civil Engineering BTEUP 322?", a: "Yes — Civil Engineering at BIPE is BTEUP code 322, JEECUP institute code 4455. AICTE permanent ID 1-488233171." },
      { q: "Can a civil diploma holder apply for SSC JE or RRB JE?", a: "Yes — a 3-year BTEUP civil diploma is the standard eligibility for the Junior Engineer (Civil) cadres at SSC, RRB, UPPCL, UP PWD and Indian Railways. Many BIPE alumni work as JEs across these organisations." },
      { q: "How many seats does BIPE have for Civil?", a: "120 seats — admitted via JEECUP Group A counselling under institute code 4455. AFRC-approved tuition is ₹30,150/year, the same as every other branch at BIPE." },
      { q: "Is site exposure part of the curriculum?", a: "Yes — survey camps in Semester 3, construction-site visits in Semesters 4 and 5, and a mandatory industrial training in Semester 6. Several visits each year happen at active Smart Cities and Kashi corridor sites." },
      { q: "What is the starting salary after a Civil Engineering diploma?", a: "Government Junior Engineer (Civil) roles at SSC JE / RRB JE / UPPCL / UP PWD start at ₹35,000-44,000/month in-hand plus DA and allowances. Private sector site-engineer roles typically start ₹18,000-28,000/month. With 3-5 years of experience and an SSC JE certification, total compensation crosses ₹50,000/month routinely for BIPE alumni." },
      { q: "Can I become an architect after Civil Engineering diploma?", a: "Not directly — architecture is a separate professional path requiring a 5-year B.Arch degree after Class 12 with NATA / JEE Architecture entrance. A civil diploma covers structural design and drawing but does not qualify graduates as Architects under the Council of Architecture's licensing rules. Civil diploma holders work on the engineering side of construction (site engineering, RCC design, surveying, project supervision); architects do the design side." },
      { q: "What is the difference between Civil Engineering and Civil Construction Technology diplomas?", a: "Civil Engineering (BTEUP 322, what BIPE offers) is the broader curriculum: structures, surveying, hydraulics, transportation, environmental engineering, costing — three years of full engineering coverage. Civil Construction Technology is a narrower diploma focused only on construction-site supervision and finishing trades, taught at some ITIs and smaller polytechnics. The civil engineering diploma opens more JE-eligible exams and lateral-entry pathways." },
    ],
  },
  "electrical-engineering": {
    intro:
      "The Diploma in Electrical Engineering at BIPE is a 3-year, 6-semester BTEUP programme (code 328), AICTE-approved, JEECUP-admitted under institute code 4455 — 120 seats, AFRC tuition ₹30,150/year. The curriculum spans circuits, machines, power systems, distribution, control and the new renewable-energy modules. UPPCL, Tata Power, Adani Solar and the Indian Railways electrical cadres all recruit BIPE diploma graduates each year.",
    semesterThemes: [
      "Sem 1 — Applied Mathematics, Engineering Physics & Chemistry, Basic Electrical Engineering",
      "Sem 2 — DC & AC Circuits, Electrical Measuring Instruments, Workshop Practice",
      "Sem 3 — Electrical Machines I (DC machines, transformers), Electronic Devices",
      "Sem 4 — Electrical Machines II (induction & synchronous motors), Power Systems I, PLC basics",
      "Sem 5 — Power Systems II (transmission & distribution), Renewable Energy, Mini Project",
      "Sem 6 — Switchgear & Protection, Industrial Drives & Control, Industrial Training, Final Project",
    ],
    semesters: [
      {
        semester: 1,
        theme: "Foundation",
        subjects: [
          "Communication Skills in English",
          "Engineering Mathematics – I",
          "Engineering Physics",
          "Engineering Chemistry",
          "Engineering Drawing",
          "Basic Electrical Engineering",
          "Electrical Workshop",
        ],
      },
      {
        semester: 2,
        theme: "Circuits & instruments",
        subjects: [
          "Communication Skills in English – II",
          "Engineering Mathematics – II",
          "DC & AC Circuits",
          "Electrical Measuring Instruments",
          "Electrical Engineering Materials",
          "Basic Electronics",
          "Workshop Practice",
        ],
      },
      {
        semester: 3,
        theme: "Machines & electronics",
        subjects: [
          "Electrical Machines – I (DC Machines & Transformers)",
          "Electronic Devices & Circuits",
          "Electrical Wiring & Estimation",
          "Digital Electronics",
          "Industrial Drafting (AutoCAD Electrical)",
          "Machines Lab",
        ],
      },
      {
        semester: 4,
        theme: "Power & control",
        subjects: [
          "Electrical Machines – II (Induction & Synchronous Motors)",
          "Power Systems – I (Generation)",
          "Programmable Logic Controllers (PLC)",
          "Electrical Installation & Maintenance",
          "Microprocessor & Microcontroller",
          "Industrial Drives Lab",
        ],
      },
      {
        semester: 5,
        theme: "Distribution & renewables",
        subjects: [
          "Power Systems – II (Transmission & Distribution)",
          "Power Electronics",
          "Control Systems",
          "Renewable Energy Sources (Solar PV, Wind, EV)",
          "Mini Project — Circuit / Control",
          "Substation Visit & Report",
        ],
      },
      {
        semester: 6,
        theme: "Industry & capstone",
        subjects: [
          "Switchgear & Protection",
          "Industrial Drives & Speed Control",
          "Electrical Estimation & Costing",
          "Final-year Project — capstone",
          "Industrial Training (6 months — UPPCL / Tata Power / Adani Solar / Indian Railways)",
          "Project Viva Voce",
        ],
      },
    ],
    labs: [
      { name: "Electrical machines bay", body: "Working DC machines, single-phase and three-phase transformers, induction and synchronous motors with full load testing — students wire, run and measure performance on every machine in the BTEUP syllabus." },
      { name: "Power systems & switchgear lab", body: "Distribution boards, MCB/MCCB demonstrators, relays and protection setups, plus an annual industrial visit to a 220 kV substation for live exposure." },
      { name: "Renewable energy lab", body: "Solar PV modules with charge controllers, an EV battery and motor test setup — directly aligned to the new Sem-5 renewable-energy module." },
    ],
    careers: [
      "Junior Engineer (Electrical) — SSC JE, RRB JE, UPPCL, Indian Railways",
      "Plant electrical engineer / shift in-charge at manufacturing and process industries",
      "Distribution / substation operator at state utilities",
      "Solar & EV technician roles at Tata Power, Adani Solar, Ola Electric, Ather",
      "Lateral entry to B.Tech Electrical / Electronics at AKTU and state universities",
    ],
    recruiters: ["UPPCL", "Tata Power", "Adani Solar", "Ola Electric", "Ather"],
    faqs: [
      { q: "Is BIPE Electrical Engineering BTEUP 328?", a: "Yes — Electrical Engineering at BIPE is BTEUP code 328, JEECUP institute code 4455. AICTE permanent ID 1-488233171." },
      { q: "Are there renewable-energy modules in the diploma?", a: "Yes — Semester 5 has a full Renewable Energy module covering solar PV, wind, and grid integration basics, taught with the campus solar-PV setup and the EV battery / motor test bench." },
      { q: "Which government Junior Engineer exams can I take?", a: "SSC JE (Electrical), RRB JE (Electrical), UPPCL JE, UP PWD electrical wing — all accept a 3-year BTEUP diploma as eligibility. Multiple BIPE alumni have cleared each of these." },
      { q: "Is there industrial exposure?", a: "Annual 220 kV substation visit, mandatory Semester-6 industrial training, and routine plant visits in Semesters 4 and 5. The Electrical branch runs more industrial visits than any other at BIPE." },
      { q: "Can an electrical diploma holder work in solar / EV / Adani Green?", a: "Yes — the renewable-energy and power-electronics modules in Semesters 4-5 are scoped to the same techniques solar and EV employers use. Tata Power, Adani Solar, Ola Electric and Ather Energy all recruit BIPE Electrical diploma alumni each year. Solar-installation roles, EV battery-management technician roles, and substation-operations roles are the most common entry points." },
      { q: "What is the starting salary for an Electrical diploma graduate?", a: "Government Junior Engineer (Electrical) at UPPCL / SSC JE / RRB JE starts at ₹35,000-44,000/month in-hand. Private sector roles at Tata Power, Adani Solar or large electrical-equipment manufacturers start ₹20,000-32,000/month. The renewable-energy specialty premium adds ₹3,000-5,000/month at hiring — solar and EV employers pay slightly above the base electrical-diploma rate." },
      { q: "Is the Electrical Engineering diploma the same as Electrical and Electronics Engineering?", a: "No — Electrical Engineering (EE, BTEUP 328 — what BIPE offers) focuses on power generation, transmission, distribution, machines and renewable systems. Electrical and Electronics Engineering (EEE) and Electronics & Communication Engineering (ECE) are separate diplomas in different BTEUP codes that cover semiconductor electronics, signal processing and communication systems. The two paths overlap in Semester 3 (Electronic Devices & Circuits) but diverge after that. For solar / power / industrial-motors careers, EE is the right diploma." },
    ],
  },
  "mechanical-engineering-production": {
    intro:
      "The Diploma in Mechanical Engineering (Production) at BIPE is a 3-year, 6-semester BTEUP programme (code 343), AICTE-approved, JEECUP-admitted under institute code 4455 — 120 seats, AFRC tuition ₹30,150/year. The branch is workshop-first: welding, fitting, foundry, machining and CNC are all taught on the production floor, not from a textbook. Mahindra, Tata Motors, BHEL and JBM Group run apprentice-and-place pipelines with BIPE alumni each year.",
    semesterThemes: [
      "Sem 1 — Applied Mathematics, Engineering Physics & Chemistry, Workshop Practice I (carpentry, fitting)",
      "Sem 2 — Engineering Mechanics, Workshop Practice II (welding, foundry, sheet metal)",
      "Sem 3 — Strength of Materials, Theory of Machines, Manufacturing Processes I (turning, milling)",
      "Sem 4 — Thermal Engineering, Fluid Mechanics, Manufacturing Processes II (CNC, grinding)",
      "Sem 5 — Industrial Engineering, Quality Control, CAD/CAM, Mini Project",
      "Sem 6 — Tool & Die Design, Production Planning & Control, Industrial Training, Final Project",
    ],
    semesters: [
      {
        semester: 1,
        theme: "Foundation",
        subjects: [
          "Communication Skills in English",
          "Engineering Mathematics – I",
          "Engineering Physics",
          "Engineering Chemistry",
          "Engineering Drawing",
          "Basic Electrical Engineering",
          "Workshop Practice – I (Carpentry, Fitting)",
        ],
      },
      {
        semester: 2,
        theme: "Mechanics & workshop",
        subjects: [
          "Communication Skills in English – II",
          "Engineering Mathematics – II",
          "Engineering Mechanics",
          "Material Science",
          "Mechanical Engineering Drawing",
          "Basic Electronics",
          "Workshop Practice – II (Welding, Foundry, Sheet Metal)",
        ],
      },
      {
        semester: 3,
        theme: "Materials & machines",
        subjects: [
          "Strength of Materials",
          "Theory of Machines",
          "Thermodynamics",
          "Manufacturing Processes – I (Turning, Milling, Drilling)",
          "Industrial Statistics",
          "Computer-Aided Drafting (AutoCAD Mechanical)",
          "Machine Shop Lab",
        ],
      },
      {
        semester: 4,
        theme: "Thermal & advanced manufacturing",
        subjects: [
          "Thermal Engineering & IC Engines",
          "Fluid Mechanics & Hydraulic Machines",
          "Manufacturing Processes – II (CNC, Grinding, EDM)",
          "Machine Design – I",
          "Industrial Management",
          "Refrigeration & Air Conditioning",
          "Hydraulics Lab",
        ],
      },
      {
        semester: 5,
        theme: "Industrial engineering & design",
        subjects: [
          "Industrial Engineering & Operations",
          "Quality Control & Inspection",
          "CAD / CAM",
          "Machine Design – II",
          "Automobile Engineering",
          "Mini Project — Component Design",
          "Industrial Visit & Report",
        ],
      },
      {
        semester: 6,
        theme: "Tool design, planning & capstone",
        subjects: [
          "Tool & Die Design",
          "Production Planning & Control",
          "Power Plant Engineering",
          "Final-year Project — capstone",
          "Industrial Training (6 months — Mahindra / Tata Motors / BHEL / JBM / Bajaj)",
          "Project Viva Voce",
        ],
      },
    ],
    labs: [
      { name: "Machine shop", body: "Lathes, milling machines, drilling and grinding setups — the campus production floor where Sem-3 and Sem-4 manufacturing modules are taught hands-on." },
      { name: "Workshop bays — welding, fitting, foundry", body: "Arc and gas welding bays, foundry with sand-casting setups, fitting and sheet-metal sections. Workshop Practice I & II are taught here in Semesters 1 and 2." },
      { name: "Automobile & PT lab", body: "Engine teardown, automobile lab and the production-technology (PT) shop for assembly, fixtures and inspection drills." },
    ],
    careers: [
      "Production / shop-floor engineer at Mahindra, Tata Motors, BHEL, Bajaj, Hero MotoCorp",
      "Apprentice → permanent at JBM Group, Krishna Maruti and other Tier-1 auto suppliers",
      "Junior Engineer (Mechanical) — SSC JE, RRB JE, Indian Railways, UP PWD",
      "Quality control & inspection at manufacturing units",
      "Lateral entry to B.Tech Mechanical / Production at AKTU and state universities",
    ],
    recruiters: ["Mahindra", "Tata Motors", "BHEL", "Bajaj", "JCB"],
    faqs: [
      { q: "Is BIPE Mechanical Engineering (Production) BTEUP 343?", a: "Yes — Mechanical Engineering (Production) at BIPE is BTEUP code 343, JEECUP institute code 4455. AICTE permanent ID 1-488233171." },
      { q: "How hands-on is the curriculum?", a: "Very. Workshop Practice runs across Semesters 1 and 2 (carpentry, fitting, welding, foundry, sheet metal), then the campus machine shop hosts Sem-3 and Sem-4 manufacturing modules. Most students log 200+ hours of supervised shop-floor time before they graduate." },
      { q: "Do mechanical diploma graduates get apprenticed before being hired?", a: "Many do — Mahindra, Tata Motors, BHEL and JBM Group run apprentice-and-place pipelines where 1 year of paid apprenticeship at the company precedes a permanent offer. BIPE has placed alumni through this route every year since 2014." },
      { q: "Can I take SSC JE or RRB JE after the diploma?", a: "Yes — SSC JE (Mechanical) and RRB JE (Mechanical) accept a 3-year BTEUP diploma as eligibility. UP PWD Mechanical and Indian Railways also recruit through these channels." },
      { q: "What is the difference between Mechanical Engineering (Production) and Mechanical Automobile diplomas?", a: "Mechanical Engineering (Production) — BTEUP 343, what BIPE offers — focuses on manufacturing processes (turning, milling, CNC, casting, welding), production planning, and shop-floor engineering. Mechanical Engineering (Automobile) is a separate diploma (BTEUP 308 at some polytechnics) that adds engine technology, vehicle dynamics and automobile maintenance modules in place of some production-engineering content. Production is broader and works for any manufacturing industry; Automobile narrows to the auto sector. BIPE Production graduates are routinely hired by Mahindra, Tata Motors and Hero MotoCorp anyway." },
      { q: "Is the Mahindra / Tata Motors apprenticeship paid?", a: "Yes — apprenticeships under the National Apprenticeship Promotion Scheme (NAPS) pay a stipend of ₹9,000-15,000/month for the apprenticeship year, depending on the company and grade. After successful apprentice completion, the company typically converts to a permanent offer at ₹18,000-26,000/month plus DA and shift allowances. BIPE alumni at JBM Group, Krishna Maruti and Motherson Sumi all came through this paid-apprenticeship pipeline." },
      { q: "Can a mechanical diploma holder work as a CNC operator or programmer?", a: "Yes — Semester 4 Manufacturing Processes II covers CNC milling, turning and EDM, taught on the campus machine shop's actual CNC bench. Graduates start as CNC operators at ₹15,000-22,000/month, then move into CNC programming and production-supervision roles within 2-3 years. Many BIPE mechanical alumni at Bajaj and Mahindra began as CNC operators and now run shop-floor production lines." },
    ],
  },
};
