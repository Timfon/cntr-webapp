import React from 'react';
import DefinedTerm from '@/components/DefinedTerm';

export const questionBank = {
  general: [
    { 
      id: '00', 
      text: 'Which bill are you scoring?',
      type:'dropdown',
      options:['VA HB-2094: “High-Rise Artificial Intelligence Developer and Deployer Act” (https://lis.virginia.gov/bill-details/20251/HB2094)', 
        'NY S-6953B: “Responsible AI Safety and Education Act (RAISE Act)” (https://www.nysenate.gov/legislation/bills/2025/S6953/amendment/B)', 
        'TX HB-149: “Texas Responsible Artificial Intelligence Governance Act” (https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=HB149)',
        'Other (Please specify bill in the notes section)']
    },
    { 
      id: 'G1', 
      text: 'Does the bill have a definition for "artificial intelligence" or "automated decision making / systems"?',
      type: 'yesno'
    },
    { id: 'G1a', text: 'If "Yes" to G1, please select at least one of the following categories of AI definitions that is closest to the definition of AI in the bill.',
      type: 'multiselect',
      options: ['OECD: An AI system is a machine-based system that, for explicit or implicit objectives, infers, from the input it receives, how to generate outputs such as predictions, content, recommendations, or decisions that can influence physical or virtual environments. Different AI systems vary in their levels of autonomy and adaptiveness after deployment.',
         '2019 NDAA: (1) Any artificial system that performs tasks under varying and unpredictable circumstances without significant human oversight, or that can learn from experience and improve performance when exposed to data sets. (2) An artificial system developed in computer software, physical hardware, or other context that solves tasks requiring human-like perception, cognition, planning, learning, communication, or physical action. (3) An artificial system designed to think or act like a human, including cognitive architectures and neural networks. (4) A set of techniques, including machine learning, that is designed to approximate a cognitive task. (5) An artificial system designed to act rationally, including an intelligent software agent or embodied robot that achieves goals using perception, planning, reasoning, learning, communicating, decision making, and acting.',
        '2020 NDAA: The term ‘‘artificial intelligence’’ means a machine-based system that can, for a given set of human-defined objectives, make predictions, recommendations or decisions influencing real or virtual environments. Artificial intelligence systems use machine and human-based inputs to— (A) perceive real and virtual environments; (B) abstract such perceptions into models through analysis in an automated manner; and (C) use model inference to formulate options for information or action.',
      'EU AI Act: "AI system" means a machine-based system that is designed to operate with varying levels of autonomy and that may exhibit adaptiveness after deployment, and that, for explicit or implicit objectives, infers, from the input it receives, how to generate outputs such as predictions, content, recommendations, or decisions that can influence physical or virtual environments;',
    'EU AI Act: "General-purpose AI model" means an AI model, including where such an AI model is trained with a large amount of data using self-supervision at scale, that displays significant generality and is capable of competently performing a wide range of distinct tasks regardless of the way the model is placed on the market and that can be integrated into a variety of downstream systems or applications, except AI models that are used for research, development or prototyping activities before they are placed on the market;',
  'N/A']
    },
    { id: 'G1b', text: 'If "Yes" to G1, please select at least one of the following categories of ADS definitions that is closest to the definition of ADS in the bill.',
      type: 'multiselect',
      options: ['General v1: "Automated decision system" means a computational process, including one derived from machine learning, statistics, or other data processing or artificial intelligence techniques, that makes a decision, or facilitates human decision making  [usually followed by potential impacted entities]... [Example sources: US S-2134 (117th); SC S-404 (2023-2024)]',
        'General v2: "Automated decision system" means any computer program, method, statistical model, or process that aims to aid or replace human decision-making using algorithms or artificial intelligence. [Example source: RI SB-146 (2023)]',
        'General v3: "Automated decisionmaking technology" means any system, software, or process-including one derived from machine-learning, statistics, or other data-processing or artificial intelligence-that processes personal information and uses computation as whole or part of a system to make or execute a decision or facilitate human decision making. Automated decisionmaking technology includes profiling.',
        'Definition with "threshold" on decision: “Automated decision tool” means a system or service that uses artificial intelligence and has been specifically developed and marketed to, or specifically modified to, make, or be a controlling factor in making, consequential decisions. [Example source: CA AB-331 (2023-2024)]',
        'Government purpose v1: The term "automated decision system" means a system, software, or process that (i) uses computation, in whole or in part, to determine outcomes, make or aid decisions (including through evaluations, metrics, or scoring), inform policy implementation, collect data or observations, or otherwise interact with individuals or communities, including such a system, software, or process derived from machine learning, statistics, or other data processing or artificial intelligence techniques; and (ii) is not passive computing infrastructure. [Example source: US S-262 (118th)]',
        'Government purpose v2: "Automated decision system" means any machine-based system or application, including, but not limited to, any such system or application that is derived from machine learning, statistics, or other data processing or artificial intelligence techniques, which system is developed, procured, or utilized to make, inform, or materially support a critical decision made by a State agency. "Automated decision system" does not include passive computing infrastructure. [Example source: NJ S-1438 (221st)]',
        'Government purpose v3: "Automated decision system" means an algorithm, including an algorithm incorporating machine learning or other artificial intelligence techniques, that uses data-based analytics to make or support governmental decisions, judgments, or conclusions. [Example source: ID H-568 (2024)]',
        'N/A'
      ]
     },
    { id: 'G1bi', text: 'If the bill has ADS definition, does the bill provide exclusions for ADS?', type: 'yesno' },
    { id: 'G2', text: 'Does the bill include enforcement mechanisms to ensure compliance with any rules for AI governance?', type: 'yesno' },
    { id: 'G2a', text: 'If "Yes" to G2, does the bill specify the party responsible for enforcement?' , type: 'yesno'},
    {
    id: 'G3',
    text: (
      <>
        Does the bill apply to
        <DefinedTerm term="public-sector" definition="Government and publicly funded organizations">
        </DefinedTerm>
        public-sector use
        of AI / ADS?
      </>
    ),
    type: 'yesno'
  },
    { id: 'G4', text: 'Does the bill apply to private-sector use of AI / ADS?', type: 'yesno' },
    { id: 'G5', text: 'Does the bill provide an explicit list of domains where AI / ADS is used?', type: 'yesno' },
    { id: 'G6', text: 'Does the bill define concepts related to generative AI, e.g "large language model", "frontier model", "foundational model", etc?', type: 'yesno' },
    { id: 'G6a', text: 'If "Yes" to G6, does the bill specify scope (e.g. model size, compute power) specifically related to generative AI or foundational model?', type: 'yesno' }
  ],
  accountability: [
    { id: 'A1', text: 'Does the bill provide definitions for "Impact Assessment" (IA), "Risk Assessment" (RA), or similar forms of evaluation? If other forms of evaluation are used, please indicate in the Notes.', type: 'yesno'},
    { id: 'A2', text: 'Does the bill require covered entities (as defined in the bill) to conduct Impact/Risk Assessment (IA/RA) or similar evaluations?', type: 'yesno'},
    { id: 'A3', text: 'Does the bill specify the requirements or methodologies for conducting an IA/RA?', type:'yesno'},
    { id: 'A4', text: 'Does the bill refer to established standards, such as frameworks from NIST, or published industry standards, specific to accountability?', type: 'yesno'},
    { id: 'A4a', text: 'Does the bill require stakeholder participation in the IA/RA process?', type: 'yesno'},
    { id: 'A5', text: 'Does the bill require notification to affected communities about IA/RA?', type: 'yesno'},
    { id: 'A6', text: 'Does the bill provide compensation and civil recourse for those affected by harms?', type: 'yesno'},
    { id: 'A7', text: 'Does the bill specify enforcement mechanisms or penalties for failing to conduct IA/RA as required?', type: 'yesno'},
    { id: 'A8', text: 'Are third-party vendors or partners required to comply with the IA/RA provisions in the bill?', type: 'yesno'},
    { id: 'A9', text: 'Does the bill specify or otherwise acknowledge risks arising from development by requiring testing the AI tool/system for validity?', type: 'yesno'},
    { id: 'A10', text: 'Does the bill specify or otherwise acknowledge privacy harms?', type: 'yesno'},
    { id: 'A11', text: 'Does the bill specify or otherwise acknowledge risks to individual rights and freedoms, such as threats to dignity, personal autonomy, or privacy (e.g., unauthorized disclosure, identity theft)?', type: 'yesno'},
    { id: 'A11a', text: 'If "Yes" to any of A9 - A11, does the bill require the covered companies to identify the nature and severity of those risks?', type: 'yesno'},
    { id: 'A12', text: 'Does the IA/RA establish procedures to assess, benchmark, and monitor identified AI risks and related impacts?', type: 'yesno'},
    { id: 'A13', text: 'Does the IA/RA propose measures to address the risks?', type: 'yesno'},
    { id: 'A14', text: 'Does the IA/RA include the option of deploying the system in its current state with increased testing and controls, or if necessary, decommissioning the system?', type: 'yesno'},
    { id: 'A15', text: 'Is risk management an ongoing procedure, with testing and evaluation occurring over the entire lifecycle of an AI system, including the post-deployment period?', type: 'yesno'},
    { id: 'A16', text: 'Does the bill specify the frequency of IA/RA?', type: 'yesno'},
    { id: 'A16a', text: 'If "Yes" to A16, are IA/RAs required at regular intervals (e.g., annually, biannually)?', type: 'yesno'},
    { id: 'A17', text: 'Does the bill require a pre-deployment IA/RA before the system is implemented?', type: 'yesno'},
    { id: 'A18', text: 'Does the bill require a post-deployment IA/RA after the system has been implemented?', type: 'yesno'},
    { id: 'A19', text: 'Does the bill require IA/RAs for all stages of the model\'s life cycle (e.g., development, deployment, monitoring)?', type: 'yesno'},
    { id: 'A20', text: 'Does the bill require IA/RAs for all stages of the data life cycle?', type: 'yesno'},
    { id: 'A21', text: 'Does the bill mandate ongoing monitoring and updating of the IA/RA as the system evolves?', type: 'yesno'},
    { id: 'A22', text: 'Does the bill require maintenance of IA/RA documentation?', type: 'yesno'},
    { id: 'A23', text: 'Does the bill require documentation detailing how a model functions and its intended use cases?', type: 'yesno'},
    { id: 'A24', text: 'Does the bill require a transparency report?', type: 'yesno'},
    { id: 'A25', text: 'Does the bill identify the party responsible for completing the transparency requirement?', type: 'yesno'},
    { id: 'A26', text: 'Does the bill require regular reporting to government agencies?', type: 'yesno'},
    { id: 'A27', text: 'Does the bill require public reporting/publication?', type: 'yesno'},
    { id: 'A28', text: 'Does the bill aim to address these risks by requiring auditing from expert third parties?', type: 'yesno'},
    { id: 'A28a', text: 'If the bill includes auditing requirements or you select "Yes" for A28, does the bill define how frequently auditing should occur (i.e., single point or regular intervals)?', type: 'yesno'},
    { id: 'A29', text: 'Does the bill deploy precautionary measures beyond impact assessments, such as licensing or sandboxing?', type: 'yesno'},
    { id: 'A30', text: 'Does the bill impose explicit bans on AI systems, such as preventing deployment due to safety risks or requiring compliance before use?', type: 'yesno'},
    { id: 'A31', text: 'Does the bill propose a licensing regime for any AI systems?', type: 'yesno'},
    { id: 'A32', text: 'Does the bill consider conditional licensing?', type: 'yesno'},
    { id: 'A32a', text: 'If "Yes" to A32a, is the conditional licensing imposed by a regulator rather than self-imposed by companies?', type: 'yesno'},
    { id: 'A34', text: 'Does the bill give regulators extensive inspection and information-forcing capabilities?', type: 'yesno'},
    { id: 'A35', text: 'Does the bill require tools of resilience, e.g., kill switches, recalls, emergency training and protocols, or establishing thresholds at which a deployed system should be shut down?', type: 'yesno'}
  ],
  bias: [
    { id: 'B1', text: 'Does the bill define "algorithmic discrimination" (or a similar term) to characterize unfair treatment toward specific groups?', type:'yesno'},
    { id: 'B2', text: 'Does the bill explicitly include legally protected characteristics (e.g., race, gender, age, religion, disability) in its definition of discrimination or bias?', type:'yesno'},
    { id: 'B3', text: 'Does the bill identify specific sectors or domains where bias provisions apply?', type:'yesno'},
    { id: 'B3a', text: 'Does the bill apply bias provisions to specific types of consequential decisions (e.g., government benefits, employment)?', type:'yesno'},
    { id: 'B4', text: 'Does the bill require or suggest examination of data sources?', type:'yesno'},
    { id: 'B4a', text: 'If yes to B4, does the bill require or suggest examination of data sources that would implicate biased outcomes?', type:'yesno'},
    { id: 'B5', text: 'Does the bill restrict the use of AI systems that exhibit potentially discriminatory outcomes?', type:'yesno'},
    { id: 'B6', text: 'Does the bill propose or endorse specific methods to reduce algorithmic discrimination?', type:'yesno'},
    { id: 'B7', text: 'Does the bill mandate ongoing monitoring and evaluation of AI systems for bias?', type:'yesno'}
  ],
  data: [
    { id: 'D1', text: 'Does the bill mention or imply a right to privacy concerning personal data or individual information?', type:'yesno'},
    { id: 'D2', text: 'Does the bill refer to established standards such as ISO standards or NIST guidelines specific to data protection?', type:'yesno'},
    { id: 'D2a', text: 'If yes to D2, does the bill include provisions for the enforcement of these data protection standards?', type:'yesno'},
    { id: 'D4', text: 'Does the bill establish a private right of action?', type:'yesno'},
    { id: 'D5', text: 'Does the bill provide a definition of sensitive data?', type:'yesno'},
    { id: 'D6', text: 'Does the bill have specific requirements for handling sensitive data?', type:'yesno'},
    { id: 'D7', text: 'Does the bill require limits on access/use of sensitive data?', type:'yesno'},
    { id: 'D8', text: 'Does the bill require disclosure of the specific categories of sensitive data collected?', type:'yesno'},
    { id: 'D9', text: 'Does the bill specify guidelines or limitations regarding data collection practices?', type:'yesno'},
    { id: 'D10', text: 'Does the bill specify the allowable time frame or conditions under which data can be collected during the pre-deployment stage?', type:'yesno'},
    { id: 'D11', text: 'Does the bill reference data minimization?', type:'yesno'},
    { id: 'D12', text: 'Does the bill require explicit, informed consent from individuals before collecting their personal data?', type:'yesno'},
    { id: 'D13', text: 'Does the bill establish oversight mechanisms to ensure compliance with consent requirements for data collection?', type:'yesno'},
    { id: 'D14', text: 'Does the bill require organizations to document the purposes for which personal data is collected, used, processed or retained?', type:'yesno'},
    { id: 'D15', text: 'Does the bill require documentation, report or summary of used datasets, including data sources, consent records, and data preprocessing activities?', type:'yesno'},
    { id: 'D16', text: 'Does the bill specify how personal data can be used after deployment of the AI system?', type:'yesno'},
    { id: 'D17', text: 'Does the bill define the duration or conditions under which personal data can be used post-deployment?', type:'yesno'},
    { id: 'D18', text: 'Does the bill reference data retention practices?', type:'yesno'},
    { id: 'D19', text: 'Does the bill identify a data retention period?', type:'yesno'},
    { id: 'D20', text: 'Does the bill specify the conditions under which personal data can be transferred or shared between parties domestically?', type:'yesno'},
    { id: 'D21', text: 'Does the bill specify the conditions for cross-border transfer or sharing of personal data?', type:'yesno'},
    { id: 'D22', text: 'Does the bill reference data deletion?', type:'yesno'},
    { id: 'D23', text: 'Does the bill address how individuals can request deletion of their data?', type:'yesno'},
    { id: 'D24', text: 'Does the bill address how individuals can verify the removal of their data?', type:'yesno'},
    { id: 'D25', text: 'Does the bill specify requirements for securing data?', type:'yesno'},
    { id: 'D26', text: 'Does the bill specify requirements for informing individuals of data breaches?', type:'yesno'},
    { id: 'D27', text: 'Does the bill require mechanisms for individuals to ascertain if their personal data has been used in AI training datasets?', type:'yesno'},
    { id: 'D28', text: 'Does the bill provide remedies for individuals if their personal data is disclosed in AI outputs without consent?', type:'yesno'}
  ],
  institution: [
    { id: 'I1', text: 'Does the bill mandate the establishment of a new entity?', type: 'yesno'},
    { id: 'I1a', text: 'Does the bill outline clear, measurable objectives for the new entity that must be achieved within defined timelines?', type: 'yesno'},
    { id: 'I1b', text: 'Does the bill identify how the new entity will work with existing agencies?', type: 'yesno'}
  ],
  labor: [
    { id: 'L1', text: 'Does the bill contain provisions aimed at expanding the workforce in the AI Economy?', type: 'yesno'},
    { id: 'L2', text: 'Does the bill call for training the labor force for AI-related skills?', type: 'yesno'},
    { id: 'L3', text: 'Does the bill specify partners to collaborate with to research the impact of AI on the labor force?', type: 'yesno'},
    { id: 'L4', text: 'Does the bill call for the analysis of challenges faced by workers affected by automation or AI implementation?', type: 'yesno'},
    { id: 'L5', text: 'Does the bill call for the analysis of demographics that may be most vulnerable to AI displacement?', type: 'yesno'},
    { id: 'L6', text: 'Does the bill propose recommendations to alleviate work displacement as a result of AI?', type: 'yesno'},
    { id: 'L7', text: 'Does the bill propose compensation for workers who are being displaced, replaced or unemployed due to AI or automation?', type: 'yesno' }
  ],
  submit: [
    // { id: 'L7', text: 'Does the bill propose compensation for workers who are being displaced, replaced or unemployed due to AI or automation?' }
  ]
};
