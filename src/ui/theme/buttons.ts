import tinycolor from 'tinycolor2'
import { css } from 'glamor'
import {
  defaultCatalogTheme,
  CatalogTheme
} from './catalog-theme'
import {
  Themer,
  ButtonStateProps
} from './evergreen'
import {
  IntentTypes,
  ButtonAppearance
} from '@treygriffith/evergreen-ui'

interface Gradient {
  start: string,
  end: string
}

type Background = string | Gradient

function isGradient (bg: Background): bg is Gradient {
  if (!bg) return false
  if (typeof bg === 'string') return false
  return true
}

interface HasBackground {
  background: Background
}

interface HasTextColor {
  textColor: string
}

function getLinearGradient(top: string, bottom: string): string {
  return `linear-gradient(to bottom, ${top}, ${bottom})`
}

interface LinearGradientState {
  base: string,
  hover: string,
  active: string
}

function emphasizeLinearGradient(startStr: string, endStr: string, amount: number): string {
  const start = tinycolor(startStr)
  const end = tinycolor(endStr)

  // we want to modify both colors in the same direction, so we choose one to be the
  // one we'll use as a brightness guide
  if (end.isLight()) {
    return getLinearGradient(start.darken(amount).toString(), end.darken(amount).toString())
  }

  return getLinearGradient(start.lighten(amount).toString(), end.lighten(amount).toString())
}

function getLinearGradientStates(start: string, end: string): LinearGradientState {
  return {
    base: getLinearGradient(start, end),
    hover: emphasizeLinearGradient(start, end, 5),
    active: emphasizeLinearGradient(end, end, 5)
  }
}

function getStartColor (background: Background): string {
  if (isGradient(background)) {
    return background.start
  }

  return background
}

function getEndColor (background: Background): string {
  if (isGradient(background)) {
    return background.end
  }

  return background
}

function getBackgroundImage (prop: HasBackground, state: 'base' | 'hover' | 'active'): string {
  const background = prop.background

  return getLinearGradientStates(getStartColor(background), getEndColor(background))[state]
}


function defaultControlStyles (theme: CatalogTheme): ButtonStateProps {
  return {
    disabled: {
      opacity: 0.8,
      backgroundImage: 'none',
      backgroundColor: theme.scales.neutral.N2A,
      boxShadow: 'none',
      color: theme.scales.neutral.N7A,
      pointerEvents: 'none'
    },
    base: {
      backgroundColor: 'white',
      backgroundImage: getLinearGradient('#FFFFFF', '#F4F5F7'),
      boxShadow: `inset 0 0 0 1px ${theme.scales.neutral.N4A}, inset 0 -1px 1px 0 ${
        theme.scales.neutral.N2A
      }`
    },
    hover: {
      backgroundImage: getLinearGradient('#FAFBFB', '#EAECEE')
    },
    focus: {
      boxShadow: `0 0 0 3px ${theme.scales.blue.B4A}, inset 0 0 0 1px ${
        theme.scales.neutral.N5A
      }, inset 0 -1px 1px 0 ${theme.scales.neutral.N4A}`
    },
    active: {
      backgroundImage: 'none',
      backgroundColor: theme.scales.blue.B3A,
      boxShadow: `inset 0 0 0 1px ${theme.scales.neutral.N4A}, inset 0 1px 1px 0 ${
        theme.scales.neutral.N2A
      }`
    },
    focusAndActive: {
      boxShadow: `0 0 0 3px ${theme.scales.blue.B4A}, inset 0 0 0 1px ${
        theme.scales.neutral.N5A
      }, inset 0 1px 1px 0 ${theme.scales.neutral.N2A}`
    }
  }
}

export type CustomButtonsProps = Partial<{
  primary: HasBackground & HasTextColor,
  default: HasBackground & HasTextColor,
  // Note: we don't use minimal buttons
  minimal: HasBackground & HasTextColor
}>

export default function customizeButtons (theme: CatalogTheme, props: CustomButtonsProps): CatalogTheme {
  return {
    ...theme,
    getButtonClassName (appearance: ButtonAppearance, intent: IntentTypes): string {
      const buttonProps = props[appearance]

      if (!buttonProps || (intent && intent !== 'none')) {
        return defaultCatalogTheme.getButtonClassName(appearance, intent)
      }

      const focusColor = tinycolor(getStartColor(buttonProps.background)).setAlpha(0.4).toString()
      const defaults = defaultControlStyles(this)

      return css(Themer.createButtonAppearance({
        ...defaults,
        base: {
          ...defaults.base,
          color: buttonProps.textColor,
          backgroundColor: getStartColor(buttonProps.background),
          backgroundImage: getBackgroundImage(buttonProps, 'base')
        },
        hover: {
          ...defaults.hover,
          backgroundImage: getBackgroundImage(buttonProps, 'hover')
        },
        focus: {
          ...defaults.focus,
          boxShadow: `0 0 0 3px ${focusColor}, inset 0 0 0 1px ${
            this.scales.neutral.N4A
          }, inset 0 -1px 1px 0 ${this.scales.neutral.N5A}`
        },
        active: {
          ...defaults.active,
          backgroundImage: getBackgroundImage(buttonProps, 'active')
        },
        focusAndActive: {
          ...defaults.focusAndActive,
          boxShadow: `0 0 0 3px ${focusColor}, inset 0 0 0 1px ${
            this.scales.neutral.N4A
          }, inset 0 1px 1px 0 ${this.scales.neutral.N2A}`
        }
      })).toString()
    }
  }
}
