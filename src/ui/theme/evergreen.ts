import * as React from 'react'
import { StyleAttribute } from 'glamor'
import {
  IntentTypes,
  ButtonAppearance,
  defaultTheme,
  Theme,
  // @ts-ignore
  withTheme as untypedWithTheme,
  // @ts-ignore
  ThemeProvider as UntypedProvider
} from '@treygriffith/evergreen-ui'
// @ts-ignore
import { Themer as UntypedThemer } from '@treygriffith/evergreen-ui/commonjs/themer'

declare module '@treygriffith/evergreen-ui' {
  type TypographyStyle = Partial<{
    color: string
    fontFamily: string
    fontSize: string
    fontWeight: number
    letterSpacing: string
    lineHeight: string
    marginTop: number
    textTransform: string
  }>

  interface Theme {
    getButtonClassName: (appearance: ButtonAppearance, intent: IntentTypes) => string,
    getBackground: (background: string) => string,
    getElevation: (elevation: number) => string,
    getIconColor: (color: string) => string,
    getHeadingStyle: (size?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900) => TypographyStyle,
    getTextStyle: (size?: 300 | 400 | 500 | 600) => TypographyStyle,
    getParagraphStyle: (size?: 300 | 400 | 500) => TypographyStyle,
    getFontFamily: (family: string) => string,
    getTextColor: (color: string) => string
  }
}

type ButtonProps = Partial<{
  opacity: number,
  backgroundImage: string,
  backgroundColor: string,
  boxShadow: string,
  color: string,
  pointerEvents: string
}>

export type ButtonStateProps = Partial<{
  disabled: ButtonProps,
  base: ButtonProps,
  hover: ButtonProps,
  focus: ButtonProps,
  active: ButtonProps,
  focusAndActive: ButtonProps
}>

interface ThemerType {
  createButtonAppearance: (props: ButtonStateProps) => StyleAttribute
}

const Themer = UntypedThemer as ThemerType

// ThemeProvider is not in the index.d.ts for evergreen
const ThemeProvider = UntypedProvider as React.Provider<typeof defaultTheme>

type ThemeHOC = <Props extends {}>(WrappedComponent: React.ComponentType<Props>) => React.ComponentType<Omit<Props, 'theme'>>

// withTheme is not in the index.d.ts for evergreen
const withTheme: ThemeHOC = untypedWithTheme as ThemeHOC

export {
  Theme,
  Themer,
  ThemeProvider,
  withTheme
}
