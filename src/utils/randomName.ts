import { capitalize } from "@/utils/string";
import { uniqueNamesGenerator, colors, names } from "unique-names-generator";

export const getRandomName = () =>
  capitalize(
    uniqueNamesGenerator({
      dictionaries: [names, colors],
      separator: " ",
      length: 2,
    })
  );
