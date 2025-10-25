import { User, Question, Achievement } from '../types';
import { MOCK_ACHIEVEMENTS } from '../constants';

type ActionType = 'CREATE_QUESTION' | 'EVOLVE_ANSWER' | 'LIKE_VERSION';

export const checkAndAwardAchievements = (
  user: User,
  allQuestions: Question[],
  action: ActionType
): Achievement | null => {
  const unlockedIds = new Set(user.unlockedAchievements);

  for (const achievement of MOCK_ACHIEVEMENTS) {
    if (unlockedIds.has(achievement.id)) {
      continue; // Already unlocked
    }

    let conditionMet = false;
    switch (achievement.id) {
      case 'ach_pioneer':
        if (action === 'CREATE_QUESTION') {
          // Check if the user has authored at least one question
          if (allQuestions.some(q => q.authorId === user.id)) {
            conditionMet = true;
          }
        }
        break;
      
      case 'ach_collaborator':
        if (action === 'EVOLVE_ANSWER') {
          // Check if user has authored a version of a question they didn't start
          if (allQuestions.some(q => 
              q.authorId !== user.id && 
              q.versions.some(v => v.authorId === user.id)
          )) {
            conditionMet = true;
          }
        }
        break;
        
      case 'ach_influencer':
        // This should be checked after any action that could change like counts.
        const totalLikes = allQuestions
          .flatMap(q => q.versions)
          .filter(v => v.authorId === user.id)
          .reduce((sum, v) => sum + v.likes, 0);
        if (totalLikes >= 5) {
          conditionMet = true;
        }
        break;
        
      case 'ach_sage':
        // This is reputation based, can be checked after actions that grant reputation.
        if (user.reputation >= 500) {
          conditionMet = true;
        }
        break;
    }

    if (conditionMet) {
      return achievement; // Return the first new achievement found
    }
  }

  return null; // No new achievement unlocked
};