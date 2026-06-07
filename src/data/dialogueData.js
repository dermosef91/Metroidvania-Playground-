export const DIALOGUE = {
  INTRO_CARDS: [
    { text: 'Freitag Abend. 18:04 Uhr.', pause: 1800 },
    { text: 'Dorf Tirol, Südtirol.', pause: 1800 },
    { text: 'The plan was simple —\nfour friends, three days,\none campsite below the peaks.', pause: 2800 },
    { text: 'Mia went to the spring.\nJust 50 metres into the forest.\nThat was an hour ago.', pause: 2800 },
    { text: 'She hasn\'t come back.', pause: 2200 },
  ],

  LUCAS_FIRST: [
    { speaker: 'Lucas', text: '"You\'re finally back!\nListen — I\'m getting worried."' },
    { speaker: 'Lucas', text: '"Mia went for water and\ntook her camera. No phone.\nTypical Mia."' },
    { speaker: 'Lucas', text: '"Your headlamp is in\nthe second tent — the blue one.\nCan you go check on her?"' },
  ],

  LUCAS_AGAIN: [
    { speaker: 'Lucas', text: '"Please just go find her.\nI\'ll keep the fire going."' },
  ],

  HEADLAMP_PICKUP: [
    { text: '★  HEADLAMP\n\nIlluminate dark paths.\n[F] or lamp button to toggle.' },
  ],

  TENT_EMPTY: [
    { text: 'Your tent. Sleeping bag,\ninstant noodles, a half-read\npocketbook about alpine folklore.' },
  ],

  CAMPFIRE_REST: [
    { speaker: 'Campfire', text: 'The fire crackles warmly.\nYou feel safe here.' },
  ],

  FOREST_GATE_BLOCKED: [
    { text: 'Too dark to go further\nwithout a light source.\n\n...where\'s that headlamp?' },
  ],

  FOREST_WARNING_SIGN: [
    { text: '⚠  ACHTUNG / ATTENZIONE' },
    { text: '"Do not disturb the cairns.\nOld stories say the Tatzelwurm\nsleeps where Lärchen grow."' },
    { text: '— Gemeinde Tirol / Comune di Tirolo —' },
  ],

  MIA_NOTE_ON_TREE: [
    { text: 'A note, nailed to a larch tree.' },
    { text: '"Mia! I found something wild.\nMeet me at the old Hütte.\nFollow my trail markers. — K"' },
    { text: 'At the bottom: a strange symbol.\nLike a spiral inside a circle.\nYou don\'t recognise it.' },
  ],

  WASTL_JOURNAL: [
    { text: 'A journal. Dusty, dog-eared.\n1987.' },
    { speaker: 'Wastl, 1987', text: '"Third season tending\nthis Hütte. The Tatzelwurm\nwoke last summer."' },
    { speaker: 'Wastl, 1987', text: '"Young hikers moved the cairns\nnear the treeline. All bad.\nDo NOT disturb the cairns."' },
    { speaker: 'Wastl, 1987', text: '"If it wakes: follow the sound\nupward toward the Schwarzsee.\nIt sleeps at dawn."' },
    { speaker: 'Wastl, 1987', text: '"Do not use torchlight\nto confront it. Only campfire\nlight can calm a Tatzelwurm."' },
    { speaker: 'Wastl, 1987', text: '"God willing no one\nstumbles up here at night.\n— Wastl Gasser, Hüttenwirt"' },
  ],

  MIA_BACKPACK: [
    { text: 'Mia\'s backpack.\nCamera inside, battery dead.' },
    { text: 'Her hiking boots are missing.\nShe kept going up.' },
  ],

  DEMO_END: [
    { text: 'From somewhere above\nthe treeline —', pause: 2000 },
    { text: '"HELP!  Ich bin hier oben!"', pause: 2500 },
    { text: 'Mia\'s voice.\nFaint but clear.\nShe\'s above the Hütte.', pause: 2800 },
    { text: 'Something large shifts\nin the dark behind the wall.\nA low, grinding sound.', pause: 3000 },
    { text: 'The Tatzelwurm is awake.', pause: 2500 },
    { text: '...', pause: 2000 },
  ],
};
