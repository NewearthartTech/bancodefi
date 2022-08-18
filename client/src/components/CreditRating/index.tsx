import { Card } from '@banco/components'
import { Flex, Text } from '@chakra-ui/react'

export const CreditRating = () => {
  return (
    <Card w="100%" h="300px">
      <Flex direction={'column'} alignItems="center">
        <Text fontSize={32}>Your Credit Rating</Text>
        <Flex>
          <Text
            color="gray.400"
            fontSize={48}
            my="0px"
            fontFamily={'Vesterbro'}
          >
            -
          </Text>
          <Text my="0px" fontFamily={'Vesterbro'} fontSize={48}>
            /100
          </Text>
        </Flex>
        <Text color="gray.400">No Rating</Text>
      </Flex>
    </Card>
  )
}
