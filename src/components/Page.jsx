import { Card, Image } from 'antd'
import React from 'react'
import { AppConfig } from '../Config'
import { get, post } from '../Helper'
export const CardGrid = ({ dataSource }) => {
  const cardStyle = { height: '50vh', overflowY: 'auto' }
  return (
    <Card size="small" style={cardStyle}>
      {dataSource.map((item) => {
        return (
          <Card.Grid
            key={item.name}
            style={{ width: '50%', textAlign: 'center' }}>
            <div style={{ display: 'grid', placeItems: 'center' }}>
              <Image
                preview={false}
                width={128}
                height={128}
                fallback={AppConfig.fallbackImage}
                src={`${item.icon}.png`}
                onClick={() => {
                  // setCurrentMod(`${item.icon}.FBX`)
                }}
              />
              <h5>{item.name}</h5>
            </div>
          </Card.Grid>
        )
      })}
    </Card>
  )
}
