import React, { useId, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  className?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, type = 'text', className = '', error, ...props },
  ref
) {
  const labelId = useId()

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={labelId} className="inline-block mb-1 pl-1 font-bold text-left">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        id={labelId}
        className={`border p-2 rounded w-full ${className} ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
})

export default Input
