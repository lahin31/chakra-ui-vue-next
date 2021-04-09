import { h, defineComponent, PropType, computed } from 'vue'
import {
  chakra,
  DOMElements,
  ThemingProps,
  useStyleConfig,
} from '@chakra-ui/vue-system'
import { filterUndefined } from '@chakra-ui/utils'
import { vueThemingProps } from './utils'

export const CBadge = defineComponent({
  props: {
    as: {
      type: [Object, String] as PropType<DOMElements>,
      default: 'div',
    },
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
      const styles = useStyleConfig('Badge', themingProps.value)

      return h(
        chakra(props.as),
        {
          __css: {
            display: 'inline-block',
            whiteSpace: 'nowrap',
            verticalAlign: 'middle',
            ...styles.value,
          },
          ...attrs,
        },
        slots
      )
    }
  },
})