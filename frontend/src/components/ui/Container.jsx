/**
 * Container Component
 * 
 * A responsive container component that centers content and applies max-width.
 * Useful for consistent page layouts.
 * 
 * @example
 * <Container>
 *   <h1>Page Title</h1>
 *   <p>Content goes here</p>
 * </Container>
 * 
 * <Container size="lg" padding="xl">
 *   Wide container with extra padding
 * </Container>
 */

const Container = ({
  children,
  size = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  // Size styles (max-width)
  const sizeStyles = {
    sm: 'max-w-3xl',
    default: 'max-w-7xl',
    lg: 'max-w-screen-2xl',
    full: 'max-w-full',
  }

  // Padding styles
  const paddingStyles = {
    none: '',
    sm: 'px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
    xl: 'px-8 sm:px-12 lg:px-16',
  }

  const combinedStyles = `
    mx-auto
    ${sizeStyles[size]}
    ${paddingStyles[padding]}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={combinedStyles} {...props}>
      {children}
    </div>
  )
}

export default Container
