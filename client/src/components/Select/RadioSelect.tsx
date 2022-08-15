import { Flex, Radio, RadioGroup } from '@chakra-ui/react'
import { useState } from 'react'

export const RadioSelect = () => {
  const [value, setValue] = useState('1')
  return (
    <Flex>
      <RadioGroup onChange={setValue} value={value}>
        <Radio></Radio>
      </RadioGroup>
    </Flex>
  )
}
