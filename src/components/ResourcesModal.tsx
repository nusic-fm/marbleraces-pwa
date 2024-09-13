import { Badge, Divider, Stack, Typography } from "@mui/material";
import { getBackgroundPath, getSkinPath, getTrailPath } from "../helpers";

type Props = {};

const trails = [
  { name: "stars", value: 50 },
  { name: "confetti01", value: 50 },
  { name: "campfire", value: 50 },
  { name: "chrome_ball", value: 100 },
];
const skins = [
  { name: "smoke01", value: 50 },
  { name: "stone", value: 50 },
  { name: "srainyGradient01", value: 100 },
  { name: "vCarbon01", value: 250 },
];
const bgs = [
  { name: "08", value: 100 },
  { name: "09", value: 50 },
  { name: "40", value: 100 },
  { name: "41", value: 50 },
];

const ResourcesModal = (props: Props) => {
  return (
    <Stack direction={"row"} gap={2} justifyContent={"center"}>
      <Stack width={600} gap={2} py={5} px={4}>
        <Typography align="center">Assets</Typography>
        <Stack width={"100%"}>
          <Typography>Skins</Typography>

          <Stack direction={"row"} gap={5} mt={2}>
            {skins.map((skin) => (
              <Stack
                key={skin.name}
                direction={"row"}
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  ":hover": { transform: "scale(1.5)" },
                }}
                onClick={() => {}}
              >
                <Badge badgeContent={`${skin.value}xp`} color="primary">
                  <img src={getSkinPath(skin.name + ".png")} width={40} />
                </Badge>
              </Stack>
            ))}
          </Stack>
        </Stack>
        <Divider />
        <Stack width={"100%"}>
          <Typography>Trails</Typography>

          <Stack direction={"row"} gap={5} mt={2}>
            {trails.map((trail) => (
              <Stack
                key={trail.name}
                direction={"row"}
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  ":hover": { transform: "scale(1.5)" },
                }}
              >
                <Badge badgeContent={`${trail.value}xp`} color="primary">
                  <img src={getTrailPath(trail.name + ".png")} width={40} />
                </Badge>
              </Stack>
            ))}
          </Stack>
        </Stack>
        <Divider />
        <Stack width={"100%"}>
          <Typography>Backgrounds</Typography>

          <Stack direction={"row"} gap={5} mt={2}>
            {bgs.map((bg) => (
              <Stack
                key={bg.name}
                direction={"row"}
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  ":hover": { transform: "scale(1.5)" },
                }}
              >
                <Badge badgeContent={`${bg.value}xp`} color="primary">
                  <img src={getBackgroundPath(bg.name)} width={40} />
                </Badge>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ResourcesModal;
