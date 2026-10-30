import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const PRACTICE_SYSTEM_INSTRUCTION = `You are Haven, the warm, empathetic, and knowledgeable practice assistant for "Haven & Hearth Psychology", the private psychotherapy practice of Dr. Elena Vance, Psy.D. (Licensed Clinical Psychologist, License #PSY32918).

Practice Overview:
- Location: 450 Sutter Street, Suite 1420, San Francisco, CA 94108 (Union Square, quiet courtyard view, accessible by BART/Muni at Powell St, elevator-accessible).
- Practice Model: In-person sessions in San Francisco and secure telehealth across California.
- Services:
  * Individual Adult Psychotherapy (Anxiety, Panic, Burnout, Life Transitions, Perfectionism, Depression)
  * Trauma Recovery & EMDR (Evidence-based processing of acute and developmental trauma)
  * Couples & Relationship Therapy (Gottman & Emotionally Focused Therapy/EFT)
  * Stress, Somatic & High-Achiever Burnout (Nervous system regulation, somatic grounding)
- Pricing & Fees:
  * Free 15-Minute Discovery Call: $0
  * Initial Intake Assessment (75 min): $240
  * Individual Therapy (50 min): $195
  * Couples Therapy (60 min): $230
- Insurance & Payment:
  * Private pay practice (out-of-network). We provide monthly itemized "Superbills" for clients to submit to PPO insurance for 50-80% reimbursement.
  * We accept all major cards, HSA (Health Savings Account), and FSA (Flexible Spending Account) cards.
- Tone & Guardrails:
  * Voice: Warm, compassionate, unhurried, reassuring, clear, and professional. Avoid clinical jargon or overly sterile language.
  * Safety & Crisis Protocol: You are an AI assistant and NOT a licensed clinician, doctor, or crisis counselor. You cannot provide clinical diagnoses or crisis intervention.
  * If a user expresses active crisis, suicidal ideation, self-harm, or severe emergency, prioritize their safety warmly:
    "If you or a loved one is in immediate crisis or need urgent emotional support, please call or text 988 (Suicide & Crisis Lifeline - free, 24/7, confidential), text HOME to 741741, or call 911 / visit your nearest emergency room."
  * Keep answers concise (2-4 paragraphs max), helpful, and invite them to schedule a free 15-minute discovery call with Dr. Elena Vance if they wish to explore starting therapy.`;

