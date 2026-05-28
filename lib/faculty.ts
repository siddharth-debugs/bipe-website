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

/**
 * Source of truth: STAFF LIST (1).xlsx (institutional roster, May 2026 cohort).
 * Order in the sheet: 40 academic faculty + 22 non-teaching (latter live
 * in OFFICE_STAFF below). The xlsx columns map to:
 *   xlsx Designation     → designation
 *   xlsx Qualification   → first entry in qualifications[]
 *   xlsx Branch          → Department (Applied + DAIRY → Dairy;
 *                          Applied + C.S.E. → Computer Science;
 *                          DAIRY + MECHANICAL → Mechanical, since
 *                          they're assigned to the Mech department)
 *   xlsx College Name    → appended to the qualification string
 *
 * Where we already had richer detail (publications, certifications,
 * GATE / awards, photos), that data is preserved on top of the xlsx
 * row. New rows ship with just the xlsx-derived fields; admin can
 * fill in highlights, experience, photo paths over time.
 */
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
    id: "dilshad-shah",
    name: "Dilshad Shah",
    designation: "Student Welfare Officer",
    department: "Leadership",
    qualifications: [
      "M.Tech (Power System), Veer Bahadur Singh Purvanchal University, Jaunpur",
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
      "M.Tech (Power System), Veer Bahadur Singh Purvanchal University, Jaunpur",
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
      "M.Tech (Mechanical Engineering), Bhabha Institute of Technology, Kanpur",
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
    qualifications: ["B.Tech (Civil Engineering), Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal"],
    experience: "5 Years Teaching · 2 Years Industry",
    photo: "/faculty/ashwani-yadav.png",
    isHOD: true,
  },
  {
    id: "shubham-gond",
    name: "Shubham Gond",
    designation: "HOD, Computer Science & Engineering",
    department: "Computer Science",
    qualifications: ["B.Tech (Computer Science & Engineering), Bundelkhand University, Jhansi"],
    experience: "—",
    photo: "/faculty/shubham-gond.png",
    highlight: "NIIT National Aptitude Test (top 20%) · National Science Olympiad (Level 2)",
    isHOD: true,
  },

  // ─────── Computer Science & Engineering ───────
  {
    id: "tulika-bhattacharya",
    name: "Tulika Bhattacharya",
    designation: "Lecturer (Applied), Computer Science & Engineering",
    department: "Computer Science",
    qualifications: ["M.A., SSS Visharam Singh Rajkiya Post Graduate College, Chunar, Mirzapur"],
    experience: "",
    photo: "",
  },
  {
    id: "saurav-gupta",
    name: "Saurav Gupta",
    designation: "Lecturer, Computer Science & Engineering",
    department: "Computer Science",
    qualifications: ["B.Tech (Computer Science & Engineering), Babu Banarasi Das University, Lucknow"],
    experience: "1 Year",
    photo: "",
  },
  {
    id: "raj-kamal",
    name: "Raj Kamal",
    designation: "Attached Lecturer, Computer Science & Engineering",
    department: "Computer Science",
    qualifications: ["Diploma (Computer Science), Tathaqat Gautam Buddha Govt. Polytechnic, Shravasti"],
    experience: "",
    photo: "",
  },
  {
    id: "rekha",
    name: "Rekha",
    designation: "Lecturer, Computer Science & Engineering",
    department: "Computer Science",
    qualifications: ["B.Tech (Computer Science & Engineering)"],
    experience: "",
    photo: "",
  },

  // ─────── Civil Engineering ───────
  {
    id: "kamalesh-saini",
    name: "Kamalesh Saini",
    designation: "Lecturer, Civil Engineering",
    department: "Civil",
    qualifications: ["B.Tech (Civil Engineering), Saraswati Higher Education and Technical College, Babatpur, Varanasi"],
    experience: "",
    photo: "",
  },
  {
    id: "vinay-jaiswal",
    name: "Vinay Jaiswal",
    designation: "Lecturer, Civil Engineering",
    department: "Civil",
    qualifications: ["B.Tech (Civil Engineering), Apollo Institute of Technology, Kanpur"],
    experience: "",
    photo: "",
  },
  {
    id: "jitendra-thakur",
    name: "Jitendra Thakur",
    designation: "Lecturer, Civil Engineering",
    department: "Civil",
    qualifications: ["B.Tech (Civil Engineering), Magadh University, Bodhgaya"],
    experience: "",
    photo: "",
  },
  {
    id: "dharmendra-kumar",
    name: "Dharmendra Kumar",
    designation: "Lecturer, Civil Engineering",
    department: "Civil",
    qualifications: ["B.Tech (Civil Engineering), Ashoka Institute of Technology & Management, Varanasi"],
    experience: "",
    photo: "",
  },
  {
    id: "gulshan-singh",
    name: "Gulshan Singh",
    designation: "Lecturer, Civil Engineering",
    department: "Civil",
    qualifications: ["B.Tech (Civil Engineering), Ashoka Institute of Technology & Management, Varanasi"],
    experience: "",
    photo: "",
  },
  {
    id: "santosh-kumar-yadav",
    name: "Santosh Kumar Yadav",
    designation: "Lecturer, Civil Engineering",
    department: "Civil",
    qualifications: ["B.Tech (Civil Engineering), NIMS University, Jaipur, Rajasthan"],
    experience: "",
    photo: "",
  },
  {
    id: "vijay-kumar-yadav",
    name: "Vijay Kumar Yadav",
    designation: "Lecturer, Civil Engineering",
    department: "Civil",
    qualifications: ["B.Tech (Civil Engineering), H.M.F.A. Memorial Institute of Engineering, Prayagraj"],
    experience: "4 Years Teaching",
    photo: "/faculty/vijay-kumar-yadav.png",
  },
  {
    id: "suresh-pandey",
    name: "Suresh Pandey",
    designation: "Lecturer, Civil Engineering",
    department: "Civil",
    qualifications: ["B.Tech (Civil Engineering), Saraswati Higher Education and Technical College, Babatpur, Varanasi"],
    experience: "",
    photo: "",
  },
  {
    id: "vandana-yadav",
    name: "Vandana Yadav",
    designation: "Attached Lecturer (Lab), Civil Engineering",
    department: "Civil",
    qualifications: ["Diploma (Civil Engineering), Government Polytechnic, Faizabad (Ayodhya)"],
    experience: "1 Year",
    photo: "",
  },

  // ─────── Electrical Engineering ───────
  {
    id: "vimlesh-kumar",
    name: "Vimlesh Kumar",
    designation: "Lecturer, Electrical Engineering",
    department: "Electrical",
    qualifications: ["B.Tech (Electrical Engineering), Kalinga Institute of Industrial Technology, Bhubaneswar"],
    experience: "7 Years Teaching",
    photo: "",
    highlight: "2nd rank, University final-year project expo",
  },
  {
    id: "vijay-chand",
    name: "Vijay Chand",
    designation: "Lecturer, Electrical Engineering",
    department: "Electrical",
    qualifications: ["B.Tech (Electrical Engineering), Rajkiya Engineering College, Bijnor"],
    experience: "",
    photo: "",
  },
  {
    id: "rajeev-singh",
    name: "Rajeev Singh",
    designation: "Lecturer, Electrical Engineering",
    department: "Electrical",
    qualifications: ["B.Tech (Electrical Engineering), Saraswati Higher Education and Technical College, Babatpur, Varanasi"],
    experience: "",
    photo: "",
  },
  {
    id: "arpit-kumar-singh",
    name: "Arpit Kumar Singh",
    designation: "Lecturer, Electrical Engineering",
    department: "Electrical",
    qualifications: ["B.Tech (Electrical Engineering), Saraswati Higher Education and Technical College, Babatpur, Varanasi"],
    experience: "",
    photo: "",
  },
  {
    id: "gulchand",
    name: "Gulchand",
    designation: "Lecturer, Electrical Engineering",
    department: "Electrical",
    qualifications: ["B.Tech (Electrical Engineering), Vision Institute of Technology, Kanpur"],
    experience: "",
    photo: "",
  },
  {
    id: "alok-kumar-gautam",
    name: "Alok Kumar Gautam",
    designation: "Attached Lecturer (Lab), Electrical Engineering",
    department: "Electrical",
    qualifications: [
      "Diploma (Electrical Engineering), Devomahesh College of Engineering and Technology, Sonbhadra",
      "B.Sc (Mathematics), Obera Degree College, Sonbhadra",
    ],
    experience: "1 Year",
    photo: "/faculty/alok-kumar-gautam.png",
  },

  // ─────── Mechanical Engineering ───────
  {
    id: "amit-kumar-pal",
    name: "Amit Kumar Pal",
    designation: "Lecturer, Mechanical Engineering",
    department: "Mechanical",
    qualifications: ["B.Tech (Mechanical Engineering), SMS Institute of Technology, Lucknow"],
    experience: "",
    photo: "",
  },
  {
    id: "vinay-kumar-yadav",
    name: "Vinay Kumar Yadav",
    designation: "Lecturer, Mechanical Engineering",
    department: "Mechanical",
    qualifications: ["M.Tech (Mechanical Engineering), National Institute of Technology, Warangal"],
    experience: "",
    photo: "",
  },
  {
    id: "amrit-shankar",
    name: "Amrit Shankar",
    designation: "Lecturer, Mechanical Engineering",
    department: "Mechanical",
    qualifications: ["B.Tech (Dairy Technology), Raja Balwant Singh Engineering Technical College, Agra"],
    experience: "5 Years Industry (Automobile · Manufacturing) · 2 Years Teaching",
    photo: "/faculty/amrit-shankar.png",
    publications: 2,
  },
  {
    id: "jaideep-chitransh",
    name: "Jaideep Chitransh",
    designation: "Lecturer, Mechanical Engineering",
    department: "Mechanical",
    qualifications: [
      "M.Tech (Mechanical Engineering — CAD), United College of Engineering & Research, Allahabad",
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
    id: "ashutosh-kumar",
    name: "Ashutosh Kumar",
    designation: "Lecturer, Mechanical Engineering",
    department: "Mechanical",
    qualifications: ["B.Tech (Mechanical Engineering), Gautam Buddh Technical University, Lucknow"],
    experience: "",
    photo: "",
  },
  {
    id: "arvind-kumar-rai",
    name: "Arvind Kumar Rai",
    designation: "Lecturer, Mechanical Engineering",
    department: "Mechanical",
    qualifications: ["B.Tech (Mechanical Engineering), Birla Institute of Technology"],
    experience: "",
    photo: "",
  },
  {
    id: "vikas-chandra-pandey",
    name: "Vikas Chandra Pandey",
    designation: "Lecturer, Mechanical Engineering",
    department: "Mechanical",
    qualifications: ["B.Tech (Mechanical Engineering), Institute of Engineering & Technology, Faizabad"],
    experience: "",
    photo: "",
  },
  {
    id: "roshan-singh",
    name: "Roshan Singh",
    designation: "Lecturer, Mechanical Engineering",
    department: "Mechanical",
    qualifications: ["B.Tech (Mechanical Engineering), Azad Institute of Engineering & Technology, Lucknow"],
    experience: "",
    photo: "",
  },
  {
    id: "mithilesh-yadav",
    name: "Mithilesh Yadav",
    designation: "Lecturer, Mechanical Engineering",
    department: "Mechanical",
    qualifications: ["B.Tech (Mechanical Engineering), Saroj Institute of Technology and Management, Lucknow"],
    experience: "",
    photo: "",
  },
  {
    id: "amit-kumar",
    name: "Amit Kumar",
    designation: "Lecturer, Mechanical Engineering & TPO",
    department: "Mechanical",
    qualifications: ["B.Tech (Mechanical Engineering), Dr. Ram Manohar Lohia Avadh University"],
    experience: "10+ Years Teaching",
    photo: "/faculty/amit-kumar.png",
    highlight: "Training & Placement Officer",
  },
  {
    id: "brijmohan-singh",
    name: "Brijmohan Singh",
    designation: "Lecturer, Mechanical Engineering",
    department: "Mechanical",
    qualifications: ["B.Tech (Mechanical Engineering), SMS Institute of Technology, Lucknow"],
    experience: "",
    photo: "",
  },
  {
    id: "vikash-pandey",
    name: "Vikash Pandey",
    designation: "Lecturer, Mechanical Engineering",
    department: "Mechanical",
    qualifications: ["B.Tech (Mechanical Engineering), United College of Engineering & Research, Allahabad"],
    experience: "",
    photo: "",
  },
  {
    id: "anand-kumar-tyagi",
    name: "Anand Kumar Tyagi",
    designation: "Lecturer, Mechanical Engineering",
    department: "Mechanical",
    qualifications: ["B.Tech (Dairy Technology), IIIT Jabalpur"],
    experience: "4 Years Teaching",
    photo: "/faculty/anand-kumar-tyagi.png",
    highlight: "Inspire Award (Ministry of Science and Technology, 2014)",
  },
  {
    id: "mukesh-kumar",
    name: "Mukesh Kumar",
    designation: "Attached Lecturer (Lab), Mechanical Engineering",
    department: "Mechanical",
    qualifications: [
      "CITS, National Skill Training Institute, Chennai",
      "ITI, J.S. ITI Pvt.",
    ],
    experience: "1 Year",
    photo: "",
  },

  // ─────── Dairy Engineering ───────
  {
    id: "rashi-vishwakarma",
    name: "Rashi Vishwakarma",
    designation: "Lecturer (Applied), Dairy Engineering",
    department: "Dairy",
    qualifications: [
      "M.Sc (Physics), T.D. College, Jaunpur",
      "B.Sc (Mathematics), Mahatma Gandhi Kashi Vidyapith University",
    ],
    experience: "2 Years Teaching",
    photo: "/faculty/rashi-vishwakarma.png",
  },
];

