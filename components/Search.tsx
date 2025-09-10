"use client"

import type React from "react"
import { useState } from "react"

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchTerm)
  }

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-btn">
        <i className="fas fa-search"></i>
      </button>
    </form>
  )
}
