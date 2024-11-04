import { updateScores } from "@/actions/scores";
import type { ScoreUpdate } from "@/actions/scores";

const handleSubmitScores = async (formData: FormData) => {
  "use server";
  // use the default browser html form state to handle the form data instead of use state machine
  // this allow for dynamic form and elliminate react-rerendering caused by state change
  const entries = Array.from(formData.entries());
  const updatedEntriesValues: ScoreUpdate[] = [];

  const dosenJSONS = entries.reduce<{
    [key: string]: {
      [key: string]: {
        [key: string]: number;
      }[];
    };
  }>((acc, entry) => {
    if (!entry[0].includes("score::")) return acc;
    const value = entry[1] as string;
    const [prefix, student, subject, key] = entry[0].split("::");
    updatedEntriesValues.push({ id: key, score: parseInt(value, 10) });

    if (!acc[prefix]) {
      acc[prefix] = {};
    }
    if (!acc[prefix][subject]) {
      acc[prefix][subject] = [];
    }
    acc[prefix][subject].push({ [student]: parseInt(value) });
    return acc;
  }, {});

  await updateScores(updatedEntriesValues);

  //sends to no-sql database, with the format that the dosen has asked
  return dosenJSONS;
};

export default handleSubmitScores;
