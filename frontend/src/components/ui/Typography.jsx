/**
 * Typography Components
 * 
 * Pre-styled typography components for consistent text rendering.
 * Includes Heading, Text, and Label components.
 * 
 * @example
 * <Heading level={1}>Main Title</Heading>
 * <Text size="lg" color="gray">Description text</Text>
 * <Label>Form Label</Label>
 */

// Heading Component
export const Heading = ({
  children,
  level = 1,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-bold text-gray-900'
  
  const sizeStyles = {
    1: 'text-4xl md:text-5xl',
    2: 'text-3xl md:text-4xl',
    3: 'text-2xl md:text-3xl',
    4: 'text-xl md:text-2xl',
    5: 'text-lg md:text-xl',
    6: 'text-base md:text-lg',
  }

  const Component = `h${level}`

  return (
    <Component
      className={`${baseStyles} ${sizeStyles[level]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  )
}

// Text Component
export const Text = ({
  children,
  size = 'base',
  color = 'gray',
  weight = 'normal',
  className = '',
  as: Component = 'p',
  ...props
}) => {
  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  const colorStyles = {
    gray: 'text-gray-600',
    dark: 'text-gray-900',
    light: 'text-gray-400',
    primary: 'text-blue-600',
    error: 'text-red-600',
    success: 'text-green-600',
  }

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const combinedStyles = `
    ${sizeStyles[size]}
    ${colorStyles[color]}
    ${weightStyles[weight]}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <Component className={combinedStyles} {...props}>
      {children}
    </Component>
  )
}

// Label Component
export const Label = ({
  children,
  required = false,
  className = '',
  htmlFor,
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`.trim()}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

// Export all typography components
export default {
  Heading,
  Text,
  Label,
}
