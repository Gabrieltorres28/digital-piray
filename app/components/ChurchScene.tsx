import { getLocation } from "../data/locations";
import { LocationScene } from "./LocationScene";

type ChurchSceneProps = {
  isLeaving: boolean;
  onBack: () => void;
};

export function ChurchScene({ isLeaving, onBack }: ChurchSceneProps) {
  const location = getLocation("iglesia");

  if (!location) {
    return null;
  }

  return <LocationScene location={location} isLeaving={isLeaving} onBack={onBack} />;
}
