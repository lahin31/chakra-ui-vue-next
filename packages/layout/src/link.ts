import { vueThemingProps } from './utils'
import {
  h,
  defineComponent,
  PropType,
  computed,
  resolveComponent,
  createVNode,
} from 'vue'
import {
  chakra,
  DOMElements,
  ThemingProps,
  useStyleConfig,
} from '@chakra-ui/vue-system'
import { filterUndefined } from '@chakra-ui/utils'

/**
 * Links are accessible elements used primarily for navigation.
 *
 * It integrates well with other routing libraries like
 * Vue Router and Nuxt.js Link.
 *
 * @example
 *
 * ```vue
 * <CLink as="router-link" to="/home">Home</CLink>
 * ```
 *
 * @see Docs https://chakra-ui.com/docs/layout/link
 */
export const CLink = defineComponent({
  props: {
    as: {
      type: [Object, String] as PropType<DOMElements>,
      default: 'a',
    },
    isExternal: Boolean,
    ...vueThemingProps,
  },
  setup(props, { slots, attrs }) {
    return () => {
      const themingProps = computed<ThemingProps>(() =>
        filterUndefined({
          colorScheme: props.colorScheme,
          variant: props.variant,
          size: props.size,
          styleConfig: props.styleConfig,
        })
      )
      const styles = useStyleConfig('Link', themingProps.value)

      return h(
        chakra(props.as),
        {
          target: props.isExternal ? '_blank' : undefined,
          rel: props.isExternal ? 'noopener noreferrer' : undefined,
          __css: styles.value,
          ...attrs,
        },
        slots
      )
    }
  },
})