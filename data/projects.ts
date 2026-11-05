import "server-only";
import { CATEGORY_SLUGS, type CategorySlug, type Filter } from "./categories";

import type { GalleryItem, GallerySet, LightboxItem, Photo, Project, ProjectRef } from "./types";

/**
 * Server-side portfolio data. Pages pass slices of this to client components as
 * props, so the photo payload (dimensions + blur placeholders) never ships in JS bundles.
 */

/* ------------------------------------------------------------------ */
/*  Photos                                                             */
/* ------------------------------------------------------------------ */

let localPhotoIndex = 0;

/** Build a local portfolio photo from the supplied original image set. */
function photo(id: string, alt: string, caption: string, credit: string): Photo {
  const imageNumber = (localPhotoIndex++ % 18) + 1;
  return {
    id,
    src: `/images/chirag-${String(imageNumber).padStart(2, "0")}.jpg`,
    alt,
    caption,
    credit: "Chirag Photography",
    width: 1600,
    height: 1200,
  };
}

/* ------------------------------------------------------------------ */
/*  Projects — two stories per category                                */
/* ------------------------------------------------------------------ */

export const projects: Project[] = [
  /* ----------------------------- Weddings ----------------------------- */
  {
    slug: "isabelle-theo",
    title: "Weddings & Celebrations",
    category: "weddings",
    client: "Chirag Photography",
    venue: "Event venue",
    location: "Bengaluru, India",
    year: 2025,
    guests: "Event coverage",
    excerpt: "A collection of moments, details and celebrations captured by Chirag Photography.",
    story: [
      "A collection of moments, details and celebrations captured by Chirag Photography in Bengaluru.",
      "Explore the photographs and contact us to discuss coverage for your own event.",
    ],
    photos: [
      photo("photo-1637014387463-a446e89abb68", "Bride and groom embracing in a golden meadow at sunset, her bouquet raised against the light", "Golden hour in the meadow", "Andres Molina"),
      photo("photo-1549488497-94b52bddac5d", "Bride in a tulle gown seated in the back of a vintage car, gazing out of the window", "On the way to the château", "Maria Orlova"),
      photo("photo-1615632413553-fdf70995ee98", "Groom kneeling beside the bride as she holds a cloud of baby's breath", "A quiet moment before the vows", "Krismas"),
      photo("photo-1595407753234-0882f1e77954", "Newlyweds walking through cheering guests beneath a timber-beamed roof", "The recessional", "Victoria Priessnitz"),
      photo("photo-1519225421980-715cb0215aed", "Long reception table dressed with glassware, linen and wildflowers", "Supper in the orangery", "Photos by Lanty"),
      photo("photo-1527529482837-4698179dc6ce", "Guests raising their glasses beneath warm festoon lights", "Toasts under the lights", "Al Elmes"),
      photo("photo-1648154164366-d067faecdc51", "Bride dancing with her arms raised as guests cheer around her", "Then everyone danced", "Sarah Noltner"),
    ],
  },
  {
    slug: "amara-julian",
    title: "Wedding Photography",
    category: "weddings",
    client: "Chirag Photography",
    venue: "Event venue",
    location: "Bengaluru, India",
    year: 2024,
    guests: "Event coverage",
    excerpt: "A collection of moments, details and celebrations captured by Chirag Photography.",
    story: [
      "A collection of moments, details and celebrations captured by Chirag Photography in Bengaluru.",
      "Explore the photographs and contact us to discuss coverage for your own event.",
    ],
    photos: [
      photo("photo-1460978812857-470ed1c77af0", "Black-and-white photograph of a bride and groom kissing as her veil lifts in the wind", "The veil and the wind", "Hisu lee"),
      photo("photo-1524650448000-02d0a2aeb6cb", "Black-and-white view down a church aisle toward the couple at the altar", "The stone church above Varenna", "Jeremy Wong Weddings"),
      photo("photo-1707194898557-95d00588a8b7", "Black-and-white image of the couple holding hands with sunlight flaring behind them", "Hand in hand", "550Park Luxury Wedding Films"),
      photo("photo-1492175742197-ed20dc5a6bed", "Bride standing in a shadowed doorway holding her bouquet", "Waiting in the doorway", "Petr Ovralov"),
      photo("photo-1639330693395-0944b5bef0c7", "Black-and-white photograph of the couple dancing beneath stage lights", "First dance", "Jeppe Mønster"),
    ],
  },

  /* --------------------------- Engagements --------------------------- */
  {
    slug: "sienna-marcus",
    title: "Pre-Wedding & Engagements",
    category: "engagements",
    client: "Chirag Photography",
    venue: "Event venue",
    location: "Bengaluru, India",
    year: 2025,
    guests: "Event coverage",
    excerpt: "A collection of moments, details and celebrations captured by Chirag Photography.",
    story: [
      "A collection of moments, details and celebrations captured by Chirag Photography in Bengaluru.",
      "Explore the photographs and contact us to discuss coverage for your own event.",
    ],
    photos: [
      photo("photo-1748628727234-90a141445150", "Couple embracing on an open hillside beneath a pale sky", "On the ridge", "Micah & Sammie Chaffin"),
      photo("photo-1693129551108-c1e0ab10f10e", "Black-and-white portrait of a couple holding each other in an open field", "Between the showers", "Mariela Ferbo"),
      photo("photo-1726766406089-0308c800b6b2", "Couple hugging in a field of tall golden grass", "Long grass, low sun", "Micah & Sammie Chaffin"),
      photo("photo-1583132648365-db96e1ea0c42", "Two small figures on a rocky outcrop above a hazy valley at golden hour", "The edge of everything", "Leo_Visions"),
      photo("photo-1782786661309-9a5dc5a4240a", "Couple kissing in a field of wildflowers", "Wildflowers", "Alexander Mass"),
    ],
  },
  {
    slug: "noor-elias",
    title: "Pre-Wedding & Engagements",
    category: "engagements",
    client: "Chirag Photography",
    venue: "Event venue",
    location: "Bengaluru, India",
    year: 2024,
    guests: "Event coverage",
    excerpt: "A collection of moments, details and celebrations captured by Chirag Photography.",
    story: [
      "A collection of moments, details and celebrations captured by Chirag Photography in Bengaluru.",
      "Explore the photographs and contact us to discuss coverage for your own event.",
    ],
    photos: [
      photo("photo-1540076156429-35ffe82b7870", "Man kissing his partner's forehead in warm evening light", "She said yes", "Allef Vinicius"),
      photo("photo-1614929511547-974944a54c92", "Close portrait of a couple touching foreheads, eyes closed", "Forehead to forehead", "Taylor Heery"),
      photo("photo-1579555973297-560c43ca7562", "An engagement ring being slipped onto her finger", "The ring", "Andre Jackson"),
      photo("photo-1621621667797-e06afc217fb0", "Couple nose to nose while he holds a bouquet of dried flowers", "Dried roses from the market", "Jonathan Borba"),
      photo("photo-1764529192114-3fc1653b8ec0", "Black-and-white profile portrait of a couple facing each other", "Blue hour, in black and white", "Céline Cao"),
    ],
  },

  /* ---------------------------- Birthdays ---------------------------- */
  {
    slug: "clara-turns-thirty",
    title: "Birthday Photography",
    category: "birthdays",
    client: "Chirag Photography",
    venue: "Event venue",
    location: "Bengaluru, India",
    year: 2025,
    guests: "Event coverage",
    excerpt: "A collection of moments, details and celebrations captured by Chirag Photography.",
    story: [
      "A collection of moments, details and celebrations captured by Chirag Photography in Bengaluru.",
      "Explore the photographs and contact us to discuss coverage for your own event.",
    ],
    photos: [
      photo("photo-1482731910308-31e96e5d1d28", "Woman leaning in to blow out the candles on her cake, fairy lights glowing behind her", "Make a wish", "Sergei Solo"),
      photo("photo-1770135005669-0094609c733e", "Friends clinking champagne glasses at a celebration", "Thirty, and thriving", "Desiray Green"),
      photo("photo-1577998474517-7eeeed4e448a", "Layered cake crowned with a lit sparkler", "The cake arrives", "Storiès"),
      photo("photo-1699730164892-d7c433524ff3", "Group of friends raising glasses among balloons", "A toast from the table", "OurWhisky Foundation"),
      photo("photo-1699730185428-d11054059c7f", "Guests celebrating under a shower of confetti and balloons", "Confetti o'clock", "OurWhisky Foundation"),
      photo("photo-1513546493312-0066d7de3fd2", "Three sparklers burning against the night sky", "Midnight sparklers", "Tim Zänkert"),
    ],
  },
  {
    slug: "leo-turns-five",
    title: "Birthday Photography",
    category: "birthdays",
    client: "Chirag Photography",
    venue: "Event venue",
    location: "Bengaluru, India",
    year: 2024,
    guests: "Event coverage",
    excerpt: "A collection of moments, details and celebrations captured by Chirag Photography.",
    story: [
      "A collection of moments, details and celebrations captured by Chirag Photography in Bengaluru.",
      "Explore the photographs and contact us to discuss coverage for your own event.",
    ],
    photos: [
      photo("photo-1608790672275-309c02d888ff", "Two children blowing out the candles on a layered birthday cake", "One big breath", "Nathan Dumlao"),
      photo("photo-1530103862676-de8c9debad1d", "A ceiling of pastel balloons trailing ribbons", "Ninety-nine balloons", "Adi Goldstein"),
      photo("photo-1513151233558-d860c5398176", "Confetti falling against a teal backdrop", "Confetti cannon", "Jason Leung"),
      photo("photo-1589218909732-f304d13fbf2c", "Birthday cake crowded with lit candles", "Five candles (and a few extra)", "Richard Burlton"),
      photo("photo-1607482369189-a53b6e71fa48", "Tall candles flickering on a chocolate cake in the dark", "Lights down", "Lan Gao"),
    ],
  },

  /* ------------------------ Parties & Nightlife ------------------------ */
  {
    slug: "maison-noir-new-years-eve",
    title: "Event Celebrations",
    category: "parties",
    client: "Chirag Photography",
    venue: "Event venue",
    location: "Bengaluru, India",
    year: 2025,
    guests: "Event coverage",
    excerpt: "A collection of moments, details and celebrations captured by Chirag Photography.",
    story: [
      "A collection of moments, details and celebrations captured by Chirag Photography in Bengaluru.",
      "Explore the photographs and contact us to discuss coverage for your own event.",
    ],
    photos: [
      photo("photo-1774543091182-d55b4a039d5c", "Champagne tower being filled at a party", "The tower", "Laszlo Barta"),
      photo("photo-1772615071673-d7805338c087", "Woman in a sequinned dress holding a champagne bottle and glass", "Sequins at eleven", "Kateryna Hliznitsova"),
      photo("photo-1768508950790-3bbdfe3973c1", "A crowd gathered beneath glowing pendant lamps", "The countdown", "Filip Rankovic Grobgaard"),
      photo("photo-1768508947605-8c7a50aed683", "Guests in black tie mingling around a champagne bar", "Black tie, gold light", "Filip Rankovic Grobgaard"),
      photo("photo-1776530899794-aaaa3b9dd1a1", "Champagne being poured into coupe glasses", "Another round", "Michel Stockman"),
      photo("photo-1753720221918-ac69df330bfe", "A mirrored disco ball scattering light in the dark", "After midnight", "Crystal Stone"),
    ],
  },
  {
    slug: "after-dark-ibiza",
    title: "Event Celebrations",
    category: "parties",
    client: "Chirag Photography",
    venue: "Event venue",
    location: "Bengaluru, India",
    year: 2024,
    guests: "Event coverage",
    excerpt: "A collection of moments, details and celebrations captured by Chirag Photography.",
    story: [
      "A collection of moments, details and celebrations captured by Chirag Photography in Bengaluru.",
      "Explore the photographs and contact us to discuss coverage for your own event.",
    ],
    photos: [
      photo("photo-1720623784273-f9388b9aa535", "Crowd silhouetted against an amber-lit stage", "Night one", "Godefroy Boutet"),
      photo("photo-1709131518045-0aa4d3b90e7c", "Dancers with arms raised under bright stage lights", "Hands up", "Roberto Rendon"),
      photo("photo-1630395822516-6751371dab8d", "Packed dance floor beneath a ceiling of disco balls", "The takeover", "Kajetan Sumila"),
      photo("photo-1485872299829-c673f5194813", "Two women laughing over cocktails", "Between sets", "Michael Discenza"),
      photo("photo-1580657274234-7339717f4541", "Champagne pouring into rows of flutes on a tray", "Service", "Alexander Naglestad"),
      photo("photo-1609421141185-8a4f37a5d063", "Friends holding sparklers and glasses of champagne", "Sunrise sparklers", "Kateryna Hliznitsova"),
    ],
  },

  /* --------------------------- Baby Showers --------------------------- */
  {
    slug: "hannahs-garden-shower",
    title: "Family Celebrations",
    category: "baby-showers",
    client: "Chirag Photography",
    venue: "Event venue",
    location: "Bengaluru, India",
    year: 2025,
    guests: "Event coverage",
    excerpt: "A collection of moments, details and celebrations captured by Chirag Photography.",
    story: [
      "A collection of moments, details and celebrations captured by Chirag Photography in Bengaluru.",
      "Explore the photographs and contact us to discuss coverage for your own event.",
    ],
    photos: [
      photo("photo-1697539093652-c7716caeceb1", "Women gathered on blankets in a leafy garden", "Afternoon in the garden", "Jorge Fernández Salas"),
      photo("photo-1738330943863-0f45d97e3455", "Sage-green table setting with printed napkins and a balloon", "Sage linens", "Ashwin Tanjore"),
      photo("photo-1738330943871-d6042cd471ea", "Close-up of a sage table setting with a gold Baby topper", "Little details", "Ashwin Tanjore"),
      photo("photo-1767070806009-152054f6edd5", "A long table set with flowers, candles and pastel napkins", "Tea for twenty-eight", "Jose Marroquin"),
      photo("photo-1579736283361-4008b21c7ed6", "An iced Oh Baby cookie surrounded by gold confetti", "Oh, baby", "Ajeet Singh"),
      photo("photo-1784706958675-9b53c92a85d8", "Pink peonies in a glass vase against a pale wall", "Peonies from her mother's garden", "Ana As"),
    ],
  },
  {
    slug: "awaiting-ava",
    title: "Family Celebrations",
    category: "baby-showers",
    client: "Chirag Photography",
    venue: "Event venue",
    location: "Bengaluru, India",
    year: 2024,
    guests: "Event coverage",
    excerpt: "A collection of moments, details and celebrations captured by Chirag Photography.",
    story: [
      "A collection of moments, details and celebrations captured by Chirag Photography in Bengaluru.",
      "Explore the photographs and contact us to discuss coverage for your own event.",
    ],
    photos: [
      photo("photo-1651663303138-4dc283e15992", "Expectant mother resting a hand on her belly beside a bright window", "Morning light", "Taisiia Stupak"),
      photo("photo-1627482939663-a92b7ee0e62b", "Woman in a white shirt standing by a curtained window", "The waiting", "Toa Heftiba"),
      photo("photo-1625797387199-0ba37c270e97", "Expectant mother in a white dress lit by low golden sun", "Golden weeks", "J. Balla Photography"),
      photo("photo-1438962136829-452260720431", "Parents-to-be holding a tiny pair of sneakers", "First shoes", "Drew"),
      photo("photo-1594150878496-a921e5af8907", "A tiny pair of baby shoes resting on a soft white blanket", "Small things", "Madhuri Mohite"),
    ],
  },

  /* ----------------------------- Corporate ----------------------------- */
  {
    slug: "meridian-leadership-summit",
    title: "Corporate & Event Photography",
    category: "corporate",
    client: "Chirag Photography",
    venue: "Event venue",
    location: "Bengaluru, India",
    year: 2025,
    guests: "Event coverage",
    excerpt: "A collection of moments, details and celebrations captured by Chirag Photography.",
    story: [
      "A collection of moments, details and celebrations captured by Chirag Photography in Bengaluru.",
      "Explore the photographs and contact us to discuss coverage for your own event.",
    ],
    photos: [
      photo("photo-1587825140708-dfaf72ae4b04", "Speaker on a central stage addressing a full auditorium", "Opening keynote", "Alexandre Pellaes"),
      photo("photo-1582192730841-2a682d7375f9", "Panel discussion on stage in front of a large audience", "Main-stage panel", "Product School"),
      photo("photo-1544531586-fde5298cdd40", "Presenter speaking to a packed room", "Breakout session", "Miguel Henriques"),
      photo("photo-1560439514-e960a3ef5019", "Keynote speaker on a stage washed in blue light", "Closing address", "Product School"),
      photo("photo-1582192903020-8a5e59dcdcf2", "Tiered auditorium filled with attendees", "Full house", "Product School"),
      photo("photo-1563461661026-49631dd5d68e", "Attendees networking in a bright, industrial event space", "Partner lounge", "Product School"),
    ],
  },
  {
    slug: "aurelia-awards-gala",
    title: "Corporate & Event Photography",
    category: "corporate",
    client: "Chirag Photography",
    venue: "Event venue",
    location: "Bengaluru, India",
    year: 2024,
    guests: "Event coverage",
    excerpt: "A collection of moments, details and celebrations captured by Chirag Photography.",
    story: [
      "A collection of moments, details and celebrations captured by Chirag Photography in Bengaluru.",
      "Explore the photographs and contact us to discuss coverage for your own event.",
    ],
    photos: [
      photo("photo-1536392706976-e486e2ba97af", "Long candlelit dinner table set with flowers", "Before the doors open", "M F"),
      photo("photo-1768508947825-0a63f7c46a2b", "Guests smiling at a formal evening gathering", "Arrivals", "Filip Rankovic Grobgaard"),
      photo("photo-1768508951262-42931f7ad924", "Gala guests waving and cheering toward the stage", "Winner announced", "Filip Rankovic Grobgaard"),
      photo("photo-1768508950243-16fd93e88d7f", "Three guests in black tie seated at a dinner table", "Table twelve", "Filip Rankovic Grobgaard"),
      photo("photo-1615763966401-c7003179a98c", "Folded napkins and wine glasses on a dressed table", "Place settings", "Crazy Cake"),
      photo("photo-1768508948485-a7adc1f3427f", "Guests mingling over drinks after the speeches", "After the speeches", "Filip Rankovic Grobgaard"),
    ],
  },
];

