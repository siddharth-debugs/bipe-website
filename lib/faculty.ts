/**
 * BIPE faculty + staff roster.
 *
 * Source: Staff Detail.xlsx (institutional staff sheet).
 * Photos live at /public/faculty/<photo>; if a photo isn't present yet,
 * the Avatar component renders a brand-tinted initials chip instead.
 */

export type Department =
  | "Leadership"
  | "Electrical"
  | "Civil"
  | "Mechanical"
  | "Computer Science"
  | "Dairy"
  | "Office";

export interface Faculty {
  /** stable slug for keys / hash links */
  id: string;
  name: string;
  designation: string;
  department: Department;
  /** ordered, highest credential first; M.Tech / B.Tech / Diploma etc. */
  qualifications: string[];
  /** "13 Years Teaching", "5 Years Industry, 2 Years Teaching", etc. */
  experience: string;
  /** filename under /public/faculty/ — empty string if not yet uploaded */
  photo: string;
  /** brief one-line achievement / certification highlight (optional) */
  highlight?: string;
  /** number of journal/conference papers (when known, drives the chip) */
  publications?: number;
  /** notable certifications / training */
  certifications?: string[];
  isLeadership?: boolean;
  isHOD?: boolean;
}

export const FACULTY: Faculty[] = [
  // ─────── Leadership ───────
  {
    id: "rahul-srivastava",
    name: "Rahul Srivastava",
    designation: "Principal",
    department: "Leadership",
    qualifications: [
      "M.Tech (Nano Science & Technology), Jadavpur University, Kolkata",
      "B.Tech (Electrical & Electronics Engineering), United College of Engineering & Research, Prayagraj",
    ],
    experience: "13 Years Teaching",
    photo: "/faculty/rahul-srivastava.png",
    highlight: "Qualified GATE 6 times · MHRD Scholarship 2012-14",
    publications: 4,
    certifications: [
      "Coursera: Wind Energy (2020), Solar Energy Basics (2020)",
      "NPTEL-AICTE FDP: Introduction to Smart Grid (2018)",
    ],
    isLeadership: true,
  },
  {
    id: "amit-kumar",
    name: "Amit Kumar",
    designation: "Administrative & Training & Placement Officer",
    department: "Leadership",
    qualifications: ["B.Tech (Mechanical Engineering), SMS IT Lucknow (AKTU UP)"],
    experience: "10+ Years Teaching",
    photo: "/faculty/amit-kumar.png",
    isLeadership: true,
  },
  {
    id: "dilshad-shah",
    name: "Dilshad Shah",
    designation: "Student Welfare Officer",
    department: "Leadership",
    qualifications: [
      "M.Tech (Power System), Veer Bahadur Singh Purvanchal University, Jaunpur — pursuing",
      "B.Tech (Electrical Engineering), J.S. University Shikohabad",
    ],
    experience: "15 Years Teaching",
    photo: "/faculty/dilshad-shah.png",
    highlight: "Advanced Power Technology certification, MNNIT Prayagraj 2025",
    publications: 3,
    isLeadership: true,
  },

  // ─────── HODs ───────
  {
    id: "ved-prakash",
    name: "Ved Prakash",
    designation: "HOD, Electrical Engineering",
    department: "Electrical",
    qualifications: [
      "M.Tech (Power System), Veer Bahadur Singh Purvanchal University, Jaunpur — pursuing",
      "B.Tech (Electrical & Electronics Engineering), Integral University, Lucknow, 2013",
    ],
    experience: "12 Years Teaching",
    photo: "/faculty/ved-prakash.png",
    highlight: "Qualified GATE 2013 · Advanced Power Technology cert (MNNIT, IEEE)",
    publications: 4,
    isHOD: true,
  },
  {
    id: "vibhuti-narayan-visen",
    name: "Vibhuti Narayan Visen",
    designation: "HOD, Mechanical Engineering",
    department: "Mechanical",
    qualifications: [
      "M.Tech (Mechanical Engineering)",
      "B.Tech (Mechanical Engineering)",
    ],
    experience: "9 Years Teaching · 1 Year Industry",
    photo: "/faculty/vibhuti-narayan-visen.png",
    highlight: "Published GMAW process-parameter optimization (Taguchi, IJARIIE 2017)",
    publications: 1,
    certifications: ["AutoCAD 2D / 3D"],
    isHOD: true,
  },
  {
    id: "ashwani-yadav",
    name: "Ashwani Yadav",
    designation: "HOD, Civil Engineering",
    department: "Civil",
    qualifications: ["B.E. (Civil Engineering), Vaishnavi Institute of Technology and Science, Bhopal"],
    experience: "5 Years Teaching · 2 Years Industry",
    photo: "/faculty/ashwani-yadav.png",
    isHOD: true,
  },
  {
    id: "shubham-gond",
    name: "Shubham Gond",
    designation: "HOD, Computer Science & Engineering",
    department: "Computer Science",
    qualifications: [],
    experience: "—",
    photo: "/faculty/shubham-gond.png",
    highlight: "NIIT National Aptitude Test (top 20%) · National Science Olympiad (Level 2)",
    isHOD: true,
  },

  // ─────── Electrical Department ───────
  {
    id: "vimlesh-kumar",
    name: "Vimlesh Kumar",
    designation: "Lecturer, Electrical Department",
    department: "Electrical",
    qualifications: ["B.Tech (Electrical Engineering), Kalinga Institute of Industrial Technology"],
    experience: "7 Years Teaching",
    photo: "",
    highlight: "2nd rank, University final-year project expo",
  },
  {
    id: "alok-kumar-gautam",
    name: "Alok Kumar Gautam",
    designation: "Lab Instructor, Electrical Department",
    department: "Electrical",
    qualifications: [
      "Diploma (Electrical Engineering), Devomahesh College of Engineering and Technology, Sonbhadra",
      "B.Sc (Mathematics), Obera Degree College, Sonbhadra",
    ],
    experience: "1 Year",
    photo: "/faculty/alok-kumar-gautam.png",
  },

  // ─────── Civil Department ───────
  {
    id: "vijay-kumar-yadav",
    name: "Vijay Kumar Yadav",
    designation: "Lecturer, Civil Department",
    department: "Civil",
    qualifications: ["B.Tech (Civil Engineering), H.M.F.A. Memorial Institute of Engineering, Prayagraj"],
    experience: "4 Years Teaching",
    photo: "/faculty/vijay-kumar-yadav.png",
  },
  {
    id: "vandana-yadav",
    name: "Vandana Yadav",
    designation: "Lab Instructor, Civil Department",
    department: "Civil",
    qualifications: ["Diploma (Civil Engineering), Government Polytechnic Faizabad (Ayodhya)"],
    experience: "1 Year",
    photo: "",
  },

  // ─────── Mechanical Department ───────
  {
    id: "anand-kumar-tyagi",
    name: "Anand Kumar Tyagi",
    designation: "Lecturer, Mechanical Department",
    department: "Mechanical",
    qualifications: ["B.Tech (Mechanical Engineering), IIIT Jabalpur"],
    experience: "4 Years Teaching",
    photo: "/faculty/anand-kumar-tyagi.png",
    highlight: "Inspire Award (Ministry of Science and Technology, 2014)",
  },
  {
    id: "jaideep-chitransh",
    name: "Jaideep Chitransh",
    designation: "Lecturer, Mechanical Department",
    department: "Mechanical",
    qualifications: [
      "M.Tech (Mechanical Engineering — CAD), United College of Engineering and Research, Prayagraj",
      "B.Tech (Mechanical Engineering), Accurate Institute of Management and Technology, Greater Noida",
    ],
    experience: "9 Years Teaching",
    photo: "/faculty/jaideep-chitransh.png",
    publications: 4,
    certifications: [
      "Diploma in Product Design and Analysis, CADD CENTRE Prayagraj",
      "ANSYS 11.0 Workbench (CADD CENTRE)",
      "AutoCAD 2013 (Autodesk)",
    ],
  },
  {
    id: "amrit-shankar",
    name: "Amrit Shankar",
    designation: "Lecturer, Mechanical Department",
    department: "Mechanical",
    qualifications: ["B.Tech (Mechanical Engineering)"],
    experience: "5 Years Industry (Automobile · Manufacturing) · 2 Years Teaching",
    photo: "/faculty/amrit-shankar.png",
    publications: 2,
  },
  {
    id: "mukesh-kumar",
    name: "Mukesh Kumar",
    designation: "Lab Instructor, Mechanical Department",
    department: "Mechanical",
    qualifications: [
      "CITS, National Skill Training Institute, Chennai",
      "ITI, J.S. ITI Pvt.",
    ],
    experience: "1 Year",
    photo: "",
  },

  // ─────── Computer Science & Engineering ───────
  {
    id: "saurabh-gupta",
    name: "Saurabh Gupta",
    designation: "Lecturer, Computer Science & Engineering",
    department: "Computer Science",
    qualifications: ["B.Tech (Computer Science & Engineering), Babu Banarasi Das University"],
    experience: "1 Year",
    photo: "",
  },

  // ─────── Dairy Engineering ───────
  {
    id: "rashi-vishwakarma",
    name: "Rashi Vishwakarma",
    designation: "Lecturer, Dairy Engineering",
    department: "Dairy",
    qualifications: [
      "M.Sc (Physics), Veer Bahadur Singh Purvanchal University, Jaunpur",
      "B.Sc (Mathematics), Mahatma Gandhi Kashi Vidyapith University",
    ],
    experience: "2 Years Teaching",
    photo: "/faculty/rashi-vishwakarma.png",
  },
];

