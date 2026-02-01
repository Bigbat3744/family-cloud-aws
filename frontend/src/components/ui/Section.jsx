/**
 * Section Component
 * 
 * A semantic section component with consistent spacing and layout options.
 * Useful for page sections and content blocks.
 * 
 * @example
 * <Section>
 *   <h2>Section Title</h2>
 *   <p>Section content</p>
 * </Section>
 * 
 * <Section padding="xl" background="gray">
 *   Section with custom padding and background
 * </Section>
 */

const Section = ({
  children,
  padding = 'md',
  background = 'white',
  className = '',
  ...props
}) => {
  // Padding styles
  const paddingStyles = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
    '2xl': 'py-24',
  }

  // Background styles
  const backgroundStyles = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-blue-50',
    dark: 'bg-gray-900',
  }

  const combinedStyles = `
    ${paddingStyles[padding]}
    ${backgroundStyles[background]}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <section className={combinedStyles} {...props}>
      {children}
    </section>
  )
}

export default Section
