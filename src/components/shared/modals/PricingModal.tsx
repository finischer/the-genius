import React from "react";
import { Box, Button, Divider, Flex, Group, Modal, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import type { ContextModalProps } from "@mantine/modals";

const PricingModal: React.FC<ContextModalProps<any>> = () => {
  const theme = useMantineTheme();
  return <Text>PricingModal</Text>
  // return (
  //   <Flex
  //     style={{ zIndex: 50 }}
  //     justify="center"
  //   >
  //     <Stack gap={40}>
  //       {/** header section */}
  //       <Flex
  //         direction="column"
  //         gap={10}
  //         align="center"
  //         justify="start"
  //       >
  //         <Title
  //           order={2}
  //           // c={theme.colorScheme === "dark" ? "white" : "hsl(233, 13%, 49%)"}
  //           c="dark.1"
  //         >
  //           Our Pricing
  //         </Title>
  //       </Flex>
  //       {/** cards section */}
  //       <Group>
  //         <Flex
  //           align={"center"}
  //           direction={{ base: "column", sm: "row" }}
  //           color={"hsl(232, 13%, 33%)"}
  //           gap={{ base: "1.5rem", sm: 0 }}
  //         >
  //           <Box
  //             style={{
  //               boxShadow: "0px 30px 50px -7px rgba(0,0,0,0.1)",
  //               height: "22rem",
  //               width: "17rem",
  //               paddingInline: "1.5rem",
  //               // backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : "white",
  //               backgroundColor: theme.colors.dark[5],
  //               borderRadius: "0.7rem 0 0 0.7rem",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",

  //               "@media (max-width: 755px)": {
  //                 width: "19rem",
  //                 borderRadius: "0.7rem",
  //               },
  //               "@media (min-width: 756px) and (max-width: 820px)": {
  //                 width: "15rem",
  //                 borderRadius: "0.7rem 0 0 0.7rem",
  //               },
  //             }}
  //           >
  //             <Stack
  //               w={"100%"}
  //               align={"center"}
  //               gap={20}
  //             >
  //               <Text
  //                 c="dark.1"
  //                 fw={700}
  //                 fz={"md"}
  //               >
  //                 Basic
  //               </Text>
  //               <Title
  //                 order={2}
  //                 c="dark.1"
  //                 style={{
  //                   fontSize: 50,
  //                   display: "flex",
  //                   alignItems: "center",
  //                   gap: 5,
  //                 }}
  //               >
  //                 <Text fz={"2rem"}>$</Text>
  //                 199.99
  //               </Title>
  //               <Stack
  //                 w={"100%"}
  //                 align="center"
  //                 gap={10}
  //                 c="dark.1"
  //               >
  //                 <Divider
  //                   style={{
  //                     width: "100%",
  //                     borderColor: theme.colors.dimmed[5],
  //                     opacity: 0.7,
  //                   }}
  //                 />
  //                 <Text
  //                   fz={"sm"}
  //                   fw={600}
  //                 >
  //                   500 GB Storage
  //                 </Text>
  //                 <Divider
  //                   style={{
  //                     width: "100%",
  //                     borderColor: theme.colorScheme === "dark" ? "gray" : undefined,
  //                     opacity: theme.colorScheme === "dark" ? 0.7 : 1,
  //                   }}
  //                 />
  //                 <Text
  //                   fz={"sm"}
  //                   fw={600}
  //                 >
  //                   2 Users Allowed
  //                 </Text>
  //                 <Divider
  //                   style={{
  //                     width: "100%",
  //                     borderColor: theme.colorScheme === "dark" ? "gray" : undefined,
  //                     opacity: theme.colorScheme === "dark" ? 0.7 : 1,
  //                   }}
  //                 />
  //                 <Text
  //                   fz={"sm"}
  //                   fw={600}
  //                 >
  //                   Send up to 3 GB
  //                 </Text>
  //                 <Divider
  //                   style={{
  //                     width: "100%",
  //                     borderColor: theme.colorScheme === "dark" ? "gray" : undefined,
  //                     opacity: theme.colorScheme === "dark" ? 0.7 : 1,
  //                   }}
  //                 />
  //               </Stack>
  //               <Button
  //                 variant="gradient"
  //                 gradient={{ from: "hsl(236, 72%, 79%)", to: "hsl(237, 63%, 64%)" }}
  //                 w="100%"
  //               >
  //                 LEARN MORE
  //               </Button>
  //             </Stack>
  //           </Box>
  //           <Box
  //             style={{
  //               boxShadow: "0px 30px 50px -7px rgba(0,0,0,0.1)",
  //               height: "25rem",
  //               width: "19rem",
  //               paddingInline: "1.5rem",
  //               background: "linear-gradient(to bottom right, hsl(236, 72%, 79%), hsl(237, 63%, 64%))",
  //               color: "white",
  //               borderRadius: "0.7rem",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",

  //               "@media (min-width: 756px) and (max-width: 820px)": {
  //                 width: "15rem",
  //                 borderRadius: "0.7rem",
  //               },
  //             }}
  //           >
  //             <Stack
  //               w={"100%"}
  //               align={"center"}
  //               spacing={20}
  //             >
  //               <Text
  //                 style={{
  //                   fontWeight: 700,
  //                 }}
  //                 fz={"md"}
  //               >
  //                 Professional
  //               </Text>
  //               <Title
  //                 order={2}
  //                 style={{
  //                   fontSize: 50,
  //                   display: "flex",
  //                   alignItems: "center",
  //                   gap: 5,
  //                 }}
  //               >
  //                 <Text fz={"2rem"}>$</Text>
  //                 249.99
  //               </Title>
  //               <Stack
  //                 w={"100%"}
  //                 align="center"
  //                 spacing={10}
  //               >
  //                 <Divider
  //                   style={{
  //                     width: "100%",
  //                     borderColor: theme.colorScheme === "dark" ? "white" : undefined,
  //                     opacity: theme.colorScheme === "dark" ? 0.6 : 1,
  //                   }}
  //                 />
  //                 <Text
  //                   fz={"sm"}
  //                   fw={600}
  //                 >
  //                   1 TB Storage
  //                 </Text>
  //                 <Divider
  //                   style={{
  //                     width: "100%",
  //                     borderColor: theme.colorScheme === "dark" ? "white" : undefined,
  //                     opacity: theme.colorScheme === "dark" ? 0.6 : 1,
  //                   }}
  //                 />
  //                 <Text
  //                   fz={"sm"}
  //                   fw={600}
  //                 >
  //                   5 Users Allowed
  //                 </Text>
  //                 <Divider
  //                   style={{
  //                     width: "100%",
  //                     borderColor: theme.colorScheme === "dark" ? "white" : undefined,
  //                     opacity: theme.colorScheme === "dark" ? 0.6 : 1,
  //                   }}
  //                 />
  //                 <Text
  //                   fz={"sm"}
  //                   fw={600}
  //                 >
  //                   Send up to 10 GB
  //                 </Text>
  //                 <Divider
  //                   style={{
  //                     width: "100%",
  //                     borderColor: theme.colorScheme === "dark" ? "white" : undefined,
  //                     opacity: theme.colorScheme === "dark" ? 0.6 : 1,
  //                   }}
  //                 />
  //               </Stack>
  //               <Button
  //                 style={{
  //                   backgroundColor: "white",
  //                   color: "hsl(237, 63%, 64%)",

  //                   "&:hover": {
  //                     backgroundColor: "white",
  //                     opacity: 0.95,
  //                   },
  //                 }}
  //                 w="100%"
  //               >
  //                 LEARN MORE
  //               </Button>
  //             </Stack>
  //           </Box>
  //           <Box
  //             style={{
  //               boxShadow: "0px 30px 50px -7px rgba(0,0,0,0.1)",
  //               height: "22rem",
  //               width: "18rem",
  //               paddingInline: "1.5rem",
  //               backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : "white",
  //               borderRadius: "0 0.7rem 0.7rem 0",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",

  //               "@media (max-width: 755px)": {
  //                 width: "19rem",
  //                 borderRadius: "0.7rem",
  //               },
  //               "@media (min-width: 756px) and (max-width: 820px)": {
  //                 width: "15rem",
  //                 borderRadius: "0 0.7rem 0.7rem 0",
  //               },
  //             }}
  //           >
  //             <Stack
  //               w={"100%"}
  //               align={"center"}
  //               spacing={20}
  //             >
  //               <Text
  //                 style={{
  //                   fontWeight: 700,
  //                   color: theme.colorScheme === "dark" ? theme.colors.dark[1] : "hsl(233, 13%, 49%)",
  //                 }}
  //                 fz={"md"}
  //               >
  //                 Master
  //               </Text>
  //               <Title
  //                 order={2}
  //                 style={{
  //                   color: theme.colorScheme === "dark" ? "white" : "hsl(232, 13%, 33%)",
  //                   fontSize: 50,
  //                   display: "flex",
  //                   alignItems: "center",
  //                   gap: 5,
  //                 }}
  //               >
  //                 <Text fz={"2rem"}>$</Text>
  //                 399.99
  //               </Title>
  //               <Stack
  //                 w={"100%"}
  //                 align="center"
  //                 spacing={10}
  //                 style={{ color: theme.colorScheme === "light" ? "hsl(233, 13%, 49%)" : undefined }}
  //               >
  //                 <Divider
  //                   style={{
  //                     width: "100%",
  //                     borderColor: theme.colorScheme === "dark" ? "gray" : undefined,
  //                     opacity: theme.colorScheme === "dark" ? 0.7 : 1,
  //                   }}
  //                 />
  //                 <Text
  //                   fz={"sm"}
  //                   fw={600}
  //                 >
  //                   2 TB Storage
  //                 </Text>
  //                 <Divider
  //                   style={{
  //                     width: "100%",
  //                     borderColor: theme.colorScheme === "dark" ? "gray" : undefined,
  //                     opacity: theme.colorScheme === "dark" ? 0.7 : 1,
  //                   }}
  //                 />
  //                 <Text
  //                   fz={"sm"}
  //                   fw={600}
  //                 >
  //                   10 Users Allowed
  //                 </Text>
  //                 <Divider
  //                   style={{
  //                     width: "100%",
  //                     borderColor: theme.colorScheme === "dark" ? "gray" : undefined,
  //                     opacity: theme.colorScheme === "dark" ? 0.7 : 1,
  //                   }}
  //                 />
  //                 <Text
  //                   fz={"sm"}
  //                   fw={600}
  //                 >
  //                   Send up to 20 GB
  //                 </Text>
  //                 <Divider
  //                   style={{
  //                     width: "100%",
  //                     borderColor: theme.colorScheme === "dark" ? "gray" : undefined,
  //                     opacity: theme.colorScheme === "dark" ? 0.7 : 1,
  //                   }}
  //                 />
  //               </Stack>
  //               <Button
  //                 variant="gradient"
  //                 gradient={{ from: "hsl(236, 72%, 79%)", to: "hsl(237, 63%, 64%)" }}
  //                 w="100%"
  //               >
  //                 LEARN MORE
  //               </Button>
  //             </Stack>
  //           </Box>
  //         </Flex>
  //       </Group>
  //     </Stack>
  //   </Flex>
  // );
};

export default PricingModal;
