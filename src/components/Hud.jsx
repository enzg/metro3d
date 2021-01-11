import React from 'react'
import { Button } from 'antd'
import '../hud.css'
import { Menus } from '../Config'
export default () => {
  return (
    <>
      <div className="top-hud">
        {Menus.map((menu) => (
          <Button key={menu.key}>{menu.name}</Button>
        ))}
      </div>
    </>
  )
}
