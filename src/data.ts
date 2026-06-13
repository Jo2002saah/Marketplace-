import { Artisan } from "./types";

export const GHANA_LOCATIONS = [
  "East Legon, Accra",
  "Osu, Accra",
  "Spintex, Accra",
  "Adum, Kumasi",
  "Danyame, Kumasi",
  "Suame, Kumasi",
  "Beach Road, Takoradi",
  "Anaji, Takoradi",
  "Ola, Cape Coast",
  "Cantonments, Accra",
  "Tamale Central, Tamale",
];

export const INITIAL_ARTISANS: Artisan[] = [
  {
    id: "artisan_1",
    name: "Kwaku Mensah",
    category: "electrician",
    location: "East Legon, Accra",
    phone: "024 456 7890",
    rating: 4.9,
    reviewsCount: 3,
    rateGhs: 65,
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Certified electrical contractor with over 10 years of domestic and commercial wiring experience in Greater Accra. Specializes in solar panel installation, inverter setups, smart home automation, and fault tracing.",
    specialties: ["Home Rewiring", "Solar & Inverter Setup", "Short Circuit Repair", "Breaker Panel Upgrade"],
    isVerified: true,
    tradeCertificate: "NABPTEX Level II Electrical Trade Test",
    completedJobs: 142,
    yearsExperience: 11,
    availability: "always",
    latitude: 5.6310,
    longitude: -0.1601,
    isPremium: true,
    isFeatured: true,
    reviews: [
      {
        id: "rev_1_1",
        customerName: "Benjamin Osei",
        rating: 5,
        comment: "Excellent service! Kwaku identified the fault in our distribution board within 15 minutes. Very respectful and cleaned up the workspace.",
        date: "2026-05-12",
        isVerifiedBooking: true
      },
      {
        id: "rev_1_2",
        customerName: "Naa Darkua",
        rating: 5,
        comment: "Highly recommend him for solar backup setup. Detailed quotation and clean installation.",
        date: "2026-05-28",
        isVerifiedBooking: true
      },
      {
        id: "rev_1_3",
        customerName: "Kofi Appiah",
        rating: 4.7,
        comment: "Very professional tradesman. Replaced our faulting ceiling fans and sockets without any fuss.",
        date: "2026-06-03",
        isVerifiedBooking: true
      }
    ]
  },
  {
    id: "artisan_2",
    name: "Ama Serwaah",
    category: "painter",
    location: "Adum, Kumasi",
    phone: "027 123 4567",
    rating: 4.8,
    reviewsCount: 2,
    rateGhs: 50,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Professional painter and interior stylist providing premium textured paints, damp wall treatments, POP installation, and mural services in Kumasi metro.",
    specialties: ["Textured Painting", "Wall Spackling & Treatment", "POP Ceiling Installations", "Exterior Waterproofing Prep"],
    isVerified: true,
    tradeCertificate: "NVTI Grade 1 Painting & Decorating",
    completedJobs: 98,
    yearsExperience: 7,
    availability: "today",
    latitude: 6.6853,
    longitude: -1.6250,
    isPremium: true,
    reviews: [
      {
        id: "rev_2_1",
        customerName: "Dr. Evelyn Boateng",
        rating: 5,
        comment: "Ama's attention to detail is superb. She treated our damp living room walls before giving it a amazing silk finish.",
        date: "2026-04-19",
        isVerifiedBooking: true
      },
      {
        id: "rev_2_2",
        customerName: "Yaa Konadu",
        rating: 4.6,
        comment: "Punctual and very creative. Her color combinations made our beauty studio look absolutely brilliant.",
        date: "2026-05-02",
        isVerifiedBooking: true
      }
    ]
  },
  {
    id: "artisan_3",
    name: "Kofi Boateng",
    category: "mechanic",
    location: "Suame, Kumasi",
    phone: "020 987 6543",
    rating: 4.7,
    reviewsCount: 3,
    rateGhs: 80,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Suame Magazine veteran motor technician. Expert in computerized car engine diagnostics, gearbox rebuilds, suspensions, and general repairs (Toyota, Hyundai, Kia, Nissan specialist).",
    specialties: ["Engine Diagnostic Scanning", "Automatic & Manual Gearbox Repair", "Brake Pad & Disc Servicing", "Suspension System Overhauls"],
    isVerified: true,
    tradeCertificate: "Government Trade Test Certificate - Motor Vehicle Mechanic",
    completedJobs: 310,
    yearsExperience: 15,
    availability: "always",
    latitude: 6.7167,
    longitude: -1.6333,
    reviews: [
      {
        id: "rev_3_1",
        customerName: "Charles Mensah",
        rating: 5,
        comment: "Best mechanic in Kumasi. He diagnosed my Hyundai Elantra's stalling issue which three other mechanics couldn't figure out.",
        date: "2026-04-20",
        isVerifiedBooking: true
      },
      {
        id: "rev_3_2",
        customerName: "Amma Frimpong",
        rating: 4,
        comment: "Good service, very helpful. He replaced the shock absorbers and tie rods. Clean job.",
        date: "2026-05-15",
        isVerifiedBooking: true
      },
      {
        id: "rev_3_3",
        customerName: "Kwabena Duffour",
        rating: 5,
        comment: "Honest service without inflated prices. Kofi will explain every part he buys from Suame.",
        date: "2026-06-05",
        isVerifiedBooking: true
      }
    ]
  },
  {
    id: "artisan_4",
    name: "Yao Tsatsu",
    category: "carpenter",
    location: "Spintex, Accra",
    phone: "055 876 5432",
    rating: 5.0,
    reviewsCount: 2,
    rateGhs: 75,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Expert master carpenter and structural woodwork specialist. Crafted bespoke hardwood furniture, commercial roofing repairs, kitchen cabinetry setups, and high-security lock replacements.",
    specialties: ["Ghana Hardwood Furniture", "Roofing Framework & Leak Fixes", "Custom Kitchen Cabinetry", "Security Lock Fitments"],
    isVerified: true,
    tradeCertificate: "Technical Apprentice Board - Master Woodworker",
    completedJobs: 84,
    yearsExperience: 9,
    availability: "weekends",
    latitude: 5.6253,
    longitude: -0.1118,
    reviews: [
      {
        id: "rev_4_1",
        customerName: "Gifty Adjaye",
        rating: 5,
        comment: "Yao designed and fitted our built-in master wardrobes. High-quality Odum wood and pristine finishes. Will hire again!",
        date: "2026-05-09",
        isVerifiedBooking: true
      },
      {
        id: "rev_4_2",
        customerName: "Michael Tackie",
        rating: 5,
        comment: "Replaced our storm-damaged roofing woodwork in no time. Sturdy construction.",
        date: "2026-05-24",
        isVerifiedBooking: true
      }
    ]
  },
  {
    id: "artisan_5",
    name: "Ekow Hammond",
    category: "plumber",
    location: "Beach Road, Takoradi",
    phone: "024 333 4444",
    rating: 4.6,
    reviewsCount: 2,
    rateGhs: 55,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Licensed plumbing technician. Specializes in overhead water tank (Polytank) installations, domestic pressure booster pumps, complex damp leak detection, and sanitary ware fixtures.",
    specialties: ["Polytank & Booster Pump Setup", "Clogged Sewage & Drain Solutions", "Concealed Wall Leak Detection", "Sewer Line Treatment"],
    isVerified: true,
    tradeCertificate: "NVTI Grade II Certified Plumber",
    completedJobs: 115,
    yearsExperience: 6,
    availability: "today",
    latitude: 4.8967,
    longitude: -1.7590,
    isFeatured: true,
    reviews: [
      {
        id: "rev_5_1",
        customerName: "Araba Attah",
        rating: 4.5,
        comment: "Clean polytank plumbing! Cleaned the old rusty pipes and now water pressure is incredible.",
        date: "2024-03-30",
        isVerifiedBooking: true
      },
      {
        id: "rev_5_2",
        customerName: "Joshua Cudjoe",
        rating: 4.7,
        comment: "Very reliable plumber. Successfully resolved water logging behind our bathroom wall.",
        date: "2024-04-12",
        isVerifiedBooking: true
      }
    ]
  },
  {
    id: "artisan_6",
    name: "Emmanuel Tetteh",
    category: "mason",
    location: "Cantonments, Accra",
    phone: "024 555 1111",
    rating: 4.9,
    reviewsCount: 1,
    rateGhs: 95,
    avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Professional mason with 12 years of experience in Accra. Expert in laying building foundations, masonry blocks, precise tiling for kitchens and bathrooms, and plastering walls.",
    specialties: ["Foundation Layouts", "Precision Tiling", "Plastering & Rendering", "Brickwork Construction"],
    isVerified: true,
    tradeCertificate: "NVTI Grade I Masonry Technology",
    completedJobs: 135,
    yearsExperience: 12,
    availability: "always",
    latitude: 5.5862,
    longitude: -0.1752,
    isPremium: true,
    reviews: [
      {
        id: "rev_6_1",
        customerName: "Theresa Mensah",
        rating: 5,
        comment: "Excellent mason work. He tiled our entire 3-bedroom house within a week. Faultless alignment!",
        date: "2026-05-18",
        isVerifiedBooking: true
      }
    ]
  },
  {
    id: "artisan_7",
    name: "Kofi Ansah",
    category: "welder",
    location: "Osu, Accra",
    phone: "020 444 8888",
    rating: 4.8,
    reviewsCount: 1,
    rateGhs: 70,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Metal fabrication and welding specialist. Experienced in crafting burglar-proof gates, window frames, metal doors, structural metal trusses, and vehicle exhaust welding.",
    specialties: ["Burglar Proof Gate Fabrication", "Security Window Frames", "Metal Structural Trusses", "Arc & Gas Welding"],
    isVerified: true,
    tradeCertificate: "Master Fabricator Guild Endorsement",
    completedJobs: 74,
    yearsExperience: 8,
    availability: "today",
    latitude: 5.5562,
    longitude: -0.1833,
    reviews: [
      {
        id: "rev_7_1",
        customerName: "Ebenezer Lartey",
        rating: 5,
        comment: "Beautiful burglar-proof gate crafted to exact specs. Kofi was extremely professional.",
        date: "2026-06-01",
        isVerifiedBooking: true
      }
    ]
  },
  {
    id: "artisan_8",
    name: "Justice Ofori",
    category: "ac_technician",
    location: "East Legon, Accra",
    phone: "050 999 4444",
    rating: 4.7,
    reviewsCount: 1,
    rateGhs: 85,
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Refrigeration and Air Conditioning Expert installing and fixing inverter split/window AC units, industrial cold rooms, domestic fridges, and commercial display freezers.",
    specialties: ["Air Conditioner Installation", "Freon Gas Refilling", "Fridge compressor servicing", "Split AC Leak Repairs"],
    isVerified: true,
    tradeCertificate: "Refrigeration & AC Tech Association (RATA) Ghana Cert",
    completedJobs: 112,
    yearsExperience: 10,
    availability: "always",
    latitude: 5.6420,
    longitude: -0.1550,
    isPremium: true,
    reviews: [
      {
        id: "rev_8_1",
        customerName: "Abena Mansah",
        rating: 5,
        comment: "Justice was super quick in resolving our AC cooling issue. He replaced the capacitor and refilled the gas.",
        date: "2026-05-22",
        isVerifiedBooking: true
      }
    ]
  },
  {
    id: "artisan_9",
    name: "Samuel Osei",
    category: "pop_technician",
    location: "Spintex, Accra",
    phone: "027 888 9999",
    rating: 4.9,
    reviewsCount: 1,
    rateGhs: 90,
    avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Artistic Plaster of Paris (POP) technician delivering ornate ceiling designs, suspended modern POP with integrated led lighting, crown moulding, and architectural finishes.",
    specialties: ["Suspended POP Ceilings", "Cornice & Dome Moulding", "Ornate Centerpieces", "Modern LED Tray Designs"],
    isVerified: true,
    tradeCertificate: "NVTI Certified Plastering Architect",
    completedJobs: 89,
    yearsExperience: 6,
    availability: "weekends",
    latitude: 5.6180,
    longitude: -0.1250,
    isFeatured: true,
    reviews: [
      {
        id: "rev_9_1",
        customerName: "Gifty Boadi",
        rating: 5,
        comment: "Our new living room suspended POP looks like a luxury hotel! Samuel is very creative.",
        date: "2026-06-10",
        isVerifiedBooking: true
      }
    ]
  }
];

