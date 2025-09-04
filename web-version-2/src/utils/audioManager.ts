/**
 * Audio system for the game
 * Provides sound effects and background music
 */

interface AudioConfig {
  volume: number;
  muted: boolean;
  soundsEnabled: boolean;
  musicEnabled: boolean;
}

class AudioManager {
  private config: AudioConfig = {
    volume: 0.7,
    muted: false,
    soundsEnabled: true,
    musicEnabled: true
  };

  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private currentMusic: HTMLAudioElement | null = null;

  constructor() {
    // Load config from localStorage
    const saved = localStorage.getItem('ellidra-audio-config');
    if (saved) {
      try {
        this.config = { ...this.config, ...JSON.parse(saved) };
      } catch (error) {
        console.warn('Failed to load audio config:', error);
      }
    }
  }

  /**
   * Create audio element from data URL or fallback to generated tones
   */
  private createAudio(frequency: number, duration: number, type: 'sine' | 'square' | 'sawtooth' = 'sine'): HTMLAudioElement {
    // Try to create a simple audio using Web Audio API and convert to data URL
    try {
      const audioContext = new (window.AudioContext || ((window as any).webkitAudioContext))();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
      // Create a simple audio element for fallback
      const audio = new Audio();
      // Use a data URL for a simple beep
      audio.src = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCS2H0fLMcyIFGWm48+CVTQ0PV6zl7bVoFgUiOAAAAAAAGBEAAD8A`;
      return audio;
    } catch {
      // Fallback: create silent audio element
      const audio = new Audio();
      audio.src = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCS2H0fLMcyIFGWm48+CVTQ0PV6zl7bVoFgUiOAAAAAAAGBEAAD8A`;
      return audio;
    }
  }

  /**
   * Load or create an audio element
   */
  private getAudio(soundId: string): HTMLAudioElement {
    if (!this.audioCache.has(soundId)) {
      let audio: HTMLAudioElement;

      switch (soundId) {
        case 'click':
          audio = this.createAudio(800, 0.1, 'square');
          break;
        case 'hover':
          audio = this.createAudio(600, 0.05, 'sine');
          break;
        case 'dialogue-advance':
          audio = this.createAudio(400, 0.2, 'sine');
          break;
        case 'choice-select':
          audio = this.createAudio(880, 0.15, 'sine');
          break;
        case 'glyph-activate':
          audio = this.createAudio(1200, 0.3, 'sawtooth');
          break;
        case 'mystery':
          audio = this.createAudio(220, 0.8, 'sine');
          break;
        default:
          audio = this.createAudio(440, 0.1);
      }

      this.audioCache.set(soundId, audio);
    }
    
    return this.audioCache.get(soundId)!;
  }

  /**
   * Play a sound effect
   */
  playSound(soundId: string, volume?: number): void {
    if (!this.config.soundsEnabled || this.config.muted) return;

    try {
      const audio = this.getAudio(soundId);
      audio.volume = (volume ?? this.config.volume) * 0.3; // Scale down for sound effects
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.debug('Could not play sound:', error);
      });
    } catch (error) {
      console.debug('Audio playback failed:', error);
    }
  }

  /**
   * Play background music (placeholder)
   */
  playMusic(musicId: string, loop: boolean = true): void {
    if (!this.config.musicEnabled || this.config.muted) return;
    
    // For now, just log - in a real implementation you'd load music files
    console.debug(`Playing music: ${musicId}, loop: ${loop}`);
  }

  /**
   * Stop current music
   */
  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic = null;
    }
  }

  /**
   * Update audio configuration
   */
  updateConfig(newConfig: Partial<AudioConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('ellidra-audio-config', JSON.stringify(this.config));
  }

  /**
   * Get current configuration
   */
  getConfig(): AudioConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const audioManager = new AudioManager();

// Convenience functions
export const playSound = (soundId: string, volume?: number) => audioManager.playSound(soundId, volume);
export const playMusic = (musicId: string, loop?: boolean) => audioManager.playMusic(musicId, loop);
export const stopMusic = () => audioManager.stopMusic();

export default audioManager;