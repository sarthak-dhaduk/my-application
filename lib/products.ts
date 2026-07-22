export interface ProductSpecification {
  paragraph: string;
  points: string[];
}

export interface NewProduct {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  badges: string[];
  rootImage: any;
  images: any[];
  category: string;
  brand: string;
  rating: number;
  tag: 'Best Seller' | 'New Stock';
  offer?: number;
  price: number;
  specification: ProductSpecification;
}

export const NEW_PRODUCTS: NewProduct[] = [
  {
    "id": "mp1",
    "slug": "iphone-15",
    "name": "iPhone 15",
    "subtitle": "Innovative design featuring the Dynamic Island and 48MP Main camera.",
    "badges": [
      "5G",
      "A16 Bionic",
      "USB-C"
    ],
    "rootImage": "https://drive.google.com/uc?id=1CldVpSNoLRpnWljNk-h_R3n0Nhyi4WnC",
    "images": [
      "https://drive.google.com/uc?id=1vrh4qXEfrooFq4ke4c6idaBaSXqEgPme",
      "https://drive.google.com/uc?id=16wP5CKGjCU2mBGnNv6JsLMBZxNO0BC0z"
    ],
    "category": "Mobile",
    "brand": "Apple",
    "rating": 4.8,
    "tag": "New Stock",
    "offer": 10,
    "price": 799,
    "specification": {
      "paragraph": "Experience the next generation of mobile performance with the iPhone 15. Powered by the incredibly fast A16 Bionic chip, it features a durable color-infused glass and aluminum design.",
      "points": [
        "48MP Main camera with 2x Telephoto lens",
        "Dynamic Island alerts and live activities",
        "USB-C connector for universal charging",
        "All-day battery life up to 20 hours video playback"
      ]
    }
  },
  {
    "id": "mp2",
    "slug": "iphone-15-pro",
    "name": "iPhone 15 Pro",
    "subtitle": "Forged in titanium with the groundbreaking A17 Pro chip.",
    "badges": [
      "Titanium",
      "A17 Pro",
      "Action Button"
    ],
    "rootImage": "https://drive.google.com/uc?id=1YCXjq_pkQNdOv1PX657sRP0N8yr8gBIg",
    "images": [
      "https://drive.google.com/uc?id=1HUsCn1MX_IBs1Xh4Hc79V7FBVz7am5Yd",
      "https://drive.google.com/uc?id=1Odii4stGEIWiQxbzoJnHODI2g2edoKCY"
    ],
    "category": "Mobile",
    "brand": "Apple",
    "rating": 4.9,
    "tag": "Best Seller",
    "offer": 12,
    "price": 999,
    "specification": {
      "paragraph": "The first iPhone to feature an aerospace-grade titanium design, using the same alloy that spacecraft use for missions to Mars. The A17 Pro chip ushers in a completely new era of graphics performance.",
      "points": [
        "Strong and light titanium design",
        "Pro camera system with 3x or 5x Telephoto lens",
        "Customizable Action button",
        "Super Retina XDR display with ProMotion"
      ]
    }
  },
  {
    "id": "mp3",
    "slug": "samsung-galaxy-s24",
    "name": "Samsung Galaxy S24",
    "subtitle": "Welcome to the era of mobile AI with Galaxy AI.",
    "badges": [
      "Galaxy AI",
      "Exynos 2400",
      "120Hz Screen"
    ],
    "rootImage": "https://drive.google.com/uc?id=1AjNCpDC2t_FYYurkHxu3Jcpl9JoAK2Wj",
    "images": [
      "https://drive.google.com/uc?id=1lKA2XtN7T341PYvU_UZuWVeA4BnM3HsA",
      "https://drive.google.com/uc?id=1PWA26Xuh8oXFTcnNG7MioQt32V3P5XJG"
    ],
    "category": "Mobile",
    "brand": "Samsung",
    "rating": 4.7,
    "tag": "New Stock",
    "offer": 15,
    "price": 799,
    "specification": {
      "paragraph": "Unleash whole new levels of creativity, productivity and possibility starting with the most important device in your life: your smartphone. Powered by Galaxy AI to elevate every day.",
      "points": [
        "Circle to Search with Google",
        "Live Translate voice and text translation",
        "50MP camera with AI photo assist",
        "Brightest adaptive mobile display"
      ]
    }
  },
  {
    "id": "mp4",
    "slug": "samsung-galaxy-s24-ultra",
    "name": "Samsung Galaxy S24 Ultra",
    "subtitle": "The ultimate Galaxy Ultra with a titanium exterior and built-in S Pen.",
    "badges": [
      "Snapdragon 8 Gen 3",
      "200MP Camera",
      "S-Pen"
    ],
    "rootImage": "https://drive.google.com/uc?id=1r5B4p6MMcHiWqafYLzGZSBk8kKDb1rn6",
    "images": [
      "https://drive.google.com/uc?id=1l2sILjbOz_9gVdmmnFiKlyXC_W7a7wRC",
      "https://drive.google.com/uc?id=1OKC0nZ8Wa9HKfR2GGCJuO1RdJmQzhrtF"
    ],
    "category": "Mobile",
    "brand": "Samsung",
    "rating": 4.9,
    "tag": "Best Seller",
    "offer": 8,
    "price": 1299,
    "specification": {
      "paragraph": "Galaxy S24 Ultra features a durable titanium armor, scratch-resistant Corning Gorilla Armor glass, and the built-in S Pen for seamless precision control. Powered by Snapdragon 8 Gen 3.",
      "points": [
        "Built-in S Pen for note-taking and drawing",
        "Groundbreaking 200MP Main Camera",
        "100x Space Zoom with dual telephoto",
        "Longest-lasting battery in Galaxy lineup"
      ]
    }
  },
  {
    "id": "cp1",
    "slug": "ps-5-console",
    "name": "PlayStation 5 Console",
    "subtitle": "Experience lightning-fast loading with an ultra-high speed SSD.",
    "badges": [
      "4K HDR",
      "Ray Tracing",
      "DualSense"
    ],
    "rootImage": "https://drive.google.com/uc?id=1Q72OzCGJEZP4mPfXA94WCp-HGnpqb9XY",
    "images": [
      "https://drive.google.com/uc?id=1lSlUX4Vf_YcY_J57KLwS8yLKddFE2fC-",
      "https://drive.google.com/uc?id=1A4E0OJe5OAcgURgOFi-EdjwIodPGgKG0"
    ],
    "category": "Console",
    "brand": "Sony",
    "rating": 4.9,
    "tag": "Best Seller",
    "offer": 5,
    "price": 499,
    "specification": {
      "paragraph": "The PS5 console unleashes new gaming possibilities that you never anticipated. Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.",
      "points": [
        "Lightning-fast SSD for near-instant load times",
        "Stunning ray tracing visual effects",
        "Supports 4K UHD 120fps gaming output",
        "Deeper tactile immersion with DualSense controller"
      ]
    }
  },
  {
    "id": "cp2",
    "slug": "xbox-series-x",
    "name": "Xbox Series X",
    "subtitle": "The fastest, most powerful Xbox ever built.",
    "badges": [
      "12 Teraflops",
      "Velocity Architecture",
      "120 FPS"
    ],
    "rootImage": "https://drive.google.com/uc?id=1zX1oISc-vIyZmLuDfe0KYcclm06EoRDI",
    "images": [
      "https://drive.google.com/uc?id=1EjNTSP47uQ-eDwkLboXzrilep2vl16d_",
      "https://drive.google.com/uc?id=17tM8LD62xK00UHKW_NOuvXXZds18l8Am"
    ],
    "category": "Console",
    "brand": "Microsoft",
    "rating": 4.8,
    "tag": "Best Seller",
    "offer": 10,
    "price": 499,
    "specification": {
      "paragraph": "Uncompromising performance is at the heart of Xbox Series X. Powered by custom AMD processor and the Xbox Velocity Architecture, enjoy next-gen speed and graphics rendering in massive open worlds.",
      "points": [
        "12 teraflops of graphic processing power",
        "Custom 1TB SSD speeds up loads and quick resumes",
        "Backward compatible with thousands of classic games",
        "Optimized for Dolby Vision and Dolby Atmos"
      ]
    }
  },
  {
    "id": "cp3",
    "slug": "xbox-series-s",
    "name": "Xbox Series S",
    "subtitle": "Next-gen performance in the smallest Xbox ever.",
    "badges": [
      "All-Digital",
      "velocity architecture",
      "1440p Output"
    ],
    "rootImage": "https://drive.google.com/uc?id=1etwcijFik7xh0FyZukwJuIkYdjZRDdK3",
    "images": [
      "https://drive.google.com/uc?id=1OZdn-236U60Wqo_nkiD6AYy2-hXov4wC",
      "https://drive.google.com/uc?id=1ZfJaeusYEbaDLL3OOIBnohGEf6wc0v8m"
    ],
    "category": "Console",
    "brand": "Microsoft",
    "rating": 4.6,
    "tag": "New Stock",
    "offer": 15,
    "price": 299,
    "specification": {
      "paragraph": "Go all-digital with Xbox Series S and build a library of digital games. Experience next-gen speed and performance at an accessible price point, powered by a custom SSD and Quick Resume controls.",
      "points": [
        "Completely digital console without disc drive",
        "Ultra-compact design that fits anywhere easily",
        "Supports high-speed Quick Resume game-switching",
        "Gameplay rendering up to 120 FPS at 1440p"
      ]
    }
  },
  {
    "id": "cp4",
    "slug": "nintendo-gaming-remote",
    "name": "Nintendo Joy-Con Remotes",
    "subtitle": "Expand your multiplayer experience with a fresh set of Joy-Cons.",
    "badges": [
      "HD Rumble",
      "Motion Controls",
      "Dual Pack"
    ],
    "rootImage": "https://drive.google.com/uc?id=171m-L95w-T3qg3BqEPWB2Dd4MUcrbewO",
    "images": [
      "https://drive.google.com/uc?id=1Ka_eXx1RVa1yvm0XEIOg4Vsi_evDtba9",
      "https://drive.google.com/uc?id=14vNebljB5OSAdF63VK9GcFTm38wvcUJX"
    ],
    "category": "Console",
    "brand": "Nintendo",
    "rating": 4.7,
    "tag": "New Stock",
    "offer": 20,
    "price": 79,
    "specification": {
      "paragraph": "Introduce new ways to play with the Nintendo Joy-Con remotes. These versatile controllers offer multiple surprising ways for players to have fun, including HD rumble, motion sensors, and independent controls.",
      "points": [
        "Can be used as single controllers or pair configuration",
        "Precise motion sensors and HD Rumble vibration",
        "Compatible with all Nintendo Switch console systems",
        "Includes wrist straps for safety during action"
      ]
    }
  },
  {
    "id": "dp1",
    "slug": "royal-purple-anarkali-gown",
    "name": "Royal Purple Embroidered Anarkali Gown",
    "subtitle": "Elegantly crafted traditional gown with intricate gold embroideries.",
    "badges": [
      "Ethnic Wear",
      "Premium Silk",
      "Hand Embroidered"
    ],
    "rootImage": "https://drive.google.com/uc?id=13A0FNPT4PV0mLjFFiyPWKBY45SVvfx87",
    "images": [
      "https://drive.google.com/uc?id=1XhzJcpmVECmxYI4GkMbZ_QD5hWIbBDd8",
      "https://drive.google.com/uc?id=1sWLjuwexbAwgT4LnH3f1Bl-opAyDffyS",
      "https://drive.google.com/uc?id=1VfHOswsz2GIEO5Tp0T_SmVxf6RmabGW6"
    ],
    "category": "Dress",
    "brand": "Heritage Threads",
    "rating": 4.9,
    "tag": "Best Seller",
    "offer": 25,
    "price": 189,
    "specification": {
      "paragraph": "Stun the room in this premium silk Anarkali gown. Highlighted by detailed gold lace trims and embroidery work, it features a flowy skirt with flattering contours designed for weddings and special festive events.",
      "points": [
        "Crafted from high-grade raw georgette silk blend",
        "Intricate hand-stitched gold floral motif embroideries",
        "Includes matching sheer dupatta scarf and lining fabric",
        "Dry clean only to protect delicate thread work"
      ]
    }
  },
  {
    "id": "dp2",
    "slug": "floral-smocked-maxi-dress",
    "name": "Floral Smocked Maxi Dress",
    "subtitle": "Charming summer dress featuring a comfortable elastic smocked bodice.",
    "badges": [
      "100% Cotton",
      "Smocked Bodice",
      "Summer Dress"
    ],
    "rootImage": "https://drive.google.com/uc?id=1K8otGqyR55mcCrA4LKL-1jVo5F1RVsdw",
    "images": [
      "https://drive.google.com/uc?id=1huRXEJX44dQWA3x_8UKiASr2OGj3fcxK",
      "https://drive.google.com/uc?id=12QwZTPTKrhHFb0GwtXYxE1ukdfwAKu_9",
      "https://drive.google.com/uc?id=1Jp4j0Chg-Mm0zqmFkZ68uYfaqNHn5oAB"
    ],
    "category": "Dress",
    "brand": "Wildflower Co.",
    "rating": 4.7,
    "tag": "New Stock",
    "offer": 15,
    "price": 69,
    "specification": {
      "paragraph": "Step out in absolute comfort with this floral maxi dress. Detailed with an elastic smocked bodice and layered tier skirt, it provides a flexible fit that shifts beautifully with you during warm sunny days.",
      "points": [
        "Breathable 100% organic cotton weave",
        "Flexible elastic smocked bodice fits diverse sizes",
        "Tiered ruffle skirt with subtle ankle-length hem",
        "Machine washable with cold water on gentle cycle"
      ]
    }
  },
  {
    "id": "dp3",
    "slug": "ivory-blue-floral-embroidered-maxi-dress",
    "name": "Ivory Blue Floral Embroidered Maxi Dress",
    "subtitle": "Exquisite ivory dress detailed with contrasting blue floral stitch patterns.",
    "badges": [
      "Embroidered",
      "Ivory Blend",
      "Boho Style"
    ],
    "rootImage": "https://drive.google.com/uc?id=1offFiGqPPdEiFiLaJfr99_3Gndk6BBDC",
    "images": [
      "https://drive.google.com/uc?id=1YllA8cSKw6PqAIMQPVG8mrtcmEpJo4SJ",
      "https://drive.google.com/uc?id=1Zn1h828pxSDRRXWDGKE6H0iJdGZmoSme",
      "https://drive.google.com/uc?id=1j4jYGrm6TDPRZn8iMVfZFtnh51BV_oBN"
    ],
    "category": "Dress",
    "brand": "Wildflower Co.",
    "rating": 4.8,
    "tag": "New Stock",
    "offer": 18,
    "price": 95,
    "specification": {
      "paragraph": "Featuring contrasting blue floral embroideries scattered over a soft ivory base, this maxi dress creates a fresh bohemian look. Fully lined with a breathable interior slip for confident everyday wear.",
      "points": [
        "Lightweight linen-cotton weave exterior fabric",
        "Intricate sky blue floral embroidery work",
        "Relaxed fit with optional adjustable drawstring waist",
        "Fully lined inner layer prevents transparent show-through"
      ]
    }
  },
  {
    "id": "pp1",
    "slug": "taupe-cream-wave-polo",
    "name": "Taupe Cream Wave Polo Shirt",
    "subtitle": "Classic knit polo featuring a modern wavy knit pattern.",
    "badges": [
      "Structured Knit",
      "Breathable",
      "Relaxed Fit"
    ],
    "rootImage": "https://drive.google.com/uc?id=1IUamBXjuTIbKGsBuVxazpHiWOtY38-Hv",
    "images": [
      "https://drive.google.com/uc?id=1XBtXGeXpvmXSwwAu5IlYZje6PV3o32O4",
      "https://drive.google.com/uc?id=1PU2rikyune_lh_AXQjjLegygpgxhuXhV",
      "https://drive.google.com/uc?id=1rvDoTUfqJLQEzjYa5oAvSk_c-Fl9RIBr"
    ],
    "category": "Polos",
    "brand": "Avenue Knitwear",
    "rating": 4.7,
    "tag": "New Stock",
    "offer": 10,
    "price": 55,
    "specification": {
      "paragraph": "Update your smart-casual rotation with this wave-patterned polo. Expertly knit with alternating taupe and cream yarns, it yields a unique visual texture that holds its structure wash after wash.",
      "points": [
        "Premium cotton-merino knit yarn blend",
        "Textured wavy wave pattern throughout the fabric",
        "Ribbed collar and sleeve hems with 3-button placket",
        "Lays flat after washing without needing aggressive ironing"
      ]
    }
  },
  {
    "id": "pp2",
    "slug": "ivory-taupe-modern-panel-polo",
    "name": "Ivory Taupe Modern Panel Polo Shirt",
    "subtitle": "Colorblock knit polo with contrasting panels.",
    "badges": [
      "Colorblock",
      "Casual Chic",
      "Soft Blend"
    ],
    "rootImage": "https://drive.google.com/uc?id=1ow6-6amm_-r2mVU1UwywTV_TLezaOtcU",
    "images": [
      "https://drive.google.com/uc?id=1uJNTshf53Ca8gxBBa8mV4zkCynNC8Y8T",
      "https://drive.google.com/uc?id=1ws3eulrJpy3zeRnCczVqMVgc8FoDteod",
      "https://drive.google.com/uc?id=1f91l8OvS379EN5Hoam5hnHiwYzDkzyl8"
    ],
    "category": "Polos",
    "brand": "Avenue Knitwear",
    "rating": 4.8,
    "tag": "Best Seller",
    "offer": 12,
    "price": 58,
    "specification": {
      "paragraph": "A contemporary take on the athletic polo shirt, featuring structured ivory and taupe blocked panels. Made from a soft combed cotton blend that feels remarkably smooth against the skin.",
      "points": [
        "Premium combed cotton and viscose soft blend",
        "Contrasting modern panel colorblock design",
        "Slightly tapered fit for a clean modern silhouette",
        "Mercerized finish provides a subtle lustrous glow"
      ]
    }
  },
  {
    "id": "pp3",
    "slug": "navy-ivory-striped-knit-polo",
    "name": "Navy Ivory Striped Knit Polo Shirt",
    "subtitle": "Classic retro striped polo constructed in a vintage knit texture.",
    "badges": [
      "Vintage Style",
      "Striped",
      "Cotton Knit"
    ],
    "rootImage": "https://drive.google.com/uc?id=1WkkpcoMzdj_UMCEvKF-pozZtOVgvOHkv",
    "images": [
      "https://drive.google.com/uc?id=1uwH0Qz_5w9dGTCI6X9PfsilQcMUC7hqc",
      "https://drive.google.com/uc?id=1KLGKr6UKAB1OQ6v4osIpMtp5608q8V1c",
      "https://drive.google.com/uc?id=1XpnUUAErxyo8ZRwW4uinxTe7aogY4zvM"
    ],
    "category": "Polos",
    "brand": "Avenue Knitwear",
    "rating": 4.9,
    "tag": "Best Seller",
    "offer": 15,
    "price": 62,
    "specification": {
      "paragraph": "Evoking vintage mid-century leisurewear, this striped knit polo features horizontal stripes of navy and ivory. The open stitch construct keeps it highly breathable even in warm environments.",
      "points": [
        "100% high-twist breathable cotton knit",
        "Alternating horizontal navy and ivory retro stripes",
        "Ribbed hem band sits perfectly at the waistline",
        "Classic open camp collar without buttons"
      ]
    }
  },
  {
    "id": "sp1",
    "slug": "adidas-ultraboost-23",
    "name": "Adidas Ultraboost 23 Running Shoes",
    "subtitle": "Next-level energy return powered by advanced Light BOOST cushioning.",
    "badges": [
      "BOOST Tech",
      "Primeknit",
      "Recycled Materials"
    ],
    "rootImage": "https://drive.google.com/uc?id=1-hnLf_qn8l_MH80O3S6Oj15dmMXuRB1x",
    "images": [
      "https://drive.google.com/uc?id=16tF7pNMb7BpMtGfSPbFkkPgHZttEtmyE",
      "https://drive.google.com/uc?id=187UIu76uWTATWrcg8ndo_sWtWcYXbC4m"
    ],
    "category": "Shoes",
    "brand": "Adidas",
    "rating": 4.9,
    "tag": "Best Seller",
    "offer": 15,
    "price": 180,
    "specification": {
      "paragraph": "Experience epic energy return with the newest Adidas Ultraboost 23. Featuring our lightest BOOST cushioning yet, it pushes you forward with every stride, no matter the running distance.",
      "points": [
        "Light BOOST midsole provides maximum energy rebound",
        "Foot-hugging Primeknit+ textile upper fits snug",
        "Continental rubber outsole provides exceptional dry/wet grip",
        "Constructed using at least 50% recycled ocean plastics"
      ]
    }
  },
  {
    "id": "sp2",
    "slug": "adidas-runfalcon-3",
    "name": "Adidas Runfalcon 3 Running Shoes",
    "subtitle": "Supportive daily trainers built with a comfortable Cloudfoam midsole.",
    "badges": [
      "Cloudfoam",
      "Breathable Upper",
      "Daily Trainer"
    ],
    "rootImage": "https://drive.google.com/uc?id=1VRFWtQD4JEP43aftFcENhV0XATekuzt3",
    "images": [
      "https://drive.google.com/uc?id=1G1cpA4FnS_HNqRQYuNYEUj9ynEHB-n8K",
      "https://drive.google.com/uc?id=1jtORinwPuI7snD_88l6vUx6mk0s73kHJ"
    ],
    "category": "Shoes",
    "brand": "Adidas",
    "rating": 4.6,
    "tag": "New Stock",
    "offer": 10,
    "price": 65,
    "specification": {
      "paragraph": "Lace up for a jog in the park or your daily commute in these supportive training shoes. Equipped with a Cloudfoam midsole, they deliver plush step-in comfort from your very first step.",
      "points": [
        "Plush Cloudfoam cushioning midsole structure",
        "Breathable textile mesh upper keeps feet dry",
        "Durable rubber outsole provides multi-surface traction",
        "Padded collar reduces heel friction and irritation"
      ]
    }
  },
  {
    "id": "sp3",
    "slug": "nike-air-force-1-07",
    "name": "Nike Air Force 1 '07 Sneakers",
    "subtitle": "The legendary hoops classic returns with premium leather detailing.",
    "badges": [
      "Air Cushioning",
      "Genuine Leather",
      "Streetwear Classic"
    ],
    "rootImage": "https://drive.google.com/uc?id=19it6P_Q6EYO2AqHFWes3rIHdmAcy4DSX",
    "images": [
      "https://drive.google.com/uc?id=1CXBiW6QQ8ou1yPqHE3A2fb3DSn0_EAt0",
      "https://drive.google.com/uc?id=1rkgltS2hM77eQxJifQVXn-YKEypBgtt1"
    ],
    "category": "Shoes",
    "brand": "Nike",
    "rating": 4.9,
    "tag": "Best Seller",
    "offer": 5,
    "price": 115,
    "specification": {
      "paragraph": "The radiance lives on in the Nike Air Force 1 07, the basketball icon that puts a fresh spin on what you know best: stitched overlays, bold colors, and the perfect amount of flash.",
      "points": [
        "Genuine and synthetic leather stitched overlays",
        "Nike Air cushioning provides lightweight, all-day comfort",
        "Low-cut padded collar looks sleek and feels great",
        "Rubber outsole with classic pivot circle pattern"
      ]
    }
  },
  {
    "id": "sp4",
    "slug": "nike-lightweight-running-shoes",
    "name": "Nike Lightweight Running Shoes",
    "subtitle": "Ultra-lightweight daily running shoes designed for speed and comfort.",
    "badges": [
      "Zoom Air",
      "Flywire Cables",
      "Lightweight Mesh"
    ],
    "rootImage": "https://drive.google.com/uc?id=1pzbwf0CDOBD6IKHs0VwRtB_6wNCwB63A",
    "images": [
      "https://drive.google.com/uc?id=1hGIsHJ7WA_evwZyMzECdeQCd2u-_337T",
      "https://drive.google.com/uc?id=1PSKTKQ_ijhZA7SJrvg2j7W12jZd8pbNT"
    ],
    "category": "Shoes",
    "brand": "Nike",
    "rating": 4.7,
    "tag": "New Stock",
    "offer": 20,
    "price": 85,
    "specification": {
      "paragraph": "Designed for runners seeking speed and breathability. These shoes feature flywire cables for midfoot support and responsive Zoom Air unit in the heel for smooth transition and shock absorption.",
      "points": [
        "Responsive Zoom Air unit cushions impact",
        "Flywire cable integration locks foot down securely",
        "Minimalist mesh construction reduces overall weight",
        "Flex grooves in outsole guide natural foot motion"
      ]
    }
  },
  {
    "id": "wp1",
    "slug": "rolex-datejust-41",
    "name": "Rolex Datejust 41 Watch",
    "subtitle": "The definition of classic luxury featuring a pristine Oystersteel design.",
    "badges": [
      "Superlative Chronometer",
      "Oystersteel",
      "Fluted Bezel"
    ],
    "rootImage": "https://drive.google.com/uc?id=13UXWxCPGLRwby4U3AxTFA6ONHFIpBWw0",
    "images": [
      "https://drive.google.com/uc?id=1GlnUJ3Apbr16a_7n2h-Yf3p1aKovkNBJ",
      "https://drive.google.com/uc?id=11fQkLZtHvxqC46wlSdAvVq3C7B1BIOmk"
    ],
    "category": "Watches",
    "brand": "Rolex",
    "rating": 5,
    "tag": "Best Seller",
    "offer": 5,
    "price": 9900,
    "specification": {
      "paragraph": "The Rolex Datejust is the archetype of the classic watch, thanks to functions and aesthetics that never go out of style. The Oystersteel case and elegant fluted bezel are markers of ultimate horological distinction.",
      "points": [
        "904L Oystersteel high-corrosion resistant construction",
        "Signature Rolex fluted bezel in 18ct white gold",
        "Superlative Chronometer certified automatic movement",
        "Scratch-resistant sapphire crystal with Cyclops lens over date"
      ]
    }
  },
  {
    "id": "wp2",
    "slug": "rolex-submariner-date",
    "name": "Rolex Submariner Date Watch",
    "subtitle": "The reference among divers watches with a green Cerachrom bezel.",
    "badges": [
      "300m Waterproof",
      "Cerachrom Bezel",
      "Oyster Glide-lock"
    ],
    "rootImage": "https://drive.google.com/uc?id=1trRMw2QwjYrm3P3vZD09ebW_EK1zCD3x",
    "images": [
      "https://drive.google.com/uc?id=18d4F-Kswz9aUkvnU4tZzLTAbwLzUwACb",
      "https://drive.google.com/uc?id=1zsyybxkBH6G3KOMBB68RUzh2RqwL4QtL"
    ],
    "category": "Watches",
    "brand": "Rolex",
    "rating": 4.9,
    "tag": "Best Seller",
    "offer": 8,
    "price": 11500,
    "specification": {
      "paragraph": "The Submariner Date features a rotatable bezel, solid-link Oyster bracelet, and waterproof oyster case. Ideal for diving with its green Cerachrom bezel insert in ceramic and large luminescent hour markers.",
      "points": [
        "Waterproof up to 300 meters (1000 feet)",
        "Unidirectional rotatable ceramic Cerachrom bezel",
        "Chromalight display with long-lasting blue luminescence",
        "Oysterlock clasp prevents accidental opening"
      ]
    }
  },
  {
    "id": "wp3",
    "slug": "titan-black-minimal",
    "name": "Titan Black Minimal Watch",
    "subtitle": "Ultra-thin sleek black dress watch with a minimalist face.",
    "badges": [
      "Slim Profile",
      "Quartz Precision",
      "All-Black"
    ],
    "rootImage": "https://drive.google.com/uc?id=1qcPl9D1jAXlcUmxOCF72bPhj6vwA-0vK",
    "images": [
      "https://drive.google.com/uc?id=1GO-sZ7Pfxi4szae2cbNTbT5RID6-QZze",
      "https://drive.google.com/uc?id=104cnAjAjvXXe52WhQA1z-x6y99Vc_uw5"
    ],
    "category": "Watches",
    "brand": "Titan",
    "rating": 4.7,
    "tag": "New Stock",
    "offer": 12,
    "price": 120,
    "specification": {
      "paragraph": "Elevate your evening wardrobe with this all-black minimalist watch from Titan. Measuring just 5.5mm thick, it slips effortlessly under cuffs and offers a clean, understated modern aesthetic.",
      "points": [
        "Ultra-slim 5.5mm case diameter profiling",
        "Precision Japanese quartz timekeeping movement",
        "Stainless steel mesh band with adjustable safety clasp",
        "Splashproof design suitable for daily casual wear"
      ]
    }
  },
  {
    "id": "wp4",
    "slug": "titan-navy-classic",
    "name": "Titan Navy Classic Watch",
    "subtitle": "Elegant watch featuring a deep navy blue dial and brown leather band.",
    "badges": [
      "Leather Strap",
      "Navy Dial",
      "Date Window"
    ],
    "rootImage": "https://drive.google.com/uc?id=17rdaidaANk7S9P7-ghn_ZGq8Gfoss8lG",
    "images": [
      "https://drive.google.com/uc?id=1QA_Mwqoi9qfUPFsoBeEOs3L8kQLQf0to",
      "https://drive.google.com/uc?id=12qA25NExGgYgSBkbeCjG7jz_vONlyEXz"
    ],
    "category": "Watches",
    "brand": "Titan",
    "rating": 4.8,
    "tag": "New Stock",
    "offer": 15,
    "price": 145,
    "specification": {
      "paragraph": "Blending classic style and modern color accents, this Titan analog watch features a sunray navy blue dial housed in a polished silver-tone stainless steel case. Paired with a genuine brown leather strap.",
      "points": [
        "Genuine calfskin brown textured leather strap",
        "Bold navy blue sunray dial with silver hour batons",
        "Built-in quick-set date window at the 3 o clock mark",
        "Water-resistant housing up to 50 meters depth"
      ]
    }
  }
];
