import { AmbientOverlay } from "../components/AmbientOverlay";
import { FallingLeaves } from "../components/FallingLeaves";
import { GameButton } from "../components/GameButton";
import { SceneViewer } from "../components/SceneViewer";

export default function IglesiaPage() {
  return (
    <SceneViewer
      src="/images/iglesia-san-lorenzo.png"
      alt="Escena pixel-art visitable de la Iglesia San Lorenzo de Puerto Piray"
      title="Iglesia San Lorenzo"
      instruction="Arrastrá para explorar. Usá pinch o los botones para acercarte."
      minScale={1}
      maxScale={2.8}
      initialScale={1.08}
      overlay="dark"
      priority
      topLeftControls={<GameButton href="/">Volver</GameButton>}
    >
      <FallingLeaves count={8} />
      <AmbientOverlay scene="iglesia" />
    </SceneViewer>
  );
}
