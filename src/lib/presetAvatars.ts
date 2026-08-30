// Built-in avatar choices for users who'd rather not upload a photo.
// Served as static files from /public/avatars.
export type PresetAvatar = {
  name: string;
  url: string;
};

export const PRESET_AVATARS: PresetAvatar[] = [
  { name: "Panda", url: "/avatars/panda.svg" },
  { name: "Fox", url: "/avatars/fox.svg" },
  { name: "Cat", url: "/avatars/cat.svg" },
  { name: "Koala", url: "/avatars/koala.svg" },
  { name: "Otter", url: "/avatars/otter.svg" },
  { name: "Bear", url: "/avatars/bear.svg" },
];
