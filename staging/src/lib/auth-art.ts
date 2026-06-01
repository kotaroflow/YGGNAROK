export type AuthArt = {
  src: string;
  backgroundSrc: string;
  from: string;
  mid: string;
  to: string;
  panel: string;
  focus: string;
};

export const authArt: AuthArt[] = [
  { src: "/auth-art/login-optimized/auth-random-01.jpg", backgroundSrc: "/auth-art/login-background/auth-random-01.jpg", from: "#1a102e", mid: "#6f35d8", to: "#d8ccff", panel: "#130d25", focus: "48% 50%" },
  { src: "/auth-art/login-optimized/auth-random-02.jpg", backgroundSrc: "/auth-art/login-background/auth-random-02.jpg", from: "#170f31", mid: "#6e2fd1", to: "#d7c6ff", panel: "#100a24", focus: "41% 50%" },
  { src: "/auth-art/login-optimized/auth-random-03.jpg", backgroundSrc: "/auth-art/login-background/auth-random-03.jpg", from: "#ebf5ff", mid: "#8bc3ff", to: "#efe1ff", panel: "#d8edff", focus: "62% 50%" },
  { src: "/auth-art/login-optimized/auth-random-04.jpg", backgroundSrc: "/auth-art/login-background/auth-random-04.jpg", from: "#121a3d", mid: "#584bd8", to: "#d8e9ff", panel: "#0d1432", focus: "39% 51%" },
  { src: "/auth-art/login-optimized/auth-random-05.jpg", backgroundSrc: "/auth-art/login-background/auth-random-05.jpg", from: "#2c0e0a", mid: "#c43a18", to: "#ffd0a6", panel: "#1d0a08", focus: "43% 50%" },
  { src: "/auth-art/login-optimized/auth-random-06.jpg", backgroundSrc: "/auth-art/login-background/auth-random-06.jpg", from: "#f9fbff", mid: "#7eb7ff", to: "#fff1d3", panel: "#eaf5ff", focus: "46% 50%" },
  { src: "/auth-art/login-optimized/auth-random-07.jpg", backgroundSrc: "/auth-art/login-background/auth-random-07.jpg", from: "#130c25", mid: "#6230cb", to: "#c6b7ff", panel: "#0c081b", focus: "48% 53%" },
  { src: "/auth-art/login-optimized/auth-random-08.jpg", backgroundSrc: "/auth-art/login-background/auth-random-08.jpg", from: "#fff4f7", mid: "#f3b7d6", to: "#cfddff", panel: "#fff1f6", focus: "50% 51%" },
  { src: "/auth-art/login-optimized/auth-random-09.jpg", backgroundSrc: "/auth-art/login-background/auth-random-09.jpg", from: "#100818", mid: "#5b24b5", to: "#c7b4ff", panel: "#0b0613", focus: "50% 55%" },
  { src: "/auth-art/login-optimized/auth-random-10.jpg", backgroundSrc: "/auth-art/login-background/auth-random-10.jpg", from: "#101332", mid: "#5f73e5", to: "#d4e8ff", panel: "#0b1028", focus: "47% 52%" },
  { src: "/auth-art/login-optimized/auth-random-11.jpg", backgroundSrc: "/auth-art/login-background/auth-random-11.jpg", from: "#161436", mid: "#6559dd", to: "#e4d8ff", panel: "#0d0b24", focus: "48% 51%" },
  { src: "/auth-art/login-optimized/auth-random-12.jpg", backgroundSrc: "/auth-art/login-background/auth-random-12.jpg", from: "#13091f", mid: "#6c23c9", to: "#d7bbff", panel: "#0c0617", focus: "45% 55%" },
  { src: "/auth-art/login-optimized/auth-random-13.jpg", backgroundSrc: "/auth-art/login-background/auth-random-13.jpg", from: "#111a34", mid: "#2c78e8", to: "#cfe5ff", panel: "#0a1025", focus: "48% 54%" },
  { src: "/auth-art/login-optimized/auth-random-14.jpg", backgroundSrc: "/auth-art/login-background/auth-random-14.jpg", from: "#0c1722", mid: "#2f8f72", to: "#d7f6e5", panel: "#07120f", focus: "35% 50%" },
  { src: "/auth-art/login-optimized/auth-random-15.jpg", backgroundSrc: "/auth-art/login-background/auth-random-15.jpg", from: "#121024", mid: "#7a32d6", to: "#e4cdfd", panel: "#0b0818", focus: "43% 50%" },
];

export function getRandomAuthArt() {
  return authArt[Math.floor(Math.random() * authArt.length)];
}