/* ------------------------------------------------------------------ */
// Curate the supplied original photographs across the existing project pages.
const suppliedPhotos = projects.flatMap((project) => project.photos).slice(0, 18);
let suppliedPhotoCursor = 0;
projects.forEach((project, index) => {
  const remainingProjects = projects.length - index;
  const remainingPhotos = suppliedPhotos.length - suppliedPhotoCursor;
  const take = Math.ceil(remainingPhotos / remainingProjects);
  project.photos = suppliedPhotos.slice(suppliedPhotoCursor, suppliedPhotoCursor + take);
  suppliedPhotoCursor += take;
});

/*  Studio portrait (About section)                                    */
/* ------------------------------------------------------------------ */

export const portrait = photo(
  "photo-1594296459195-8b2f3fbf1c86",
  "Photography portrait for Chirag Photography",
  "Chirag Photography",
  "Eduardo Gorghetto",
);


/* ------------------------------------------------------------------ */
/*  Lookups                                                            */
/* ------------------------------------------------------------------ */

const projectBySlug = new Map(projects.map((p) => [p.slug, p]));
const photoById = new Map(projects.flatMap((p) => p.photos.map((ph) => [ph.id, ph] as const)));

export function getProject(slug: string): Project | undefined {
  return projectBySlug.get(slug);
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}

