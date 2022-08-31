import {
  Flex,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  useRangeSlider,
} from '@chakra-ui/react'

export interface RangeSelectProps {
  value: number[]
  min: number
  max: number
  setValue: (value: number[]) => void
}
export const RangeSelect = ({
  value,
  setValue,
  min,
  max,
}: RangeSelectProps) => {
  return (
    <Flex width="100%">
      <RangeSlider
        aria-label={['min', 'max']}
        defaultValue={value}
        min={min}
        max={max}
        onChangeEnd={(val) => {
          setValue(val)
        }}
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack bg="aquamarine.400" />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} />
        <RangeSliderThumb index={1} />
      </RangeSlider>
    </Flex>
  )
}
