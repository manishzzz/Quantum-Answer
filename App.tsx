import React, { useState, useEffect } from 'react';
import { Question, User, Comment, AnswerVersion, Achievement, UserDigest, QuestionStatus } from './types';
import { MOCK_USERS, MOCK_QUESTIONS_LIST } from './constants';
import { checkAndAwardAchievements } from './services/achievementService';
import { summarizeChange } from './services/geminiService';
import { generateUserDigest } from './services/digestService';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import QuestionPage from './pages/QuestionPage';
import CreateQuestionPage from './pages/CreateQuestionPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SettingsPage from './pages/SettingsPage';
import AchievementToast from './components/AchievementToast';
import LeaderboardPage from './pages/LeaderboardPage';

type Page = 'home' | 'question' | 'create' | 'profile' | 'login' | 'signup' | 'settings' | 'leaderboard';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS_LIST);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);

  const [userDigest, setUserDigest] = useState<UserDigest | null>(null);
  const [isDigestLoading, setIsDigestLoading] = useState<boolean>(false);

  // --- Fetch AI Digest on Login ---
  useEffect(() => {
    if (currentUser) {
      const fetchDigest = async () => {
        setIsDigestLoading(true);
        try {
          const digest = await generateUserDigest(currentUser, questions);
          setUserDigest(digest);
        } catch (error) {
          console.error("Failed to generate user digest:", error);
          setUserDigest([]); // Set to empty array on failure
        }
        setIsDigestLoading(false);
      };
      fetchDigest();
    } else {
      setUserDigest(null); // Clear digest on logout
    }
  }, [currentUser, questions]);


  // --- Achievement Handler ---
  const checkForAchievements = (action: 'CREATE_QUESTION' | 'EVOLVE_ANSWER' | 'LIKE_VERSION', actingUser: User) => {
    const unlocked = checkAndAwardAchievements(actingUser, questions, action);
    if (unlocked) {
      setNewlyUnlockedAchievement(unlocked);
      // Update the user in state
      setUsers(prevUsers => prevUsers.map(u => 
        u.id === actingUser.id 
          ? { ...u, unlockedAchievements: [...u.unlockedAchievements, unlocked.id] }
          : u
      ));
      setCurrentUser(prev => prev ? { ...prev, unlockedAchievements: [...prev.unlockedAchievements, unlocked.id] } : null);
    }
  };

  // --- Navigation Handlers ---
  const navigateTo = (page: Page) => setCurrentPage(page);
  const navigateToHome = () => {
    setCurrentPage('home');
    setCurrentQuestionId(null);
  };
  const navigateToQuestion = (questionId: string) => {
    setCurrentPage('question');
    setCurrentQuestionId(questionId);
  };

  // --- Auth & User Handlers ---
  const handleLogin = (email: string, pass: string): boolean => {
    const user = users.find(u => u.name.toLowerCase() === email.split('@')[0]);
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      navigateToHome();
      return true;
    }
    return false;
  };

  const handleSignUp = (name: string, email: string, pass: string) => {
    const newUser: User = {
      id: `u${users.length + 1}`,
      name,
      avatarUrl: `https://i.pravatar.cc/150?u=${name}`,
      reputation: 0,
      unlockedAchievements: [],
    };
    setUsers(prev => [...prev, newUser]);
    setIsAuthenticated(true);
    setCurrentUser(newUser);
    navigateToHome();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigateToHome();
  };
  
  const handleUpdateUserProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  
  // --- Centralized Content Handlers ---
  const handleCreateQuestion = (title: string, initialContent: string, tags: string[]) => {
    if (!currentUser) return;
    const newQuestion: Question = {
      id: `q${questions.length + 1}`,
      title,
      authorId: currentUser.id,
      status: 'evolving',
      tags,
      versions: [{
        id: 'v1', authorId: currentUser.id, content: initialContent,
        timestamp: new Date(),
        aiSummary: { type: 'Foundation', text: 'The initial answer that starts the evolution.' },
        likes: 0, comments: [], likedBy: [],
      }]
    };
    const updatedQuestions = [newQuestion, ...questions];
    setQuestions(updatedQuestions);
    navigateToQuestion(newQuestion.id);

    // Check for "Pioneer" achievement
    checkForAchievements('CREATE_QUESTION', currentUser);
  };
  
  const handleLikeVersion = (questionId: string, versionId: string) => {
    if (!currentUser) return;

    let likedVersionAuthor: User | null = null;
    let isNewLike = false; // Flag to check for achievements later

    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          versions: q.versions.map(v => {
            if (v.id === versionId) {
              const hasLiked = v.likedBy.includes(currentUser.id);
              likedVersionAuthor = users.find(u => u.id === v.authorId) || null;

              if (hasLiked) {
                // UNLIKE: User has already liked this version, so remove the like.
                return { 
                  ...v, 
                  likes: v.likes - 1,
                  likedBy: v.likedBy.filter(uid => uid !== currentUser.id)
                };
              } else {
                // LIKE: User is liking this version for the first time.
                isNewLike = true;
                return { 
                  ...v, 
                  likes: v.likes + 1,
                  likedBy: [...v.likedBy, currentUser.id]
                };
              }
            }
            return v;
          })
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);

    // Only award achievements for the author on a new "like" action.
    if (isNewLike && likedVersionAuthor) {
      checkForAchievements('LIKE_VERSION', likedVersionAuthor);
    }
  };

  const handleAddComment = (questionId: string, versionId: string, content: string) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: `c${Date.now()}`, authorId: currentUser.id, content, timestamp: new Date(),
    };
    const updatedQuestions = questions.map(q => q.id === questionId
        ? { ...q, versions: q.versions.map(v => v.id === versionId ? {...v, comments: [...v.comments, newComment]} : v) }
        : q
    );
    setQuestions(updatedQuestions);
  };

  const handleQuestionStatusChange = (questionId: string, newStatus: QuestionStatus) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.id === questionId ? { ...q, status: newStatus } : q
      )
    );
  };

  const handleEditorSubmit = async (
    questionId: string, 
    newContent: string, 
    editingSourceVersionId: string | null
  ): Promise<string | null> => {
    if (!currentUser) return "You must be logged in to contribute.";

    const question = questions.find(q => q.id === questionId);
    if (!question) return "Error: Could not find the specified question.";

    const isEdit = editingSourceVersionId !== null;
    const sourceVersion = isEdit
      ? question.versions.find(v => v.id === editingSourceVersionId)
      : question.versions[question.versions.length - 1];

    if (!sourceVersion) {
      return "Error: Could not find the source answer to evolve from. Please refresh and try again.";
    }

    if (newContent.trim() === sourceVersion.content.trim()) {
      return "No changes were made to the answer. Please provide a new contribution.";
    }

    try {
      const summary = await summarizeChange(sourceVersion.content, newContent);
      
      // Award reputation and check for Sage achievement
      if (!isEdit && sourceVersion.authorId !== currentUser.id) {
        setUsers(users.map(user => {
            if (user.id === sourceVersion.authorId) {
                const updatedUser = { ...user, reputation: user.reputation + 10 };
                // Check achievements for the user whose answer was evolved
                checkForAchievements('EVOLVE_ANSWER', updatedUser); 
                return updatedUser;
            }
            return user;
        }));
      }
      
      const newVersion: AnswerVersion = {
        id: `v${question.id}-${question.versions.length + 1}`, authorId: currentUser.id, content: newContent,
        timestamp: new Date(), aiSummary: summary, likes: 0, comments: [], likedBy: [],
      };
      
      setQuestions(questions.map(q => q.id === questionId ? {...q, versions: [...q.versions, newVersion]} : q));

      // Check for Collaborator achievement for the current user
      if (!isEdit && question.authorId !== currentUser.id) {
        checkForAchievements('EVOLVE_ANSWER', currentUser);
      }
      
      return null; // Success
    } catch (e) {
      console.error("Editor submit error:", e);
      return "There was an issue generating the AI summary for your change. Please check your connection and try again.";
    }
  };

  // --- Rendering Logic ---
  const filteredQuestions = questions.filter(q => {
    const matchesQuery = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !activeTagFilter || q.tags.includes(activeTagFilter);
    return matchesQuery && matchesTag;
  });
  
  const currentQuestion = questions.find(q => q.id === currentQuestionId);

  const renderPage = () => {
    if (!isAuthenticated) {
      switch (currentPage) {
        case 'login': return <LoginPage onLogin={handleLogin} onNavigateToSignUp={() => navigateTo('signup')} />;
        case 'signup': return <SignUpPage onSignUp={handleSignUp} onNavigateToLogin={() => navigateTo('login')} />;
        case 'question':
           if (currentQuestion) {
             return <QuestionPage 
                key={currentQuestion.id} question={currentQuestion} users={users} currentUser={currentUser} 
                isAuthenticated={isAuthenticated} onNavigateToLogin={() => navigateTo('login')}
                onNavigateBack={navigateToHome} onLikeVersion={handleLikeVersion} 
                onAddComment={handleAddComment} onEditorSubmit={handleEditorSubmit}
                onStatusChange={handleQuestionStatusChange}
             />;
           }
           return <HomePage 
              questions={filteredQuestions} onQuestionSelect={navigateToQuestion} users={users}
              currentUser={null} userDigest={null} isDigestLoading={false}
              activeTagFilter={activeTagFilter} onTagFilterChange={setActiveTagFilter}
            />;
        default:
          return <HomePage 
            questions={filteredQuestions} onQuestionSelect={navigateToQuestion} users={users} 
            currentUser={null} userDigest={null} isDigestLoading={false}
            activeTagFilter={activeTagFilter} onTagFilterChange={setActiveTagFilter}
          />;
      }
    }
    
    // Authenticated Routes
    switch (currentPage) {
      case 'question':
        if (currentQuestion) {
          return <QuestionPage 
            key={currentQuestion.id} question={currentQuestion} users={users} currentUser={currentUser} 
            isAuthenticated={isAuthenticated} onNavigateToLogin={() => navigateTo('login')}
            onNavigateBack={navigateToHome} onLikeVersion={handleLikeVersion} 
            onAddComment={handleAddComment} onEditorSubmit={handleEditorSubmit}
            onStatusChange={handleQuestionStatusChange}
          />;
        }
        return null;
      case 'create':
        return <CreateQuestionPage onSubmit={handleCreateQuestion} onCancel={navigateToHome} />;
      case 'profile':
        return <ProfilePage 
            currentUser={currentUser!} questions={questions} users={users} 
            onQuestionSelect={navigateToQuestion} onNavigateBack={navigateToHome}
        />;
      case 'settings':
        return <SettingsPage 
            currentUser={currentUser!} 
            onNavigateBack={() => navigateTo('home')} 
            onUpdateProfile={handleUpdateUserProfile}
        />;
      case 'leaderboard':
        return <LeaderboardPage users={users} questions={questions} onNavigateBack={navigateToHome} />;
      case 'home':
      default:
        return <HomePage 
          questions={filteredQuestions} onQuestionSelect={navigateToQuestion} users={users} 
          currentUser={currentUser} userDigest={userDigest} isDigestLoading={isDigestLoading}
          activeTagFilter={activeTagFilter} onTagFilterChange={setActiveTagFilter}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-secondary font-sans">
      <Header 
        isAuthenticated={isAuthenticated} currentUser={currentUser}
        onLogoClick={navigateToHome} onAskQuestionClick={() => navigateTo('create')}
        onMyContributionsClick={() => navigateTo('profile')} onSettingsClick={() => navigateTo('settings')}
        onSignOut={handleLogout} onNavigateToLogin={() => navigateTo('login')}
        onNavigateToSignUp={() => navigateTo('signup')} onLeaderboardClick={() => navigateTo('leaderboard')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery} searchResults={filteredQuestions}
        onSelectQuestion={navigateToQuestion}
      />
      <main className="container mx-auto p-4 md:p-8">
        {renderPage()}
      </main>
      {newlyUnlockedAchievement && (
        <AchievementToast 
          achievement={newlyUnlockedAchievement}
          onClose={() => setNewlyUnlockedAchievement(null)}
        />
      )}
    </div>
  );
};

export default App;