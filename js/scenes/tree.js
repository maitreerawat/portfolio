/**
 * Act III: The Living Tree of Consciousness & Emotion
 * Handles interactive leaf node awakening, memories, and spring physics
 */

export function initTreeScene() {
  const leaves = document.querySelectorAll('.leaf-node');
  const memoryDisplay = document.getElementById('memory-display');
  const memoryTag = document.getElementById('memory-tag');
  const memoryText = document.getElementById('memory-text');

  if (!memoryDisplay || !memoryTag || !memoryText) return;

  // Emotional Leaf Database
  const emotionMemories = {
    'Wonder': {
      tag: '✦ Leaf of Wonder',
      color: '#fef08a',
      text: 'The awe of looking up at the night sky and feeling infinitely small, yet deeply and miraculously alive.'
    },
    'Empathy': {
      tag: '💛 Leaf of Radical Empathy',
      color: '#38bdf8',
      text: 'The quiet superpower: feeling another human being\'s heartbeat inside your own chest, without judgment.'
    },
    'Grief': {
      tag: '💧 Leaf of Grief & Healing',
      color: '#fb7185',
      text: 'The sacred price of having loved deeply. An echo that carves space in the human soul for boundless compassion.'
    },
    'Joy': {
      tag: '☀️ Leaf of Unfiltered Joy',
      color: '#34d399',
      text: 'Sunlight breaking through the canopy without reason, debt, or apology. Sudden, uncontained laughter.'
    },
    'Vulnerability': {
      tag: '🌱 Leaf of Vulnerability',
      color: '#fbbf24',
      text: 'The courage to stand unarmed in the presence of another. The birthplace of true intimacy and connection.'
    },
    'Longing': {
      tag: '🕊️ Leaf of Longing',
      color: '#a78bfa',
      text: 'A nostalgic ache for a home we have never seen, pulling us forward into art, science, and discovery.'
    },
    'Hope': {
      tag: '🌿 Leaf of Hope',
      color: '#38bdf8',
      text: 'Planting a seed in a garden we know we may never sit beneath. Believing humanity is worth fighting for.'
    },
    'Connection': {
      tag: '🤝 Leaf of Human Connection',
      color: '#f472b6',
      text: 'The revelation that we were never solitary islands in the sea, but branches of the exact same tree.'
    },
    'Courage': {
      tag: '🔥 Leaf of Quiet Courage',
      color: '#facc15',
      text: 'The small voice at the end of the day that whispers: I will try again tomorrow.'
    }
  };

  window.awakenLeaf = function(emotionKey) {
    const memory = emotionMemories[emotionKey];
    if (!memory) return;

    if (window.gsap) {
      gsap.to(memoryDisplay, {
        opacity: 0.35,
        scale: 0.97,
        duration: 0.15,
        onComplete: () => {
          memoryTag.innerText = memory.tag;
          memoryTag.style.color = memory.color;
          memoryText.innerText = `"${memory.text}"`;
          gsap.to(memoryDisplay, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "back.out(1.5)"
          });
        }
      });
    } else {
      memoryTag.innerText = memory.tag;
      memoryTag.style.color = memory.color;
      memoryText.innerText = `"${memory.text}"`;
    }
  };

  // Attach event listeners to all leaf nodes
  leaves.forEach(leaf => {
    const emotion = leaf.getAttribute('data-emotion');
    if (emotion) {
      leaf.addEventListener('mouseenter', () => window.awakenLeaf(emotion));
      leaf.addEventListener('click', () => window.awakenLeaf(emotion));
    }
  });
}