export const OFFICE_STAFF: Faculty[] = [
  {
    id: "ajay-kumar-maurya",
    name: "Ajay Kumar Maurya",
    designation: "Office Superintendent",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "/faculty/ajay-kumar-maurya.png",
  },
  {
    id: "vinod-kumar-accountant",
    name: "Vinod Kumar",
    designation: "Accountant",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "saurabh",
    name: "Saurabh",
    designation: "Office Assistant",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "suresh",
    name: "Suresh",
    designation: "Office Assistant",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "vinod-kumar-librarian",
    name: "Vinod Kumar",
    designation: "Librarian",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
];

export const DEPT_LABELS: Record<Department, string> = {
  Leadership: "Leadership",
  Electrical: "Electrical Engineering",
  Civil: "Civil Engineering",
  Mechanical: "Mechanical Engineering",
  "Computer Science": "Computer Science & Engineering",
  Dairy: "Dairy Engineering",
  Office: "Office Staff",
};

export const FACULTY_BY_DEPT = (FACULTY).reduce<Record<Department, Faculty[]>>(
  (acc, f) => {
    (acc[f.department] ??= []).push(f);
    return acc;
  },
  {
    Leadership: [],
    Electrical: [],
    Civil: [],
    Mechanical: [],
    "Computer Science": [],
    Dairy: [],
    Office: [],
  },
);

export const FACULTY_TOTAL = FACULTY.length + OFFICE_STAFF.length;
