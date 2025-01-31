import { ThemingProps } from '@chakra-ui/vue-system'
import { Breakpoints, Styles } from '@chakra-ui/vue-theme-tools'
import { Dict } from '@chakra-ui/utils'
import { StyleObjectOrFn, SystemStyleObject } from '@chakra-ui/styled-system'

export type ColorMode = 'light' | 'dark'

export interface ColorModeOptions {
  initialColorMode?: ColorMode
  useSystemColorMode?: boolean
}

export type RecursiveProperty<Nested = string | number> =
  | RecursiveObject<Nested>
  | Nested

export interface RecursiveObject<Nested = string | number> {
  [property: string]: RecursiveProperty<Nested>
}

export interface ThemeConfig extends ColorModeOptions {
  cssVarPrefix?: string
}

export type ThemeTransitions = RecursiveObject & {
  property: RecursiveObject
  easing: RecursiveObject
  duration: RecursiveObject
}

export interface ColorHues {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}
export type Colors = RecursiveObject<
  Record<string, Partial<ColorHues>> | string
>
export type ThemeDirection = 'ltr' | 'rtl'

export interface ComponentDefaultProps
  extends Omit<ThemingProps, 'styleConfig'>,
    Dict {}

export type ThemingPropsThunk<T> =
  | T
  | ((
      props: Dict &
        Omit<ThemingProps, 'styleConfig'> & {
          colorMode: ColorMode
        }
    ) => T)

export interface SystemStyleObjectRecord {
  [key: string]: StyleObjectOrFn
}

export interface ComponentSingleStyleConfig {
  baseStyle?: ThemingPropsThunk<SystemStyleObject>
  sizes?: Record<string, ThemingPropsThunk<SystemStyleObject>>
  variants?: Record<string, ThemingPropsThunk<SystemStyleObject>>
  defaultProps?: ComponentDefaultProps
}

export interface ComponentMultiStyleConfig {
  parts: string[]
  baseStyle?: ThemingPropsThunk<SystemStyleObjectRecord>
  sizes?: Record<string, ThemingPropsThunk<SystemStyleObjectRecord>>
  variants?: Record<string, ThemingPropsThunk<SystemStyleObjectRecord>>
  defaultProps?: ComponentDefaultProps
}

export type ComponentStyleConfig =
  | ComponentSingleStyleConfig
  | ComponentMultiStyleConfig

export interface ThemeComponents {
  [componentName: string]: ComponentStyleConfig
}

interface Typography {
  fonts: RecursiveObject<string>
  fontSizes: RecursiveObject
  fontWeights: RecursiveObject
  letterSpacings: RecursiveObject
  lineHeights: RecursiveObject
}

interface Foundations extends Typography {
  borders: RecursiveObject
  breakpoints: Breakpoints<Dict>
  colors: Colors
  radii: RecursiveObject
  shadows: RecursiveObject<string>
  sizes: RecursiveObject
  space: RecursiveObject
  transition: ThemeTransitions
  zIndices: RecursiveObject
}

export interface ChakraTheme extends Foundations {
  components: ThemeComponents
  config: ThemeConfig
  direction: ThemeDirection
  styles: Styles
  layerStyles?: SystemStyleObjectRecord
  textStyles?: SystemStyleObjectRecord
}