export const SUGGEST_ISSUES = [
  {
    title: "Air Conditioner Sockets Sparking",
    description: "The wall socket sparks when I switch on the AC unit, then smells of burning plastic.",
    category: "electrician"
  },
  {
    title: "Overhead Tank Leaking",
    description: "Our domestic Polytank has a slow crack at the bottom-fitting, water is wasting constantly.",
    category: "plumber"
  },
  {
    title: "Car Stalling & Exhaust Smoke",
    description: "Engine stutters whenever I stop at a traffic light and there is white smoke coming out of the tailpipe.",
    category: "mechanic"
  },
  {
    title: "Kitchen Cabinet Hinges Broken",
    description: "The doors of three hardwood cabinets have sagging hinges and won't shut completely.",
    category: "carpenter"
  },
  {
    title: "Water Stains on Gypsum POP",
    description: "Water leaked from the top roofing onto the white POP ceiling generating yellow marks and flaky paint.",
    category: "painter"
  },
  {
    title: "Need Masonry Foundation Blockwork",
    description: "We are casting building foundations, laying bricks/blocks, plastering main walls, and rendering ceramic tiles.",
    category: "mason"
  },
  {
    title: "Fabricating Burglar Proof Security Gates",
    description: "Welding heavy iron security gates, metal door fixtures, and window grills for safe commercial lockups.",
    category: "welder"
  },
  {
    title: "Inverter AC Unit Installation & Gas Refill",
    description: "Installing split air conditioning units, testing compressors, finding freon coolant leaks, and fixing fridges.",
    category: "ac_technician"
  },
  {
    title: "Suspended Gypsum POP Design",
    description: "Crafting beautiful white Plaster of Paris suspended tray ceilings, cornices, dome designs, and modern lighting fixtures.",
    category: "pop_technician"
  }
];
