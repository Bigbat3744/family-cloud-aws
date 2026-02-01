/**
 * Card Component
 * 
 * A flexible card component for displaying content in a contained format.
 * Supports different variants and hover effects.
 * 
 * @example
 * <Card>
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content goes here</Card.Body>
 *   <Card.Footer>Footer content</Card.Footer>
 * </Card>
 * 
 * <Card variant="outlined" hover>
 *   <Card.Body>Hoverable card</Card.Body>
 * </Card>
 */

const Card = ({
  children,
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  onClick,
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-white border border-gray-200',
    outlined: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-md',
    flat: 'bg-gray-50 border border-gray-100',
  }

  // Padding styles
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const baseStyles = 'rounded-xl transition-all duration-200'
  const hoverStyles = hover ? 'hover:shadow-lg hover:border-blue-300 cursor-pointer' : ''
  const clickableStyles = onClick ? 'cursor-pointer' : ''

  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${paddingStyles[padding]}
    ${hoverStyles}
    ${clickableStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div
      className={combinedStyles}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

// Card Sub-components
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
)

const CardBody = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
)

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
)

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
)

// Attach sub-components to Card
Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter
Card.Title = CardTitle
Card.Description = CardDescription

export default Card
