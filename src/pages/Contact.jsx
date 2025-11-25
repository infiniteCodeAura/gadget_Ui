"use client"

import React, { useState } from "react"
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { Email, Phone, LocationOn, AccessTime, Send, Support, QuestionAnswer, BugReport } from "@mui/icons-material"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:9090/api/v0/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitting(false)
        setSubmitSuccess(true)
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          category: "general",
        })

        // Hide success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setIsSubmitting(false);
      setErrors({ submit: error.message || 'Failed to send message. Please try again later.' });
    }
  }

  const contactInfo = [
    {
      icon: <Email color="primary" />,
      title: "Email",
      content: "support@gadgetloop.com",
      description: "Send us an email anytime",
    },
    {
      icon: <Phone color="primary" />,
      title: "Phone",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 5pm",
    },
    {
      icon: <LocationOn color="primary" />,
      title: "Address",
      content: "123 Tech Street, Silicon Valley, CA 94000",
      description: "Visit our headquarters",
    },
    {
      icon: <AccessTime color="primary" />,
      title: "Business Hours",
      content: "Mon - Fri: 8:00 AM - 5:00 PM",
      description: "Weekend support available",
    },
  ]

  const supportCategories = [
    {
      icon: <Support color="primary" />,
      title: "General Support",
      description: "Get help with orders, shipping, and account issues",
    },
    {
      icon: <QuestionAnswer color="primary" />,
      title: "Product Questions",
      description: "Ask about product specifications and compatibility",
    },
    {
      icon: <BugReport color="primary" />,
      title: "Technical Issues",
      description: "Report website bugs or technical problems",
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
          Have questions about our products or need support? We're here to help!
        </Typography>
      </Box>

      {errors.submit && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {errors.submit}
        </Alert>
      )}

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Thank you for your message! We'll get back to you within 24 hours.
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Send us a Message
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Fill out the form below and we'll respond as soon as possible.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    SelectProps={{ native: true }}
                  >
                    <option value="general">General Support</option>
                    <option value="product">Product Questions</option>
                    <option value="technical">Technical Issues</option>
                    <option value="billing">Billing & Orders</option>
                    <option value="partnership">Partnership</option>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                    placeholder="Please describe your question or issue in detail..."
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Send />}
                    disabled={isSubmitting}
                    sx={{ minWidth: 150 }}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Get in Touch
            </Typography>
            <Grid container spacing={2}>
              {contactInfo.map((info, index) => (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined">
                    <CardContent sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      {info.icon}
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                          {info.title}
                        </Typography>
                        <Typography variant="body2" color="primary" gutterBottom>
                          {info.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {info.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Support Categories
            </Typography>
            <List>
              {supportCategories.map((category, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0, alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ mt: 0.5 }}>{category.icon}</ListItemIcon>
                    <ListItemText primary={category.title} secondary={category.description} />
                  </ListItem>
                  {index < supportCategories.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                What is your return policy?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We offer a 30-day return policy for all products. Items must be in original condition with all packaging
                and accessories.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                How long does shipping take?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available for an additional
                fee.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Do you offer warranty on products?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yes, all products come with manufacturer warranty. Extended warranty options are available at checkout.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Can I track my order?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yes, you'll receive a tracking number via email once your order ships. You can also track orders in your
                account.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Contact
