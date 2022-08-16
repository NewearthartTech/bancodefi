import { SwitchSelect } from '@banco/components'
import { Flex, Text, FlexProps } from '@chakra-ui/react'
import { useState } from 'react'

export interface SwitchSectionProps extends FlexProps, SwitchSelect {
  name: string
}

export const SwitchSection = ({
  name,
  selected,
  setSelected,
  ...props
}: SwitchSectionProps) => {
  return (
    <Flex
      mt="20px"
      alignItems={'center'}
      pb="20px"
      pl="6px"
      borderBottom="solid 1px"
      borderBottomColor={'gray.200'}
      {...props}
    >
      <SwitchSelect selected={selected} setSelected={setSelected} />
      <Text
        my="0px"
        ml="10px"
        fontSize={'xs'}
        fontFamily="Jakarta"
        fontWeight={700}
        color={selected ? 'black.100' : 'gray.400'}
      >
        {name}
      </Text>
    </Flex>
  )
}
