import React from 'react'


export default function Footer() {
  return (
    <footer className="footer bg-gray-100 fixed bottom-0 left-0 w-full">
      <hr className="border-gray-200 sm:mx-auto" />
      <p className="text-center text-sm py-2">
        © {new Date().toLocaleString()} WriteD. All rights reserved.
      </p>
    </footer>
  )
}

