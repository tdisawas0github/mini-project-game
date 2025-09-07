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
      },
      {
        id: 'continue_story',
        text: '📖 Continue your journey',
        consequences: ['story_continued'],
        unlocks: ['chapter1_start']
      }
    ]
  }
];

// Chapter 1: Institute Arc - Meeting Kaelen Dravik
export const chapter1Dialogue: DialogueNode[] = [
  {
    id: 'chapter1_start',
    speaker: 'Narrator',
    text: `The ancient ruins fade behind you as you venture toward the structured halls of Ravengard, stronghold of the Institute of Lingua Arcanum.
    
Snow-laden pathways give way to cobblestone streets lined with towering spires inscribed with carefully regulated Ellidric formulae. The contrast with the wild, living glyphs of the ruins is stark - here, every symbol is precise, catalogued, controlled.`,
    autoAdvance: 'ravengard_approach'
  },
  {
    id: 'ravengard_approach',
    speaker: 'Narrator',
    text: `As you approach the main gate, a figure in the dark blue robes of an Institute Enforcer steps forward. His stance is rigid, disciplined - everything about him speaks of unwavering loyalty to hierarchy and order.
    
The glyphs on his uniform pulse with measured light, each one perfectly aligned with Institute standards.`,
    autoAdvance: 'kaelen_introduction'
  },
  {
    id: 'kaelen_introduction',
    speaker: 'Kaelen Dravik',
    text: `Halt. State your business in Ravengard, wanderer. I am Enforcer Kaelen Dravik, and these halls are not for the unschooled.
    
*He pauses, studying you intently* Yet... there's something about the way the glyphs respond to your presence. Even our regulated symbols seem to... recognize you somehow.`,
    choices: [
      {
        id: 'reveal_identity',
        text: 'I am the First Speaker, awakened to understand my role.',
        consequences: ['revealed_first_speaker_to_kaelen', 'kaelen_shock'],
        unlocks: ['kaelen_first_speaker_response']
      },
      {
        id: 'ask_about_institute',
        text: 'I seek to understand how the Institute approaches Ellidric.',
        consequences: ['diplomatic_approach'],
        unlocks: ['kaelen_institute_explanation']
      },
      {
        id: 'challenge_authority',
        text: 'Your regulations cannot contain the true power of Ellidric.',
        glyphUsed: 'authority_challenge',
        requiresLanguages: ['english'],
        consequences: ['challenged_institute', 'kaelen_defensive'],
        unlocks: ['kaelen_defensive_response']
      }
    ]
  },
  {
    id: 'kaelen_first_speaker_response',
    speaker: 'Kaelen Dravik',
    text: `*His eyes widen, hand instinctively moving to the glyph-sword at his side* Impossible. The First Speaker is legend, myth... 
    
*He studies the glyphs around you, watching them pulse with unprecedented resonance* By the Codified Script... if you truly are... then everything the Institute believes about controlling Ellidric may be...
    
No. Order must be maintained. If you claim such power, then you must understand the responsibility that comes with it.`,
    choices: [
      {
        id: 'accept_responsibility',
        text: 'I understand the weight of this power. Show me your methods.',
        consequences: ['accepted_institute_perspective', 'kaelen_respect_gained'],
        unlocks: ['institute_tour']
      },
      {
        id: 'question_control',
        text: 'Control? The glyphs were never meant to be caged.',
        consequences: ['questioned_institute_methods', 'kaelen_conflicted'],
        unlocks: ['kaelen_doubt_seeds']
      }
    ]
  },
  {
    id: 'kaelen_institute_explanation',
    speaker: 'Kaelen Dravik',
    text: `The Institute brings order to chaos. Before our codification, Ellidric was wild, unpredictable - people's memories would shift like sand in a storm.
    
We have built Memory Engines that stabilize the glyphs' effects. We have catalogued safe usage patterns. We have prevented another Memory War.
    
*His voice softens slightly* Though I admit, your presence here... the glyphs respond to you as they do to no other. Perhaps you have insights we lack.`,
    choices: [
      {
        id: 'praise_institute',
        text: 'Your dedication to stability is admirable.',
        consequences: ['praised_institute', 'kaelen_pleased'],
        unlocks: ['institute_ally_path']
      },
      {
        id: 'suggest_balance',
        text: 'Perhaps stability and freedom need not be enemies.',
        consequences: ['suggested_middle_path', 'kaelen_intrigued'],
        unlocks: ['kaelen_philosophical_discussion']
      },
      {
        id: 'critique_methods',
        text: 'But at what cost? You\'ve turned living language into mere formulas.',
        consequences: ['critiqued_institute', 'kaelen_defensive'],
        unlocks: ['kaelen_defensive_response']
      }
    ]
  },
  {
    id: 'kaelen_defensive_response',
    speaker: 'Kaelen Dravik',
    text: `*His hand tightens on his weapon, but hesitates* You speak like the Clan insurgents... yet the glyphs sing differently around you.
    
Order is not oppression! Before the Institute, children forgot their parents' faces overnight! Entire communities lost their histories to corrupted glyphs!
    
*He struggles with inner conflict* But if you truly have the authority to judge our methods... show me. Prove that chaos can be better than order.`,
    choices: [
      {
        id: 'demonstrate_harmony',
        text: '*Speak a glyph that balances order and freedom*',
        glyphUsed: 'harmonic_balance',
        requiresLanguages: ['english', 'dutch'],
        consequences: ['demonstrated_balance', 'kaelen_amazed'],
        unlocks: ['kaelen_conversion_begin']
      },
      {
        id: 'acknowledge_fear',
        text: 'Your fear of chaos comes from genuine care for people.',
        consequences: ['acknowledged_kaelen_motivation', 'kaelen_softened'],
        unlocks: ['kaelen_personal_revelation']
      },
      {
        id: 'maintain_challenge',
        text: 'True order cannot be imposed - it must grow from understanding.',
        consequences: ['maintained_philosophical_stance', 'kaelen_frustrated'],
        unlocks: ['kaelen_conflict_escalates']
      }
    ]
  },
  {
    id: 'kaelen_personal_revelation',
    speaker: 'Kaelen Dravik',
    text: `*His rigid posture softens slightly* You... see more than most. Yes, I lost my sister to a Memory Drift in the early days. She woke one morning unable to recognize her own reflection.
    
The Institute saved what remained of her identity, gave her purpose in the Archives. But the sister I knew... she was lost to uncontrolled Ellidric forever.
    
*He looks at you with new respect* If you truly are the First Speaker, perhaps you can succeed where rigid control has merely... contained the damage.`,
    choices: [
      {
        id: 'offer_healing',
        text: 'Show me to her. Perhaps together we can restore what was lost.',
        glyphUsed: 'memory_restoration',
        consequences: ['offered_to_help_sister', 'kaelen_hope_kindled'],
        unlocks: ['sister_healing_subplot']
      },
      {
        id: 'understand_pain',
        text: 'Your dedication to preventing such loss is noble, even if the methods are flawed.',
        consequences: ['understood_kaelen_pain', 'mutual_respect_established'],
        unlocks: ['kaelen_alliance_possible']
      },
      {
        id: 'suggest_new_way',
        text: 'Perhaps there\'s a path between wild chaos and rigid control.',
        consequences: ['suggested_third_path', 'kaelen_contemplative'],
        unlocks: ['institute_reform_possibility']
      }
    ]
  }
];

