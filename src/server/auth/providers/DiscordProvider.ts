import NextAuthDiscordProvider, { type DiscordProfile } from "next-auth/providers/discord";
import { DEFAULT_ROLE } from "../../auth";

const IMG_EMBED_URL = "https://cdn.discordapp.com/embed/avatars/";
const IMG_URL = "https://cdn.discordapp.com/avatars";
const AVATAR_FORMATS = {
  GIF: "gif",
  PNG: "png",
};

const buildImageUrl = (profileId: string, avatar: string | null, discriminator: string) => {
  let imgUrl;

  if (avatar === null) {
    const defaultAvatarNumber = parseInt(discriminator) % 5;
    imgUrl = `${IMG_EMBED_URL}/${defaultAvatarNumber}.${AVATAR_FORMATS.PNG}`;
  } else {
    const avatarFormat = avatar.startsWith("a_") ? AVATAR_FORMATS.GIF : AVATAR_FORMATS.PNG;
    imgUrl = `${IMG_URL}/${profileId}/${avatar}.${avatarFormat}`;
  }

  return imgUrl;
};

export default NextAuthDiscordProvider({
  clientId: process.env.DISCORD_CLIENT_ID ?? "",
  clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
  profile(profile: DiscordProfile) {
    console.log("Discord Profile: ", profile);
    profile.image_url = buildImageUrl(profile.id, profile.avatar, profile.discriminator);
    return {
      id: profile.id,
      role: DEFAULT_ROLE,
      isEmailVerified: profile.verified,
      name: profile.username,
      email: profile.email,
      image: profile.image_url,
    };
  },
});
