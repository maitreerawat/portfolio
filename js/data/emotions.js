/**
 * Anatomical Brain Regions, Distinct Neuron Morphologies, Cranial/Motor Expressions & Human Experience
 * Canonically aligned to the 3D MRI Cortical Scan
 */

export const EMOTIONS = [
  {
    id: 'resting',
    name: 'All Circuits',
    heading: 'The Human Mind',
    regionName: 'Whole-Brain Resting Network · Front to Back',
    neuronType: '',
    neuronSimpleDesc: '',
    bodyPrimary:
      'The human mind is an ocean of eighty-six billion brain cells constantly talking to one another. Every memory you keep, every sudden hunch, and every emotion you feel begins as tiny electrical signals traveling from cell to cell.',
    bodySomatic:
      'On the right, you are looking at a live 3D electrical-signals view of the human mind, traced from a real MRI scan. You can drag anywhere on the brain to rotate it 360° and hover over the pathways to gently bring nearby brain cells into focus.',
    bodySecondary:
      'Along the bottom are core human emotions: Empathy, Wonder, Joy, Vulnerability, Memory, Imagination, and Grief. Select any emotion below to light up its pathway, see the unique microscopic brain cell inside that region, and read how that feeling shows up in your eyes, lips, breath, and hands.',
    color: '#0284c7',
    secondaryColor: '#4f46e5',
    hex: 0x0284c7,
    firingSpeed: 1.0,
    loci: [
      { x: -0.35, y: 0.48, z: 0.95, radius: 0.85 },
      { x: 0.35, y: 0.48, z: 0.95, radius: 0.85 },
      { x: 0.0, y: 0.42, z: -1.05, radius: 0.95 }
    ],
    cameraMacro: { x: 2.35, y: 0.65, z: 2.65, target: { x: 0, y: 0.05, z: 0 } }
  },
  {
    id: 'empathy',
    name: 'Empathy',
    heading: 'Empathy',
    regionName: 'Side & Front Fold of the Brain · Anterior Insula',
    neuronType: 'Spindle Neuron (Von Economo Cell)',
    neuronSimpleDesc:
      'Unlike most brain cells that look like tangled trees, this rare neuron is shaped like a sleek, straight express highway, allowing your brain to feel someone else’s pain or relief in a fraction of a second.',
    bodyPrimary:
      'When you feel empathy, like when someone’s voice cracks and your own chest tightens, this side fold of your brain lights up using fast spindle cells found only in deeply social animals like humans, whales, and elephants.',
    bodySomatic:
      'In your body, your pupils widen to take in the other person’s face, your eyebrows soften, and your lips part slightly as you unconsciously mirror what they are going through. Your hands naturally unclench and reach out to comfort them before you even think about it.',
    bodySecondary:
      'Your brain doesn’t just watch someone else’s pain or relief from the outside. It briefly feels a gentle echo of it inside your own body so you know how to care for them.',
    color: '#e11d48',
    secondaryColor: '#0284c7',
    hex: 0xe11d48,
    firingSpeed: 1.45,
    loci: [
      { x: -0.82, y: 0.12, z: 0.42, radius: 0.68 },
      { x: 0.82, y: 0.12, z: 0.42, radius: 0.68 },
      { x: -0.68, y: 0.38, z: 0.72, radius: 0.58 }
    ],
    cameraMacro: { x: -2.45, y: 0.55, z: 2.15, target: { x: -0.35, y: 0.1, z: 0.25 } }
  },
  {
    id: 'wonder',
    name: 'Wonder',
    heading: 'Wonder',
    regionName: 'Upper Front of the Brain · Prefrontal Cortex',
    neuronType: 'Pyramid Crown Neuron (Layer V Pyramidal Cell)',
    neuronSimpleDesc:
      'Shaped like a tall tree with a triangular base and a wide, open crown at the top, built to gather sight, sound, and curiosity from across the whole brain at once.',
    bodyPrimary:
      'When you feel wonder or awe, whether looking up at a night sky, hearing music that gives you chills, or discovering a big idea, the upper front of your brain fires these tall tree-shaped cells to take in something bigger than yourself.',
    bodySomatic:
      'In your body, your pupils open wide to let in as much light and detail as possible, and you almost stop blinking. Your lips part in a quiet, slow breath, goosebumps rise on your arms, and your hands go completely still as you take the moment in.',
    bodySecondary:
      'Wonder quiets down everyday worry and chatter in the brain, opening up fresh connections so you can learn and see the world in a new way.',
    color: '#4f46e5',
    secondaryColor: '#0284c7',
    hex: 0x4f46e5,
    firingSpeed: 1.65,
    loci: [
      { x: -0.45, y: 0.58, z: 1.12, radius: 0.72 },
      { x: 0.45, y: 0.58, z: 1.12, radius: 0.72 },
      { x: 0.0, y: 0.72, z: 0.95, radius: 0.68 }
    ],
    cameraMacro: { x: 1.85, y: 1.05, z: 2.75, target: { x: 0, y: 0.35, z: 0.55 } }
  },
  {
    id: 'joy',
    name: 'Joy',
    heading: 'Joy',
    regionName: 'Deep Front Reward Center · Ventral Striatum',
    neuronType: 'Starburst Dopamine Neuron (Medium Spiny Cell)',
    neuronSimpleDesc:
      'Shaped like a radiant 8-pointed star covered in tiny glowing buds, reaching out in every direction to catch waves of dopamine and turn them into warmth and laughter.',
    bodyPrimary:
      'When you feel real joy, that sudden rush of lightness and effortless laughter, star-shaped cells deep inside the front center of your brain light up with dopamine and send a warm wave of energy across your mind.',
    bodySomatic:
      'Unlike a polite, fake smile that only moves your mouth, real joy automatically crinkles the outer corners of your eyes and lifts your cheeks. Your voice gets warmer and brighter, your shoulders relax, and your hands start moving and gesturing as you share the moment.',
    bodySecondary:
      'Joy gives your whole nervous system a burst of energy, making you want to connect, play, and share good things with the people around you.',
    color: '#d97706',
    secondaryColor: '#ea580c',
    hex: 0xd97706,
    firingSpeed: 1.85,
    loci: [
      { x: -0.36, y: -0.04, z: 0.52, radius: 0.62 },
      { x: 0.36, y: -0.04, z: 0.52, radius: 0.62 },
      { x: 0.0, y: 0.22, z: 0.88, radius: 0.64 }
    ],
    cameraMacro: { x: 2.15, y: 0.35, z: 2.55, target: { x: 0.05, y: 0.0, z: 0.35 } }
  },
  {
    id: 'vulnerability',
    name: 'Vulnerability',
    heading: 'Vulnerability',
    regionName: 'Deep Emotional Center & Front Bridge · Amygdala',
    neuronType: 'Alarm & Calming Neuron Pair (Amygdala-Prefrontal Dyad)',
    neuronSimpleDesc:
      'Shows two brain cells working together: a fast-firing alarm cell on the left that spots emotional risk, and a calming cell on the right that wraps gentle branches around it so you can stay brave and open.',
    bodyPrimary:
      'When you feel vulnerable, like when you are about to say something deeply honest or admit how much you care, a tiny almond-shaped alarm center deep in your brain fires in milliseconds because being truly seen feels risky.',
    bodySomatic:
      'In your body, your eyes naturally dart between holding someone’s gaze and looking away for a second to catch your breath. Your throat and lips might feel a little dry or shaky, and your hands often touch your own chest or fold together while you summon the courage to speak.',
    bodySecondary:
      'Bravery is not the absence of that inner alarm. It happens when the front of your brain sends a calming signal to hold that nervousness gently so you can stay honest and open anyway.',
    color: '#dc2626',
    secondaryColor: '#e11d48',
    hex: 0xdc2626,
    firingSpeed: 2.1,
    loci: [
      { x: -0.52, y: -0.24, z: 0.26, radius: 0.56 },
      { x: 0.52, y: -0.24, z: 0.26, radius: 0.56 }
    ],
    cameraMacro: { x: -2.25, y: -0.15, z: 2.35, target: { x: -0.25, y: -0.15, z: 0.15 } }
  },
  {
    id: 'memory',
    name: 'Memory & Longing',
    heading: 'Memory & Longing',
    regionName: 'Deep Middle & Back of the Brain · Hippocampus',
    neuronType: 'Seahorse Memory Loop Neuron (Hippocampal Mossy-Fiber Cell)',
    neuronSimpleDesc:
      'Has a cone of listening branches on the left and a long, sweeping C-shaped cable studded with “memory pearls” that unlocks old sights, voices, and feelings stored years ago.',
    bodyPrimary:
      'When you feel nostalgia or longing, like when a single song or familiar smell brings back a whole chapter of your life, a seahorse-shaped part deep in your brain wakes up and replays those stored moments.',
    bodySomatic:
      'As your mind pictures that memory, your eyes naturally drift upward or to the side as if looking at an invisible photograph. Your lips often form a quiet, bittersweet half-smile, holding both warmth and missing someone at the same time, while your hands relax.',
    bodySecondary:
      'Memories aren’t frozen files locked in a vault. Every time you remember a person or place you love, your brain gently blends that old moment with who you are today.',
    color: '#7c3aed',
    secondaryColor: '#4f46e5',
    hex: 0x7c3aed,
    firingSpeed: 1.25,
    loci: [
      { x: -0.68, y: -0.15, z: -0.58, radius: 0.72 },
      { x: 0.68, y: -0.15, z: -0.58, radius: 0.72 },
      { x: 0.0, y: 0.25, z: -0.92, radius: 0.68 }
    ],
    cameraMacro: { x: 2.35, y: 0.15, z: -1.95, target: { x: 0.25, y: -0.05, z: -0.45 } }
  },
  {
    id: 'imagination',
    name: 'Imagination & Intuition',
    heading: 'Imagination & Intuition',
    regionName: 'Back of the Brain · Visual Mind’s Eye & Cerebellum',
    neuronType: 'Coral-Fan Neuron (Cerebellar Purkinje Cell)',
    neuronSimpleDesc:
      'The most intricately branched cell in the human body, shaped like a giant sea-fan coral with 150,000 tiny branches that catch thousands of faint hunches at once and weave them into a sudden “aha” moment.',
    bodyPrimary:
      'When you feel a sudden spark of imagination or a gut intuition, picturing something that doesn’t exist yet or just knowing the answer before you can explain why, the back of your brain lights up with coral-shaped cells that connect thousands of tiny clues at once.',
    bodySomatic:
      'When you picture an idea inside your head, your eyelids often half-close or look into the distance so outside distractions fade away. Your mouth goes quiet in focus, and your hands often sketch in the air or start building before you even find the words.',
    bodySecondary:
      'Intuition isn’t magic. It is the back of your brain quietly weaving together everything you have ever seen, felt, and learned into a brand-new idea.',
    color: '#9333ea',
    secondaryColor: '#6366f1',
    hex: 0x9333ea,
    firingSpeed: 1.55,
    loci: [
      { x: -0.35, y: 0.32, z: -1.22, radius: 0.78 },
      { x: 0.35, y: 0.32, z: -1.22, radius: 0.78 },
      { x: 0.0, y: -0.25, z: -1.18, radius: 0.74 }
    ],
    cameraMacro: { x: -1.85, y: 0.35, z: -2.65, target: { x: 0.0, y: 0.1, z: -0.85 } }
  },
  {
    id: 'grief',
    name: 'Grief & Healing',
    heading: 'Grief & Healing',
    regionName: 'Deep Heartache Center & Lower Brainstem · Vagal Pathway',
    neuronType: 'Soothing Vagal Willow Neuron (Parasympathetic Pacemaker Cell)',
    neuronSimpleDesc:
      'Shaped like a gentle weeping willow whose long, flowing branches reach all the way from the base of the brain down to your heart and lungs to slow your pulse and guide a deep, healing exhale.',
    bodyPrimary:
      'When you feel grief or heartbreak, it lights up the exact same part of the brain as physical pain. That heavy ache in your chest is your brain searching for someone or something it deeply loves.',
    bodySomatic:
      'To help you heal, willow-shaped cells at the base of your brain send soothing signals down to your chest: warm tears well up in your eyes to release stress, your lower lip may tremble, and a deep sigh or exhale slowly softens the tightness in your throat while your hands rest over your heart.',
    bodySecondary:
      'Crying and exhaling are not signs of weakness. They are how your brain slowly calms the body and turns the pain of loss into lasting love and memory.',
    color: '#059669',
    secondaryColor: '#0284c7',
    hex: 0x059669,
    firingSpeed: 0.9,
    loci: [
      { x: 0.0, y: 0.12, z: 0.78, radius: 0.65 },
      { x: -0.28, y: -0.38, z: -0.92, radius: 0.68 },
      { x: 0.28, y: -0.38, z: -0.92, radius: 0.68 }
    ],
    cameraMacro: { x: -1.95, y: 0.45, z: -2.15, target: { x: 0.0, y: -0.15, z: -0.45 } }
  }
];
