import { ListItemButton, List, Paper, Typography, Box } from "@mui/material";
import { useHits } from "react-instantsearch-hooks-web";

interface Props {
  onSuggestionSelect: (id: string) => void;
}

const Suggestions = ({ onSuggestionSelect }: Props) => {
  const { hits } = useHits();

  return (
    <Paper elevation={2} sx={{ width: "100%" }}>
      <List>
        {hits.map((hit) => (
          <ListItemButton
            key={hit.objectID}
            onClick={() => onSuggestionSelect(hit.objectID)}
          >
            <Box display={"flex"} flexDirection="column" width={"100%"}>
              <Typography maxWidth={"100%"} overflow="auto">
                {(hit as any).name}
              </Typography>
              <Typography variant="caption">{(hit as any).artist}</Typography>
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default Suggestions;
