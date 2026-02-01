/**
 * Grid Component
 * 
 * A responsive grid layout component with configurable columns.
 * Automatically adjusts for mobile, tablet, and desktop screens.
 * 
 * @example
 * <Grid cols={3} gap={6}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 * 
 * <Grid cols={{ sm: 1, md: 2, lg: 4 }} gap={4}>
 *   Responsive grid with different columns per breakpoint
 * </Grid>
 */

const Grid = ({
  children,
  cols = 1,
  gap = 4,
  className = '',
  ...props
}) => {
  // Handle responsive columns (object) or single value
  const getGridCols = () => {
    if (typeof cols === 'object') {
      // Responsive columns
      const classes = []
      if (cols.sm) classes.push(`grid-cols-${cols.sm}`)
      if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
      if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
      if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)
      return classes.length > 0 ? classes.join(' ') : 'grid-cols-1'
    }
    // Single column value
    return `grid-cols-${cols}`
  }

  const gapStyles = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  }

  const combinedStyles = `
    grid
    ${getGridCols()}
    ${gapStyles[gap] || `gap-${gap}`}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={combinedStyles} {...props}>
      {children}
    </div>
  )
}

export default Grid
