import type { DialogueNode } from '../types/game';

// Prologue dialogue based on Valdaren lore
export const prologueDialogue: DialogueNode[] = [
  {
    id: 'awakening',
    speaker: 'Narrator',
    text: `The frost-wrapped world of Valdaren comes into focus as consciousness returns to you.

Snow crunches beneath your feet as you rise from the crystalline ground. Ancient ruins stretch before you, their surfaces covered in glyphs that seem to pulse with a life of their own. 

The cold air carries whispers in a language you don't remember learning, yet somehow understand.`,
    autoAdvance: 'mysterious_figure_approach'
  },
  {
    id: 'mysterious_figure_approach',
    speaker: 'Narrator',
    text: 'A figure emerges from the snow-laden mists, their eyes widening as they see the glyphs around you responding with soft light.',
    autoAdvance: 'kael_greeting'
  },
  {
    id: 'kael_greeting',
    speaker: 'Mysterious Figure',
    text: 'By the First Script... the glyphs sing to you as if... as if you were their creator. Who are you, wanderer?',
    choices: [
      {
        id: 'ask_identity',
        text: 'I wish I knew. My memories are gone.',
        consequences: ['revealed_amnesia'],
        unlocks: ['figure_response_memory']
      },
      {
        id: 'ask_figure_identity',
        text: 'Who are you? What is this place?',
        consequences: ['asked_about_figure'],
        unlocks: ['figure_response_identity']
      },
      {
        id: 'touch_glyph',
        text: '*Touch the nearby glyph and whisper a word*',
        glyphUsed: 'memory_probe',
        requiresLanguages: ['english'],
        consequences: ['used_glyph_early'],
        unlocks: ['figure_response_glyph']
      }
    ]
  },
  {
    id: 'figure_response_memory',
    speaker: 'Mysterious Figure',
    text: 'Lost memories... yet the Ellidric responds to you like it never left. I am Kael, a Keeper of the old ways. You stand in the ruins where language first touched mortal minds.',
    autoAdvance: 'revelation'
  },
  {
    id: 'figure_response_identity', 
    speaker: 'Mysterious Figure',
    text: 'I am Kael, a Keeper of the old ways. This place... these are the Ancient Ruins, where Ellidric first awakened. But you... the glyphs remember you.',
    autoAdvance: 'revelation'
  },
  {
    id: 'figure_response_glyph',
    speaker: 'Kael',
    text: '*His eyes widen as the glyph flares with ancient power* Impossible... even without memory, the Ellidric flows through you like it never left. You are the First Speaker.',
    autoAdvance: 'revelation'
  },
  {
    id: 'revelation',
    speaker: 'Kael',
    text: `The legends speak of one who would return when Valdaren needed them most. The First Speaker - the one who inscribed the first glyphs into living crystal.

The Institute seeks to cage Ellidric in their laboratories. The Clans fight to keep it wild and free. And the Echoborn... they claim the language speaks through them directly.

But if you truly are the First Speaker, then the choice of Valdaren's future rests with you.`,
    autoAdvance: 'language_choice'
  },
  {
    id: 'language_choice',
    speaker: 'Kael', 
    text: `Before you can fully understand your role, you must choose how to begin interpreting Ellidric. Each mortal tongue reveals different aspects of its power.

Which language calls to your awakening mind?`,
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
  },
  {
    id: 'english_interpretation',
    speaker: 'Narrator',
    text: 'English refracts the glyph as a crisp, precise meaning. The runes around you take on sharp clarity - scientific, measurable, controllable.',
    autoAdvance: 'name_input_prompt'
  },
  {
    id: 'dutch_interpretation',
    speaker: 'Narrator', 
    text: 'A warm image flickers through the Dutch lens - domestic memory, comfort by the hearth. The glyphs seem more alive, more connected to human emotion.',
    autoAdvance: 'name_input_prompt'
  },
  {
    id: 'latin_interpretation',
    speaker: 'Narrator',
    text: 'The glyph resonates with ritual cadence through Latin. Ancient ceremonies and sacred bindings echo in your mind, heavy with tradition and power.',
    autoAdvance: 'name_input_prompt'
  },
  {
    id: 'greek_interpretation', 
    speaker: 'Narrator',
    text: 'A sad, beautiful chord answers you through Modern Greek. The weight of ages, of loss and longing, suffuses the ancient symbols with profound melancholy.',
    autoAdvance: 'name_input_prompt'
  },
  {
    id: 'name_input_prompt',
    speaker: 'Kael',
    text: 'The glyphs have accepted your linguistic choice. Now... what shall I call you, First Speaker? What name feels true to your awakening spirit?',
    choices: [
      {
        id: 'enter_name',
        text: '*Enter your name*',
        consequences: ['name_entered'],
        unlocks: ['journey_begins']
      }
    ]
  },
  {
    id: 'journey_begins',
    speaker: 'Kael',
    text: `Welcome, {playerName}. The glyphs hum with recognition at your name.

Your journey to reclaim your identity - and decide Valdaren's fate - begins now. The ruins around us hold memories, but greater challenges await in the three realms of our world.

Will you seek the Institute's structured halls in Ravengard? Follow the Clans' wild songs in the Whispering Woods? Or venture to where the Echoborn commune with living language itself?`,
    autoAdvance: 'hub_transition'
  },
  {
    id: 'hub_transition',
    speaker: 'Narrator',
    text: 'The mystery of your identity and the power of Ellidric lies before you. Ancient knowledge waits to be rediscovered, memories wait to be restored, and the fate of language itself hangs in the balance.',
    choices: [
      {
        id: 'enter_hub',
        text: 'Begin your journey',
        consequences: ['prologue_complete'],
        unlocks: ['hub_main']
      }
    ]
  }
];

// Hub dialogue for navigating the game
export const hubDialogue: DialogueNode[] = [
  {
    id: 'hub_main',
    speaker: 'Narrator',
    text: `You stand at the crossroads of memory and mystery, surrounded by the soft glow of ancient glyphs. The frost-wrapped landscape of Valdaren stretches in all directions, each path leading toward different truths.

The weight of your forgotten knowledge presses at the edges of consciousness. Where will you seek answers?`,
    choices: [
      {
        id: 'open_map',
        text: '🗺️ Study the map of Valdaren',
        consequences: ['opened_map'],
        unlocks: ['world_map']
      },
      {
        id: 'open_lexicon',
        text: '📚 Consult your lexicon of glyphs',
        consequences: ['opened_lexicon'],
        unlocks: ['lexicon_view']
      },
      {
        id: 'memory_dive',
        text: '🧠 Enter a Memory-Dive Chamber',
        consequences: ['entered_memory_dive'],
        unlocks: ['memory_chamber']
      },
      {
        id: 'faction_status',
        text: '⚖️ Review faction influences',
        consequences: ['checked_factions'],
        unlocks: ['faction_overview']
      },
      {
        id: 'language_study',
        text: '🔤 Study linguistic interpretations',
        consequences: ['studied_languages'],
        unlocks: ['language_overview']
      }
    ]
  }
];