// CNTR AISLE Framework V1 Glossary
// Based on: https://brown-cntr.github.io/cntr-aisle/glossary

export interface GlossaryTerm {
  term: string;
  definition: string;
  categories: string[];
  reference?: string;
}

export const glossary: GlossaryTerm[] = [
  {
    term: 'Public-sector use',
    definition: 'The use or procurement of AI / ADS in federal, state or local government agencies or entities',
    categories: ['General'],
  },
  {
    term: 'Private-sector use',
    definition: 'The use or procurement of AI / ADS in private businesses, corporations or nongovernment agencies',
    categories: ['General'],
  },
  {
    term: 'Domain',
    definition: 'The context that the bill applies to, such as healthcare, employment, entertainment, insurance, finance, housing, etc.',
    categories: ['General', 'Labor Force'],
  },
  {
    term: 'Impact/Risk Assessment (IA/RA)',
    definition: 'A process assessing the potential impacts/risks of an action or a system\'s relative benefits and costs before implementation',
    categories: ['Accountability & Transparency'],
    reference: 'https://bipartisanpolicy.org/blog/impact-assessments-for-ai/',
  },
  {
    term: 'Covered Companies',
    definition: 'Companies that are subject to the law',
    categories: ['Accountability & Transparency'],
  },
  {
    term: 'Stakeholders',
    definition: 'Those with an interest in or affected by the bill and its outcomes',
    categories: ['Accountability & Transparency'],
  },
  {
    term: 'Civil Recourse',
    definition: 'The legal means through which individuals can seek redress for harms caused against them',
    categories: ['Accountability & Transparency'],
  },
  {
    term: 'Algorithmic Inaccuracy',
    definition: 'Errors/bias in the functioning of algorithms',
    categories: ['Accountability & Transparency'],
  },
  {
    term: 'Pre-Deployment',
    definition: 'The testing phase before an AI system\'s launch',
    categories: ['Accountability & Transparency', 'Data Protection'],
  },
  {
    term: 'Post-Deployment',
    definition: 'Ongoing monitoring after an AI system is launched',
    categories: ['Accountability & Transparency', 'Data Protection'],
  },
  {
    term: 'Lifecycle',
    definition: 'The iterative process of moving from a business problem to an AI solution that solves that problem',
    categories: ['Accountability & Transparency'],
    reference: 'https://coe.gsa.gov/coe/ai-guide-for-government/understanding-managing-ai-lifecycle/',
  },
  {
    term: 'Privacy Harms',
    definition: 'Diverse effects on individuals resulting from the processing or misuse of personal data, such as embarrassment, discrimination, identity theft, financial loss, or loss of autonomy and trust',
    categories: ['Accountability & Transparency'],
    reference: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4195066',
  },
  {
    term: 'Data Subject',
    definition: 'An individual whose personal data is processed',
    categories: ['Accountability & Transparency'],
  },
  {
    term: 'Operational Context',
    definition: 'The environment or circumstances in which an AI system operates',
    categories: ['Accountability & Transparency'],
  },
  {
    term: 'Assess/Benchmark/Monitor',
    definition: 'These terms refer to evaluating, comparing against standards, and observing for changes, respectively, and could need clearer explanation in a technical/legal context',
    categories: ['Accountability & Transparency'],
  },
  {
    term: 'Decommissioning',
    definition: 'The process of shutting down or discontinuing a system',
    categories: ['Accountability & Transparency'],
  },
  {
    term: 'Transparency Report',
    definition: 'Regular public reports on platform usage and governance practices like takedown requests and policy enforcement.',
    categories: ['Accountability & Transparency'],
    reference: 'https://doi.org/10.48550/arXiv.2402.16268',
  },
  {
    term: 'Risk Regulation',
    definition: 'Rules or procedures intended to control or mitigate risks, broadly covering three categories: precautionary tactics, risk analysis and mitigation, and post-market measures',
    categories: ['Accountability & Transparency'],
    reference: 'https://ssrn.com/abstract=4195066',
  },
  {
    term: 'Precautionary measures',
    definition: 'Safety-focused measures like bans, licensing, and sandboxing, ensuring technologies are proven safe before use',
    categories: ['Accountability & Transparency'],
    reference: 'https://ssrn.com/abstract=4195066',
  },
  {
    term: 'Licensing regime',
    definition: 'A formal system for regulating and granting permissions for the operation of AI systems.',
    categories: ['Accountability & Transparency'],
    reference: 'https://ssrn.com/abstract=4195066',
  },
  {
    term: 'Conditional Licensing',
    definition: 'Licensing granted with specific restrictions or with promised guard rails, requiring compliance to maintain approval.',
    categories: ['Accountability & Transparency'],
    reference: 'https://ssrn.com/abstract=4195066',
  },
  {
    term: 'Post-market measures',
    definition: 'Risk regulation tools like monitoring, compliance checks, and failsafes applied after a product is in use',
    categories: ['Accountability & Transparency'],
    reference: 'https://ssrn.com/abstract=4195066',
  },
  {
    term: 'Information-forcing',
    definition: 'The ability to compel entities to provide necessary information.',
    categories: ['Accountability & Transparency'],
  },
  {
    term: 'Resilience',
    definition: 'The ability of a system to recover from faults or challenges (e.g., through kill switches or emergency protocols).',
    categories: ['Accountability & Transparency'],
  },
  {
    term: 'A Right to Privacy',
    definition: 'References to personal data protection, data security, or confidentiality clauses can be considered as referring to a right to privacy',
    categories: ['Data Protection'],
  },
  {
    term: 'Data Minimization',
    definition: 'Collection of the personal data only necessary for a specific purpose',
    categories: ['Data Protection'],
  },
  {
    term: 'Private Right of Action',
    definition: 'Individuals can sue an organization for damages or enforce compliance if their rights are violated',
    categories: ['Data Protection'],
    reference: 'https://www.newamerica.org/oti/reports/enforcing-new-privacy-law/',
  },
  {
    term: 'Data Retention',
    definition: 'Policies on how long data is stored before secure deletion',
    categories: ['Data Protection'],
  },
  {
    term: 'Algorithmic Discrimination',
    definition: 'When automated systems contribute to unjustified different treatment or impacts disfavoring people based on their race, color, ethnicity, sex (including pregnancy, childbirth, and related medical conditions, gender identity, intersex status, and sexual orientation), religion, age, national origin, disability, veteran status, genetic information, or any other classification protected by law.',
    categories: ['Bias & Discrimination'],
    reference: 'https://www.whitehouse.gov/ostp/ai-bill-of-rights/definitions/',
  },
  {
    term: 'Unfair Treatment',
    definition: 'Unlawful discriminatory practice, the risk to rights and freedoms, or systematic bias',
    categories: ['Bias & Discrimination'],
  },
  {
    term: 'Data sources',
    definition: 'Origins/repositories for data used to train, validate, and test machine learning models or other AI systems. Data sources may include public datasets, private sector data, crowdsourced content and historical records.',
    categories: ['Bias & Discrimination'],
  },
  {
    term: 'Entity',
    definition: 'A new organization, typically a government body or oversight committee which is established to implement, regulate, or enforce specific aspects of the legislation. It might also focus on activities like monitoring compliance, issuing guidelines, or supporting research.',
    categories: ['Institution'],
  },
  {
    term: 'Measurable Goals',
    definition: 'Specific, quantifiable goals that an institution or agency aims to achieve.',
    categories: ['Institution'],
  },
  {
    term: 'Regulatory Reports',
    definition: 'Reports created by institutions to assess compliance, performance, or impact related to specific regulations.',
    categories: ['Institution'],
  },
  {
    term: 'AI Economy',
    definition: 'Economic activities, industries, and jobs that arise from the development, deployment, and integration of artificial intelligence technologies. Components of the AI economy may include development (research in AI tools), implementation (applications in industries such as healthcare, finance, etc.), AI services and support, or AI transformation.',
    categories: ['Labor Force'],
    reference: 'https://www.europarl.europa.eu/RegData/etudes/BRIE/2019/637967/EPRS_BRI(2019)637967_EN.pdf',
  },
  {
    term: 'Partners',
    definition: 'Organizations, institutions, or groups tasked with responsibilities such as conducting research and analyzing data with regards to the bill\'s objectives. This may include governmental bodies, private organizations, academic institutions, research groups, or industry partnerships/stakeholders.',
    categories: ['Labor Force'],
  },
  {
    term: 'AI-related skills',
    definition: 'Competencies, knowledge, and abilities required to develop, deploy, manage, and work alongside artificial intelligence systems. These skills can be both technical (programming, cybersecurity, etc.) and non-technical (ethics and policy understanding etc.).',
    categories: ['Labor Force'],
  },
];

// Helper function to search glossary
export const searchGlossary = (query: string): GlossaryTerm[] => {
  if (!query.trim()) return glossary;
  
  const lowerQuery = query.toLowerCase();
  return glossary.filter(term => 
    term.term.toLowerCase().includes(lowerQuery) ||
    term.definition.toLowerCase().includes(lowerQuery) ||
    term.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
  );
};

// Helper function to get term by name (case-insensitive)
export const getTerm = (termName: string): GlossaryTerm | undefined => {
  return glossary.find(t => t.term.toLowerCase() === termName.toLowerCase());
};

