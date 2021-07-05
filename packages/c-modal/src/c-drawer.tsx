import { computed, ComputedRef, defineComponent, PropType, h, unref, withDirectives, watch } from 'vue'
import { SlideDirection, TransitionVariants, slideTransition, placementToVariant } from '@chakra-ui/c-motion'
import { createContext } from '@chakra-ui/vue-utils'
import { chakra, ComponentWithProps, DeepPartial, HTMLChakraProps, SystemStyleObject, useStyles, useTheme } from '@chakra-ui/vue-system'

import { CModal, CModalProps, modalProps, useModalContext } from "./c-modal"
import { MotionDirective, useMotions } from '@vueuse/motion'
import { useId } from '@chakra-ui/vue-composables'

interface DrawerOptions {
  /**
   * The placement of the drawer
   */
  placement?: SlideDirection
  /**
   * If `true` and drawer's placement is `top` or `bottom`,
   * the drawer will occupy the viewport height (100vh)
   */
  isFullHeight?: boolean
}

export interface DrawerProps extends Omit<CModalProps, "scrollBehavior"> {
  /**
   * The placement of the drawer
   */
  placement?: SlideDirection
  /**
   * If `true` and drawer's placement is `top` or `bottom`,
   * the drawer will occupy the viewport height (100vh)
   */
  isFullHeight?: boolean

  
  modelValue: boolean
}

type CDrawerContext = ComputedRef<DrawerOptions>

const [CDrawerContextProvider, useDrawerContext] = createContext<CDrawerContext>()

export const CDrawer: ComponentWithProps<DeepPartial<DrawerProps>> = defineComponent({
  name: 'CDrawer',
  props: {
    ...modalProps,
    placement: {
      type: String as PropType<SlideDirection>,
      default: 'right'
    },
    isFullHeight: Boolean as PropType<boolean>,
    modelValue: Boolean as PropType<boolean>,
  },
  emits: ['update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const handleUpdateModelValue = (val: boolean) => {
      emit('update:modelValue', val)
    }
    const closeDrawer = () => {
      emit('update:modelValue', false)
    }
    const context: CDrawerContext = computed(() => ({
      placement: props.placement,
      motionPreset: 'scale'
    }))

    const theme = useTheme()
    const drawerStyleConfig = theme.components?.Drawer

    CDrawerContextProvider(context)
    return () => (
      // @ts-expect-error modelValue props
      <CModal modelValue={props.modelValue as boolean} onUpdate:modelValue={handleUpdateModelValue} onClose={closeDrawer} {...props} styleConfig={drawerStyleConfig}>
        {slots}
      </CModal>
    )
  }
})

export interface DrawerContentProps extends HTMLChakraProps<"section"> {}

export const CDrawerContent: ComponentWithProps<DeepPartial<DrawerContentProps>> = defineComponent({
  name: 'CDrawerContent',
  inheritAttrs: false,
  emits: ['click', 'mousedown', 'keydown'],
  setup(_, { attrs, slots, emit }) {
    const {
      dialogContainerProps: rawDialogContainerProps,
      dialogProps: rawDialogProps,
      modelValue,
    } = unref(useModalContext())
    const transitionId = useId('drawer-transition')

    const containerProps = computed(() => rawDialogContainerProps.value({ emit }))
    const dialogProps = computed(() => rawDialogProps.value({ emit }))
    const { placement } = unref(useDrawerContext())
    
    // Styles
    const styles = useStyles()
    const dialogContainerStyles = computed<SystemStyleObject>(() => ({
      display: "flex",
      width: "100vw",
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      ...styles.value.dialogContainer,
    }))

    const dialogStyles = computed<SystemStyleObject>(() => ({
      display: "flex",
      flexDirection: "column",
      position: "relative",
      width: "100%",
      outline: 0,
      ...styles.value.dialog,
    }))

    /** Handles exit transition */
    const leave = (done: VoidFunction) => {
      const motions = useMotions()
      const instance = motions[transitionId.value]
      instance?.leave(() => {
        done()
      })
    }

    watch(modelValue, (newVal) => {
      if (!newVal) {
        leave(() => null)
      }
    })

    const transitionStyles = computed(() => {
      const transitionStyles = slideTransition({ direction: placement })
      const result = Object.assign(
        { position: "fixed" },
        transitionStyles.position
      )
      return result
    })

    const transitionVariant = computed(() => placementToVariant(placement!))

    return () => (
      /* @ts-expect-error TODO: Add ref types to ComponentWithProps type */
      <chakra.div {...containerProps.value} __label="modal__content-container" __css={dialogContainerStyles.value}>
        {modelValue.value && (() => withDirectives(
          // @ts-expect-error TODO: Add ref types to ComponentWithProps type 
          <chakra.section {...dialogProps.value} style={transitionStyles.value} __css={dialogStyles.value} {...attrs}>
            {() => slots?.default?.()}
          </chakra.section>, [
          [
            MotionDirective(TransitionVariants[transitionVariant.value]),
            transitionId.value,
          ],
        ]))}
      </chakra.div>
    )
  }
})

export {
  CModalBody as CDrawerBody,
  CModalCloseButton as CDrawerCloseButton,
  CModalFooter as CDrawerFooter,
  CModalHeader as CDrawerHeader,
  CModalOverlay as CDrawerOverlay,
} from "./c-modal"