import { Container } from "@mantine/core";
import { useSession } from "next-auth/react";
import PageLayout from "~/components/layout";
import ImpressumContent from "~/components/shared/ImpressumContent";

const ImpressumPage = () => {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <PageLayout>
        <ImpressumContent />
      </PageLayout>
    );
  }

  return (
    <Container m="md">
      <ImpressumContent />
    </Container>
  );
};

export default ImpressumPage;
