import { run } from '@/lib/actionsIA'
import React from 'react'

export default function FormTest() {
  return (
    <>
        <form action={run}>
            <label></label>
        </form>
    </>
  )
}
