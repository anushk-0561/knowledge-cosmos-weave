import { Suspense, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { StarField } from "./StarField";
import { EnergySphere } from "./EnergySphere";
import * as THREE from "three";

function CameraRig({ launching }: { launching: boolean }) {
  const { camera, mouse } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 7));
  useFrame((_, dt) => {
    if (launching) {
      target.current.z = THREE.MathUtils.lerp(target.current.z, -2, 0.06);
    } else {
      target.current.x = mouse.x * 1.4;
      target.current.y = mouse.y * 0.9;
      target.current.z = 7;
    }
    camera.position.lerp(target.current, Math.min(1, dt * 3));
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function LandingScene({ launching = false }: { launching?: boolean }) {
  return (
    <Suspense fallback={null}>
      <color attach="background" args={["#050816"]} />
      <fog attach="fog" args={["#050816", 12, 40]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#7B61FF" />
      <pointLight position={[-5, -3, 3]} intensity={1} color="#00F5D4" />
      <StarField count={3000} radius={45} />
      <EnergySphere intensity={launching ? 2 : 1} />
      <CameraRig launching={launching} />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.6} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Suspense>
  );
}