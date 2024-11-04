"use client";

import { FC, FormEvent, useCallback, useMemo, useState } from "react";

import type { TeacherData } from "@/actions/teachers";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { NormalizedScores } from "@/actions/scores";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { GenericOption } from "@/model/generic";
import SelectGeneric from "./Select";

import { Button } from "../ui/button";
import TeacherInfo from "./TeacherInfo";
import { toast } from "react-hot-toast";

const scoreOptions: GenericOption[] = Array.from({ length: 11 }, (_, i) => ({
  value: i.toString(),
  label: i.toString(),
}));

interface ShadcnTableProps {
  userName: string;
  teacherData: TeacherData;
  scoresData: NormalizedScores[];
  onSubmit: (formData: FormData) => Promise<unknown>;
}

interface IReadyScores {
  [key: string]: {
    [key: string]: {
      key: string;
      value: number;
    };
  };
}

const normalizeTableHeaders = (scoresData: NormalizedScores[]) => {
  return Array.from(
    new Set(scoresData.map((score) => score.subject_name))
  ).sort();
};

const normalizeTableScores = (scoresData: NormalizedScores[]) => {
  const studentScores = scoresData.reduce((acc, score) => {
    if (!score.student_name) return acc;
    if (!acc[score.student_name]) {
      acc[score.student_name] = {};
    }
    if (!acc[score.student_name][score.subject_name]) {
      acc[score.student_name][score.subject_name] = {
        key: score.id,
        value: 0,
      };
    }

    acc[score.student_name][score.subject_name] = {
      key: score.id,
      value: score.score ?? 0,
    };
    return acc;
  }, {} as IReadyScores);

  return studentScores;
};

const ShadcnTable: FC<ShadcnTableProps> = ({
  userName,
  teacherData,
  scoresData,
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      const loadingToast = toast.loading("Menyimpan data...");
      const formData = new FormData(event.target as HTMLFormElement);
      const dosenJSON = await onSubmit(formData);
      console.log({ dosenJSON });
      toast.success("Berhasil menyimpan data", { id: loadingToast });
      alert("Lihat Dev Tools Console untuk melihat format data yang diminta");
      setIsLoading(false);
    },
    [onSubmit]
  );

  const tableHeaders = useMemo(
    () => normalizeTableHeaders(scoresData),
    [scoresData]
  );
  const tableScores = useMemo(
    () => normalizeTableScores(scoresData),
    [scoresData]
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 flex flex-col">
      <TeacherInfo userName={userName} teacherData={teacherData} />
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Mahasiswa</TableHead>
              {tableHeaders.map((header, index) => (
                <TableHead key={index} className="text-center">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableScores &&
              Object.keys(tableScores).length > 0 &&
              Object.keys(tableScores).map((student) => (
                <TableRow key={student}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32`}
                        />
                        <AvatarFallback>{student[0]}</AvatarFallback>
                      </Avatar>
                      {student}
                    </div>
                  </TableCell>
                  {tableHeaders.map((header, index) => {
                    const subject_name = header;
                    const student_name = student;
                    const key = tableScores?.[student]?.[header]?.key;
                    return (
                      <TableCell key={index}>
                        <SelectGeneric
                          name={`score::${student_name}::${subject_name}::${key}`}
                          placeholder="Pilih nilai"
                          options={scoreOptions}
                          defaultValue={tableScores?.[student]?.[
                            header
                          ]?.value.toString()}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <Button disabled={isLoading} type="submit" className="ml-auto">
        {isLoading ? "Menyimpan..." : "Simpan"}
      </Button>
    </form>
  );
};

export default ShadcnTable;
