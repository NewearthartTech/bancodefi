import { IconBox, RangeSelect, TriangleIcon } from '@banco/components'
import { Flex, Button, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { RangeSection, RangeSectionProps } from './RangeSection'
import { SwitchSection, SwitchSectionProps } from './SwitchSection'

export interface FilterSection {
  name: string
  children: FilterSectionChild[]
  dispatch?: any
}

export type FilterSectionChild = {
  type: 'switch' | 'range'
  props: FilterSectionChildProps
}

export type FilterSectionChildProps =
  | Pick<SwitchSectionProps, 'name' | 'selected' | 'setSelected'>
  | Pick<RangeSectionProps, 'name' | 'min' | 'max' | 'value' | 'setValue'>

const getChildSection = (filter: FilterSectionChild, dispatch) => {
  const { type, props } = filter
  switch (type) {
    case 'switch':
      const boolAction = (val: boolean) =>
        dispatch((props as SwitchSectionProps).setSelected(val))
      return (
        <SwitchSection
          {...(props as SwitchSectionProps)}
          setSelected={boolAction}
          border="none"
        />
      )
    case 'range':
      const rangeAction = (val: number[]) =>
        dispatch((props as RangeSectionProps).setValue(val))
      return (
        <RangeSection
          {...(props as RangeSectionProps)}
          setValue={rangeAction}
          border="none"
        />
      )
  }
}

export const FilterSection = ({ name, children, dispatch }: FilterSection) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Flex
      flexDirection={'column'}
      borderBottom="solid 1px"
      borderBottomColor={'gray.200'}
      py={'10px'}
    >
      <Button
        boxSize="initial"
        justifyContent="flex-start"
        alignItems="center"
        bg="transparent"
        border="none"
        borderRadius="0px"
        py="10px"
        px="0px"
        _hover={undefined}
        w="100%"
        _active={{
          bg: 'inherit',
          transform: 'none',
          borderColor: 'transparent',
        }}
        _focus={{
          boxShadow: 'none',
        }}
        onClick={() => {
          setExpanded(!expanded)
        }}
      >
        <Flex
          width="100%"
          alignItems={'stretch'}
          justifyContent="space-between"
        >
          <Text
            color={expanded ? 'black' : 'gray.400'}
            my="auto"
            fontSize="xs"
            ml="6px"
            fontFamily="Jakarta"
            fontWeight="600"
          >
            {name}
          </Text>
          <IconBox
            color={'white'}
            bg={'transparent'}
            h="20px"
            w="20px"
            transform={expanded ? 'rotate(180deg)' : undefined}
            transition="200ms"
          >
            <TriangleIcon />
          </IconBox>
        </Flex>
      </Button>
      {expanded && (
        <Flex flexDirection="column">
          {children.map((child) => getChildSection(child, dispatch))}
        </Flex>
      )}
    </Flex>
  )
}
