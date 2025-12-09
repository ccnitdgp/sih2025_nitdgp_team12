import { useState, useEffect, useRef, useCallback } from 'react';
import { noticesManager, type Notice } from '@/lib/notices-config';

/**
 * Custom hook for managing notice display with error handling and optimizations
 */
export interface UseNoticesReturn {
  currentNotice: string;
  showNotices: boolean;
  currentNoticeIndex: number;
  totalActiveNotices: number;
  error: string | null;
  // Control functions
  resetNotices: () => void;
  nextNotice: () => void;
  pauseNotices: () => void;
  resumeNotices: () => void;
}

/**
 * Configuration for the useNotices hook
 */
interface UseNoticesConfig {
  enableAutoAdvance?: boolean;
  enableErrorRecovery?: boolean;
  debugMode?: boolean;
}

/**
 * Custom hook for managing notices with comprehensive error handling and optimizations
 */
export function useNotices(config: UseNoticesConfig = {}): UseNoticesReturn {
  const {
    enableAutoAdvance = true,
    enableErrorRecovery = true,
    debugMode = false
  } = config;

  // State management with proper typing
  const [showNotices, setShowNotices] = useState(false);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Refs for managing timers and cleanup
  const timersRef = useRef<{
    initialTimer?: NodeJS.Timeout;
    advanceTimer?: NodeJS.Timeout;
    fallbackTimer?: NodeJS.Timeout;
  }>({});

  const isMountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Get current notice content with error handling
  const getCurrentNoticeContent = useCallback((index: number): string => {
    try {
      if (!isMountedRef.current) return '';
      
      const content = noticesManager.getNoticeContent(index);
      const activeCount = noticesManager.getActiveNotices().length;
      
      if (debugMode) {
        console.log('🔔 Notice System:', {
          currentIndex: index,
          activeNotices: activeCount,
          content: content.substring(0, 50) + '...'
        });
      }

      return content;
    } catch (err) {
      const errorMessage = `Failed to get notice content: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMessage);
      
      if (enableErrorRecovery && retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        if (debugMode) console.warn(`🔄 Retrying notice fetch (attempt ${retryCountRef.current})`);
        
        // Reset to first notice on error
        setCurrentNoticeIndex(0);
        return noticesManager.getNoticeContent(0);
      }
      
      return '⚠️ System Notice: Unable to load notices. Please refresh the page.';
    }
  }, [debugMode, enableErrorRecovery]);

  // Advance to next notice with bounds checking
  const advanceToNextNotice = useCallback(() => {
    try {
      if (!isMountedRef.current || isPaused) return;

      const nextIndex = noticesManager.getNextNoticeIndex(currentNoticeIndex);
      
      if (nextIndex === -1) {
        // No more notices to show
        setShowNotices(false);
        setCurrentNoticeIndex(0);
        return;
      }

      setCurrentNoticeIndex(nextIndex);
      
      // Clear and reset fallback timer
      if (timersRef.current.fallbackTimer) {
        clearTimeout(timersRef.current.fallbackTimer);
      }
      
      timersRef.current.fallbackTimer = setTimeout(() => {
        if (isMountedRef.current && !isPaused) {
          advanceToNextNotice();
        }
      }, noticesManager.getConfig().maxDisplayTime);

    } catch (err) {
      const errorMessage = `Failed to advance notice: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMessage);
      setShowNotices(false);
    }
  }, [currentNoticeIndex, isPaused]);

  // Reset notices system
  const resetNotices = useCallback(() => {
    try {
      // Clear all timers
      Object.values(timersRef.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
      
      timersRef.current = {};
      retryCountRef.current = 0;
      setError(null);
      setCurrentNoticeIndex(0);
      setShowNotices(false);
      setIsPaused(false);
      
      if (debugMode) {
        console.log('🔄 Notices system reset');
      }
    } catch (err) {
      console.error('Failed to reset notices:', err);
    }
  }, [debugMode]);

  // Pause notice advancement
  const pauseNotices = useCallback(() => {
    setIsPaused(true);
    if (timersRef.current.advanceTimer) {
      clearTimeout(timersRef.current.advanceTimer);
      timersRef.current.advanceTimer = undefined;
    }
  }, []);

  // Resume notice advancement
  const resumeNotices = useCallback(() => {
    setIsPaused(false);
    // Restart the auto-advance timer if enabled
    if (enableAutoAdvance && showNotices) {
      timersRef.current.advanceTimer = setTimeout(() => {
        if (isMountedRef.current && !isPaused) {
          advanceToNextNotice();
        }
      }, noticesManager.getConfig().autoAdvanceDelay);
    }
  }, [enableAutoAdvance, showNotices, advanceToNextNotice, isPaused]);

  // Manual next notice function
  const nextNotice = useCallback(() => {
    advanceToNextNotice();
  }, [advanceToNextNotice]);

  // Initialize notices system
  useEffect(() => {
    isMountedRef.current = true;
    const config = noticesManager.getConfig();

    try {
      // Check if there are any active notices
      const activeNotices = noticesManager.getActiveNotices();
      if (activeNotices.length === 0) {
        if (debugMode) {
          console.log('ℹ️ No active notices found');
        }
        return;
      }

      // Set initial timer
      timersRef.current.initialTimer = setTimeout(() => {
        if (isMountedRef.current) {
          setShowNotices(true);
          retryCountRef.current = 0; // Reset retry count on successful start
        }
      }, config.initialDelay);

      // Set auto-advance timer
      if (enableAutoAdvance) {
        timersRef.current.advanceTimer = setTimeout(() => {
          if (isMountedRef.current && !isPaused) {
            advanceToNextNotice();
          }
        }, config.autoAdvanceDelay);
      }

    } catch (err) {
      const errorMessage = `Failed to initialize notices: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMessage);
      if (debugMode) {
        console.error('❌ Notice initialization failed:', err);
      }
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      
      // Clear all timers
      Object.values(timersRef.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
      
      timersRef.current = {};
    };
  }, [advanceToNextNotice, enableAutoAdvance, debugMode, isPaused]);

  // Monitor for index changes and validate
  useEffect(() => {
    if (!showNotices) return;

    const activeNotices = noticesManager.getActiveNotices();
    if (!noticesManager.isValidIndex(currentNoticeIndex)) {
      if (debugMode) {
        console.warn('⚠️ Invalid notice index, resetting to 0');
      }
      setCurrentNoticeIndex(0);
    }
  }, [currentNoticeIndex, showNotices, debugMode]);

  // Calculate current notice content
  const currentNotice = getCurrentNoticeContent(currentNoticeIndex);
  const totalActiveNotices = noticesManager.getActiveNotices().length;

  return {
    currentNotice,
    showNotices,
    currentNoticeIndex,
    totalActiveNotices,
    error,
    resetNotices,
    nextNotice,
    pauseNotices,
    resumeNotices
  };
}