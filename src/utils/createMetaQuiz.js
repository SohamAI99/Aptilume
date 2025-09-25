// Utility to create a Meta Product Sense Assessment quiz
import { db, auth } from './firebase.js';
import { collection, doc, setDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

// Meta Product Sense Assessment quiz data
const metaQuiz = {
  title: "Meta Product Sense Assessment",
  description: "Product management and analytical thinking test designed for Meta's product roles and technical positions.",
  difficulty: "Hard",
  duration: 75, // 75 minutes
  questionCount: 26, // Updated to match actual number of questions
  category: "Product Management",
  tags: ["meta", "product-sense", "product-management", "analytics"],
  isPublished: true,
  isRecommended: true
};

// Meta Product Sense Assessment questions
const metaQuestions = [
  {
    text: "What is the first step in evaluating whether a product feature should be built?",
    options: ["Estimate the engineering effort", "Understand the user need", "Check competitors", "Design UI mockups"],
    correctAnswer: 1,
    explanation: "A product manager should always start with the user need before considering effort, competition, or design.",
    difficulty: "Easy",
    category: "Product Sense",
    topic: "User Needs",
    marks: 4
  },
  {
    text: "If Meta wants to increase engagement on Facebook Groups, which metric would be MOST relevant?",
    options: ["Number of new groups created", "Time spent in groups", "Daily Active Users (DAU)", "Ad revenue from groups"],
    correctAnswer: 1,
    explanation: "Time spent in groups is a direct measure of engagement, unlike DAU or revenue.",
    difficulty: "Easy",
    category: "Metrics",
    topic: "Engagement",
    marks: 4
  },
  {
    text: "Which of the following best describes a 'North Star Metric'?",
    options: ["A single metric that defines product growth", "A vanity metric for investors", "A KPI used by engineers only", "The sum of all product KPIs"],
    correctAnswer: 0,
    explanation: "The North Star Metric is the guiding measure of product success, tied to long-term growth.",
    difficulty: "Medium",
    category: "Metrics",
    topic: "North Star Metric",
    marks: 4
  },
  {
    text: "Instagram is considering removing 'Like counts' from posts. What is the primary user problem this addresses?",
    options: ["Reducing server costs", "Increasing ad impressions", "Reducing social comparison anxiety", "Improving photo quality"],
    correctAnswer: 2,
    explanation: "Removing like counts was aimed at reducing social comparison and pressure.",
    difficulty: "Easy",
    category: "Product Sense",
    topic: "User Psychology",
    marks: 4
  },
  {
    text: "Which framework helps prioritize features based on user value vs. implementation effort?",
    options: ["RICE", "MoSCoW", "Eisenhower Matrix", "SWOT Analysis"],
    correctAnswer: 0,
    explanation: "RICE (Reach, Impact, Confidence, Effort) helps prioritize features based on value vs. effort.",
    difficulty: "Medium",
    category: "Prioritization",
    topic: "Frameworks",
    marks: 4
  },
  {
    text: "You're tasked with improving Messenger reliability. Which metric is most relevant?",
    options: ["Number of messages sent per day", "Message delivery success rate", "User growth rate", "Time spent per session"],
    correctAnswer: 1,
    explanation: "Reliability is directly measured by successful message delivery rate.",
    difficulty: "Medium",
    category: "Metrics",
    topic: "Reliability",
    marks: 4
  },
  {
    text: "Meta is testing Reels to compete with TikTok. What is the PRIMARY metric to evaluate success?",
    options: ["Total ad revenue", "Daily Active Reels users", "User satisfaction surveys", "Engineering effort spent"],
    correctAnswer: 1,
    explanation: "Adoption and engagement (Daily Active Reels users) is the primary success metric.",
    difficulty: "Easy",
    category: "Metrics",
    topic: "Adoption",
    marks: 4
  },
  {
    text: "Which trade-off is MOST important when designing the News Feed algorithm?",
    options: ["Relevance vs. Freshness", "Ads vs. Subscriptions", "UI simplicity vs. color scheme", "Data storage vs. screen size"],
    correctAnswer: 0,
    explanation: "The News Feed algorithm must balance showing relevant content with fresh content to keep users engaged.",
    difficulty: "Medium",
    category: "Product Sense",
    topic: "Algorithm Design",
    marks: 4
  },
  {
    text: "A product manager notices a drop in DAU for WhatsApp. What should be the FIRST step?",
    options: ["Run an A/B test", "Segment users by geography", "Check for technical issues", "Analyze user feedback"],
    correctAnswer: 2,
    explanation: "Before analyzing behavioral or feedback data, technical issues should be ruled out as they can cause sudden drops.",
    difficulty: "Medium",
    category: "Analytics",
    topic: "Troubleshooting",
    marks: 4
  },
  {
    text: "Which of these is an example of a leading indicator for a social media platform?",
    options: ["Monthly Active Users", "User retention rate", "Feature adoption rate", "Revenue"],
    correctAnswer: 2,
    explanation: "Feature adoption rate predicts future engagement and can signal product-market fit early.",
    difficulty: "Hard",
    category: "Metrics",
    topic: "Leading Indicators",
    marks: 4
  },
  {
    text: "Meta is considering adding a 'Stories' feature to WhatsApp. What should be the main concern?",
    options: ["Competing with Instagram", "User privacy implications", "Technical implementation", "Monetization strategy"],
    correctAnswer: 1,
    explanation: "WhatsApp's user base values privacy, so any new feature must maintain that trust.",
    difficulty: "Medium",
    category: "Product Strategy",
    topic: "User Privacy",
    marks: 4
  },
  {
    text: "Which approach is BEST for measuring the success of a new feature?",
    options: ["Compare to competitors", "Run a controlled experiment", "Launch to all users", "Survey existing users"],
    correctAnswer: 1,
    explanation: "Controlled experiments (A/B tests) provide the most reliable data on feature impact.",
    difficulty: "Medium",
    category: "Experimentation",
    topic: "A/B Testing",
    marks: 4
  },
  {
    text: "What is the main purpose of a product requirement document (PRD)?",
    options: ["Assign engineering tasks", "Define success metrics", "Communicate product vision", "Document technical specs"],
    correctAnswer: 2,
    explanation: "A PRD communicates the product vision, goals, and requirements to all stakeholders.",
    difficulty: "Easy",
    category: "Product Management",
    topic: "Documentation",
    marks: 4
  },
  {
    text: "Meta wants to increase ad revenue on Instagram. Which change would be MOST effective?",
    options: ["Increase ad frequency", "Improve ad relevance", "Add new ad formats", "Reduce ad load"],
    correctAnswer: 1,
    explanation: "More relevant ads increase engagement and conversion rates, driving higher revenue.",
    difficulty: "Medium",
    category: "Monetization",
    topic: "Ad Optimization",
    marks: 4
  },
  {
    text: "What is the biggest risk when launching a new social feature?",
    options: ["Technical bugs", "User privacy concerns", "Negative user feedback", "Competitor response"],
    correctAnswer: 2,
    explanation: "Negative user feedback can damage trust and adoption, especially for social features.",
    difficulty: "Medium",
    category: "Risk Management",
    topic: "User Experience",
    marks: 4
  },
  {
    text: "Which metric is MOST useful for evaluating a product's retention?",
    options: ["Daily Active Users", "Weekly Active Users", "Month 2 retention rate", "Feature usage frequency"],
    correctAnswer: 2,
    explanation: "Month 2 retention measures if users continue to find value after the initial experience.",
    difficulty: "Medium",
    category: "Metrics",
    topic: "Retention",
    marks: 4
  },
  {
    text: "Meta is planning to integrate VR into Facebook. What should be the PRIMARY consideration?",
    options: ["Hardware compatibility", "User adoption barriers", "Content creation tools", "Monetization strategy"],
    correctAnswer: 1,
    explanation: "VR adoption has significant barriers (cost, comfort, use cases) that must be addressed first.",
    difficulty: "Hard",
    category: "Product Strategy",
    topic: "Emerging Technology",
    marks: 4
  },
  {
    text: "How should a product manager prioritize between fixing bugs and adding features?",
    options: ["Fix all bugs first", "Add features to drive growth", "Balance based on user impact", "Delegate to engineering"],
    correctAnswer: 2,
    explanation: "Prioritization should be based on user impact, considering both bug severity and feature value.",
    difficulty: "Medium",
    category: "Prioritization",
    topic: "Bug vs. Feature",
    marks: 4
  },
  {
    text: "What is the best way to validate a new product idea?",
    options: ["Build a prototype", "Conduct user interviews", "Run a landing page test", "All of the above"],
    correctAnswer: 3,
    explanation: "Multiple validation methods provide a comprehensive understanding of user needs.",
    difficulty: "Medium",
    category: "Product Discovery",
    topic: "Validation",
    marks: 4
  },
  {
    text: "Which user segment should Meta focus on to increase Messenger usage?",
    options: ["Teens", "Business users", "International users", "All segments equally"],
    correctAnswer: 1,
    explanation: "Business users represent a high-value segment with monetization potential through workplace tools.",
    difficulty: "Hard",
    category: "User Segmentation",
    topic: "Target Audience",
    marks: 4
  },
  {
    text: "What is the MOST important factor when evaluating a product roadmap?",
    options: ["Technical feasibility", "Resource availability", "Strategic alignment", "Market demand"],
    correctAnswer: 2,
    explanation: "A roadmap must align with company strategy to ensure all efforts support long-term goals.",
    difficulty: "Medium",
    category: "Product Strategy",
    topic: "Roadmap Planning",
    marks: 4
  },
  {
    text: "Meta is experiencing user churn on Facebook. What metric should be analyzed FIRST?",
    options: ["DAU/MAU ratio", "Session duration", "Feature adoption", "User demographics"],
    correctAnswer: 0,
    explanation: "DAU/MAU ratio shows engagement stickiness and is the best early indicator of churn risk.",
    difficulty: "Medium",
    category: "Analytics",
    topic: "Churn Analysis",
    marks: 4
  },
  {
    text: "Which approach is BEST for handling conflicting stakeholder priorities?",
    options: ["Follow the highest paid person's opinion", "Use data to inform decisions", "Compromise between all views", "Defer to engineering judgment"],
    correctAnswer: 1,
    explanation: "Data-driven decisions help align stakeholders around objective measures of impact.",
    difficulty: "Medium",
    category: "Stakeholder Management",
    topic: "Conflict Resolution",
    marks: 4
  },
  {
    text: "What is the main benefit of using a product discovery sprint?",
    options: ["Faster development", "Reduced engineering effort", "Early validation of assumptions", "Better team alignment"],
    correctAnswer: 2,
    explanation: "Discovery sprints focus on validating assumptions before investing in full development.",
    difficulty: "Medium",
    category: "Product Discovery",
    topic: "Agile Methodology",
    marks: 4
  },
  {
    text: "Meta wants to expand WhatsApp into payments. What is the PRIMARY risk?",
    options: ["Regulatory compliance", "User adoption", "Technical security", "All of the above"],
    correctAnswer: 3,
    explanation: "Payments involve multiple high-stakes risks including regulation, adoption, and security.",
    difficulty: "Hard",
    category: "Risk Management",
    topic: "Financial Services",
    marks: 4
  },
  {
    text: "Which framework is BEST for prioritizing product initiatives?",
    options: ["RICE scoring", "MoSCoW method", "Kano model", "Weighted shortest job first"],
    correctAnswer: 0,
    explanation: "RICE scoring quantifies impact and effort, making it ideal for product prioritization.",
    difficulty: "Medium",
    category: "Prioritization",
    topic: "Frameworks",
    marks: 4
  }
];

// Function to find existing Meta quiz or create a new one
export const createOrUpdateMetaQuiz = async () => {
  try {
    console.log('Looking for existing Meta Product Sense Assessment quiz...');
    
    // First, check if a quiz with this title already exists
    const quizzesQuery = query(
      collection(db, 'quizzes'),
      where('title', '==', 'Meta Product Sense Assessment')
    );
    
    const querySnapshot = await getDocs(quizzesQuery);
    
    let quizId;
    
    if (!querySnapshot.empty) {
      // Quiz already exists, use the first one found
      const existingQuiz = querySnapshot.docs[0];
      quizId = existingQuiz.id;
      console.log(`Found existing Meta quiz with ID: ${quizId}`);
    } else {
      // Create a new quiz
      console.log('Creating new Meta Product Sense Assessment quiz...');
      
      const quizRef = doc(collection(db, 'quizzes'));
      const quizData = {
        ...metaQuiz,
        createdBy: auth.currentUser?.uid || 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        stats: {
          totalAttempts: 0,
          averageScore: 0,
          highestScore: 0
        }
      };
      
      await setDoc(quizRef, quizData);
      quizId = quizRef.id;
      console.log(`Created new Meta quiz with ID: ${quizId}`);
    }
    
    // Clear existing questions (if any) and add new ones
    console.log('Adding Meta Product Sense Assessment questions...');
    
    // Add questions to the quiz
    for (let i = 0; i < metaQuestions.length; i++) {
      const question = metaQuestions[i];
      
      // Add question to the quiz's questions subcollection
      const questionRef = doc(collection(db, 'quizzes', quizId, 'questions'));
      await setDoc(questionRef, {
        ...question,
        createdAt: serverTimestamp()
      });
      
      console.log(`Added question ${i + 1}: ${question.text.substring(0, 50)}...`);
    }
    
    // Update the quiz with the correct question count
    await setDoc(doc(db, 'quizzes', quizId), {
      questionCount: metaQuestions.length,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log(`Successfully created/updated Meta Product Sense Assessment quiz with ${metaQuestions.length} questions`);
    console.log(`Quiz ID: ${quizId}`);
    
    return quizId;
  } catch (error) {
    console.error('Error creating/updating Meta quiz:', error);
    throw error;
  }
};

export default { createOrUpdateMetaQuiz };