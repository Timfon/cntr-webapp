import React from 'react';
import DefinedTerm from '@/components/DefinedTerm';

export const questionBank = {
  general: [
    { 
      id: 'G1', 
      text: 'Does the bill have a definition for "artificial intelligence" or "automated decision making / systems"?'
    },
    { id: 'G1a', text: 'If "Yes" to G1, please select at least one of the following categories of AI definitions that is closest to the definition of AI in the bill.' },
    { id: 'G1b', text: 'If "Yes" to G1, please select at least one of the following categories of ADS definitions that is closest to the definition of ADS in the bill.' },
    { id: 'G1bi', text: 'If the bill has ADS definition, does the bill provide exclusions for ADS?' },
    { id: 'G2', text: 'Does the bill include enforcement mechanisms to ensure compliance with any rules for AI governance?' },
    { id: 'G2a', text: 'If "Yes" to G2, does the bill specify the party responsible for enforcement?' },
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
    )
  },
    { id: 'G4', text: 'Does the bill apply to private-sector use of AI / ADS?' },
    { id: 'G5', text: 'Does the bill provide an explicit list of domains where AI / ADS is used?' },
    { id: 'G6', text: 'Does the bill define concepts related to generative AI, e.g "large language model", "frontier model", "foundational model", etc?' },
    { id: 'G6a', text: 'If "Yes" to G6, does the bill specify scope (e.g. model size, compute power) specifically related to generative AI or foundational model?' }
  ],
  accountability: [
    { id: 'A1', text: 'Does the bill provide definitions for "Impact Assessment" (IA), "Risk Assessment" (RA), or similar forms of evaluation? If other forms of evaluation are used, please indicate in the Notes.' },
    { id: 'A2', text: 'Does the bill require covered entities (as defined in the bill) to conduct Impact/Risk Assessment (IA/RA) or similar evaluations?' },
    { id: 'A3', text: 'Does the bill specify the requirements or methodologies for conducting an IA/RA?' },
    { id: 'A4', text: 'Does the bill refer to established standards, such as frameworks from NIST, or published industry standards, specific to accountability?' },
    { id: 'A4a', text: 'Does the bill require stakeholder participation in the IA/RA process?' },
    { id: 'A5', text: 'Does the bill require notification to affected communities about IA/RA?' },
    { id: 'A6', text: 'Does the bill provide compensation and civil recourse for those affected by harms?' },
    { id: 'A7', text: 'Does the bill specify enforcement mechanisms or penalties for failing to conduct IA/RA as required?' },
    { id: 'A8', text: 'Are third-party vendors or partners required to comply with the IA/RA provisions in the bill?' },
    { id: 'A9', text: 'Does the bill specify or otherwise acknowledge risks arising from development by requiring testing the AI tool/system for validity?' },
    { id: 'A10', text: 'Does the bill specify or otherwise acknowledge privacy harms?' },
    { id: 'A11', text: 'Does the bill specify or otherwise acknowledge risks to individual rights and freedoms, such as threats to dignity, personal autonomy, or privacy (e.g., unauthorized disclosure, identity theft)?' },
    { id: 'A11a', text: 'If "Yes" to any of A9 - A11, does the bill require the covered companies to identify the nature and severity of those risks?' },
    { id: 'A12', text: 'Does the IA/RA establish procedures to assess, benchmark, and monitor identified AI risks and related impacts?' },
    { id: 'A13', text: 'Does the IA/RA propose measures to address the risks?' },
    { id: 'A14', text: 'Does the IA/RA include the option of deploying the system in its current state with increased testing and controls, or if necessary, decommissioning the system?' },
    { id: 'A15', text: 'Is risk management an ongoing procedure, with testing and evaluation occurring over the entire lifecycle of an AI system, including the post-deployment period?' },
    { id: 'A16', text: 'Does the bill specify the frequency of IA/RA?' },
    { id: 'A16a', text: 'If "Yes" to A16, are IA/RAs required at regular intervals (e.g., annually, biannually)?' },
    { id: 'A17', text: 'Does the bill require a pre-deployment IA/RA before the system is implemented?' },
    { id: 'A18', text: 'Does the bill require a post-deployment IA/RA after the system has been implemented?' },
    { id: 'A19', text: 'Does the bill require IA/RAs for all stages of the model\'s life cycle (e.g., development, deployment, monitoring)?' },
    { id: 'A20', text: 'Does the bill require IA/RAs for all stages of the data life cycle?' },
    { id: 'A21', text: 'Does the bill mandate ongoing monitoring and updating of the IA/RA as the system evolves?' },
    { id: 'A22', text: 'Does the bill require maintenance of IA/RA documentation?' },
    { id: 'A23', text: 'Does the bill require documentation detailing how a model functions and its intended use cases?' },
    { id: 'A24', text: 'Does the bill require a transparency report?' },
    { id: 'A25', text: 'Does the bill identify the party responsible for completing the transparency requirement?' },
    { id: 'A26', text: 'Does the bill require regular reporting to government agencies?' },
    { id: 'A27', text: 'Does the bill require public reporting/publication?' },
    { id: 'A28', text: 'Does the bill aim to address these risks by requiring auditing from expert third parties?' },
    { id: 'A28a', text: 'If the bill includes auditing requirements or you select "Yes" for A28, does the bill define how frequently auditing should occur (i.e., single point or regular intervals)?' },
    { id: 'A29', text: 'Does the bill deploy precautionary measures beyond impact assessments, such as licensing or sandboxing?' },
    { id: 'A30', text: 'Does the bill impose explicit bans on AI systems, such as preventing deployment due to safety risks or requiring compliance before use?' },
    { id: 'A31', text: 'Does the bill propose a licensing regime for any AI systems?' },
    { id: 'A32', text: 'Does the bill consider conditional licensing?' },
    { id: 'A32a', text: 'If "Yes" to A32a, is the conditional licensing imposed by a regulator rather than self-imposed by companies?' },
    { id: 'A34', text: 'Does the bill give regulators extensive inspection and information-forcing capabilities?' },
    { id: 'A35', text: 'Does the bill require tools of resilience, e.g., kill switches, recalls, emergency training and protocols, or establishing thresholds at which a deployed system should be shut down?' }
  ],
  bias: [
    { id: 'B1', text: 'Does the bill define "algorithmic discrimination" (or a similar term) to characterize unfair treatment toward specific groups?' },
    { id: 'B2', text: 'Does the bill explicitly include legally protected characteristics (e.g., race, gender, age, religion, disability) in its definition of discrimination or bias?' },
    { id: 'B3', text: 'Does the bill identify specific sectors or domains where bias provisions apply?' },
    { id: 'B3a', text: 'Does the bill apply bias provisions to specific types of consequential decisions (e.g., government benefits, employment)?' },
    { id: 'B4', text: 'Does the bill require or suggest examination of data sources?' },
    { id: 'B4a', text: 'If yes to B4, does the bill require or suggest examination of data sources that would implicate biased outcomes?' },
    { id: 'B5', text: 'Does the bill restrict the use of AI systems that exhibit potentially discriminatory outcomes?' },
    { id: 'B6', text: 'Does the bill propose or endorse specific methods to reduce algorithmic discrimination?' },
    { id: 'B7', text: 'Does the bill mandate ongoing monitoring and evaluation of AI systems for bias?' }
  ],
  data: [
    { id: 'D1', text: 'Does the bill mention or imply a right to privacy concerning personal data or individual information?' },
    { id: 'D2', text: 'Does the bill refer to established standards such as ISO standards or NIST guidelines specific to data protection?' },
    { id: 'D2a', text: 'If yes to D2, does the bill include provisions for the enforcement of these data protection standards?' },
    { id: 'D4', text: 'Does the bill establish a private right of action?' },
    { id: 'D5', text: 'Does the bill provide a definition of sensitive data?' },
    { id: 'D6', text: 'Does the bill have specific requirements for handling sensitive data?' },
    { id: 'D7', text: 'Does the bill require limits on access/use of sensitive data?' },
    { id: 'D8', text: 'Does the bill require disclosure of the specific categories of sensitive data collected?' },
    { id: 'D9', text: 'Does the bill specify guidelines or limitations regarding data collection practices?' },
    { id: 'D10', text: 'Does the bill specify the allowable time frame or conditions under which data can be collected during the pre-deployment stage?' },
    { id: 'D11', text: 'Does the bill reference data minimization?' },
    { id: 'D12', text: 'Does the bill require explicit, informed consent from individuals before collecting their personal data?' },
    { id: 'D13', text: 'Does the bill establish oversight mechanisms to ensure compliance with consent requirements for data collection?' },
    { id: 'D14', text: 'Does the bill require organizations to document the purposes for which personal data is collected, used, processed or retained?' },
    { id: 'D15', text: 'Does the bill require documentation, report or summary of used datasets, including data sources, consent records, and data preprocessing activities?' },
    { id: 'D16', text: 'Does the bill specify how personal data can be used after deployment of the AI system?' },
    { id: 'D17', text: 'Does the bill define the duration or conditions under which personal data can be used post-deployment?' },
    { id: 'D18', text: 'Does the bill reference data retention practices?' },
    { id: 'D19', text: 'Does the bill identify a data retention period?' },
    { id: 'D20', text: 'Does the bill specify the conditions under which personal data can be transferred or shared between parties domestically?' },
    { id: 'D21', text: 'Does the bill specify the conditions for cross-border transfer or sharing of personal data?' },
    { id: 'D22', text: 'Does the bill reference data deletion?' },
    { id: 'D23', text: 'Does the bill address how individuals can request deletion of their data?' },
    { id: 'D24', text: 'Does the bill address how individuals can verify the removal of their data?' },
    { id: 'D25', text: 'Does the bill specify requirements for securing data?' },
    { id: 'D26', text: 'Does the bill specify requirements for informing individuals of data breaches?' },
    { id: 'D27', text: 'Does the bill require mechanisms for individuals to ascertain if their personal data has been used in AI training datasets?' },
    { id: 'D28', text: 'Does the bill provide remedies for individuals if their personal data is disclosed in AI outputs without consent?' }
  ],
  institution: [
    { id: 'I1', text: 'Does the bill mandate the establishment of a new entity?' },
    { id: 'I1a', text: 'Does the bill outline clear, measurable objectives for the new entity that must be achieved within defined timelines?' },
    { id: 'I1b', text: 'Does the bill identify how the new entity will work with existing agencies?' }
  ],
  labor: [
    { id: 'L1', text: 'Does the bill contain provisions aimed at expanding the workforce in the AI Economy?' },
    { id: 'L2', text: 'Does the bill call for training the labor force for AI-related skills?' },
    { id: 'L3', text: 'Does the bill specify partners to collaborate with to research the impact of AI on the labor force?' },
    { id: 'L4', text: 'Does the bill call for the analysis of challenges faced by workers affected by automation or AI implementation?' },
    { id: 'L5', text: 'Does the bill call for the analysis of demographics that may be most vulnerable to AI displacement?' },
    { id: 'L6', text: 'Does the bill propose recommendations to alleviate work displacement as a result of AI?' },
    { id: 'L7', text: 'Does the bill propose compensation for workers who are being displaced, replaced or unemployed due to AI or automation?' }
  ]
};
