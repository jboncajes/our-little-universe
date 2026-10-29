/* ==========================================================================
   OUR LITTLE UNIVERSE — every personal word and photo lives in this file.

   • Text wrapped in [[double brackets]] is a placeholder. Replace the whole
     thing, brackets included. While any are left, a small checklist shows in
     the bottom-left corner of the site (it disappears on its own when done).
   • Photos go in  public/photos/ . Set a photo's src to its path WITHOUT
     "public/", e.g.  src: "photos/month-02.webp". With src: null a soft
     labelled placeholder shows instead. "suggested" is only a filename hint.
   • Letters are written between backticks ( ` ). Paste them exactly as you
     wrote them. Leave a blank line between paragraphs. If a letter itself
     contains a backtick or the characters ${ , put a backslash before them.
   • Save while `npm run dev` is running and the page updates instantly.
     TypeScript will point out typos (run `npm run typecheck`).
   ========================================================================== */
import type { SiteContent } from "./types";

export const content: SiteContent = {

  settings: {
    showPlaceholderBadge: false
  },

  names: {
    her: "baby",
    me: "Ruuu"
  },

  // The day you became "us", written as "YYYY-MM-DD" (e.g. "2025-11-14").
  // Leave it as null and the "time together" counter simply stays hidden.
  relationshipStartDate: "2025-10-30",

  // Optional. Music never plays until she presses the button.
  // Only use a file you have the right to use.
  music: {
    tracks: [
      // The theme: plays on the contents, the dedication, and every chapter
      // that doesn't have a song of its own.
      { title: "You To Me Are Everything", src: "music/you-to-me-are-everything.mp3" },
      { title: "World of Our Own", src: "music/world-of-our-own.mp3", chapters: ["us", "little-things", "forever"] },
      { title: "You're Still the One", src: "music/youre-still-the-one.mp3", chapters: ["last-thing"] }
    ]
  },

  // A playful question before the envelope can be opened.
  // This is NOT security — anyone can read this file. See README.
  entrance: {
    enabled: true,
    question: "Before you open it… what do I always call you?",
    answers: ["baby", "hon"],          // not case- or punctuation-sensitive
    wrongReplies: [
      "Hmm, that's not it… try again? ♡",
      "Close! (Not really.) One more try.",
      "Wait, are you really my girl? Try again ♡"
    ],
    hint: "Psst… it's what I call you all the time ♡"
  },

  cover: {
    subtitle: "A little scrapbook of us.",
    dedication: "To my favorite person in the whole universe. I made a little place for our memories, our love, and everything that makes us us.",
    envelopeNote: "for you ♡",
    photo: { src: "photos/cover.jpg", alt: "A close-up selfie of us, faces together", caption: "us ♡", ratio: "4/5" }
  },

  sections: {
    story:        { eyebrow: "chapter one",   intro: "Every month, I wrote you a letter. Here they are in order — little pieces of us, one month at a time." },
    letters:      { eyebrow: "chapter two",   intro: "These are the letters I wrote you over the course of us. Open any envelope whenever you want to read them again." },
    us:           { eyebrow: "chapter three", intro: "Twelve little notes about my favorite thing in the whole world: us." },
    littleThings: { eyebrow: "chapter four",  intro: "Some of my favorite pictures of you, and of us. Tap any photo to hold it up closer." },
    forever:      { eyebrow: "chapter five",  intro: "The future I hope we get to share ♡" },
    lastThing:    { eyebrow: "the last page", intro: "Twelve months, twelve letters. This last one is for our first year ♡" }
  },

  /* ---------------------------------------------------------------------
     MONTHLY LETTERS (months 1–11). Each month gets its own page in chapter
     one, and its envelope in the pocket in chapter two. "excerpt" is the line
     shown on the page. Each month holds the lines you picked from that
     letter; paste the whole letter over them any time you like.
     --------------------------------------------------------------------- */
  months: [
    {
      label: "Month 1",
      title: "The Beginning of Always",
      excerpt: "Every day with you feels like something I prayed for without even realizing it.",
      photo: { src: "photos/month-01.jpg", alt: "Us smiling in front of a big Christmas tree", caption: "November 2025", ratio: "4/5" },
      letter: `
Every day with you feels like something I prayed for without even realizing it.

Those moments don't scare me. They make me want to understand you more, protect you more, love you more.

You make my heart feel at home.

Thank you for choosing me.

Loving you more deeply than yesterday, and ready to love you even more tomorrow.
`
    },
    {
      label: "Month 2",
      title: "A Love That Keeps Growing",
      excerpt: "Here's to the little moments, the growing love, and all the months we'll celebrate together.",
      photo: { src: "photos/month-02.jpg", alt: "Us hugging on a bridge in front of a hillside of colorful houses", caption: "December 2025", ratio: "4/5" },
      letter: `
Here’s to our second month, hon! At sa countless months pa na darating.

Two months down, and so many more memories waiting for us.

Here's to the little moments, the growing love, and all the months we'll celebrate together.
`
    },
    {
      label: "Month 3",
      title: "My Favorite Kind of Forever",
      excerpt: "I love you, baby. Always and forever.",
      photo: { src: "photos/month-03.jpg", alt: "A mirror selfie of us in a hallway", caption: "January 2026", ratio: "4/5" },
      letter: `
I love you, baby. Always and forever.

Three months with you, and you're still the person I want beside me.

If forever means choosing you every day, then that's the forever I want.
`
    },
    {
      label: "Month 4",
      title: "A Promise, Pinky and All",
      excerpt: "I love you always. Pangako yan. Sigurado yan. Pinky!",
      photo: { src: "photos/month-04.jpg", alt: "Us standing close by a white railing with a mountain behind us", caption: "February 2026", ratio: "4/5" },
      letter: `
I love you always. Pangako yan. Sigurado yan. Pinky!

Not just today, not just this month, but every day that comes after.

A little pinky promise, a whole lot of love, and a heart that keeps choosing you.
`
    },
    {
      label: "Month 5",
      title: "Every View Is More Beautiful with You",
      excerpt: "Every view becomes more beautiful with this beauty beside me — ikaw yun.",
      photo: { src: "photos/month-05.jpg", alt: "A mirror selfie of us, you leaning in to kiss my cheek", caption: "March 2026", ratio: "4/5" },
      letter: `
Kung babalikan ko lahat, wala akong gustong baguhin, kasi bawat part nun, kasama ka.

Every view becomes more beautiful with this beauty beside me — ikaw yun.

Hindi man perfect, pero totoo, at lalong tumitibay.

I promise to keep choosing you, every single day — sa good days, bad days, and everything in between.
`
    },
    {
      label: "Month 6",
      title: "You Make Life Softer",
      excerpt: "Ikaw yung pahinga ko after nakakapagod na araw.",
      photo: { src: "photos/month-06.jpg", alt: "Us posing together in a garden at night", caption: "April 2026", ratio: "4/5" },
      letter: `
Ikaw yung pahinga ko after nakakapagod na araw.

You make life softer, lighter, and happier.

Pipiliin kita araw-araw, kahit mahirap, kahit magulo minsan, kahit hindi perfect.
`
    },
    {
      label: "Month 7",
      title: "My Safe Place, My Favorite Person",
      excerpt: "Mahal kita dahil sa kung sino ka.",
      photo: { src: "photos/month-07.jpg", alt: "Us looking at each other in front of a big wooden door", caption: "May 2026", ratio: "4/5" },
      letter: `
Ikaw yung taong gusto kong ikwento yung araw ko, unang hanapin kapag may magandang nangyari, at unang gustong yakapin kapag mabigat yung lahat.

Mahal kita dahil sa kung sino ka.

One thing I really appreciate about us is how we continue to choose each other every day.
`
    },
    {
      label: "Month 8",
      title: "The Answer to My Prayers",
      excerpt: "Ikaw ang sagot ni Lord sa prayers ko.",
      photo: { src: "photos/month-08.jpg", alt: "A smiling selfie of us", caption: "June 2026", ratio: "4/5" },
      letter: `
Ikaw ang sagot ni Lord sa prayers ko.

Hon, ikaw at ikaw lang yung decision na never akong nagdalawang-isip.

Salamat dahil naging tahanan ka ng puso ko.
`
    },
    {
      label: "Month 9",
      title: "If I Could Choose Again",
      excerpt: "Thank you kasi sa lahat ng nangyari, nandito pa rin tayo, still choosing each other.",
      photo: { src: "photos/month-09.jpg", alt: "A close-up selfie of us cheek to cheek among the trees", caption: "July 2026", ratio: "4/5" },
      letter: `
Mga simpleng bagay lang siguro para sa iba, pero sa akin, magiging special na sila forever dahil ikaw ang kasama ko.

Thank you kasi sa lahat ng nangyari, nandito pa rin tayo, still choosing each other.

And if I could choose again, sa lahat ng pagkakataon at sa lahat ng versions ng buhay ko, ikaw pa rin ang pipiliin ko.
`
    },
    {
      label: "Month 10",
      title: "My Home in Every Ordinary Day",
      excerpt: "You’ll always be my home, my heart, my forever, my love.",
      photo: { src: "photos/month-10.jpg", alt: "Us at a restaurant table with cake and food", caption: "August 2026", ratio: "4/5" },
      letter: `
Hindi naman kailangang laging grand. Kahit simpleng gala, simpleng kain, simpleng araw na magkasama tayo — basta ikaw, sapat na.

Hindi lang kita gusto sa mga masasayang moments. Gusto kita sa kwento ng buhay ko.

You’ll always be my home, my heart, my forever, my love.
`
    },
    {
      label: "Month 11",
      title: "After Everything, Still You",
      excerpt: "And if I could choose again after everything we've been through, ikaw pa rin. Ikaw at ikaw pa rin ang pipiliin ko. Forever and always.",
      photo: { src: "photos/month-11.jpg", alt: "Us on a terrace with city buildings behind us", caption: "September 2026", ratio: "4/5" },
      letter: `
Hindi naman kailangan na wala tayong problema. Ang importante sa atin, kahit may mga pagkakataong mahirap, pinipili pa rin nating ayusin, intindihin, at mahalin ang isa't isa.

Baby, please don't think na kailangan mong maging perfect para mahalin kita.

And if I could choose again after everything we've been through, ikaw pa rin. Ikaw at ikaw pa rin ang pipiliin ko. Forever and always.
`
    }
  ],

  /* ---------------------------------------------------------------------
     12 REASONS — each note under the flap is in your own words, taken
     from your monthly letters. Titles are fixed; change any text freely.
     --------------------------------------------------------------------- */
  reasons: [
    { title: "We keep choosing each other.", text: "One thing I really appreciate about us is how we continue to choose each other every day. Hindi lang kapag masaya. Hindi lang kapag sweet." },
    { title: "You feel like home.", text: "You make my heart feel at home. Salamat dahil naging tahanan ka ng puso ko." },
    { title: "We can be our silly selves together.", text: "We can be weird together, mag-asaran, gumawa ng kung anu-anong kalokohan, at tumawa sa mga bagay na tayo lang ang natatawa. Just us being us." },
    { title: "You're my favorite person to tell everything to.", text: "Kahit gaano ka-random yung nangyari sa araw ko, gusto ko pa ring sabihin sayo. Kasi somehow, mas masarap ikwento ang buhay kapag ikaw yung nakikinig." },
    { title: "We care for each other in little ways.", text: "Yung pag-check mo kung okay lang ako, yung pag-alala mo sa mga maliliit na details, yung pag-aalaga mo sakin kapag hindi ako okay. Those things never go unnoticed, baby." },
    { title: "We make ordinary moments special.", text: "You make ordinary days feel special. Kahit simpleng lakad lang, basta ikaw ang kasama, it feels like an adventure." },
    { title: "We get to experience our firsts together.", text: "Halos lahat ng firsts natin, tayo ang kasama ng isa't isa. And that makes everything extra special." },
    { title: "We can be vulnerable with each other.", text: "Hindi ko makakalimutan yung first real heart-to-heart talk natin. Kahit messy minsan yung emotions natin, pinipili pa rin nating magstay at magkaintindihan." },
    { title: "We show up during the hard times.", text: "Even when things get heavy, we don't let go. We hold on a little tighter. Kakayanin natin basta magkasama tayo." },
    { title: "We help each other grow.", text: "What matters is that we're trying, fixing, listening, and growing together — willing matuto, mag-adjust, at maging better para sa isa't isa." },
    { title: "We dream of a future together.", text: "Until the day we marry each other, until the day we welcome our little Asher and Elianna, until our hair turns gray." },
    { title: "After everything, it's still you.", text: "And after everything, tayo pa rin. Ikaw at ikaw pa rin ang pipiliin ko. Forever and always." }
  ],

  /* ---------------------------------------------------------------------
     "A little reminder for you ♡" — one of these 100 is picked at random
     per tap (never the same one twice in a row). Add, change or remove freely.
     --------------------------------------------------------------------- */
  reminders: [
    "You are so, so loved, baby. ♡",
    "Ikaw ang sagot ni Lord sa prayers ko.",
    "I'm proud of you — today and every day.",
    "Drink some water, hon. And remember I adore you.",
    "Pahinga ka muna, baby. You've done enough today.",
    "You're more than enough. Always.",
    "Pipiliin kita araw-araw.",
    "You make my heart feel at home.",
    "Hawak kamay, baby. Walang iwanan.",
    "Whatever today looks like, I'm on your side.",
    "Kain ka na? Don't skip meals, hon.",
    "You make ordinary days feel special.",
    "Sobrang sapat ka para sa akin — more than enough, actually.",
    "Hey pretty. Yes, you.",
    "I'd choose you again. And again. And again.",
    "Ikaw pa rin. Always you.",
    "Thank you for choosing me.",
    "You're my safe place.",
    "Mahal na mahal kita. Mas minamahal pa kita.",
    "Breathe, baby. One thing at a time.",
    "I see you, I appreciate you, and I'm always here for you.",
    "Kakayanin natin basta magkasama tayo.",
    "You are my greatest blessing.",
    "Sleep early tonight, hon. Promise?",
    "Your laugh is my favorite sound.",
    "Ang swerte ko sayo.",
    "You don't have to be perfect for me to love you.",
    "Cutie alert: it's you.",
    "Pangako yan. Sigurado yan. Pinky!",
    "I'm thinking of you right now.",
    "Every view is more beautiful with you beside me.",
    "Kahit pagod ka, ang ganda mo pa rin.",
    "You're doing better than you think.",
    "Proud boyfriend, reporting for duty.",
    "You make life softer, lighter, and happier.",
    "Hinding-hindi ako magsasawang mahalin ka.",
    "Wifey, you've got this.",
    "I love you on your best days and on your hardest ones.",
    "Sending you the tightest hug.",
    "Ikaw ang pahinga ko.",
    "You are loved more than words can say.",
    "Yeppeuni ka talaga.",
    "You're allowed to rest. You're allowed to slow down.",
    "Be kind to yourself today, baby.",
    "Hindi kita bibitawan.",
    "Gusto kita sa kwento ng buhay ko.",
    "My favorite person, every single day.",
    "Smile, baby — someone's madly in love with you.",
    "Kahit tulog ka lang sa tabi ko, masaya na ako.",
    "Thank you for being you.",
    "Your heart is one of the kindest I know.",
    "You're stronger than you feel right now.",
    "It's okay not to be okay. Nandito lang ako.",
    "Isang mahigpit na yakap para sayo. ♡",
    "You make everything feel light, calm, and worth it.",
    "I love you more than yesterday.",
    "And tomorrow, I'll love you even more.",
    "Hey hon, have you laughed today? Go do that.",
    "I'm so lucky it's you.",
    "Bawat effort mo, appreciated pa rin — just like day 0.",
    "Aya, you're my favorite hello.",
    "Zaii, you're my favorite everything.",
    "Mahal kita dahil sa kung sino ka.",
    "One day at a time, together.",
    "You never have to face anything alone.",
    "You're my person, my constant, my forever.",
    "Don't forget: you're amazing.",
    "Text me when you get home, okay?",
    "Your dreams matter, and I believe in every one of them.",
    "I'll be cheering for you, always.",
    "Ang ganda ng ngiti mo. Ngiti ka na.",
    "Galing mo, baby. Seryoso.",
    "You deserve all the good things.",
    "I'm grateful for you, every single day.",
    "Sana alam mong mahal na mahal kita.",
    "Still you. Always you. Forever you.",
    "May kiss at lambing ka. HAHAHAHA.",
    "Our story is my favorite story.",
    "Consider this one virtual forehead kiss.",
    "You're not too much. You're just right.",
    "More sunsets with you, please.",
    "Kahit busy ka, I'm always just a message away.",
    "I love the way you love me.",
    "You make my world softer.",
    "Rest your heart, baby. I've got you.",
    "Hey wifey — just a reminder that you're mine and I'm yours.",
    "Kain, tulog, pahinga. I love you!",
    "You're the best part of my day.",
    "Here's your daily dose of: I love you.",
    "Lord, thank You for her.",
    "Ikaw ang tahanan ng puso ko.",
    "Every day with you feels like an answered prayer.",
    "Proud of how far you've come.",
    "Even on your quiet days, I choose you.",
    "Let's grow old and makulit together.",
    "I'll always be your safe place to land.",
    "You're my favorite adventure.",
    "There's no one else, hon. Only you.",
    "Kahit ilang buwan o taon pa, hindi magbabago 'to.",
    "Forever and always, baby. ♡"
  ],

  /* ---------------------------------------------------------------------
     GALLERY — "The little things I love about you".
     type "photo" (default) or type "note" for a little paper note.
     ratio controls the photo shape: "4/5", "1/1", "3/4", "4/3"...
     Photos live in public/photos. "alt" describes each photo
     for screen readers. The captions and notes are drafts to make your own
     (the [[ ]] keeps them on the editing checklist).
     --------------------------------------------------------------------- */
  gallery: [
    { src: "photos/photo-01.jpg", alt: "You at a café table, behind an instax photo of you I'm holding up", caption: "[[how you make every food date fun]]", ratio: "4/5" },
    { src: "photos/photo-02.jpg", alt: "Us on a hanging bridge in the forest", caption: "[[how you cross every bridge with me]]", ratio: "3/4" },
    { type: "note", text: "[[The way you laugh at your own jokes before you even finish telling them.]]" },
    { src: "photos/photo-03.jpg", alt: "A night selfie of us watching the fireworks by the bay", caption: "[[how you outshine the fireworks]]", ratio: "4/5" },
    { src: "photos/photo-04.jpg", alt: "You asleep beside me in the car, the sun on your face", caption: "[[how beautiful you are, even asleep beside me]]", ratio: "1/1" },
    { src: "photos/photo-05.jpg", alt: "A silly selfie of us in the car", caption: "[[your makulit side]]", ratio: "4/3" },
    { src: "photos/photo-06.jpg", alt: "A selfie of us in caps at the park", caption: "[[your smile on sunny days]]", ratio: "4/3" },
    { src: "photos/photo-07.jpg", alt: "Us holding hands on the grass", caption: "[[how you never let go of my hand]]", ratio: "4/5" },
    { type: "note", text: "[[How you always ask if I've eaten — kahit busy ka, kahit pagod ka.]]" },
    { src: "photos/photo-08.jpg", alt: "Our two shadows side by side on the path", caption: "[[how you're always right beside me]]", ratio: "3/4" },
    { src: "photos/photo-09.jpg", alt: "Your mirror selfie on our first coffee date", caption: "[[how you make every first feel special]]", ratio: "1/1" },
    { src: "photos/photo-10.jpg", alt: "You with a bouquet of yellow flowers", caption: "[[how you're even prettier than the flowers]]", ratio: "3/4" },
    { src: "photos/photo-11.jpg", alt: "You resting your chin on your hand, looking at me", caption: "[[how one look from you melts my heart]]", ratio: "4/5" },
    { src: "photos/photo-12.jpg", alt: "A candid photo of us in matching yellow shirts at a café, you smiling at your phone", caption: "[[how we match without even trying]]", ratio: "3/4" }
  ],

  /* ---------------------------------------------------------------------
     OUR LITTLE FOREVER — keep only the dreams you two actually share.
     Add, rename or remove dreams freely. The notes are drafts to make
     your own (the [[ ]] keeps them on the editing checklist).
     --------------------------------------------------------------------- */
  forever: {
    note: "[[Wherever life takes us next, hon — basta magkasama tayo.]]",
    photos: [
      { src: "photos/forever-01.jpg", alt: "Our hands with our rings, resting on a Christmas tree", caption: "[[my promise to you]]", ratio: "4/5" },
      { src: "photos/forever-02.jpg", alt: "Us smiling together with a bouquet of flowers", caption: "[[flowers, always for you]]", ratio: "4/5" }
    ],
    dreams: [
      { title: "More adventures", note: "[[New places, wrong turns, long drives, and getting lost together on purpose. I want to see the world with you beside me.]]" },
      { title: "Sunsets and sunrises", note: "[[I want to watch the sky change color with you — the early mornings, the slow evenings, and every quiet moment in between.]]" },
      { title: "A home of our own", note: "[[A little place that's ours — your things next to mine, our kind of mess, and a door I'll always be excited to come home to.]]" },
      { title: "Growing together", note: "[[Kahit magbago tayo, I want us to keep growing in the same direction, cheering each other on every step of the way.]]" },
      { title: "Growing old together", note: "[[Gray hair, slow walks, and the same silly jokes. I still want to be holding your hand when we're old and makulit.]]" },
      { title: "Choosing each other, always", note: "[[On the easy days and the hard ones, I'll keep choosing you — and I hope you'll keep choosing me too.]]" }
    ]
  },

  /* ---------------------------------------------------------------------
     ONE LAST THING — the final letter.
     closingLine is the suggested wording from the brief; change it freely.
     --------------------------------------------------------------------- */
  finale: {
    photo: { src: "photos/finale.jpg", alt: "Us smiling together at a café table", caption: "October 2026 ♡", ratio: "4/5" },
    letterTitle: "What Did I Do to Deserve You?",
    // The anniversary letter itself lives in src/content/letters/anniversary.txt.
    letter: "",
    closingLine: "Through every little misunderstanding, every laugh, every first, and every dream of tomorrow… ikaw pa rin. Always you. ♡",
    signoff: "Love, Ruuu",
    ps: "P.S. You can come back here whenever you need a little reminder of how loved you are."
  }
};
