import React from 'react'

interface TypeProps {
  error: any
  errors: any
}

// Custom Sign in Error Function Component
const AuthenticationError: React.FC<TypeProps> = ({ error, errors }) => {

  const errorMessage = error && (errors[error] ?? errors.default)

  return (
    <span className="text-center text-sm text-red-600">{errorMessage}</span>
  )
}

export default AuthenticationError