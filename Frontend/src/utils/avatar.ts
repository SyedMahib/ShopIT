import defaultAvatar from "../assets/default_avatar.jpg";

interface AvatarOwner {
  _id: string;
  avatar?: { url?: string };
}

/**
 * Image URL for a user's avatar.
 * Uploaded avatars load straight from Cloudinary (each upload gets a new URL,
 * so changes show immediately). Google photos go through the backend proxy,
 * because Google blocks loading them directly from other sites.
 */
export function avatarSrc(user?: AvatarOwner | null): string {
  const url = user?.avatar?.url;
  if (!url || !user) return defaultAvatar;
  if (url.includes("res.cloudinary.com")) return url;
  return `/api/avatar/${user._id}`;
}
