import { ServiceItem, TestimonialItem, ResourceArticle } from '../types';

export const PRACTICE_INFO = {
  name: 'Haven & Hearth Psychology',
  clinician: 'Dr. Elena Vance, Psy.D.',
  title: 'Licensed Clinical Psychologist',
  license: 'California License #PSY32918',
  tagline: 'A safe, grounded space to be heard, heal, and grow.',
  bioSummary: 'Over 14 years supporting high-achieving adults, couples, and individuals navigating anxiety, developmental trauma, and burnout with deep warmth and evidence-based science.',
  phone: '(415) 890-4288',
  email: 'hello@havenandhearthpsych.com',
  address: {
    street: '450 Sutter Street, Suite 1420',
    city: 'San Francisco',
    state: 'CA',
    zip: '94108',
    neighborhood: 'Union Square Medical Building',
    notes: 'Direct elevator access. 2 blocks from Powell St BART/Muni. Valet & garage parking across the street.'
  },
  hours: 'Monday – Thursday: 8:30 AM – 6:00 PM | Friday: 9:00 AM – 2:00 PM (Telehealth only)',
  fees: {
    discoveryCall: { name: '15-Minute Discovery Call', fee: '$0', duration: '15 min', note: 'Complimentary phone or video consult' },
    intake: { name: 'Initial Clinical Intake', fee: '$240', duration: '75 min', note: 'Comprehensive history & collaborative roadmap' },
    individual: { name: 'Individual Psychotherapy', fee: '$195', duration: '50 min', note: 'Weekly or bi-weekly session' },
    couples: { name: 'Couples / Relationship Therapy', fee: '$230', duration: '60 min', note: 'Gottman & Emotionally Focused principles' }
  }
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'anxiety-panic',
    title: 'Anxiety, Panic & Chronic Worry',
    category: 'anxiety',
    iconName: 'ShieldAlert',
    badge: 'Specialty Focus',
    shortDescription: 'Break free from the exhausting loop of catastrophic thinking, physical tension, and racing thoughts.',
    detailedDescription: 'When anxiety takes the wheel, your nervous system is working overtime trying to protect you. We won\'t tell you to "just stop worrying." Instead, we gently map the roots of your anxiety, soothe somatic dysregulation, and rebuild real psychological flexibility.',
    whoItIsFor: [
      'You experience relentless "what-if" thoughts or worst-case scenario spirals',
      'You deal with chest tightness, shallow breathing, or sudden panic surges',
      'You feel high-functioning on the outside, but jittery and terrified of failure inside',
      'Social situations or important presentations trigger overwhelming dread'
    ],
    whatWeDo: [
      'Nervous system down-regulation through somatic grounding & vagus nerve techniques',
      'Acceptance & Commitment Therapy (ACT) to unhook from obsessive thought loops',
      'Gradual, compassionate exposure to restore confidence without overwhelm',
      'Rewiring perfectionism into healthy, values-aligned striving'
    ],
    modalities: ['ACT (Acceptance & Commitment)', 'CBT', 'Somatic Experiencing principles', 'Heart-Rate Variability Awareness'],
    sessionLength: '50 minutes',
    rate: '$195 / session'
  },
  {
    id: 'trauma-emdr',
    title: 'Trauma Recovery & EMDR',
    category: 'trauma',
    iconName: 'Sparkles',
    badge: 'Evidence-Based',
    shortDescription: 'Process painful memories, childhood emotional neglect, or single-incident shocks so the past stays in the past.',
    detailedDescription: 'Trauma isn\'t just what happened to you—it is what happens inside your body in the absence of an empathetic witness. Using EMDR and somatic therapies, we help your brain reprocess stuck distressing memories into resolved wisdom, restoring safety in your own skin.',
    whoItIsFor: [
      'You feel haunted by past relational wounds, childhood criticism, or sudden loss',
      'Certain sounds, tones of voice, or conflicts trigger intense freeze or fight reactions',
      'You struggle with deep-seated beliefs like "I am not safe" or "It was my fault"',
      'You feel emotionally numb, disconnected, or perpetually hypervigilant'
    ],
    whatWeDo: [
      'Extensive phase-one resourcing and building emotional stabilization tools',
      'Bilateral stimulation (eye movements or gentle hand tappers) with EMDR protocol',
      'Compassion-Focused Therapy to dissolve protective shame and guilt',
      'Integrating nervous system safety so you can feel present in today\'s life'
    ],
    modalities: ['EMDR (Eye Movement Desensitization)', 'Internal Family Systems (IFS) concepts', 'Somatic Trauma Work'],
    sessionLength: '50 – 75 minutes',
    rate: '$195 – $240 / session'
  },
  {
    id: 'burnout-high-achievers',
    title: 'Burnout, Perfectionism & High Achievers',
    category: 'individual',
    iconName: 'Flame',
    badge: 'Popular',
    shortDescription: 'Unpack the cost of relentless achievement, imposter syndrome, and chronic work fatigue.',
    detailedDescription: 'In high-intensity environments like the Bay Area tech, medical, and legal sectors, you may have learned that your worth equals your output. When chronic exhaustion sets in, sheer willpower no longer works. We build sustainable boundaries, recover creativity, and dismantle people-pleasing.',
    whoItIsFor: [
      'You are physically exhausted yet your mind won\'t shut off at bedtime',
      'You feel cynical, detached, or resentful toward work you once loved',
      'You fear that slowing down will cause your entire career or life to collapse',
      'You struggle to set boundaries with managers, clients, or family members'
    ],
    whatWeDo: [
      'Deconstruct the internalized belief systems linking productivity to human value',
      'Polyvagal nervous system pacing to transition from sympathetic overdrive to restorative rest',
      'Actionable communication scripts for boundary setting without guilt',
      'Clarifying your authentic core values vs. societal expectations'
    ],
    modalities: ['Values-Based ACT', 'Compassion-Focused Therapy (CFT)', 'Executive Nervous System Reset'],
    sessionLength: '50 minutes',
    rate: '$195 / session'
  },
  {
    id: 'couples-therapy',
    title: 'Couples & Relationship Counseling',
    category: 'couples',
    iconName: 'HeartHandshake',
    badge: 'Safe & Collaborative',
    shortDescription: 'Turn repetitive arguments into opportunities for vulnerable connection, repair, and intimacy.',
    detailedDescription: 'Most couples don\'t fight because they fell out of love; they fight because an attachment protest is occurring beneath the surface. We provide a balanced, neutral, and warm environment where both partners feel heard and supported as you learn each other\'s emotional languages.',
    whoItIsFor: [
      'You feel stuck in the classic "pursuer-distancer" argument pattern',
      'Communication breaks down quickly into criticism, defensiveness, or stonewalling',
      'You are navigating life transitions like cohabitation, marriage, or new parenthood',
      'You want to rebuild trust, emotional intimacy, and playful connection'
    ],
    whatWeDo: [
      'Mapping your couple\'s repetitive negative cycle with Emotionally Focused Therapy (EFT)',
      'Learning Gottman repair attempts to de-escalate fights before flooding occurs',
      'Expressing primary attachment needs without blame or withdrawal',
      'Co-creating shared relationship rituals and long-term security'
    ],
    modalities: ['EFT (Emotionally Focused Couples Therapy)', 'Gottman Method (Level 2 Trained)', 'Attachment Science'],
    sessionLength: '60 minutes',
    rate: '$230 / session'
  },
  {
    id: 'depression-transitions',
    title: 'Depression, Grief & Life Transitions',
    category: 'individual',
    iconName: 'SunMedium',
    badge: 'Gentle Support',
    shortDescription: 'Gentle, structured accompaniment when the world feels heavy, gray, or unfamiliar.',
    detailedDescription: 'Depression can feel like moving through heavy fog. Rather than rushing you to "cheer up," we honor the grief or protective withdrawal your mind is experiencing. Step by step, we reconnect you to gentle momentum, self-kindness, and genuine vitality.',
    whoItIsFor: [
      'You experience persistent numbness, loss of motivation, or sadness',
      'Navigating major transitions: relocation, divorce, career pivot, or loss of a loved one',
      'Everything feels like an overwhelming chore and self-criticism is loud',
      'You feel adrift without a clear sense of purpose or identity'
    ],
    whatWeDo: [
      'Gentle behavioral activation matched to your current energy reserves',
      'Cultivating self-compassion to soften harsh internal self-talk',
      'Grief processing without timeline pressure or expectations',
      'Rediscovering spark, curiosity, and micro-moments of joy'
    ],
    modalities: ['Behavioral Activation', 'Mindfulness-Based Cognitive Therapy (MBCT)', 'Existential & Narrative Therapy'],
    sessionLength: '50 minutes',
    rate: '$195 / session'
  },
  {
    id: 'telehealth-california',
    title: 'Secure California Telehealth',
    category: 'telehealth',
    iconName: 'Laptop',
    badge: 'Statewide Access',
    shortDescription: 'High-quality, confidential psychotherapy from the comfort of your home or private office.',
    detailedDescription: 'No Bay Area traffic or frantic commuting. Our telehealth sessions use a private, HIPAA-compliant video platform that allows you to engage deeply from your favorite couch with a warm cup of tea. Available to all residents located anywhere in California.',
    whoItIsFor: [
      'Busy professionals wanting therapy during lunch breaks or between meetings',
      'Parents with young children who need flexible scheduling without childcare stress',
      'California residents outside San Francisco (Oakland, San Jose, Los Angeles, San Diego, Tahoe)',
      'Anyone who feels more grounded and open in their own private space'
    ],
    whatWeDo: [
      'One-click secure video link sent 24 hours prior (no app installation required)',
      'Interactive visual aids, digital worksheets, and guided grounding practices',
      'Seamless hybrid options: alternate between in-person and telehealth as your week demands'
    ],
    modalities: ['HIPAA-Compliant Video', 'Digital Whiteboards', 'Interactive EMDR Tools'],
    sessionLength: '50 minutes',
    rate: '$195 / session'
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    quote: 'Walking into Dr. Vance\'s office feels like taking your shoes off after a marathon. She never treated me like a broken patient with a checklist of symptoms. In six months, I went from wake-up panic attacks to feeling genuinely grounded in my own life.',
    clientContext: 'Tech Lead & Mother of Two',
    durationWithUs: '8 months of care',
    tag: 'Anxiety & Panic Recovery'
  },
  {
    id: 't2',
    quote: 'I had tried talk therapy years ago and felt like I was just venting in circles. Elena\'s approach with EMDR and nervous system work was completely different. We actually targeted the old memories that were fueling my imposter syndrome. I can breathe again.',
    clientContext: 'Product Designer, San Francisco',
    durationWithUs: '1 year of care',
    tag: 'EMDR & Perfectionism'
  },
  {
    id: 't3',
    quote: 'My partner and I were on the brink of calling off our engagement because every small disagreement spiraled into silence. Elena helped us see the emotional loop we were trapped in without taking sides. Our relationship feels like a safe harbor again.',
    clientContext: 'Couples Therapy Clients',
    durationWithUs: '6 months of care',
    tag: 'Couples Counseling'
  }
];

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    id: 'nervous-system-reset',
    title: 'Why "Just Relaxing" Fails for Chronic Anxiety (And What Your Body Needs Instead)',
    readTime: '4 min read',
    category: 'Nervous System Science',
    excerpt: 'When your nervous system detects threat, intellectual advice like "don\'t worry" sounds like noise. Discover how physiological sighs and somatic orienting change everything.',
    content: [
      'Have you ever had someone tell you to "just take a deep breath" when you were in the middle of a spiral, only to feel your chest tighten even more? There is a biological reason for this.',
      'When your amygdala registers threat—whether a looming work deadline, conflict with a spouse, or financial stress—it floods your bloodstream with cortisol and epinephrine. In this state, your prefrontal cortex (the rational logic center) is partially sidelined.',
      'To calm the mind, you have to speak the language of the body first. Somatic grounding, bilateral sensory orienting, and extended exhalations signal safety through the vagus nerve before logic can take root.'
    ],
    keyTakeaways: [
      'Exhalations longer than inhalations trigger the parasympathetic brake',
      'Orienting your eyes to 5 peaceful physical objects in your immediate room breaks amygdala fixation',
      'Gentle weight (a heavy throw blanket or resting hands on your chest) releases soothing proprioceptive feedback'
    ]
  },
  {
    id: 'high-achiever-burnout',
    title: 'The High-Achiever\'s Trap: Untangling Human Worth From Daily Output',
    readTime: '5 min read',
    category: 'Burnout & Self-Compassion',
    excerpt: 'If you feel guilty taking a 20-minute rest without multitasking, your identity may be hijacked by conditional self-worth. Here is how to begin unhooking.',
    content: [
      'For many of us, high achievement was not merely a career strategy—it was an early survival skill. Praise, safety, and belonging were awarded when we performed flawlessly, anticipated everyone\'s needs, and never caused a fuss.',
      'The dilemma is that what got you here will not keep you healthy. Over decades, this transforms into a chronic state of sympathetic arousal where rest feels dangerous and stillness feels lazy.',
      'Healing begins with self-compassion: realizing your inner critic isn\'t trying to hurt you; it\'s an exhausted protector trying to keep you safe using an outdated rulebook.'
    ],
    keyTakeaways: [
      'Identify your "phantom deadlines"—urgency created by anxiety rather than external reality',
      'Schedule non-negotiable "unproductive white space" on your calendar like an essential appointment',
      'Notice the difference between values-driven commitment and fear-driven perfectionism'
    ]
  },
  {
    id: 'first-therapy-session-guide',
    title: 'What Actually Happens in Your Very First Therapy Intake?',
    readTime: '3 min read',
    category: 'Therapy 101',
    excerpt: 'Demystifying the first 50 minutes: no couch interrogation, no judgment, and no pressure to bare your deepest trauma on day one.',
    content: [
      'Many people put off therapy for years simply because the unknown feels intimidating. Will you be judged? Will you have to talk about childhood memories you aren\'t ready to touch?',
      'In a modern, trauma-informed practice, your first session is simply a gentle conversation. We review what brought you in today, what you hope will be different 6 months from now, and your comfort level.',
      'You are always in the driver\'s seat. If there are topics you do not feel ready to explore, we honor that boundary without question.'
    ],
    keyTakeaways: [
      'You don\'t need to have a polished script or know the exact clinical names of what you feel',
      'Assessing mutual fit is the number one priority of your first consultation',
      'You have complete agency over the pace and depth of what you choose to share'
    ]
  }
];

export const CRISIS_RESOURCES = [
  { name: '988 Suicide & Crisis Lifeline', contact: 'Call or Text 988', desc: 'Free, confidential, available 24/7 nationwide' },
  { name: 'Crisis Text Line', contact: 'Text HOME to 741741', desc: 'Connect with a live, trained crisis volunteer 24/7' },
  { name: 'The Trevor Project', contact: 'Call 1-866-488-7386 or Text START to 678-678', desc: 'Crisis support for LGBTQ young people' },
  { name: 'SAMHSA National Helpline', contact: '1-800-662-4357', desc: 'Treatment referral and mental health information service' }
];
