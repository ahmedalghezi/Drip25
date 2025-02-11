import React from 'react'
import PropTypes from 'prop-types'
import { Path } from 'react-native-svg'

import { Colors } from '../../styles'

import {
  CHART_COLUMN_WIDTH,
  CHART_COLUMN_MIDDLE,
  CHART_DOT_RADIUS,
  CHART_STROKE_WIDTH,
} from '../../config'

const DotAndLine = ({
                      exclude,
                      leftTemperatureExclude,
                      leftY,
                      rightTemperatureExclude,
                      rightY,
                      y,
                    }) => {
  let excludeLeftLine = false
  let excludeRightLine = false
  let lineLeft = null
  let lineRight = null

  // Build left line if leftY is provided
  if (typeof leftY === 'number') {
    const middleY = (leftY - y) / 2 + y
    excludeLeftLine = leftTemperatureExclude || exclude
    // Build path string: move to (CHART_COLUMN_MIDDLE, y) then line to (0, middleY)
    lineLeft = `M ${CHART_COLUMN_MIDDLE},${y} L 0,${middleY}`
  }

  // Build right line if rightY is provided
  if (typeof rightY === 'number') {
    const middleY = (y - rightY) / 2 + rightY
    excludeRightLine = rightTemperatureExclude || exclude
    // Build path string: move to (CHART_COLUMN_MIDDLE, y) then line to (CHART_COLUMN_WIDTH, middleY)
    lineRight = `M ${CHART_COLUMN_MIDDLE},${y} L ${CHART_COLUMN_WIDTH},${middleY}`
  }

  // Build the dot as a circle using two arcs.
  // In SVG, a common pattern for a circle is to draw two arcs that form a closed shape.
  const cx = CHART_COLUMN_MIDDLE
  const cy = y
  const r = CHART_DOT_RADIUS
  const dotPath =
      `M ${cx},${cy - r} ` +
      `A ${r},${r} 0 1,0 ${cx},${cy + r} ` +
      `A ${r},${r} 0 1,0 ${cx},${cy - r} Z`

  // Set colors based on exclusion flags
  const dotColor = exclude ? Colors.turquoise : Colors.turquoiseDark
  const lineColorLeft = excludeLeftLine ? Colors.turquoise : Colors.turquoiseDark
  const lineColorRight = excludeRightLine ? Colors.turquoise : Colors.turquoiseDark

  return (
      <>
        {lineLeft && (
            <Path
                d={lineLeft}
                stroke={lineColorLeft}
                strokeWidth={CHART_STROKE_WIDTH}
            />
        )}
        {lineRight && (
            <Path
                d={lineRight}
                stroke={lineColorRight}
                strokeWidth={CHART_STROKE_WIDTH}
            />
        )}
        <Path
            d={dotPath}
            stroke={dotColor}
            strokeWidth={CHART_STROKE_WIDTH}
            fill="white"
        />
      </>
  )
}

DotAndLine.propTypes = {
  exclude: PropTypes.bool,
  leftY: PropTypes.number,
  leftTemperatureExclude: PropTypes.bool,
  rightY: PropTypes.number,
  rightTemperatureExclude: PropTypes.bool,
  y: PropTypes.number.isRequired,
}

export default DotAndLine
