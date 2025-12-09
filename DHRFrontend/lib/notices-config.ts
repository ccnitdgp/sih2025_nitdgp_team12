// Notice configuration and type definitions
export interface Notice {
  id: string;
  type: 'alert' | 'info' | 'emergency' | 'general';
  content: string;
  priority: 'high' | 'medium' | 'low';
  displayDuration: number; // in milliseconds
  autoAdvance: boolean;
  createdAt?: Date;
  expiresAt?: Date;
}

export interface NoticesConfig {
  initialDelay: number; // milliseconds before showing first notice
  autoAdvanceDelay: number; // milliseconds before advancing to next notice
  maxDisplayTime: number; // maximum time to show a notice (fallback)
  enableCycle: boolean; // whether to cycle through notices
  notices: Notice[];
}

// Default notices configuration
export const NOTICES_CONFIG: NoticesConfig = {
  initialDelay: 2000, // 2 seconds
  autoAdvanceDelay: 30000, // 30 seconds
  maxDisplayTime: 35000, // 35 seconds (fallback)
  enableCycle: true,
  notices: [
    {
      id: 'important-notice-001',
      type: 'alert',
      priority: 'high',
      content: '🚨 महत्वपूर्ण अधिसूचना | IMPORTANT PUBLIC NOTICE: सभी प्रवासी श्रमिकों के लिए आवश्यक सेवाएँ, पहचान सत्यापन, स्वास्थ्य सहायता, और आपातकालीन समर्थन अब इस पोर्टल पर एक ही स्थान पर उपलब्ध हैं। सरकार द्वारा निर्धारित सुरक्षा मानकों के अनुसार श्रमिकों का पंजीकरण और नियमित अपडेट अनिवार्य है ताकि किसी भी आपदा या आवश्यकता की स्थिति में तुरंत सहायता प्रदान की जा सके।',
      displayDuration: 30000,
      autoAdvance: true,
      createdAt: new Date('2024-12-09'),
      expiresAt: new Date('2024-12-31')
    },
    {
      id: 'helpline-notice-001',
      type: 'emergency',
      priority: 'high',
      content: '📞 टोल-फ्री हेल्पलाइन: 1800-123-4567 | Toll-Free Helpline: 1800-123-4567: आपातकालीन सहायता सेवाएँ 24×7 उपलब्ध हैं। सभी श्रमिकों से अनुरोध है कि अपने दस्तावेज़ अपडेट रखें और किसी भी समस्या के लिए हेल्पलाइन पर संपर्क करें।',
      displayDuration: 30000,
      autoAdvance: true,
      createdAt: new Date('2024-12-09'),
      expiresAt: new Date('2024-12-31')
    }
  ]
};

// Utility functions for notice management
export class NoticesManager {
  private config: NoticesConfig;
  
  constructor(config: NoticesConfig = NOTICES_CONFIG) {
    this.config = config;
  }

  /**
   * Get active notices (not expired)
   */
  getActiveNotices(): Notice[] {
    const now = new Date();
    return this.config.notices.filter(notice => {
      if (notice.expiresAt && now > notice.expiresAt) {
        return false;
      }
      return true;
    });
  }

  /**
   * Get notice by ID safely
   */
  getNoticeById(id: string): Notice | null {
    return this.config.notices.find(notice => notice.id === id) || null;
  }

  /**
   * Get next notice index with bounds checking
   */
  getNextNoticeIndex(currentIndex: number): number {
    const activeNotices = this.getActiveNotices();
    
    if (activeNotices.length === 0) {
      return -1; // No active notices
    }

    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= activeNotices.length) {
      return this.config.enableCycle ? 0 : -1; // Cycle or end
    }
    
    return nextIndex;
  }

  /**
   * Validate notice index
   */
  isValidIndex(index: number): boolean {
    const activeNotices = this.getActiveNotices();
    return index >= 0 && index < activeNotices.length;
  }

  /**
   * Get notice content safely with fallback
   */
  getNoticeContent(index: number): string {
    const activeNotices = this.getActiveNotices();
    
    if (!this.isValidIndex(index) || activeNotices.length === 0) {
      return this.getFallbackNotice();
    }
    
    return activeNotices[index].content;
  }

  /**
   * Get fallback notice content
   */
  private getFallbackNotice(): string {
    return '⚠️ System Notice: Please contact support if you continue to see this message.';
  }

  /**
   * Get configuration values
   */
  getConfig() {
    return {
      initialDelay: this.config.initialDelay,
      autoAdvanceDelay: this.config.autoAdvanceDelay,
      maxDisplayTime: this.config.maxDisplayTime,
      enableCycle: this.config.enableCycle
    };
  }
}

// Export singleton instance for use across the application
export const noticesManager = new NoticesManager();