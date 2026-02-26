import { useEffect, useMemo, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
  const [ready, setReady] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => setReady(true));
  }, []);

  const options = useMemo(
    () => ({
      fullScreen:{enable:false},
      background: { color:{value:"transparent" }},
      particles: {
        number: { value: 60, density: {enable: true}},
        color: {value: "#93bdef"},
        opacity: { value: 1.1},
        size: { value:1 },
        move: { enable: true, speed: 0.5},
        links: {
          enable: true,
          distance: 140,
          opacity: 1,
          width: 1,
          color: "#93bdef",
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (!ready) return null;
  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none"
      }}
    >
      <Particles id="tsparticles" options={options} />;
    </div>
  );
}
