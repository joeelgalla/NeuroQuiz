export type Category = 'Myotome' | 'Dermatome' | 'Brain Region' | 'Nerve Root';

export interface Question {
  id: string;
  category: Category;
  prompt: string;
  answer: string;
  options: string[];
  image?: string;
}

export const questions: Question[] = [
  // Myotomes
  { id: 'm1', category: 'Myotome', prompt: 'Shoulder Abduction', answer: 'C5', options: ['C5', 'C5, C6', 'C6', 'C7', 'C8', 'T1'], image: '/Shoulder_Abduction__C5.png' },
  { id: 'm2', category: 'Myotome', prompt: 'Elbow Flexion', answer: 'C5, C6', options: ['C5', 'C5, C6', 'C6', 'C7', 'C8', 'T1'], image: '/Elbow_Flexion__C5-C6.png' },
  { id: 'm3', category: 'Myotome', prompt: 'Arm IR & ER', answer: 'C6, C7 (IR) / C5, C6 (ER)', options: ['C5', 'C5, C6', 'C6, C7 (IR) / C5, C6 (ER)', 'C6, C7, C8', 'C7', 'C8'], image: '/Arm_Internal_Rotation_and_External_Rotation__C6-C7.png' },
  { id: 'm4', category: 'Myotome', prompt: 'Pronation & Supination', answer: 'C6 (Sup) / C6, C7 (Pron)', options: ['C5', 'C5, C6', 'C6 (Sup) / C6, C7 (Pron)', 'C6, C7, C8', 'C7', 'C8'], image: '/Pronation_and_Supination__C6.png' },
  { id: 'm5', category: 'Myotome', prompt: 'Shoulder Adduction', answer: 'C6, C7, C8', options: ['C5', 'C5, C6', 'C6, C7, C8', 'C7', 'C8', 'T1'], image: '/Shoulder_Adduction__C6-C7-C8.png' },
  { id: 'm6', category: 'Myotome', prompt: 'Elbow Extension', answer: 'C7', options: ['C5', 'C5, C6', 'C6', 'C7', 'C8', 'T1'], image: '/Elbow_Extension__C7.png' },
  { id: 'm7', category: 'Myotome', prompt: 'Digit Extension', answer: 'C7', options: ['C5', 'C5, C6', 'C6', 'C7', 'C8', 'T1'], image: '/Digit_Extension__C7.png' },
  { id: 'm8', category: 'Myotome', prompt: 'Digit Flexion', answer: 'C8', options: ['C5', 'C5, C6', 'C6', 'C7', 'C8', 'T1'], image: '/Digit_Flexion__C8.png' },
  { id: 'm9', category: 'Myotome', prompt: 'Wrist Flexion', answer: 'C7', options: ['C5', 'C5, C6', 'C6', 'C7', 'C8', 'T1'], image: '/Wrist_Flexion__C7.png' },
  { id: 'm10', category: 'Myotome', prompt: 'Wrist Extension', answer: 'C7', options: ['C5', 'C5, C6', 'C6', 'C7', 'C8', 'T1'], image: '/Wrist_Extension__C7.png' },
  { id: 'm11', category: 'Myotome', prompt: 'Digit Abduction & Adduction', answer: 'C8, T1', options: ['C5', 'C5, C6', 'C6', 'C7', 'C8, T1', 'T1'], image: '/Digit_Abduction_and_Adduction__C8-T1.png' },
  { id: 'm12', category: 'Myotome', prompt: 'Hip Flexion', answer: 'L1, L2', options: ['L1, L2', 'L2-L4 (Add) / L5 (Abd)', 'L3, L4', 'L4, L5', 'L5', 'S1, S2'], image: '/Hip_Flexion__L1-L2.png' },
  { id: 'm13', category: 'Myotome', prompt: 'Hip Extension', answer: 'L5, S1', options: ['L1, L2', 'L3, L4', 'L4, L5', 'L5, S1', 'S1, S2', 'L5'], image: '/Hip_Extension__L5-S1.png' },
  { id: 'm14', category: 'Myotome', prompt: 'Hip Adduction & Abduction', answer: 'L2-L4 (Add) / L5 (Abd)', options: ['L1, L2', 'L2-L4 (Add) / L5 (Abd)', 'L3, L4', 'L4, L5', 'L5, S1', 'S1, S2'], image: '/Hip_Adduction_and_Abduction__L2-L4.png' },
  { id: 'm15', category: 'Myotome', prompt: 'Knee Flexion & Extension', answer: 'L5-S1 (Flex) / L3-L4 (Ext)', options: ['L1, L2', 'L3, L4', 'L4, L5', 'L5-S1 (Flex) / L3-L4 (Ext)', 'S1, S2', 'L5'], image: '/Knee_Flexion_and_Extension__L5-S1_Flex__L3-L4_Ext.png' },
  { id: 'm16', category: 'Myotome', prompt: 'Ankle Dorsiflexion', answer: 'L4, L5', options: ['L1, L2', 'L3, L4', 'L4, L5', 'L5, S1', 'S1, S2', 'L5'], image: '/Ankle_Dorsiflexion__L4-L5.png' },
  { id: 'm17', category: 'Myotome', prompt: 'Ankle Plantarflexion', answer: 'S1, S2', options: ['L1, L2', 'L3, L4', 'L4, L5', 'L5, S1', 'S1, S2', 'L5'], image: '/Ankle_Plantarflexion__S1-S2.png' },
  { id: 'm18', category: 'Myotome', prompt: 'Great Toe Extension', answer: 'L5', options: ['L1, L2', 'L3, L4', 'L4, L5', 'L5, S1', 'S1, S2', 'L5'], image: '/Great_Toe_Extension__L5.png' },
  { id: 'm19', category: 'Myotome', prompt: 'Toe Flexion', answer: 'S1, S2', options: ['L1, L2', 'L3, L4', 'L4, L5', 'L5, S1', 'S1, S2', 'L5'], image: '/Toe_Flexion__S1-S2.png' },
  { id: 'm20', category: 'Myotome', prompt: 'Foot Inversion & Eversion', answer: 'L4-L5 (Inv) / L5-S1 (Ev)', options: ['L1, L2', 'L3, L4', 'L4-L5 (Inv) / L5-S1 (Ev)', 'L5, S1', 'S1, S2', 'L5'], image: '/Foot_Inversion_and_Eversion__L4-L5_Inv__L5-S1_Ev.png' },

  // Dermatomes
  { id: 'd1', category: 'Dermatome', prompt: 'Lateral Arm', answer: 'C5', options: ['C5', 'C6', 'C7', 'C8', 'T1', 'T4'] },
  { id: 'd2', category: 'Dermatome', prompt: 'Thumb and Lateral Forearm', answer: 'C6', options: ['C5', 'C6', 'C7', 'C8', 'T1', 'T10'] },
  { id: 'd3', category: 'Dermatome', prompt: 'Middle Finger', answer: 'C7', options: ['C5', 'C6', 'C7', 'C8', 'T1', 'L4'] },
  { id: 'd4', category: 'Dermatome', prompt: 'Little Finger', answer: 'C8', options: ['C5', 'C6', 'C7', 'C8', 'T1', 'L5'] },
  { id: 'd5', category: 'Dermatome', prompt: 'Medial Forearm', answer: 'T1', options: ['C5', 'C6', 'C7', 'C8', 'T1', 'S1'] },
  { id: 'd6', category: 'Dermatome', prompt: 'Nipple Line', answer: 'T4', options: ['T4', 'T10', 'L1', 'L4', 'L5', 'S1'] },
  { id: 'd7', category: 'Dermatome', prompt: 'Umbilicus', answer: 'T10', options: ['T4', 'T10', 'L1', 'L4', 'L5', 'S1'] },
  { id: 'd8', category: 'Dermatome', prompt: 'Medial Malleolus', answer: 'L4', options: ['L3', 'L4', 'L5', 'S1', 'S2', 'S3'] },
  { id: 'd9', category: 'Dermatome', prompt: 'Dorsum of Foot (1st/2nd toe web)', answer: 'L5', options: ['L3', 'L4', 'L5', 'S1', 'S2', 'S3'] },
  { id: 'd10', category: 'Dermatome', prompt: 'Lateral Malleolus', answer: 'S1', options: ['L3', 'L4', 'L5', 'S1', 'S2', 'S3'] },
  { id: 'd11', category: 'Dermatome', prompt: 'Back of Head', answer: 'C2', options: ['C2', 'C3', 'C4', 'C5', 'T1', 'T4'] },
  { id: 'd12', category: 'Dermatome', prompt: 'Neck (Anterior)', answer: 'C3', options: ['C2', 'C3', 'C4', 'C5', 'T1', 'T4'] },
  { id: 'd13', category: 'Dermatome', prompt: 'Shoulder (Superior)', answer: 'C4', options: ['C2', 'C3', 'C4', 'C5', 'T1', 'T4'] },
  { id: 'd14', category: 'Dermatome', prompt: 'Inguinal Ligament', answer: 'L1', options: ['T10', 'T12', 'L1', 'L2', 'L3', 'S1'] },
  { id: 'd15', category: 'Dermatome', prompt: 'Anterior Thigh', answer: 'L2', options: ['L1', 'L2', 'L3', 'L4', 'L5', 'S1'] },
  { id: 'd16', category: 'Dermatome', prompt: 'Knee (Anterior)', answer: 'L3', options: ['L1', 'L2', 'L3', 'L4', 'L5', 'S1'] },
  { id: 'd17', category: 'Dermatome', prompt: 'Posterior Thigh', answer: 'S2', options: ['L4', 'L5', 'S1', 'S2', 'S3', 'S4'] },
  { id: 'd18', category: 'Dermatome', prompt: 'Perineum', answer: 'S3-S5', options: ['L4', 'L5', 'S1', 'S2', 'S3-S5', 'C8'] },

  // Brain Regions
  { id: 'b1', category: 'Brain Region', prompt: 'Executive Function & Motor Control', answer: 'Frontal Lobe', options: ['Frontal Lobe', 'Parietal Lobe', 'Temporal Lobe', 'Occipital Lobe', 'Cerebellum', 'Brainstem'] },
  { id: 'b2', category: 'Brain Region', prompt: 'Somatosensory Processing', answer: 'Parietal Lobe', options: ['Frontal Lobe', 'Parietal Lobe', 'Temporal Lobe', 'Occipital Lobe', 'Cerebellum', 'Brainstem'] },
  { id: 'b3', category: 'Brain Region', prompt: 'Auditory Processing & Memory', answer: 'Temporal Lobe', options: ['Frontal Lobe', 'Parietal Lobe', 'Temporal Lobe', 'Occipital Lobe', 'Cerebellum', 'Brainstem'] },
  { id: 'b4', category: 'Brain Region', prompt: 'Visual Processing', answer: 'Occipital Lobe', options: ['Frontal Lobe', 'Parietal Lobe', 'Temporal Lobe', 'Occipital Lobe', 'Cerebellum', 'Brainstem'] },
  { id: 'b5', category: 'Brain Region', prompt: 'Coordination & Balance', answer: 'Cerebellum', options: ['Frontal Lobe', 'Parietal Lobe', 'Temporal Lobe', 'Occipital Lobe', 'Cerebellum', 'Brainstem'] },
  { id: 'b6', category: 'Brain Region', prompt: 'Autonomic Functions (Breathing, HR)', answer: 'Brainstem', options: ['Frontal Lobe', 'Parietal Lobe', 'Temporal Lobe', 'Occipital Lobe', 'Cerebellum', 'Brainstem'] },
  { id: 'b7', category: 'Brain Region', prompt: 'Relay Station for Sensory Info', answer: 'Thalamus', options: ['Thalamus', 'Hypothalamus', 'Amygdala', 'Hippocampus', 'Basal Ganglia', 'Pons'] },
  { id: 'b8', category: 'Brain Region', prompt: 'Homeostasis & Endocrine Control', answer: 'Hypothalamus', options: ['Thalamus', 'Hypothalamus', 'Amygdala', 'Hippocampus', 'Basal Ganglia', 'Pons'] },
  { id: 'b9', category: 'Brain Region', prompt: 'Emotion & Fear Processing', answer: 'Amygdala', options: ['Thalamus', 'Hypothalamus', 'Amygdala', 'Hippocampus', 'Basal Ganglia', 'Pons'] },
  { id: 'b10', category: 'Brain Region', prompt: 'Memory Formation', answer: 'Hippocampus', options: ['Thalamus', 'Hypothalamus', 'Amygdala', 'Hippocampus', 'Basal Ganglia', 'Pons'] },
  { id: 'b11', category: 'Brain Region', prompt: 'Movement Regulation', answer: 'Basal Ganglia', options: ['Thalamus', 'Hypothalamus', 'Amygdala', 'Hippocampus', 'Basal Ganglia', 'Pons'] },
  { id: 'b12', category: 'Brain Region', prompt: 'Connects Hemispheres', answer: 'Corpus Callosum', options: ['Corpus Callosum', 'Hypothalamus', 'Amygdala', 'Hippocampus', 'Basal Ganglia', 'Pons'] },

  // Nerve Roots / Plexus
  { id: 'n1', category: 'Nerve Root', prompt: 'Diaphragm Innervation (Phrenic)', answer: 'C3, C4, C5', options: ['C3, C4, C5', 'C5, C6, C7', 'C7, C8, T1', 'L1, L2, L3', 'L4, L5, S1', 'S2, S3, S4'] },
  { id: 'n2', category: 'Nerve Root', prompt: 'Biceps Reflex', answer: 'C5, C6', options: ['C5, C6', 'C7, C8', 'L3, L4', 'S1, S2', 'C3, C4', 'T1, T2'] },
  { id: 'n3', category: 'Nerve Root', prompt: 'Triceps Reflex', answer: 'C7, C8', options: ['C5, C6', 'C7, C8', 'L3, L4', 'S1, S2', 'C3, C4', 'T1, T2'] },
  { id: 'n4', category: 'Nerve Root', prompt: 'Patellar Reflex', answer: 'L3, L4', options: ['C5, C6', 'C7, C8', 'L3, L4', 'S1, S2', 'L1, L2', 'L5, S1'] },
  { id: 'n5', category: 'Nerve Root', prompt: 'Achilles Reflex', answer: 'S1, S2', options: ['C5, C6', 'C7, C8', 'L3, L4', 'S1, S2', 'L1, L2', 'L5, S1'] },
  { id: 'n6', category: 'Nerve Root', prompt: 'Brachial Plexus', answer: 'C5-T1', options: ['C1-C4', 'C5-T1', 'T1-T12', 'L1-L4', 'L4-S4', 'S1-S5'] },
  { id: 'n7', category: 'Nerve Root', prompt: 'Lumbar Plexus', answer: 'L1-L4', options: ['C1-C4', 'C5-T1', 'T1-T12', 'L1-L4', 'L4-S4', 'S1-S5'] },
  { id: 'n8', category: 'Nerve Root', prompt: 'Sacral Plexus', answer: 'L4-S4', options: ['C1-C4', 'C5-T1', 'T1-T12', 'L1-L4', 'L4-S4', 'S1-S5'] },
  { id: 'n9', category: 'Nerve Root', prompt: 'Radial Nerve', answer: 'C5-T1', options: ['C5-T1', 'C5-C7', 'C8-T1', 'L2-L4', 'L4-S3', 'S1-S3'] },
  { id: 'n10', category: 'Nerve Root', prompt: 'Ulnar Nerve', answer: 'C8-T1', options: ['C5-T1', 'C5-C7', 'C8-T1', 'L2-L4', 'L4-S3', 'S1-S3'] },
  { id: 'n11', category: 'Nerve Root', prompt: 'Median Nerve', answer: 'C5-T1', options: ['C5-T1', 'C5-C7', 'C8-T1', 'L2-L4', 'L4-S3', 'S1-S3'] },
  { id: 'n12', category: 'Nerve Root', prompt: 'Sciatic Nerve', answer: 'L4-S3', options: ['C5-T1', 'C5-C7', 'C8-T1', 'L2-L4', 'L4-S3', 'S1-S3'] },
  { id: 'n13', category: 'Nerve Root', prompt: 'Femoral Nerve', answer: 'L2-L4', options: ['C5-T1', 'C5-C7', 'C8-T1', 'L2-L4', 'L4-S3', 'S1-S3'] },
];

// Helper to shuffle array
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
