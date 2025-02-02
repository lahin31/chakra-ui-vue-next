import { computed, Plugin, ref, UnwrapRef } from 'vue'
import defaultTheme from '@chakra-ui/vue-theme'
import type { ColorModeRef } from '@chakra-ui/c-color-mode'
import { toCSSVar, WithCSSVar } from '@chakra-ui/styled-system'
import { chakra, injectGlobal, css } from '@chakra-ui/vue-system'
import internalIcons from './icon.internals'
import { extendTheme, ThemeOverride } from './extend-theme'
import { MergedIcons, parseIcons } from './parse-icons'
import { injectResetStyles, injectThemeGlobalStyles } from './helpers/css-reset'
import { mode } from '@chakra-ui/vue-theme-tools'
import { ChakraPluginOptions } from './helpers/plugin.types'

/**
 * Helper function to extend Chakra plugin with options
 * It just returns its arguments with typescript types added
 */
export function chakraOptions(
  options: ChakraPluginOptions = { cssReset: true }
) {
  return options
}

const ChakraUIVuePlugin: Plugin = {
  install(app, options: ChakraPluginOptions = { cssReset: true }) {
    // 1. Get theme value
    // 2. Parse theme tokens to CSS variables
    // 3. Inject all CSS variables as theme object
    const theme = options.extendTheme || defaultTheme
    const computedTheme = computed<WithCSSVar<ThemeOverride>>(() =>
      toCSSVar(theme)
    )

    // Inject Chakra CSS variables
    injectGlobal({
      ':root': computedTheme.value.__cssVars,
    })

    // Initialize colormode
    const colorMode: UnwrapRef<ColorModeRef> =
      theme.config?.initialColorMode || 'light'

    // Provide initial colormode
    app.config.globalProperties.$initialColorMode = colorMode

    const colorModeRef = ref(colorMode) as ColorModeRef
    app.provide<ColorModeRef>('$chakraColorMode', colorModeRef)

    if (options.cssReset) {
      injectResetStyles()
    }
    // Inject `styles.global` in document
    injectThemeGlobalStyles(computedTheme.value, colorModeRef)

    let libraryIcons = options.icons?.library || {}
    let extendedIcons = options.icons?.extend || {}

    // Bind theme to application global properties and provide to application
    app.config.globalProperties.$chakraTheme = computedTheme.value
    app.provide('$chakraTheme', computedTheme.value as ThemeOverride)

    libraryIcons = parseIcons(libraryIcons)

    // Merge internal icons and library icons
    const mergedIcons: MergedIcons = {
      ...internalIcons,
      ...libraryIcons,
      ...extendedIcons,
    }

    app.provide('$chakraIcons', mergedIcons)

    // Set color mode property
    app.config.globalProperties.$mode = mode
  },
}

export type { ChakraPluginOptions }
export interface ThemeProviderProps extends ThemeOverride {}
export default ChakraUIVuePlugin
export { extendTheme }

// Export chakra factory function
export { chakra }

/**
 *
 * Component exports
 * ==================
 *
 * Dear contributors,
 *
 * Please keep these exports in Alphabetical order :)
 */

// A
export * from '@chakra-ui/c-accordion'
export * from '@chakra-ui/c-alert'

// B
export * from '@chakra-ui/c-breadcrumb'
export * from '@chakra-ui/c-button'

// C
export * from '@chakra-ui/c-color-mode'
export * from '@chakra-ui/c-close-button'
export * from '@chakra-ui/c-code'

// F
export * from '@chakra-ui/c-flex'
export * from '@chakra-ui/c-focus-lock'

// I
export * from '@chakra-ui/c-icon'

// L
export * from '@chakra-ui/vue-layout'

// M
export * from '@chakra-ui/c-modal'
export * from '@chakra-ui/c-motion'

// P
export * from '@chakra-ui/c-popper'
export * from '@chakra-ui/c-portal'

// R
export * from '@chakra-ui/c-reset'

// S
export * from '@chakra-ui/c-spinner'
export * from '@chakra-ui/c-scroll-lock'

// T
export * from '@chakra-ui/c-theme-provider'

// V
export * from '@chakra-ui/c-visually-hidden'

// OTHERS
export * from '@chakra-ui/vue-composables'
export * from '@chakra-ui/vue-a11y'

/**
 *
 * Directives exports
 * ==================
 *
 * Dear contributors,
 *
 * Please keep these exports in Alphabetical order :)
 */
