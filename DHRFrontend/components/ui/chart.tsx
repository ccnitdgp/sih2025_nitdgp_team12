'use client'

import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import { cn } from '@/lib/utils'

// Themes
const THEMES = { light: '', dark: '.dark' } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = { config: ChartConfig }

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const ctx = React.useContext(ChartContext)
  if (!ctx) throw new Error('useChart must be used within a <ChartContainer />')
  return ctx
}

// --------------------- CONTAINER ---------------------

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children']
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground flex aspect-video justify-center text-xs",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />

        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

// --------------------- STYLE INJECTOR ---------------------

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorCfg = Object.entries(config).filter(
    ([, v]) => v.color || v.theme,
  )
  if (!colorCfg.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, selector]) => {
            return `
${selector} [data-chart=${id}] {
${colorCfg
  .map(([key, cfg]) => {
    const color = cfg.theme?.[theme as keyof typeof cfg.theme] || cfg.color
    return color ? `  --color-${key}: ${color};` : ''
  })
  .join('\n')}
}
`
          })
          .join('\n'),
      }}
    />
  )
}

// --------------------- TOOLTIP ---------------------

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: {
  active?: boolean
  payload?: any[]
  label?: any
  className?: string
  indicator?: 'line' | 'dot' | 'dashed'
  hideLabel?: boolean
  hideIndicator?: boolean
  labelFormatter?: any
  labelClassName?: string
  formatter?: any
  color?: string
  nameKey?: string
  labelKey?: string
}) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null

    const item = payload[0]
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`
    const cfg = getPayloadConfig(config, item, key)

    const value =
      !labelKey && typeof label === 'string'
        ? config[label]?.label || label
        : cfg?.label

    if (labelFormatter)
      return (
        <div className={cn('font-medium', labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      )

    return value ? (
      <div className={cn('font-medium', labelClassName)}>{value}</div>
    ) : null
  }, [payload, hideLabel, label, labelFormatter, config, labelKey, labelClassName])

  if (!active || !payload?.length) return null

  const nested = payload.length === 1 && indicator !== 'dot'

  return (
    <div
      className={cn(
        'border-border/50 bg-background min-w-[8rem] rounded-lg border px-2.5 py-1.5 text-xs shadow-xl grid gap-1.5',
        className,
      )}
    >
      {!nested && tooltipLabel}

      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || 'value'}`
          const cfg = getPayloadConfig(config, item, key)
          const indicatorColor = color || item.payload?.fill || item.color

          return (
            <div
              key={index}
              className="flex w-full flex-wrap items-center gap-2"
            >
              {!hideIndicator && (
                <span
                  className={cn(
                    'inline-block rounded-[2px]',
                    indicator === 'dot' && 'h-2.5 w-2.5',
                    indicator === 'line' && 'h-2.5 w-1',
                    indicator === 'dashed' &&
                      'w-0 h-2 border-[1.5px] border-dashed',
                  )}
                  style={{
                    backgroundColor: indicator === 'dot' ? indicatorColor : undefined,
                    borderColor: indicatorColor,
                  }}
                />
              )}

              <div className="flex flex-1 justify-between">
                <span className="text-muted-foreground">
                  {cfg?.label || item.name}
                </span>

                {item.value != null && (
                  <span className="font-mono font-medium tabular-nums">
                    {item.value.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --------------------- LEGEND ---------------------

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload = [],
  verticalAlign = 'bottom',
  nameKey,
}: {
  className?: string
  hideIcon?: boolean
  payload?: any[]
  verticalAlign?: 'top' | 'bottom' | 'middle'
  nameKey?: string
}) {
  const { config } = useChart()

  if (!payload.length) return null

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className,
      )}
    >
      {payload.map((item: any, index: number) => {
        const key = `${nameKey || item.dataKey || 'value'}`
        const cfg = getPayloadConfig(config, item, key)

        return (
          <div key={index} className="flex items-center gap-1.5">
            {!hideIcon ? (
              cfg?.icon ? (
                <cfg.icon />
              ) : (
                <div
                  className="h-2 w-2 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
              )
            ) : null}

            {cfg?.label}
          </div>
        )
      })}
    </div>
  )
}

// --------------------- HELPER ---------------------

function getPayloadConfig(config: ChartConfig, payload: any, key: string) {
  if (!payload) return undefined

  const data = payload.payload ?? {}

  if (typeof payload[key] === 'string') return config[payload[key]]
  if (typeof data[key] === 'string') return config[data[key]]

  return config[key]
}

// --------------------- EXPORTS ---------------------

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