function getPhoto(id: string): Photo {
  const found = photoById.get(id);
  if (!found) throw new Error(`Unknown photo id: ${id}`);
  return found;
}

export function toRef({ slug, title, client, location, year, category }: Project): ProjectRef {
  return { slug, title, client, location, year, category };
}

export function toLightboxItems(project: Project): LightboxItem[] {
  return project.photos.map((photo) => ({
    photo,
    title: project.title,
    meta: `${photo.caption} — ${project.location}, ${project.year}`,
  }));
}

/* ------------------------------------------------------------------ */
/*  Gallery sets                                                       */
/* ------------------------------------------------------------------ */

const galleryItems: GalleryItem[] = projects.flatMap((project) =>
  project.photos.map((photo) => ({ key: photo.id, photo, category: project.category, project: toRef(project) })),
);

function keysIn(category: CategorySlug): string[] {
  return galleryItems.filter((i) => i.category === category).map((i) => i.key);
}

/** Round-robin through categories so the "All" view reads as a curated mix. */
function interleave(groups: string[][]): string[] {
  const out: string[] = [];
  const longest = Math.max(...groups.map((g) => g.length));
  for (let i = 0; i < longest; i++) for (const g of groups) if (g[i]) out.push(g[i]);
  return out;
}

function buildSet(all: string[], perCategory: (c: CategorySlug) => string[]): GallerySet {
  const order = { all } as Record<Filter, string[]>;
  for (const slug of CATEGORY_SLUGS) order[slug] = perCategory(slug);
  const used = new Set(Object.values(order).flat());
  return { order, pool: galleryItems.filter((i) => used.has(i.key)) };
}

