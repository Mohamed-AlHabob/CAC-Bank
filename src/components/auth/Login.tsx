'use client'

import { DialogContent } from "@radix-ui/react-dialog"
import { Dialog, DialogTitle } from "../ui/dialog"
import { SignedIn, UserButton } from "@clerk/nextjs"

export default function Login() {

  return (
<Dialog>
  <DialogTitle className="">Auth</DialogTitle>
  <DialogContent className=" items-center">
  <SignedIn>
    <UserButton />
  </SignedIn>
  </DialogContent>
</Dialog>
  )
}
