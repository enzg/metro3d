import { OrbitControls, TransformControls } from '@react-three/drei'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { MathUtils, Vector3 } from 'three'
import { DynamicModel } from './Model'
const player = {
  height: 100.0,
  speed: 4.0,
  turnSpeed: Math.PI * 0.02
}
export default ({ mt }) => {
  const { camera, mouse, raycaster } = useThree()
  const rollOverRef = useRef()
  const planeRef = useRef()
  const keyboard = useRef({})
  const trans = useRef()
  const orb = useRef()
  const [modList, setModList] = useState([])
  useEffect(() => {
    const keyUp = (evt) => {
      keyboard.current[evt.keyCode] = false
    }
    const keyDown = (evt) => {
      keyboard.current[evt.keyCode] = true
    }
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
    playerSetup(camera)

    trans.current.detach()
    trans.current.addEventListener('dragging-changed', (evt) => {
      orb.current.enabled = !evt.value
    })
    trans.current.mode = 'translate'

    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
    }
  }, [camera])
  useFrame(() => {
    raycastUpdate(rollOverRef, planeRef, raycaster, mouse, camera, mt)
    playerMove(camera, keyboard)
  })
  return (
    <>
      <TransformControls ref={trans} position={[0, 3000000, 0]} />
      <Suspense fallback={null}>{modList}</Suspense>
      <mesh ref={rollOverRef}>
        <boxBufferGeometry attach="geometry" args={[50, 50, 50]} />
        <meshPhongMaterial
          attach="material"
          color="lightgreen"
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh
        onDoubleClick={(evt) => {
          const pos = evt.point.toArray()
          setModList(
            modList.concat(
              <DynamicModel
                position={[pos[0], 0, pos[2]]}
                pathList={['https://www.1024k.co/car/chache.FBX']}
                ctrl={trans}
                key={MathUtils.generateUUID()}
              />
            )
          )
        }}
        ref={planeRef}
        name="plane"
        receiveShadow
        rotation={[-0.5 * Math.PI, 0, 0]}>
        <planeBufferGeometry attach="geometry" args={[800000, 800000]} />
        <meshPhongMaterial transparent opacity={0} attach="material" />
      </mesh>
      <OrbitControls
        ref={orb}
        enableDamping
        minPolarAngle={0}
        maxPolarAngle={0.51 * Math.PI}
      />
    </>
  )
}
// setup raycaster
function raycastUpdate(rollOverRef, planeRef, raycaster, mouse, camera, mt) {
  raycaster.setFromCamera(mouse, camera)
  if (mt && mt.current.length > 0) {
    const intersects = raycaster.intersectObjects(mt.current)
    if (intersects.length > 0) {
      let intersect = intersects[0]
      let point = intersect.point
      rollOverRef.current.position.copy(point).add(intersect.face.normal)
      rollOverRef.current.position
        .divideScalar(50)
        .floor()
        .multiplyScalar(50)
        .addScalar(25)
      // 工程地段基准高度 -825. 在此之上的检测将物体放在上表面
      // 低于这个高度则可以嵌入.
      if (rollOverRef.current.position.y >= -825) {
        rollOverRef.current.position.add(new Vector3(0, 50, 0))
      }
    }
  } else {
    // 当地面显示的时候, 地下部分不做检测.
    const intersects = raycaster.intersectObjects([planeRef.current])
    if (intersects.length > 0) {
      let intersect = intersects[0]
      let point = intersect.point
      rollOverRef.current.position.copy(point).add(intersect.face.normal)
      rollOverRef.current.position
        .divideScalar(50)
        .floor()
        .multiplyScalar(50)
        .addScalar(25)
      //对于地上部分, 需要放在地面上表面
      if (rollOverRef.current.position.y < 0) {
        rollOverRef.current.position.add(new Vector3(0, 50, 0))
      }
    }
  }
}

function playerSetup(camera) {
  camera.position.set(0, player.height, -5)
  camera.lookAt(new Vector3(0, player.height, 0))
  camera.updateProjectionMatrix()
}
function playerMove(camera, keyboard) {
  if (keyboard.current[87]) {
    // W key
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed
    camera.updateProjectionMatrix()
  }
  if (keyboard.current[83]) {
    // S key
    camera.position.x += Math.sin(camera.rotation.y) * player.speed
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed
    camera.updateProjectionMatrix()
  }
  if (keyboard.current[65]) {
    // A key
    // Redirect motion by 90 degrees
    camera.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * player.speed
    camera.position.z +=
      -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed
    camera.updateProjectionMatrix()
  }
  if (keyboard.current[68]) {
    // D key
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed
    camera.position.z +=
      -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed
    camera.updateProjectionMatrix()
  }
}