/** /work — the full archive. */
export const fullGallery: GallerySet = buildSet(interleave(CATEGORY_SLUGS.map(keysIn)), keysIn);

/** Home "Selected Work" — a tighter edit. */
export const selectedGallery: GallerySet = buildSet(interleave(CATEGORY_SLUGS.map(keysIn)), keysIn);

/*  Home page selections                                               */
/* ------------------------------------------------------------------ */

export interface HeroSlide {
  photo: Photo;
  label: string;
  place: string;
}

const beachHero = {
  ...projects[0].photos[0],
  id: "chirag-beach-hero",
  src: "/images/chirag-beach-hero.jpg",
  alt: "Beach photograph selected for the Chirag Photography homepage",
  caption: "Moments by the shore",
  credit: "Chirag Photography",
};
export const heroSlides: HeroSlide[] = [
  { photo: beachHero, label: "Chirag Photography", place: "Bengaluru" },
];

/** The story told in the pinned horizontal section. */
export const featuredProject = getProject("isabelle-theo")!;

/** One evocative frame per category for the services hover preview. */
export const serviceCovers: Record<CategorySlug, Photo> = Object.fromEntries(
  CATEGORY_SLUGS.map((slug) => {
    const project = projects.find((item) => item.category === slug)!;
    return [slug, project.photos[0]];
  }),
) as Record<CategorySlug, Photo>;

/** The journal / Instagram marquee. */
export const journalPhotos: Photo[] = projects.flatMap((project) => project.photos).slice(0, 12);
