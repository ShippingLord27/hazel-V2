"use client"

import type React from "react"
import { useState } from "react"
import { useApp } from "../contexts/AppContext"
import { useRouter } from "next/navigation"

interface AuthModalProps {
  closeModal: () => void
  initialTab: "login" | "signup"
}

export const AuthModal: React.FC<AuthModalProps> = ({ closeModal, initialTab }) => {
  const { login, signup } = useApp()
  const router = useRouter()

  const [view, setView] = useState("initial")
  const [activeTab, setActiveTab] = useState(initialTab || "login")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSignupData({ ...signupData, [e.target.name]: e.target.value })
  const resetForms = () => {
    setErrorMessage("")
    setLoginData({ email: "", password: "" })
    setSignupData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" })
  }
  const handleViewChange = (newView: string) => {
    setView(newView)
    setActiveTab(initialTab || "login")
    resetForms()
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setIsLoading(true)
    try {
      const userProfile = await login(loginData.email, loginData.password, view)
      if (userProfile) {
        closeModal()
        if (userProfile.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/profile")
        }
      } else {
        setErrorMessage("Login failed. Please check your credentials and selected portal.")
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent, role: string) => {
    e.preventDefault()
    if (signupData.password !== signupData.confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }
    setErrorMessage("")
    setIsLoading(true)
    try {
      const user = await signup(
        {
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          email: signupData.email,
          password: signupData.password,
        },
        role,
      )
      if (user) {
        closeModal()
      } else {
        setErrorMessage("Signup failed. This email might already be registered.")
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.")
      console.error("Signup error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const BackLink = () => (
    <a
      href="#"
      className="modal-footer-back-link"
      onClick={(e) => {
        e.preventDefault()
        handleViewChange("initial")
      }}
    >
      &larr; Back to selection
    </a>
  )

  return (
    <div className="modal" style={{ display: "flex" }}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 id="modalTitle">
            {view === "initial" && "Join or Sign In"}
            {view === "renter" && (activeTab === "login" ? "Renter Login" : "Renter Sign Up")}
            {view === "owner" && (activeTab === "login" ? "Owner Login" : "Owner Sign Up")}
            {view === "admin" && (activeTab === "login" ? "Admin Login" : "Admin Sign Up")}
          </h2>
          <button className="modal-close-btn" aria-label="Close modal" onClick={closeModal}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {view === "initial" && (
            <div className="auth-role-selection">
              <h3>How would you like to proceed?</h3>
              <button className="btn btn-primary" onClick={() => handleViewChange("renter")}>
                I want to Rent Items (Renter)
              </button>
              <button className="btn btn-outline" onClick={() => handleViewChange("owner")}>
                I want to List Items (Owner)
              </button>
              <button className="btn btn-secondary" onClick={() => handleViewChange("admin")}>
                Admin Portal
              </button>
            </div>
          )}

          {(view === "renter" || view === "owner" || view === "admin") && (
            <>
              <div className="tab-container">
                <div className={`tab ${activeTab === "login" ? "active" : ""}`} onClick={() => setActiveTab("login")}>
                  Login
                </div>
                <div className={`tab ${activeTab === "signup" ? "active" : ""}`} onClick={() => setActiveTab("signup")}>
                  Sign Up
                </div>
              </div>

              <form
                id="loginForm"
                className={`form-container ${activeTab === "login" ? "active" : ""}`}
                onSubmit={handleLoginSubmit}
              >
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={loginData.email} onChange={handleLoginChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                {errorMessage && activeTab === "login" && <div className="error-message">{errorMessage}</div>}
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>

              <form
                id="signupForm"
                className={`form-container ${activeTab === "signup" ? "active" : ""}`}
                onSubmit={(e) => handleSignupSubmit(e, view)}
              >
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={signupData.firstName}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={signupData.lastName}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={signupData.email} onChange={handleSignupChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                {errorMessage && activeTab === "signup" && <div className="error-message">{errorMessage}</div>}
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? "Signing up..." : `Sign Up as ${view.charAt(0).toUpperCase() + view.slice(1)}`}
                </button>
              </form>
              <BackLink />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
