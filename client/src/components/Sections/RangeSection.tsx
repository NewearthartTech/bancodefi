import { RangeSelect, RangeSelectProps } from '@banco/components'
import { Flex, Text, FlexProps } from '@chakra-ui/react'
import { useState } from 'react'
import numeral from 'numeral'

export interface RangeSectionProps extends FlexProps, RangeSelectProps {
  name: string
}

export const RangeSection = ({
  name,
  min,
  max,
  value,
  setValue,
  ...props
}: RangeSectionProps) => {
  return (
    <Flex
      mt="20px"
      alignItems={'center'}
      pb="20px"
      px="6px"
      borderBottom="solid 1px"
      borderBottomColor={'gray.200'}
      flexDirection={'column'}
      {...props}
    >
      <RangeSelect value={value} setValue={setValue} min={min} max={max} />
      <Flex width="100%" justifyContent={'space-between'}>
        <Text
          my="0px"
          fontSize={'xs'}
          fontFamily="Jakarta"
          fontWeight={700}
          color={'black.100'}
        >
          {numeral(min).format('0,0.[00]')}
        </Text>
        <Text
          my="0px"
          fontSize={'xs'}
          fontFamily="Jakarta"
          fontWeight={700}
          color={'gray.400'}
        >
          {name}
        </Text>
        <Text
          my="0px"
          fontSize={'xs'}
          fontFamily="Jakarta"
          fontWeight={700}
          color={'black.100'}
        >
          {numeral(max).format('0,0.[00]')}
        </Text>
      </Flex>
    </Flex>
  )
}
