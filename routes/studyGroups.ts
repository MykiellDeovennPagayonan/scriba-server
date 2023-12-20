import express from "express";
const router = express.Router();
import { Response, Request, NextFunction } from "express";
import { client } from "../server";

// router.all('/api/*', requireAuthentication)

router.use(logger).post("/new", async (req: Request, res: Response) => {
  const { studyGroupName, studyGroupDescription } = req.body;

  console.log(req.body);
  try {
    const response = await client.query(
      `INSERT INTO study_groups (name, description)
        VALUES ($1, $2)
        `,
      [studyGroupName, studyGroupDescription]
    );
    console.log(response);
    res.json({
      message: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

function logger(req: Request, res: Response, next: NextFunction) {
  console.log(req.originalUrl, "logger");
  next();
}

module.exports = router;
