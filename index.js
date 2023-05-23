const chartC = d3.select("div#viz")
const step = d3.selectAll("#scrolly .step")

const myChart = echarts.init(chartC.node(), null, {
  renderer: 'svg'
})

const opts = {
  notMerge: true,
}

const getOption = {}

const fig = {}

d3.csv('d_regions.csv')
  .then(parse)
  .then(plot)

////////////////////////
/////// SCROLLER ///////
////////////////////////

const scroller = scrollama()

function handleResize() {
  step.style("height", `${Math.floor(window.innerHeight * 0.75)}px`)

  fig.height = window.innerHeight * .75

  chartC
    .style("height", fig.height + "px")
    .style("top", (window.innerHeight - fig.height) / 2 + "px")

  scroller.resize()
  myChart.resize({
    height: fig.height
  })

  fig.height = fig.height
  fig.width = +chartC.style('width').replace('px', '')
}

function handleStepEnter(response) {
  getOption[`step${response.element.dataset.step}`]()

}

function initScroller() {
    handleResize()

    scroller.setup({
      step: "#scrolly article .step",
      offset: 0.4,
      debug: false
    }).onStepEnter(handleStepEnter)
}


////////////////////////
/////// PLOTTING ///////
////////////////////////


function plot(df) {
  initScroller()

  const c = {}
  c.mod = '#A2EF5F'
  c.sev = '#240257'
  c.sig = '#1705F0'
  c.gray = '#BABABA'
  c.lightgray = '#E7E7E7'
  c.darkgray = '#828282'
  c.black = '#171F09'
  c.white = '#FFFFFF'

  const symbols = {
    user: "path://M16 15C13.8 15 12 14.3 10.6 12.9C9.2 11.5 8.5 9.7 8.5 7.5C8.5 5.3 9.2 3.5 10.6 2.1C12 0.7 13.8 0 16 0C18.2 0 20 0.7 21.4 2.1C22.8 3.5 23.5 5.3 23.5 7.5C23.5 9.7 22.8 11.5 21.4 12.9C20 14.3 18.2 15 16 15ZM0 31.05V26.35C0 25.0833 0.316667 24 0.95 23.1C1.58333 22.2 2.4 21.5167 3.4 21.05C5.63333 20.05 7.775 19.3 9.825 18.8C11.875 18.3 13.9333 18.05 16 18.05C18.0667 18.05 20.1167 18.3083 22.15 18.825C24.1833 19.3417 26.3167 20.0833 28.55 21.05C29.5833 21.5167 30.4167 22.2 31.05 23.1C31.6833 24 32 25.0833 32 26.35V31.05H0Z"
  }

  const textStyle = {
    fontFamily: 'Roboto, "sans-serif"',
    fontWeight: 400,
    fontSize: 14,
    color: c.black,
    letterSpacing: '.1rem',
  }

  const grid = { left: 210 }

  const xAxis = {
    position: 'top',
    axisLabel: {
      width: 340,
      show: true,
      formatter: d3.format('.0%'),
      color: c.black
    },
    splitLine: {
      lineStyle: { color: c.lightgray }
    }
  }

  const yAxis = {
    nameGap: 40,
    nameTextStyle: { align: 'left', fontWeight: 400 },
    axisLine: { show: false, },
    axisTick: { show: false, }
  }

  getOption.step1 = function() {
    const emphasize = ['Europe', 'Americas', 'Africa'].map(d => d.toUpperCase())

    const source = df
      .filter(d => d.level === 1 && d.region !== 'World')
      .sort((a, b) => a.pct_ms - b.pct_ms)

    const option = {
      dataset: {
        source,
        dimensions: Object.keys(source[0])
      },
      textStyle,
      grid,
      xAxis,
      yAxis: {
        ...yAxis,
        type: 'category',
        axisLabel: {
          fontSize: 14,
          color: d => emphasize.includes(d.toUpperCase()) ? c.black : c.darkgray
        }
      },
      series: [
        {
          name: 'main',
          type: 'bar',
          encode: { x: 'pct_ms', y: 'region' },
          emphasis: { disabled: true },
          label: {
            show: true,
            position: 'right',
            color: c.black,
            fontSize: 14,
            formatter: d => d3.format('.1%')(d.value.pct_ms),
          },
          itemStyle: {
            color: d => emphasize.includes(d.value.region.toUpperCase()) ? c.black : c.gray
          },
        }
      ]
    };

    myChart.setOption(option, opts)
  }



  getOption.step2 = function() {
    const emphasize = ['Americas', 'Africa'].map(d => d.toUpperCase())

    const source = df
      .filter(d => d.level === 1 && d.region !== 'World')
      .sort((a, b) => a.pct_s - b.pct_s)

    const option = {
      dataset: {
        source,
        dimensions: Object.keys(source[0])
      },
      textStyle,
      grid,
      xAxis,
      yAxis: {
        ...yAxis,
        type: 'category',
        axisLabel: {
          fontSize: 14,
          color: d => emphasize.includes(d.toUpperCase()) ? c.black : c.darkgray
        }
      },
      series: [
        {
          name: 'main',
          type: 'bar',
          encode: { x: 'pct_ms', y: 'region' },
          emphasis: { disabled: true },
          label: {
            show: true,
            position: 'right',
            color: c.darkgray,
            fontSize: 14,
            formatter: d => d3.format('.1%')(d.value.pct_ms),
          },
          itemStyle: {
            color: c.lightgray,
            opacity: .9
          },
          barGap: '-100%',
        },
        {
          name: 'sec',
          type: 'bar',
          encode: { x: 'pct_s', y: 'region' },
          emphasis: { disabled: true },
          label: {
            show: true,
            position: 'right',
            color: c.black,
            fontSize: 14,
            formatter: d => d3.format('.1%')(d.value.pct_s),
          },
          itemStyle: {
            color: c.sev,
          },
        },
        
      ],
    };
    
    myChart.setOption(option, opts)
  }



  getOption.step3 = function() {
    const causes = ['Schizophrenia', 'African trypanosomiasis', 'Low back pain']

    const source = []
    df.filter(d => d.level === 3 && d.region === 'World' && causes.includes(d.cause))
      .sort((a, b) => causes.indexOf(a.cause) - causes.indexOf(b.cause))
      .forEach(d => {
        source.push({ cause: d.cause, name: 'Moderate', value: 1-d.prop_s})
        source.push({ cause: d.cause, name: 'Severe', value: d.prop_s})
      })

    const option = {
      textStyle,
      series: causes.map((cause, i) => ({
        name: cause,
        type: 'pie',
        radius: [50, 70],
        center: [`${25*(i+1)}%`, '50%'],
        emphasis: { disabled: true },
        data: source.filter(d => d.cause === cause).map(d => ({
          ...d,
          label: {
            show: d.value
          }
        })),
        itemStyle: {
          color: d => d.data.name === 'Moderate' ? c.mod : c.sev
        }
      }))
    };
    
    myChart.setOption(option, opts)
  }



  getOption.step4 = function() {

    const option = {
      textStyle,
      xAxis: {
        max: 30,
        splitLine: { show: false },
        offset: 10,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          margin: 10
        }
      },
      yAxis: {
        data: ['Moderate', 'Severe'],
        inverse: true,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          margin: 10,
          color: '#999',
          fontSize: 16
        }
      },
      series: [
        {
          name: 'test',
          type: 'pictorialBar',
          symbol: symbols.user,
          symbolRepeat: 'fixed',
          symbolMargin: '5%',
          symbolSize: 10,
          // symbolBoundingData: 30,
          data: [25, 3],
        }
      ]
    };
    
    myChart.setOption(option, opts)
  }
}

function parse(data) {
  return data.map(d => ({
    region: d.location_name,
    level: +d.level,
    group: d.cause_group,
    cause: d.cause_name,
    pct_ms: +d.pct_ms,
    pct_m: +d.pct_m,
    pct_s: +d.pct_s,
    prop_s: +d.prop_s,
  }))
}
