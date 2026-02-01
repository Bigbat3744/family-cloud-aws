/**
 * UI Components Examples
 * 
 * This file demonstrates how to use all UI components.
 * Use this as a reference when building new features.
 */

import { useState } from 'react'
import {
  Button,
  Card,
  Input,
  Modal,
  Container,
  Section,
  Grid,
  Heading,
  Text,
  Label,
} from './index'

const UIExamples = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  return (
    <Container>
      <Section padding="xl">
        <Heading level={1} className="mb-8">UI Components Showcase</Heading>

        {/* Buttons Section */}
        <Section padding="lg" background="gray" className="mb-8 rounded-xl">
          <Heading level={2} className="mb-6">Buttons</Heading>
          <Grid cols={{ sm: 1, md: 2, lg: 4 }} gap={4}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" fullWidth>Full Width</Button>
          </Grid>
        </Section>

        {/* Cards Section */}
        <Section padding="lg" background="gray" className="mb-8 rounded-xl">
          <Heading level={2} className="mb-6">Cards</Heading>
          <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap={6}>
            <Card variant="default">
              <Card.Header>
                <Card.Title>Default Card</Card.Title>
                <Card.Description>This is a default card variant</Card.Description>
              </Card.Header>
              <Card.Body>
                <Text>Card content goes here</Text>
              </Card.Body>
            </Card>

            <Card variant="elevated" hover>
              <Card.Header>
                <Card.Title>Elevated Card</Card.Title>
                <Card.Description>Hover over this card</Card.Description>
              </Card.Header>
              <Card.Body>
                <Text>This card has elevation and hover effects</Text>
              </Card.Body>
            </Card>

            <Card variant="outlined">
              <Card.Header>
                <Card.Title>Outlined Card</Card.Title>
              </Card.Header>
              <Card.Body>
                <Text>This card has a stronger border</Text>
              </Card.Body>
              <Card.Footer>
                <Button variant="ghost" size="sm">Action</Button>
              </Card.Footer>
            </Card>
          </Grid>
        </Section>

        {/* Inputs Section */}
        <Section padding="lg" background="gray" className="mb-8 rounded-xl">
          <Heading level={2} className="mb-6">Inputs</Heading>
          <Grid cols={{ sm: 1, md: 2 }} gap={6}>
            <Card>
              <Card.Body>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  helperText="Must be at least 8 characters"
                  required
                />
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Input
                  label="With Error"
                  type="text"
                  error="This field is required"
                  value=""
                />
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Input
                  label="Disabled Input"
                  type="text"
                  value="Cannot edit this"
                  disabled
                />
              </Card.Body>
            </Card>
          </Grid>
        </Section>

        {/* Typography Section */}
        <Section padding="lg" background="gray" className="mb-8 rounded-xl">
          <Heading level={2} className="mb-6">Typography</Heading>
          <Card>
            <Card.Body>
              <Heading level={1} className="mb-4">Heading Level 1</Heading>
              <Heading level={2} className="mb-4">Heading Level 2</Heading>
              <Heading level={3} className="mb-4">Heading Level 3</Heading>
              <Text size="xl" className="mb-2">Extra Large Text</Text>
              <Text size="lg" className="mb-2">Large Text</Text>
              <Text size="base" className="mb-2">Base Text</Text>
              <Text size="sm" className="mb-2">Small Text</Text>
              <Text size="xs">Extra Small Text</Text>
              <div className="mt-4 space-y-2">
                <Text color="primary">Primary Color Text</Text>
                <Text color="error">Error Color Text</Text>
                <Text color="success">Success Color Text</Text>
                <Text weight="bold">Bold Text</Text>
                <Text weight="semibold">Semibold Text</Text>
              </div>
            </Card.Body>
          </Card>
        </Section>

        {/* Modal Example */}
        <Section padding="lg" background="gray" className="mb-8 rounded-xl">
          <Heading level={2} className="mb-6">Modal</Heading>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Open Modal
          </Button>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
            <Modal.Header>
              <Heading level={2}>Example Modal</Heading>
            </Modal.Header>
            <Modal.Body>
              <Text>This is an example modal dialog. You can put any content here.</Text>
              <div className="mt-4">
                <Input
                  label="Modal Input"
                  placeholder="Type something..."
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </Section>

        {/* Complete Form Example */}
        <Section padding="lg" background="gray" className="mb-8 rounded-xl">
          <Heading level={2} className="mb-6">Complete Form Example</Heading>
          <Card variant="elevated" className="max-w-2xl mx-auto">
            <Card.Header>
              <Card.Title>Sign Up</Card.Title>
              <Card.Description>Create your Family Cloud account</Card.Description>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  helperText="Must be at least 8 characters"
                  required
                />
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="flex gap-3 w-full">
                <Button variant="ghost" fullWidth>
                  Cancel
                </Button>
                <Button variant="primary" fullWidth>
                  Sign Up
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Section>
      </Section>
    </Container>
  )
}

export default UIExamples
