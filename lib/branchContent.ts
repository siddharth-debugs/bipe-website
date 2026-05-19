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
export type BranchDetail = {
  /** Hero metadata. */
  intro: string;
  /** Bullet list of 6 semester themes. */
  semesterThemes: string[];
  /** Branch-specific lab facilities, 3–5 items. */
  labs: { name: string; body: string }[];
  /** Career paths the diploma qualifies for. */
  careers: string[];
  /** Recruiters relevant to this branch — must exist on /alumni / /placements. */
  recruiters: string[];
  /** 4–5 branch-specific FAQ Q&As — also fed into FAQPage JSON-LD. */
  faqs: { q: string; a: string }[];
};

export const BRANCH_DETAIL: Record<string, BranchDetail> = {
  "computer-science-engineering": {
    intro:
      "Computer Science & Engineering at BIPE is a 3-year, 6-semester BTEUP diploma (code 355) — programming-first, AICTE-approved, JEECUP-admitted under institute code 4455. Three of the six semesters are spent in our 120-computer programming lab, so students leave the diploma already comfortable with Python, Java, web stacks and a working knowledge of data structures, networks and an introduction to AI/ML.",
    semesterThemes: [
      "Sem 1 — Applied Mathematics, English, Engineering Physics & Chemistry, Computer Fundamentals",
      "Sem 2 — C Programming, Digital Electronics, Operating System Concepts",
      "Sem 3 — Data Structures using C, Object-Oriented Programming (C++/Java), Database Management Systems",
      "Sem 4 — Computer Networks, Web Development (HTML/CSS/JavaScript), Software Engineering",
      "Sem 5 — Python Programming, Introduction to AI/ML, Mobile Application Development, Mini Project",
      "Sem 6 — Cyber Security, Cloud & DevOps fundamentals, Industrial Training, Final-year Project & Expo",
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
    ],
  },
  "dairy-engineering": {
    intro:
      "Dairy Engineering at BIPE (also called Dairy Technology at degree level — the diploma board uses 'Engineering') is one of only four BTEUP-affiliated diploma programmes of its kind across all of Uttar Pradesh — code 327, 3 years, 6 semesters, AICTE-approved. The curriculum covers milk processing, dairy machinery, refrigeration, microbiology and quality assurance, with hands-on time in the campus pilot plant. Recruiter pipelines run into Amul, Mother Dairy, Parag, Nestlé, NDDB and the State Dairy Boards — career options that simply don't exist for graduates of other branches.",
    semesterThemes: [
      "Sem 1 — Applied Mathematics, Engineering Physics & Chemistry, Dairy Industry Overview",
      "Sem 2 — Dairy Microbiology, Heat Transfer, Mechanics of Dairy Plant",
      "Sem 3 — Market Milk Processing, Dairy Engineering Drawing, Fluid Mechanics",
      "Sem 4 — Dairy Plant Operations, Refrigeration & Air Conditioning, Dairy Chemistry",
      "Sem 5 — Dairy Products Technology (curd, paneer, ghee, ice-cream), Dairy Plant Sanitation, Mini Project",
      "Sem 6 — Quality Control & Food Safety (FSSAI), Industrial Training (Amul/NDDB/Parag), Final Project",
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
    ],
  },
  "civil-engineering": {
    intro:
      "Civil Engineering at BIPE is a 3-year, 6-semester BTEUP diploma (code 322), AICTE-approved, JEECUP-admitted under institute code 4455 — 120 seats, AFRC tuition ₹30,150/year. The curriculum covers building construction, surveying, transportation, hydraulics and structural design, with field practice at the campus survey yard and live construction sites in and around Phoolpur. India's Smart Cities, Bharatmala and Kashi Vishwanath corridor work need civil diploma holders by the thousand — SSC JE and RRB JE are direct pathways.",
    semesterThemes: [
      "Sem 1 — Applied Mathematics, Engineering Physics & Chemistry, Engineering Drawing",
      "Sem 2 — Building Materials, Surveying I (chain & compass), Construction Practice",
      "Sem 3 — Surveying II (theodolite, levelling), Mechanics of Materials, Concrete Technology",
      "Sem 4 — Structural Design (RCC, steel), Transportation Engineering (highways, railways), Hydraulics",
      "Sem 5 — Estimating & Costing, Quantity Surveying, Construction Management, Mini Project",
      "Sem 6 — Earthquake Engineering basics, Site Internship, Final Project (design + drawings)",
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
    ],
  },
  "electrical-engineering": {
    intro:
      "Electrical Engineering at BIPE is a 3-year, 6-semester BTEUP diploma (code 328), AICTE-approved, JEECUP-admitted under institute code 4455 — 120 seats, AFRC tuition ₹30,150/year. The curriculum spans circuits, machines, power systems, distribution, control and the new renewable-energy modules. UPPCL, Tata Power, Adani Solar and the Indian Railways electrical cadres all recruit BIPE diploma graduates each year.",
    semesterThemes: [
      "Sem 1 — Applied Mathematics, Engineering Physics & Chemistry, Basic Electrical Engineering",
      "Sem 2 — DC & AC Circuits, Electrical Measuring Instruments, Workshop Practice",
      "Sem 3 — Electrical Machines I (DC machines, transformers), Electronic Devices",
      "Sem 4 — Electrical Machines II (induction & synchronous motors), Power Systems I, PLC basics",
      "Sem 5 — Power Systems II (transmission & distribution), Renewable Energy, Mini Project",
      "Sem 6 — Switchgear & Protection, Industrial Drives & Control, Industrial Training, Final Project",
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
    ],
  },
  "mechanical-engineering-production": {
    intro:
      "Mechanical Engineering (Production) at BIPE is a 3-year, 6-semester BTEUP diploma (code 343), AICTE-approved, JEECUP-admitted under institute code 4455 — 120 seats, AFRC tuition ₹30,150/year. The branch is workshop-first: welding, fitting, foundry, machining and CNC are all taught on the production floor, not from a textbook. Mahindra, Tata Motors, BHEL and JBM Group run apprentice-and-place pipelines with BIPE alumni each year.",
    semesterThemes: [
      "Sem 1 — Applied Mathematics, Engineering Physics & Chemistry, Workshop Practice I (carpentry, fitting)",
      "Sem 2 — Engineering Mechanics, Workshop Practice II (welding, foundry, sheet metal)",
      "Sem 3 — Strength of Materials, Theory of Machines, Manufacturing Processes I (turning, milling)",
      "Sem 4 — Thermal Engineering, Fluid Mechanics, Manufacturing Processes II (CNC, grinding)",
      "Sem 5 — Industrial Engineering, Quality Control, CAD/CAM, Mini Project",
      "Sem 6 — Tool & Die Design, Production Planning & Control, Industrial Training, Final Project",
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
    ],
  },
};