// Chapter 2: Clan Arc - Meeting Serai in Whispering Woods
export const chapter2Dialogue: DialogueNode[] = [
  {
    id: 'chapter2_start',
    speaker: 'Narrator',
    text: `Leaving the structured halls of Ravengard behind, you venture into the Whispering Woods where the Clans maintain their ancient ways.
    
Here, the very air seems alive with unwritten words. Glyphs grow like moss on bark, shift like shadows in moonlight, and sing with voices that have never been catalogued or codified.
    
The path is not marked by stones but by the subtle music of living language itself.`,
    autoAdvance: 'woods_entrance'
  },
  {
    id: 'woods_entrance',
    speaker: 'Narrator',
    text: `As you deeper into the woods, a figure emerges from behind a massive oak whose trunk bears glyphs that pulse in rhythm with the tree's heartbeat.
    
She moves with the fluid grace of one who has learned to speak the language of the forest itself. Her words carry layers of meaning, like echoes within echoes.`,
    autoAdvance: 'serai_introduction'
  },
  {
    id: 'serai_introduction',
    speaker: 'Serai of the Whispering Woods',
    text: `*Her voice carries the cadence of ancient songs* Welcome, Speaker-of-Many-Tongues, to the place where words still breathe.
    
The trees whispered of your coming - they remember when you first taught language to dream. Though you wear forgetting like winter's cloak, the forest knows your true name.
    
~Will you listen to what the living glyphs would teach?~`,
    choices: [
      {
        id: 'embrace_forest_wisdom',
        text: 'Teach me the ways of living language.',
        consequences: ['accepted_clan_teaching', 'serai_pleased'],
        unlocks: ['living_glyph_lesson']
      },
      {
        id: 'question_methods',
        text: 'How can unwritten words be trusted to carry truth?',
        consequences: ['questioned_oral_tradition', 'serai_thoughtful'],
        unlocks: ['serai_defends_tradition']
      },
      {
        id: 'share_institute_perspective',
        text: 'The Institute has shown me the importance of structure and stability.',
        consequences: ['mentioned_institute_training', 'serai_concerned'],
        unlocks: ['serai_institute_warning']
      }
    ]
  },
  {
    id: 'living_glyph_lesson',
    speaker: 'Serai of the Whispering Woods',
    text: `*She places her hand on the oak's bark, and the glyphs pulse brighter* Watch, First Speaker. Living glyphs grow, change, adapt to need and season.
    
This glyph once meant "endurance" to a child facing winter. But as that child grew, it transformed to mean "patient wisdom." Now it whispers "deep roots" to the young mother who rests here.
    
~The Institute would cage this growth in stone and ink. We let it breathe.~`,
    choices: [
      {
        id: 'marvel_at_growth',
        text: 'The beauty of that evolution is breathtaking.',
        glyphUsed: 'appreciation_resonance',
        consequences: ['marveled_at_living_glyphs', 'serai_warm'],
        unlocks: ['deeper_clan_mysteries']
      },
      {
        id: 'concern_about_change',
        text: 'But how can meaning be preserved if it constantly changes?',
        consequences: ['worried_about_meaning_drift', 'serai_understanding'],
        unlocks: ['serai_explains_preservation']
      },
      {
        id: 'try_to_commune',
        text: '*Touch the oak and try to feel its living words*',
        glyphUsed: 'forest_communion',
        requiresLanguages: ['dutch'],
        consequences: ['communed_with_forest', 'unlocked_nature_speech'],
        unlocks: ['forest_spirit_dialogue']
      }
    ]
  },
  {
    id: 'serai_defends_tradition',
    speaker: 'Serai of the Whispering Woods',
    text: `*Her eyes flash with gentle fire* Truth carved in stone is truth already dead, First Speaker. The wind changes, seasons turn, hearts grow - should language not grow with them?
    
Our children learn not rigid formulas but the music beneath meaning. They hear the sorrow-song that turns to joy-dance when winter yields to spring.
    
The Institute's "perfect preservation" preserves only corpses of words. We keep the living spirit.`,
    choices: [
      {
        id: 'see_both_sides',
        text: 'Perhaps both preservation and growth have their place.',
        consequences: ['acknowledged_both_perspectives', 'serai_intrigued'],
        unlocks: ['philosophical_bridge_building']
      },
      {
        id: 'defend_structure',
        text: 'But without structure, how do you prevent dangerous distortions?',
        consequences: ['defended_institute_concerns', 'serai_patient'],
        unlocks: ['serai_addresses_fears']
      },
      {
        id: 'embrace_clan_way',
        text: 'You\'re right. Language should be alive, not imprisoned.',
        consequences: ['fully_embraced_clan_philosophy', 'serai_joyful'],
        unlocks: ['clan_initiation_offer']
      }
    ]
  }
];

