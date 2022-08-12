import React from 'react'
import { Card } from '@banco/components'
import Chart from 'react-apexcharts'
import { barChartData, barChartOptions } from '@banco/variables/charts'

export const BarChart = (props) => {
  return (
    <Card
      py="1rem"
      height={{ sm: '200px' }}
      width="100%"
      bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
      position="relative"
    >
      <Chart
        options={barChartOptions}
        series={barChartData}
        type="bar"
        width="100%"
        height="100%"
      />
    </Card>
  )
}

export default BarChart
