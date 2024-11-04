"use server";

import type { PostgrestError } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

import type {
  ClassesRow,
  ScoresRow,
  ScoresUpdate,
  StudentsRow,
  SubjectsRow,
} from "@/lib/supabase/model/db_model";
import { getStudents } from "./students";

export interface NormalizedScores {
  id: string;
  student_id: string;
  student_name: string;
  score: number | null;
  class_id: number;
  subject_id: string;
  subject_name: string;
}

interface GetScoresResponse {
  data: NormalizedScores[] | null;
  error: PostgrestError | null;
}

type ClassType = Pick<ClassesRow, "id">;
type SubjectType = Pick<SubjectsRow, "id" | "name">;
type StudentType = Pick<StudentsRow, "id" | "name">;

interface PreNormalizedScores extends Pick<ScoresRow, "score" | "id"> {
  students: StudentType | null;
  classes: ClassType | null;
  subjects: SubjectType | null;
}

const normalizeScores = (scores: PreNormalizedScores[]) => {
  return scores.map((score) => ({
    id: score.id,
    score: score.score,
    student_id: score.students?.id ?? "",
    student_name: score.students?.name ?? "",
    class_id: score.classes?.id ?? 0,
    subject_name: score.subjects?.name ?? "",
    subject_id: score.subjects?.id ?? "",
  }));
};

export const createScores = async (classId: number, subjectIds: string[]) => {
  const supabase = await createClient();
  const { studentIds, studentsError } = await getStudents();

  if (!studentIds || studentIds.length <= 0 || studentsError) {
    return { data: [], error: studentsError };
  }

  const scoresData = subjectIds.map((subjectId) =>
    studentIds.map((studentId) => ({
      class_id: classId,
      subject_id: subjectId,
      student_id: studentId.id,
    }))
  );

  const flatScoresData = scoresData.flat();

  const { error } = await supabase.from("scores").insert(flatScoresData);

  return { error };
};

const getScores = async (
  classId: number
): Promise<{
  data: PreNormalizedScores[] | null;
  error: PostgrestError | null;
}> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("scores")
    .select("score, id, students(name, id), subjects(name, id), classes(id)")
    .eq("class_id", classId)
    .order("students(name)", { ascending: true });

  return { data, error };
};

export const getStudentScores = async (
  classId: number
): Promise<GetScoresResponse> => {
  let data: PreNormalizedScores[] = [];
  const { data: scores, error } = await getScores(classId);

  if (error) {
    return { data: [], error };
  }

  if (!scores || scores.length <= 0) {
    const supabase = await createClient();
    const { data: subjectIds, error: subjectsError } = await supabase
      .from("subjects")
      .select("id");

    if (!subjectIds || subjectIds.length <= 0 || subjectsError) {
      return { data: [], error: subjectsError };
    }

    const arraySubjectIds = subjectIds?.map((subject) => subject.id) ?? [];

    await createScores(classId, arraySubjectIds);

    const { data: newScores, error: newScoresError } = await getScores(classId);

    if (newScoresError) {
      return { data: [], error: newScoresError };
    }

    data = newScores ?? [];
  } else {
    data = scores;
  }

  const normalizedScores = normalizeScores(data ?? []);

  return { data: normalizedScores, error };
};

export type ScoreUpdate = Pick<ScoresUpdate, "score" | "id">;

export const updateScores = async (scores: ScoreUpdate[]) => {
  const supabase = await createClient();

  const updates = Promise.all(
    scores.map((score) =>
      supabase
        .from("scores")
        .update({ score: score.score })
        .eq("id", score.id ?? "")
    )
  );

  const [error] = await updates;

  return { error };
};
