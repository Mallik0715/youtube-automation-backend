// Topics are used in order; services/topic_progress.json stores the next index
// (committed back to the repo by the GitHub Actions workflow).
const topics = [

  /* ================= RELATIONSHIP PSYCHOLOGY & ROMANCE (30) ================= */
  "Why You Get Emotionally Attached to People Who Aren't Good for You",
  "Why Your Heart Hurts When You Break Up — For Real",
  "The Real Reason Some People Fall in Love Faster",
  "Why Do We Get Jealous? The Dark Science Behind It",
  "What Happens to Your Brain When You Get Rejected",
  "Why Long Distance Relationships Fail — Science Says",
  "Why Couples Start to Look Alike Over Time — Explained",
  "What Oxytocin Really Does to Your Feelings",
  "Why Do We Ignore Red Flags? Brain Science Explains",
  "The Science of Why We Miss Someone So Deeply",
  "Why Friends Become More Than Friends — Wild Facts",
  "How Love Changes Your Personality — Shocking Facts",
  "How Arguments Affect the Brain — Mind Blowing Facts",
  "What Happens to Your Body When You Hug Someone",
  "Why Do We Feel Lonely Even Around People?",
  "The Dark Psychology of Attachment Styles in Love",
  "Why You Can't Stop Thinking About Your Ex",
  "Why People Cheating Has Nothing to Do With You — Science",
  "What Happens When You Lose Interest in Someone",
  "Why Silent Treatment Causes Actual Brain Damage",
  "The Science of Why We Crave Emotional Intimacy",
  "Why Love Feels Like an Addiction to Your Brain",
  "Why We Get Attached to People Who Ignore Us",
  "How Your Brain Knows You Found 'The One'",
  "The Truth About Why Ghosting Hurts So Much",
  "Why Healthy Relationships Feel Boring to Broken People",
  "What Happens to the Brain During a Brutal Breakup",
  "Why We Test People We Love — Psychology Revealed",
  "The Science Behind Why Opposite Personalities Attract",
  "Why You Feel Uncomfortable Receiving Love",

  /* ================= ATTRACTION, CRUSHES & EYE CONTACT (25) ================= */
  "What Attraction Really Is — Not What You Think",
  "The Weird Reason We Find Familiar Faces More Attractive",
  "What Your Eyes Do When You're Secretly in Love",
  "Shocking Signs Someone Is Subconsciously Attracted to You",
  "The 7-Second Rule of Eye Contact and Attraction",
  "Why You Find Someone More Attractive After Laughing With Them",
  "How Your Voice Changes When Talking to Someone You Like",
  "Why Body Language Never Lies in Attraction",
  "The Science of Pheromones: How We Smell Attraction",
  "Why Playing Hard to Get Actually Works on the Brain",
  "What Pupils Dilating Says About Attraction",
  "Why We Mirror the Person We're Attracted To",
  "The Psychological Effect of Wearing Red",
  "Why You Instantly Trust Certain People's Faces",
  "How Smiling Triggers Brain Chemistry in Others",
  "Why Mysterious People Are Irresistibly Attractive",
  "The Science Behind First Impressions in 3 Seconds",
  "Why Physical Touch Triggers Instant Connection",
  "Why We Get Nervous Around People We Find Hot",
  "The Psychological Reason Confidence Beats Good Looks",
  "Why You Fall in Love Through Eye Contact",
  "The Science of Flirting Body Language",
  "Why Someone Looking at Your Lips Means They Want to Kiss You",
  "How Soft Speaking Voices Trigger Attraction",
  "Why You Reminisce About Someone You Barely Met",

  /* ================= DARK BRAIN FACTS & UNCONSCIOUS MIND (25) ================= */
  "Why Your Brain Lies to You Every Single Day",
  "The Psychology of Why You Procrastinate",
  "Why You Can't Focus — The Real Scientific Reason",
  "Dark Facts About How Social Media Rewires Your Brain",
  "The Hidden Psychology Behind Why You Buy Things",
  "Why You Always Think You're Right — Psychology Explained",
  "Shocking Brain Tricks That Control Your Daily Behavior",
  "Why Your Brain Remembers Embarrassing Moments at 3AM",
  "The Illusion of Choice: How Your Mind Gets Manipulated",
  "Why Nostalgia Makes Your Brain Feel Warm and Sad",
  "The Dark Side of Overthinking and Mental Loops",
  "How Your Subconscious Mind Solves Problems While Sleeping",
  "Why You Suffer More in Imagination Than in Reality",
  "The Bystander Effect: Why People Don't Help in Emergencies",
  "Why We Rationalize Bad Decisions After Making Them",
  "How Déjà Vu Works in Your Brain's Neural Pathways",
  "The Psychology of Imposter Syndrome",
  "Why Your Brain Creates Fake Memories",
  "How Music Alters Your Brain Chemistry Instantly",
  "Why Self-Sabotage Is Your Brain Trying to Protect You",
  "The Science of Why We Hate Being Told What to Do",
  "Why Silence Makes the Brain Uncomfortable",
  "How Gratitude Rewires Neural Circuits",
  "Why Your Mind Blows Small Problems Out of Proportion",
  "The Psychological Reason We Love Villain Characters",

  /* ================= FEAR, ANXIETY & NIGHTMARE SCIENCE (20) ================= */
  "Why You Always Wake Up at 3AM — Real Science",
  "What Happens to Your Heart When You're Scared",
  "Why You Feel Paralyzed When You Wake Up — Explained",
  "The Real Reason Your Heart Races When You Hear Sudden Noises",
  "What Happens to Your Brain in the First 90 Minutes of Sleep",
  "Why Your Body Jerks Right Before You Fall Asleep",
  "The Terrifying Reality of Sleep Paralysis Explained",
  "Why Nightmares Happen — The Real Brain Science",
  "What Anxiety Does to Your Brain and Body",
  "Why Do We Get Angry So Fast? Brain Science Explained",
  "How a Brain Reacts to Terror and Fear",
  "Why Stress Causes Physical Pain in Your Body",
  "What Panic Attacks Actually Do to Your Nervous System",
  "Why Humans Fear the Dark — Surprising Facts",
  "What Triggers Sudden Paranoia in the Mind",
  "Why We Experience Irrational Phobias",
  "The Science of Fight, Flight, or Freeze Responses",
  "What Overthinking at Night Does to Sleep Quality",
  "Why You Hear Whispers or Sounds Right Before Falling Asleep",
  "How Deep Breathing Resets the Brain's Alarm System",

  /* ======================================================================
     BATCH 2 (added Oct 2026) — 100 new topics, same niche. Used after the
     first 100 above. All based on well-known research findings.
     ====================================================================== */

  /* ================= MORE ATTRACTION & FIRST IMPRESSIONS (13) ================= */
  "Why Scary Dates Make You Fall Harder — The Bridge Experiment",
  "The Cheerleader Effect: Why People Look Hotter in Groups",
  "Why 'Average' Faces Are Secretly the Most Attractive",
  "Why Symmetrical Faces Look More Beautiful — Science Explains",
  "Why Kind People Literally Look More Attractive",
  "Why a Good Sense of Humor Is So Attractive — Psychology Explains",
  "The Pratfall Effect: Why Small Mistakes Make You More Likable",
  "Why Saying Someone's Name Makes Them Like You More",
  "Why We Fall for People Who Are Similar to Us",
  "The Proximity Effect: Why We Fall for People Who Live Nearby",
  "How Your Posture Changes the Way People See You",
  "Why We're Instantly Drawn to People Who Like Us",
  "The Halo Effect: Why Attractive People Seem Smarter",

  /* ================= MORE RELATIONSHIP PSYCHOLOGY (26) ================= */
  "The 36 Questions That Can Make Two Strangers Fall in Love",
  "The 5-to-1 Ratio That Predicts If a Couple Will Last",
  "Why Eye-Rolling Is the Biggest Red Flag in a Relationship",
  "Why Couples' Heartbeats Start to Sync — Real Science",
  "Why Holding Your Partner's Hand Actually Reduces Pain",
  "What Happens in Your Brain When You See Your Partner's Photo",
  "Why the Honeymoon Phase Fades — and What Replaces It",
  "The 'Bids for Connection' Test That Predicts Lasting Love",
  "Why Long-Term Couples Share One Memory — Transactive Memory",
  "Why Couples Who Never Fight Aren't Always the Happiest",
  "Why We See Our Partners Through Rose-Tinted Glasses — and Why It Helps",
  "The Michelangelo Effect: How the Right Partner Makes You Better",
  "Why Arguing Over Text Makes Every Fight Worse",
  "Why Loneliness Is as Harmful as Smoking — Shocking Research",
  "It Takes About 200 Hours to Make a Close Friend — Here's Why",
  "Dunbar's Number: Why You Can Only Have About 150 Friends",
  "Why We Stay in Bad Relationships — The Sunk Cost Trap",
  "The Psychology of Rebound Relationships",
  "Why Some People Fear Commitment — Avoidant Attachment Explained",
  "What Love Bombing Is and Why It Works on Your Brain",
  "How Gaslighting Makes You Doubt Your Own Memory",
  "Why Couples Who Try New Things Together Feel More in Love",
  "What 'Butterflies in Your Stomach' Really Are",
  "Why Humans Kiss — The Surprising Science of Kissing",
  "Why Men Usually Say 'I Love You' First — Surprising Study",
  "Why Small Daily Gestures Matter More Than Grand Romance",

  /* ================= EVERYDAY MIND TRICKS & BRAIN BIASES (30) ================= */
  "The Zeigarnik Effect: Why Unfinished Tasks Haunt Your Mind",
  "Why You Forget What You Wanted When You Walk Into a Room",
  "Why Time Feels Like It Speeds Up as You Get Older",
  "The Dunning-Kruger Effect: Why Beginners Feel Like Experts",
  "Why Your Brain Remembers Bad Days More Than Good Ones",
  "The IKEA Effect: Why You Overvalue Things You Build Yourself",
  "Why You Feel Your Phone Buzz When It Didn't",
  "Why You Suddenly See Something Everywhere After Learning About It",
  "Why You Can't Tickle Yourself — Brain Science",
  "Why Songs Get Stuck in Your Head — The Science of Earworms",
  "The Anchoring Effect: How the First Number Controls Your Choices",
  "Why $9.99 Feels So Much Cheaper Than $10",
  "The Decoy Effect: How Stores Trick You Into Buying the Bigger Size",
  "Why Losing $10 Hurts More Than Finding $10 Feels Good",
  "The Peak-End Rule: How Your Brain Really Remembers Experiences",
  "Why Multitasking Is a Myth — Your Brain Is Just Switching",
  "Why Your Best Ideas Come in the Shower",
  "Placebos Work Even When You Know They're Placebos",
  "The Nocebo Effect: How Expecting Pain Creates Real Pain",
  "Why Yawning Is Contagious — Even When You Read About It",
  "Why Your Voice Sounds So Weird on Recordings",
  "Why You Can't Remember Being a Baby",
  "Why Smells Trigger Your Most Powerful Memories",
  "Why Talking to Yourself in the Third Person Calms You Down",
  "Why Doodling Actually Helps You Remember More",
  "Why You See Faces in Everyday Objects — Pareidolia",
  "The Mandela Effect: Why Millions Remember the Same Thing Wrong",
  "Why Being Bored Is Secretly Good for Your Brain",
  "Why You Can Never Predict How You'll Act When Angry or Hungry",
  "Why You Remember Faces But Forget Names",

  /* ================= SOCIAL PSYCHOLOGY & INFLUENCE (17) ================= */
  "The Asch Experiment: Why People Follow the Crowd Even When It's Wrong",
  "The Milgram Experiment: How Far People Go When They're Told To",
  "The Ben Franklin Effect: Why Asking a Favor Makes People Like You",
  "The Foot-in-the-Door Trick: How Small Yeses Lead to Big Ones",
  "Why a Free Gift Makes You Say Yes — The Reciprocity Trap",
  "The Pygmalion Effect: How Others' Expectations Change Your Performance",
  "Why Empty Restaurants Stay Empty — Social Proof Explained",
  "Why Smart Groups Make Dumb Decisions — Groupthink",
  "How Often People Lie Every Day — Psychology Reveals",
  "The Hawthorne Effect: Why You Act Differently When Watched",
  "Why a Picture of Eyes Makes People More Honest",
  "Why We Trust Confident People Even When They're Wrong",
  "Why Taller People Tend to Earn More — Surprising Research",
  "How the Clothes You Wear Change the Way You Think",
  "The Spotlight Effect: Why Nobody Notices You as Much as You Think",
  "Why Waiting Feels Longer When You're Doing Nothing",
  "Why Paying With a Card Makes You Spend More",

  /* ================= EMOTIONS, STRESS & SLEEP (14) ================= */
  "What Happens to Your Brain After Just One Night Without Sleep",
  "Why Crying Can Actually Make You Feel Better",
  "Why a Cold Shower Can Spike Your Dopamine",
  "Why a Walk in Nature Quiets Your Overthinking Brain",
  "Why You Get 'Hangry' — The Science of Hunger and Anger",
  "Why Naming Your Emotions Makes Them Weaker",
  "Why Dreams Vanish From Memory Seconds After You Wake Up",
  "Why Stress Makes You Forget Things",
  "What Happens in Your Brain During a Lucid Dream",
  "Why Sunday Evenings Feel So Heavy — The Sunday Scaries",
  "Why Exercise Works Like a Natural Antidepressant",
  "Why Revenge Feels Sweet — But Leaves You Feeling Worse",
  "Why Music Gives You Goosebumps — The Science of Frisson",
  "Why the Songs From Your Teens Stay Your Favorites Forever",
];

const fs = require("fs");
const path = require("path");

const PROGRESS_FILE = path.join(__dirname, "topic_progress.json");

function loadIndex() {
  try {
    const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"));
    return typeof data.index === "number" ? data.index : 0;
  } catch (err) {
    return 0; // file doesn't exist yet, or is unreadable - start from the beginning
  }
}

function saveIndex(index) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ index }), "utf8");
}

function getNextTopic() {
  let index = loadIndex();

  if (index >= topics.length) {
    index = 0; // every topic used - start again from the top
  }

  const topic = topics[index];
  saveIndex(index + 1);

  return topic;
}

module.exports = { getNextTopic };
