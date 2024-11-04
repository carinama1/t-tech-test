import { NextApiRequest, NextApiResponse } from "next";
import { uniqueNamesGenerator, colors, names } from "unique-names-generator";

import { capitalize } from "@/utils/string";

const generate10RandomNames = () =>
  Array.from({ length: 10 }, () =>
    capitalize(
      uniqueNamesGenerator({
        dictionaries: [names, colors],
        separator: " ",
        length: 2,
      })
    )
  );

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const names = generate10RandomNames();
  const students = names.map((name) => ({ name }));
  res.status(200).json({ students });
}
