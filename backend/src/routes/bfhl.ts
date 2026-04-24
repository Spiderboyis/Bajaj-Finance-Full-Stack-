import { Router, Request, Response } from "express";
import { processBfhl } from "../lib/pipeline";
import { ApiResponse } from "../lib/types";

const router = Router();

// Identity credentials
const IDENTITY = {
  user_id: "harshitmathur_03032006",
  email_id: "hm8889@srmist.edu.in",
  college_roll_number: "RA2311053010096",
};

/**
 * POST /bfhl
 * Accepts: { "data": ["A->B", "A->C", ...] }
 * Returns: Full API response with hierarchies, invalid entries, duplicates, and summary.
 */
router.post("/", (req: Request, res: Response) => {
  try {
    const { data } = req.body;

    // Validate request body
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        error: "Invalid request body. Expected { \"data\": [\"A->B\", ...] }",
      });
    }

    // Ensure all entries are strings
    const stringData: string[] = data.map((entry: any) => String(entry));

    // Run the processing pipeline
    const result = processBfhl(stringData);

    // Build the full API response
    const response: ApiResponse = {
      ...IDENTITY,
      ...result,
    };

    return res.json(response);
  } catch (error) {
    console.error("Error processing /bfhl:", error);
    return res.status(500).json({
      error: "Internal server error while processing the request.",
    });
  }
});

export default router;
