// Expanded dialogue content showcasing new systems integration
import type { DialogueNode } from '../types/game';

// Faction-specific dialogue that changes based on reputation
export const factionDialogue: DialogueNode[] = [
  // Institute interactions
  {
    id: 'magistrate_korven_intro',
    speaker: 'Magistrate Korven',
    text: 'Ah, the anomaly. Your unconventional relationship with Ellidric has caught our attention. The Institute values order above all else.',
    choices: [
      {
        id: 'diplomatic_approach',
        text: '🤝 "I seek to understand Ellidric through scholarly pursuit."',
        consequences: ['institute_reputation+10'],
        unlocks: ['institute_research_access']
      },
      {
        id: 'challenge_authority',
        text: '⚔️ "Your rigid methods stifle the true nature of Ellidric."',
        consequences: ['institute_reputation-5', 'clans_reputation+5'],
        unlocks: ['magistrate_rivalry']
      },
      {
        id: 'neutral_stance',
        text: '⚖️ "I believe all approaches to Ellidric have merit."',
        consequences: ['neutral_reputation+5'],
        unlocks: ['diplomatic_path']
      }
    ]
  },
  
  // Clan interactions
  {
    id: 'elder_thane_wisdom',
    speaker: 'Elder Thane',
    text: 'The old words flow through you like water through stone, child. But do you truly understand what you carry?',
    choices: [
      {
        id: 'seek_wisdom',
        text: '🌿 "Teach me the ancient ways, Elder."',
        glyphUsed: 'memory_probe',
        consequences: ['clans_reputation+15', 'learn_verdant_ellidric'],
        unlocks: ['clan_initiation_ritual']
      },
      {
        id: 'question_traditions',
        text: '🤔 "Perhaps the old ways need new understanding."',
        consequences: ['clans_reputation-3', 'institute_reputation+3'],
        unlocks: ['philosophical_debate']
      },
      {
        id: 'show_respect',
        text: '🙏 "I honor the wisdom of the Clans."',
        consequences: ['clans_reputation+8'],
        unlocks: ['elder_blessing']
      }
    ]
  },

  // Echoborn mysterious contact
  {
    id: 'echo_child_encounter',
    speaker: 'The Echo Child',
    text: '[Words beyond translation ripple through your mind: "vel-nethys mor-chronos... the memory-keeper walks among echoes"]',
    choices: [
      {
        id: 'attempt_pure_ellidric',
        text: '👻 [Attempt to respond in Pure Ellidric]',
        requiresLanguages: ['greek', 'latin'],
        glyphUsed: 'ancient_sorrow',
        consequences: ['echoborn_reputation+20', 'unlock_pure_ellidric_fragment'],
        unlocks: ['echo_communication_established']
      },
      {
        id: 'observe_silently',
        text: '👀 [Watch and try to understand]',
        consequences: ['echoborn_reputation+5'],
        unlocks: ['echo_observation_mode']
      },
      {
        id: 'retreat_carefully',
        text: '🚶 [Step back respectfully]',
        consequences: ['echoborn_reputation+2'],
        unlocks: ['echo_cautious_contact']
      }
    ]
  },

  // Character relationship developments
  {
    id: 'lyra_research_collaboration',
    speaker: 'Lyra Veyndral',
    text: 'I\'ve been mapping the Memory Drift Zones, and there\'s something you need to see. The patterns... they respond to you differently than anyone else.',
    choices: [
      {
        id: 'eager_collaboration',
        text: '📚 "Show me everything you\'ve discovered."',
        consequences: ['lyra_trust+15', 'unlock_advanced_memory_techniques'],
        unlocks: ['lyra_secret_research']
      },
      {
        id: 'cautious_interest',
        text: '🔍 "What makes you think I\'m different?"',
        consequences: ['lyra_trust+8'],
        unlocks: ['lyra_explains_theories']
      },
      {
        id: 'request_answers',
        text: '❓ "First, tell me about your sealed memory."',
        requiresLanguages: ['latin'],
        consequences: ['lyra_trust+5', 'lyra_stress+10'],
        unlocks: ['lyra_personal_revelation']
      }
    ]
  },

  // Achievement-unlocked content
  {
    id: 'achievement_master_linguist',
    speaker: 'System Narrator',
    text: 'As the 50th Ellidric phrase resonates in your mind, you feel a fundamental shift. The language is no longer foreign - it has become part of you.',
    choices: [
      {
        id: 'embrace_mastery',
        text: '✨ [Feel the power of linguistic mastery]',
        consequences: ['unlock_master_linguist_abilities', 'all_factions_respect+5'],
        unlocks: ['master_linguist_dialogue_options']
      }
    ]
  },

  // Multi-faction meeting (unlocked through diplomatic achievements)
  {
    id: 'diplomatic_summit',
    speaker: 'Ambassador Elyn',
    text: 'Representatives from all factions have agreed to meet at Lake Eirysa. Your growing reputation has made this possible.',
    choices: [
      {
        id: 'facilitate_peace',
        text: '🕊️ "Let us find common ground in our love of Ellidric."',
        requiresLanguages: ['english', 'dutch', 'latin', 'greek'],
        consequences: ['all_factions_respect+10', 'unlock_unity_path'],
        unlocks: ['diplomatic_victory_route']
      },
      {
        id: 'exploit_tensions',
        text: '⚡ "Each faction\'s approach has strengths we can leverage."',
        consequences: ['neutral_reputation+15', 'political_advantage+1'],
        unlocks: ['manipulator_path']
      },
      {
        id: 'seek_truth',
        text: '🔍 "We must focus on uncovering the truth about the First Speaker."',
        glyphUsed: 'truth_reveal',
        consequences: ['unlock_truth_seeker_path'],
        unlocks: ['first_speaker_investigation']
      }
    ]
  }
];

