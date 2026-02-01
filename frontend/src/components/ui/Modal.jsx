/**
 * Modal Component
 * 
 * A flexible modal/dialog component with backdrop and animations.
 * Supports different sizes and can be closed via backdrop click or close button.
 * 
 * @example
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <Modal.Header>Modal Title</Modal.Header>
 *   <Modal.Body>Modal content goes here</Modal.Body>
 *   <Modal.Footer>
 *     <Button onClick={() => setIsOpen(false)}>Close</Button>
 *   </Modal.Footer>
 * </Modal>
 */

import { useEffect } from 'react'
import Button from './Button'

const Modal = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  showCloseButton = true,
  className = '',
  ...props
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Size styles
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  }

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative bg-white rounded-xl shadow-2xl w-full
            ${sizeStyles[size]}
            transform transition-all
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        >
          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Modal Content */}
          {children}
        </div>
      </div>
    </div>
  )
}

// Modal Sub-components
const ModalHeader = ({ children, className = '', ...props }) => (
  <div className={`px-6 pt-6 pb-4 ${className}`} {...props}>
    {typeof children === 'string' ? (
      <h2 className="text-2xl font-bold text-gray-900">{children}</h2>
    ) : (
      children
    )}
  </div>
)

const ModalBody = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
)

const ModalFooter = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 bg-gray-50 rounded-b-xl flex items-center justify-end gap-3 ${className}`} {...props}>
    {children}
  </div>
)

// Attach sub-components to Modal
Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter

export default Modal
