export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: "coupes" | "barbes" | "styles" | "interieur";
}

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/images/gallery-haircut-1.jpg",
    alt: "Coupe homme moderne avec dégradé",
    category: "coupes",
  },
  {
    id: 2,
    src: "/images/gallery-beard-1.jpg",
    alt: "Taille de barbe professionnelle",
    category: "barbes",
  },
  {
    id: 3,
    src: "/images/gallery-shave-1.jpg",
    alt: "Rasage traditionnel au coupe-choux",
    category: "styles",
  },
  {
    id: 4,
    src: "/images/gallery-style-1.jpg",
    alt: "Style coupe undercut",
    category: "coupes",
  },
  {
    id: 5,
    src: "/images/gallery-interior-1.jpg",
    alt: "Intérieur du salon Barber Plus",
    category: "interieur",
  },
  {
    id: 6,
    src: "/images/gallery-haircut-2.jpg",
    alt: "Coupe dégradé précision",
    category: "coupes",
  },
  {
    id: 7,
    src: "/images/gallery-beard-2.jpg",
    alt: "Barbe parfaitement entretenue",
    category: "barbes",
  },
  {
    id: 8,
    src: "/images/gallery-style-2.jpg",
    alt: "Styling et coiffage",
    category: "styles",
  },
  {
    id: 9,
    src: "/images/gallery-tools-1.jpg",
    alt: "Outils de barbier premium",
    category: "interieur",
  },
  {
    id: 10,
    src: "/images/hero-styling.jpg",
    alt: "Barber au travail",
    category: "styles",
  },
  {
    id: 11,
    src: "/images/hero-interior.jpg",
    alt: "Intérieur luxueux du salon",
    category: "interieur",
  },
  {
    id: 12,
    src: "/images/booking-cta.jpg",
    alt: "Fauteuil de barbier premium",
    category: "interieur",
  },
];

export const galleryCategories = [
  { value: "tous", label: "Tous" },
  { value: "coupes", label: "Coupes" },
  { value: "barbes", label: "Barbes" },
  { value: "styles", label: "Styles" },
];
