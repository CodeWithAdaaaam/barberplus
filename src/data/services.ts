export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  icon: string;
}

export const services: Service[] = [
  {
    id: "coupe-homme",
    name: "Coupe Homme & Styling",
    description: "Des coupes modernes et personnalisées adaptées à votre style et à la forme de votre visage.",
    duration: "30 min",
    price: 60,
    icon: "Scissors",
  },
  {
    id: "barbe",
    name: "Taille de Barbe & Soin",
    description: "Taille précise et soins de la barbe pour un look soigné et masculin.",
    duration: "20 min",
    price: 40,
    icon: "Sparkles",
  },
  {
    id: "coupe-barbe",
    name: "Coupe + Barbe",
    description: "Forfait complet incluant coupe de cheveux et taille de barbe.",
    duration: "45 min",
    price: 90,
    icon: "Crown",
  },
  {
    id: "rasage",
    name: "Rasage Traditionnel",
    description: "Rasage classique au coupe-choux avec serviettes chaudes et produits de qualité.",
    duration: "30 min",
    price: 50,
    icon: "FlaskConical",
  },
  {
    id: "soin-visage",
    name: "Soin Visage Masculin",
    description: "Nettoyage profond, hydratation et soins pour une peau fraîche et revitalisée.",
    duration: "40 min",
    price: 80,
    icon: "Heart",
  },
  {
    id: "coupe-enfant",
    name: "Coupe Enfant",
    description: "Coupe adaptée pour les plus jeunes dans une ambiance conviviale.",
    duration: "20 min",
    price: 40,
    icon: "Smile",
  },
];

export const serviceListForTable = [
  { name: "Coupe Homme", description: "Coupe de cheveux moderne et stylée", duration: "30 min", price: 60 },
  { name: "Barbe", description: "Taille et entretien de la barbe", duration: "20 min", price: 40 },
  { name: "Coupe + Barbe", description: "Forfait coupe et barbe complet", duration: "45 min", price: 90 },
  { name: "Rasage au Couteau", description: "Rasage traditionnel au coupe-choux", duration: "30 min", price: 50 },
  { name: "Soin Visage Homme", description: "Soin complet du visage", duration: "40 min", price: 80 },
  { name: "Coupe Enfant", description: "Coupe pour les plus jeunes", duration: "20 min", price: 40 },
];
