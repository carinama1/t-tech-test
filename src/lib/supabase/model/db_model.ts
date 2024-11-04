import { Database } from "./database.types";

export type StudentsRow = Database["public"]["Tables"]["students"]["Row"];
export type StudentsInsert = Database["public"]["Tables"]["students"]["Insert"];

export type ScoresRow = Database["public"]["Tables"]["scores"]["Row"];
export type ScoresUpdate = Database["public"]["Tables"]["scores"]["Update"];
export type ScoresInsert = Database["public"]["Tables"]["scores"]["Insert"];

export type TeacherRow = Database["public"]["Tables"]["teachers"]["Row"];

export type ClassesRow = Database["public"]["Tables"]["classes"]["Row"];

export type SubjectsRow = Database["public"]["Tables"]["subjects"]["Row"];
