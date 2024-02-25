import { Container } from "@mantine/core";
import { useSession } from "next-auth/react";
import PageLayout from "~/components/layout/PageLayout";
import DatenschutzerklaerungContent from "~/components/shared/DatenschutzerklaerungContent";

const DatenschutzPage = () => {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <PageLayout>
        <DatenschutzerklaerungContent />
      </PageLayout>
    );
  }

  return (
    <Container m="md">
      <DatenschutzerklaerungContent />
    </Container>
  );
};

export default DatenschutzPage;
