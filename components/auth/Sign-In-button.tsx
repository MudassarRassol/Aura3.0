import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

interface SignInButtonProps {
    className?: string
}

const SignInButton = ({className }:SignInButtonProps) => {
  return (
    <Button asChild className={className} >
        <Link href={'/page/login'} >
        Sign In
        </Link>
    </Button>
  )
}

export default SignInButton