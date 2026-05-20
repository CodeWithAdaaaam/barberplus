export interface Testimonial {
  id: number;
  name: string;
  quote: string;
  date: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Youssef K.",
    quote: "Excellent service et ambiance chaleureuse. Le personnel est compétent et à l'écoute. Je recommande vivement Barber Plus !",
    date: "Il y a 2 semaines",
    rating: 5,
  },
  {
    id: 2,
    name: "Mehdi A.",
    quote: "La meilleure expérience de barbier à Rabat. Le salon est impeccable et les barbers sont de vrais professionnels. Mon nouveau barber préféré !",
    date: "Il y a 3 semaines",
    rating: 5,
  },
  {
    id: 3,
    name: "Karim B.",
    quote: "Service impeccable, ambiance sympa et équipe professionnelle. Je suis très satisfait de ma coupe et je reviendrai sans hésiter.",
    date: "Il y a 1 mois",
    rating: 5,
  },
];
