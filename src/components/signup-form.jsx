import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { signup } from "@/api/authService"

export default function SignupForm({
  onSignupSuccess,
  onSwitchToLogin,
  ...props
}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("analyst")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)
    try {
      const data = await signup(username, password, role)
      onSignupSuccess?.(data.user)

    } catch (err) {
      setError(err.response?.data?.error || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-blue-100 shadow-lg shadow-blue-100/50" {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2" role="alert">
                {error}
              </p>
            )}

            <Field>
              <FieldLabel htmlFor="username" className="text-gray-700">Username</FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="focus-visible:ring-blue-500 focus-visible:border-blue-500"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password" className="text-gray-700">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-visible:ring-blue-500 focus-visible:border-blue-500"
                required
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password" className="text-gray-700">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="focus-visible:ring-blue-500 focus-visible:border-blue-500"
                required
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel className="text-gray-700">Role</FieldLabel>
              <RadioGroup
                value={role}
                onValueChange={setRole}
                className="flex gap-6 pt-1"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="analyst"
                    id="role-analyst"
                    className="border-blue-300 text-blue-600"
                  />
                  <FieldLabel htmlFor="role-analyst" className="text-gray-700 font-normal cursor-pointer">
                    Analyst
                  </FieldLabel>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="admin"
                    id="role-admin"
                    className="border-blue-300 text-blue-600"
                  />
                  <FieldLabel htmlFor="role-admin" className="text-gray-700 font-normal cursor-pointer">
                    Admin
                  </FieldLabel>
                </div>
              </RadioGroup>
            </Field>

            <FieldGroup>
              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-blue-600 hover:underline"
                  >
                    Login
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}