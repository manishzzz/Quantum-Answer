import { User, Question, Achievement } from './types';
import { PioneerIcon, CollaboratorIcon, InfluencerIcon, SageIcon } from './components/Icons';

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_pioneer', name: 'Pioneer', description: 'Ask your first question', icon: PioneerIcon },
  { id: 'ach_collaborator', name: 'Collaborator', description: 'Evolve an answer for the first time', icon: CollaboratorIcon },
  { id: 'ach_influencer', name: 'Influencer', description: 'Receive a total of 5 likes across all your contributions', icon: InfluencerIcon },
  { id: 'ach_sage', name: 'Sage', description: 'Reach a reputation of 500', icon: SageIcon },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex', avatarUrl: 'https://i.pravatar.cc/150?u=alex', reputation: 150, unlockedAchievements: ['ach_pioneer'] },
  { id: 'u2', name: 'Brenda', avatarUrl: 'https://i.pravatar.cc/150?u=brenda', reputation: 250, unlockedAchievements: ['ach_collaborator'] },
  { id: 'u3', name: 'Charlie', avatarUrl: 'https://i.pravatar.cc/150?u=charlie', reputation: 180, unlockedAchievements: [] },
  { id: 'u4', name: 'Diana', avatarUrl: 'https://i.pravatar.cc/150?u=diana', reputation: 95, unlockedAchievements: [] },
  { id: 'u5', name: 'Ethan', avatarUrl: 'https://i.pravatar.cc/150?u=ethan', reputation: 510, unlockedAchievements: ['ach_pioneer', 'ach_influencer', 'ach_sage'] },
];

export const MOCK_QUESTIONS_LIST: Question[] = [
  {
    id: 'q1',
    title: 'What is the most effective way for a team to foster innovation?',
    authorId: 'u1',
    status: 'resolved',
    tags: ['teamwork', 'innovation', 'management'],
    versions: [
      {
        id: 'v1-1',
        authorId: 'u2',
        content: 'The most effective way is to encourage psychological safety. Team members need to feel safe to voice their ideas without fear of ridicule.',
        timestamp: new Date('2023-10-26T10:00:00Z'),
        aiSummary: { type: 'Foundation', text: 'Initial answer focuses on psychological safety as the key to innovation.' },
        likes: 1,
        comments: [],
        likedBy: ['u1'],
      },
      {
        id: 'v1-2',
        authorId: 'u3',
        content: 'Building on that, psychological safety is crucial, but it must be paired with dedicated time for experimentation. Teams should allocate specific hours for "blue-sky" thinking and prototyping. This structure gives permission to innovate.',
        timestamp: new Date('2023-10-26T12:30:00Z'),
        aiSummary: { type: 'Expansion', text: 'The answer evolves to include the necessity of structured, dedicated time for experimentation.' },
        likes: 2,
        comments: [
            { id: 'c1', authorId: 'u1', content: 'Great point about dedicated time!', timestamp: new Date('2023-10-26T13:00:00Z') }
        ],
        likedBy: ['u1', 'u2'],
      },
      {
        id: 'v1-3',
        authorId: 'u4',
        content: 'I agree. Psychological safety is crucial, and dedicated time for experimentation helps. However, true innovation comes from cross-functional collaboration. Teams should regularly interact with other departments to gain diverse perspectives. This structure provides the fuel for innovation.',
        timestamp: new Date('2023-10-27T09:15:00Z'),
        aiSummary: { type: 'Addition', text: 'The focus shifts to emphasize cross-functional collaboration as a source of diverse perspectives.' },
        likes: 1,
        comments: [],
        likedBy: ['u5'],
      },
    ],
    finalAnswer: "Effective innovation in a team is built on a foundation of psychological safety, where members can voice ideas without fear. This should be coupled with dedicated, structured time for experimentation and prototyping. Critically, fostering cross-functional collaboration to integrate diverse perspectives provides the essential fuel for groundbreaking ideas."
  },
  {
    id: 'q2',
    title: 'How will AI impact the future of creative writing?',
    authorId: 'u5',
    status: 'evolving',
    tags: ['ai', 'writing', 'creativity', 'future-tech'],
    versions: [
      {
        id: 'v2-1',
        authorId: 'u1',
        content: 'AI will likely serve as a powerful assistant for writers, helping with brainstorming, overcoming writer\'s block, and generating plot ideas. It won\'t replace human creativity but augment it.',
        timestamp: new Date('2023-11-01T14:00:00Z'),
        aiSummary: { type: 'Foundation', text: 'Posits AI as an augmentative tool for writers, not a replacement.' },
        likes: 1,
        comments: [],
        likedBy: ['u3'],
      },
      {
        id: 'v2-2',
        authorId: 'u3',
        content: 'I think it\'s more than an assistant. AI could co-author entire novels, blending its computational creativity with a human editor\'s guidance to create entirely new forms of literature. It will challenge our definition of authorship.',
        timestamp: new Date('2023-11-01T18:00:00Z'),
        aiSummary: { type: 'Expansion', text: 'Suggests a more profound role for AI as a co-creator, questioning the concept of authorship.' },
        likes: 0,
        comments: [],
        likedBy: [],
      }
    ]
  },
  {
    id: 'q3',
    title: 'What are the ethical implications of gene-editing technologies like CRISPR?',
    authorId: 'u2',
    status: 'evolving',
    tags: ['ethics', 'biotechnology', 'crispr', 'future-tech'],
    versions: [
      {
        id: 'v3-1',
        authorId: 'u4',
        content: 'The primary ethical concern is the potential for "designer babies," leading to genetic inequality. We must establish clear international regulations before the technology becomes widespread.',
        timestamp: new Date('2023-11-05T11:20:00Z'),
        aiSummary: { type: 'Foundation', text: 'Focuses on the risk of genetic inequality and the need for regulation.' },
        likes: 1,
        comments: [],
        likedBy: ['u1'],
      }
    ]
  }
];

// For backward compatibility if any component still uses it
export const MOCK_QUESTION: Question = MOCK_QUESTIONS_LIST[0];