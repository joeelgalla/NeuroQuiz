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
  { id: 'm1', category: 'Myotome', prompt: 'Digit Abduction', answer: 'C8, T1', options: ["C6","C5","T1","C8, T1","C8","C7"], image: '/drawings/Myotomes Final/Digit Abduction_ C8, T1.png' },
  { id: 'm2', category: 'Myotome', prompt: 'Digit Adduction', answer: 'C8, T1', options: ["C8, T1","C6-C8","C7","C5, C6","C5","C8"], image: '/drawings/Myotomes Final/Digit Adduction_ C8, T1.png' },
  { id: 'm3', category: 'Myotome', prompt: 'Digit Extension', answer: 'C7', options: ["C6-C8","C8","C8, T1","C5, C6","C7","T1"], image: '/drawings/Myotomes Final/Digit Extension_ C7.png' },
  { id: 'm4', category: 'Myotome', prompt: 'Digit Flexion', answer: 'C8', options: ["C6-C8","C6, C7","C5, C6","C8","C8, T1","C7"], image: '/drawings/Myotomes Final/Digit Flexion_ C8.png' },
  { id: 'm5', category: 'Myotome', prompt: 'Dorsiflexion', answer: 'L4, L5', options: ["L5, S1","L4, L5","L2, L3, L4","L5","S1, S2","L1, L2"], image: '/drawings/Myotomes Final/Dorsiflexion_ L4, L5.png' },
  { id: 'm6', category: 'Myotome', prompt: 'Elbow Extension', answer: 'C7', options: ["C6, C7","C5","T1","C6-C8","C7","C6"], image: '/drawings/Myotomes Final/Elbow Extension_ C7.png' },
  { id: 'm7', category: 'Myotome', prompt: 'Elbow Flexion', answer: 'C5, C6', options: ["C6, C7","C6","C8","C5","C8, T1","C5, C6"], image: '/drawings/Myotomes Final/Elbow Flexion_ C5, C6.png' },
  { id: 'm8', category: 'Myotome', prompt: 'Foot Eversion', answer: 'L5, S1', options: ["L1, L2","L2, L3, L4","S1, S2","L5","L4, L5","L5, S1"], image: '/drawings/Myotomes Final/Foot Eversion_ L5, S1.png' },
  { id: 'm9', category: 'Myotome', prompt: 'Foot Inversion', answer: 'L4, L5', options: ["L3, L4","S1, S2","L4, L5","L5, S1","L5","L2, L3, L4"], image: '/drawings/Myotomes Final/Foot Inversion_ L4, L5.png' },
  { id: 'm10', category: 'Myotome', prompt: 'Forearm Pronation', answer: 'C6, C7', options: ["C6, C7","C8","C6","C7","C8, T1","C5, C6"], image: '/drawings/Myotomes Final/Forearm Pronation_ C6, C7.png' },
  { id: 'm11', category: 'Myotome', prompt: 'Forearm Supination', answer: 'C6', options: ["C5","C8, T1","C6","C6-C8","C7","C6, C7"], image: '/drawings/Myotomes Final/Forearm Supination_ C6.png' },
  { id: 'm12', category: 'Myotome', prompt: 'Hip Abduction', answer: 'L5', options: ["L2, L3, L4","S1, S2","S1","L1, L2","L5, S1","L5"], image: '/drawings/Myotomes Final/Hip Abduction_ L5.png' },
  { id: 'm13', category: 'Myotome', prompt: 'Hip Adduction', answer: 'L2, L3, L4', options: ["L5, S1","S1, S2","L4, L5","L1, L2","L2, L3, L4","L5"], image: '/drawings/Myotomes Final/Hip Adduction_ L2, L3, L4.png' },
  { id: 'm14', category: 'Myotome', prompt: 'Hip Extension', answer: 'L5, S1', options: ["L5, S1","L5","L2, L3, L4","S1, S2","L3, L4","L1, L2"], image: '/drawings/Myotomes Final/Hip Extension_ L5, S1.png' },
  { id: 'm15', category: 'Myotome', prompt: 'Hip External Rotation', answer: 'L5, S1', options: ["L3, L4","L2, L3, L4","S1, S2","L5","L5, S1","L1, L2"], image: '/drawings/Myotomes Final/Hip External Rotation_ L5, S1.png' },
  { id: 'm16', category: 'Myotome', prompt: 'Hip Flexion', answer: 'L1, L2', options: ["L1, L2","L5","L4, L5","L3, L4","S1, S2","L2, L3, L4"], image: '/drawings/Myotomes Final/Hip Flexion_ L1, L2.png' },
  { id: 'm17', category: 'Myotome', prompt: 'Hip Internal Rotation', answer: 'L4, L5', options: ["L4, L5","L1, L2","L3, L4","L5, S1","L5","S1"], image: '/drawings/Myotomes Final/Hip Internal Rotation_ L4, L5.png' },
  { id: 'm18', category: 'Myotome', prompt: 'Knee Extension', answer: 'L3, L4', options: ["L2, L3, L4","L5, S1","L1, L2","L5","L3, L4","L4, L5"], image: '/drawings/Myotomes Final/Knee Extension_ L3, L4.png' },
  { id: 'm19', category: 'Myotome', prompt: 'Knee Flexion', answer: 'L5, S1', options: ["S1","L3, L4","L4, L5","L5","L5, S1","L1, L2"], image: '/drawings/Myotomes Final/Knee Flexion_ L5, S1.png' },
  { id: 'm20', category: 'Myotome', prompt: 'Plantarflexion', answer: 'S1', options: ["L1, L2","L3, L4","S1","L5","S1, S2","L2, L3, L4"], image: '/drawings/Myotomes Final/Plantarflexion_ S1.png' },
  { id: 'm21', category: 'Myotome', prompt: 'Shoulder Abduction', answer: 'C5', options: ["C5","T1","C6","C7","C8, T1","C5, C6"], image: '/drawings/Myotomes Final/Shoulder Abduction_ C5.png' },
  { id: 'm22', category: 'Myotome', prompt: 'Shoulder Adduction', answer: 'C6-C8', options: ["C8, T1","C6-C8","T1","C8","C7","C6"], image: '/drawings/Myotomes Final/Shoulder Adduction_ C6-C8.png' },
  { id: 'm23', category: 'Myotome', prompt: 'Shoulder External Rotation', answer: 'C5, C6', options: ["C8, T1","C8","C5, C6","C6","T1","C5"], image: '/drawings/Myotomes Final/Shoulder External Rotation_ C5, C6.png' },
  { id: 'm24', category: 'Myotome', prompt: 'Shoulder Internal Rotation', answer: 'C6-C8', options: ["C5","C6","C6-C8","C8, T1","C5, C6","C7"], image: '/drawings/Myotomes Final/Shoulder Internal Rotation_ C6-C8.png' },
  { id: 'm25', category: 'Myotome', prompt: 'Toe Flexion (Big Toe Only)', answer: 'S1', options: ["S1","L3, L4","L4, L5","L2, L3, L4","L5","S1, S2"], image: '/drawings/Myotomes Final/Toe Flexion (Big Toe Only)_ S1.png' },
  { id: 'm26', category: 'Myotome', prompt: 'Wrist Extension', answer: 'C7', options: ["C5, C6","C8","C7","C6-C8","C6, C7","C6"], image: '/drawings/Myotomes Final/Wrist Extension_ C7.png' },
  { id: 'm27', category: 'Myotome', prompt: 'Wrist Flexion', answer: 'C7', options: ["C5","C6, C7","C5, C6","C7","C6-C8","C6"], image: '/drawings/Myotomes Final/Wrist Flexion_ C7.png' },
  { id: 'm28', category: 'Myotome', prompt: 'Toe Extension (All Toes)', answer: 'L5', options: ["L4, L5","L5","S1","S1, S2","L2, L3, L4","L5, S1"], image: 'placeholder' },
  { id: 'm29', category: 'Myotome', prompt: 'Toe Flexion (All Toes)', answer: 'S1, S2', options: ["L4, L5","L5","S1","S1, S2","L2, L3, L4","L5, S1"], image: 'placeholder' },
  { id: 'd28', category: 'Dermatome', prompt: 'Anterior shoulder/clavicle area', answer: 'C4', options: ["C4","C5","C6","C7","C8","T1"], image: '/drawings/Dermatomes Final/Anterior/AArmC4.png' },
  { id: 'd29', category: 'Dermatome', prompt: 'Anterior lateral upper arm', answer: 'C5', options: ["C4","C5","C6","C7","C8","T1"], image: '/drawings/Dermatomes Final/Anterior/AArmC5.png' },
  { id: 'd30', category: 'Dermatome', prompt: 'Anterior lateral forearm and thumb', answer: 'C6', options: ["C4","C5","C6","C7","C8","T1"], image: '/drawings/Dermatomes Final/Anterior/AArmC6.png' },
  { id: 'd31', category: 'Dermatome', prompt: 'Anterior middle finger', answer: 'C7', options: ["C4","C5","C6","C7","C8","T1"], image: '/drawings/Dermatomes Final/Anterior/AArmC7.png' },
  { id: 'd32', category: 'Dermatome', prompt: 'Anterior medial hand and little finger', answer: 'C8', options: ["C4","C5","C6","C7","C8","T1"], image: '/drawings/Dermatomes Final/Anterior/AArmC8.png' },
  { id: 'd33', category: 'Dermatome', prompt: 'Anterior medial forearm', answer: 'T1', options: ["C4","C5","C6","C7","C8","T1"], image: '/drawings/Dermatomes Final/Anterior/AArmT1.png' },
  { id: 'd34', category: 'Dermatome', prompt: 'Anterior medial upper arm / axilla', answer: 'T2', options: ["C4","C5","C6","C7","C8","T2"], image: '/drawings/Dermatomes Final/Anterior/AArmT2.png' },
  { id: 'd35', category: 'Dermatome', prompt: 'Anterior superior medial thigh (inguinal)', answer: 'L1', options: ["L1","L2","L3","L4","L5","S1"], image: '/drawings/Dermatomes Final/Anterior/ALegL1.png' },
  { id: 'd36', category: 'Dermatome', prompt: 'Anterior middle thigh', answer: 'L2', options: ["L1","L2","L3","L4","L5","S1"], image: '/drawings/Dermatomes Final/Anterior/ALegL2.png' },
  { id: 'd37', category: 'Dermatome', prompt: 'Anterior knee and medial thigh', answer: 'L3', options: ["L1","L2","L3","L4","L5","S1"], image: '/drawings/Dermatomes Final/Anterior/ALegL3.png' },
  { id: 'd38', category: 'Dermatome', prompt: 'Anterior medial leg, medial malleolus', answer: 'L4', options: ["L1","L2","L3","L4","L5","S1"], image: '/drawings/Dermatomes Final/Anterior/ALegL4.png' },
  { id: 'd39', category: 'Dermatome', prompt: 'Anterior lateral leg, dorsum of foot', answer: 'L5', options: ["L1","L2","L3","L4","L5","S1"], image: '/drawings/Dermatomes Final/Anterior/ALegL5.png' },
  { id: 'd40', category: 'Dermatome', prompt: 'Anterior lateral foot', answer: 'S1', options: ["L1","L2","L3","L4","L5","S1"], image: '/drawings/Dermatomes Final/Anterior/ALegS1.png' },
  { id: 'd41', category: 'Dermatome', prompt: 'Posterior shoulder/superior scapula', answer: 'C4', options: ["C4","C5","C6","C7","C8","T1"], image: '/drawings/Dermatomes Final/Posterior/PArmC4.png' },
  { id: 'd42', category: 'Dermatome', prompt: 'Posterior lateral upper arm', answer: 'C5', options: ["C4","C5","C6","C7","C8","T1"], image: '/drawings/Dermatomes Final/Posterior/PArmC5.png' },
  { id: 'd43', category: 'Dermatome', prompt: 'Posterior lateral forearm and dorsal thumb', answer: 'C6', options: ["C4","C5","C6","C7","C8","T1"], image: '/drawings/Dermatomes Final/Posterior/PArmC6.png' },
  { id: 'd44', category: 'Dermatome', prompt: 'Dorsal middle finger', answer: 'C7', options: ["C4","C5","C6","C7","C8","T1"], image: '/drawings/Dermatomes Final/Posterior/PArmC7.png' },
  { id: 'd45', category: 'Dermatome', prompt: 'Dorsal medial hand and little finger', answer: 'C8', options: ["C4","C5","C6","C7","C8","T1"], image: '/drawings/Dermatomes Final/Posterior/PArmC8.png' },
  { id: 'd46', category: 'Dermatome', prompt: 'Posterior medial forearm', answer: 'T1', options: ["C4","C5","C6","C7","C8","T1"], image: '/drawings/Dermatomes Final/Posterior/PArmT1.png' },
  { id: 'd47', category: 'Dermatome', prompt: 'Posterior medial upper arm / axilla', answer: 'T2', options: ["C4","C5","C6","C7","C8","T2"], image: '/drawings/Dermatomes Final/Posterior/PArmT2.png' },
  { id: 'd48', category: 'Dermatome', prompt: 'Upper lateral gluteal area', answer: 'L1', options: ["L1","L2","L3","L4","L5","S1"], image: '/drawings/Dermatomes Final/Posterior/PLeg L1.png' },
  { id: 'd49', category: 'Dermatome', prompt: 'Middle gluteal area', answer: 'L2', options: ["L1","L2","L3","L4","L5","S1"], image: '/drawings/Dermatomes Final/Posterior/PLeg L2.png' },
  { id: 'd50', category: 'Dermatome', prompt: 'Lower gluteal area / superior medial thigh', answer: 'L3', options: ["L1","L2","L3","L4","L5","S1"], image: '/drawings/Dermatomes Final/Posterior/PLeg L3.png' },
  { id: 'd51', category: 'Dermatome', prompt: 'Medial aspect of posterior leg (calf)', answer: 'L4', options: ["L1","L2","L3","L4","L5","S1"], image: '/drawings/Dermatomes Final/Posterior/PLeg L4.png' },
  { id: 'd52', category: 'Dermatome', prompt: 'Posterior lateral thigh and popliteal fossa', answer: 'L5', options: ["L1","L2","L3","L4","L5","S1"], image: '/drawings/Dermatomes Final/Posterior/PLeg L5 Part 1.png' },
  { id: 'd53', category: 'Dermatome', prompt: 'Posterior lateral leg (calf) and heel', answer: 'L5', options: ["L1","L2","L3","L4","L5","S1"], image: '/drawings/Dermatomes Final/Posterior/PLeg L5 Part 2.png' },
  { id: 'd54', category: 'Dermatome', prompt: 'Posterior lateral leg, heel, lateral border of foot', answer: 'S1', options: ["L1","L2","L3","L4","L5","S1"], image: '/drawings/Dermatomes Final/Posterior/PLeg S1.png' },
  { id: 'd55', category: 'Dermatome', prompt: 'Posterior medial thigh and upper leg', answer: 'S2', options: ["L1","L2","L3","L4","L5","S2"], image: '/drawings/Dermatomes Final/Posterior/PLeg S2.png' },
  { id: 'd56', category: 'Dermatome', prompt: 'Medial gluteal fold / upper perineum', answer: 'S3', options: ["L1","L2","L3","L4","L5","S3"], image: '/drawings/Dermatomes Final/Posterior/PLeg S3.png' },
  { id: 'd57', category: 'Dermatome', prompt: 'Perineum', answer: 'S4', options: ["L1","L2","L3","L4","L5","S4"], image: '/drawings/Dermatomes Final/Posterior/PLeg S4.png' },
  { id: 'd58', category: 'Dermatome', prompt: 'Perianal', answer: 'S5', options: ["L1","L2","L3","L4","L5","S5"], image: '/drawings/Dermatomes Final/Posterior/PLeg S5.png' },

  // Brain Regions
  { id: 'b1', category: 'Brain Region', prompt: 'Executive Function & Motor Control', answer: 'Frontal Lobe', options: ['Frontal Lobe', 'Parietal Lobe', 'Temporal Lobe', 'Occipital Lobe', 'Cerebellum', 'Brainstem'], image: 'placeholder' },
  { id: 'b2', category: 'Brain Region', prompt: 'Somatosensory Processing', answer: 'Parietal Lobe', options: ['Frontal Lobe', 'Parietal Lobe', 'Temporal Lobe', 'Occipital Lobe', 'Cerebellum', 'Brainstem'], image: 'placeholder' },
  { id: 'b3', category: 'Brain Region', prompt: 'Auditory Processing & Memory', answer: 'Temporal Lobe', options: ['Frontal Lobe', 'Parietal Lobe', 'Temporal Lobe', 'Occipital Lobe', 'Cerebellum', 'Brainstem'], image: 'placeholder' },
  { id: 'b4', category: 'Brain Region', prompt: 'Visual Processing', answer: 'Occipital Lobe', options: ['Frontal Lobe', 'Parietal Lobe', 'Temporal Lobe', 'Occipital Lobe', 'Cerebellum', 'Brainstem'], image: 'placeholder' },
  { id: 'b5', category: 'Brain Region', prompt: 'Coordination & Balance', answer: 'Cerebellum', options: ['Frontal Lobe', 'Parietal Lobe', 'Temporal Lobe', 'Occipital Lobe', 'Cerebellum', 'Brainstem'], image: 'placeholder' },
  { id: 'b6', category: 'Brain Region', prompt: 'Autonomic Functions (Breathing, HR)', answer: 'Brainstem', options: ['Frontal Lobe', 'Parietal Lobe', 'Temporal Lobe', 'Occipital Lobe', 'Cerebellum', 'Brainstem'], image: 'placeholder' },
  { id: 'b7', category: 'Brain Region', prompt: 'Relay Station for Sensory Info', answer: 'Thalamus', options: ['Thalamus', 'Hypothalamus', 'Amygdala', 'Hippocampus', 'Basal Ganglia', 'Pons'], image: 'placeholder' },
  { id: 'b8', category: 'Brain Region', prompt: 'Homeostasis & Endocrine Control', answer: 'Hypothalamus', options: ['Thalamus', 'Hypothalamus', 'Amygdala', 'Hippocampus', 'Basal Ganglia', 'Pons'], image: 'placeholder' },
  { id: 'b9', category: 'Brain Region', prompt: 'Emotion & Fear Processing', answer: 'Amygdala', options: ['Thalamus', 'Hypothalamus', 'Amygdala', 'Hippocampus', 'Basal Ganglia', 'Pons'], image: 'placeholder' },
  { id: 'b10', category: 'Brain Region', prompt: 'Memory Formation', answer: 'Hippocampus', options: ['Thalamus', 'Hypothalamus', 'Amygdala', 'Hippocampus', 'Basal Ganglia', 'Pons'], image: 'placeholder' },
  { id: 'b11', category: 'Brain Region', prompt: 'Movement Regulation', answer: 'Basal Ganglia', options: ['Thalamus', 'Hypothalamus', 'Amygdala', 'Hippocampus', 'Basal Ganglia', 'Pons'], image: 'placeholder' },
  { id: 'b12', category: 'Brain Region', prompt: 'Connects Hemispheres', answer: 'Corpus Callosum', options: ['Corpus Callosum', 'Hypothalamus', 'Amygdala', 'Hippocampus', 'Basal Ganglia', 'Pons'], image: 'placeholder' },

  // Nerve Roots / Plexus
  { id: 'n1', category: 'Nerve Root', prompt: 'Diaphragm Innervation (Phrenic)', answer: 'C3, C4, C5', options: ['C3, C4, C5', 'C5, C6, C7', 'C7, C8, T1', 'L1, L2, L3', 'L4, L5, S1', 'S2, S3, S4'], image: 'placeholder' },
  { id: 'n2', category: 'Nerve Root', prompt: 'Biceps Reflex', answer: 'C5, C6', options: ['C5, C6', 'C7, C8', 'L3, L4', 'S1, S2', 'C3, C4', 'T1, T2'], image: 'placeholder' },
  { id: 'n3', category: 'Nerve Root', prompt: 'Triceps Reflex', answer: 'C7, C8', options: ['C5, C6', 'C7, C8', 'L3, L4', 'S1, S2', 'C3, C4', 'T1, T2'], image: 'placeholder' },
  { id: 'n4', category: 'Nerve Root', prompt: 'Patellar Reflex', answer: 'L3, L4', options: ['C5, C6', 'C7, C8', 'L3, L4', 'S1, S2', 'L1, L2', 'L5, S1'], image: 'placeholder' },
  { id: 'n5', category: 'Nerve Root', prompt: 'Achilles Reflex', answer: 'S1, S2', options: ['C5, C6', 'C7, C8', 'L3, L4', 'S1, S2', 'L1, L2', 'L5, S1'], image: 'placeholder' },
  { id: 'n6', category: 'Nerve Root', prompt: 'Brachial Plexus', answer: 'C5-T1', options: ['C1-C4', 'C5-T1', 'T1-T12', 'L1-L4', 'L4-S4', 'S1-S5'], image: 'placeholder' },
  { id: 'n7', category: 'Nerve Root', prompt: 'Lumbar Plexus', answer: 'L1-L4', options: ['C1-C4', 'C5-T1', 'T1-T12', 'L1-L4', 'L4-S4', 'S1-S5'], image: 'placeholder' },
  { id: 'n8', category: 'Nerve Root', prompt: 'Sacral Plexus', answer: 'L4-S4', options: ['C1-C4', 'C5-T1', 'T1-T12', 'L1-L4', 'L4-S4', 'S1-S5'], image: 'placeholder' },
  { id: 'n9', category: 'Nerve Root', prompt: 'Radial Nerve', answer: 'C5-T1', options: ['C5-T1', 'C5-C7', 'C8-T1', 'L2-L4', 'L4-S3', 'S1-S3'], image: 'placeholder' },
  { id: 'n10', category: 'Nerve Root', prompt: 'Ulnar Nerve', answer: 'C8-T1', options: ['C5-T1', 'C5-C7', 'C8-T1', 'L2-L4', 'L4-S3', 'S1-S3'], image: 'placeholder' },
  { id: 'n11', category: 'Nerve Root', prompt: 'Median Nerve', answer: 'C5-T1', options: ['C5-T1', 'C5-C7', 'C8-T1', 'L2-L4', 'L4-S3', 'S1-S3'], image: 'placeholder' },
  { id: 'n12', category: 'Nerve Root', prompt: 'Sciatic Nerve', answer: 'L4-S3', options: ['C5-T1', 'C5-C7', 'C8-T1', 'L2-L4', 'L4-S3', 'S1-S3'], image: 'placeholder' },
  { id: 'n13', category: 'Nerve Root', prompt: 'Femoral Nerve', answer: 'L2-L4', options: ['C5-T1', 'C5-C7', 'C8-T1', 'L2-L4', 'L4-S3', 'S1-S3'], image: 'placeholder' },
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
