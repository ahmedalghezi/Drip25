import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'

// Import react-native-svg components
import Svg, { Path as SvgPath } from 'react-native-svg'

import ChartLine from './chart-line'
import DotAndLine from './dot-and-line'

import { CHART_COLUMN_WIDTH, CHART_STROKE_WIDTH } from '../../config'

const TemperatureColumn = ({
                             horizontalLinePosition,
                             isVerticalLine,
                             data,
                             columnHeight,
                           }) => {
  const x = CHART_STROKE_WIDTH / 2

  return (
      <Svg
          width={CHART_COLUMN_WIDTH}
          height={columnHeight}
          style={styles.container}
      >
        {/* Draw the main vertical line */}
          <ChartLine
              path={`M0,0 L0,${columnHeight}`}
          />


          {/* Draw the horizontal line if provided */}
        {typeof horizontalLinePosition === 'number' && (
            <ChartLine
                path={`M0,${horizontalLinePosition} L${CHART_COLUMN_WIDTH},${horizontalLinePosition}`}
                isNfpLine={true}
                key="horizontal-line"
            />

        )}

        {/* Draw the vertical line if needed */}
        {isVerticalLine && (
            <ChartLine
                path={`M${x},${x} L${x},${columnHeight}`}
                isNfpLine={true}
                key="vertical-line"
            />

        )}

        {/* Render the DotAndLine component if data is provided */}
        {data && typeof data.y !== 'undefined' && (
            <DotAndLine
                y={data.y}
                exclude={data.temperatureExclude}
                rightY={data.rightY}
                rightTemperatureExclude={data.rightTemperatureExclude}
                leftY={data.leftY}
                leftTemperatureExclude={data.leftTemperatureExclude}
                key="dot-and-line"
            />
        )}
      </Svg>
  )
}

TemperatureColumn.propTypes = {
  horizontalLinePosition: PropTypes.number,
  isVerticalLine: PropTypes.bool,
  data: PropTypes.object,
  columnHeight: PropTypes.number,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
})

export default TemperatureColumn
