import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  toaster as defaultToaster
} from '@treygriffith/evergreen-ui'
import RehomeEvergreen from './rehome-evergreen'
// TODO: allow customization / BYOToaster

interface ToasterSettings {
  description?: React.ReactNode
  duration?: number
  id?: string
  hasCloseButton?: boolean
}

// TODO: use a context rather than importing the toaster from this file.
// May help us enforce the one-Toaster-per-app rule
export const toaster: typeof defaultToaster = {
  ...defaultToaster,
  danger: (title: string, settings?: ToasterSettings): void => {
    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      console.error(title)
    }
    defaultToaster.danger(title, settings)
  },
  warning: (title: string, settings?: ToasterSettings): void => {
    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      console.warn(title)
    }
    defaultToaster.warning(title, settings)
  }
}

export const Toaster: React.FC = ({ children }) => {
  return <RehomeEvergreen components='data-evergreen-toaster-container'>{children}</RehomeEvergreen>
}