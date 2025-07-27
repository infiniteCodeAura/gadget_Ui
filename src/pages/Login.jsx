"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from "@mui/material"
import { Visibility, VisibilityOff, Google, Facebook, Apple } from "@mui/icons-material"

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, you would handle authentication here
      console.log("Login attempt:", formData)
      navigate("/profile")
    }, 1500)
  }

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`)
    // In a real app, integrate with social auth providers
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to your GadgetLoop account
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            autoComplete="email"
            autoFocus
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 2 }}>
            <FormControlLabel
              control={
                <Checkbox name="rememberMe" checked={formData.rememberMe} onChange={handleChange} color="primary" />
              }
              label="Remember me"
            />
            <Button variant="text" size="small">
              Forgot Password?
            </Button>
          </Box>

          <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading} sx={{ mt: 2, mb: 3 }}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Or continue with
          </Typography>
        </Divider>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button fullWidth variant="outlined" startIcon={<Google />} onClick={() => handleSocialLogin("Google")}>
            Google
          </Button>
          <Button fullWidth variant="outlined" startIcon={<Facebook />} onClick={() => handleSocialLogin("Facebook")}>
            Facebook
          </Button>
          <Button fullWidth variant="outlined" startIcon={<Apple />} onClick={() => handleSocialLogin("Apple")}>
            Apple
          </Button>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Button component={Link} to="/signup" variant="text">
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default Login
