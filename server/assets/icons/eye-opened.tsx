import Svg, { Circle, Path } from "react-native-svg"
 const EyeOpenedIcon = () => (
  <Svg
    width={30}
    height={30}
    fill="none"
    viewBox="0 0 24 24"
  >
    <Path
      stroke='#6c916f'
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1 12s4-8 11-8 11 8 11 8M1 12s4 8 11 8 11-8 11-8"
    />
    <Circle
      cx={12}
      cy={12}
      r={3}
      stroke="#6c916f"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </Svg>
)
export default EyeOpenedIcon
