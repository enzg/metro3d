import { Html, softShadows } from '@react-three/drei'
import React, { Suspense, useRef, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import Cam from './components/Cam'
import Env from './components/Env'
import Ground from './components/Ground'
import Config from './Config'
import { MathUtils } from 'three'
import Mod from './components/Model'
softShadows()
export default () => {
  const renderTree = useRef([])
  const modelTree = useRef([])
  const [flagMode] = useState(false)
  return (
    <Canvas {...Config}>
      <Suspense fallback={<Loader />}>
        <Assets
          pathArr={[
            'https://www.1024k.co/DX1.FBX',
            'https://www.1024k.co/DX2.FBX',
            'https://www.1024k.co/DM.FBX',
            'https://www.1024k.co/DJ1.FBX',
            'https://www.1024k.co/DJ2.FBX',
            'https://www.1024k.co/DJ3.FBX',
            'https://www.1024k.co/DJ6.FBX',
            'https://www.1024k.co/SKY1.FBX'
          ]}
          rt={renderTree}
          mt={modelTree}
          flagMode={flagMode}
        />
      </Suspense>
      <Ground mt={flagMode ? modelTree : null} />
      <Env />
      <Cam />
    </Canvas>
  )
}

const Assets = ({ pathArr, flagMode, rt, mt }) => {
  pathArr.forEach((path) => {
    rt.current.push(<Mod key={MathUtils.generateUUID()} path={path} mt={mt} />)
  })
  return !flagMode
    ? [rt.current[1], rt.current[2], rt.current[0], rt.current[7]]
    : [
        rt.current[3],
        rt.current[4],
        rt.current[5],
        rt.current[6],
        rt.current[7],
        rt.current[1],
        rt.current[2]
      ]
}

function Loader() {
  return (
    <Html className="loading" center>
      <div className="center-box">资源加载中...</div>
    </Html>
  )
}
