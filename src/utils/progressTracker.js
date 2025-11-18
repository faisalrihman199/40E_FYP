// Utility functions for tracking child progress

export const logGameActivity = (gameName, score, duration = 5) => {
  try {
    // Update game stats
    const gameStats = JSON.parse(localStorage.getItem('childGameStats') || '{"played": 0, "scores": [], "history": []}');
    
    gameStats.played = (gameStats.played || 0) + 1;
    gameStats.scores = [...(gameStats.scores || []), score];
    gameStats.history = [
      ...(gameStats.history || []),
      {
        name: gameName,
        score: score,
        timestamp: Date.now(),
        type: 'game'
      }
    ];

    localStorage.setItem('childGameStats', JSON.stringify(gameStats));

    // Update activity log
    logActivity({
      type: 'game',
      name: gameName,
      score: score,
      duration: duration,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error logging game activity:', error);
  }
};

export const logLearningActivity = (moduleName, duration = 10) => {
  try {
    // Update learning stats
    const learningStats = JSON.parse(localStorage.getItem('childLearningStats') || '{"completed": 0, "modules": [], "history": []}');
    
    learningStats.completed = (learningStats.completed || 0) + 1;
    learningStats.modules = [...new Set([...(learningStats.modules || []), moduleName])];
    learningStats.history = [
      ...(learningStats.history || []),
      {
        name: moduleName,
        timestamp: Date.now(),
        type: 'learning'
      }
    ];

    localStorage.setItem('childLearningStats', JSON.stringify(learningStats));

    // Update activity log
    logActivity({
      type: 'learning',
      name: moduleName,
      duration: duration,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error logging learning activity:', error);
  }
};

const logActivity = (activity) => {
  try {
    const activityLog = JSON.parse(localStorage.getItem('childActivityLog') || '[]');
    
    // Keep only last 50 activities to prevent storage overflow
    const updatedLog = [...activityLog, activity].slice(-50);
    
    localStorage.setItem('childActivityLog', JSON.stringify(updatedLog));
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const getChildProgress = () => {
  try {
    const gameStats = JSON.parse(localStorage.getItem('childGameStats') || '{"played": 0, "scores": [], "history": []}');
    const learningStats = JSON.parse(localStorage.getItem('childLearningStats') || '{"completed": 0, "modules": [], "history": []}');
    const activityLog = JSON.parse(localStorage.getItem('childActivityLog') || '[]');

    return {
      games: gameStats,
      learning: learningStats,
      activities: activityLog
    };
  } catch (error) {
    console.error('Error getting child progress:', error);
    return {
      games: { played: 0, scores: [], history: [] },
      learning: { completed: 0, modules: [], history: [] },
      activities: []
    };
  }
};