// Memory Dive Scenes
export const memoryDiveDialogue: DialogueNode[] = [
  {
    id: 'memory_chamber_entry',
    speaker: 'Narrator',
    text: `You step into the crystalline chamber where memories take physical form. The walls pulse with a soft, ethereal light, and fragments of half-remembered dreams float like luminous butterflies in the air.
    
In the center of the room, a pool of liquid starlight reflects scenes from a past you cannot quite grasp. This is where memories can be explored, understood - or altered forever.`,
    choices: [
      {
        id: 'enter_first_memory',
        text: 'Dive into the earliest memory fragment',
        glyphUsed: 'memory_dive',
        consequences: ['entered_first_memory'],
        unlocks: ['memory_first_speaker_origin']
      },
      {
        id: 'examine_chamber',
        text: 'Study the chamber\'s construction and purpose',
        consequences: ['studied_chamber'],
        unlocks: ['chamber_lore']
      },
      {
        id: 'resist_temptation',
        text: 'Perhaps some memories are better left undisturbed',
        consequences: ['resisted_memory_dive'],
        unlocks: ['memory_chamber_exit']
      }
    ]
  },
  {
    id: 'memory_first_speaker_origin',
    speaker: 'Memory Echo',
    text: `*The scene shimmers into focus: A younger you stands before a massive crystal formation, holding a stylus of pure light*
    
"Language must bridge the gap between thought and reality," your past self speaks to unseen listeners. "But with this power comes the burden of choice - preserve the world as it is, or guide it toward what it could become."
    
*The memory grows unstable, offering you a chance to alter your past motivations*`,
    choices: [
      {
        id: 'preserve_memory',
        text: 'Keep the memory intact - some truths should not be changed',
        consequences: ['preserved_original_memory', 'wisdom_path'],
        unlocks: ['stable_identity_path']
      },
      {
        id: 'alter_toward_preservation',
        text: '*Change the memory: "Language must preserve and protect"*',
        glyphUsed: 'memory_alteration_preserve',
        consequences: ['altered_toward_preservation', 'institute_alignment'],
        unlocks: ['preservation_personality_shift']
      },
      {
        id: 'alter_toward_freedom',
        text: '*Change the memory: "Language must grow wild and free"*',
        glyphUsed: 'memory_alteration_freedom',
        consequences: ['altered_toward_freedom', 'clan_alignment'],
        unlocks: ['freedom_personality_shift']
      }
    ]
  }
];