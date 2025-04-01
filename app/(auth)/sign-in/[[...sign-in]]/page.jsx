"use client"; // needed for SignIn Component from Clerk
import { SignIn } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return (
    <SignIn />
  )
}

export default Page