// Non-teaching staff — full roster from STAFF LIST (1).xlsx (sheet 1
// "NON TEACHING LIST" section). Surfaces on the Faculty page under
// "Office Staff" so the institution can show every person on payroll,
// not just the lecturers.
export const OFFICE_STAFF: Faculty[] = [
  {
    id: "ajay-kumar-maurya",
    name: "Ajay Kumar Maurya",
    designation: "Office Superintendent",
    department: "Office",
    qualifications: ["B.A."],
    experience: "",
    photo: "/faculty/ajay-kumar-maurya.png",
  },
  {
    id: "vinod-kumar-accountant",
    name: "Vinod Kumar",
    designation: "Accountant",
    department: "Office",
    qualifications: ["B.C.A."],
    experience: "",
    photo: "",
  },
  {
    id: "suresh-kumar",
    name: "Suresh Kumar",
    designation: "Office Assistant",
    department: "Office",
    qualifications: ["B.A."],
    experience: "",
    photo: "",
  },
  {
    id: "saurabh-kumar-verma",
    name: "Saurabh Kumar Verma",
    designation: "Office Assistant",
    department: "Office",
    qualifications: ["B.A."],
    experience: "",
    photo: "",
  },
  {
    id: "vinod-kumar-librarian",
    name: "Vinod Kumar",
    designation: "Librarian",
    department: "Office",
    qualifications: ["Diploma in Library Science"],
    experience: "",
    photo: "",
  },
  {
    id: "sanjeev-kumar-varma",
    name: "Sanjeev Kumar Varma",
    designation: "Lab Attendant",
    department: "Office",
    qualifications: ["IT"],
    experience: "",
    photo: "",
  },
  {
    id: "jay-prakash-yadav",
    name: "Jay Prakash Yadav",
    designation: "Welder",
    department: "Office",
    qualifications: ["ITI"],
    experience: "",
    photo: "",
  },
  {
    id: "santosh-kumar-prajapati",
    name: "Santosh Kumar Prajapati",
    designation: "Machinist",
    department: "Office",
    qualifications: ["ITI"],
    experience: "",
    photo: "",
  },
  {
    id: "santosh-vishwakarma",
    name: "Santosh Vishwakarma",
    designation: "Lab Attendant",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "tribhuwan-jaiswar",
    name: "Tribhuwan Jaiswar",
    designation: "Lab Attendant",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "suneeta-devi",
    name: "Suneeta Devi",
    designation: "Housekeeping",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "sheela-devi",
    name: "Sheela Devi",
    designation: "Housekeeping",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "nirmala-devi",
    name: "Nirmala Devi",
    designation: "Housekeeping",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "sitara-devi",
    name: "Sitara Devi",
    designation: "Housekeeping",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "ram-dhani",
    name: "Ram Dhani",
    designation: "Sweeper",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "ramjiyawan-yadav",
    name: "Ramjiyawan Yadav",
    designation: "Peon",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "aslam-khan",
    name: "Aslam Khan",
    designation: "Driver",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "mul-chand",
    name: "Mul Chand",
    designation: "Peon",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "narayan-yadav",
    name: "Narayan Yadav",
    designation: "Driver",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "ramesh-yadav",
    name: "Ramesh Yadav",
    designation: "Gardener",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "shyam-kesh-yadav",
    name: "Shyam Kesh Yadav",
    designation: "Driver",
    department: "Office",
    qualifications: [],
    experience: "",
    photo: "",
  },
  {
    id: "rohit-giri",
    name: "Rohit Giri",
    designation: "Driver",
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
