
import { Camera, Image, Video, Instagram, UserCheck, Clock, CreditCard, Award } from "lucide-react";

// Refined color palette for icons with gradients and consistent colors
export const iconColors = {
  Camera: { 
    bg: "bg-indigo-50", 
    text: "text-indigo-600",
    gradient: "from-indigo-500 to-blue-500"
  },
  Image: { 
    bg: "bg-blue-50", 
    text: "text-blue-600",
    gradient: "from-blue-500 to-cyan-500"
  },
  Video: { 
    bg: "bg-violet-50", 
    text: "text-violet-600",
    gradient: "from-violet-500 to-purple-500"
  },
  Instagram: { 
    bg: "bg-pink-50", 
    text: "text-pink-600",
    gradient: "from-pink-500 to-rose-500"
  },
  UserCheck: { 
    bg: "bg-emerald-50", 
    text: "text-emerald-600",
    gradient: "from-emerald-500 to-green-500"
  },
  Clock: { 
    bg: "bg-amber-50", 
    text: "text-amber-600",
    gradient: "from-amber-500 to-yellow-500"
  },
  CreditCard: { 
    bg: "bg-cyan-50", 
    text: "text-cyan-600",
    gradient: "from-cyan-500 to-sky-500"
  },
  Award: { 
    bg: "bg-rose-50", 
    text: "text-rose-600",
    gradient: "from-rose-500 to-pink-500"
  },
};

// Export the Lucide icon components directly
export const featureIcons = {
  Camera,
  Image,
  Video,
  Instagram,
  UserCheck,
  Clock,
  CreditCard,
  Award
};
