import React, { useState } from 'react'
import { Button, Card, Tabs } from 'antd'
import { CircleCloseCircleFilled } from '@ant-design/icons'
import '../hud.css'
import {
  basicMenu,
  vehicleMenu,
  buildingMenu,
  plantMenu,
  bridgeMenu,
  Menus
} from '../Config'
const basicStyle = {
  width: '50vh',
  position: 'absolute',
  top: '5vh',
  left: '0.5vw',
  zIndex: 22222222
}
export default () => {
  const [link, linkTo] = useState(null)
  return (
    <>
      <div className="top-hud">
        {Menus.map((menu) => (
          <Button key={menu.key}>{menu.name}</Button>
        ))}
      </div>
      <Route link={link} />
    </>
  )
}
function Route({ link }) {
  if (link === 'GEO_INFO') {
  } else if (link === 'FIND_FLAG') {
  } else if (link === 'MOD_LIB') {
    return (
      <Card size="small" title="模型库" style={basicStyle}>
        <X />
        <Tabs tabPosition="left">
          <Tabs.TabPane tab="基础类" key="1">
            <CardGrid dataSource={basicMenu} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="交通工具" key="2">
            <CardGrid dataSource={vehicleMenu} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="植物" key="3">
            <CardGrid dataSource={plantMenu} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="建筑" key="4">
            <CardGrid dataSource={buildingMenu} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="桥" key="5">
            <CardGrid dataSource={bridgeMenu} />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    )
  }
  return null
}

function X({ style, linkTo }) {
  const closeButtonStyle = {
    border: 'none',
    position: 'absolute',
    top: '4px',
    right: '2px',
    zIndex: 22222223
  }
  return (
    <Button
      ghost
      icon={<CircleCloseCircleFilled style={{ fontSize: '25px' }} />}
      style={{ ...closeButtonStyle, ...style }}
    />
  )
}
