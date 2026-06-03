export type HotspotCoordinates = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LocationId = "iglesia" | "centro-cultural" | "municipalidad" | "concejo" | "polideportivo";

export type Location = {
  id: LocationId;
  name: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  subtitle: string;
  description: string[];
  hotspotCoordinates: HotspotCoordinates;
};

export const MAP_IMAGE = {
  src: "/images/plaza-piray-20260603.png",
  width: 1672,
  height: 941,
};

export const locations: Location[] = [
  {
    id: "iglesia",
    name: "Iglesia San Lorenzo",
    image: "/images/iglesia-san-lorenzo.png",
    imageWidth: 1672,
    imageHeight: 941,
    subtitle: "Puerto Piray, Misiones",
    description: [
      "Iglesia San Lorenzo. Uno de los edificios más emblemáticos de Puerto Piray.",
      "Construida para servir como centro espiritual y comunitario de la ciudad.",
    ],
    hotspotCoordinates: { x: 35.7, y: 27.5, width: 8, height: 8 },
  },
  {
    id: "centro-cultural",
    name: "Centro Cultural",
    image: "/images/centro-cultural.png",
    imageWidth: 1536,
    imageHeight: 1024,
    subtitle: "Puerto Piray, Misiones",
    description: [
      "Centro Cultural. Un espacio de encuentro para actividades, talleres y expresiones artísticas.",
      "Forma parte del pulso comunitario que reúne a vecinos, instituciones y visitantes.",
    ],
    hotspotCoordinates: { x: 21, y: 60, width: 9, height: 8 },
  },
  {
    id: "municipalidad",
    name: "Municipalidad",
    image: "/images/municipalidad.png",
    imageWidth: 1536,
    imageHeight: 1024,
    subtitle: "Puerto Piray, Misiones",
    description: [
      "Municipalidad de Puerto Piray. Sede administrativa y punto de referencia institucional.",
      "Desde este edificio se acompaña la vida cotidiana y la organización de la ciudad.",
    ],
    hotspotCoordinates: { x: 52, y: 88, width: 9, height: 8 },
  },
  {
    id: "concejo",
    name: "Concejo Deliberante",
    image: "/images/concejo-deliberante.png",
    imageWidth: 1672,
    imageHeight: 941,
    subtitle: "Puerto Piray, Misiones",
    description: [
      "Concejo Deliberante. Lugar de debate, representación y construcción de decisiones públicas.",
      "Su presencia junto al circuito urbano recuerda el valor de la participación ciudadana.",
    ],
    hotspotCoordinates: { x: 66, y: 86, width: 8, height: 7 },
  },
  {
    id: "polideportivo",
    name: "Polideportivo",
    image: "/images/polideportivo.png",
    imageWidth: 1672,
    imageHeight: 941,
    subtitle: "Puerto Piray, Misiones",
    description: [
      "Polideportivo. Un espacio para el deporte, la recreación y los encuentros comunitarios.",
      "Allí la ciudad comparte movimiento, celebraciones y actividades para distintas generaciones.",
    ],
    hotspotCoordinates: { x: 77.5, y: 61.5, width: 11, height: 10 },
  },
];

export function getLocation(id: LocationId) {
  return locations.find((location) => location.id === id);
}
