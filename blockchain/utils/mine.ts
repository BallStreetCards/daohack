import { moveBlocks } from "./move-blocks";

moveBlocks(5)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
