import get from "lodash.get";
import { useState } from "react";
import { SongDoc } from "../models/Song";

export default function useScan(
  items: SongDoc[],
  initial = 0
): [
  number,
  (val: number) => void,
  {
    previous: SongDoc;
    current: SongDoc;
    next: SongDoc;
  }
] {
  const [currentIndex, setCurrentIndex] = useState(initial);

  const scan = {
    previous: get(items, currentIndex - 1),
    current: get(items, currentIndex),
    next: get(items, currentIndex + 1),
  };

  return [currentIndex, setCurrentIndex, scan];
}