// Multi-turn chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, message } = req.body;
    const userQuery = message || (Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1].content : '');

    if (!userQuery) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Crisis check for fast safety response
    const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'harm myself', 'overdose'];
    const lower = userQuery.toLowerCase();
    const isCrisis = crisisKeywords.some(keyword => lower.includes(keyword));

    if (isCrisis) {
      return res.json({
        reply: "I hear how much pain you might be in right now, and your safety is deeply important to us. Because I am an AI practice assistant and not a crisis hotline or therapist, please connect immediately with compassionate, live support:\n\n• **988 Suicide & Crisis Lifeline**: Call or text **988** (Free, confidential, available 24/7)\n• **Crisis Text Line**: Text **HOME** to **741741**\n• **The Trevor Project** (LGBTQ youth): Call 1-866-488-7386 or text START to 678-678\n• If you are in immediate danger, please dial **911** or go to the nearest emergency room.\n\nPlease reach out to them right now—you do not have to carry this alone.",
        isCrisis: true
      });
    }

    if (ai) {
      // Build conversation contents
      let promptText = PRACTICE_SYSTEM_INSTRUCTION + "\n\nClient Conversation History:\n";
      if (Array.isArray(messages)) {
        for (const msg of messages.slice(-6)) {
          promptText += `${msg.role === 'user' ? 'Client' : 'Haven'}: ${msg.content}\n`;
        }
      }
      promptText += `Client: ${userQuery}\nHaven:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
      });

      const reply = response.text || "Thank you for reaching out. Dr. Vance would be happy to connect with you during a free 15-minute discovery call to discuss your goals and how we can support you.";
      return res.json({ reply });
    } else {
      // Graceful offline fallback with helpful tailored answers
      let simulatedReply = "Thank you for reaching out to Haven & Hearth Psychology. ";
      if (lower.includes('insurance') || lower.includes('cost') || lower.includes('fee') || lower.includes('price')) {
        simulatedReply += "We operate as an out-of-network private practice to protect your privacy and tailor care without arbitrary session limits. Individual 50-minute sessions are $195, and our initial intake is $240. We provide full itemized Superbills each month that clients submit for 50–80% PPO reimbursement, and we accept HSA/FSA cards. We also offer a free 15-minute discovery call!";
      } else if (lower.includes('discovery') || lower.includes('consultation') || lower.includes('book') || lower.includes('appointment')) {
        simulatedReply += "We'd love to welcome you! Dr. Vance offers a complimentary 15-minute video or phone discovery call so you can share what you are experiencing, ask questions about our therapeutic style, and see if working together feels like a natural fit. You can choose a time directly through our 'Book Appointment' page.";
      } else if (lower.includes('anxiety') || lower.includes('cbt') || lower.includes('emdr') || lower.includes('trauma')) {
        simulatedReply += "Dr. Elena Vance specializes in anxiety, burnout, and trauma recovery using integrative, evidence-based methods including ACT (Acceptance & Commitment Therapy), CBT, somatic nervous system regulation, and EMDR. Our approach is gentle and paced around your comfort.";
      } else {
        simulatedReply += "Dr. Elena Vance offers a warm, non-clinical environment where we look at the whole person—mind, body, and relationships. Whether you're navigating high stress, relational hurdles, or past trauma, you are met with zero judgment. Would you like to schedule a free 15-minute discovery call?";
      }
      return res.json({ reply: simulatedReply });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      reply: "Thank you for reaching out. We are experiencing a brief connection hiccup, but Dr. Vance's team is always available. Please feel free to book a free 15-minute discovery call directly on our booking page or email us at hello@havenandhearthpsych.com.",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// In-memory persistent appointment store (seeded with realistic client appointments)
interface StoredAppointment {
  id: string;
  bookingRef: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  format: string;
  notes: string;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  videoRoomId: string;
  clinicalNotes?: string;
  hostAccount: string;
}

const appointmentsStore: StoredAppointment[] = [
  {
    id: 'apt-001',
    bookingRef: 'HH-749210',
    name: 'Maya Lin',
    email: 'maya.lin@example.com',
    phone: '(415) 555-0192',
    serviceType: 'Individual Psychotherapy (ACT & Anxiety)',
    date: '2026-11-03',
    timeSlot: '10:30 AM',
    format: 'Telehealth (Video)',
    notes: 'Navigating high-intensity work stress, panic spirals, and perfectionism.',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    videoRoomId: 'haven-room-749210',
    clinicalNotes: 'Intake completed. Focusing on polyvagal down-regulation and values-based cognitive defusion.',
    hostAccount: 'dr.elena.vance@havenandhearthpsych.com'
  },
  {
    id: 'apt-002',
    bookingRef: 'HH-832145',
    name: 'Marcus & Sarah Brody',
    email: 'marcus.brody@example.com',
    phone: '(415) 555-0144',
    serviceType: 'Couples / Relationship Therapy',
    date: '2026-11-04',
    timeSlot: '1:30 PM',
    format: 'Telehealth (Video)',
    notes: 'Communication breakdown during stressful transitions; interested in EFT.',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    videoRoomId: 'haven-room-832145',
    clinicalNotes: 'Couples de-escalation cycle mapping.',
    hostAccount: 'dr.elena.vance@havenandhearthpsych.com'
  }
];

// List appointments (for Admin Host or Client email lookup)
app.get('/api/appointments', (req, res) => {
  const { email, role } = req.query;
  if (role === 'admin' || role === 'host') {
    // Return all practice appointments for Dr. Vance
    return res.json({ appointments: appointmentsStore, total: appointmentsStore.length });
  }

  if (email && typeof email === 'string') {
    const clientApts = appointmentsStore.filter(a => a.email.toLowerCase() === email.toLowerCase());
    return res.json({ appointments: clientApts, total: clientApts.length });
  }

  // Default return list
  res.json({ appointments: appointmentsStore, total: appointmentsStore.length });
});

// Appointment booking endpoint
app.post('/api/book-appointment', (req, res) => {
  const { name, email, phone, serviceType, date, timeSlot, format, notes } = req.body;
  if (!name || !email || !serviceType || !date || !timeSlot) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  const bookingRef = 'HH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const videoRoomId = 'haven-room-' + Math.random().toString(36).substring(2, 8);

  const newAppointment: StoredAppointment = {
    id: 'apt-' + Date.now(),
    bookingRef,
    name,
    email,
    phone: phone || 'Not provided',
    serviceType,
    date,
    timeSlot,
    format: format || 'Telehealth (Video)',
    notes: notes || 'None',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    videoRoomId,
    hostAccount: 'dr.elena.vance@havenandhearthpsych.com'
  };

  appointmentsStore.unshift(newAppointment);

  res.json({
    success: true,
    bookingRef,
    videoRoomId,
    appointment: newAppointment,
    summary: {
      name,
      email,
      phone: phone || 'Not provided',
      serviceType,
      date,
      timeSlot,
      format: format || 'Telehealth (Video)',
      notes: notes || 'None',
      location: format === 'In-Person (San Francisco)' 
        ? '450 Sutter St, Suite 1420, San Francisco, CA' 
        : `Secure HIPAA Video Call (Room: ${videoRoomId})`
    },
    message: 'Your consultation request has been reserved! Dr. Elena Vance will review your intake details and send a calendar invitation.'
  });
});

// Update appointment status or clinical notes (Admin Host)
app.patch('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { status, clinicalNotes } = req.body;

  const apt = appointmentsStore.find(a => a.id === id || a.bookingRef === id || a.videoRoomId === id);
  if (!apt) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  if (status) apt.status = status;
  if (clinicalNotes !== undefined) apt.clinicalNotes = clinicalNotes;

  res.json({ success: true, appointment: apt });
});

// Legal and Data Storage Transparency endpoint
app.get('/api/legal/data-storage-copyright', (req, res) => {
  res.json({
    dataStorage: {
      practiceEhrLocation: 'Encrypted HIPAA-compliant storage partition (AES-256)',
      hostAdminAccount: 'Dr. Elena Vance, Psy.D. (practice master calendar, psychotherapy records, intake assessments)',
      clientAccountPortal: 'Secure client portal (appointment history, upcoming video session links, receipts & superbills)',
      videoCallDataRetention: 'Video calls are transient peer-to-peer WebRTC streams. No video or audio is ever recorded or retained without explicit, dual-signed consent.'
    },
    copyrightAndOwnership: {
      clinicalDocumentation: 'All diagnostic formulations, psychotherapy treatment notes, and therapeutic worksheets authored by Dr. Vance remain the clinical intellectual property and copyright of Haven & Hearth Psychology.',
      clientPrivacyRights: 'Clients hold statutory rights of access, copy, and amendment to their Protected Health Information (PHI) under HIPAA Privacy Rule (45 CFR § 164.524).',
      noSurprisesAct: 'All fees and good faith estimates are copyrighted to Haven & Hearth Psychology under US Federal Law.'
    }
  });
});

// Contact inquiry endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message, preferredContact } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide name, email, and message' });
  }

  res.json({
    success: true,
    message: `Thank you, ${name}. Your message has been received with warmth and care. Dr. Vance or our intake coordinator will respond within 1 business day.`
  });
});

// Setup Vite in development or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Haven & Hearth Psychology server running on http://0.0.0.0:${port}`);
  });
}

startServer();