// Dynamic dialogue that changes based on faction standing
export const getDynamicFactionDialogue = (factionReputation: Record<string, number>): DialogueNode[] => {
  const dynamicNodes: DialogueNode[] = [];

  // High Institute reputation unlocks this
  if (factionReputation.institute >= 75) {
    dynamicNodes.push({
      id: 'institute_inner_circle',
      speaker: 'Chief Archivist Vex',
      text: 'Your dedication to scholarly pursuit has earned you access to the Restricted Archive. Here lie the Institute\'s deepest secrets about Ellidric.',
      choices: [
        {
          id: 'access_forbidden_knowledge',
          text: '📖 [Study the forbidden texts]',
          consequences: ['unlock_institute_secrets', 'forbidden_knowledge+1'],
          unlocks: ['institute_secret_ending_path']
        }
      ]
    });
  }

  // High Clan reputation unlocks this
  if (factionReputation.clans >= 75) {
    dynamicNodes.push({
      id: 'clan_sacred_ritual',
      speaker: 'Moonwhisper Kira',
      text: 'The Spirits have spoken. You are ready for the Rite of Memory-Song, where we shall awaken the deepest echoes within you.',
      choices: [
        {
          id: 'undergo_ritual',
          text: '🌙 [Participate in the sacred ritual]',
          glyphUsed: 'childhood_song',
          consequences: ['unlock_clan_secrets', 'spiritual_awakening+1'],
          unlocks: ['clan_secret_ending_path']
        }
      ]
    });
  }

  // High Echoborn reputation unlocks this
  if (factionReputation.echoborn >= 50) {
    dynamicNodes.push({
      id: 'echoborn_revelation',
      speaker: 'Glyph-Heart Zara',
      text: '[Pure Ellidric flows like music] You begin to see... the glyphs did not create us. We created the glyphs. And you... you are the key to remembering.',
      choices: [
        {
          id: 'accept_truth',
          text: '👁️ [Open your mind to the revelation]',
          requiresLanguages: ['greek'],
          consequences: ['unlock_echoborn_secrets', 'reality_understanding+1'],
          unlocks: ['echoborn_secret_ending_path']
        }
      ]
    });
  }

  return dynamicNodes;
};

// Character-specific trust-based dialogue
export const getCharacterTrustDialogue = (characterTrust: Record<string, number>): DialogueNode[] => {
  const trustNodes: DialogueNode[] = [];

  // Lyra high trust
  if (characterTrust.lyra >= 80) {
    trustNodes.push({
      id: 'lyra_deepest_secret',
      speaker: 'Lyra Veyndral',
      text: 'I... I need to tell you something. The sealed memory I carry... it\'s not just any memory. It\'s the moment the First Speaker died. And I think... I think you might be their reincarnation.',
      choices: [
        {
          id: 'accept_destiny',
          text: '✨ "I feel the truth of it in my bones."',
          consequences: ['unlock_first_speaker_memories', 'lyra_trust+20'],
          unlocks: ['first_speaker_revelation_path']
        },
        {
          id: 'deny_possibility',
          text: '❌ "That\'s impossible. I\'m just... me."',
          consequences: ['lyra_trust-10', 'self_doubt+5'],
          unlocks: ['denial_character_arc']
        }
      ]
    });
  }

  // Aria high trust
  if (characterTrust.aria >= 90) {
    trustNodes.push({
      id: 'aria_partnership_proposal',
      speaker: 'Aria Stormwind',
      text: 'We\'ve learned so much together. I want to propose something radical - what if we left all the factions behind and founded our own school of Ellidric study?',
      choices: [
        {
          id: 'accept_partnership',
          text: '💫 "Together, we could revolutionize understanding of Ellidric."',
          consequences: ['unlock_independent_path', 'aria_trust+30'],
          unlocks: ['independent_scholar_ending']
        },
        {
          id: 'stay_committed',
          text: '🤝 "The factions need our help more than we need independence."',
          consequences: ['aria_trust+10', 'all_factions_respect+5'],
          unlocks: ['reformer_path']
        }
      ]
    });
  }

  return trustNodes;
};

export { factionDialogue };
