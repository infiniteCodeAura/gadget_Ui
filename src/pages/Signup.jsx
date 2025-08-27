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
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material"
import { Visibility, VisibilityOff, Google, Facebook, Apple } from "@mui/icons-material"

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",           // <-- new
    agreeToTerms: false,
    subscribeNewsletter: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ["agreeToTerms", "subscribeNewsletter"].includes(name) ? checked : value,
    }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"

    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters"
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = "Password must contain uppercase, lowercase, and number"

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"

    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms and conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    }

    try {
      const res = await fetch("http://192.168.0.106:9090/api/v1/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        // backend may send validation errors
        const msg = data?.message || "Signup failed"
        setErrors({ api: msg })
        return
      }

      // success
      navigate("/login")
    } catch (err) {
      setErrors({ api: "Network error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = (provider) => {
    console.log(`Signup with ${provider}`)
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join GadgetLoop and discover amazing tech products
          </Typography>
        </Box>

        {errors.api && (
          <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
            {errors.api}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                autoComplete="given-name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                autoComplete="family-name"
              />
            </Grid>
          </Grid>

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
            autoComplete="new-password"
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

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            margin="normal"
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Role selector */}
          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">I want to register as</FormLabel>
            <RadioGroup
              row
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
              <FormControlLabel value="seller" control={<Radio />} label="Seller" />
            </RadioGroup>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" required>
                  I agree to the{" "}
                  <Button variant="text" size="small" sx={{ p: 0, minWidth: "auto" }}>
                    Terms of Service
                  </Button>{" "}
                  and{" "}
                  <Button variant="text" size="small" sx={{ p: 0, minWidth: "auto" }}>
                    Privacy Policy
                  </Button>
                </Typography>
              }
            />
            {errors.agreeToTerms && (
              <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                {errors.agreeToTerms}
              </Typography>
            )}
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                name="subscribeNewsletter"
                checked={formData.subscribeNewsletter}
                onChange={handleChange}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                Subscribe to our newsletter for latest tech updates and exclusive deals
              </Typography>
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 3, mb: 3 }}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Or sign up with
          </Typography>
        </Divider>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={() => handleSocialSignup("Google")}
          >
            Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Facebook />}
            onClick={() => handleSocialSignup("Facebook")}
          >
            Facebook
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Apple />}
            onClick={() => handleSocialSignup("Apple")}
          >
            Apple
          </Button>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Button component={Link} to="/login" variant="text">
              Sign In
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default Signup