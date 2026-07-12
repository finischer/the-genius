import fs from "node:fs";
import path from "node:path";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { FC } from "react";
import PageLayout from "~/components/layout/PageLayout";
import ReleaseNoteDetail from "~/components/release-notes/ReleaseNoteDetail";
import {
  type ReleaseNote,
  type ReleaseNotesIndex,
  releaseNoteSchema
} from "~/types/releaseNotes";

interface ReleaseNoteDetailPageProps {
  releaseNote: ReleaseNote;
}

interface VersionParams {
  version: string;
  [key: string]: string | string[] | undefined;
}

const RELEASE_NOTES_DIR = path.join(process.cwd(), "public", "release-notes");

export const getStaticPaths: GetStaticPaths<VersionParams> = () => {
  const indexPath = path.join(RELEASE_NOTES_DIR, "index.json");

  let index: ReleaseNotesIndex = { versions: [], latest: "" };
  try {
    const raw = fs.readFileSync(indexPath, "utf-8");
    index = JSON.parse(raw) as ReleaseNotesIndex;
  } catch (error) {
    console.error("Failed to read release notes index:", error);
  }

  return {
    paths: index.versions.map((version) => ({ params: { version } })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<
  ReleaseNoteDetailPageProps,
  VersionParams
> = ({ params }) => {
  const version = params?.version;

  if (typeof version !== "string") {
    return { notFound: true };
  }

  const filePath = path.join(RELEASE_NOTES_DIR, `${version}.json`);

  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`Release note file not found for version ${version}:`, error);
    return { notFound: true };
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch (error) {
    console.error(`Invalid JSON in release note ${version}:`, error);
    return { notFound: true };
  }

  const result = releaseNoteSchema.safeParse(parsedJson);
  if (!result.success) {
    console.error(
      `Release note ${version} failed schema validation:`,
      result.error
    );
    return { notFound: true };
  }

  return {
    props: {
      releaseNote: result.data
    }
  };
};

const ReleaseNoteDetailPage: FC<ReleaseNoteDetailPageProps> = ({
  releaseNote
}) => {
  return (
    <PageLayout>
      <ReleaseNoteDetail releaseNote={releaseNote} />
    </PageLayout>
  );
};

export default ReleaseNoteDetailPage;
export type { ReleaseNoteDetailPageProps };
