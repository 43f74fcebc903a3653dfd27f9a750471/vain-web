export const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
      type: "spring",
      stiffness: 50,
      damping: 22,
    },
  },
};

export const heroContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.35,
      type: "spring",
      stiffness: 60,
      damping: 22,
    },
  },
};

export const heroButtonItem = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      ease: [0.25, 0.1, 0.25, 1],
      duration: 0.75,
      opacity: {
        duration: 0.6,
      },
    },
  },
};

export const heroItem = {
  hidden: {
    opacity: 0,
    y: 15,
    filter: "blur(4px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "tween",
      ease: [0.25, 0.1, 0.25, 1],
      duration: 0.75,
      opacity: {
        duration: 0.6,
      },
      filter: {
        duration: 0.55,
      },
    },
  },
};

export const herov2Item = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 22,
      stiffness: 80,
      duration: 0.55,
    },
  },
};
