/**
 * Long-form blog post content.
 *
 * Each post is grounded in either:
 *   (a) public-domain knowledge about Indian technical education
 *       (BTEUP/AICTE/JEECUP/SSC/RRB process), or
 *   (b) BIPE facts already verified on /placements, /alumni, /courses,
 *       /jeecup, /scholarships.
 *
 * Don't add new factual claims here without a verifiable source on the
 * site or the relevant government portal — the audit's E-E-A-T section
 * is unforgiving about contradictions between pages.
 */

export type BlogSection =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; html: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "callout"; title?: string; html: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string };

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;            // human-readable for the card
  publishedISO: string;    // for JSON-LD datePublished
  readTime: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  sections: BlogSection[];
};

export const BLOG_POSTS: BlogPost[] = [
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "diploma-vs-iti-vs-btech-after-class-10",
    title: "Diploma vs ITI vs B.Tech after Class 10 — which to pick",
    category: "Admission · Pathways",
    date: "19 May 2026",
    publishedISO: "2026-05-19",
    readTime: "7 min read",
    excerpt:
      "The three technical-education paths open to a Class 10 student in India — a polytechnic diploma, an ITI trade certificate, or a B.Tech after Class 12. Duration, eligibility, careers, and which student each route suits.",
    metaTitle:
      "Diploma vs ITI vs B.Tech after Class 10 — pathway guide for Eastern UP | BIPE",
    metaDescription:
      "Polytechnic diploma vs ITI trade certificate vs B.Tech degree — duration, eligibility, careers, government job eligibility and lateral-entry options for students after Class 10.",
    sections: [
      {
        type: "p",
        html: "A Class 10 student in India has three serious technical-education paths in front of them: a <strong>polytechnic diploma</strong> (3 years, after Class 10), an <strong>ITI trade certificate</strong> (1–2 years, after Class 10 or Class 8 for some trades), or a <strong>B.Tech engineering degree</strong> (4 years, but only after first finishing Class 12 with Maths and Science). Each opens different doors — and forecloses others. This guide walks through what each path actually is, what it costs in time and money, what careers it leads to, and which path makes sense for which kind of student.",
      },
      {
        type: "callout",
        title: "TL;DR",
        html: "Want an engineering career as fast as possible without Class 12? Take a polytechnic <strong>diploma</strong>. Want to learn one specific trade (electrician, welder, fitter) and start working within a year? Take an <strong>ITI</strong>. Want the full engineering degree and the option of corporate engineer roles? Class 12 (PCM) then <strong>B.Tech</strong>. The diploma is the only path that opens engineering careers <em>and</em> keeps the option of lateral entry to a B.Tech later.",
      },
      { type: "h2", text: "The three paths, side by side" },
      {
        type: "table",
        headers: ["", "ITI", "Polytechnic diploma", "B.Tech"],
        rows: [
          ["Entry after", "Class 10 (Class 8 for some trades)", "Class 10 with Maths & Science", "Class 12 with PCM"],
          ["Duration", "1 or 2 years", "3 years · 6 semesters", "4 years after Class 12"],
          ["Awarded by", "NCVT / SCVT certificate", "State board (BTEUP in UP) · AICTE-approved", "University degree · AICTE/UGC"],
          ["Typical first roles", "Trade technician (electrician, welder, fitter)", "Junior engineer, supervisor, shop-floor", "Engineer, software developer, R&D"],
          ["Government job pathway", "Trade-specific (Railways, defence)", "SSC JE, RRB JE, UPPCL, state PWD", "UPSC ESE, PSU engineer cadres"],
          ["Lateral entry to next level", "Limited", "B.Tech 2nd year via state JEE Lateral", "M.Tech, MBA, R&D"],
          ["Typical total cost (govt/private)", "Low", "Low–Moderate", "Moderate–High"],
        ],
      },
      { type: "h2", text: "ITI — focused, fast, trade-specific" },
      {
        type: "p",
        html: "An <strong>ITI (Industrial Training Institute)</strong> certificate is a 1- or 2-year trade-focused programme that produces a skilled technician. It's awarded under the National Council for Vocational Training (NCVT) or its state equivalent (SCVT). ITI trades include Electrician, Fitter, Welder, Turner, Machinist, Mechanic Motor Vehicle, Plumber, COPA (Computer Operator and Programming Assistant), and several dozen others.",
      },
      {
        type: "p",
        html: "ITI suits a student who wants to start earning within a year, prefers hands-on work over classroom theory, and is clear about the trade they want to learn. It's a strong route into Indian Railways trade apprenticeships, defence service trades, and small-business self-employment (independent electricians, motor mechanics, welders). The ceiling, though, is real: ITI graduates start as technicians, and moving into engineering roles typically requires going back and taking a diploma later.",
      },
      { type: "h2", text: "Polytechnic diploma — the engineering on-ramp after Class 10" },
      {
        type: "p",
        html: "A <strong>polytechnic diploma in engineering</strong> is a 3-year, 6-semester programme that takes a Class 10 student to the floor of an engineering career. In Uttar Pradesh it's awarded by the Board of Technical Education UP (BTEUP) and admission is through the Joint Entrance Examination Council UP (<a href=\"/jeecup\">JEECUP</a>). BIPE, for example, runs under JEECUP institute code <strong>4455</strong> and offers five BTEUP-affiliated branches: Computer Science &amp; Engineering (355), Civil (322), Electrical (328), Mechanical Engineering Production (343), and the rare Dairy Engineering (327).",
      },
      {
        type: "p",
        html: "The diploma's strongest argument is its breadth. A 3-year BTEUP diploma is the eligibility floor for Junior Engineer cadres at SSC, RRB, UPPCL, UP PWD, NDDB and several state utilities. It also makes you eligible for <a href=\"/courses/computer-science-engineering\">lateral entry into the 2nd year of B.Tech</a> at AKTU and state universities — meaning a diploma graduate can still earn a B.Tech in two additional years if they want it. And on the corporate side, manufacturers like Mahindra, Tata Motors, BHEL, JBM Group and Motherson Sumi run apprentice-and-place pipelines hiring diploma graduates directly. <a href=\"/placements\">BIPE's recruiter list</a> covers most of them.",
      },
      { type: "h2", text: "B.Tech — the full engineering degree, with the longest runway" },
      {
        type: "p",
        html: "A <strong>Bachelor of Technology</strong> is a 4-year university degree after Class 12 (PCM). Admission is typically through state engineering entrance exams (UP-CET, JEE Main for IITs/NITs, etc.). It's the broadest engineering credential — engineer cadres at PSUs, R&D roles, software engineering, MBA-track careers, postgraduate study — all sit downstream of B.Tech.",
      },
      {
        type: "p",
        html: "The cost is time: you spend 2 years in Class 11–12 and 4 more in B.Tech, so 6 years between Class 10 and the first job. Compare that with a diploma graduate, who's typically into a job at 19 and can still earn a B.Tech via lateral entry by 22–23. For families weighing the trade-off between cash flow and credential level, the diploma is often the more pragmatic call.",
      },
      { type: "h2", text: "When each path is the right one" },
      {
        type: "ul",
        items: [
          "<strong>Take an ITI</strong> if you're clear on a specific trade, want to start earning fast, and don't see yourself in engineering-supervisor roles long-term.",
          "<strong>Take a polytechnic diploma</strong> if you want an engineering career and you don't want to spend two years in Class 11–12 first — the diploma is engineering-from-day-one, with strong government and private pathways, and lateral entry to B.Tech is still available if you change your mind.",
          "<strong>Take Class 12 then B.Tech</strong> if you specifically want IIT/NIT / engineer cadres at PSUs, or if you're considering postgraduate study, R&amp;D, or a software career path where B.Tech is the standard credential.",
        ],
      },
      { type: "h2", text: "How BIPE fits the diploma path" },
      {
        type: "p",
        html: "BIPE has run the BTEUP diploma in Eastern UP since 2010 — AICTE-approved (Permanent ID 1-488233171), JEECUP institute code 4455, AFRC-set tuition of ₹30,150/year across all five branches. The placement record on file: <a href=\"/placements\">993+ joining-letter-verified placements through 2024</a> across 44 recruiters, alumni at Mahindra, Tata Steel, BEL, Indian Railways, Mumbai Metro, UPPCL, Amul, Mother Dairy and beyond. UP Government post-matric <a href=\"/scholarships\">scholarships</a> cover full or partial tuition for SC, ST, OBC, EWS and Minority students.",
      },
      {
        type: "p",
        html: "If a diploma is the path you're weighing, the BIPE <a href=\"/admission\">admission</a> team takes EN / हिंदी questions on WhatsApp every day. Or book a free shuttle visit from Varanasi Cantt — walk the labs, eat at the mess, talk to current students. That visit usually settles the question one way or the other.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "junior-engineer-eligibility-after-diploma",
    title: "Junior Engineer eligibility — SSC JE, RRB JE, UPPCL after a diploma",
    category: "Career · Government Jobs",
    date: "18 May 2026",
    publishedISO: "2026-05-18",
    readTime: "8 min read",
    excerpt:
      "A 3-year BTEUP diploma is the eligibility floor for Junior Engineer cadres at SSC, RRB, UPPCL, UP PWD and several state utilities. Here's the verified list of exams, branches, age limits, exam patterns and where BIPE alumni have landed.",
    metaTitle:
      "Junior Engineer eligibility after a diploma — SSC JE, RRB JE, UPPCL guide | BIPE",
    metaDescription:
      "Polytechnic diploma holders are eligible for SSC JE, RRB JE, UPPCL and state PWD Junior Engineer exams. Branches, age limits, exam patterns and verified BIPE alumni placements in these cadres.",
    sections: [
      {
        type: "p",
        html: "If you're a polytechnic diploma student or graduate in India, the Junior Engineer (JE) cadres at the central and state governments are some of the most direct, well-paid career pathways open to you. A 3-year BTEUP (or equivalent state-board) diploma is the eligibility floor for SSC JE, RRB JE, UPPCL JE, UP PWD JE, BHEL trainee schemes and several state-discom JE recruitments. This guide walks through the major exams, their eligibility, exam patterns, and where <a href=\"/placements\">BIPE alumni</a> have actually landed.",
      },
      {
        type: "callout",
        title: "Quick map",
        html: "<strong>SSC JE</strong> = central government, multiple departments (CPWD, MES, BRO, Posts). <strong>RRB JE</strong> = Indian Railways. <strong>UPPCL JE</strong> = UP Power Corporation, electrical-heavy. <strong>UP PWD JE</strong> = UP state Public Works Department, civil-heavy. All four accept a 3-year engineering diploma as the minimum qualification.",
      },
      { type: "h2", text: "SSC JE — Junior Engineer, central government" },
      {
        type: "p",
        html: "The <strong>SSC Junior Engineer examination</strong>, conducted by the Staff Selection Commission, recruits Junior Engineers to several central-government departments. Posts are typically in <strong>Civil, Mechanical, Electrical, and Quantity Surveying &amp; Contracts</strong>.",
      },
      {
        type: "ul",
        items: [
          "<strong>Eligibility</strong>: 3-year engineering diploma in the relevant branch, recognised by the central or a state government. A BTEUP diploma satisfies this.",
          "<strong>Departments recruiting through SSC JE</strong>: CPWD (Central Public Works Department), MES (Military Engineer Services), BRO (Border Roads Organisation), Department of Posts, Central Water Commission, Farakka Barrage Project, Department of Lighthouses and Lightships, AFHQ (Armed Forces HQ).",
          "<strong>Age limit</strong>: 18–32 years (varies by post; SC/ST/OBC relaxations apply).",
          "<strong>Exam pattern</strong>: Paper 1 (CBT) covers General Intelligence &amp; Reasoning, General Awareness, and General Engineering (branch-specific). Paper 2 (CBT) is fully technical in the chosen branch.",
          "<strong>Posting</strong>: All-India transferable, with pay grade aligned to central government Pay Matrix Level 6.",
        ],
      },
      { type: "h2", text: "RRB JE — Indian Railways" },
      {
        type: "p",
        html: "The <strong>Railway Recruitment Boards' Junior Engineer examination</strong> is the route into Junior Engineer roles across Indian Railways — zonal railways, production units, and the engineering services that keep the network running. RRB JE is one of the largest recruitment cycles in India, with thousands of vacancies most years.",
      },
      {
        type: "ul",
        items: [
          "<strong>Eligibility</strong>: 3-year engineering diploma in the relevant branch.",
          "<strong>Branches</strong>: Civil Engineering, Mechanical, Electrical, Electronics, Signal &amp; Telecommunications (S&amp;T), Permanent Way (P-Way), Workshop, IT, Chemical &amp; Metallurgical Assistant.",
          "<strong>Age limit</strong>: 18–33 years (relaxations apply).",
          "<strong>Exam pattern</strong>: CBT 1 (general aptitude + reasoning + general science) → CBT 2 (technical, branch-specific) → Document Verification → Medical Examination.",
          "<strong>Recent BIPE alumni in this pipeline</strong>: <a href=\"/alumni\">Hariom Rai</a> (Senior Engineer, Mumbai Metro Project) and Pramod Kumar Patel (Assistant Loco Pilot, Indian Railways) are two of several BIPE graduates working in railway and metro engineering today.",
        ],
      },
      { type: "h2", text: "UPPCL JE — UP Power Corporation" },
      {
        type: "p",
        html: "The <strong>UPPCL Junior Engineer recruitment</strong> hires JEs into Uttar Pradesh Power Corporation Limited and its associated discoms (PVVNL, MVVNL, KESCO, DVVNL, PuVVNL). UPPCL is one of India's largest state utilities, and JE roles cover substation operation, distribution, transmission, and maintenance.",
      },
      {
        type: "ul",
        items: [
          "<strong>Eligibility</strong>: Diploma in Electrical or Electrical &amp; Electronics Engineering (for most posts); some posts require Civil or Computer Science diplomas.",
          "<strong>Age limit</strong>: 21–40 years.",
          "<strong>Exam pattern</strong>: Online CBT covering technical subjects, general Hindi, general English, reasoning, and general awareness with emphasis on UP-specific knowledge.",
          "<strong>Why it matters for Electrical diploma students</strong>: UPPCL is a <a href=\"/placements\">named BIPE recruiter</a> — multiple Electrical Engineering alumni have moved into UPPCL JE roles after their diploma.",
        ],
      },
      { type: "h2", text: "Other Junior Engineer pathways open to diploma holders" },
      {
        type: "ul",
        items: [
          "<strong>UP PWD JE</strong> — state Public Works Department, civil-heavy, conducted through UPSSSC.",
          "<strong>DMRC JE</strong> — Delhi Metro Rail Corporation. Recruits civil, electrical, mechanical, S&amp;T and station-controller JEs.",
          "<strong>BHEL Trainee Engineer / Artisan</strong> — Bharat Heavy Electricals runs separate recruitment cycles for diploma holders in mechanical and electrical engineering.",
          "<strong>State Discom JEs</strong> — neighbouring states (Bihar, Madhya Pradesh, Rajasthan) run their own SBPDCL/MPMKVVCL/RVUNL JE exams open to diploma holders.",
          "<strong>NDDB and State Dairy Federations</strong> — for <a href=\"/courses/dairy-engineering\">Dairy Engineering diploma</a> graduates, Junior Engineer roles at the National Dairy Development Board and state dairy boards are direct pathways.",
          "<strong>Indian Army Technical Entry</strong> — JCO / Technical Trades for diploma holders via Army recruitment rallies.",
        ],
      },
      { type: "h2", text: "How to think about preparation" },
      {
        type: "p",
        html: "Most JE exams have the same shape: a general aptitude paper (reasoning, GK, basic maths, current affairs) plus a technical paper specific to your diploma branch. The technical paper draws directly from the BTEUP syllabus you covered in semesters 1–6. The general paper is the one most students leave too late.",
      },
      {
        type: "p",
        html: "Practical guidance from <a href=\"/placements\">BIPE's placement cell</a>: start the general-aptitude prep <em>during</em> the diploma, not after. Quarterly mock interviews, AMCAT scoring, and the placement-cell's resume drafting workshop all run before final-year placement season — they make a measurable difference in how diploma students approach JE exams in the year after graduation.",
      },
      { type: "h2", text: "What this looks like in practice" },
      {
        type: "p",
        html: "BIPE's <a href=\"/placements\">993+ verified placement record through 2024</a> includes JE-cadre roles across Indian Railways, UPPCL, Mumbai Metro, Tata Steel and several state discoms. The diploma + JE-exam route is one of the highest-leverage paths through Indian technical education — it converts three years of post-Class-10 study into a permanent government engineering job, with a transferable pay scale and a defined career ladder.",
      },
      {
        type: "p",
        html: "If you're a current diploma student or a Class 10 family weighing whether to choose this path, the <a href=\"/courses\">five branches at BIPE</a> map directly onto the JE recruitment branches above. Talk to the admissions team on WhatsApp (EN / हिंदी) or <a href=\"/visit\">book a free shuttle visit</a> from Varanasi Cantt to see the campus.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
