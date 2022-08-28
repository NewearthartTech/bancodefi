import { IconBox, RangeSelect, TriangleIcon } from '@banco/components'
import { FilterState } from '@banco/pages/loans/state'
import { Flex, Button, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { RangeSection, RangeSectionProps } from './RangeSection'
import { SwitchSection, SwitchSectionProps } from './SwitchSection'

export interface FilterSection {
  name: string
  children: FilterSectionChild[]
  dispatch?: any
  filterState?: FilterState
}

export type FilterSectionChild = {
  type: 'switch' | 'range'
  props: FilterSectionChildProps
}

type RangeSectionPropsCreator = Pick<RangeSectionProps, 'name' | 'setValue'> & {
  getValue: (state: FilterState) => number[]
  getMin: (state: FilterState) => number
  getMax: (state: FilterState) => number
}

export type FilterSectionChildProps =
  | Pick<SwitchSectionProps, 'name' | 'selected' | 'setSelected'>
  | RangeSectionPropsCreator

const getChildSection = (
  filterState: FilterState,
  filter: FilterSectionChild,
  dispatch,
) => {
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
          key={filter.props.name}
        />
      )
    case 'range':
      const creatorProps = props as RangeSectionPropsCreator
      const rangeProps: RangeSectionProps = {
        min: creatorProps.getMin(filterState),
        max: creatorProps.getMax(filterState),
        value: creatorProps.getValue(filterState),
        ...creatorProps,
      }
      const rangeAction = (val: number[]) => dispatch(rangeProps.setValue(val))
      return (
        <RangeSection
          {...rangeProps}
          setValue={rangeAction}
          border="none"
          key={filter.props.name}
        />
      )
  }
}

export const FilterSection = ({
  filterState,
  name,
  children,
  dispatch,
}: FilterSection) => {
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
          {children.map((child) =>
            getChildSection(filterState, child, dispatch),
          )}
        </Flex>
      )}
    </Flex>
  )
}
