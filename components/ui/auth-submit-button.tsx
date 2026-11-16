import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

type AuthSubmitButtonProps = React.ComponentProps<"button"> & {
  loading?: boolean
  loadingLabel: string
}

export function AuthSubmitButton({
  loading = false,
  loadingLabel,
  children,
  className,
  disabled,
  ...props
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={cn("btn btn-accent form-submit-btn", className)}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...props}
    >
      <span className="form-submit-btn__label">
        {loading ? (
          <>
            <Loader2
              className="form-submit-btn__spinner animate-spin motion-reduce:animate-none"
              aria-hidden
            />
            {loadingLabel}
          </>
        ) : (
          children
        )}
      </span>
    </button>
  )
}