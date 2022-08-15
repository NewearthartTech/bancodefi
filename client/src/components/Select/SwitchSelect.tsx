import { Flex, Radio, RadioGroup, Switch } from '@chakra-ui/react'

export interface SwitchSelect {
  selected: boolean
  setSelected: (selected: boolean) => void
}

export const SwitchSelect = ({ selected, setSelected }: SwitchSelect) => {
  return (
    <Flex>
      <Switch
        isChecked={selected}
        onChange={() => {
          setSelected(!selected)
        }}
      />
    </Flex>
  )
}
