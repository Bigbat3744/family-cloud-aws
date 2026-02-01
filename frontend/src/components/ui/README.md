# Family Cloud UI Design System

A comprehensive, reusable UI component library built with React and Tailwind CSS. Inspired by modern design systems from Vercel, Linear, Notion, and Stripe.

## Installation

All components are located in `src/components/ui/`. Import them directly:

```jsx
import { Button, Card, Input, Modal } from '@/components/ui'
```

Or import individually:

```jsx
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
```

## Components

### Button

A versatile button component with multiple variants and sizes.

**Variants:** `primary`, `secondary`, `ghost`, `danger`, `success`  
**Sizes:** `xs`, `sm`, `md`, `lg`, `xl`

```jsx
import { Button } from '@/components/ui'

<Button variant="primary" size="md">Click me</Button>
<Button variant="secondary" size="sm" disabled>Disabled</Button>
<Button variant="ghost" size="lg" loading>Loading...</Button>
<Button fullWidth>Full Width Button</Button>
```

### Card

A flexible card component for displaying content.

**Variants:** `default`, `outlined`, `elevated`, `flat`  
**Padding:** `none`, `sm`, `md`, `lg`

```jsx
import { Card } from '@/components/ui'

<Card variant="elevated" hover>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description text</Card.Description>
  </Card.Header>
  <Card.Body>
    Main content goes here
  </Card.Body>
  <Card.Footer>
    Footer content
  </Card.Footer>
</Card>
```

### Input

A styled input component with label, error states, and helper text.

**Sizes:** `sm`, `md`, `lg`

```jsx
import { Input } from '@/components/ui'

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

<Input
  label="Password"
  type="password"
  error="Password is required"
  helperText="Must be at least 8 characters"
/>
```

### Modal

A modal/dialog component with backdrop and animations.

**Sizes:** `sm`, `md`, `lg`, `xl`, `full`

```jsx
import { Modal, Button } from '@/components/ui'

const [isOpen, setIsOpen] = useState(false)

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
  <Modal.Header>Modal Title</Modal.Header>
  <Modal.Body>
    Modal content goes here
  </Modal.Body>
  <Modal.Footer>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleSubmit}>Submit</Button>
  </Modal.Footer>
</Modal>
```

### Container

A responsive container component for consistent page layouts.

**Sizes:** `sm`, `default`, `lg`, `full`  
**Padding:** `none`, `sm`, `md`, `lg`, `xl`

```jsx
import { Container } from '@/components/ui'

<Container size="default" padding="md">
  <h1>Page Title</h1>
  <p>Content goes here</p>
</Container>
```

### Section

A semantic section component with consistent spacing.

**Padding:** `none`, `sm`, `md`, `lg`, `xl`, `2xl`  
**Background:** `white`, `gray`, `primary`, `dark`

```jsx
import { Section } from '@/components/ui'

<Section padding="xl" background="gray">
  <h2>Section Title</h2>
  <p>Section content</p>
</Section>
```

### Grid

A responsive grid layout component.

```jsx
import { Grid } from '@/components/ui'

<Grid cols={3} gap={6}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

<Grid cols={{ sm: 1, md: 2, lg: 4 }} gap={4}>
  Responsive grid
</Grid>
```

### Typography

Pre-styled typography components.

```jsx
import { Heading, Text, Label } from '@/components/ui'

<Heading level={1}>Main Title</Heading>
<Text size="lg" color="gray">Description text</Text>
<Label required>Form Label</Label>
```

## Theme

The design system uses a centralized theme file (`src/theme.js`) that defines:

- **Colors:** Primary, gray, success, error, warning scales
- **Typography:** Font families, sizes, weights
- **Spacing:** Consistent spacing scale (4px grid)
- **Shadows:** Elevation system
- **Border Radius:** Consistent rounded corners
- **Transitions:** Animation durations

## Design Principles

1. **Consistency:** All components follow the same design language
2. **Accessibility:** WCAG compliant with proper ARIA attributes
3. **Responsive:** Mobile-first approach with breakpoints
4. **Performance:** Lightweight and optimized
5. **Flexibility:** Highly customizable through props

## Usage Examples

### Complete Form Example

```jsx
import { Card, Input, Button } from '@/components/ui'

<Card>
  <Card.Header>
    <Card.Title>Sign In</Card.Title>
  </Card.Header>
  <Card.Body>
    <Input
      label="Email"
      type="email"
      placeholder="you@example.com"
      required
    />
    <Input
      label="Password"
      type="password"
      required
    />
  </Card.Body>
  <Card.Footer>
    <Button variant="primary" fullWidth>Sign In</Button>
  </Card.Footer>
</Card>
```

### Layout Example

```jsx
import { Container, Section, Grid, Card } from '@/components/ui'

<Container>
  <Section padding="xl">
    <Heading level={1}>Dashboard</Heading>
    <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap={6}>
      <Card hover>Card 1</Card>
      <Card hover>Card 2</Card>
      <Card hover>Card 3</Card>
    </Grid>
  </Section>
</Container>
```

## Customization

All components accept a `className` prop for additional styling:

```jsx
<Button className="custom-class">Button</Button>
<Card className="my-custom-card">Content</Card>
```

## Accessibility

- All interactive elements are keyboard accessible
- Proper ARIA labels and roles
- Focus states for keyboard navigation
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

When adding new components:

1. Follow the existing component structure
2. Include JSDoc comments
3. Add TypeScript types if applicable
4. Ensure accessibility compliance
5. Add examples to this README
