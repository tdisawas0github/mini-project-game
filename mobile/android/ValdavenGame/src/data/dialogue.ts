import type { DialogueNode } from '../types/game';

export const prologueChapter: DialogueNode[] = [
  {
    id: 'prologue_start',
    speaker: 'Narrator',
    text: `You awaken in snow, frost clinging to your breath. 
    
    The world feels... familiar yet strange. Ancient glyphs carved into nearby stones hum softly, responding to your presence as if recognizing an old friend.
    
    A figure approaches through the mist.`,
    autoAdvance: 'prologue_figure'
  },
  {
    id: 'prologue_figure',
    speaker: 'Mysterious Figure',
    text: 'You... you\'re awake. The glyphs told me you would return, but I hardly dared believe.',
    choices: [
      {
        id: 'who_are_you',
        text: 'Who are you?',
        consequences: ['asked_identity']
      },
      {
        id: 'return_from_where',
        text: 'Return from where? I don\'t remember...',
        consequences: ['revealed_memory_loss']
      },
      {
        id: 'use_glyph',
        text: '*Touch the nearby glyph and whisper a word*',
        glyphUsed: 'memory_probe',
        requiresLanguages: ['english'],
        consequences: ['used_glyph_early'],
        unlocks: ['m_intro']
      }
    ]
  },
  {
    id: 'figure_response_identity',
    speaker: 'Mysterious Figure',
    text: 'I am Kael, a Keeper of the old ways. But more importantly... you are the one the glyphs remember. The First Speaker.',
    autoAdvance: 'name_input_prompt'
  },
  {
    id: 'figure_response_memory',
    speaker: 'Mysterious Figure', 
    text: 'From the time before. When language itself bent to your will. The glyphs... they\'ve been waiting.',
    autoAdvance: 'name_input_prompt'
  },
  {
    id: 'figure_response_glyph',
    speaker: 'Mysterious Figure',
    text: '*His eyes widen as the glyph flares with ancient power* Impossible... even without memory, the Ellidric flows through you like it never left.',
    autoAdvance: 'name_input_prompt'
  },
  {
    id: 'name_input_prompt',
    speaker: 'Kael',
    text: 'What shall I call you, Speaker? What name feels... right?',
    choices: [
      {
        id: 'choose_name',
        text: '✍️ Choose your name',
        consequences: ['name_chosen']
      }
    ]
  }
];

export const languageSelectionScene: DialogueNode[] = [
  {
    id: 'language_selection',
    speaker: 'Kael',
    text: `Before we proceed further, you must choose how to begin interpreting the Ellidric glyphs around us. 
    
    Each mortal tongue reveals different aspects of the ancient language. Choose wisely - your first interpretation will color all that follows.`,
    choices: [
      {
        id: 'choose_english',
        text: 'English - Seek precision and clarity',
        consequences: ['learned_english'],
        unlocks: ['english_interpretation']
      },
      {
        id: 'choose_dutch',
        text: 'Dutch - Embrace warmth and familiarity', 
        consequences: ['learned_dutch'],
        unlocks: ['dutch_interpretation']
      },
      {
        id: 'choose_latin',
        text: 'Classical Latin - Channel ritual and tradition',
        consequences: ['learned_latin'], 
        unlocks: ['latin_interpretation']
      },
      {
        id: 'choose_greek',
        text: 'Modern Greek - Feel the weight of ancient sorrow',
        consequences: ['learned_greek'],
        unlocks: ['greek_interpretation']
      }
    ]
  }
];

export const hubScene: DialogueNode[] = [
  {
    id: 'hub_main',
    speaker: 'Narrator',
    text: `You stand at the crossroads of memory and mystery. Ancient glyphs pulse with soft light around you, and the weight of forgotten knowledge presses at the edges of your consciousness.
    
    What do you choose to explore?`,
    choices: [
      { id: 'open_map', text: '🗺️ Study the map of Valdaren', consequences: ['opened_map'] },
      { id: 'open_lexicon', text: '📚 Consult your lexicon of glyphs', consequences: ['opened_lexicon'] },
      { id: 'memory_dive', text: '🧠 Enter a Memory-Dive Chamber', consequences: ['entered_memory_dive'] },
      { id: 'check_languages', text: '🔤 Review known languages', consequences: ['checked_languages'] },
      { id: 'view_consequences', text: '🌊 Examine the ripples of your choices', consequences: ['viewed_consequences'] }
    ]
  }
];