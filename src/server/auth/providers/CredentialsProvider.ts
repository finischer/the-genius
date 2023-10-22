// import { bcrypt } from 'bcrypt';
// import NextAuthCredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "../db";
// import { filterUserForClient } from '../helpers/filterForUserClient';
// import { DEFAULT_ROLE } from '../auth';

// export default NextAuthCredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: {
//           label: "E-Mail",
//           type: "email",
//           placeholder: "Deine E-Mail",
//         },
//         password: {
//           label: "Passwort",
//           type: "password",
//           placeholder: "Dein Passwort",
//         },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Du hast keine Zugangsdaten eingegeben");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//           include: {
//             gameshows: true,
//           },
//         });

//         if (!user || !user?.password) {
//           throw new Error("Es existiert kein User mit dieser E-Mail 🙁");
//         }

//         const isCorrectPassword = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isCorrectPassword) {
//           throw new Error(
//             "Du musst dich beim Passwort vertippt haben. Probiere es nochmal. Ich schaue auch nicht hin 🫣"
//           );
//         }

//         return filterUserForClient(user);
//       },
//     })
