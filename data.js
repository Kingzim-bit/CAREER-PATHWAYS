const PF = {
  entryPoints: [
    { id: "olevel", label: "O'Level", sub: "BDQF 3", bdqf: 3, desc: "SPM / IGCSE — secondary school certificate" },
    { id: "level2", label: "BTEC Level 2", sub: "BDQF 3", bdqf: 3, desc: "BTEC First / Level 2 diploma (estimated BDQF 3)" },
    { id: "level3", label: "BTEC Level 3", sub: "BDQF 4", bdqf: 4, desc: "BTEC National / Level 3 extended diploma" },
    { id: "alevel", label: "A Level / HNTec", sub: "BDQF 4", bdqf: 4, desc: "A Level or Higher National Technical Certificate" },
    { id: "hnd", label: "HND / Diploma", sub: "BDQF 5", bdqf: 5, desc: "Higher National Diploma / Diploma" }
  ],

  stageMeta: {
    entry: { label: "Entry", accent: "#5B7CFA" },
    mid:   { label: "Mid-career", accent: "#3D5FD6" },
    senior:{ label: "Senior", accent: "#1E2859" },
    top:   { label: "Top", accent: "#FCD00F" }
  },

  tracks: [
    {
      id: "apps-solutions",
      name: "Software & Applications",
      short: "Software",
      blurb: "Build the apps, websites and systems people use every day.",
      roles: [
        {
          id: "junior-programmer",
          title: "Junior Programmer",
          stage: "entry",
          summary: "Writes, tests and maintains code under the guidance of senior developers.",
          routes: [
            { bdqf: 5, years: 0, note: "BDQF 5 + industry certification or a portfolio" },
            { bdqf: 4, years: 2, note: "BDQF 4 + 2 years' experience and a portfolio" }
          ],
          skills: [
            ["Programming Fundamentals", 3],
            ["Software Testing", 3],
            ["Version Control (Git)", 3],
            ["Web Development", 3],
            ["Databases", 2]
          ],
          certs: ["Oracle Java Foundations", "Python PCEP", "AWS Cloud Practitioner"]
        },
        {
          id: "applications-developer",
          title: "Applications Developer",
          stage: "mid",
          summary: "Designs and builds complete application features end to end.",
          routes: [
            { bdqf: 5, years: 2, note: "BDQF 5 + industry experience, or a relevant portfolio" },
            { bdqf: 4, years: 5, note: "BDQF 4 + 5 years' experience" }
          ],
          skills: [
            ["Software Design", 4],
            ["API Development", 4],
            ["Databases", 4],
            ["Testing & Quality Assurance", 4],
            ["DevOps Basics", 3]
          ],
          certs: ["Oracle Certified Associate", "AWS Certified Developer", "Professional Scrum Developer"]
        },
        {
          id: "solutions-architect",
          title: "Solutions Architect",
          stage: "senior",
          summary: "Designs the overall technical solution that meets business needs.",
          routes: [
            { bdqf: 6, years: 3, note: "BDQF 6 + 3 years' relevant experience" },
            { bdqf: 5, years: 6, note: "BDQF 5 + 6 years' relevant experience" }
          ],
          skills: [
            ["Solution Architecture", 5],
            ["Cloud Architecture", 4],
            ["Systems Integration", 4],
            ["Security Architecture", 4],
            ["IT Governance", 4]
          ],
          certs: ["TOGAF", "AWS Solutions Architect", "Azure Solutions Architect"]
        },
        {
          id: "software-development-manager",
          title: "Software Development Manager",
          stage: "senior",
          summary: "Leads development teams and owns delivery of the software roadmap.",
          routes: [
            { bdqf: 6, years: 5, note: "BDQF 6 + 5 years as a developer or architect" },
            { bdqf: 5, years: 8, note: "BDQF 5 + certification or portfolio" }
          ],
          skills: [
            ["Team Leadership", 4],
            ["Delivery Management", 4],
            ["Software Architecture", 4],
            ["Mentoring & Coaching", 4],
            ["Budgeting", 3]
          ],
          certs: ["PMP", "Professional Scrum Master", "ITIL 4 Foundation"]
        },
        {
          id: "cto-apps",
          title: "Chief Technology Officer",
          stage: "top",
          summary: "Sets the whole organisation's technology and digital strategy.",
          routes: [
            { bdqf: 6, years: 10, note: "BDQF 6 + certification, 10 years at senior level" },
            { bdqf: 5, years: 12, note: "BDQF 5 + certification, 12 years at senior level" }
          ],
          skills: [
            ["Technology Strategy", 5],
            ["Digital Transformation", 5],
            ["IT Governance", 5],
            ["Innovation Management", 5],
            ["Vendor Management", 4]
          ],
          certs: ["MIT Sloan CTO Programme", "ISACA CGEIT"]
        }
      ]
    },
    {
      id: "ict-security",
      name: "Cyber Security",
      short: "Cyber Security",
      blurb: "Protect organisations from cyber threats, risk and attacks.",
      roles: [
        {
          id: "associate-security-analyst",
          title: "Associate Security Analyst",
          stage: "entry",
          summary: "Monitors security systems, responds to alerts and educates users.",
          routes: [
            { bdqf: 5, years: 0, note: "BDQF 5 in IS or Computer Science" },
            { bdqf: 4, years: 5, note: "BDQF 4 + 5 years' experience, or a relevant portfolio" }
          ],
          skills: [
            ["Cyber Risk Management", 3],
            ["Incident Management", 3],
            ["Network Security Management", 3],
            ["Security Administration", 3],
            ["Security Governance", 3]
          ],
          certs: ["CompTIA Security+", "Certified Ethical Hacker (CEH)", "GIAC GSEC", "OSCP"]
        },
        {
          id: "cyber-risk-analyst",
          title: "Cyber Risk Analyst",
          stage: "mid",
          summary: "Assesses cyber risks and recommends controls to reduce them.",
          routes: [
            { bdqf: 6, years: 0, note: "BDQF 6 in IS or Computer Science" },
            { bdqf: 5, years: 4, note: "BDQF 5 + 4 years in relevant roles" }
          ],
          skills: [
            ["Cyber Risk Management", 4],
            ["Security Architecture", 4],
            ["Security Governance", 4],
            ["Security Implementation", 4],
            ["Security Planning", 4]
          ],
          certs: ["CompTIA CySA+", "CompTIA CASP+", "CISSP", "ISO 27001"]
        },
        {
          id: "security-engineer",
          title: "Security Engineer",
          stage: "senior",
          summary: "Designs and implements secure system architectures.",
          routes: [
            { bdqf: 6, years: 0, note: "BDQF 6 in Cyber Security, IT Security or CS" },
            { bdqf: 5, years: 4, note: "BDQF 5 + 4–6 years' experience" },
            { bdqf: 4, years: 6, note: "BDQF 4 + 6–8 years as a security analyst or similar" }
          ],
          skills: [
            ["Security Architecture", 5],
            ["Network Security Management", 5],
            ["Infrastructure Design", 5],
            ["Cyber Risk Management", 4],
            ["Security Programme Management", 4]
          ],
          certs: ["CISSP", "CEH", "Cisco CCNP Security", "OSCP", "Cisco CyberOps"]
        },
        {
          id: "cyber-risk-manager",
          title: "Cyber Risk Manager",
          stage: "senior",
          summary: "Owns security policy, governance, compliance and awareness programmes.",
          routes: [
            { bdqf: 6, years: 5, note: "BDQF 6 in Cyber Security or CS + certification" },
            { bdqf: 5, years: 8, note: "BDQF 5 + certification or portfolio" }
          ],
          skills: [
            ["Audit and Compliance", 4],
            ["Cyber Forensics", 4],
            ["IT Governance", 4],
            ["Security Awareness", 4],
            ["Security Programme Management", 4]
          ],
          certs: ["CRISC", "CISA", "ISO 27005 Risk Manager", "CGEIT"]
        },
        {
          id: "ciso",
          title: "Chief Information Security Officer",
          stage: "top",
          summary: "Leads the organisation's whole information security strategy.",
          routes: [
            { bdqf: 6, years: 10, note: "BDQF 6 + certification, 10 years at senior level" },
            { bdqf: 5, years: 12, note: "BDQF 5 + certification, 12 years at senior level" }
          ],
          skills: [
            ["Security Strategy", 5],
            ["Threat Analysis & Defence", 5],
            ["Threat Intelligence & Detection", 5],
            ["Cyber Forensics", 5],
            ["Business Continuity", 5]
          ],
          certs: ["CCISO", "CISSP", "CISM", "CRISC", "GIAC GSTRT"]
        }
      ]
    },
    {
      id: "telecom-network",
      name: "Network & Infrastructure",
      short: "Network",
      blurb: "Keep the networks, servers and cloud running and secure.",
      roles: [
        {
          id: "network-technician",
          title: "Network Technician",
          stage: "entry",
          summary: "Installs, maintains and troubleshoots network equipment and cabling.",
          routes: [
            { bdqf: 4, years: 0, note: "BDQF 4 in IT or Telecommunications" },
            { bdqf: 3, years: 2, note: "BDQF 3 + 2 years' experience and a portfolio" }
          ],
          skills: [
            ["Network Fundamentals", 3],
            ["Routing & Switching", 3],
            ["Hardware Support", 3],
            ["Network Security", 2],
            ["Documentation", 2]
          ],
          certs: ["CompTIA Network+", "Cisco CCNA"]
        },
        {
          id: "network-engineer",
          title: "Network Engineer",
          stage: "mid",
          summary: "Designs, configures and secures complex enterprise networks.",
          routes: [
            { bdqf: 5, years: 0, note: "Specialist — BDQF 5 in IT or Telecommunications" },
            { bdqf: 4, years: 3, note: "BDQF 4 + 3 years' relevant experience" }
          ],
          skills: [
            ["Routing & Switching", 4],
            ["Network Design", 4],
            ["Network Security", 4],
            ["Troubleshooting", 4],
            ["Network Automation", 3]
          ],
          certs: ["Cisco CCNP", "CompTIA Security+", "Cisco CyberOps"]
        },
        {
          id: "infrastructure-engineer",
          title: "Infrastructure Engineer",
          stage: "senior",
          summary: "Builds and runs servers, cloud platforms, storage and virtualisation.",
          routes: [
            { bdqf: 5, years: 8, note: "BDQF 5 + certification or portfolio" },
            { bdqf: 6, years: 5, note: "BDQF 6 + 5 years' relevant experience" }
          ],
          skills: [
            ["Infrastructure Design", 5],
            ["Cloud Platforms", 4],
            ["Virtualisation", 4],
            ["Storage & Backup", 4],
            ["Monitoring & Reliability", 4]
          ],
          certs: ["AWS SysOps Administrator", "VMware VCP", "Azure Administrator"]
        },
        {
          id: "infrastructure-manager",
          title: "Infrastructure Manager",
          stage: "senior",
          summary: "Leads the infrastructure team and plans capacity and resilience.",
          routes: [
            { bdqf: 5, years: 8, note: "BDQF 5 + certification or portfolio" },
            { bdqf: 6, years: 5, note: "BDQF 6 + 5 years' relevant experience" }
          ],
          skills: [
            ["Team Leadership", 4],
            ["Infrastructure Strategy", 4],
            ["Capacity Planning", 4],
            ["Vendor Management", 4],
            ["ITIL Service Management", 4]
          ],
          certs: ["ITIL 4 Managing Professional", "PMP"]
        },
        {
          id: "cto-telecom",
          title: "Chief Technology Officer (Network)",
          stage: "top",
          summary: "Sets network and infrastructure strategy across the organisation.",
          routes: [
            { bdqf: 6, years: 12, note: "BDQF 6 + certification, 12 years at senior level" },
            { bdqf: 5, years: 12, note: "BDQF 5 + certification, 12 years at senior level" }
          ],
          skills: [
            ["Technology Strategy", 5],
            ["Network Strategy", 5],
            ["IT Governance", 5],
            ["Transformation", 5],
            ["Budgeting", 4]
          ],
          certs: ["ISACA CGEIT"]
        }
      ]
    },
    {
      id: "data-ai",
      name: "Data & Artificial Intelligence",
      short: "Data & AI",
      blurb: "Turn data into insight and build intelligent systems.",
      roles: [
        {
          id: "data-entry",
          title: "Data Entry Officer",
          stage: "entry",
          summary: "Captures, cleans and maintains accurate organisational data.",
          routes: [
            { bdqf: 4, years: 0, note: "BDQF 4 in Data Analytics, IT or IS" },
            { bdqf: 3, years: 1, note: "BDQF 3 + 1 year's experience" }
          ],
          skills: [
            ["Data Entry Accuracy", 3],
            ["Spreadsheets", 3],
            ["Data Quality", 2],
            ["Databases", 2],
            ["Confidentiality", 3]
          ],
          certs: ["Microsoft Excel Associate"]
        },
        {
          id: "data-analyst",
          title: "Data Analyst",
          stage: "mid",
          summary: "Analyses data and builds reports and dashboards for decisions.",
          routes: [
            { bdqf: 5, years: 0, note: "BDQF 5 + industry experience, or a relevant portfolio" },
            { bdqf: 4, years: 3, note: "BDQF 4 + 3 years' relevant experience" }
          ],
          skills: [
            ["Data Analysis", 4],
            ["SQL", 4],
            ["Data Visualisation", 4],
            ["Statistics", 3],
            ["Reporting", 4]
          ],
          certs: ["Google Data Analytics", "Microsoft Power BI", "Tableau Desktop Specialist"]
        },
        {
          id: "data-engineer",
          title: "Data Engineer",
          stage: "senior",
          summary: "Builds the pipelines and platforms that move and store data at scale.",
          routes: [
            { bdqf: 5, years: 5, note: "BDQF 5 + certification" },
            { bdqf: 6, years: 3, note: "BDQF 6 + 3 years' relevant experience" }
          ],
          skills: [
            ["Data Pipelines", 5],
            ["Databases", 5],
            ["Cloud Data Platforms", 4],
            ["Programming", 4],
            ["Data Modelling", 5]
          ],
          certs: ["AWS Data Engineer", "Databricks Certified", "Azure Data Engineer"]
        },
        {
          id: "data-manager",
          title: "Data Manager",
          stage: "senior",
          summary: "Owns data governance, quality and the organisation's data strategy.",
          routes: [
            { bdqf: 5, years: 3, note: "BDQF 5 + experience or portfolio — 3 years as a Data Analyst or similar" },
            { bdqf: 6, years: 3, note: "BDQF 6 + 3 years' relevant experience" }
          ],
          skills: [
            ["Data Governance", 4],
            ["Team Leadership", 4],
            ["Data Strategy", 4],
            ["Master Data Management", 4],
            ["Stakeholder Management", 4]
          ],
          certs: ["CDMP", "PMP"]
        },
        {
          id: "bi-director",
          title: "Director of Business Intelligence",
          stage: "top",
          summary: "Leads analytics and intelligence strategy at the highest level.",
          routes: [
            { bdqf: 6, years: 12, note: "BDQF 6 + certification, 12 years at senior level" },
            { bdqf: 5, years: 12, note: "BDQF 5 + certification, 12 years at senior level" }
          ],
          skills: [
            ["Data Strategy", 5],
            ["BI Strategy", 5],
            ["IT Governance", 5],
            ["Analytics Leadership", 5],
            ["Budgeting", 4]
          ],
          certs: ["CDMP", "ISACA CGEIT"]
        }
      ]
    }
  ]
};

const SKILL_LEVELS = {
  1: "Follow",
  2: "Assist",
  3: "Apply",
  4: "Ensure",
  5: "Strategise"
};

const BDQF_LABEL = {
  3: "O Level",
  4: "A Level / HNTec",
  5: "HND / Diploma",
  6: "Bachelor's Degree",
  7: "Master's Degree",
  8: "Doctorate"
};
