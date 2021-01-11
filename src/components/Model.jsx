import React, { useRef } from 'react'
import { useFBX } from '@react-three/drei'
import { DoubleSide, MathUtils } from 'three'
import { getFileExt, useMods } from '../Helper'
export default ({ path, mt, ctrl, position }) => {
  let mod = useFBX(path)
  mod.name = getFileExt(path)
  mod.traverse((m) => {
    if (m.type === 'Mesh') {
      m.castShadow = true
      m.receiveShadow = true
      if (['DJ1.FBX', 'DJ2.FBX', 'DJ3.FBX', 'DJ6.FBX'].includes(mod.name)) {
        mt.current.push(m)
      }
      if (m.material.length) {
        m.material.forEach((mat) => {
          mat.side = DoubleSide
          if (mat.map) mat.map.anisotropy = 8
        })
      }
    }
  })
  return ctrl ? (
    <InteractMod mod={mod} ctrl={ctrl} position={position || [0, 0, 0]} />
  ) : (
    <primitive object={mod} position={position || [0, 0, 0]} />
  )
}

export const DynamicModel = ({ pathList, mt, ctrl, position }) => {
  const { modList } = useMods({ pathList })
  if (modList.current.length) {
    return modList.current.map((mod) => {
      mod.traverse((m) => {
        if (m.type === 'Mesh') {
          m.castShadow = true
          m.receiveShadow = true
          if (m.material.length) {
            m.material.forEach((mat) => {
              mat.side = DoubleSide
              if (mat.map) mat.map.anisotropy = 8
            })
          }
        }
      })
      return ctrl ? (
        <InteractMod
          mod={mod}
          ctrl={ctrl}
          position={position || [0, 0, 0]}
          key={MathUtils.generateUUID()}
        />
      ) : (
        <primitive
          object={mod}
          position={position || [0, 0, 0]}
          key={mod.uuid}
        />
      )
    })
  }
  return null
}
function InteractMod({ mod, ctrl, position }) {
  const modGroup = useRef()
  return (
    <group
      ref={modGroup}
      position={position}
      key={MathUtils.generateUUID()}
      onClick={() => {
        if (ctrl && ctrl.current) {
          ctrl.current.detach()
          ctrl.current.attach(modGroup.current)
        }
      }}>
      {mod.children.map((m) => (
        <primitive object={m} attachArray="children" key={m.uuid} />
      ))}
    </group>
  )
}
